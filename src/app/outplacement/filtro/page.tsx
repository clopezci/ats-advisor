"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { JobPasteField } from "@/components/CvPasteField";
import { pickFiltroQuestions, scoreFiltroAnswers, type FiltroQ } from "@/lib/interview/filtro";

export default function FiltroPredictivoPage() {
  const [job, setJob] = useState("");
  const [questions, setQuestions] = useState<FiltroQ[]>([]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usedAi, setUsedAi] = useState(false);

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.jobText) setJob(ws.jobText);
    } catch {
      /* ignore */
    }
  }, []);

  function buildLocal() {
    if (job.trim().length < 40) {
      setError("Pega más texto de la oferta.");
      return;
    }
    setError("");
    setScore(null);
    setUsedAi(false);
    const qs = pickFiltroQuestions(job, 3);
    setQuestions(qs);
    setAnswers(["", "", ""]);
    setIdx(0);
  }

  async function buildQuestions() {
    if (job.trim().length < 40) {
      setError("Pega más texto de la oferta.");
      return;
    }
    setLoading(true);
    setError("");
    setScore(null);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "interview_feedback",
          useKnowledge: true,
          prompt: `A partir de esta oferta, genera EXACTAMENTE 3 preguntas típicas de filtro telefónico (screening) en JSON:
[{"q":"...","tip":"qué busca el reclutador"}]
Oferta:
${job.slice(0, 3500)}
Solo JSON.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      const cleaned = String(data.text || "").replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as FiltroQ[];
      if (!Array.isArray(parsed) || parsed.length < 3) throw new Error("Formato inválido");
      setQuestions(parsed.slice(0, 3));
      setAnswers(["", "", ""]);
      setIdx(0);
      setUsedAi(true);
    } catch {
      setUsedAi(false);
      buildLocal();
      setError("IA no disponible — usamos banco local LATAM.");
    } finally {
      setLoading(false);
    }
  }

  async function scoreAnswers() {
    setLoading(true);
    setError("");
    const local = scoreFiltroAnswers(answers);
    try {
      const qa = questions.map((q, i) => `P: ${q.q}\nR: ${answers[i] || "(vacía)"}`).join("\n\n");
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "interview_feedback",
          useKnowledge: true,
          prompt: `Evalúa estas 3 respuestas de filtro telefónico.
Devuelve JSON: {"score":0-100,"verdict":"...","improve":["...","..."]}
Oferta (resumen): ${job.slice(0, 1200)}
${qa}
Solo JSON.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      const cleaned = String(data.text || "").replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as { score: number; verdict: string; improve?: string[] };
      setScore(Math.round(Number(parsed.score) || local.score));
      setFeedback(
        `${parsed.verdict || local.verdict}\n\n${(parsed.improve || local.improve).map((x) => `• ${x}`).join("\n")}`
      );
      setUsedAi(true);
    } catch {
      setScore(local.score);
      setFeedback(`${local.verdict}\n\n${local.improve.map((x) => `• ${x}`).join("\n")}`);
      setError("Score local (sin IA).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="pill-brand">Score predictivo</p>
            <h1 className="mt-2 text-xl font-semibold">Filtro telefónico</h1>
          </div>
          <SpeakButton text="Pega la oferta, responde 3 preguntas de filtro y recibe un score. Funciona offline con banco LATAM." />
        </div>
        <p className="text-sm muted">Prefill desde tu workspace ATS si existe.</p>
      </section>

      <JobPasteField value={job} onChange={setJob} />
      <div className="bento-card space-y-2">
        <button type="button" className="btn-primary" disabled={loading} onClick={buildQuestions}>
          {loading ? "Generando…" : "3 preguntas (IA o local)"}
        </button>
        <button type="button" className="btn-secondary" onClick={buildLocal}>
          Solo banco local
        </button>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--danger, #b42318)" }}>
          {error}
        </p>
      )}

      {questions.length > 0 && (
        <section className="bento-card space-y-3">
          <p className="text-xs muted">
            Pregunta {idx + 1}/3 {usedAi ? "· IA" : "· local"}
          </p>
          <p className="font-medium">{questions[idx].q}</p>
          <p className="text-xs muted">{questions[idx].tip}</p>
          <VoiceTextarea
            label="Tu respuesta"
            value={answers[idx]}
            onChange={(t) => {
              const next = [...answers];
              next[idx] = t;
              setAnswers(next);
            }}
            className="field min-h-24"
            placeholder="Ejemplo: Sí, puedo empezar en 15 días. Estoy en Bogotá y acepto híbrido."
            dictationLabel="Dictar respuesta"
          />
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
              Anterior
            </button>
            {idx < 2 ? (
              <button type="button" className="btn-primary" onClick={() => setIdx((i) => i + 1)}>
                Siguiente
              </button>
            ) : (
              <button type="button" className="btn-primary" disabled={loading} onClick={scoreAnswers}>
                {loading ? "Puntuando…" : "Obtener score"}
              </button>
            )}
          </div>
        </section>
      )}

      {score !== null && (
        <section className="bento-card space-y-2">
          <p className="text-3xl font-semibold">{score}%</p>
          <SpeakButton text={feedback.slice(0, 400)} />
          <p className="text-sm muted whitespace-pre-wrap">{feedback}</p>
        </section>
      )}

      <Link href="/outplacement/entrevista" className="btn-secondary">
        Simulador STAR
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
