"use client";

import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { storedProfileEmail } from "@/lib/client/storedEmail";

/** Pregunta al coach del módulo (TTS-friendly, grounded). */
export function CoachAsk({
  coachModule,
  placeholder = "Ej.: ¿cómo adapto el pitch a un gerente que no me conoce?",
}: {
  coachModule: string;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (q.trim().length < 8) return;
    setLoading(true);
    setA("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          coachModule,
          email: storedProfileEmail(),
          prompt: `Pregunta del usuario sobre “${coachModule}”: ${q.trim()}\nResponde como coach (3–6 pasos o párrafos cortos). Cierra con un siguiente paso.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No disponible");
      setA(String(data.text || ""));
    } catch (e) {
      setA(e instanceof Error ? e.message : "No se pudo consultar al coach.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bento-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm">Pregúntale al coach</h3>
          <p className="text-xs muted">Respuestas con base de conocimiento ATSAdvisor. Puedes oír la respuesta.</p>
        </div>
        {a ? <SpeakButton text={a} /> : null}
      </div>
      <VoiceTextarea
        label="Tu pregunta"
        value={q}
        onChange={setQ}
        className="field min-h-20"
        placeholder={placeholder}
        dictationLabel="Dictar pregunta"
      />
      <button type="button" className="btn-secondary" disabled={loading || q.trim().length < 8} onClick={ask}>
        {loading ? "Consultando…" : "Preguntar"}
      </button>
      {a ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{a}</p> : null}
    </section>
  );
}
