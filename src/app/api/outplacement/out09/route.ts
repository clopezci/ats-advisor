import { readFileSync, existsSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";
import { OUT09_QUESTIONS } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

export const runtime = "nodejs";

function loadKnowledge() {
  const dir = path.join(process.cwd(), "knowledge_base");
  const files = ["outplacement.md", "ats-parsing.md", "star-negociacion.md"];
  return files
    .map((f) => {
      const p = path.join(dir, f);
      return existsSync(p) ? readFileSync(p, "utf8") : "";
    })
    .join("\n\n")
    .slice(0, 6000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const skillType = body.skillType === "hard" ? "hard" : "soft";
    const description = String(body.description || "").trim();
    const answers = body.answers || {};

    if (description.length < 12) {
      return NextResponse.json({ error: "Describe con más detalle qué quieres mejorar." }, { status: 400 });
    }

    const qa = OUT09_QUESTIONS.map((q) => `${q.label} → ${answers[q.id] || "N/D"}`).join("\n");
    const kb = loadKnowledge();
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
  } catch {
    return NextResponse.json(
      { error: "No pudimos generar el curso ahora. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
