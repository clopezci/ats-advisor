import { NextResponse } from "next/server";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { clampText } from "@/lib/validation";
import { completePractice } from "@/lib/psicotecnicas/practiceAi";
import {
  PSICO_PRACTICA_MONTHLY_CAP,
  hasPsicoPracticaCookie,
} from "@/lib/psicotecnicas/practicaAccess";
import { assessPracticeQuestion, parseHint, parsePracticeAnswer } from "@/lib/psicotecnicas/practicaScope";

export const runtime = "nodejs";

const PAID_PLANS = new Set(["tester"]);

function planFromCookie(cookie: string): string {
  const m = cookie.match(/(?:^|;\s*)ats_plan=([^;]+)/);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]).toLowerCase();
  } catch {
    return "";
  }
}

function allowedImage(raw: unknown): { mime: string; data: string } | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as { mime?: unknown; data?: unknown };
  const mime = String(o.mime || "");
  const data = String(o.data || "").replace(/\s/g, "");
  if (!/^image\/(jpeg|png|webp)$/.test(mime)) return undefined;
  if (data.length < 80 || data.length > 1_200_000) return undefined;
  if (!/^[A-Za-z0-9+/=]+$/.test(data)) return undefined;
  return { mime, data };
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "psico-practica", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const monthly = rateLimit(req, "psico-practica-month", {
    limit: PSICO_PRACTICA_MONTHLY_CAP,
    windowMs: 30 * 86_400_000,
  });
  if (!monthly.ok) {
    return NextResponse.json(
      {
        error: `Llegaste a ${PSICO_PRACTICA_MONTHLY_CAP} preguntas de este mes. El cupo protege el costo de la IA de pago.`,
        code: "MONTHLY_CAP",
      },
      { status: 429 }
    );
  }

  try {
    const cookie = req.headers.get("cookie") || "";
    const plan = planFromCookie(cookie);
    if (!hasPsicoPracticaCookie(cookie) && !PAID_PLANS.has(plan)) {
      return NextResponse.json(
        {
          error: "La práctica con tu perfil es un add-on de pago. Las fichas se leen gratis.",
          code: "PAYWALL",
        },
        { status: 402 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const modo = body.modo === "pista" || body.modo === "revelar" ? body.modo : "simulacro";
    const pregunta = clampText(body.pregunta || "", 4000).trim();
    const perfil = clampText(body.perfil || "", 12000).trim();
    const image = allowedImage(body.image);
    const hintCount = Math.min(3, Math.max(0, Number(body.hintCount) || 0));
    const previas = Array.isArray(body.previas)
      ? body.previas
          .slice(-6)
          .map((row: { pregunta?: string; respuesta?: string }) => ({
            pregunta: clampText(row?.pregunta || "", 180),
            respuesta: clampText(row?.respuesta || "", 180),
          }))
          .filter((row: { pregunta: string }) => row.pregunta.length > 0)
      : [];

    if (perfil.length < 80) {
      return NextResponse.json(
        { error: "Completa el cuestionario de perfil antes de practicar." },
        { status: 400 }
      );
    }

    const scope = assessPracticeQuestion(pregunta, Boolean(image));
    if (!scope.ok) {
      return NextResponse.json({ ok: true, offTopic: true, text: scope.reply });
    }

    if (modo === "revelar" && hintCount < 3) {
      return NextResponse.json(
        { error: "La respuesta se abre después de 3 pistas." },
        { status: 400 }
      );
    }

    const memoria = previas.map((p: { pregunta: string; respuesta: string }, i: number) => `${i + 1}. ${p.pregunta} → ${p.respuesta}`).join("\n");
    const base = [
      "PERFIL DECLARADO:",
      perfil,
      memoria ? `RESPUESTAS PREVIAS DE ESTA SESIÓN:\n${memoria}` : "",
      pregunta ? `PREGUNTA:\n${pregunta}` : "PREGUNTA: está en la imagen.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const prompt =
      modo === "pista"
        ? `${base}\n\nDevuelve solo:\nPISTA: una pista útil sin decir la opción ni el número final. Pista ${hintCount + 1} de 3.\nTIPO: numerico | abstracto | verbal | personalidad | situacional | otro`
        : `${base}\n\nDevuelve solo:\nRESPUESTA: la opción o el resultado, nada más\nPOR QUÉ: una sola línea\nTIPO: numerico | abstracto | verbal | personalidad | situacional | otro`;

    const raw = await completePractice(prompt, image);
    if (!raw) {
      return NextResponse.json(
        { error: "La IA de pago no respondió. Reintenta en un momento." },
        { status: 503 }
      );
    }

    if (modo === "pista") {
      const hint = parseHint(raw);
      if (!hint) {
        return NextResponse.json(
          { error: "No salió una pista usable. Reintenta." },
          { status: 502 }
        );
      }
      return NextResponse.json({
        ok: true,
        modo,
        pista: hint.pista,
        tipo: hint.tipo,
        numero: hintCount + 1,
        puedeRevelar: hintCount + 1 >= 3,
      });
    }

    const parsed = parsePracticeAnswer(raw);
    if (!parsed) {
      return NextResponse.json(
        { error: "No salió una respuesta usable. Reintenta." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, modo, ...parsed });
  } catch (error) {
    await reportError({ where: "api/psicotecnicas/practica", error });
    return NextResponse.json({ error: "No pudimos practicar esta pregunta." }, { status: 500 });
  }
}
