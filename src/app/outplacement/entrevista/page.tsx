"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { VoiceTextarea } from "@/components/VoiceField";
import { SpeakButton } from "@/components/SpeakButton";
import { scoreStarAnswer, STAR_BANK } from "@/lib/interview/star";

export default function EntrevistaPage() {
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobHint, setJobHint] = useState("");

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.jobText) setJobHint(ws.jobText.slice(0, 400));
    } catch {
      /* ignore */
    }
  }, []);

  const item = STAR_BANK[qIndex % STAR_BANK.length];
  const local = useMemo(() => (answer.trim().length >= 40 ? scoreStarAnswer(answer) : null), [answer]);

  async function evaluate() {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "interview_feedback",
          useKnowledge: true,
          prompt: [
            "Eres coach de entrevistas LATAM. Evalúa con rúbrica STAR (Situación, Tarea, Acción, Resultado).",
            `Pregunta: ${item.q}`,
            `Respuesta: ${answer}`,
            jobHint ? `Contexto vacante (extracto): ${jobHint}` : "",
            "Devuelve: 1) score STAR /10 por dimensión 2) qué faltó 3) versión mejorada 5-8 líneas SIN inventar hechos 4) tip de 8s para el reclutador.",
          ]
            .filter(Boolean)
            .join("\n"),
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
          <h1 className="text-xl font-semibold">Simulador STAR</h1>
          <SpeakButton text={`${item.q}. Responde con Situación, Tarea, Acción y Resultado.`} />
        </div>
        <p className="text-sm muted">OUT-07 · banco ampliado + score local STAR + feedback IA.</p>
        {jobHint && <p className="text-xs muted">Usando extracto de tu última oferta del ATS.</p>}
      </section>

      <section className="bento-card space-y-3">
        <p className="font-medium">{item.q}</p>
        <p className="text-xs muted">{item.hint}</p>
        <VoiceTextarea
          label="Tu respuesta"
          value={answer}
          onChange={setAnswer}
          className="field min-h-32"
          placeholder="Ejemplo: En el banco el cierre tardaba 8 días. Me pidieron bajarlo. Armé un tablero en Power BI y quedó en 3 días."
          dictationLabel="Dictar respuesta"
        />
        {local && (
          <div className="text-sm space-y-1">
            <p className="font-semibold">Score STAR local: {local.total}%</p>
            <p className="text-xs muted">
              S {local.situation} · T {local.task} · A {local.action} · R {local.result}
            </p>
            <ul className="text-xs muted space-y-1">
              {local.tips.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <button type="button" className="btn-primary" disabled={loading || answer.trim().length < 20} onClick={evaluate}>
        {loading ? "Evaluando…" : "Feedback coach IA"}
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
        Siguiente pregunta ({(qIndex % STAR_BANK.length) + 1}/{STAR_BANK.length})
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

      <Link href="/ats/pack" className="btn-secondary">
        Pack listo para enviar
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
