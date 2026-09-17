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
      label: "Requisito de la oferta sin evidencia en el CV",
      detail: `No se ve claro en tu CV: ${mustMissing.slice(0, 6).join(", ")}${mustMissing.length > 6 ? "…" : ""}.`,
      impact: "alto",
    });
  }

  if (result.formatAlerts.length) {
    blockers.push({
      label: "Formato que confunde al lector automático",
      detail: result.formatAlerts[0],
      impact: "medio",
    });
  }

  const hardMissing = result.hardSkills.missing.slice(0, 4);
  if (hardMissing.length) {
    blockers.push({
      label: "Habilidades técnicas ausentes",
      detail: `Faltan en el CV: ${hardMissing.join(", ")}.`,
      impact: "medio",
    });
  }

  const sections = result.sectionCoverage;
  if (sections && (!sections.experience || !sections.skills)) {
    const miss = [
      !sections.experience ? "Experiencia" : null,
      !sections.skills ? "Habilidades" : null,
      !sections.education ? "Educación" : null,
      !sections.contact ? "Contacto" : null,
    ].filter(Boolean);
    blockers.push({
      label: "Secciones que no se detectaron bien",
      detail: `Revisa que el CV tenga bloques claros: ${miss.join(", ")}.`,
      impact: "medio",
    });
  }

  if (result.semanticScore != null && result.semanticScore < 55 && result.score < 75) {
    blockers.push({
      label: "Poco encaje de contenido",
      detail: `El CV y la oferta no se parecen mucho (${result.semanticScore}% de solape). Usa el mismo vocabulario del aviso en logros reales.`,
      impact: "medio",
    });
  }

  if (typeof result.authenticityScore === "number" && result.authenticityScore < 60) {
    blockers.push({
      label: "Texto genérico o overloaded de palabras clave",
      detail: "Suena poco concreto. Mejor logros reales con números.",
      impact: "medio",
    });
  }

  const whyScore: string[] = [
    `Puntaje ${result.score}%: coincidencia de términos de la oferta en tu CV + parecido de contenido (${result.semanticScore}%).`,
    `Probabilidad orientativa de entrevista: ${result.interviewProbability}% (no es garantía).`,
  ];

  if (result.mustHave?.matched?.length) {
    whyScore.push(
      `A favor: ya cubres ${result.mustHave.matched.length} requisitos clave (${result.mustHave.matched.slice(0, 4).join(", ")}${result.mustHave.matched.length > 4 ? "…" : ""}).`
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
        `Si de verdad los cumples, hazlos visibles en logros (no solo en la lista de skills): ${mustMissing.slice(0, 5).join(", ")}.`
      );
    }
    if (result.missingKeywords.length) {
      toReach70.push(
        `Menciona en tu experiencia real (si aplica): ${result.missingKeywords.slice(0, 6).join(", ")}.`
      );
    }
    if (result.formatAlerts.length) {
      toReach70.push("Usa una sola columna, texto que se pueda seleccionar, sin tablas que escondan palabras.");
    }
    if (result.actions.some((a) => /números|cuantifica/i.test(a))) {
      toReach70.push("Pon números en al menos 3 logros (%, COP, tiempo, personas).");
    }
    toReach70.push("Adapta este CV a esta vacante y vuelve a analizar antes de postular.");
  }

  const toReach85: string[] = [];
  if (result.score >= 85) {
    toReach85.push("Mantén coherencia entre CV, formulario del portal y LinkedIn. Postula pronto.");
  } else {
    toReach85.push("Que lo indispensable se vea en 2 o más viñetas, no solo listado.");
    toReach85.push("Resumen alineado al cargo (primeras 3 líneas).");
    toReach85.push("Habilidades: 8–12 términos de la oferta que sí domines.");
    if (result.niceToHave?.missing?.length) {
      toReach85.push(
        `Si los tienes, suma deseables: ${result.niceToHave.missing.slice(0, 4).join(", ")}.`
      );
    }
    toReach85.push("Primera viñeta de cada cargo: logro concreto + término del rol.");
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
