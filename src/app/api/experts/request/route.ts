import { NextResponse } from "next/server";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { readSettings } from "@/lib/settings";
import { clampText, escapeHtml } from "@/lib/validation";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { notifyOwnerTelegram, notifyTelegramChat, sendResendEmail } from "@/lib/notify/channels";
import { sendWhatsAppText } from "@/lib/notify/whatsapp";
import { specialtyLabel } from "@/lib/experts/specialties";
import {
  loadExpertOps,
  saveExpertOps,
  newCaseId,
  newConfirmToken,
  type ExpertCase,
} from "@/lib/experts/cases";
import { computeAllyCommission, billingModeClientCopy } from "@/lib/experts/pricing";
import { reportError } from "@/lib/observability";

/**
 * Solicitud a aliado experto → crea caso de conciliación + notifica email/TG/WA.
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";

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
    const caseId = newCaseId();
    const confirmToken = newConfirmToken();
    const commissionPercent =
      typeof ally.commission_percent === "number"
        ? ally.commission_percent
        : s.expert_default_commission_percent;
    const listedPriceCop =
      typeof ally.service_price_cop === "number" && ally.service_price_cop > 0
        ? ally.service_price_cop
        : s.expert_default_service_price_cop;
    const { commissionCop, allyNetCop } = computeAllyCommission(listedPriceCop, commissionPercent);
    const billingMode = s.expert_billing_mode;

    const confirmUrl = `${baseUrl}/outplacement/experto/confirmar?case=${caseId}&token=${confirmToken}`;

    const expertCase: ExpertCase = {
      id: caseId,
      createdAt: new Date().toISOString(),
      allyId: ally.id,
      allyName: ally.name,
      allyEmail: ally.email,
      userName: name,
      userEmail: email,
      userPhone: phone,
      specialty: specialty || ally.specialties[0] || "carrera",
      message,
      status: "requested",
      confirmToken,
      commissionPercent,
      listedPriceCop,
      allyNetCop,
      billingMode,
      notify: {
        email: ally.notify_email !== false,
        telegram: Boolean(ally.notify_telegram && ally.telegram_chat_id),
        whatsapp: Boolean(ally.notify_whatsapp && ally.whatsapp_phone),
      },
    };

    const ops = await loadExpertOps();
    ops.cases = [expertCase, ...ops.cases].slice(0, 2000);
    await saveExpertOps(ops);

    const payHint =
      billingMode === "platform_collect"
        ? `Cliente paga ${listedPriceCop} COP a LOTIC → comisión ${commissionCop} · liquidar aliado ${allyNetCop} COP`
        : `Precio ref. ${listedPriceCop} COP · aliado cobra directo · comisión LOTIC ${commissionPercent}% (${commissionCop} COP)`;

    const summary = [
      `Caso ${caseId}`,
      `Aliado: ${ally.name} <${ally.email}>`,
      `Solicitante: ${name} <${email}>${phone ? ` · ${phone}` : ""}`,
      `Servicio: ${specLabel}`,
      payHint,
      `Mensaje: ${message}`,
      `Confirmar servicio (usuario): ${confirmUrl}`,
    ].join("\n");

    const htmlAlly = `
      <h2>Nueva solicitud ATSAdvisor</h2>
      <p><strong>Caso:</strong> ${escapeHtml(caseId)}</p>
      <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt; ${phone ? `· ${escapeHtml(phone)}` : ""}</p>
      <p><strong>Quiere:</strong> ${escapeHtml(specLabel)}</p>
      <p><strong>Precio listado:</strong> ${listedPriceCop} COP · Comisión ${commissionPercent}% = ${commissionCop} COP · Neto aliado ${allyNetCop} COP</p>
      <p><strong>Modo:</strong> ${escapeHtml(billingModeClientCopy(billingMode))}</p>
      <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(message)}</pre>
      <p>Cuando atiendas al usuario, pídele que confirme el servicio en la app (le llega el enlace).</p>
    `;

    const htmlUser = `
      <p>Hola ${escapeHtml(name)},</p>
      <p>Enviamos tu pedido a <strong>${escapeHtml(ally.name)}</strong> (${escapeHtml(specLabel)}).</p>
      <p><strong>Valor del servicio:</strong> ${listedPriceCop} COP</p>
      <p>${escapeHtml(billingModeClientCopy(billingMode))}</p>
      <p><strong>Importante:</strong> cuando tomes el servicio, confirma aquí:</p>
      <p><a href="${escapeHtml(confirmUrl)}">${escapeHtml(confirmUrl)}</a></p>
      <p>Caso: ${escapeHtml(caseId)}</p>
      <p>Tu mensaje:</p>
      <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
    `;

    let mailedAlly = { ok: false, skipped: true as boolean };
    let mailedUser = { ok: false, skipped: true as boolean };
    let wa = { ok: false, skipped: true as boolean | string };

    if (ally.notify_email !== false) {
      mailedAlly = await sendResendEmail({
        to: ally.email,
        subject: `ATSAdvisor · solicitud ${specLabel} de ${name}`,
        html: htmlAlly,
      });
    }
    mailedUser = await sendResendEmail({
      to: email,
      subject: "Recibimos tu solicitud · confirma el servicio cuando lo tomes",
      html: htmlUser,
    });

    if (ally.notify_telegram !== false && ally.telegram_chat_id) {
      await notifyTelegramChat(ally.telegram_chat_id, summary);
    }
    if (ally.notify_whatsapp !== false && ally.whatsapp_phone) {
      wa = await sendWhatsAppText(
        ally.whatsapp_phone,
        `ATSAdvisor · nueva solicitud\n${summary}`.slice(0, 3500)
      );
    }

    await notifyOwnerTelegram(
      `Experto caso ${caseId}: ${ally.name} ← ${name} (${specLabel}) · ${listedPriceCop} COP · comisión ${commissionCop}`
    );

    return NextResponse.json({
      ok: true,
      caseId,
      confirmUrl,
      listedPriceCop,
      commissionPercent,
      commissionCop,
      allyNetCop,
      billingMode,
      mailedAlly: mailedAlly.ok,
      mailedUser: mailedUser.ok,
      whatsapp: wa.ok,
      message:
        billingMode === "platform_collect"
          ? `Solicitud creada. Valor del servicio: ${listedPriceCop} COP (pagas en ATSAdvisor; LOTIC liquida al aliado). Te enviamos el enlace de confirmación.`
          : `Solicitud creada. Precio de referencia: ${listedPriceCop} COP (pagas al aliado). Confirma el servicio para el corte de comisión.`,
    });
  } catch (e) {
    await reportError({ where: "api/experts/request", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo enviar la solicitud" }, { status: 500 });
  }
}

