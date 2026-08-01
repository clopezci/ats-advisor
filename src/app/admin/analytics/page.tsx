"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listJobs } from "@/lib/tracker/jobs";
import { readProgress } from "@/lib/progress/courses";
import { readStreak } from "@/lib/engagement/streak";

type Point = { at: number; score: number };

export default function AnalyticsPage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [jobs, setJobs] = useState(0);
  const [streak, setStreak] = useState(0);
  const [modulesDone, setModulesDone] = useState(0);

  useEffect(() => {
    try {
      setPoints(JSON.parse(localStorage.getItem("ats_history") || "[]"));
      setJobs(listJobs().length);
      setStreak(readStreak().count);
      const prog = readProgress();
      setModulesDone(Object.values(prog).reduce((a, p) => a + (p.completed?.length || 0), 0));
    } catch {
      setPoints([]);
    }
  }, []);

  const avg = points.length
    ? Math.round(points.reduce((a, p) => a + p.score, 0) / points.length)
    : 0;
  const trend = useMemo(() => {
    if (points.length < 2) return "Sin tendencia aún";
    const recent = points.slice(0, 3).reduce((a, p) => a + p.score, 0) / Math.min(3, points.length);
    const older = points.slice(3, 6);
    if (!older.length) return "Recopilando baseline";
    const oldAvg = older.reduce((a, p) => a + p.score, 0) / older.length;
    const delta = Math.round(recent - oldAvg);
    if (delta > 3) return `Mejora +${delta} pts vs anteriores`;
    if (delta < -3) return `Baja ${delta} pts vs anteriores`;
    return "Estable";
  }, [points]);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-sm muted">
        Vista básica (gratis). Pro con correlaciones/previsiones cuando actives Supabase + add-on.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bento-card">
          <p className="text-xs muted">Análisis ATS</p>
          <p className="text-3xl font-semibold">{points.length}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Score promedio</p>
          <p className="text-3xl font-semibold score-ring">{avg}%</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Vacantes tracker</p>
          <p className="text-3xl font-semibold">{jobs}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Racha / cápsulas</p>
          <p className="text-3xl font-semibold">
            {streak}/{modulesDone}
          </p>
        </div>
      </div>

      <section className="bento-card">
        <p className="text-sm font-medium">Tendencia de scores</p>
        <p className="text-sm muted mt-1">{trend}</p>
      </section>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Últimos scores</h2>
        {points.length === 0 && <p className="text-sm muted">Aún no hay datos en este dispositivo.</p>}
        {points.slice(0, 10).map((p) => (
          <div key={p.at} className="flex justify-between text-sm">
            <span className="muted">{new Date(p.at).toLocaleString("es-CO")}</span>
            <span className="font-medium">{p.score}%</span>
          </div>
        ))}
      </section>

      <Link href="/admin/analytics/pro" className="btn-primary">
        Abrir Analytics Pro
      </Link>
      <Link href="/admin" className="btn-secondary">
        Volver a admin
      </Link>
    </div>
  );
}
