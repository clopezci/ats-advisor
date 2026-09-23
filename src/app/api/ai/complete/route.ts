import { NextResponse } from "next/server";
import { completeWithCascade, type AiTask } from "@/lib/ai/router";
import { withKnowledgeContext, careerCoachSystemPrompt } from "@/lib/ai/knowledge";
import { getCoachPersona, coachPersonaSystemPrompt } from "@/lib/coaches/personas";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { clampText } from "@/lib/validation";
import { requirePaidCloud } from "@/lib/entitlements/requirePaidApi";
import { hasAnyUserKey, parseUserKeysFromRequest } from "@/lib/ai/userKeysServer";
import { isLeakedAiFallback } from "@/lib/ats/localAiFallbacks";
import { assessTopicScope } from "@/lib/ai/topicScope";
import { readSettings } from "@/lib/settings";

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

/** Tareas permitidas sin plan cloud (ATS gratis + límites de rate). */
const FREE_AI_TASKS = new Set<AiTask>(["ats_suggest", "cv_rewrite", "application_advice", "general"]);

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
    const prompt = clampText(body.prompt || "", 12000).trim();
    if (prompt.length < 8) {
      return NextResponse.json({ error: "Escribe un poco más de contexto." }, { status: 400 });
    }
    if (prompt.length > 12000) {
      return NextResponse.json({ error: "Prompt demasiado largo (máx. 12000 caracteres)." }, { status: 400 });
    }

    const coachModuleEarly = clampText(body.coachModule || "", 80);
    const scope = assessTopicScope({
      task,
      coachModule: coachModuleEarly,
      prompt,
    });
    if (!scope.ok) {
      return NextResponse.json({
        ok: true,
        text: scope.reply,
        provider: "local",
        model: "topic-scope",
        usedPaid: false,
        qualityScore: 1,
        offTopic: true,
      });
    }

    const userKeys = parseUserKeysFromRequest(req);
    const hasByok = hasAnyUserKey(userKeys);
    const settings = readSettings();

    // Plan pago → puede usar claves de la app + escalado.
    // Plan gratis → SOLO BYOK (o local). No quemar cupo Groq/OpenAI del dueño.
    let allowSharedKeys = false;
    let maxPaidEscalations = 0;

    if (!FREE_AI_TASKS.has(task)) {
      const gate = await requirePaidCloud({
        email: body.email,
        allowLocalDev: true,
        errorMessage:
          "Esta IA requiere plan Carrera con correo verificado en cloud. Entra a /cuenta o /precios.",
      });
      if (!gate.ok) return gate.response;
      allowSharedKeys = true;
      maxPaidEscalations = settings.ai_limits.max_paid_escalations;
    } else {
      const paid = await requirePaidCloud({
        email: body.email,
        allowLocalDev: false,
      });
      if (paid.ok) {
        allowSharedKeys = true;
        maxPaidEscalations = settings.ai_limits.max_paid_escalations;
      } else if (hasByok) {
        allowSharedKeys = false;
        // Con BYOK no escalamos a APIs de pago de la app
        maxPaidEscalations = 0;
      } else {
        allowSharedKeys = false;
        maxPaidEscalations = 0;
      }
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
        "basado en cómo filtran los ATS (parse → match keywords/semántica → ranking → humano). Español claro, checklist numerado, sin relleno. " +
        "Recuerda mix de canales: red, portal de la empresa y portales generales.",
      ats_suggest:
        "Eres coach ATS LATAM. Sugieres reescrituras de viñetas fieles (sin inventar). Explica por qué cada cambio ayuda al parse/match.",
      interview_feedback: careerCoachSystemPrompt("entrevistas"),
    };

    const coachModule = clampText(body.coachModule || "", 80);
    const coachPersonaId = clampText(body.coachPersona || "", 40);
    const persona = coachPersonaId ? getCoachPersona(coachPersonaId) : null;

    const defaultSystem = persona
      ? coachPersonaSystemPrompt(persona)
      : grounded || coachModule
        ? careerCoachSystemPrompt(coachModule || undefined)
        : "Eres un coach de empleabilidad hispanohablante (LATAM). Responde en español claro, accionable y honesto. No inventes experiencia del usuario.";

    const result = await completeWithCascade({
      task,
      messages: [
        {
          role: "system",
          content: systemByTask[task] || defaultSystem,
        },
        { role: "user", content: userContent },
      ],
      keys: userKeys,
      allowSharedKeys,
      maxPaidEscalations,
    });

    let text = result.text;
    // Nunca devolver marcadores crudos ni prompts filtrados a coaches / UI genérica
    if (/^ATS_LOCAL_/.test(text.trim()) || isLeakedAiFallback(text)) {
      text =
        "No hay IA online en este momento. Configura tu clave gratis en /cuenta/mi-ia (Groq o Gemini) " +
        "o usa las plantillas locales del analizador ATS (carta, tips y parche de CV).";
    }

    return NextResponse.json({
      ok: true,
      ...result,
      text,
      byok: hasByok,
      usedSharedKeys: allowSharedKeys && !hasByok,
      coachPersona: persona?.id,
      coachName: persona?.name,
      hintMiIa: !hasByok && !allowSharedKeys ? "/cuenta/mi-ia" : undefined,
    });
  } catch (error) {
    await reportError({ where: "api/ai/complete", error, notifyOwner: true });
    return NextResponse.json({ error: "La IA no respondió. Reintenta." }, { status: 500 });
  }
}
