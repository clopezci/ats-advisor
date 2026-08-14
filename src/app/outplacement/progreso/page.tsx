"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { allCareerCourses } from "@/lib/courses/catalog";
import { courseStats } from "@/lib/courses/progress";
import { readMissionProgress, xpRank } from "@/lib/engagement/missions";
import { readStreak } from "@/lib/engagement/streak";
import { readCourseProgress, EXTERNAL_COURSES } from "@/lib/outplacement/externalCourses";

export default function ProgresoPage() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rows, setRows] = useState<{ id: string; title: string; pct: number; href: string }[]>([]);
  const [coursesDone, setCoursesDone] = useState(0);
  const [missionsDone, setMissionsDone] = useState(0);

  useEffect(() => {
    const prog = readMissionProgress();
    setXp(prog.xpTotal);
    setMissionsDone(prog.done.length);
    setStreak(readStreak().count);
    setRows(
      allCareerCourses().map((c) => {
        const s = courseStats(c);
        return { id: c.id, title: c.short, pct: s.pct, href: c.href };
      })
    );
    const ext = readCourseProgress();
    setCoursesDone(EXTERNAL_COURSES.filter((c) => ext[c.id] === "done").length);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold">Progreso</h1>
          <SpeakButton text="XP, racha y avance por curso. El tablero visual está en Tablero de avance." />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="bento-card">
          <p className="text-xs muted">XP · {xpRank(xp)}</p>
          <p className="text-3xl font-semibold">{xp}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Racha</p>
          <p className="text-3xl font-semibold">{streak}d</p>
          <p className="text-xs muted">Misiones hoy: {missionsDone}</p>
        </div>
      </div>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Avance por curso</h2>
        {rows.map((r) => (
          <Link key={r.id} href={r.href} className="block">
            <div className="flex justify-between text-sm">
              <span>{r.title}</span>
              <span className="muted">{r.pct}%</span>
            </div>
            <div className="progress-track mt-1">
              <div className="progress-fill" style={{ width: `${r.pct}%` }} />
            </div>
          </Link>
        ))}
        <Link href="/outplacement/tablero" className="btn-primary">
          Abrir tablero completo
        </Link>
      </section>

      <section className="bento-card space-y-2 text-sm">
        <h2 className="font-semibold text-sm">Cursos externos</h2>
        <p className="muted">
          Completados {coursesDone}/{EXTERNAL_COURSES.length}
        </p>
        <Link href="/outplacement/cursos" className="btn-secondary">
          Ver catálogo externo
        </Link>
      </section>

      <Link href="/outplacement/misiones" className="btn-secondary">
        Misiones del día
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
