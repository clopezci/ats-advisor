"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allCareerCourses, getCourseById } from "@/lib/courses/catalog";
import { nextOpenLesson, readLearningCursor } from "@/lib/courses/progress";
import { resolveContinueTarget, type ContinueTarget } from "@/lib/engagement/focusPath";

function lessonHref(courseHref: string, lessonId: string) {
  const join = courseHref.includes("?") ? "&" : "?";
  return `${courseHref}${join}lesson=${encodeURIComponent(lessonId)}`;
}

/**
 * Un solo Continuar (cuadernillo). El curso queda como enlace secundario.
 */
export function DailyCourseReminder() {
  const [target, setTarget] = useState<ContinueTarget | null>(null);
  const [courseLabel, setCourseLabel] = useState("");
  const [courseHref, setCourseHref] = useState("");

  useEffect(() => {
    setTarget(resolveContinueTarget());

    let courseLabel = "";
    let courseHref = "";
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
    setCourseLabel(courseLabel);
    setCourseHref(courseHref);
  }, []);

  if (!target) return null;

  return (
    <section className="bento-card space-y-3" style={{ borderColor: "var(--brand)" }}>
      <p className="text-xs uppercase tracking-[0.12em] muted">Continúa hoy</p>
      <Link
        href={target.href}
        className="btn-primary"
        style={{ minHeight: "3.5rem", lineHeight: 1.3 }}
      >
        {target.label}
        <span className="block text-xs font-normal opacity-90">{target.hint}</span>
      </Link>
      {courseLabel && courseHref ? (
        <Link href={courseHref} className="text-sm muted underline">
          Opcional · lección: {courseLabel}
        </Link>
      ) : null}
    </section>
  );
}
