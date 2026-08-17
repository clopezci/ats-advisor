import type { AtsAnalyzeResult } from "@/lib/ats/engine";

export type ScoreBand = "bajo" | "medio" | "bueno" | "alto";

export type ScoreBlocker = {
  label: string;
  detail: string;
  impact: "alto" | "medio";
};

export type AtsScoreSummary = {
  band: ScoreBand;
  bandLabel: string;
  headline: string;
  whyScore: string[];
  blockers: ScoreBlocker[];
  toReach70: string[];
  toReach85: string[];
};

function bandMeta(score: number): Pick<AtsScoreSummary, "band" | "bandLabel" | "headline"> {
  if (score >= 85) {
    return {
      band: "alto",
      bandLabel: "Alto — muy bien alineado",
      headline:
        "Tu CV encaja fuerte con la oferta. Pulido final y postula con confianza (sin inventar nada).",
    };
  }
  if (score >= 70) {
    return {
      band: "bueno",
      bandLabel: "Bueno — suele verse por reclutadores",
      headline:
        "Superas el umbral típico (~70%). Ajustes menores pueden subir probabilidad de entrevista.",
    };
  }
  if (score >= 50) {
    return {
      band: "medio",
      bandLabel: "Medio — mejorable antes de postular",
      headline:
        "Hay encaje parcial, pero faltan piezas clave. Con los ajustes de abajo puedes subir el puntaje.",
    };
  }
  return {
    band: "bajo",
    bandLabel: "Bajo — poco probable pasar el filtro",
    headline:
      "El ATS vería pocas coincidencias o hay brechas importantes. Prioriza lo de abajo antes de postular masivamente.",
  };
}

/** Resumen en lenguaje claro: por qué el score y qué falta para subirlo. */
export function buildScoreSummary(result: AtsAnalyzeResult): AtsScoreSummary {
  const { band, bandLabel, headline } = bandMeta(result.score);
  const blockers: ScoreBlocker[] = [];

  for (const gap of result.exclusiveGaps) {
    blockers.push({
      label: "Requisito excluyente",
      detail: gap,
      impact: "alto",
    });
  }

  const mustMissing = result.mustHave?.missing || [];
  if (mustMissing.length) {
    blockers.push({
      label: "Must-have sin evidencia en el CV",
      detail: `No aparecen (o no se detectan) requisitos indispensables: ${mustMissing.slice(0, 6).join(", ")}${mustMissing.length > 6 ? "…" : ""}.`,
      impact: "alto",
    });
  }

  if (result.formatAlerts.length) {
    blockers.push({
      label: "Formato que confunde al parser",
      detail: result.formatAlerts[0],
      impact: "medio",
    });
  }

  const hardMissing = result.hardSkills.missing.slice(0, 4);
  if (hardMissing.length) {
    blockers.push({
      label: "Skills técnicas ausentes",
      detail: `Faltan en el CV: ${hardMissing.join(", ")}.`,
      impact: "medio",
    });
  }

  const sections = result.sectionCoverage;
  if (sections && (!sections.experience || !sections.skills)) {
    const miss = [
      !sections.experience ? "Experiencia" : null,
      !sections.skills ? "Skills" : null,
      !sections.education ? "Educación" : null,
      !sections.contact ? "Contacto" : null,
    ].filter(Boolean);
    blockers.push({
      label: "Secciones que el robot no encontró",
      detail: `Revisa que el CV tenga bloques claros: ${miss.join(", ")}.`,
      impact: "medio",
    });
  }

  if (result.semanticScore != null && result.semanticScore < 55 && result.score < 75) {
    blockers.push({
      label: "Poco encaje semántico",
      detail: `El significado del CV y la oferta no calzan del todo (${result.semanticScore}% semántico). Usa el mismo vocabulario del aviso en logros reales.`,
      impact: "medio",
    });
  }

  if (typeof result.authenticityScore === "number" && result.authenticityScore < 60) {
    blockers.push({
      label: "Tono genérico o keyword stuffing",
      detail: "El texto suena poco concreto o muy cargado de palabras clave vacías. Humaniza con logros medibles.",
      impact: "medio",
    });
  }

  const whyScore: string[] = [
    `Puntaje ${result.score}% combina coincidencia de palabras clave de la oferta en tu CV + encaje semántico (${result.semanticScore}%).`,
    `Probabilidad orientativa de entrevista: ${result.interviewProbability}% (no es garantía).`,
  ];

  if (result.mustHave?.matched?.length) {
    whyScore.push(
      `A favor: ya cubres ${result.mustHave.matched.length} must-have (${result.mustHave.matched.slice(0, 4).join(", ")}${result.mustHave.matched.length > 4 ? "…" : ""}).`
    );
  }

  if (blockers.length) {
    whyScore.push(`En contra: ${blockers.slice(0, 3).map((b) => b.label.toLowerCase()).join("; ")}.`);
  } else {
    whyScore.push("No detectamos bloqueos críticos; el puntaje depende sobre todo de profundidad y redacción.");
  }

  const toReach70: string[] = [];
  if (result.score >= 70) {
    toReach70.push("Ya estás en zona visible (~70%+). Revisa ortografía, métricas y alinea el título con la vacante.");
  } else {
    if (result.exclusiveGaps.length) {
      toReach70.push(
        "Decide con honestidad si cumples requisitos excluyentes (idioma, años, título, ciudad). No los inventes en el CV."
      );
    }
    if (mustMissing.length) {
      toReach70.push(
        `Integra must-have que SÍ tengas en viñetas de logro (no solo en Skills): ${mustMissing.slice(0, 5).join(", ")}.`
      );
    }
    if (result.missingKeywords.length) {
      toReach70.push(
        `Teje 5–8 keywords de la oferta en experiencia real: ${result.missingKeywords.slice(0, 6).join(", ")}.`
      );
    }
    if (result.formatAlerts.length) {
      toReach70.push("Pasa a formato 1 columna, texto seleccionable (PDF/DOCX), sin tablas que oculten palabras.");
    }
    if (result.actions.some((a) => /cuantifica/i.test(a))) {
      toReach70.push("Cuantifica al menos 3 logros (%, COP, tiempo, personas, antes/después).");
    }
    toReach70.push("Adapta este CV a ESTA vacante y vuelve a analizar antes de postular.");
  }

  const toReach85: string[] = [];
  if (result.score >= 85) {
    toReach85.push("Mantén coherencia entre CV, formulario del portal y LinkedIn. Postula pronto al aviso.");
  } else {
    toReach85.push("Must-have cubiertos con evidencia en 2+ viñetas (no solo listados).");
    toReach85.push("Resumen profesional alineado al cargo target (primeras 3 líneas).");
    toReach85.push("Skills: top 8–12 términos literales de la oferta que domines.");
    if (result.niceToHave?.missing?.length) {
      toReach85.push(
        `Sumar deseables reales refina el ranking: ${result.niceToHave.missing.slice(0, 4).join(", ")}.`
      );
    }
    toReach85.push("Primera viñeta de cada cargo = logro medible + keyword del rol.");
  }

  return {
    band,
    bandLabel,
    headline,
    whyScore,
    blockers,
    toReach70,
    toReach85,
  };
}
