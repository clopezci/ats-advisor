import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN no configurado" }, { status: 503 });
  }

  const update = await req.json();
  const chatId = update?.message?.chat?.id;
  const text = String(update?.message?.text || "");

  let reply =
    "ATSAdvisor: usa /start para comenzar, /capsula para tu microcápsula del día, /ayuda para opciones.";
  if (text.startsWith("/start")) {
    reply = "Bienvenido a ATSAdvisor. Configura tu canal en la PWA (Mi cuenta) y sigue tu outplacement aquí.";
  } else if (text.startsWith("/capsula")) {
    reply =
      "Cápsula del día: escribe un logro con métrica (%, dinero o tiempo). Luego agrégalo a tu CV y vuelve a analizar con ATSAdvisor.";
  } else if (text.startsWith("/ayuda")) {
    reply = "Comandos: /start /capsula /ayuda. Alertas del sistema llegan al chat del owner.";
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
