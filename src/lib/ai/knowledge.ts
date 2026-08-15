import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import path from "path";

type Chunk = { id: string; source: string; text: string };

function listMarkdownFiles(dir: string, base = dir): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      out.push(...listMarkdownFiles(full, base));
    } else if (name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function loadAllChunks(): Chunk[] {
  const dir = path.join(process.cwd(), "knowledge_base");
  if (!existsSync(dir)) return [];
  const files = listMarkdownFiles(dir);
  const chunks: Chunk[] = [];
  for (const full of files) {
    let raw = "";
    try {
      raw = readFileSync(full, "utf8");
    } catch {
      continue;
    }
    const rel = path.relative(dir, full).replace(/\\/g, "/");
    const parts = raw.split(/\n(?=## )/);
    parts.forEach((p, i) => {
      const text = p.trim();
      if (text.length > 40) chunks.push({ id: `${rel}#${i}`, source: rel, text });
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

/** Keyword RAG: top-k chunks by term overlap (incluye subcarpetas). */
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
  "outplacement/mercado-oculto-y-canales.md",
  "outplacement/mapa-carrera.md",
  "outplacement/guiones-comunicacion.md",
  "outplacement/soar-logros.md",
  "outplacement/compensacion-total.md",
  "outplacement/coach-guardrails.md",
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
  const all = listMarkdownFiles(dir);
  const extras = all.filter((p) => !preferred.includes(p));

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
  const kb = retrieveKnowledge(userPrompt, 5, maxChars);
  if (!kb) return userPrompt;
  return `${userPrompt}\n\n---\nBase de conocimiento (úsalo si aplica; no inventes datos del usuario; no cites marcas de terceros de outplacement):\n${kb}`;
}

export function careerCoachSystemPrompt(moduleHint?: string): string {
  const mod = moduleHint ? ` Módulo activo: ${moduleHint}.` : "";
  return (
    "Eres coach de empleabilidad de ATSAdvisor (marca propia). Español LATAM, claro y accionable." +
    mod +
    " Usa solo temas de carrera/empleo. No inventes experiencia ni salarios sin datos." +
    " No menciones firmas de outplacement ajenas ni materiales propietarios de terceros." +
    " Si la pregunta es off-topic, recházala en una frase y vuelve al módulo." +
    " Cierra con un siguiente paso de una línea. No eres abogado ni terapeuta; ante crisis, deriva a ayuda humana."
  );
}
