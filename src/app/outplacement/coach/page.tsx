"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";

export default function CoachPage() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (prompt.trim().length < 8) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          prompt: `Eres coach de outplacement. Responde en español LATAM, concreto, con 3–6 pasos accionables. Pregunta del usuario: ${prompt}`,
        }),
      });
      const data = await res.json();
      setAnswer(data.text || data.error || "Sin respuesta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Coach outplacement</h1>
          <SpeakButton text="Pregunta al coach. Usa la base de conocimiento de outplacement, STAR y empleo." />
        </div>
        <p className="text-sm muted">RAG por palabras clave sobre knowledge_base (sin embeddings cloud).</p>
      </section>
      <textarea
        className="field min-h-28"
        placeholder="Ej.: ¿Cómo preparo una entrevista de filtro para analista financiero?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <DictationButton onResult={(t) => setPrompt((p) => `${p} ${t}`.trim())} />
      <button type="button" className="btn-primary" disabled={loading || prompt.length < 8} onClick={ask}>
        {loading ? "Pensando…" : "Preguntar"}
      </button>
      {answer && (
        <section className="bento-card space-y-2">
          <SpeakButton text={answer.slice(0, 900)} />
          <pre className="whitespace-pre-wrap text-sm font-sans">{answer}</pre>
        </section>
      )}
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
