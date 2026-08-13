"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CvPasteField, JobPasteField } from "@/components/CvPasteField";
import { SCREENING_Q_EXAMPLE } from "@/lib/copy/fieldExamples";
import { HintTextarea } from "@/components/HintTextarea";
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
          <h1 className="text-xl font-semibold">Preguntas del formulario de postulación</h1>
          <SpeakButton text="Carga tu CV, pega la oferta y, si el portal ya te hizo preguntas, escríbelas. Generamos respuestas honestas para copiar." />
        </div>
        <p className="text-sm muted leading-relaxed">
          No enviamos nada al portal. Tú copias el texto al formulario de LinkedIn, Computrabajo o la empresa.
        </p>
      </section>

      <CvPasteField
        value={cv}
        onChange={setCv}
        label="Tu hoja de vida"
        hint="El CV tuyo. Con eso armamos respuestas honestas. No pongas aquí las preguntas del portal."
      />
      <JobPasteField
        value={job}
        onChange={setJob}
        label="El aviso de la vacante"
        hint="El texto del empleo. Así las respuestas coinciden con lo que piden. No es tu CV."
      />

      <div className="bento-card space-y-2">
        <HintTextarea
          label="Preguntas que te hizo el portal (opcional)"
          hint="Si LinkedIn o Computrabajo ya te mostró preguntas, pégalas (una por línea). Si no, déjalo vacío."
          example={SCREENING_Q_EXAMPLE}
          value={extraQ}
          onChange={setExtraQ}
          minClass="min-h-24"
        />
        {questions.length > 0 && (
          <ul className="text-xs muted space-y-1">
            {questions.slice(0, 8).map((q) => (
              <li key={q}>• {q}</li>
            ))}
          </ul>
        )}
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
              alert("Copiado. Pégalo en el formulario del portal.");
            }}
          >
            Copiar
          </button>
        </section>
      )}

      <Link href="/ats/portales" className="btn-secondary">
        Volver a los sitios de empleo
      </Link>
    </div>
  );
}
