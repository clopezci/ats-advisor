import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

const FILES = ["outplacement.md", "ats-parsing.md", "star-negociacion.md"];

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
  const kb = loadKnowledgeBase(maxChars);
  if (!kb) return userPrompt;
  return `${userPrompt}\n\n---\nBase de conocimiento (úsalo si aplica; no inventes datos del usuario):\n${kb}`;
}
