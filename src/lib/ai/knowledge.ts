import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

type Chunk = { id: string; source: string; text: string };

function loadAllChunks(): Chunk[] {
  const dir = path.join(process.cwd(), "knowledge_base");
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const chunks: Chunk[] = [];
  for (const f of files) {
    let raw = "";
    try {
      raw = readFileSync(path.join(dir, f), "utf8");
    } catch {
      continue;
    }
    const parts = raw.split(/\n(?=## )/);
    parts.forEach((p, i) => {
      const text = p.trim();
      if (text.length > 40) chunks.push({ id: `${f}#${i}`, source: f, text });
    });
  }
  return chunks;
}

function scoreChunk(query: string, text: string) {
  const q = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/\W+/)
    .filter((t) => t.length > 3);
  const t = text.toLowerCase();
  let s = 0;
  for (const term of q) if (t.includes(term)) s += 1;
  return s;
}

/** Keyword RAG: top-k chunks by term overlap (no external embeddings). */
export function retrieveKnowledge(query: string, k = 4, maxChars = 5000): string {
  const ranked = loadAllChunks()
    .map((c) => ({ ...c, score: scoreChunk(query, c.text) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  if (!ranked.length) return loadKnowledgeBase(maxChars);
  return ranked
    .map((c) => `### ${c.source}\n${c.text}`)
    .join("\n\n")
    .slice(0, maxChars);
}

const FILES = [
  "outplacement.md",
  "ats-parsing.md",
  "star-negociacion.md",
  "skills-es.md",
  "linkedin-templates.md",
  "faq-empleo.md",
];

/** Load curated knowledge_base markdown for prompt grounding. */
export function loadKnowledgeBase(maxChars = 6000): string {
  const dir = path.join(process.cwd(), "knowledge_base");
  if (!existsSync(dir)) return "";

  const preferred = FILES.map((f) => path.join(dir, f)).filter(existsSync);
  const extras = readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !FILES.includes(f))
    .map((f) => path.join(dir, f));

  const chunks = [...preferred, ...extras].map((p) => {
    try {
      return readFileSync(p, "utf8");
    } catch {
      return "";
    }
  });

  return chunks.join("\n\n").slice(0, maxChars);
}

export function withKnowledgeContext(userPrompt: string, maxChars = 4000): string {
  const kb = retrieveKnowledge(userPrompt, 4, maxChars);
  if (!kb) return userPrompt;
  return `${userPrompt}\n\n---\nBase de conocimiento (úsalo si aplica; no inventes datos del usuario):\n${kb}`;
}
