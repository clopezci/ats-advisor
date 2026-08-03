/** Persistencia rica del historial ATS (localStorage). */

import type { AtsProfile } from "@/lib/ats/engine";

export type AtsHistoryEntry = {
  id: string;
  at: number;
  score: number;
  semanticScore?: number;
  interviewProbability?: number;
  profile: AtsProfile | string;
  jobTitle: string;
  jobSnippet: string;
  mustMissing: string[];
  embeddingProvider?: string;
};

const KEY = "ats_history_v2";
const LEGACY = "ats_history";

function inferJobTitle(jobText: string): string {
  const first = jobText
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 8 && l.length < 90);
  if (!first) return "Vacante";
  return first.replace(/^[#*\-\s]+/, "").slice(0, 80);
}

export function pushAtsHistory(entry: Omit<AtsHistoryEntry, "id" | "at"> & { at?: number }) {
  const full: AtsHistoryEntry = {
    id: `ats_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    at: entry.at || Date.now(),
    score: entry.score,
    semanticScore: entry.semanticScore,
    interviewProbability: entry.interviewProbability,
    profile: entry.profile,
    jobTitle: entry.jobTitle,
    jobSnippet: entry.jobSnippet,
    mustMissing: entry.mustMissing || [],
    embeddingProvider: entry.embeddingProvider,
  };
  try {
    const prev = readAtsHistory();
    prev.unshift(full);
    localStorage.setItem(KEY, JSON.stringify(prev.slice(0, 40)));
    // Keep legacy chart-compatible thin list
    const thin = prev.slice(0, 30).map((p) => ({ at: p.at, score: p.score }));
    localStorage.setItem(LEGACY, JSON.stringify(thin));
  } catch {
    /* ignore */
  }
  return full;
}

export function readAtsHistory(): AtsHistoryEntry[] {
  try {
    const v2 = JSON.parse(localStorage.getItem(KEY) || "null");
    if (Array.isArray(v2) && v2.length) return v2 as AtsHistoryEntry[];
    const legacy = JSON.parse(localStorage.getItem(LEGACY) || "[]") as { at: number; score: number }[];
    return legacy.map((p) => ({
      id: `legacy_${p.at}`,
      at: p.at,
      score: p.score,
      profile: "generic",
      jobTitle: "Análisis previo",
      jobSnippet: "",
      mustMissing: [],
    }));
  } catch {
    return [];
  }
}

export function buildHistoryPayload(opts: {
  score: number;
  semanticScore?: number;
  interviewProbability?: number;
  profile: string;
  jobText: string;
  mustMissing?: string[];
  embeddingProvider?: string;
}) {
  return {
    score: opts.score,
    semanticScore: opts.semanticScore,
    interviewProbability: opts.interviewProbability,
    profile: opts.profile,
    jobTitle: inferJobTitle(opts.jobText),
    jobSnippet: opts.jobText.slice(0, 160).replace(/\s+/g, " "),
    mustMissing: (opts.mustMissing || []).slice(0, 8),
    embeddingProvider: opts.embeddingProvider,
  };
}

export function saveAtsWorkspace(data: {
  cvText: string;
  jobText: string;
  jobUrl?: string;
  atsProfile: string;
  result?: unknown;
}) {
  try {
    localStorage.setItem("ats_workspace", JSON.stringify({ ...data, savedAt: Date.now() }));
    localStorage.setItem(
      "ats_last_result",
      JSON.stringify({ result: data.result, atsProfile: data.atsProfile, jobText: data.jobText, cvText: data.cvText })
    );
  } catch {
    /* ignore */
  }
}
