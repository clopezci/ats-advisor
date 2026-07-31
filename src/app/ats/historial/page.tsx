"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

type Point = { at: number; score: number };

export default function HistorialPage() {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    try {
      setPoints(JSON.parse(localStorage.getItem("ats_history") || "[]"));
    } catch {
      setPoints([]);
    }
  }, []);

  const best = points.reduce((m, p) => Math.max(m, p.score), 0);
  const avg = points.length
    ? Math.round(points.reduce((a, p) => a + p.score, 0) / points.length)
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Historial ATS</h1>
          <SpeakButton text={`Has hecho ${points.length} análisis. Promedio ${avg} por ciento. Mejor ${best}.`} />
        </div>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <div className="bento-card">
          <p className="text-xs muted">Total</p>
          <p className="text-2xl font-semibold">{points.length}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Promedio</p>
          <p className="text-2xl font-semibold score-ring">{avg}%</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Mejor</p>
          <p className="text-2xl font-semibold">{best}%</p>
        </div>
      </div>

      <section className="bento-card space-y-2">
        {points.length === 0 && <p className="text-sm muted">Aún no hay análisis guardados.</p>}
        {points.map((p) => (
          <div key={p.at} className="flex justify-between text-sm border-b py-2" style={{ borderColor: "var(--border)" }}>
            <span className="muted">{new Date(p.at).toLocaleString("es-CO")}</span>
            <span className="font-medium">{p.score}%</span>
          </div>
        ))}
      </section>

      <Link href="/ats" className="btn-primary">
        Nuevo análisis
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
