"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { buildAnalyticsPro, type AnalyticsProInsight } from "@/lib/analytics/pro";

type Point = { at: number; score: number };

export default function AnalyticsProPage() {
  const [insights, setInsights] = useState<AnalyticsProInsight[]>([]);
  const [forecast, setForecast] = useState<number | null>(null);
  const [funnel, setFunnel] = useState({ interes: 0, aplicado: 0, entrevista: 0, oferta: 0 });
  const [corr, setCorr] = useState<number | null>(null);

  useEffect(() => {
    try {
      const points: Point[] = JSON.parse(localStorage.getItem("ats_history") || "[]");
      const pro = buildAnalyticsPro(points);
      setInsights(pro.insights);
      setForecast(pro.forecast);
      setFunnel(pro.funnel);
      setCorr(pro.corrScoreVsInterviews);
    } catch {
      setInsights([]);
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="pill-brand">Analytics Pro · F16</p>
            <h1 className="mt-2 text-xl font-semibold">Correlaciones y foresight</h1>
          </div>
          <SpeakButton text="Analytics Pro analiza scores ATS, funnel del tracker, racha y cohorte B2B en este dispositivo. Con Supabase se ampliará a cloud." />
        </div>
        <p className="text-sm muted">
          Demo local. Add-on cloud cuando actives Supabase + billing Analytics Pro.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="bento-card">
          <p className="text-xs muted">Score previsto</p>
          <p className="text-3xl font-semibold score-ring">{forecast ?? "—"}{forecast != null ? "%" : ""}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">r score↔entrevista</p>
          <p className="text-3xl font-semibold">{corr != null ? corr.toFixed(2) : "—"}</p>
        </div>
      </div>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Funnel tracker</h2>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {(
            [
              ["Interés", funnel.interes],
              ["Aplicado", funnel.aplicado],
              ["Entrevista", funnel.entrevista],
              ["Oferta", funnel.oferta],
            ] as const
          ).map(([l, v]) => (
            <div key={l}>
              <p className="text-lg font-semibold">{v}</p>
              <p className="muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        {insights.map((i) => (
          <article key={i.id} className="bento-card space-y-1">
            <p className="text-xs uppercase tracking-wide muted">{i.severity}</p>
            <h3 className="font-semibold text-sm">{i.title}</h3>
            <p className="text-sm muted">{i.detail}</p>
          </article>
        ))}
      </div>

      <Link href="/admin/analytics" className="btn-secondary">
        Analytics básico
      </Link>
      <Link href="/admin" className="btn-secondary">
        Volver a admin
      </Link>
    </div>
  );
}
