/**
 * Resolver lección del día: cursor del perfil o fallback calendario global.
 */
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { getCourseById, moduleToCourse } from "@/lib/courses/catalog";
import { outModuleShort } from "@/lib/outplacement/labels";

export type CapsulePayloadBuilt = {
  moduleCode: string;
  day: number;
  title: string;
  content: string;
  quiz?: { question: string; options: string[]; answer: number };
  footer?: string;
};

export function buildGlobalDayCapsule(footer?: string): CapsulePayloadBuilt {
  const day = Math.floor(Date.now() / 86400000);
  const mod = OUTPLACEMENT_MODULES[day % OUTPLACEMENT_MODULES.length];
  const course = moduleToCourse(mod.code);
  const lesson = course?.lessons[day % (course?.lessons.length || 1)];
  const cap = mod.capsules[day % mod.capsules.length];
  const taskLine = lesson?.tasks?.[0]?.label
    ? `\n\n✅ Tarea de hoy: ${lesson.tasks[0].label}`
    : "";
  const howLine = lesson?.howTo?.[1] ? `\n\nCómo: ${lesson.howTo[1]}` : "";
  return {
    moduleCode: outModuleShort(mod.code),
    day: cap.day,
    title: lesson?.title || cap.title,
    content: `${lesson?.why || ""}\n\n${cap.content}${howLine}${taskLine}\n\n📱 Continúa hoy: abre Tablero → esta lección → marca la tarea.`,
    quiz: cap.quiz,
    footer,
  };
}

export function buildCapsuleForCursor(
  courseId: string | null | undefined,
  lessonId: string | null | undefined,
  footer?: string
): CapsulePayloadBuilt {
  if (courseId && lessonId) {
    const course = getCourseById(courseId);
    const lesson = course?.lessons.find((l) => l.id === lessonId);
    if (course && lesson) {
      const taskLine = lesson.tasks?.[0]?.label
        ? `\n\n✅ Tarea de hoy: ${lesson.tasks[0].label}`
        : "";
      const howLine = lesson.howTo?.[1] ? `\n\nCómo: ${lesson.howTo[1]}` : "";
      const dayNum = Math.max(1, course.lessons.findIndex((l) => l.id === lessonId) + 1);
      return {
        moduleCode: course.short,
        day: dayNum,
        title: lesson.title,
        content: `${lesson.why}\n\n${howLine}${taskLine}\n\n📱 Continúa: ${course.href}${
          course.href.includes("?") ? "&" : "?"
        }lesson=${encodeURIComponent(lesson.id)}`,
        quiz: lesson.quiz,
        footer,
      };
    }
  }
  return buildGlobalDayCapsule(footer);
}
