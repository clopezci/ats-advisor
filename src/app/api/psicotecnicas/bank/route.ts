import { NextResponse } from "next/server";
import catalog from "@/lib/psicotecnicas/catalog.json";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";

export const runtime = "nodejs";

/**
 * Banco de estudio (fichas + ejercicios): gratis para todos.
 * Lo de pago es /api/psicotecnicas/practica (método IA con perfil/foto).
 */
export async function GET(req: Request) {
  const limited = rateLimit(req, "psico-bank", { limit: 40, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  return NextResponse.json({
    ok: true,
    fichas: catalog.fichas,
    ejercicios: catalog.ejercicios,
  });
}
