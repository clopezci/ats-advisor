import { textHasTerm } from "@/lib/ats/synonyms";

export type HeatCell = {
  term: string;
  jobCount: number;
  cvCount: number;
  status: "ok" | "weak" | "missing";
  /** 0–100 intensidad relativa a la oferta */
  intensity: number;
};

function countOccurrences(haystack: string, needle: string): number {
  const n = needle.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const h = haystack.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (!n || n.length < 2) return 0;
  let count = 0;
  let idx = 0;
  while (true) {
    const found = h.indexOf(n, idx);
    if (found < 0) break;
    count++;
    idx = found + Math.max(1, n.length);
  }
  return count;
}

/**
 * Heatmap: frecuencia del término en la oferta vs en el CV.
 * missing = 0 en CV; weak = aparece menos que en la oferta; ok = cobertura suficiente.
 */
export function buildKeywordHeatmap(
  cvText: string,
  jobText: string,
  terms: string[],
  limit = 30
): HeatCell[] {
  const unique = [...new Set(terms.map((t) => t.trim()).filter((t) => t.length >= 2))];
  const cells: HeatCell[] = [];

  for (const term of unique) {
    const jobCount = countOccurrences(jobText, term);
    const rawCv = countOccurrences(cvText, term);
    const cvN = cvText.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    const cvCount = rawCv > 0 || textHasTerm(cvN, term) ? Math.max(1, rawCv) : 0;
    let status: HeatCell["status"] = "ok";
    if (cvCount === 0) status = "missing";
    else if (jobCount >= 2 && cvCount < Math.min(2, jobCount)) status = "weak";

    const intensity = Math.min(
      100,
      jobCount * 25 + (status === "missing" ? 40 : status === "weak" ? 20 : 0)
    );
    cells.push({ term, jobCount: Math.max(jobCount, 1), cvCount, status, intensity });
  }

  cells.sort((a, b) => {
    const rank = { missing: 0, weak: 1, ok: 2 };
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return b.jobCount - a.jobCount;
  });

  return cells.slice(0, limit);
}

export function sectionKeywordHits(
  cvText: string,
  terms: string[]
): { section: string; hits: number; sample: string[] }[] {
  const parts = [
    {
      section: "Resumen / perfil",
      re: /([\s\S]{0,800}?)(?=experiencia|experience|educaci|skills|habilidades|$)/i,
    },
    {
      section: "Experiencia",
      re: /(?:experiencia|experience|historial)([\s\S]*?)(?=educaci[oó]n|estudios|skills|habilidades|certific|$)/i,
    },
    {
      section: "Skills",
      re: /(?:skills|habilidades|competencias|tecnolog)([\s\S]*?)(?=educaci|idiomas|certific|referenc|$)/i,
    },
    {
      section: "Educación",
      re: /(?:educaci[oó]n|estudios|formaci[oó]n)([\s\S]*?)(?=skills|habilidades|experiencia|idiomas|$)/i,
    },
  ];

  const out: { section: string; hits: number; sample: string[] }[] = [];
  for (const p of parts) {
    const m = cvText.match(p.re);
    const chunk = m ? m[0] : "";
    if (!chunk || chunk.length < 40) {
      out.push({ section: p.section, hits: 0, sample: [] });
      continue;
    }
    const sample: string[] = [];
    const chunkN = chunk.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    for (const t of terms) {
      if (textHasTerm(chunkN, t) || chunk.toLowerCase().includes(t.toLowerCase())) {
        sample.push(t);
      }
    }
    out.push({ section: p.section, hits: sample.length, sample: sample.slice(0, 8) });
  }
  return out;
}
