/** Lightweight bag-of-words cosine similarity (no external embedding API). */
export function tokenFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  const tokens = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9+#.\s-]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  return freq;
}

export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, v] of a) na += v * v;
  for (const [, v] of b) nb += v * v;
  if (!na || !nb) return 0;
  for (const [k, va] of a) {
    const vb = b.get(k);
    if (vb) dot += va * vb;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Returns 0–100 semantic overlap score between CV and job. */
export function semanticOverlapScore(cvText: string, jobText: string): number {
  const sim = cosineSimilarity(tokenFrequency(cvText), tokenFrequency(jobText));
  return Math.round(Math.max(0, Math.min(100, sim * 100)));
}
