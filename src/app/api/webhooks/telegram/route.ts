import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN no configurado" }, { status: 503 });
  }

  const update = await req.json();
  const chatId = update?.message?.chat?.id;
  const text = String(update?.message?.text || "");

  const dayIndex = Math.floor(Date.now() / 86400000) % Math.max(1, OUTPLACEMENT_MODULES.length);
  const mod = OUTPLACEMENT_MODULES[dayIndex];
  const cap = mod.capsules[Math.floor(Date.now() / 86400000) % mod.capsules.length];

  let reply =
    "ATSAdvisor: /start /capsula /progreso /ayuda";
  if (text.startsWith("/start")) {
    reply =
      "Bienvenido a ATSAdvisor. Usa /capsula para tu microaprendizaje del día y sigue la ruta en la PWA.";
  } else if (text.startsWith("/capsula")) {
    reply = `${mod.code} · ${mod.title}\n\n${cap.title}\n${cap.content}`;
  } else if (text.startsWith("/progreso")) {
    reply =
      "Tu progreso detallado está en la PWA (Outplacement → ruta / OUT-09 player). Aquí te enviamos la cápsula diaria.";
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
