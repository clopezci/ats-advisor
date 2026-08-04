import { NextResponse } from "next/server";
import { reportError } from "@/lib/observability";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { clampText } from "@/lib/validation";

/** Endpoint dedicado para errores de cliente (no mezcla con feedback humano). */
export async function POST(req: Request) {
  const limited = rateLimit(req, "client-err", { limit: 30, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const where = clampText(body.where || "client", 80);
    const message = clampText(body.message || "error", 500);
    await reportError({
      where: `client:${where}`,
      message,
      severity: "warning",
      notifyOwner: true,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    await reportError({ where: "api/observability/client", error: e });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
