import { NextResponse } from "next/server";
import catalog from "@/lib/psicotecnicas/catalog.json";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";

export const runtime = "nodejs";

/** Lectura de fichas: gratis. Los ejercicios y la práctica con IA van aparte. */
export async function GET(req: Request) {
  const limited = rateLimit(req, "psico-fichas", { limit: 30, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);
  return NextResponse.json({
    ok: true,
    fichas: catalog.fichas,
    counts: { fichas: catalog.fichas.length, ejercicios: catalog.ejercicios.length },
  });
}
