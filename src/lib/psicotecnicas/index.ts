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
  /** Id de figura SVG en AbstractFigures (abstracto / atención / etc.). */
  figura?: string;
};

export type PsicoEjercicio = {
  materia: string;
  tema: string;
  enunciado: string;
  pasos: string[];
  respuesta: string;
  errorComun?: string;
  caminoLargo?: string[];
  figura?: string;
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
  // Decimales: 7,5 ≈ 7.5
  const asNum = (s: string) => {
    const t = s.replace(/^[a-e]\)\s*/, "").replace(/\s/g, "").replace(",", ".");
    if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
    return Number(t);
  };
  const gn = asNum(g);
  const en = asNum(rest.length ? rest : e);
  if (gn != null && en != null && Math.abs(gn - en) < 1e-9) return true;
  return false;
}

export type ChoiceOption = { letter: string; value: string };

const CHOICE_LETTERS = "ABCDE";

function cleanChoiceValue(s: string): string {
  return s.replace(/\s+/g, " ").replace(/[|]\s*$/g, "").trim();
}

/** Parte un texto en opciones etiquetadas A) … B) … (misma línea o varias). */
function splitLabeledChoices(text: string): ChoiceOption[] {
  const re = /(?:^|[\s])([A-E])\)\s*/gi;
  const marks = [...text.matchAll(re)];
  if (marks.length < 2) return [];
  const out: ChoiceOption[] = [];
  for (let i = 0; i < marks.length && out.length < 5; i++) {
    const letter = marks[i][1].toUpperCase();
    const start = (marks[i].index ?? 0) + marks[i][0].length;
    const end = i + 1 < marks.length ? (marks[i + 1].index ?? text.length) : text.length;
    const value = cleanChoiceValue(text.slice(start, end).replace(/\n*Opciones\b[\s\S]*$/i, ""));
    if (!value || value === "…" || value === "...") continue;
    if (out.some((o) => o.letter === letter)) continue;
    out.push({ letter, value });
  }
  return out.length >= 2 ? out : [];
}

function optionsTail(enunciado: string): string | null {
  const re = /Opciones\b[^:\n]*:\s*/gi;
  let last: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(enunciado))) last = m;
  if (!last || last.index == null) return null;
  return enunciado.slice(last.index + last[0].length).trim();
}

/**
 * Extrae opciones para botones.
 * Cubre: "Opciones:" en varias líneas (A)…), misma línea con |,
 * "A) x  B) y", y listas "Opciones: 4, 5, 6".
 */
export function parseChoiceOptions(enunciado: string): ChoiceOption[] {
  const labeled = splitLabeledChoices(enunciado);
  if (labeled.length >= 2) return labeled;

  const tail = optionsTail(enunciado);
  if (!tail) return [];

  if (tail.includes("|")) {
    const parts = tail
      .split("|")
      .map((p) => cleanChoiceValue(p.replace(/^[A-E]\)\s*/i, "")))
      .filter((p) => p && p !== "…" && p !== "...");
    if (parts.length >= 2) {
      return parts.slice(0, 5).map((value, i) => ({ letter: CHOICE_LETTERS[i], value }));
    }
  }

  const firstLine = tail.split("\n")[0].trim();
  // "A, B, C, D" sin descripción
  if (/^[A-E](\s*,\s*[A-E])+$/i.test(firstLine)) {
    return firstLine
      .split(",")
      .map((p) => p.trim().toUpperCase())
      .filter((p) => CHOICE_LETTERS.includes(p))
      .map((letter) => ({ letter, value: letter }));
  }

  // "4, 5, 6, 7, 3" — no partir miles (96,864)
  if (firstLine.includes(",") && !/[A-E]\)/i.test(firstLine)) {
    const parts = firstLine
      .split(",")
      .map((p) => p.trim().replace(/−/g, "-"))
      .filter(Boolean);
    const simple = parts.every((p) => /^-?[\d.]+%?$/.test(p) || /^-?[\d.]+\/[\d.]+$/.test(p));
    if (simple && parts.length >= 3) {
      return parts.slice(0, 5).map((value, i) => ({ letter: CHOICE_LETTERS[i], value }));
    }
  }

  return [];
}

