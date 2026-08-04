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
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const cvText = String(body.cvText || "").trim();
    const jobText = String(body.jobText || "").trim();
    const jobUrl = String(body.jobUrl || "").trim().slice(0, 500);
    const companyDomain = String(body.companyDomain || "").trim().slice(0, 120);
    const companyName = String(body.companyName || "").trim().slice(0, 120);
    let atsProfile = (body.atsProfile || "generic") as AtsProfile;
    const autoDetect = body.autoDetect !== false;

    if (cvText.length < 40 || jobText.length < 40) {
      return NextResponse.json(
        { error: "Necesitamos más texto del CV y de la oferta para analizar bien." },
        { status: 400 }
      );
    }
    if (cvText.length > 40000 || jobText.length > 30000) {
      return NextResponse.json(
        { error: "Texto demasiado largo. Recorta CV (máx. 40k) u oferta (máx. 30k)." },
        { status: 400 }
      );
    }

    const detection = detectAtsProfile({ jobText, jobUrl, companyDomain, companyName });
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

    if (semantic.warning) {
      result.explanation = [semantic.warning, ...result.explanation];
    }
    if (detection.company) {
      result.explanation = [
        `Empresa detectada: ${detection.company.name} (${detection.company.domain}).`,
        ...result.explanation,
      ];
    }

    return NextResponse.json({
      ok: true,
      result,
      detection,
      atsProfileUsed: atsProfile,
      embeddings: { provider: semantic.provider, cloud: semantic.cloud },
    });
  } catch (error) {
    await reportError({ where: "api/ats/analyze", error });
    return NextResponse.json(
      { error: "No pudimos completar el análisis. Intenta de nuevo en unos segundos." },
      { status: 500 }
    );
  }
}
