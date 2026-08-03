"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { anonymousBenchmark, type BenchmarkResult } from "@/lib/ats/benchmark";

export default function BenchmarkPage() {
  const [score, setScore] = useState(70);
  const [bench, setBench] = useState<BenchmarkResult | null>(null);

  useEffect(() => {
    try {
      const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
      const s = last?.result?.score;
      if (typeof s === "number") setScore(s);
    } catch {
      /* ignore */
    }
  }, []);

  function run() {
    const b = anonymousBenchmark(score);
    setBench(b);
    try {
      const prev = JSON.parse(localStorage.getItem("ats_benchmark_log") || "[]");
      prev.unshift({ score: b.score, percentile: b.percentile, at: Date.now() });
      localStorage.setItem("ats_benchmark_log", JSON.stringify(prev.slice(0, 30)));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Benchmark anónimo</h1>
          <SpeakButton text="Compara tu score ATS con una referencia LATAM sin compartir datos personales." />
        </div>
        <p className="text-sm muted">
          Sin nombre ni CV: solo el número. La curva es un modelo interno orientativo, no un ranking público.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <label className="text-sm font-medium">
          Tu score ATS ({score}%)
          <input
            type="range"
            min={0}
            max={100}
            className="mt-2 w-full"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </label>
        <button type="button" className="btn-primary" onClick={run}>
          Calcular percentil
        </button>
      </section>

      {bench && (
        <section className="bento-card space-y-2">
          <p className="text-3xl font-semibold">P{bench.percentile}</p>
          <p className="text-xs muted uppercase tracking-wide">{bench.band}</p>
          <p className="text-sm">{bench.message}</p>
          <p className="text-sm muted">{bench.peersHint}</p>
        </section>
      )}

      <Link href="/ats" className="btn-secondary">
        Volver al ATS
      </Link>
    </div>
  );
}
