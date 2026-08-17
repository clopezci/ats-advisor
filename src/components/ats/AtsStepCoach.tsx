"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import type { AtsAnalyzeResult } from "@/lib/ats/engine";
import { atsStepCoachPlaceholder, buildAtsStepCoachContext } from "@/lib/ats/stepCoachContext";
import type { AtsScoreSummary } from "@/lib/ats/scoreSummary";

type Props = {
  step: 1 | 2 | 3 | 4;
  resultPhase?: number;
  atsProfile?: string;
  result?: AtsAnalyzeResult | null;
  summary?: AtsScoreSummary | null;
  cvText?: string;
  jobText?: string;
  /** Ocultar si no hay contexto mínimo para responder bien. */
  disabled?: boolean;
};

/**
 * Coach por paso del ATS. Solo usa IA con contexto estructurado del análisis cuando existe.
 */
export function AtsStepCoach({
  step,
  resultPhase,
  atsProfile,
  result,
  summary,
  cvText = "",
  jobText = "",
  disabled,
}: Props) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  const canAsk = useMemo(() => {
    if (disabled || q.trim().length < 8) return false;
    if (step <= 2) return true;
    if (step === 3) return cvText.trim().length >= 20 && jobText.trim().length >= 20;
    return Boolean(result && summary);
  }, [disabled, step, cvText, jobText, result, summary, q]);

  const placeholder = atsStepCoachPlaceholder(step, resultPhase);

  async function ask() {
    if (q.trim().length < 8) return;
    setLoading(true);
    setA("");
    try {
      const context = buildAtsStepCoachContext({
        step,
        resultPhase,
        atsProfile,
        result,
        summary,
        cvText,
        jobText,
      });
      const task = step === 4 && result ? "ats_suggest" : step >= 2 ? "application_advice" : "general";
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          useKnowledge: true,
          coachModule: "analizador ATS",
          prompt: `${context}\n\nPregunta del usuario: ${q.trim()}\n\nResponde en 3–6 bullets accionables para ESTE paso. Si algo no está en los datos, dilo.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible ahora");
      setA(String(data.text || ""));
    } catch (e) {
      setA(e instanceof Error ? e.message : "No se pudo consultar. Reintenta en un momento.");
    } finally {
      setLoading(false);
    }
  }

  if (step === 4 && !result) return null;

  return (
    <section className="bento-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm">Pregunta sobre este paso</h3>
          <p className="text-xs muted">
            Respuestas con los datos de tu análisis (cuando ya hay resultado). No inventa experiencia.
          </p>
        </div>
        {a ? <SpeakButton text={a} /> : null}
      </div>
      <VoiceTextarea
        label="Tu duda"
        value={q}
        onChange={setQ}
        className="field min-h-20"
        placeholder={placeholder}
        dictationLabel="Dictar pregunta"
      />
      <button
        type="button"
        className="btn-secondary"
        disabled={loading || !canAsk}
        onClick={ask}
      >
        {loading ? "Consultando…" : "Preguntar al coach ATS"}
      </button>
      {a ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{a}</p> : null}
    </section>
  );
}
