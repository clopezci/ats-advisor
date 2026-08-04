import { NextResponse } from "next/server";
import { sendResendEmail, notifyOwnerTelegram } from "@/lib/notify/channels";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { escapeHtml, clampText } from "@/lib/validation";
import { reportError } from "@/lib/observability";

export async function POST(req: Request) {
  const limited = rateLimit(req, "habeas", { limit: 5, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const email = clampText(body.email || "", 120).trim();
    const payload = body.payload || {};
    if (!email.includes("@") || email.length < 5) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const raw = JSON.stringify(payload, null, 2).slice(0, 80_000);
    const html = `<pre style="font-family:monospace;white-space:pre-wrap">${escapeHtml(raw)}</pre>`;
    const mail = await sendResendEmail({
      to: email,
      subject: "ATSAdvisor — export Habeas Data",
      html,
    });
    await notifyOwnerTelegram(`Habeas Data solicitado por ${email}`);

    return NextResponse.json({
      ok: true,
      emailed: mail.ok,
      skippedEmail: mail.skipped,
      downloadFallback: true,
      note: "Export incluye datos locales enviados por el cliente. Datos cloud (Supabase) requieren sesión autenticada — ver MANUAL.",
    });
  } catch (e) {
    await reportError({ where: "api/account/habeas", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 });
  }
}