/** Letras A–D o A–E cuando las alternativas solo están en la figura. */
export function fallbackLetterChoices(enunciado: string, respuesta: string): ChoiceOption[] {
  const range = enunciado.match(/A\s*[–-]\s*([B-E])/i);
  let last = range?.[1]?.toUpperCase() || "";
  if (!last && /^[A-E]\)/.test(respuesta.trim()) && /[?¿]|opci[oó]n|elige|figura|conjunto|serie/i.test(enunciado)) {
    last = /no pertenece|A\s*[–-]\s*E|grupo/i.test(enunciado) ? "E" : "D";
  }
  if (!last) return [];
  const n = CHOICE_LETTERS.indexOf(last) + 1;
  if (n < 2) return [];
  return CHOICE_LETTERS.slice(0, n)
    .split("")
    .map((letter) => ({ letter, value: letter }));
}

export type StemPart = { text: string; emphasis: boolean };

/** Separa la palabra o la línea que hay que resolver para resaltarla. */
export function stemSegments(stem: string): StemPart[] {
  const text = stem.trim();
  if (!text) return [];
  const lines = text.split("\n");

  const pregunta = lines.findIndex((l) => /^\s*Pregunta\s*:/i.test(l));
  if (pregunta >= 0) {
    return lines.map((line, i) => ({
      text: i < lines.length - 1 ? `${line}\n` : line,
      emphasis: i === pregunta,
    }));
  }

  const word = lines.findIndex((l) => {
    const t = l.trim();
    return (
      t.length >= 2 &&
      t.length <= 40 &&
      /^[\p{L}][\p{L}\s'-]*$/u.test(t) &&
      !/^(elige|calcula|halla|observa|selecciona|por favor|completa)/i.test(t)
    );
  });
  if (word >= 0 && lines.some((l, i) => i !== word && l.trim())) {
    return lines.map((line, i) => ({
      text: i < lines.length - 1 ? `${line}\n` : line,
      emphasis: i === word,
    }));
  }

  const syn = text.match(/(\bde\s+)([\p{L}][\p{L}\s'-]{1,40}?)(\s*:)/iu);
  if (syn && /sin[oó]nimo|ant[oó]nimo|opuesto|significado/i.test(text) && syn.index != null) {
    const at = syn.index + syn[1].length;
    return [
      { text: text.slice(0, at), emphasis: false },
      { text: syn[2], emphasis: true },
      { text: text.slice(at + syn[2].length), emphasis: false },
    ];
  }

  const markLine = (index: number): StemPart[] =>
    lines.map((line, i) => ({
      text: i < lines.length - 1 ? `${line}\n` : line,
      emphasis: i === index,
    }));

  // 26 × ? − 110 = 384, igual que 30 ÷ 6 = ? o una serie
  const math = lines.findIndex((l) => {
    const t = l.trim();
    if (!/[\d×÷+\-−=*/]/.test(t)) return false;
    return /\?/.test(t) || (/[xX]/.test(t) && /=/.test(t));
  });
  if (math >= 0) return markLine(math);

  const question = lines.findIndex((l) => {
    const t = l.trim();
    return /^¿/.test(t) || (/¿[^?\n]{6,}\?/.test(t) && t.length <= 180);
  });
  if (question >= 0) return markLine(question);

  const inline = text.match(/([\s\S]*?)(¿[^?\n]{6,}\?)(\s*)$/);
  if (inline && inline[1].trim()) {
    return [
      { text: inline[1], emphasis: false },
      { text: inline[2], emphasis: true },
      { text: inline[3] || "", emphasis: false },
    ];
  }

  const lead = lines.findIndex((l) => {
    const t = l.trim();
    return t.length >= 8 && t.length <= 110;
  });
  if (lead >= 0 && lines.some((l, i) => i > lead && l.trim())) return markLine(lead);

  return [{ text, emphasis: false }];
}

/** Enunciado sin el bloque de opciones (para mostrar botones aparte). */
export function stemWithoutOptions(enunciado: string): string {
  const opts = parseChoiceOptions(enunciado);
  if (!opts.length) return enunciado.trim();

  let s = enunciado;
  const header = s.search(/\n*Opciones\b[^:\n]*:/i);
  if (header >= 0) {
    const before = s.slice(0, header);
    const letterStart = before.search(/(?:^|\n)\s*A\)\s/);
    s = letterStart >= 0 ? before.slice(0, letterStart) : before;
  } else {
    const letterStart = s.search(/(?:^|\n)\s*A\)\s/);
    if (letterStart >= 0) s = s.slice(0, letterStart);
  }
  return s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
