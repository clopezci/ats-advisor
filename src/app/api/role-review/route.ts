import { NextResponse } from "next/server";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { clampText } from "@/lib/validation";
import { buildFallbackRoleReviewPlan } from "@/lib/roleReview/prompt";
import type { RoleReviewFamily, RoleReviewLearnTopic, RoleReviewMode } from "@/lib/roleReview/types";
import { detectRoleFamily } from "@/lib/roleReview/templates";

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

  // Cupo mensual por IP (free ≈ 1–2; evita bypass de localStorage)
  const monthly = rateLimit(req, "role-review-month", {
    limit: 3,
    windowMs: 30 * 86_400_000,
  });
  if (!monthly.ok) {
    return NextResponse.json(
      {
        error:
          "Llegaste al tope mensual de planes de repaso gratis. Configura Mi IA en /cuenta/mi-ia o activa Carrera.",
        code: "MONTHLY_ROLE_REVIEW_LIMIT",
      },
      { status: 429, headers: { "Retry-After": String(monthly.retryAfterSec) } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mode = asMode(body.mode);
    const jobTitle = clampText(body.jobTitle || "", 120).trim();
    const jobText = clampText(body.jobText || "", 8000).trim();
    const learnTopics = parseLearnTopics(body.learnTopics);
    const maxDays = Math.min(7, Math.max(3, Number(body.maxDays) || 7));
    const roleFamily = asFamily(body.roleFamily, jobTitle, jobText);

    if (jobText.length < 40) {
      return NextResponse.json(
        { error: "Pega el aviso de la vacante (al menos un párrafo) para armar el repaso." },
        { status: 400 }
      );
    }

    // El plan lo arma el código. La IA no decide si el repaso es válido.
    const plan = buildFallbackRoleReviewPlan({
      mode,
      jobTitle,
      learnTopics,
      jobText,
      roleFamily,
      maxDays,
    });

    if (!plan.days.length || !plan.challenges.length) {
      return NextResponse.json({ error: "No se pudo armar el plan. Reintenta." }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      provider: "local",
      usedPaid: false,
      qualityScore: 1,
      plan: {
        title: plan.title,
        objective: plan.objective,
        mode,
        roleFamily: plan.roleFamily || roleFamily,
        learnTopics,
        days: plan.days,
        challenges: plan.challenges,
        tickets: plan.tickets,
        starBank: plan.starBank,
        week1Checklist: plan.week1Checklist,
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
