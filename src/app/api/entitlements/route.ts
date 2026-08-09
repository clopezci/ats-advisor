import { NextResponse } from "next/server";
import { getCloudPlanByEmail, claimPendingPaymentsForEmail } from "@/lib/payments/entitlementsCloud";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";

/** GET ?email= — lee plan cloud + aplica pending. */
export async function GET(req: Request) {
  const limited = rateLimit(req, "entitlements", { limit: 30, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const email = new URL(req.url).searchParams.get("email")?.trim().toLowerCase() || "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "email requerido" }, { status: 400 });
  }

  const pending = await claimPendingPaymentsForEmail(email);
  const profile = await getCloudPlanByEmail(email);

  return NextResponse.json({
    ok: true,
    plan: profile?.plan || "free",
    out09_used_this_month: profile?.out09_used_this_month ?? 0,
    telegram_chat_id: profile?.telegram_chat_id || null,
    pendingApplied: pending.applied,
    source: profile ? "cloud" : "none",
  });
}
