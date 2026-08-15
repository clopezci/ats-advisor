"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { storedProfileEmail } from "@/lib/client/storedEmail";

type Round = { q: string; a: string; feedback: string };

const SCENES = [
  {
    id: "filtro",
    label: "Filtro telefónico",
    questions: [
      "Cuéntame en un minuto quién eres profesionalmente y qué buscas ahora.",
      "¿Por qué saliste de tu último rol (o por qué quieres cambiar)?",
      "¿Cuál es tu expectativa salarial y disponibilidad?",
    ],
  },
  {
    id: "competencias",
    label: "Panel de competencias",
    questions: [
      "Cuéntame un logro reciente con resultado medible (usa STAR o SOAR).",
      "Describe un conflicto o presión y cómo lo manejaste.",
      "¿Qué preguntas tienes para nosotros?",
    ],
  },
] as const;

export default function RoleplayPage() {
  const [sceneId, setSceneId] = useState<(typeof SCENES)[number]["id"]>("filtro");
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobHint, setJobHint] = useState("");

  const scene = SCENES.find((s) => s.id === sceneId) || SCENES[0];
  const question = scene.questions[step] || scene.questions[0];
  const done = step >= scene.questions.length;

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.jobText) setJobHint(String(ws.jobText).slice(0, 500));
    } catch {
      /* ignore */
    }
  }, []);

  function resetScene(id: (typeof SCENES)[number]["id"]) {
    setSceneId(id);
    setStep(0);
    setAnswer("");
    setRounds([]);
  }

  async function submitAnswer() {
    if (answer.trim().length < 20 || done) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedProfileEmail(),
          task: "interview_feedback",
          useKnowledge: true,
          coachPersona: "gabriel",
          coachModule: "entrevistas",
          prompt: [
            "Eres Gabriel, coach de entrevistas ATSAdvisor. Evalúa esta respuesta de roleplay.",
            `Escena: ${scene.label}. Pregunta ${step + 1}/${scene.questions.length}: ${question}`,
            `Respuesta del candidato: ${answer.trim()}`,
            jobHint ? `Contexto vacante (extracto): ${jobHint}` : "",
            "Aplica rúbrica: Claridad, Estructura, Evidencia, Encaje, Profesionalismo (0–2 c/u, total /10).",
            "Formato: puntajes; 2 fortalezas; 2 mejoras; versión mejorada 5–8 líneas SIN inventar hechos; siguiente paso 1 línea.",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      const data = await res.json();
      const feedback =
        data.text ||
        data.error ||
        "Offline: revisa STAR (Situación, Tarea, Acción, Resultado) y agrega un número o antes/después.";
      setRounds((r) => [...r, { q: question, a: answer.trim(), feedback }]);
      setAnswer("");
      setStep((s) => s + 1);
    } catch {
      setRounds((r) => [
        ...r,
        {
          q: question,
          a: answer.trim(),
          feedback:
            "No hubo IA. Revisa: ¿hay resultado medible? ¿hablaste en primera persona? ¿cabes en 90s?",
        },
      ]);
      setAnswer("");
      setStep((s) => s + 1);
    } finally {
      setLoading(false);
    }
  }

  const intro =
    "Roleplay con Gabriel. Responde como en entrevista real; recibirás rúbrica por cada pregunta.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Coach Gabriel · práctica</p>
            <h1 className="text-2xl font-semibold">Roleplay de entrevista</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
        {jobHint ? (
          <p className="text-xs muted">Usando extracto de tu última oferta del ATS para encaje.</p>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        {SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            className="btn-secondary"
            style={
              sceneId === s.id
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : { width: "auto" }
            }
            onClick={() => resetScene(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {!done ? (
        <section className="bento-card space-y-3">
          <p className="text-xs muted">
            Pregunta {step + 1} de {scene.questions.length}
          </p>
          <p className="font-medium text-sm">{question}</p>
          <SpeakButton text={question} />
          <VoiceTextarea
            label="Tu respuesta"
            value={answer}
            onChange={setAnswer}
            className="field min-h-28"
            placeholder="Habla como si estuvieras en la llamada…"
            dictationLabel="Dictar respuesta"
          />
          <button
            type="button"
            className="btn-primary"
            disabled={loading || answer.trim().length < 20}
            onClick={submitAnswer}
          >
            {loading ? "Evaluando…" : "Enviar y recibir feedback"}
          </button>
        </section>
      ) : (
        <section className="bento-card space-y-2">
          <p className="font-semibold text-sm">Ronda completa</p>
          <p className="text-sm muted">
            Revisa el feedback abajo. Puedes repetir la escena o cambiar a panel de competencias.
          </p>
          <button type="button" className="btn-primary" onClick={() => resetScene(sceneId)}>
            Repetir esta escena
          </button>
        </section>
      )}

      {[...rounds].reverse().map((r, i) => (
        <section key={i} className="bento-card space-y-2">
          <p className="text-xs muted">Pregunta</p>
          <p className="text-sm font-medium">{r.q}</p>
          <p className="text-xs muted">Tu respuesta</p>
          <p className="text-sm whitespace-pre-wrap">{r.a}</p>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs muted">Feedback Gabriel</p>
            <SpeakButton text={r.feedback.slice(0, 800)} />
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{r.feedback}</p>
        </section>
      ))}

      <Link href="/outplacement/coaches" className="btn-secondary">
        Hablar con otros coaches
      </Link>
      <Link href="/outplacement/entrevista" className="btn-secondary">
        Simulador STAR (curso)
      </Link>
      <Link href="/outplacement" className="text-center text-sm muted">
        Volver
      </Link>
    </div>
  );
}
