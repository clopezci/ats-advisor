"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { allCareerCourses } from "@/lib/courses/catalog";
import { courseStats, nextOpenLesson } from "@/lib/courses/progress";
import type { CourseDef } from "@/lib/courses/types";
import { DailyCourseReminder } from "@/components/DailyCourseReminder";

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
          <SpeakButton text="Aquí ves el progreso de cada curso. Sigue la lección pendiente. Telegram o WhatsApp te recuerdan la tarea del día." />
        </div>
        <p className="text-sm muted">
          Cada tarjeta es un curso. Entras, ves solo títulos, abres la lección y marcas tareas.
        </p>
      </section>

      {courses.map((c) => {
        const s = courseStats(c);
        const next = nextOpenLesson(c);
        return (
          <Link key={c.id} href={c.href} className="bento-card block space-y-2">
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

      <Link href="/outplacement/cuadernillo" className="btn-primary">
        Mi cuadernillo
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
