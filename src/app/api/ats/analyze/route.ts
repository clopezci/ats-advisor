import { NextResponse } from "next/server";
import { analyzeAts, type AtsProfile } from "@/lib/ats/engine";
import { computeSemanticScore } from "@/lib/ats/embeddings";
import { detectAtsProfile } from "@/lib/ats/detectAts";
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
    const jobUrl = String(body.jobUrl || "").trim();
    let atsProfile = (body.atsProfile || "generic") as AtsProfile;
    const autoDetect = body.autoDetect !== false;

    if (cvText.length < 40 || jobText.length < 40) {
      return NextResponse.json(
        { error: "Necesitamos más texto del CV y de la oferta para analizar bien." },
        { status: 400 }
      );
    }

    const detection = detectAtsProfile({ jobText, jobUrl });
    if (autoDetect && (!body.atsProfile || body.atsProfile === "generic") && detection.confidence !== "low") {
      atsProfile = detection.profile;
    }

    const semantic = await computeSemanticScore(cvText, jobText);
    const result = analyzeAts({
      cvText,
      jobText,
      atsProfile,
      semanticOverride: semantic,
    });

    return NextResponse.json({
      ok: true,
      result,
      detection,
      atsProfileUsed: atsProfile,
    });
  } catch (error) {
    await reportError({ where: "api/ats/analyze", error });
    return NextResponse.json(
      { error: "No pudimos completar el análisis. Intenta de nuevo en unos segundos." },
      { status: 500 }
    );
  }
}
