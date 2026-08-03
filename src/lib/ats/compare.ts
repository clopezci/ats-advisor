import type { AtsAnalyzeResult } from "@/lib/ats/engine";

export type ScoreDelta = {
  before: number;
  after: number;
  delta: number;
  semanticBefore: number;
  semanticAfter: number;
  mustGained: string[];
  mustStillMissing: string[];
  improved: boolean;
};

export function compareAtsResults(before: AtsAnalyzeResult, after: AtsAnalyzeResult): ScoreDelta {
  const beforeMust = new Set(before.mustHave?.missing || []);
  const afterMustMissing = after.mustHave?.missing || [];
  const afterMatched = new Set([
    ...(after.mustHave?.matched || []),
    ...(after.matchedKeywords || []),
  ]);
  const mustGained = [...beforeMust].filter((t) => afterMatched.has(t) || !afterMustMissing.includes(t));

  return {
    before: before.score,
    after: after.score,
    delta: after.score - before.score,
    semanticBefore: before.semanticScore,
    semanticAfter: after.semanticScore,
    mustGained: mustGained.slice(0, 12),
    mustStillMissing: afterMustMissing.slice(0, 12),
    improved: after.score >= before.score,
  };
}

/** Diff simple línea a línea para UI before/after. */
export function lineDiff(before: string, after: string): { type: "same" | "add" | "del"; text: string }[] {
  const a = before.replace(/\r/g, "").split("\n");
  const b = after.replace(/\r/g, "").split("\n");
  const setA = new Set(a.map((l) => l.trim()).filter(Boolean));
  const setB = new Set(b.map((l) => l.trim()).filter(Boolean));
  const out: { type: "same" | "add" | "del"; text: string }[] = [];

  for (const line of a) {
    const t = line.trim();
    if (!t) continue;
    out.push({ type: setB.has(t) ? "same" : "del", text: line });
  }
  for (const line of b) {
    const t = line.trim();
    if (!t) continue;
    if (!setA.has(t)) out.push({ type: "add", text: line });
  }
  return out.slice(0, 120);
}
