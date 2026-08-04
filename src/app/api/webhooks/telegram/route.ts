import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { formatCapsuleText } from "@/lib/notify/deliverCapsule";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";

function capsuleForChat(chatId: number) {
  const day = Math.floor(Date.now() / 86400000);
  const seed = Math.abs(chatId) + day;
  const mod = OUTPLACEMENT_MODULES[seed % OUTPLACEMENT_MODULES.length];
  const cap = mod.capsules[seed % mod.capsules.length];
  return { mod, cap };
}

function verifyTelegramSecret(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) {
    // Fail closed in production
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    return !isProd;
  }
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  return Boolean(got && got === expected);
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "tg-webhook", { limit: 60, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  if (!verifyTelegramSecret(req)) {
    return NextResponse.json({ error: "Webhook no autorizado" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN no configurado" }, { status: 503 });
  }

  try {
    const update = await req.json().catch(() => null);
    if (!update || typeof update !== "object") {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const chatId = update?.message?.chat?.id as number | undefined;
    const text = String(update?.message?.text || "");

    const { mod, cap } = capsuleForChat(Number(chatId || 0));

    let reply = "ATSAdvisor: /start /capsula /progreso /ayuda";
    if (text.startsWith("/start")) {
      reply =
        "Bienvenido a ATSAdvisor. Usa /capsula para tu microaprendizaje del día. El progreso detallado vive en la PWA.";
    } else if (text.startsWith("/capsula")) {
      reply = formatCapsuleText({
        moduleCode: mod.code,
        day: cap.day,
        title: cap.title,
        content: cap.content,
        quiz: cap.quiz,
      });
    } else if (text.startsWith("/progreso")) {
      reply = `Hoy te toca ${mod.code} · ${mod.title} (día ${cap.day}/${mod.days}: ${cap.title}).\nCompleta quizzes en la PWA → Outplacement → ruta para guardar progreso unificado.`;
    } else if (text.startsWith("/ayuda")) {
      reply = "Comandos: /start /capsula /progreso /ayuda";
    } else if (text.startsWith("/alerta_owner_test")) {
      // Only owner chat may trigger owner alert
      if (String(chatId) === String(process.env.TELEGRAM_OWNER_CHAT_ID || "")) {
        await notifyOwnerTelegram("Test de alerta desde bot Telegram");
        reply = "Alerta enviada al owner.";
      } else {
        reply = "Comando solo disponible para el owner.";
      }
    }

    if (chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: reply }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    await reportError({ where: "api/webhooks/telegram", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Error procesando update" }, { status: 500 });
  }
}
