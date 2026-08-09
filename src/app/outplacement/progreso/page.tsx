"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { readProgress } from "@/lib/progress/courses";
import { readMissionProgress, xpRank } from "@/lib/engagement/missions";
import { readStreak } from "@/lib/engagement/streak";
import { readCourseProgress, EXTERNAL_COURSES } from "@/lib/outplacement/externalCourses";

export default function ProgresoPage() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [outRows, setOutRows] = useState<{ code: string; title: string; pct: number }[]>([]);
  const [coursesDone, setCoursesDone] = useState(0);
  const [missionsDone, setMissionsDone] = useState(0);

  useEffect(() => {
    const prog = readMissionProgress();
    setXp(prog.xpTotal);
    setMissionsDone(prog.done.length);
    setStreak(readStreak().count);
    const courseProg = readProgress();
    setOutRows(
      OUTPLACEMENT_MODULES.map((m) => {
        const p = courseProg[m.code];
        const done = p?.completed?.length || 0;
        const pct = Math.round((done / Math.max(1, m.capsules.length)) * 100);
        return { code: m.code, title: m.title, pct };
      })
    );
    const ext = readCourseProgress();
    setCoursesDone(EXTERNAL_COURSES.filter((c) => ext[c.id] === "done").length);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 5 · hábito</p>
            <h1 className="mt-1 text-2xl font-semibold">Tu progreso</h1>
          </div>
          <SpeakButton text="Resumen de XP, racha, módulos OUT y cursos externos en este dispositivo." />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="bento-card">
          <p className="text-xs muted">XP</p>
          <p className="text-3xl font-semibold">{xp}</p>
          <p className="text-xs muted">{xpRank(xp)}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Racha</p>
          <p className="text-3xl font-semibold">{streak}d</p>
          <p className="text-xs muted">Misiones hoy: {missionsDone}</p>
        </div>
      </div>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Ruta OUT-01…08</h2>
        {outRows.map((r) => (
          <Link key={r.code} href={`/outplacement/ruta?code=${r.code}`} className="block">
            <div className="flex justify-between text-sm">
              <span>
                {r.code} · {r.title}
              </span>
              <span className="muted">{r.pct}%</span>
            </div>
            <div className="progress-track mt-1">
              <div className="progress-fill" style={{ width: `${r.pct}%` }} />
            </div>
          </Link>
        ))}
      </section>

      <section className="bento-card space-y-2 text-sm">
        <h2 className="font-semibold text-sm">Cursos externos</h2>
        <p className="muted">
          Completados {coursesDone}/{EXTERNAL_COURSES.length}
        </p>
        <Link href="/outplacement/cursos" className="btn-secondary">
          Abrir catálogo
        </Link>
      </section>

      <Link href="/outplacement/misiones" className="btn-primary">
        Misiones de hoy
      </Link>
      <Link href="/outplacement/plan-semana" className="btn-secondary">
        Plan de la semana
      </Link>
      <Link href="/outplacement/certificado" className="btn-secondary">
        Certificado de avance
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
