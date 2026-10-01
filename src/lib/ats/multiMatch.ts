import { analyzeAts, type AtsAnalyzeResult, type AtsProfile } from "@/lib/ats/engine";

export type MultiJobInput = {
  id: string;
  title: string;
  text: string;
};

export type MultiJobResult = {
  id: string;
  title: string;
  score: number;
  interviewProbability: number;
  mustMissing: string[];
  exclusiveGaps: string[];
  recommendation: string;
};

function toRow(j: MultiJobInput, r: AtsAnalyzeResult): MultiJobResult {
  let recommendation = "Postula tras un ajuste ligero.";
  if (r.score >= 75 && !r.exclusiveGaps.length) recommendation = "Prioridad alta: postula pronto.";
  else if (r.score >= 60) recommendation = "Viable: adapta must-have y postula.";
  else if (r.exclusiveGaps.length) recommendation = "Resuelve excluyentes o descarta con honestidad.";
  else recommendation = "Bajo match: solo postula si puedes demostrar los gaps rápido.";
  return {
    id: j.id,
    title: j.title || j.text.slice(0, 60),
    score: r.score,
    interviewProbability: r.interviewProbability,
    mustMissing: (r.mustHave?.missing || []).slice(0, 6),
    exclusiveGaps: r.exclusiveGaps.slice(0, 3),
    recommendation,
  };
}

/** Rankea varias ofertas contra el mismo CV (cede el hilo entre jobs para no congelar Chrome). */
export async function rankJobsAgainstCv(
  cvText: string,
  jobs: MultiJobInput[],
  atsProfile: AtsProfile = "generic"
): Promise<MultiJobResult[]> {
  const ranked: MultiJobResult[] = [];
  const list = jobs.filter((j) => j.text.trim().length >= 40).slice(0, 10);
  for (let i = 0; i < list.length; i++) {
    const j = list[i];
    const r = analyzeAts({ cvText, jobText: j.text, atsProfile });
    ranked.push(toRow(j, r));
    // Cedé el hilo principal entre análisis (evita "página no responde").
    if (i < list.length - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}
