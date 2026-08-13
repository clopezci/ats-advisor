"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";

type Msg = { role: "user" | "coach"; text: string };

const MODES = [
  { id: "general", label: "General", hint: "Pasos accionables de transición" },
  { id: "filtro", label: "Filtro", hint: "Screening telefónico" },
  { id: "star", label: "STAR", hint: "Historias de entrevista" },
  { id: "negociacion", label: "Negociación", hint: "Salario y ofertas" },
  { id: "networking", label: "Networking", hint: "Mensajes y referidos" },
] as const;

const OFFLINE: Record<(typeof MODES)[number]["id"], string> = {
  general:
    "Offline: 1) aclara objetivo de rol 2) actualiza CV ATS 3) 5 postulaciones/semana 4) 3 contactos networking 5) practica filtro.",
  filtro:
    "Offline filtro: resume en 60s, expectativa salarial con piso/meta, 1 ejemplo STAR, pregunta por siguientes pasos.",
  star: "Offline STAR: Situación → Tarea → Acción (tú) → Resultado con número. Máx. 90 segundos.",
  negociacion:
    "Offline negociación: investiga banda, no digas número primero si puedes, pide 24h, negocia paquete total.",
  networking:
    "Offline networking: 5 mensajes/semana, plantilla corta, follow-up día 4, registra en CRM OUT-06.",
};

export default function CoachPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("general");
  const [prompt, setPrompt] = useState("");
  const [thread, setThread] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ats_coach_thread") || "[]");
      if (Array.isArray(saved) && saved.length) setThread(saved.slice(0, 40));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: Msg[]) {
    setThread(next);
    try {
      localStorage.setItem("ats_coach_thread", JSON.stringify(next.slice(-40)));
    } catch {
      /* ignore */
    }
  }

  async function ask() {
    if (prompt.trim().length < 8) return;
    const userMsg: Msg = { role: "user", text: prompt.trim() };
    const history = [...thread, userMsg];
    persist(history);
    setPrompt("");
    setLoading(true);
    try {
      const prior = history
        .slice(-6)
        .map((m) => `${m.role === "user" ? "Usuario" : "Coach"}: ${m.text}`)
        .join("\n");
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          prompt: [
            `Eres coach de outplacement LATAM. Modo: ${mode} (${MODES.find((m) => m.id === mode)?.hint}).`,
            "Responde concreto (3–6 pasos). Cita ideas de la knowledge base cuando apliquen. No inventes experiencia del usuario.",
            "Historial reciente:",
            prior,
            "Responde solo el mensaje del coach (sin prefijo).",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      const text = data.text || data.error || OFFLINE[mode];
      persist([...history, { role: "coach", text }]);
    } catch {
      persist([...history, { role: "coach", text: OFFLINE[mode] }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Coach outplacement</h1>
          <SpeakButton text="Coach multi-turno con modos filtro, STAR, negociación y networking." />
        </div>
        <p className="text-sm muted">Historial en este dispositivo + RAG de knowledge_base.</p>
      </section>

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className="btn-secondary"
            style={
              mode === m.id
                ? { width: "auto", borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : { width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }
            }
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {thread.map((m, i) => (
        <section key={`${m.role}-${i}`} className="bento-card space-y-1">
          <p className="text-xs muted">{m.role === "user" ? "Tú" : "Coach"}</p>
          {m.role === "coach" && <SpeakButton text={m.text.slice(0, 500)} />}
          <p className="text-sm whitespace-pre-wrap">{m.text}</p>
        </section>
      ))}

      <textarea
        className="field min-h-24"
        placeholder="Ejemplo: me echaron y no sé si mi CV está bien para analista de datos en Bogotá"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <DictationButton onResult={(t) => setPrompt((p) => `${p} ${t}`.trim())} />
      <button type="button" className="btn-primary" disabled={loading || prompt.length < 8} onClick={ask}>
        {loading ? "Pensando…" : "Enviar"}
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          persist([]);
        }}
      >
        Limpiar hilo
      </button>
      <Link href="/outplacement/networking" className="btn-secondary">
        CRM networking
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
