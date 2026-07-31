import { NextResponse } from "next/server";
import { sendResendEmail, notifyOwnerTelegram } from "@/lib/notify/channels";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const payload = body.payload || {};
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const html = `<pre style="font-family:monospace;white-space:pre-wrap">${JSON.stringify(payload, null, 2)}</pre>`;
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
    });
  } catch {
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 });
  }
}
