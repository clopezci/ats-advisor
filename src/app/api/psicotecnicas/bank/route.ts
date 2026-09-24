import { NextResponse } from "next/server";
import catalog from "@/lib/psicotecnicas/catalog.json";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { hasPsicoPracticaCookie } from "@/lib/psicotecnicas/practicaAccess";

export const runtime = "nodejs";

const PAID = new Set(["carrera", "plus", "tester"]);

function planFromCookie(req: Request): string {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)ats_plan=([^;]+)/);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]).toLowerCase();
  } catch {
    return "";
  }
}

/** Banco completo solo con plan Carrera (cookie de entitlement, igual que el resto de la app). */
export async function GET(req: Request) {
  const limited = rateLimit(req, "psico-bank", { limit: 30, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const plan = planFromCookie(req);
  const cookie = req.headers.get("cookie") || "";
  if (!PAID.has(plan) && !hasPsicoPracticaCookie(cookie)) {
    return NextResponse.json(
      {
        error: "El banco completo es del plan Carrera.",
        code: "PAYWALL",
        counts: {
          fichas: catalog.fichas.length,
          ejercicios: catalog.ejercicios.length,
        },
      },
      { status: 402 }
    );
  }

  return NextResponse.json({
    ok: true,
    fichas: catalog.fichas,
    ejercicios: catalog.ejercicios,
  });
}
