import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { clampText } from "@/lib/validation";
import { parseUserKeysFromRequest } from "@/lib/ai/userKeysServer";
import { requirePaidCloud } from "@/lib/entitlements/requirePaidApi";
import { OFF_TOPIC_REPLY, isClearlyOffTopic } from "@/lib/ai/topicScope";

export const runtime = "nodejs";

/** Veredicto local: siempre Sirve. o A mejorar. para que la pantalla no quede muda. */
function scoreReply(userReply: string): { ok: boolean; nudge: string; manager: string } {
  const concrete =
    /\d/.test(userReply) ||
    /\b(hice|lider|defin|implement|coordin|entreg|reduj|aument|organic|propuse|arm[eé]|prioridad|plan|semana|d[ií]a|reun|stakeholder|kpi|okr|piloto|roadmap)\b/i.test(
      userReply
    );
  if (concrete) {
    return {
      ok: true,
      nudge: "Sirve. Hay una acción concreta. Falta cerrar con el entregable de las próximas 48 horas y a quién se lo muestras.",
      manager:
        "Bien, eso se puede trabajar. El lunes, ¿cuál sería el primer entregable de dos horas y a quién se lo mostrarías?",
    };
  }
  return {
    ok: false,
    nudge: "A mejorar. Falta un hecho: qué harías esta semana, con qué alcance (personas, tiempo o antes/después) y cómo sabrías que funcionó.",
    manager:
      "Todavía está general. Dime una acción de esta semana y un alcance: personas, tiempo o antes/después. Sin eso no puedo ayudarte a priorizar.",
  };
}

function normalizeNudge(raw: string, fallback: string): string {
  const t = (raw || "").trim();
  if (/^sirve\b/i.test(t) || /^a mejorar\b/i.test(t)) return t;
  if (!t) return fallback;
  // La IA a veces tipéa sin veredicto: lo etiquetamos.
  if (/falta|mejor|vago|general|adjetivo|concreto|específic/i.test(t)) {
    return `A mejorar. ${t}`;
  }
  return `Sirve. ${t}`;
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "role-review-coach", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const settings = await hydrateSettingsFromCloud();
    const body = await req.json().catch(() => ({}));
    const jobTitle = clampText(body.jobTitle || "", 120).trim();
    const company = clampText(body.company || "", 120).trim();
    const jobText = clampText(body.jobText || "", 3500).trim();
    const focus = clampText(body.focus || "", 200).trim();
    const userReply = clampText(body.userReply || "", 2000).trim();
    const history = Array.isArray(body.history)
      ? body.history
          .slice(-8)
          .map((h: { role?: string; text?: string }) => ({
            role: h.role === "you" ? "you" : "manager",
            text: clampText(String(h.text || ""), 600),
          }))
          .filter((h: { text: string }) => h.text.length > 0)
      : [];

    if (!jobText && !jobTitle) {
      return NextResponse.json(
        { error: "Necesito el cargo o el aviso para simular el 1:1." },
        { status: 400 }
      );
    }

    if (userReply && isClearlyOffTopic(userReply)) {
      return NextResponse.json({
        ok: true,
        manager: OFF_TOPIC_REPLY,
        nudge: "Vuelve al cargo, al aviso o a la práctica de hoy.",
        done: false,
        provider: "local",
        offTopic: true,
      });
    }

    const system = [
      "Eres un manager latinoamericano en un 1:1 corto (no reclutador).",
      "Hablas en español LATAM, frases cortas, tono profesional y directo.",
      "Preguntas por responsabilidades del aviso. Evalúas claridad, no inventas el CV del candidato.",
      "Si el candidato dice que aún está aprendiendo algo, no lo castigues: pide plan concreto.",
      "Si el candidato acaba de responder, el nudge empieza con 'Sirve.' o 'A mejorar.' y dice por qué en una frase (hecho concreto y, si falta, un número).",
      "Responde SOLO JSON: {\"manager\":\"...\",\"nudge\":\"tip corto\",\"done\":false}",
      "done=true solo si ya hubo 4+ turnos útiles y puedes cerrar el 1:1.",
    ].join(" ");

    const prompt = [
      `Cargo: ${jobTitle || "N/D"} · Empresa: ${company || "N/D"}`,
      focus ? `Enfoque del día: ${focus}` : "",
      "Extracto del aviso:",
      jobText.slice(0, 2500) || "(sin texto; usa el cargo)",
      "",
      "Historial:",
      ...history.map((h: { role: string; text: string }) => `${h.role}: ${h.text}`),
      userReply ? `you: ${userReply}` : "(inicio: abre el 1:1 con una pregunta concreta del aviso)",
      "",
      "Devuelve la siguiente intervención del manager en JSON.",
    ]
      .filter(Boolean)
      .join("\n");

    let manager =
      "Empecemos el 1:1. Cuéntame, en 1 minuto, cuál es la responsabilidad del aviso que más impacto tendría esta semana y cómo la atacarías.";
    let nudge = "Cuando respondas, verás aquí si sirve o hay que mejorarla.";
    let done = false;
    let provider = "local";

    const scored = userReply ? scoreReply(userReply) : null;
    if (scored) {
      manager = scored.manager;
      nudge = scored.nudge;
    }

    const userKeys = parseUserKeysFromRequest(req);
    const paid = await requirePaidCloud({ email: body.email, allowLocalDev: false });

    try {
      const ai = await completeWithCascade({
        task: "interview_feedback",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        qualityThreshold: settings.ai_limits.quality_threshold ?? 0.7,
        maxPaidEscalations: paid.ok ? Math.min(1, settings.ai_limits.max_paid_escalations ?? 1) : 0,
        keys: userKeys,
        allowSharedKeys: paid.ok,
      });
      provider = ai.provider;
      const cleaned = ai.text.replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as { manager?: string; nudge?: string; done?: boolean };
      if (parsed.manager?.trim()) manager = parsed.manager.trim();
      if (userReply) {
        nudge = normalizeNudge(parsed.nudge || "", scored?.nudge || "A mejorar. Sé más concreto.");
      } else if (parsed.nudge?.trim()) {
        nudge = parsed.nudge.trim();
      }
      done = Boolean(parsed.done);
    } catch {
      // Ya quedó el veredicto local si había respuesta.
    }

    return NextResponse.json({ ok: true, manager, nudge, done, provider });
  } catch (error) {
    await reportError({ where: "api/role-review/coach", error });
    return NextResponse.json({ error: "No pudimos simular el 1:1." }, { status: 500 });
  }
}
