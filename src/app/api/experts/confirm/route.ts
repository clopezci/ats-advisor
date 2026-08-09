import { NextResponse } from "next/server";
import { clampText } from "@/lib/validation";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import {
  loadExpertOps,
  saveExpertOps,
  computeCommission,
} from "@/lib/experts/cases";
import { notifyOwnerTelegram, sendResendEmail } from "@/lib/notify/channels";
import { escapeHtml } from "@/lib/validation";
import { reportError } from "@/lib/observability";

/** GET ?case=&token= — datos públicos del caso para el formulario de confirmación. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const caseId = url.searchParams.get("case") || "";
  const token = url.searchParams.get("token") || "";
  const ops = await loadExpertOps();
  const c = ops.cases.find((x) => x.id === caseId && x.confirmToken === token);
  if (!c) return NextResponse.json({ error: "Caso no encontrado o token inválido" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    case: {
      id: c.id,
      allyName: c.allyName,
      specialty: c.specialty,
      status: c.status,
      createdAt: c.createdAt,
      userName: c.userName,
      commissionPercent: c.commissionPercent,
      listedPriceCop: c.listedPriceCop,
      billingMode: c.billingMode,
      confirmedAt: c.confirmedAt,
      amountPaidCop: c.amountPaidCop,
      serviceDate: c.serviceDate,
      proofNote: c.proofNote,
      commissionCop: c.commissionCop,
      allyNetCop: c.allyNetCop,
    },
  });
}

/**
 * Usuario confirma que tomó el servicio (prueba para comisión).
 * Body: { caseId, token, serviceDate, amountPaidCop, proofNote }
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "expert-confirm", { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const caseId = clampText(body.caseId || "", 64);
    const token = clampText(body.token || "", 80);
    const serviceDate = clampText(body.serviceDate || "", 16);
    const amountPaidCop = Math.max(0, Math.round(Number(body.amountPaidCop) || 0));
    const proofNote = clampText(body.proofNote || "", 1000).trim();
    const dispute = Boolean(body.dispute);

    const ops = await loadExpertOps();
    const idx = ops.cases.findIndex((x) => x.id === caseId && x.confirmToken === token);
    if (idx < 0) {
      return NextResponse.json({ error: "Caso no encontrado o token inválido" }, { status: 404 });
    }
    const c = ops.cases[idx];
    if (c.status === "settled") {
      return NextResponse.json({ error: "Este caso ya entró en un corte de comisión." }, { status: 409 });
    }

    if (dispute) {
      ops.cases[idx] = {
        ...c,
        status: "disputed",
        proofNote: proofNote || c.proofNote,
        confirmedAt: new Date().toISOString(),
      };
      await saveExpertOps(ops);
      await notifyOwnerTelegram(`Caso ${caseId} marcado en disputa por el usuario`);
      return NextResponse.json({ ok: true, status: "disputed" });
    }

    if (amountPaidCop <= 0) {
      return NextResponse.json(
        { error: "Indica cuánto pagaste al aliado (COP) — es la base de la comisión." },
        { status: 400 }
      );
    }

    const commissionCop = computeCommission(amountPaidCop, c.commissionPercent);
    const allyNetCop = Math.max(0, amountPaidCop - commissionCop);
    ops.cases[idx] = {
      ...c,
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
      serviceDate: serviceDate || new Date().toISOString().slice(0, 10),
      amountPaidCop,
      proofNote,
      commissionCop,
      allyNetCop,
    };
    await saveExpertOps(ops);

    await notifyOwnerTelegram(
      `✓ Servicio confirmado ${caseId} · ${c.allyName} · pagó ${amountPaidCop} COP · comisión ${commissionCop} COP (${c.commissionPercent}%)`
    );
    await sendResendEmail({
      to: c.allyEmail,
      subject: `ATSAdvisor · usuario confirmó servicio ${caseId}`,
      html: `<p>El usuario <strong>${escapeHtml(c.userName)}</strong> confirmó el servicio.</p>
        <p>Monto declarado: ${amountPaidCop} COP · Comisión LOTIC: ${commissionCop} COP (${c.commissionPercent}%).</p>
        <p>Nota: ${escapeHtml(proofNote || "—")}</p>`,
    });

    return NextResponse.json({
      ok: true,
      status: "confirmed",
      commissionCop,
      message: "Gracias. Quedó registrada la prueba del servicio para el corte semanal de comisiones.",
    });
  } catch (e) {
    await reportError({ where: "api/experts/confirm", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo confirmar" }, { status: 500 });
  }
}
