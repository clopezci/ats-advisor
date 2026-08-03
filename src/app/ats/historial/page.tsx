"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { readAtsHistory, type AtsHistoryEntry } from "@/lib/ats/history";

export default function HistorialPage() {
  const [points, setPoints] = useState<AtsHistoryEntry[]>([]);

  useEffect(() => {
    setPoints(readAtsHistory());
  }, []);

  const best = points.reduce((m, p) => Math.max(m, p.score), 0);
  const avg = points.length
    ? Math.round(points.reduce((a, p) => a + p.score, 0) / points.length)
    : 0;

  const spark = useMemo(() => {
    const slice = [...points].slice(0, 12).reverse();
    if (!slice.length) return null;
    const max = Math.max(...slice.map((p) => p.score), 1);
    return slice.map((p) => Math.round((p.score / max) * 40));
  }, [points]);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Historial ATS</h1>
          <SpeakButton
            text={`Has hecho ${points.length} análisis. Promedio ${avg} por ciento. Mejor ${best}.`}
          />
        </div>
        <p className="text-sm muted">Guarda score, vacante, perfil ATS y must-have faltantes.</p>
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

      {spark && (
        <section className="bento-card">
          <p className="text-xs muted mb-2">Tendencia (últimos análisis)</p>
          <div className="flex items-end gap-1 h-12">
            {spark.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{ height: `${Math.max(4, h)}px`, background: "var(--brand)", opacity: 0.35 + h / 80 }}
                title={`${points[spark.length - 1 - i]?.score ?? ""}%`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="bento-card space-y-2">
        {points.length === 0 && <p className="text-sm muted">Aún no hay análisis guardados.</p>}
        {points.map((p) => (
          <div
            key={p.id}
            className="border-b py-3 space-y-1"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between text-sm gap-2">
              <span className="font-medium">{p.jobTitle}</span>
              <span className="font-semibold" style={{ color: "var(--brand)" }}>
                {p.score}%
              </span>
            </div>
            <p className="text-xs muted">
              {new Date(p.at).toLocaleString("es-CO")} · perfil {p.profile}
              {p.semanticScore != null ? ` · semántico ${p.semanticScore}%` : ""}
              {p.embeddingProvider ? ` · ${p.embeddingProvider}` : ""}
            </p>
            {p.jobSnippet && <p className="text-xs muted line-clamp-2">{p.jobSnippet}</p>}
            {p.mustMissing?.length > 0 && (
              <p className="text-xs muted">Must-have faltantes: {p.mustMissing.slice(0, 6).join(", ")}</p>
            )}
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
