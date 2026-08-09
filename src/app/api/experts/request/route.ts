import { NextResponse } from "next/server";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { readSettings } from "@/lib/settings";
import { clampText, escapeHtml } from "@/lib/validation";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { notifyOwnerTelegram, notifyTelegramChat, sendResendEmail } from "@/lib/notify/channels";
import { specialtyLabel } from "@/lib/experts/specialties";
import { createServiceSupabase } from "@/lib/supabase/client";
import { reportError } from "@/lib/observability";

/**
 * Solicitud a aliado experto.
 * Body: { allyId, name, email, phone?, specialty, message }
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "expert-request", { limit: 8, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    await hydrateSettingsFromCloud();
    const s = readSettings();
    if (!s.features.experts) {
      return NextResponse.json({ error: "Solicitudes a expertos desactivadas." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const allyId = clampText(body.allyId || "", 64);
    const name = clampText(body.name || "", 80).trim();
    const email = clampText(body.email || "", 120).trim().toLowerCase();
    const phone = clampText(body.phone || "", 40).trim();
    const specialty = clampText(body.specialty || "", 40).trim();
    const message = clampText(body.message || "", 2000).trim();

    if (!name || !email.includes("@") || message.length < 12) {
      return NextResponse.json(
        { error: "Nombre, correo válido y mensaje (mín. 12 caracteres) son obligatorios." },
        { status: 400 }
      );
    }

    const ally = (s.allies || []).find((a) => a.id === allyId && a.active);
    if (!ally || !ally.email.includes("@")) {
      return NextResponse.json({ error: "Aliado no disponible. Elige otro o vuelve más tarde." }, { status: 404 });
    }

    const specLabel = specialtyLabel(specialty || ally.specialties[0] || "carrera");
    const summary = [
      `Aliado: ${ally.name} <${ally.email}>`,
      `Solicitante: ${name} <${email}>${phone ? ` · ${phone}` : ""}`,
      `Servicio: ${specLabel}`,
      `Mensaje: ${message}`,
    ].join("\n");

    const html = `
      <h2>Nueva solicitud ATSAdvisor</h2>
      <p><strong>Aliado:</strong> ${escapeHtml(ally.name)}</p>
      <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt; ${phone ? `· ${escapeHtml(phone)}` : ""}</p>
      <p><strong>Quiere:</strong> ${escapeHtml(specLabel)}</p>
      <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(message)}</pre>
      <p style="color:#666;font-size:12px">Responde al correo del solicitante. Este mensaje lo envía ATSAdvisor / LOTIC.</p>
    `;

    const mailAlly = await sendResendEmail({
      to: ally.email,
      subject: `ATSAdvisor · solicitud ${specLabel} de ${name}`,
      html,
    });
    const mailUser = await sendResendEmail({
      to: email,
      subject: "Recibimos tu solicitud de experto · ATSAdvisor",
      html: `<p>Hola ${escapeHtml(name)},</p><p>Enviamos tu pedido a <strong>${escapeHtml(ally.name)}</strong> (${escapeHtml(specLabel)}). Te contactarán pronto.</p><p>Tu mensaje:</p><pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>`,
    });

    if (ally.telegram_chat_id) {
      await notifyTelegramChat(ally.telegram_chat_id, summary);
    }
    await notifyOwnerTelegram(`Experto: ${ally.name} ← ${name} (${specLabel})`);

    const sb = createServiceSupabase();
    if (sb) {
      await sb.from("audit_events").insert({
        kind: "expert_request",
        detail: {
          allyId: ally.id,
          allyEmail: ally.email,
          name,
          email,
          phone: phone || null,
          specialty: specialty || ally.specialties[0],
          message,
          mailedAlly: mailAlly.ok,
          mailedUser: mailUser.ok,
          at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      ok: true,
      mailedAlly: mailAlly.ok,
      mailedUser: mailUser.ok,
      message:
        mailAlly.ok || mailAlly.skipped
          ? "Solicitud enviada. El experto (y tú) recibirán correo si Resend está configurado; también avisamos por Telegram si aplica."
          : "Solicitud registrada; el envío de correo falló — el owner fue notificado por Telegram.",
    });
  } catch (e) {
    await reportError({ where: "api/experts/request", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo enviar la solicitud" }, { status: 500 });
  }
}
