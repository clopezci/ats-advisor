import { NextResponse } from "next/server";
import { analyzeAts, type AtsProfile } from "@/lib/ats/engine";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(req, "ats-analyze", { limit: 40, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json();
    const cvText = String(body.cvText || "").trim();
    const jobText = String(body.jobText || "").trim();
    const atsProfile = (body.atsProfile || "generic") as AtsProfile;

    if (cvText.length < 40 || jobText.length < 40) {
      return NextResponse.json(
        { error: "Necesitamos más texto del CV y de la oferta para analizar bien." },
        { status: 400 }
      );
    }

    const result = analyzeAts({ cvText, jobText, atsProfile });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    await reportError({ where: "api/ats/analyze", error });
    return NextResponse.json(
      { error: "No pudimos completar el análisis. Intenta de nuevo en unos segundos." },
      { status: 500 }
    );
  }
}
