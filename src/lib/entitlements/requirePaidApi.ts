import { NextResponse } from "next/server";
import { clampText, isValidEmail } from "@/lib/validation";
import { getCloudPlanByEmail, isPaidCloudPlan } from "@/lib/payments/entitlementsCloud";
import { isOwnerEmail, isTesterEmail } from "@/lib/admin/testers";

export type PaidGateResult =
  | { ok: true; email: string | null; plan: string | null }
  | { ok: false; response: NextResponse };

/**
 * Gate server-side para APIs de Carrera.
 * En producción exige correo con plan cloud pago (salvo allowLocalDev).
 * Dueño / tester whitelist pasan sin pago.
 */
export async function requirePaidCloud(opts: {
  email?: unknown;
  allowLocalDev?: boolean;
  errorMessage?: string;
}): Promise<PaidGateResult> {
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  const email = clampText(opts.email || "", 120).trim().toLowerCase();
  const valid = isValidEmail(email);

  if (valid && (isOwnerEmail(email) || isTesterEmail(email))) {
    return { ok: true, email, plan: "tester" };
  }

  if (valid) {
    const cloud = await getCloudPlanByEmail(email);
    if (isPaidCloudPlan(cloud?.plan)) {
      return { ok: true, email, plan: String(cloud?.plan) };
    }
  }

  if (!isProd && opts.allowLocalDev) {
    return { ok: true, email: valid ? email : null, plan: "dev" };
  }

  return {
    ok: false,
    response: NextResponse.json(
      {
        error:
          opts.errorMessage ||
          "Requiere plan Carrera verificado (correo en cloud). Entra con magic link o completa el pago.",
        code: "PAYWALL",
      },
      { status: 402 }
    ),
  };
}
