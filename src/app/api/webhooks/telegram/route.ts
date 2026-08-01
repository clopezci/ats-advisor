import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { formatCapsuleText } from "@/lib/notify/deliverCapsule";

function capsuleForChat(chatId: number) {
  const day = Math.floor(Date.now() / 86400000);
  // Stable rotation per chat so two users don't always get identical day if desired
  const seed = Math.abs(chatId) + day;
  const mod = OUTPLACEMENT_MODULES[seed % OUTPLACEMENT_MODULES.length];
  const cap = mod.capsules[seed % mod.capsules.length];
  return { mod, cap };
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN no configurado" }, { status: 503 });
  }

  const update = await req.json();
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
    await notifyOwnerTelegram("Test de alerta desde bot Telegram");
    reply = "Alerta enviada al owner (si TELEGRAM_OWNER_CHAT_ID está configurado).";
  }

  if (chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply }),
    });
  }

  return NextResponse.json({ ok: true });
}
