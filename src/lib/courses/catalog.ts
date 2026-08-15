import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { outModuleShort } from "@/lib/outplacement/labels";
import type { CourseDef, CourseLesson, HowToStep } from "@/lib/courses/types";
import { normalizeHowTo } from "@/lib/courses/types";
import { BIENESTAR_COURSE } from "@/lib/courses/bienestarCourse";
import { TOOL_COURSES, toolCourseById } from "@/lib/courses/toolCourses";
import {
  enrichmentKey,
  MODULE_LESSON_ENRICHMENTS,
} from "@/lib/courses/moduleEnrichments";

function fallbackHowTo(title: string, content: string): HowToStep[] {
  return normalizeHowTo([
    {
      title: `Objetivo de hoy: ${title}`,
      detail:
        `Esta lección forma parte de tu ruta. El entregable central es: ${content}. No basta con leerlo: al terminar debes tener algo escrito o enviado que puedas mostrar mañana.`,
      minutes: 5,
    },
    {
      title: "Ejecuta la práctica por escrito",
      detail:
        "Abre una nota o doc y trabaja la práctica central arriba. Si te trabas, reduce el alcance a 20 minutos y cierra con una versión 70%. El error típico es “dejarlo en la cabeza” y no poder usarlo en entrevista.",
      minutes: 25,
    },
    {
      title: "Guarda evidencia y define el siguiente paso",
      detail:
        "Pega texto, captura o link en tu carpeta. Escribe una frase: “Mañana haré ___”. Marca las tareas de abajo. Si puedes, pide feedback a 1 persona de tu red sobre el entregable.",
      minutes: 10,
    },
  ]);
}

/** Expande una cápsula corta a lección completa (cómo, tips, plantilla, tareas). */
function enrichCapsule(
  code: string,
  moduleTitle: string,
  title: string,
  day: number,
  content: string,
  quiz?: CourseLesson["quiz"]
): CourseLesson {
  const id = `${code}-d${day}`;
  const rich = MODULE_LESSON_ENRICHMENTS[enrichmentKey(code, day)];
  return {
    id,
    title,
    teaser: content.length > 90 ? `${content.slice(0, 87)}…` : content,
    why:
      rich?.why ||
      `Forma parte de “${moduleTitle}”. Leer no basta: el valor está en el entregable de hoy y en marcarlo en tu tablero.`,
    howTo: rich?.howTo?.length ? normalizeHowTo(rich.howTo) : fallbackHowTo(title, content),
    tips: rich?.tips || [
      "Hecho > perfecto. Una versión 70% hoy gana a la versión ideal la próxima semana.",
      "Si puedes, pide feedback a 1 persona de tu red sobre el entregable.",
      quiz
        ? `Autochequeo: ${quiz.question} (repásalo al terminar).`
        : "Al terminar, explica en 2 frases qué aprendiste hoy.",
    ],
    example:
      rich?.example ||
      `Ejemplo aplicado a “${title}”:
Situación: estás en transición y tienes 45–90 minutos hoy.
Acción: ${content}
Resultado esperado: un entregable concreto (texto, lista o mensaje enviado) que puedas mostrar mañana.`,
    template:
      rich?.template ||
      `Plantilla — ${title}
Fecha: ___
Contexto (2 líneas): …
Lo que hice hoy:
1. …
2. …
3. …
Evidencia (pega texto / link / “audio 60s”): …
Siguiente paso mañana: …
Bloqueadores: …`,
    tasks: [
      {
        id: `${id}-t1`,
        label: `Práctica: ${content.slice(0, 100)}${content.length > 100 ? "…" : ""}`,
        minutes: 25,
      },
      {
        id: `${id}-t2`,
        label: "Llenar la plantilla / guardar evidencia",
        minutes: 10,
      },
      {
        id: `${id}-t3`,
        label: "Definir siguiente paso de mañana (1 frase)",
        minutes: 5,
      },
    ],
    quiz,
  };
}

export function moduleToCourse(code: string): CourseDef | null {
  const mod = OUTPLACEMENT_MODULES.find((m) => m.code === code);
  if (!mod) return null;
  return {
    id: mod.code,
    title: mod.title,
    short: outModuleShort(mod.code),
    summary: mod.summary,
    href: `/outplacement/ruta?code=${mod.code}`,
    lessons: mod.capsules.map((c) =>
      enrichCapsule(mod.code, mod.title, c.title, c.day, c.content, c.quiz)
    ),
  };
}

export function allCareerCourses(): CourseDef[] {
  const mods = OUTPLACEMENT_MODULES.map((m) => moduleToCourse(m.code)!).filter(Boolean);
  return [BIENESTAR_COURSE, ...mods, ...TOOL_COURSES];
}

export function getCourseById(id: string): CourseDef | null {
  if (id === BIENESTAR_COURSE.id) return BIENESTAR_COURSE;
  const tool = toolCourseById(id);
  if (tool) return tool;
  return moduleToCourse(id);
}
