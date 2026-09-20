import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { clampText } from "@/lib/validation";

export const runtime = "nodejs";

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

    const system = [
      "Eres un manager latinoamericano en un 1:1 corto (no reclutador).",
      "Hablas en español LATAM, frases cortas, tono profesional y directo.",
      "Preguntas por responsabilidades del aviso. Evalúas claridad, no inventas el CV del candidato.",
      "Si el candidato dice que aún está aprendiendo algo, no lo castigues: pide plan concreto.",
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
    let nudge = "Sé concreto: entregable, no adjetivos.";
    let done = false;
    let provider = "local";

    try {
      const ai = await completeWithCascade({
        task: "interview_feedback",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        qualityThreshold: settings.ai_limits.quality_threshold ?? 0.7,
        maxPaidEscalations: Math.min(1, settings.ai_limits.max_paid_escalations ?? 1),
      });
      provider = ai.provider;
      const cleaned = ai.text.replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as { manager?: string; nudge?: string; done?: boolean };
      if (parsed.manager?.trim()) manager = parsed.manager.trim();
      if (parsed.nudge?.trim()) nudge = parsed.nudge.trim();
      done = Boolean(parsed.done);
    } catch {
      if (userReply) {
        manager =
          "Gracias. Ahora aterrízalo: ¿qué harías el lunes en las primeras 2 horas, y a quién le pedirías contexto?";
        nudge = "Si aún lo estás aprendiendo, dilo y propone un mini-ejercicio.";
      }
    }

    return NextResponse.json({ ok: true, provider, manager, nudge, done });
  } catch (error) {
    await reportError({ where: "api/role-review/coach", error, notifyOwner: true });
    return NextResponse.json({ error: "No pude simular el 1:1 ahora." }, { status: 500 });
  }
}
