import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";
import { OUT09_QUESTIONS } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { loadKnowledgeBase } from "@/lib/ai/knowledge";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(req, "out09", { limit: 8, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json();
    const skillType = body.skillType === "hard" ? "hard" : "soft";
    const description = String(body.description || "").trim();
    const answers = body.answers || {};
    const plan = String(body.plan || "free");

    if (description.length < 12) {
      return NextResponse.json({ error: "Describe con más detalle qué quieres mejorar." }, { status: 400 });
    }

    // Soft server gate: free without demo flag is rejected (client also enforces entitlements)
    if (plan === "free" && body.allowDemo !== true) {
      return NextResponse.json(
        {
          error: "OUT-09 requiere plan Carrera/Plus o compra extra. Revisa /precios.",
          code: "PAYWALL",
        },
        { status: 402 }
      );
    }

    const qa = OUT09_QUESTIONS.map((q) => `${q.label} → ${answers[q.id] || "N/D"}`).join("\n");
    const kb = loadKnowledgeBase();
    const prompt = `Crea un curso OUT-09 personalizado en JSON válido con esta forma:
{"title":"...","objective":"...","capsules":[{"day":1,"title":"...","content":"...","quiz":{"question":"...","options":["a","b","c"],"answer":0}}]}
Tipo de habilidad: ${skillType === "hard" ? "técnica (dura)" : "blanda"}.
Pedido del usuario: ${description}
Cuestionario:
${qa}
Base de conocimiento (úsalo para calidad profesional):
${kb}
Reglas: 10 a 14 cápsulas, español LATAM, práctico, sin relleno, alineado al cuestionario. Solo JSON.`;

    const ai = await completeWithCascade({
      task: "out09_outline",
      messages: [
        { role: "system", content: "Generas cursos de microlearning JSON. Solo JSON válido, sin markdown." },
        { role: "user", content: prompt },
      ],
      qualityThreshold: 0.72,
    });

    let course;
    try {
      const cleaned = ai.text.replace(/^```json\s*|\s*```$/g, "").trim();
      course = JSON.parse(cleaned);
    } catch {
      const retry = await completeWithCascade({
        task: "out09_outline",
        messages: [
          { role: "system", content: "Devuelve SOLO JSON del curso." },
          { role: "user", content: prompt },
        ],
      });
      course = JSON.parse(retry.text.replace(/^```json\s*|\s*```$/g, "").trim());
    }

    if (ai.usedPaid) {
      await notifyOwnerTelegram(`OUT-09 escaló a IA de pago (calidad ${ai.qualityScore})`);
    }

    return NextResponse.json({
      ok: true,
      code: "OUT-09",
      skillType,
      provider: ai.provider,
      usedPaid: ai.usedPaid,
      qualityScore: ai.qualityScore,
      course,
    });
  } catch (error) {
    await reportError({ where: "api/outplacement/out09", error, notifyOwner: true });
    return NextResponse.json(
      { error: "No pudimos generar el curso ahora. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
