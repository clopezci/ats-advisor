/** Modelo de curso completo (no bullets sueltos). */

export type CourseTask = {
  id: string;
  label: string;
  /** Minutos estimados */
  minutes?: number;
};

export type CourseLesson = {
  id: string;
  title: string;
  /** Una línea en el índice */
  teaser: string;
  /** Por qué importa */
  why: string;
  /** Cómo hacerlo, paso a paso */
  howTo: string[];
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
};
