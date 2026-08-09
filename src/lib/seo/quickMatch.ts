/**
 * Match rápido SEO (cliente o API ligera) — overlap de tokens + skills.
 * No reemplaza el motor ATS completo; es adquisición / preview.
 */

const STOP = new Set(
  "el la los las un una de del al a y o en por para con sin que se su sus mi tus te lo le les es son fue ser estar este esta esto esos esas como más mas muy ya si no o u e".split(
    " "
  )
);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9áéíóúñü\s+#.]/gi, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export type QuickMatchResult = {
  score: number;
  matched: string[];
  missing: string[];
  tip: string;
};

export function quickMatch(cvText: string, jobText: string): QuickMatchResult {
  const cv = new Set(tokens(cvText));
  const job = tokens(jobText);
  const jobUnique = Array.from(new Set(job));
  if (jobUnique.length < 5 || cv.size < 5) {
    return {
      score: 0,
      matched: [],
      missing: [],
      tip: "Pega al menos un párrafo del CV y de la oferta para calcular.",
    };
  }
  const matched: string[] = [];
  const missing: string[] = [];
  for (const t of jobUnique) {
    if (cv.has(t)) matched.push(t);
    else if (t.length > 3) missing.push(t);
  }
  const denom = Math.max(1, matched.length + Math.min(missing.length, 40));
  const score = Math.round((matched.length / denom) * 100);
  const tip =
    score >= 70
      ? "Buen solapamiento léxico. Sigue con el análisis ATS completo para gaps de formato y must-haves."
      : score >= 45
        ? "Hay base, pero faltan keywords. Integra requisitos reales con evidencia (sin inventar)."
        : "Match bajo: o el rol no encaja, o el CV no usa el vocabulario de la oferta.";
  return {
    score: Math.min(99, score),
    matched: matched.slice(0, 25),
    missing: missing.slice(0, 25),
    tip,
  };
}
