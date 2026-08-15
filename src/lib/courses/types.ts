/** Modelo de curso completo (no bullets sueltos). */

export type CourseTask = {
  id: string;
  label: string;
  /** Minutos estimados */
  minutes?: number;
};

/** Un paso de “Cómo hacerlo”: título + desarrollo (no una sola línea). */
export type HowToStep = {
  title: string;
  /** 2–6 oraciones: qué hacer, cómo se ve bien, error típico a evitar */
  detail: string;
  minutes?: number;
};

export type CourseLesson = {
  id: string;
  title: string;
  /** Una línea en el índice */
  teaser: string;
  /** Por qué importa */
  why: string;
  /** Cómo hacerlo, paso a paso (desarrollado) */
  howTo: HowToStep[];
  tips: string[];
  /** Ejemplo concreto */
  example: string;
  /** Plantilla copiable */
  template: string;
  tasks: CourseTask[];
  quiz?: { question: string; options: string[]; answer: number };
};

export type CourseDef = {
  id: string;
  title: string;
  summary: string;
  /** Etiqueta corta en tablero */
  short: string;
  href: string;
  lessons: CourseLesson[];
  /** Si hay herramienta práctica asociada */
  toolHref?: string;
  toolLabel?: string;
};

/** Compat: acepta pasos viejos (string) o nuevos (HowToStep). */
export function normalizeHowTo(raw: Array<string | HowToStep> | undefined): HowToStep[] {
  if (!raw?.length) return [];
  return raw.map((s, i) => {
    if (typeof s !== "string") {
      return {
        title: s.title?.trim() || `Paso ${i + 1}`,
        detail: s.detail?.trim() || "",
        minutes: s.minutes,
      };
    }
    const trimmed = s.trim();
    const colon = trimmed.indexOf(":");
    if (colon > 0 && colon < 72) {
      return {
        title: trimmed.slice(0, colon).trim(),
        detail: trimmed.slice(colon + 1).trim() || trimmed,
      };
    }
    return { title: `Paso ${i + 1}`, detail: trimmed };
  });
}

export function howToSpeakText(steps: HowToStep[]): string {
  return steps.map((s, i) => `Paso ${i + 1}: ${s.title}. ${s.detail}`).join(" ");
}

export function howToPlainLine(step: HowToStep | string | undefined): string {
  if (!step) return "";
  if (typeof step === "string") return step;
  return `${step.title}: ${step.detail}`;
}
