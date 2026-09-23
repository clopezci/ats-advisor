import catalog from "@/lib/psicotecnicas/catalog.json";

export type PsicoMateria = {
  id: string;
  nombre: string;
  corto: string;
  prompt: string;
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

const data = catalog as {
  materias: PsicoMateria[];
  fichas: PsicoFicha[];
  ejercicios: PsicoEjercicio[];
};

export const PSICO_MATERIAS = data.materias;
export const PSICO_FICHAS = data.fichas;
export const PSICO_EJERCICIOS = data.ejercicios;

/** Cuántas pruebas puede resolver alguien sin plan Carrera. */
export const PSICO_FREE_TRIAL = 3;

const STORAGE = "ats_psico_trial_v1";

export function materiaNombre(id: string): string {
  return PSICO_MATERIAS.find((m) => m.id === id)?.corto || id;
}

/** Una prueba de cada materia: numérico, abstracto y personalidad. */
export function trialExercises(): { index: number; item: PsicoEjercicio }[] {
  const picked: { index: number; item: PsicoEjercicio }[] = [];
  for (const m of PSICO_MATERIAS) {
    const index = PSICO_EJERCICIOS.findIndex((e) => e.materia === m.id);
    if (index >= 0) picked.push({ index, item: PSICO_EJERCICIOS[index] });
  }
  return picked.slice(0, PSICO_FREE_TRIAL);
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
