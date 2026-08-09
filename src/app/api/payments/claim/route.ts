import { NextResponse } from "next/server";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { clampText } from "@/lib/validation";
import {
  activatePlanFromPayment,
  claimPendingPaymentsForEmail,
  mapPlanHint,
} from "@/lib/payments/entitlementsCloud";
import { reportError } from "@/lib/observability";

/**
 * Reclama plan cloud tras pago (magic link / correo conocido).
 * Body: { email, reference?, plan? }
 * También aplica pending_profile / pending_email.
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "payments-claim", { limit: 12, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const email = clampText(body.email || "", 120).trim().toLowerCase();
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const reference = clampText(body.reference || "", 120).trim();
    const planHint = mapPlanHint(String(body.plan || "")) || null;

    let direct = null as Awaited<ReturnType<typeof activatePlanFromPayment>> | null;
    if (reference && planHint) {
      direct = await activatePlanFromPayment({
        reference,
        planHint,
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
          : "No había pagos pendientes para ese correo. Si acabas de pagar, espera el webhook o contacta soporte.",
    });
  } catch (e) {
    await reportError({ where: "api/payments/claim", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo reclamar el pago" }, { status: 500 });
  }
}
