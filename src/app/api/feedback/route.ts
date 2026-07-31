import { NextResponse } from "next/server";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "").trim().slice(0, 1000);
  const email = String(body.email || "").trim();
  if (message.length < 5) {
    return NextResponse.json({ error: "Escribe un poco más de detalle." }, { status: 400 });
  }
  await notifyOwnerTelegram(`Feedback app${email ? ` · ${email}` : ""}:\n${message}`);
  return NextResponse.json({ ok: true });
}
