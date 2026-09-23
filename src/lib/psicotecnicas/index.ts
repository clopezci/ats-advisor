import trial from "@/lib/psicotecnicas/trial.json";

export type PsicoMateria = {
  id: string;
  nombre: string;
  corto: string;
  temario: string[];
};

export type PsicoFicha = {
  subjectId: string;
  tema: string;
  titulo: string;
  regla: string;
  ejemplo: string;
};

export type PsicoEjercicio = {
  materia: string;
  tema: string;
  enunciado: string;
  pasos: string[];
  respuesta: string;
  errorComun?: string;
  caminoLargo?: string[];
};

type TrialFile = {
  counts: { fichas: number; ejercicios: number };
  materias: PsicoMateria[];
  trialExercises: { index: number; item: PsicoEjercicio }[];
  previewFichas: PsicoFicha[];
};

const data = trial as TrialFile;

/** Solo el cupo gratis. El banco completo sale de /api/psicotecnicas/bank. */
export const PSICO_MATERIAS = data.materias;
export const PSICO_PREVIEW_FICHAS = data.previewFichas;
export const PSICO_TRIAL = data.trialExercises;
export const PSICO_BANK_COUNTS = data.counts;
export const PSICO_FREE_TRIAL = 3;

const STORAGE = "ats_psico_trial_v1";

export function materiaNombre(id: string): string {
  return PSICO_MATERIAS.find((m) => m.id === id)?.corto || id;
}

export function trialExercises() {
  return PSICO_TRIAL.slice(0, PSICO_FREE_TRIAL);
}

export function loadTrialDone(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((n) => typeof n === "number").slice(0, 20);
  } catch {
    return [];
  }
}

export function saveTrialDone(ids: number[]) {
  const uniq = Array.from(new Set(ids));
  localStorage.setItem(STORAGE, JSON.stringify(uniq));
  return uniq;
}

export function answersMatch(given: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/\s+/g, " ");
  const g = norm(given);
  const e = norm(expected);
  if (!g) return false;
  if (g === e) return true;
  if (g.replace(/\s/g, "") === e.replace(/\s/g, "")) return true;
  const letter = e.match(/^([a-e])\)/);
  if (letter && (g === letter[1] || g.startsWith(`${letter[1]})`) || g.startsWith(`${letter[1]} `))) {
    return true;
  }
  const rest = e.replace(/^[a-e]\)\s*/, "");
  if (rest.length > 1 && (g === rest || g.includes(rest) || rest.includes(g))) return true;
  return false;
}
