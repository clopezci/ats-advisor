"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";

const BANK: Record<string, string[]> = {
  general: [
    "Cuéntame de ti en 90 segundos.",
    "¿Cuál es tu mayor logro profesional?",
    "¿Por qué quieres este rol?",
    "¿Cómo manejas la presión y los plazos?",
  ],
  liderazgo: [
    "Describe un conflicto en tu equipo y cómo lo resolviste.",
    "¿Cómo priorizas cuando todo es urgente?",
    "Cuéntame de una decisión difícil con poco información.",
  ],
  tecnico: [
    "Explica un proyecto técnico complejo a alguien no técnico.",
    "¿Cómo garantizas calidad en tu trabajo?",
    "Describe un fallo técnico que causaste y qué aprendiste.",
  ],
  finanzas: [
    "¿Cómo construyes un forecast confiable?",
    "Cuéntame de un KPI que hayas mejorado.",
    "¿Cómo presentas malas noticias financieras a dirección?",
  ],
};

export default function BancoEntrevistaPage() {
  const [track, setTrack] = useState<keyof typeof BANK>("general");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = useMemo(() => BANK[track], [track]);
  const question = questions[idx % questions.length];

  async function evaluate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "interview_feedback",
          prompt: `Pregunta de entrevista (${track}): ${question}. Respuesta: ${answer}. Feedback breve STAR en español, qué mejorar y versión mejorada corta. No inventes hechos.`,
        }),
      });
      const data = await res.json();
      setFeedback(data.text || data.error || "Sin feedback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Banco de entrevistas</h1>
          <SpeakButton text={question} />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto">
        {(Object.keys(BANK) as (keyof typeof BANK)[]).map((k) => (
          <button
            key={k}
            type="button"
            className="pill-brand"
            onClick={() => {
              setTrack(k);
              setIdx(0);
              setAnswer("");
              setFeedback("");
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <section className="bento-card space-y-3">
        <p className="font-medium">{question}</p>
        <div className="flex justify-between">
          <span className="text-xs muted">Tu respuesta</span>
          <DictationButton onResult={(t) => setAnswer((p) => (p ? `${p} ${t}` : t))} />
        </div>
        <textarea className="field min-h-28" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </section>

      <button type="button" className="btn-primary" disabled={loading || answer.length < 20} onClick={evaluate}>
        {loading ? "Evaluando…" : "Feedback IA"}
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          setIdx((i) => i + 1);
          setAnswer("");
          setFeedback("");
        }}
      >
        Otra pregunta
      </button>

      {feedback && (
        <section className="bento-card">
          <SpeakButton text={feedback} />
          <p className="mt-2 text-sm muted whitespace-pre-wrap">{feedback}</p>
        </section>
      )}

      <Link href="/outplacement/entrevista" className="btn-secondary">
        Simulador completo
      </Link>
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
