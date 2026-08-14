import { NextResponse } from "next/server";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { clampText, isValidEmail } from "@/lib/validation";
import { reportError } from "@/lib/observability";

export async function POST(req: Request) {
  const limited = rateLimit(req, "feedback", { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const message = clampText(body.message || "", 1000).trim();
    const emailRaw = clampText(body.email || "", 120).trim().toLowerCase();
    const email = isValidEmail(emailRaw) ? emailRaw : "";
    if (message.length < 5) {
      return NextResponse.json({ error: "Escribe un poco más de detalle." }, { status: 400 });
    }
    await notifyOwnerTelegram(`Feedback app${email ? ` · ${email}` : ""}:\n${message}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    await reportError({ where: "api/feedback", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo enviar el feedback. Intenta de nuevo." }, { status: 500 });
  }
}
