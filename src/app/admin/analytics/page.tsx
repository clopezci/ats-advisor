"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Point = { at: number; score: number };

export default function AnalyticsPage() {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    try {
      setPoints(JSON.parse(localStorage.getItem("ats_history") || "[]"));
    } catch {
      setPoints([]);
    }
  }, []);

  const avg = points.length
    ? Math.round(points.reduce((a, p) => a + p.score, 0) / points.length)
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-sm muted">
        Vista básica (gratis). La versión Pro con correlaciones/previsiones se activa con
        Supabase + costo adicional.
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
      </div>

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

      <Link href="/admin" className="btn-secondary">
        Volver a admin
      </Link>
    </div>
  );
}
