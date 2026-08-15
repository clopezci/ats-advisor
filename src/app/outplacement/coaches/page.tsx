"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import {
  COACH_PERSONAS,
  getCoachPersona,
  type CoachPersonaId,
} from "@/lib/coaches/personas";
import { storedProfileEmail } from "@/lib/client/storedEmail";

type Msg = { role: "user" | "coach"; text: string };

const STORAGE_KEY = "ats_coach_personas_v1";

export default function CoachPersonasPage() {
  const [personaId, setPersonaId] = useState<CoachPersonaId>("elena");
  const [prompt, setPrompt] = useState("");
  const [thread, setThread] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const persona = getCoachPersona(personaId);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (raw?.personaId) setPersonaId(raw.personaId);
      if (Array.isArray(raw?.thread)) setThread(raw.thread.slice(-40));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(nextPersona: CoachPersonaId, nextThread: Msg[]) {
    setPersonaId(nextPersona);
    setThread(nextThread);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ personaId: nextPersona, thread: nextThread.slice(-40) })
      );
    } catch {
      /* ignore */
    }
  }

  function switchPersona(id: CoachPersonaId) {
    persist(id, []);
  }

  async function ask(text?: string) {
    const q = (text ?? prompt).trim();
    if (q.length < 8) return;
    const userMsg: Msg = { role: "user", text: q };
    const history = [...thread, userMsg];
    persist(personaId, history);
    setPrompt("");
    setLoading(true);
    try {
      const prior = history
        .slice(-6)
        .map((m) => `${m.role === "user" ? "Usuario" : persona.name}: ${m.text}`)
        .join("\n");
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          coachPersona: personaId,
          coachModule: persona.coachModule,
          email: storedProfileEmail(),
          prompt: [
            `Habla como ${persona.name} (${persona.specialty}).`,
            "Historial reciente:",
            prior,
            "Responde solo el mensaje del coach (sin prefijo con tu nombre).",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      const reply = data.text || data.error || persona.offlineTip;
      persist(personaId, [...history, { role: "coach", text: reply }]);
    } catch {
      persist(personaId, [...history, { role: "coach", text: persona.offlineTip }]);
    } finally {
      setLoading(false);
    }
  }

  const intro = `${persona.name}, ${persona.specialty}. ${persona.blurb}`;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Carrera · coaches</p>
            <h1 className="mt-1 text-2xl font-semibold">Tus coaches</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">
          Especialistas de ATSAdvisor. Elige uno, pregunta o usa una sugerencia. Puedes oír las
          respuestas.
        </p>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        {COACH_PERSONAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="bento-card text-left space-y-1"
            style={
              personaId === p.id
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : undefined
            }
            onClick={() => switchPersona(p.id)}
          >
            <p className="font-semibold text-sm">{p.name}</p>
            <p className="text-xs muted">{p.specialty}</p>
          </button>
        ))}
      </div>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">
          {persona.name} · {persona.specialty}
        </h2>
        <p className="text-sm muted">{persona.blurb}</p>
        <div className="flex flex-col gap-2">
          {persona.starterQuestions.map((q) => (
            <button
              key={q}
              type="button"
              className="btn-secondary text-left text-sm"
              disabled={loading}
              onClick={() => ask(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {thread.map((m, i) => (
        <section key={`${m.role}-${i}`} className="bento-card space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs muted">{m.role === "user" ? "Tú" : persona.name}</p>
            {m.role === "coach" ? <SpeakButton text={m.text.slice(0, 800)} /> : null}
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
        </section>
      ))}

      <VoiceTextarea
        label={`Mensaje para ${persona.name}`}
        value={prompt}
        onChange={setPrompt}
        className="field min-h-24"
        placeholder="Cuéntale tu situación o pega un borrador para revisar…"
        dictationLabel="Dictar"
      />
      <button
        type="button"
        className="btn-primary"
        disabled={loading || prompt.trim().length < 8}
        onClick={() => ask()}
      >
        {loading ? "Pensando…" : "Enviar"}
      </button>
      <button type="button" className="btn-secondary" onClick={() => persist(personaId, [])}>
        Limpiar chat de {persona.name}
      </button>

      <Link href="/outplacement/roleplay" className="btn-secondary">
        Roleplay de entrevista (Gabriel)
      </Link>
      <Link href="/outplacement/cuadernillo" className="btn-secondary">
        Mi cuadernillo
      </Link>
      <Link href="/outplacement" className="text-center text-sm muted">
        Volver
      </Link>
    </div>
  );
}
