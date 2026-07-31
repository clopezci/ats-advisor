"use client";

import { useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";

const STARTERS = [
  "Cuéntame de un logro reciente con impacto medible.",
  "¿Por qué saliste de tu último empleo?",
  "¿Cuál es tu mayor debilidad y cómo la trabajas?",
  "¿Por qué quieres este rol ahora?",
];

export default function EntrevistaPage() {
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const question = STARTERS[qIndex % STARTERS.length];

  async function evaluate() {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "interview_feedback",
          prompt: `Eres entrevistador exigente pero justo. Pregunta: ${question}. Respuesta del candidato: ${answer}. Da feedback breve en español: tono, estructura STAR, qué mejorar, y una versión mejorada de 4-6 líneas. No inventes hechos.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setFeedback(data.text);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "No se pudo evaluar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Simulador de entrevista</h1>
          <SpeakButton text={`${question}. Responde por voz o texto y pide feedback.`} />
        </div>
        <p className="text-sm muted">OUT-07 · práctica por voz con feedback IA.</p>
      </section>

      <section className="bento-card space-y-3">
        <p className="font-medium">{question}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs muted">Tu respuesta</span>
          <DictationButton onResult={(t) => setAnswer((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <textarea className="field min-h-28" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </section>

      <button type="button" className="btn-primary" disabled={loading || answer.trim().length < 20} onClick={evaluate}>
        {loading ? "Evaluando…" : "Recibir feedback"}
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          setQIndex((i) => i + 1);
          setAnswer("");
          setFeedback("");
        }}
      >
        Otra pregunta
      </button>

      {feedback && (
        <section className="bento-card space-y-2">
          <div className="flex justify-between">
            <h2 className="font-semibold text-sm">Feedback</h2>
            <SpeakButton text={feedback} />
          </div>
          <p className="text-sm muted whitespace-pre-wrap">{feedback}</p>
        </section>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
