"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { allCareerCourses } from "@/lib/courses/catalog";
import { courseStats, nextOpenLesson } from "@/lib/courses/progress";
import type { CourseDef } from "@/lib/courses/types";
import { DailyCourseReminder } from "@/components/DailyCourseReminder";
import { FlowContinueBar } from "@/components/FlowContinueBar";

export function CourseProgressBoard() {
  const [courses, setCourses] = useState<CourseDef[]>([]);

  useEffect(() => {
    setCourses(allCareerCourses());
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <DailyCourseReminder />
      <section className="bento-card space-y-2">
        <div className="flex justify-between gap-2">
          <h1 className="text-2xl font-semibold">Tablero de avance</h1>
          <SpeakButton text="Primero sigue el cuadernillo. Los cursos son práctica extra por tema." />
        </div>
        <p className="text-sm muted">
          Tu camino principal es el cuadernillo (6 fases). Abajo puedes ver cursos opcionales por tema.
        </p>
      </section>

      <FlowContinueBar />

      <Link href="/outplacement/cuadernillo" className="btn-secondary">
        Abrir cuadernillo
      </Link>

      <details className="bento-card space-y-2">
        <summary className="cursor-pointer text-sm font-semibold">Cursos por tema (opcional)</summary>
        <div className="mt-3 flex flex-col gap-3">
          {courses.map((c) => {
            const s = courseStats(c);
            const next = nextOpenLesson(c);
            return (
              <Link key={c.id} href={c.href} className="block space-y-2 rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between gap-2">
                  <h2 className="font-semibold">{c.short}</h2>
                  <span className="text-sm muted">{s.pct}%</span>
                </div>
                <p className="text-xs muted">{c.title}</p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${s.pct}%` }} />
                </div>
                <p className="text-xs muted">
                  {s.doneLessons}/{s.totalLessons} lecciones · {s.doneTasks}/{s.totalTasks} tareas
                  {next ? ` · siguiente: ${next.title}` : " · curso completo"}
                </p>
              </Link>
            );
          })}
        </div>
      </details>

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
