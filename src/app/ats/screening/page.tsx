"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";
import { extractScreeningQuestions, buildScreeningPrompt } from "@/lib/ats/screening";

export default function ScreeningPage() {
  const [cv, setCv] = useState("");
  const [job, setJob] = useState("");
  const [extraQ, setExtraQ] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.cvText) setCv(ws.cvText);
      if (ws?.jobText) setJob(ws.jobText);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const base = extractScreeningQuestions(job);
    const extra = extraQ
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setQuestions([...base, ...extra].slice(0, 12));
  }, [job, extraQ]);

  async function generate() {
    setLoading(true);
    setOut("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "application_advice",
          useKnowledge: true,
          prompt: buildScreeningPrompt({ questions, cvText: cv, jobText: job }),
        }),
      });
      const data = await res.json();
      const text = data.text || data.error || "Sin respuesta";
      setOut(text);
      try {
        if (data.text) localStorage.setItem("ats_screening_answers", data.text);
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Preguntas de screening</h1>
          <SpeakButton text="Respuestas honestas a preguntas del formulario, basadas en tu CV." />
        </div>
        <p className="text-sm muted">
          LinkedIn Easy Apply, Computrabajo y ATS internos preguntan esto. No inventamos experiencia.
        </p>
      </section>

      <div className="bento-card space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">CV</label>
          <DictationButton onResult={(t) => setCv((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <textarea className="field min-h-28" value={cv} onChange={(e) => setCv(e.target.value)} />
      </div>
      <div className="bento-card space-y-2">
        <label className="text-sm font-medium">Oferta</label>
        <textarea className="field min-h-28" value={job} onChange={(e) => setJob(e.target.value)} />
      </div>
      <div className="bento-card space-y-2">
        <label className="text-sm font-medium">Preguntas extra (una por línea)</label>
        <textarea
          className="field min-h-20"
          value={extraQ}
          onChange={(e) => setExtraQ(e.target.value)}
          placeholder="¿Tienes disponibilidad inmediata?"
        />
        <ul className="text-xs muted space-y-1">
          {questions.slice(0, 8).map((q) => (
            <li key={q}>• {q}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="btn-primary"
        disabled={loading || cv.length < 40 || job.length < 40}
        onClick={generate}
      >
        {loading ? "Redactando…" : "Generar respuestas"}
      </button>

      {out && (
        <section className="bento-card space-y-2">
          <SpeakButton text={out.slice(0, 500)} />
          <pre className="text-sm muted whitespace-pre-wrap">{out}</pre>
          <button
            type="button"
            className="btn-secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(out);
              try {
                localStorage.setItem("ats_screening_answers", out);
              } catch {
                /* ignore */
              }
              alert("Copiado");
            }}
          >
            Copiar
          </button>
        </section>
      )}

      <Link href="/ats" className="btn-secondary">
        Volver al ATS
      </Link>
    </div>
  );
}
