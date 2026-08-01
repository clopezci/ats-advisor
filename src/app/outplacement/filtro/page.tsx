"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";

type Q = { q: string; tip: string };

export default function FiltroPredictivoPage() {
  const [job, setJob] = useState("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const parsed = JSON.parse(cleaned) as Q[];
      if (!Array.isArray(parsed) || parsed.length < 3) throw new Error("Formato inválido");
      setQuestions(parsed.slice(0, 3));
      setAnswers(["", "", ""]);
      setIdx(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron generar preguntas");
    } finally {
      setLoading(false);
    }
  }

  async function scoreAnswers() {
    setLoading(true);
    setError("");
    try {
      const qa = questions
        .map((q, i) => `P: ${q.q}\nR: ${answers[i] || "(vacía)"}`)
        .join("\n\n");
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "interview_feedback",
          useKnowledge: true,
          prompt: `Evalúa estas 3 respuestas de filtro telefónico para la oferta.
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
      setScore(Math.round(Number(parsed.score) || 0));
      setFeedback(
        `${parsed.verdict || ""}\n\n${(parsed.improve || []).map((x) => `• ${x}`).join("\n")}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo puntuar");
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
          <SpeakButton text="Pega la oferta, responde 3 preguntas típicas de filtro y recibe un score predictivo de llamada." />
        </div>
        <p className="text-sm muted">3 preguntas · responde con voz o texto · score de probabilidad de pasar.</p>
      </section>

      {!questions.length && (
        <>
          <textarea
            className="field min-h-36"
            placeholder="Pega la oferta de empleo…"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />
          <button type="button" className="btn-primary" disabled={loading} onClick={buildQuestions}>
            {loading ? "Generando…" : "Generar 3 preguntas de filtro"}
          </button>
        </>
      )}

      {questions.length > 0 && score === null && (
        <section className="bento-card space-y-3">
          <p className="text-xs muted">
            Pregunta {idx + 1} de 3 · {questions[idx]?.tip}
          </p>
          <p className="font-medium">{questions[idx]?.q}</p>
          <SpeakButton text={questions[idx]?.q || ""} />
          <textarea
            className="field min-h-28"
            value={answers[idx]}
            onChange={(e) => {
              const next = [...answers];
              next[idx] = e.target.value;
              setAnswers(next);
            }}
          />
          <DictationButton
            onResult={(t) => {
              const next = [...answers];
              next[idx] = `${next[idx] ? next[idx] + " " : ""}${t}`.trim();
              setAnswers(next);
            }}
          />
          <div className="flex flex-col gap-2">
            {idx < 2 ? (
              <button type="button" className="btn-primary" onClick={() => setIdx(idx + 1)}>
                Siguiente
              </button>
            ) : (
              <button type="button" className="btn-primary" disabled={loading} onClick={scoreAnswers}>
                {loading ? "Puntuando…" : "Calcular score"}
              </button>
            )}
            {idx > 0 && (
              <button type="button" className="btn-secondary" onClick={() => setIdx(idx - 1)}>
                Anterior
              </button>
            )}
          </div>
        </section>
      )}

      {score !== null && (
        <section className="bento-card space-y-3">
          <p className="text-xs muted">Probabilidad de pasar el filtro</p>
          <p className="text-4xl font-semibold score-ring">{score}%</p>
          <p className="text-sm whitespace-pre-wrap">{feedback}</p>
          <SpeakButton text={`Tu score es ${score} por ciento. ${feedback}`} />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setQuestions([]);
              setScore(null);
              setFeedback("");
            }}
          >
            Nueva simulación
          </button>
        </section>
      )}

      {error && <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>}
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
