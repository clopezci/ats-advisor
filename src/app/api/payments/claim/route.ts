import { NextResponse } from "next/server";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { clampText, isValidEmail } from "@/lib/validation";
import {
  activatePlanFromPayment,
  claimPendingPaymentsForEmail,
  mapPlanHint,
  wasPaymentApproved,
} from "@/lib/payments/entitlementsCloud";
import { reportError } from "@/lib/observability";

/**
 * Reclama plan cloud tras pago verificado (webhook) o pending guardado.
 * Body: { email, reference?, plan? }
 * Con reference: solo si hubo payment_approved / entitlement previo.
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "payments-claim", { limit: 12, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const email = clampText(body.email || "", 120).trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const reference = clampText(body.reference || "", 120).trim();
    const planHint = mapPlanHint(String(body.plan || "")) || null;

    let direct = null as Awaited<ReturnType<typeof activatePlanFromPayment>> | null;
    if (reference) {
      const approved = await wasPaymentApproved(reference);
      if (!approved) {
        return NextResponse.json(
          {
            ok: false,
            error: "Esa referencia no tiene pago aprobado. Espera el webhook o contacta soporte.",
            code: "NOT_APPROVED",
          },
          { status: 402 }
        );
      }
      direct = await activatePlanFromPayment({
        reference,
        planHint: planHint || mapPlanHint(reference.match(/^ATS-(carrera|plus|out09_extra)-/i)?.[1] || ""),
        email,
        provider: "claim",
        status: "APPROVED",
      });
    }

    const pending = await claimPendingPaymentsForEmail(email);

    return NextResponse.json({
      ok: true,
      direct,
      pendingApplied: pending.applied,
      message:
        pending.applied || direct?.ok
          ? "Plan sincronizado. Recarga la app o ve a /cuenta."
          : "No había pagos pendientes verificados para ese correo. Si acabas de pagar, espera el webhook.",
    });
  } catch (e) {
    await reportError({ where: "api/payments/claim", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo reclamar el pago" }, { status: 500 });
  }
}
