/** Benchmark anónimo: percentil vs distribución sintética LATAM (sin PII). */

export type BenchmarkResult = {
  score: number;
  percentile: number;
  band: "bajo" | "medio" | "competitivo" | "top";
  message: string;
  peersHint: string;
};

/** Distribución aproximada de scores ATS en búsquedas LATAM (modelo interno, no datos personales). */
const LATAM_CUMULATIVE: { maxScore: number; percentile: number }[] = [
  { maxScore: 35, percentile: 15 },
  { maxScore: 45, percentile: 30 },
  { maxScore: 55, percentile: 45 },
  { maxScore: 65, percentile: 60 },
  { maxScore: 72, percentile: 72 },
  { maxScore: 80, percentile: 85 },
  { maxScore: 88, percentile: 93 },
  { maxScore: 95, percentile: 98 },
  { maxScore: 100, percentile: 99 },
];

export function anonymousBenchmark(score: number): BenchmarkResult {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  let percentile = 5;
  for (const row of LATAM_CUMULATIVE) {
    if (s <= row.maxScore) {
      percentile = row.percentile;
      break;
    }
    percentile = row.percentile;
  }

  const band: BenchmarkResult["band"] =
    s >= 85 ? "top" : s >= 70 ? "competitivo" : s >= 50 ? "medio" : "bajo";

  const message =
    band === "top"
      ? "Estás en el tramo alto frente a perfiles similares en LATAM (orientativo)."
      : band === "competitivo"
        ? "Zona competitiva: muchos reclutadores ya te mirarían. Cierra must-have faltantes."
        : band === "medio"
          ? "Mitad de tabla: el ATS puede filtrarte. Prioriza must-have y skim de 8s."
          : "Por debajo del umbral típico de surfacing. Reescribe antes de postular masivo.";

  return {
    score: s,
    percentile,
    band,
    message,
    peersHint: `Mejor que ~${percentile}% de CVs en nuestra referencia anónima LATAM (modelo interno, sin datos personales).`,
  };
}
