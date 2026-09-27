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

const DRAFT_KEY = "ats_wizard_draft";

export type AtsWizardDraft = {
  step: 1 | 2 | 3 | 4;
  cvText: string;
  jobText: string;
  jobUrl: string;
  companyDomain: string;
  companyName: string;
  atsProfile: string;
  result: unknown | null;
  resultPhase: number;
};

export function readAtsWizardDraft(): AtsWizardDraft | null {
  try {
    const raw = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (!raw || typeof raw !== "object") return null;
    const step = Number(raw.step);
    if (step !== 1 && step !== 2 && step !== 3 && step !== 4) return null;
    return {
      step,
      cvText: typeof raw.cvText === "string" ? raw.cvText : "",
      jobText: typeof raw.jobText === "string" ? raw.jobText : "",
      jobUrl: typeof raw.jobUrl === "string" ? raw.jobUrl : "",
      companyDomain: typeof raw.companyDomain === "string" ? raw.companyDomain : "",
      companyName: typeof raw.companyName === "string" ? raw.companyName : "",
      atsProfile: typeof raw.atsProfile === "string" ? raw.atsProfile : "generic",
      result: raw.result ?? null,
      resultPhase: Number(raw.resultPhase) || 1,
    };
  } catch {
    return null;
  }
}

export function writeAtsWizardDraft(draft: AtsWizardDraft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    if (draft.cvText.trim() || draft.jobText.trim()) {
      const prev = JSON.parse(localStorage.getItem("ats_workspace") || "null") || {};
      localStorage.setItem(
        "ats_workspace",
        JSON.stringify({
          ...prev,
          cvText: draft.cvText || prev.cvText || "",
          jobText: draft.jobText || prev.jobText || "",
          jobUrl: draft.jobUrl || prev.jobUrl || "",
          atsProfile: draft.atsProfile || prev.atsProfile || "generic",
          result: draft.result ?? prev.result,
          savedAt: Date.now(),
        })
      );
    }
  } catch {
    /* ignore */
  }
}
