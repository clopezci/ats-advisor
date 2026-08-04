import { NextResponse } from "next/server";
import { completeWithCascade, type AiTask } from "@/lib/ai/router";
import { withKnowledgeContext } from "@/lib/ai/knowledge";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";

export const runtime = "nodejs";

const GROUNDED_TASKS = new Set([
  "outplacement",
  "interview",
  "entrevista",
  "rewrite",
  "cultura",
  "filtro",
  "star",
  "negociacion",
  "cv_rewrite",
  "application_advice",
  "ats_suggest",
  "out09_outline",
]);

export async function POST(req: Request) {
  const limited = rateLimit(req, "ai-complete", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json();
    const rawTask = String(body.task || "general");
    const allowed: AiTask[] = [
      "ats_suggest",
      "cv_rewrite",
      "application_advice",
      "out09_outline",
      "out09_capsule",
      "interview_feedback",
      "general",
    ];
    const task: AiTask = (allowed.includes(rawTask as AiTask) ? rawTask : "general") as AiTask;
    const prompt = String(body.prompt || "").trim();
    if (prompt.length < 8) {
      return NextResponse.json({ error: "Escribe un poco más de contexto." }, { status: 400 });
    }
    if (prompt.length > 12000) {
      return NextResponse.json({ error: "Prompt demasiado largo (máx. 12000 caracteres)." }, { status: 400 });
    }

    const grounded =
      GROUNDED_TASKS.has(rawTask.toLowerCase()) ||
      task === "interview_feedback" ||
      task === "out09_outline" ||
      task === "cv_rewrite" ||
      task === "application_advice" ||
      task === "ats_suggest" ||
      body.useKnowledge === true;
    const userContent = grounded ? withKnowledgeContext(prompt) : prompt;

    const systemByTask: Record<string, string> = {
      cv_rewrite:
        "Eres experto en ATS (Workday, Taleo, Greenhouse, Lever, SuccessFactors) y redacción de HV en español LATAM. " +
        "Reescribes el CV tejiendo keywords de la oferta SOLO dentro de experiencia real del texto. " +
        "Nunca inventes cargos, títulos, empresas, fechas ni logros. Si un keyword no encaja con lo escrito, dilo y sugiere cómo adquirirlo o si omitirlo. " +
        "Formato: 1) DISCLAIMER corto, 2) resumen de cambios, 3) CV reescrito completo en texto plano (secciones claras), 4) lista de keywords insertados vs omitidos por honestidad.",
      application_advice:
        "Eres coach de postulaciones LATAM. Das un plan accionable de cómo postular bien a ESTA vacante, " +
        "basado en cómo filtran los ATS (parse → match keywords/semántica → ranking → humano). Español claro, checklist numerado, sin relleno.",
      ats_suggest:
        "Eres coach ATS LATAM. Sugieres reescrituras de viñetas fieles (sin inventar). Explica por qué cada cambio ayuda al parse/match.",
    };

    const result = await completeWithCascade({
      task,
      messages: [
        {
          role: "system",
          content:
            systemByTask[task] ||
            "Eres un coach de empleabilidad hispanohablante (LATAM). Responde en español claro, accionable y honesto. No inventes experiencia del usuario.",
        },
        { role: "user", content: userContent },
      ],
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    await reportError({ where: "api/ai/complete", error, notifyOwner: true });
    return NextResponse.json({ error: "La IA no respondió. Reintenta." }, { status: 500 });
  }
}
