"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allCareerCourses, getCourseById } from "@/lib/courses/catalog";
import { nextOpenLesson, readLearningCursor } from "@/lib/courses/progress";

/**
 * Recordatorio local: continúa la lección pendiente (cursor o siguiente abierta).
 */
export function DailyCourseReminder() {
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("/outplacement/tablero");

  useEffect(() => {
    const cur = readLearningCursor();
    if (cur) {
      const course = getCourseById(cur.courseId);
      const lesson = course?.lessons.find((l) => l.id === cur.lessonId);
      if (course && lesson) {
        setLabel(`${course.short}: ${lesson.title}`);
        setHref(course.href);
        return;
      }
    }
    for (const c of allCareerCourses()) {
      const n = nextOpenLesson(c);
      if (n) {
        setLabel(`${c.short}: ${n.title}`);
        setHref(c.href);
        return;
      }
    }
  }, []);

  if (!label) return null;

  return (
    <section className="bento-card space-y-2" style={{ borderColor: "var(--brand)" }}>
      <p className="text-xs uppercase tracking-[0.12em] muted">Continúa hoy</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs muted">
        Marca la tarea en el curso. Telegram/WhatsApp te recuerdan; el avance vive en tu tablero.
      </p>
      <Link href={href} className="btn-primary">
        Seguir esta lección
      </Link>
      <Link href="/outplacement/tablero" className="btn-secondary">
        Ver tablero
      </Link>
    </section>
  );
}
