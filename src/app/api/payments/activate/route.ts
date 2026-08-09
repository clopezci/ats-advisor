import { NextResponse } from "next/server";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { clampText } from "@/lib/validation";
import {
  activatePlanFromPayment,
  claimPendingPaymentsForEmail,
  getCloudPlanByEmail,
  mapPlanHint,
} from "@/lib/payments/entitlementsCloud";
import { reportError } from "@/lib/observability";

/**
 * Activa / sincroniza plan tras checkout.
 * Preferir webhook; este endpoint cubre claim manual + lectura cloud.
 * Body: { email, reference?, plan?, mode?: "client" | "claim" }
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

    if (!plan) {
      return NextResponse.json({ error: "Plan o referencia inválidos" }, { status: 400 });
    }

    // Activación local-only (demo sin email): el cliente usa setPlan
    if (!email.includes("@")) {
      return NextResponse.json({
        ok: true,
        plan: plan === "out09_extra" ? "carrera" : plan,
        cloud: false,
        message: "Activa el plan en el cliente con setPlan. Con email + Supabase se sincroniza cloud.",
      });
    }

    let cloud = null as Awaited<ReturnType<typeof activatePlanFromPayment>> | null;
    if (reference) {
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
      plan: plan === "out09_extra" ? "carrera" : plan,
      cloud,
      pendingApplied: pending.applied,
      profile,
      message: "Si el perfil existe en Supabase, el plan quedó en cloud. Si no, queda pending hasta magic link.",
    });
  } catch (e) {
    await reportError({ where: "api/payments/activate", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Activación falló" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  if (!email.includes("@")) {
    return NextResponse.json({ error: "email requerido" }, { status: 400 });
  }
  const profile = await getCloudPlanByEmail(email);
  return NextResponse.json({ ok: true, profile });
}
