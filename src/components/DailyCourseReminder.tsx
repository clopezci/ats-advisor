"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allCareerCourses, getCourseById } from "@/lib/courses/catalog";
import { nextOpenLesson, readLearningCursor } from "@/lib/courses/progress";
import { nextWorkbookModule, readWorkbook, workbookProgress } from "@/lib/workbook/types";

function lessonHref(courseHref: string, lessonId: string) {
  const join = courseHref.includes("?") ? "&" : "?";
  return `${courseHref}${join}lesson=${encodeURIComponent(lessonId)}`;
}

/**
 * Continúa hoy: lección de curso + siguiente bloque del cuadernillo.
 */
export function DailyCourseReminder() {
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("/outplacement/tablero");
  const [wbLabel, setWbLabel] = useState("");
  const [wbHref, setWbHref] = useState("/outplacement/cuadernillo");
  const [wbPct, setWbPct] = useState(0);

  useEffect(() => {
    let courseLabel = "";
    let courseHref = "/outplacement/tablero";

    const cur = readLearningCursor();
    if (cur) {
      const course = getCourseById(cur.courseId);
      const lesson = course?.lessons.find((l) => l.id === cur.lessonId);
      if (course && lesson) {
        courseLabel = `${course.short}: ${lesson.title}`;
        courseHref = lessonHref(course.href, lesson.id);
      }
    }
    if (!courseLabel) {
      for (const c of allCareerCourses()) {
        const n = nextOpenLesson(c);
        if (n) {
          courseLabel = `${c.short}: ${n.title}`;
          courseHref = lessonHref(c.href, n.id);
          break;
        }
      }
    }
    setLabel(courseLabel);
    setHref(courseHref);

    const wb = readWorkbook();
    const prog = workbookProgress(wb);
    setWbPct(prog.pct);
    const next = nextWorkbookModule(wb);
    if (next) {
      setWbLabel(next.title);
      setWbHref(next.href);
    } else {
      setWbLabel("Cuadernillo completo — revisa funnel");
      setWbHref("/outplacement/cuadernillo/funnel");
    }
  }, []);

  if (!label && !wbLabel) return null;

  return (
    <section className="bento-card space-y-3" style={{ borderColor: "var(--brand)" }}>
      <p className="text-xs uppercase tracking-[0.12em] muted">Continúa hoy</p>
      {label ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Curso: {label}</p>
          <Link href={href} className="btn-primary">
            Seguir esta lección
          </Link>
        </div>
      ) : null}
      {wbLabel ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Cuadernillo: {wbLabel}</p>
          <p className="text-xs muted">Avance {wbPct}% · Telegram: /cuadernillo</p>
          <Link href={wbHref} className="btn-secondary">
            Abrir bloque del cuadernillo
          </Link>
        </div>
      ) : null}
      <Link href="/outplacement/tablero" className="btn-secondary">
        Ver tablero
      </Link>
    </section>
  );
}
