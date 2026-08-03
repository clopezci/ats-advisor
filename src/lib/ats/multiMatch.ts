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

/** Rankea varias ofertas contra el mismo CV (sync, motor local + TF-IDF). */
export function rankJobsAgainstCv(
  cvText: string,
  jobs: MultiJobInput[],
  atsProfile: AtsProfile = "generic"
): MultiJobResult[] {
  const ranked = jobs
    .filter((j) => j.text.trim().length >= 40)
    .map((j) => {
      const r: AtsAnalyzeResult = analyzeAts({ cvText, jobText: j.text, atsProfile });
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
    })
    .sort((a, b) => b.score - a.score);

  return ranked;
}
