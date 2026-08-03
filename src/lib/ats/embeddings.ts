import { cosineSimilarity, tokenFrequency, semanticOverlapScore } from "@/lib/ats/semantic";

export type EmbeddingProvider = "openai" | "gemini" | "huggingface" | "local-tfidf" | "local-bow";

export type EmbeddingResult = {
  score: number; // 0–100
  provider: EmbeddingProvider;
  /** true si vino de API cloud */
  cloud: boolean;
  warning?: string;
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

function meanPool(matrix: number[][]): number[] {
  if (!matrix.length) return [];
  const dim = matrix[0].length;
  const out = new Array(dim).fill(0);
  for (const row of matrix) {
    for (let i = 0; i < dim; i++) out[i] += row[i] || 0;
  }
  for (let i = 0; i < dim; i++) out[i] /= matrix.length;
  return out;
}

/** TF-IDF local — solo fallback de emergencia. */
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

/** Hugging Face Inference — embeddings multilingües (cloud gratis/pago según token). */
async function huggingfaceEmbed(texts: string[]): Promise<number[][] | null> {
  const key = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  const model =
    process.env.HF_EMBEDDING_MODEL || "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (key) headers.Authorization = `Bearer ${key}`;
    const vectors: number[][] = [];
    for (const text of texts) {
      const res = await fetch(`https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: clip(text, 4000), options: { wait_for_model: true } }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      // Puede ser number[] o number[][] (tokens)
      let vec: number[] | null = null;
      if (Array.isArray(data) && typeof data[0] === "number") vec = data as number[];
      else if (Array.isArray(data) && Array.isArray(data[0])) vec = meanPool(data as number[][]);
      else if (data?.embeddings && Array.isArray(data.embeddings[0])) vec = data.embeddings[0];
      if (!vec?.length) return null;
      vectors.push(vec);
    }
    return vectors;
  } catch {
    return null;
  }
}

/**
 * Embeddings **cloud-first**: OpenAI → Gemini → Hugging Face.
 * Local solo si no hay cloud (con warning). Preferible configurar GOOGLE_AI o OPENAI o HF_TOKEN.
 */
export async function computeSemanticScore(cvText: string, jobText: string): Promise<EmbeddingResult> {
  const openai = await openaiEmbed([cvText, jobText]);
  if (openai?.length === 2) {
    const sim = cosineVectors(openai[0], openai[1]);
    return { score: Math.round(Math.max(0, Math.min(100, sim * 100))), provider: "openai", cloud: true };
  }

  const gemini = await geminiEmbed([cvText, jobText]);
  if (gemini?.length === 2) {
    const sim = cosineVectors(gemini[0], gemini[1]);
    return { score: Math.round(Math.max(0, Math.min(100, sim * 100))), provider: "gemini", cloud: true };
  }

  const hf = await huggingfaceEmbed([cvText, jobText]);
  if (hf?.length === 2) {
    const sim = cosineVectors(hf[0], hf[1]);
    return { score: Math.round(Math.max(0, Math.min(100, sim * 100))), provider: "huggingface", cloud: true };
  }

  const tfidf = localTfidfScore(cvText, jobText);
  return {
    score: tfidf || semanticOverlapScore(cvText, jobText),
    provider: tfidf > 0 ? "local-tfidf" : "local-bow",
    cloud: false,
    warning:
      "Sin embeddings cloud (agrega GOOGLE_AI_API_KEY, OPENAI_API_KEY o HF_TOKEN). Usamos match local temporal.",
  };
}

export function cloudEmbeddingsConfigured(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.HF_TOKEN ||
      process.env.HUGGINGFACE_API_KEY
  );
}
