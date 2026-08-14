import { NextResponse } from "next/server";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { clampText, isValidEmail } from "@/lib/validation";
import {
  claimPendingPaymentsForEmail,
  getCloudPlanByEmail,
  mapPlanHint,
  wasPaymentApproved,
  activatePlanFromPayment,
} from "@/lib/payments/entitlementsCloud";
import { reportError } from "@/lib/observability";

/**
 * Sincroniza plan cloud tras checkout.
 * NO activa por fiat: solo aplica pending o referencia ya aprobada por webhook.
 * Body: { email, reference?, plan? }
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "payments-activate", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const email = clampText(body.email || "", 120).trim().toLowerCase();
    const reference = clampText(body.reference || "", 120).trim();
    const planMatch = reference.match(/^ATS-(carrera|plus|out09_extra)-/i);
    const plan = mapPlanHint(String(body.plan || planMatch?.[1] || ""));

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: true,
          cloud: false,
          message: "Sin correo válido no hay sync cloud. El plan local se activa solo tras pago verificado o demo local.",
        },
        { status: 200 }
      );
    }

    let cloud = null as Awaited<ReturnType<typeof activatePlanFromPayment>> | null;
    if (reference) {
      const approved = await wasPaymentApproved(reference);
      if (!approved) {
        return NextResponse.json(
          {
            ok: false,
            error: "Referencia sin pago aprobado por webhook. Espera confirmación o reclama desde /cuenta.",
            code: "NOT_APPROVED",
          },
          { status: 402 }
        );
      }
      cloud = await activatePlanFromPayment({
        reference,
        planHint: plan,
        email,
        provider: "activate",
        status: "APPROVED",
      });
    }

    const pending = await claimPendingPaymentsForEmail(email);
    const profile = await getCloudPlanByEmail(email);

    return NextResponse.json({
      ok: true,
      plan: profile?.plan || (plan === "out09_extra" ? "carrera" : plan) || null,
      cloud,
      pendingApplied: pending.applied,
      profile,
      message:
        pending.applied || cloud?.ok
          ? "Plan sincronizado desde pagos verificados."
          : "Sin pagos pendientes verificados para este correo.",
    });
  } catch (e) {
    await reportError({ where: "api/payments/activate", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Activación falló" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "email requerido" }, { status: 400 });
  }
  const profile = await getCloudPlanByEmail(email);
  return NextResponse.json({ ok: true, profile });
}
