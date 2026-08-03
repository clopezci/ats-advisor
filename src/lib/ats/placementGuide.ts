/** Guía de dónde colocar cada keyword faltante (Experiencia vs Skills vs Resumen). */

export type PlacementTip = {
  term: string;
  where: "Experiencia" | "Skills" | "Resumen" | "Educación";
  why: string;
  pattern: string;
};

export function buildPlacementGuide(opts: {
  missingMust: string[];
  missingHard: string[];
  missingSoft: string[];
  sectionHits: { section: string; hits: number }[];
}): PlacementTip[] {
  const tips: PlacementTip[] = [];
  const expHits = opts.sectionHits.find((s) => /experiencia/i.test(s.section))?.hits ?? 0;
  const skillsHits = opts.sectionHits.find((s) => /skills|habilidades/i.test(s.section))?.hits ?? 0;

  for (const term of opts.missingMust.slice(0, 8)) {
    tips.push({
      term,
      where: "Experiencia",
      why: "Los ATS y reclutadores dan más peso a keywords en logros de roles que solo en Skills.",
      pattern: `Verbo + contexto con “${term}” + resultado medible. Ej: “Implementé ${term} en [proceso], reduciendo tiempo X%.”`,
    });
  }

  for (const term of opts.missingHard.slice(0, 8)) {
    const where = skillsHits < 3 ? "Skills" : "Experiencia";
    tips.push({
      term,
      where,
      why:
        where === "Skills"
          ? "Herramientas técnicas deben aparecer literales en Skills para el parse de tags."
          : "Ya tienes Skills densas; refuerza el hard skill dentro de un logro real.",
      pattern:
        where === "Skills"
          ? `En Skills: “${term}” (nivel real: básico/intermedio/avanzado).`
          : `En un bullet: “… usando ${term} para …” + métrica.`,
    });
  }

  for (const term of opts.missingSoft.slice(0, 4)) {
    tips.push({
      term,
      where: expHits < 2 ? "Experiencia" : "Resumen",
      why: "Soft skills sin evidencia parecen relleno; demuéstralas en un logro o en 1 línea del resumen.",
      pattern: `“${term}”: evidencia en un logro (equipo, conflicto, cliente), no solo la palabra suelta.`,
    });
  }

  // Deduplicate by term
  const seen = new Set<string>();
  return tips.filter((t) => {
    const k = t.term.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 14);
}
