import { NextResponse } from "next/server";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";

export async function POST(req: Request) {
  const limited = rateLimit(req, "feedback", { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "").trim().slice(0, 1000);
  const email = String(body.email || "").trim();
  if (message.length < 5) {
    return NextResponse.json({ error: "Escribe un poco más de detalle." }, { status: 400 });
  }
  await notifyOwnerTelegram(`Feedback app${email ? ` · ${email}` : ""}:\n${message}`);
  return NextResponse.json({ ok: true });
}
