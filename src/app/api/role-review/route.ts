import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { clampText } from "@/lib/validation";
import { buildFallbackRoleReviewPlan, buildRoleReviewPrompt } from "@/lib/roleReview/prompt";
import type { RoleReviewFamily, RoleReviewLearnTopic, RoleReviewMode } from "@/lib/roleReview/types";
import { detectRoleFamily } from "@/lib/roleReview/templates";
import { parseUserKeysFromRequest } from "@/lib/ai/userKeysServer";
import { requirePaidCloud } from "@/lib/entitlements/requirePaidApi";

export const runtime = "nodejs";

function asMode(v: unknown): RoleReviewMode {
  const s = String(v || "");
  if (s === "total" || s === "entrevista" || s === "dia1" || s === "refuerzo") return s;
  return "refuerzo";
}

function asFamily(v: unknown, jobTitle: string, jobText: string): RoleReviewFamily {
  const s = String(v || "");
  if (
    s === "tech" ||
    s === "data" ||
    s === "finanzas" ||
    s === "ops" ||
    s === "comercial" ||
    s === "general"
  ) {
    return s;
  }
  return detectRoleFamily(jobTitle, jobText);
}

function parseLearnTopics(raw: unknown): RoleReviewLearnTopic[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const o = row as Record<string, unknown>;
      const term = clampText(String(o.term || ""), 80).trim();
      if (term.length < 2) return null;
      const source =
        o.source === "ats_hard" || o.source === "manual" || o.source === "ats_missing"
          ? o.source
          : "manual";
      return {
        term,
        optIn: o.optIn !== false,
        source,
      } as RoleReviewLearnTopic;
    })
    .filter(Boolean) as RoleReviewLearnTopic[];
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "role-review", { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const settings = await hydrateSettingsFromCloud();
    const body = await req.json().catch(() => ({}));
    const mode = asMode(body.mode);
    const minutesPerDay = Math.min(60, Math.max(15, Number(body.minutesPerDay) || 30));
    const jobTitle = clampText(body.jobTitle || "", 120).trim();
    const company = clampText(body.company || "", 120).trim();
    const jobText = clampText(body.jobText || "", 8000).trim();
    const learnTopics = parseLearnTopics(body.learnTopics);
    const knownStrengths = Array.isArray(body.knownStrengths)
      ? body.knownStrengths.map((s: unknown) => clampText(String(s), 60)).filter(Boolean).slice(0, 20)
      : [];
    const maxDays = Math.min(7, Math.max(3, Number(body.maxDays) || 7));
    const roleFamily = asFamily(body.roleFamily, jobTitle, jobText);

    if (jobText.length < 40) {
      return NextResponse.json(
        { error: "Pega el aviso de la vacante (al menos un párrafo) para armar el repaso." },
        { status: 400 }
      );
    }

    const optInCount = learnTopics.filter((t) => t.optIn).length;
    if (mode === "refuerzo" && optInCount === 0 && knownStrengths.length === 0) {
      // ok: still can map responsibilities from JD
    }

    const prompt = buildRoleReviewPrompt({
      mode,
      minutesPerDay,
      jobTitle,
      company,
      jobText,
      learnTopics,
      knownStrengths,
      roleFamily,
      maxDays,
    });

    const threshold = settings.ai_limits.quality_threshold ?? 0.72;
    let parsed: {
      title?: string;
      objective?: string;
      roleFamily?: string;
      days?: unknown[];
      challenges?: unknown[];
      tickets?: unknown[];
      starBank?: unknown[];
      week1Checklist?: unknown[];
    } | null = null;
    let provider = "local";
    let usedPaid = false;
    let qualityScore = 0.5;

    const userKeys = parseUserKeysFromRequest(req);
    const paid = await requirePaidCloud({ email: body.email, allowLocalDev: false });
    const allowSharedKeys = paid.ok;
    const maxPaidEscalations = paid.ok ? settings.ai_limits.max_paid_escalations : 0;

    try {
      const ai = await completeWithCascade({
        task: "role_review",
        messages: [
          {
            role: "system",
            content:
              "Generas planes de repaso del rol en JSON. Español LATAM corto. Solo JSON válido, sin markdown.",
          },
          { role: "user", content: prompt },
        ],
        qualityThreshold: threshold,
        maxPaidEscalations,
        keys: userKeys,
        allowSharedKeys,
      });
      provider = ai.provider;
      usedPaid = ai.usedPaid;
      qualityScore = ai.qualityScore;
      const cleaned = ai.text.replace(/^```json\s*|\s*```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = null;
    }

    const fallback = buildFallbackRoleReviewPlan({
      mode,
      jobTitle,
      learnTopics,
      jobText,
      roleFamily,
      maxDays,
    });

    const days = Array.isArray(parsed?.days) && parsed!.days!.length ? parsed!.days : fallback.days;
    const challenges =
      Array.isArray(parsed?.challenges) && parsed!.challenges!.length
        ? parsed!.challenges
        : fallback.challenges;
    const tickets =
      Array.isArray(parsed?.tickets) && parsed!.tickets!.length ? parsed!.tickets : fallback.tickets;
    const starBank =
      Array.isArray(parsed?.starBank) && parsed!.starBank!.length
        ? parsed!.starBank
        : fallback.starBank;
    const week1Checklist =
      Array.isArray(parsed?.week1Checklist) && parsed!.week1Checklist!.length
        ? parsed!.week1Checklist
        : fallback.week1Checklist;

    if (!days.length || !challenges.length) {
      return NextResponse.json({ error: "No se pudo armar el plan. Reintenta." }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      provider,
      usedPaid,
      qualityScore,
      plan: {
        title: String(parsed?.title || fallback.title),
        objective: String(parsed?.objective || fallback.objective),
        mode,
        roleFamily: parsed?.roleFamily || fallback.roleFamily || roleFamily,
        learnTopics,
        days,
        challenges,
        tickets,
        starBank,
        week1Checklist,
      },
    });
  } catch (error) {
    await reportError({ where: "api/role-review", error, notifyOwner: true });
    return NextResponse.json(
      { error: "No pudimos generar el repaso ahora. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
