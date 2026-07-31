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

    const grounded =
      GROUNDED_TASKS.has(rawTask.toLowerCase()) ||
      task === "interview_feedback" ||
      task === "out09_outline" ||
      body.useKnowledge === true;
    const userContent = grounded ? withKnowledgeContext(prompt) : prompt;

    const result = await completeWithCascade({
      task,
      messages: [
        {
          role: "system",
          content:
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
