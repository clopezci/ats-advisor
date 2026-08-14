import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";
import { OUT09_QUESTIONS } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { retrieveKnowledge } from "@/lib/ai/knowledge";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { clampText, isValidEmail } from "@/lib/validation";
import { getCloudPlanByEmail, isPaidCloudPlan } from "@/lib/payments/entitlementsCloud";

export const runtime = "nodejs";

const BLOCKED = /(hacer\s+bomba|hackear\s+banco|drogas\s+ilegales|pornograf[ií]a\s+infantil)/i;

export async function POST(req: Request) {
  const limited = rateLimit(req, "out09", { limit: 8, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const settings = await hydrateSettingsFromCloud();
    if (!settings.features.out09) {
      return NextResponse.json({ error: "El curso a tu medida está desactivado por el admin." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const skillType = body.skillType === "hard" ? "hard" : "soft";
    const description = clampText(body.description || "", settings.ai_limits.max_out09_prompt_chars || 2000).trim();
    const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
    const email = clampText(body.email || "", 120).trim().toLowerCase();
    const maxChars = settings.ai_limits.max_out09_prompt_chars || 2000;
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    const allowDemo = !isProd && body.allowDemo === true;

    if (description.length < 12) {
      return NextResponse.json({ error: "Describe con más detalle qué quieres mejorar." }, { status: 400 });
    }
    if (description.length > maxChars) {
      return NextResponse.json(
        { error: `Acorta la descripción (máx. ${maxChars} caracteres).` },
        { status: 400 }
      );
    }
    if (BLOCKED.test(description)) {
      await notifyOwnerTelegram(`Curso a medida rechazado (pedido no permitido): ${description.slice(0, 120)}`);
      return NextResponse.json(
        { error: "No podemos generar un curso sobre ese pedido. Elige un objetivo laboral lícito." },
        { status: 400 }
      );
    }

    let allowed = allowDemo;
    if (!allowed && isValidEmail(email)) {
      const cloud = await getCloudPlanByEmail(email);
      allowed = isPaidCloudPlan(cloud?.plan);
    }
    // Fallback no-prod: aceptar plan local solo fuera de producción
    if (!allowed && !isProd) {
      const clientPlan = String(body.plan || "free");
      allowed = isPaidCloudPlan(clientPlan);
    }
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "El curso a tu medida requiere plan Carrera verificado (correo con magic link / pago cloud) y el add-on. Revisa /precios.",
          code: "PAYWALL",
        },
        { status: 402 }
      );
    }

    const qa = OUT09_QUESTIONS.map((q) => `${q.label} → ${answers[q.id] || "N/D"}`).join("\n");
    const kb = retrieveKnowledge(`${skillType} ${description} ${qa}`, 5, 5500);
    const prompt = `Crea un curso personalizado (carrera) en JSON válido con esta forma:
{"title":"...","objective":"...","capsules":[{"day":1,"title":"...","content":"...","quiz":{"question":"...","options":["a","b","c"],"answer":0}}]}
Tipo de habilidad: ${skillType === "hard" ? "técnica (dura)" : "blanda"}.
Pedido del usuario: ${description}
Cuestionario:
${qa}
Base de conocimiento (úsalo para calidad profesional):
${kb}
Reglas: 10 a 14 cápsulas, español LATAM, práctico, sin relleno, alineado al cuestionario. Solo JSON.`;

    const threshold = settings.ai_limits.quality_threshold ?? 0.72;
    const ai = await completeWithCascade({
      task: "out09_outline",
      messages: [
        { role: "system", content: "Generas cursos de microlearning JSON. Solo JSON válido, sin markdown." },
        { role: "user", content: prompt },
      ],
      qualityThreshold: threshold,
      maxPaidEscalations: settings.ai_limits.max_paid_escalations,
    });

    let course;
    try {
      const cleaned = ai.text.replace(/^```json\s*|\s*```$/g, "").trim();
      course = JSON.parse(cleaned);
    } catch {
      if (ai.qualityScore < threshold) {
        await notifyOwnerTelegram(`OUT-09 falló calidad/JSON (score ${ai.qualityScore}). Revisar manualmente.`);
        return NextResponse.json(
          { error: "No logramos un curso con calidad suficiente. Reintenta o escribe a soporte." },
          { status: 503 }
        );
      }
      const retry = await completeWithCascade({
        task: "out09_outline",
        messages: [
          { role: "system", content: "Devuelve SOLO JSON del curso." },
          { role: "user", content: prompt },
        ],
        qualityThreshold: threshold,
      });
      course = JSON.parse(retry.text.replace(/^```json\s*|\s*```$/g, "").trim());
    }

    if (!course?.capsules?.length) {
      return NextResponse.json({ error: "El curso salió incompleto. Reintenta." }, { status: 502 });
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
