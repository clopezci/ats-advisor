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

export function writeAtsWizardDraft(draft: AtsWizardDraft) {
  try {
    // Borrador frecuente SIN result (el análisis es enorme y JSON.stringify congela Chrome).
    const light = {
      step: draft.step,
      cvText: draft.cvText.slice(0, 80_000),
      jobText: draft.jobText.slice(0, 40_000),
      jobUrl: draft.jobUrl.slice(0, 500),
      companyDomain: draft.companyDomain.slice(0, 200),
      companyName: draft.companyName.slice(0, 200),
      atsProfile: draft.atsProfile,
      result: null as unknown | null,
      resultPhase: draft.resultPhase,
    };
    const serial = JSON.stringify(light);
    const existing = localStorage.getItem(DRAFT_KEY);
    if (existing !== serial) {
      localStorage.setItem(DRAFT_KEY, serial);
    }

    // Resultado: solo si cambió y en clave aparte (no en cada tecla).
    if (draft.result != null) {
      const resultKey = "ats_wizard_result_v1";
      const resultSerial = JSON.stringify({
        result: draft.result,
        resultPhase: draft.resultPhase,
        atsProfile: draft.atsProfile,
      });
      if (resultSerial.length < 350_000) {
        const prevR = localStorage.getItem(resultKey);
        if (prevR !== resultSerial) localStorage.setItem(resultKey, resultSerial);
      }
    }

    if (draft.cvText.trim() || draft.jobText.trim()) {
      const prev = JSON.parse(localStorage.getItem("ats_workspace") || "null") || {};
      const ws = {
        ...prev,
        cvText: light.cvText || prev.cvText || "",
        jobText: light.jobText || prev.jobText || "",
        jobUrl: light.jobUrl || prev.jobUrl || "",
        atsProfile: draft.atsProfile || prev.atsProfile || "generic",
        // No re-embeber result gigante aquí en cada autosave.
        savedAt: Date.now(),
      };
      const wsSerial = JSON.stringify(ws);
      if (localStorage.getItem("ats_workspace") !== wsSerial) {
        localStorage.setItem("ats_workspace", wsSerial);
      }
    }
  } catch {
    /* ignore */
  }
}

export function readAtsWizardDraft(): AtsWizardDraft | null {
  try {
    const raw = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (!raw || typeof raw !== "object") return null;
    const step = Number(raw.step);
    if (step !== 1 && step !== 2 && step !== 3 && step !== 4) return null;
    let result = raw.result ?? null;
    if (!result) {
      try {
        const r = JSON.parse(localStorage.getItem("ats_wizard_result_v1") || "null");
        if (r?.result) result = r.result;
      } catch {
        /* ignore */
      }
    }
    return {
      step,
      cvText: typeof raw.cvText === "string" ? raw.cvText : "",
      jobText: typeof raw.jobText === "string" ? raw.jobText : "",
      jobUrl: typeof raw.jobUrl === "string" ? raw.jobUrl : "",
      companyDomain: typeof raw.companyDomain === "string" ? raw.companyDomain : "",
      companyName: typeof raw.companyName === "string" ? raw.companyName : "",
      atsProfile: typeof raw.atsProfile === "string" ? raw.atsProfile : "generic",
      result,
      resultPhase: Number(raw.resultPhase) || 1,
    };
  } catch {
    return null;
  }
}
