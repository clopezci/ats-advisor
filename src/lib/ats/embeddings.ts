import { cosineSimilarity, tokenFrequency, semanticOverlapScore } from "@/lib/ats/semantic";

export type EmbeddingProvider = "openai" | "gemini" | "local-tfidf" | "local-bow";

export type EmbeddingResult = {
  score: number; // 0–100
  provider: EmbeddingProvider;
};

function cosineVectors(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function clip(text: string, max = 6000) {
  return text.length > max ? text.slice(0, max) : text;
}

/** TF-IDF-ish local vectors (unigrams + bigrams). */
export function localTfidfScore(cvText: string, jobText: string): number {
  const docs = [cvText, jobText].map((t) => {
    const freq = tokenFrequency(t);
    const tokens = t
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9+#.\s-]/gi, " ")
      .split(/\s+/)
      .filter((x) => x.length > 2);
    for (let i = 0; i < tokens.length - 1; i++) {
      const bg = `${tokens[i]}_${tokens[i + 1]}`;
      freq.set(bg, (freq.get(bg) || 0) + 1);
    }
    return freq;
  });

  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const k of doc.keys()) df.set(k, (df.get(k) || 0) + 1);
  }
  const N = 2;
  function tfidf(freq: Map<string, number>) {
    const out = new Map<string, number>();
    let max = 1;
    for (const v of freq.values()) max = Math.max(max, v);
    for (const [k, v] of freq) {
      const idf = Math.log(1 + N / (df.get(k) || 1));
      out.set(k, (v / max) * idf);
    }
    return out;
  }
  const sim = cosineSimilarity(tfidf(docs[0]), tfidf(docs[1]));
  return Math.round(Math.max(0, Math.min(100, sim * 100)));
}

async function openaiEmbed(texts: string[]): Promise<number[][] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: texts.map((t) => clip(t)),
        dimensions: 512,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: { embedding: number[]; index: number }[] };
    if (!data.data?.length) return null;
    return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
  } catch {
    return null;
  }
}

async function geminiEmbed(texts: string[]): Promise<number[][] | null> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return null;
  try {
    const vectors: number[][] = [];
    for (const text of texts) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: { parts: [{ text: clip(text, 8000) }] },
            taskType: "SEMANTIC_SIMILARITY",
          }),
        }
      );
      if (!res.ok) return null;
      const data = (await res.json()) as { embedding?: { values?: number[] } };
      if (!data.embedding?.values?.length) return null;
      vectors.push(data.embedding.values);
    }
    return vectors;
  } catch {
    return null;
  }
}

/**
 * Score semántico 0–100.
 * Cascade: OpenAI → Gemini → TF-IDF local → BoW.
 */
export async function computeSemanticScore(cvText: string, jobText: string): Promise<EmbeddingResult> {
  const openai = await openaiEmbed([cvText, jobText]);
  if (openai?.length === 2) {
    const sim = cosineVectors(openai[0], openai[1]);
    return { score: Math.round(Math.max(0, Math.min(100, sim * 100))), provider: "openai" };
  }

  const gemini = await geminiEmbed([cvText, jobText]);
  if (gemini?.length === 2) {
    const sim = cosineVectors(gemini[0], gemini[1]);
    return { score: Math.round(Math.max(0, Math.min(100, sim * 100))), provider: "gemini" };
  }

  const tfidf = localTfidfScore(cvText, jobText);
  if (tfidf > 0) return { score: tfidf, provider: "local-tfidf" };

  return { score: semanticOverlapScore(cvText, jobText), provider: "local-bow" };
}
