"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import {
  AUDIENCE_LABEL,
  CAPABILITIES,
  STATUS_LABEL,
  type Audience,
  type CapabilityStatus,
} from "@/lib/catalog/capabilities";
import { SYSTEM_CAPABILITY_IDS } from "@/lib/catalog/personaFilter";
import { FlowContinueBar } from "@/components/FlowContinueBar";

const AUDIENCES: Audience[] = ["candidato", "empresa", "admin", "tester", "publico"];

const STATUS_STYLE: Record<CapabilityStatus, { bg: string; color: string }> = {
  disponible: { bg: "rgba(5,150,105,0.12)", color: "#047857" },
  parcial: { bg: "rgba(245,158,11,0.15)", color: "#b45309" },
  requiere_config: { bg: "rgba(124,58,237,0.12)", color: "#6d28d9" },
  en_construccion: { bg: "rgba(59,130,246,0.12)", color: "#1d4ed8" },
  planificado: { bg: "rgba(107,98,128,0.12)", color: "#4b5563" },
};

export default function CapacidadesPage() {
  const [lens, setLens] = useState<"persona" | "todo">("persona");
  const [audience, setAudience] = useState<Audience | "todos">("candidato");
  const [status, setStatus] = useState<CapabilityStatus | "todos">("todos");

  const filtered = useMemo(() => {
    return CAPABILITIES.filter((c) => {
      if (lens === "persona" && SYSTEM_CAPABILITY_IDS.has(c.id)) return false;
      if (audience !== "todos" && !c.audience.includes(audience)) return false;
      if (status !== "todos" && c.status !== status) return false;
      return true;
    });
  }, [lens, audience, status]);

  const intro =
    lens === "persona"
      ? "Cosas que puedes hacer y te benefician: analizar tu CV, organizar postulaciones, practicar entrevistas. Sin jerga técnica de la app."
      : "Catálogo completo, incluido lo interno (pagos, admin, infraestructura).";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">Mapa</p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight">Qué puedes hacer aquí</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
        <FlowContinueBar label="Seguir" />
        <Link href="/outplacement/cuadernillo" className="btn-secondary">
          Abrir cuadernillo
        </Link>
      </section>

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary"
          style={
            lens === "persona"
              ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
              : undefined
          }
          onClick={() => {
            setLens("persona");
            setAudience("candidato");
          }}
        >
          Para ti
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={
            lens === "todo" ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" } : undefined
          }
          onClick={() => {
            setLens("todo");
            setAudience("todos");
          }}
        >
          Técnico / admin
        </button>
      </div>

      {lens === "todo" && (
        <>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">¿Para quién?</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={() => setAudience("todos")}>
                Todos
              </button>
              {AUDIENCES.map((a) => (
                <button key={a} type="button" className="btn-secondary" onClick={() => setAudience(a)}>
                  {AUDIENCE_LABEL[a]}
                </button>
              ))}
            </div>
          </div>
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(STATUS_LABEL) as CapabilityStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                className="bento-card text-left"
                onClick={() => setStatus(status === s ? "todos" : s)}
              >
                <p className="text-xs muted">{STATUS_LABEL[s]}</p>
              </button>
            ))}
          </section>
        </>
      )}

      <p className="text-sm muted">
        {filtered.length} {lens === "persona" ? "acciones para ti" : "ítems"}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.map((c) => {
          const st = STATUS_STYLE[c.status];
          const body = (
            <article className="bento-card space-y-2">
              {lens === "todo" && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: st.bg, color: st.color }}
                >
                  {STATUS_LABEL[c.status]}
                </span>
              )}
              <h2 className="text-base font-semibold">{c.title}</h2>
              <p className="text-sm muted leading-relaxed">{c.summary}</p>
              {c.href && (
                <p className="text-xs" style={{ color: "var(--brand)" }}>
                  Abrir →
                </p>
              )}
            </article>
          );
          return c.href ? (
            <Link key={c.id} href={c.href}>
              {body}
            </Link>
          ) : (
            <div key={c.id}>{body}</div>
          );
        })}
      </div>

      <AdSlot slot="mapa" />

      <Link href="/" className="btn-secondary">
        Volver al inicio
      </Link>
    </div>
  );
}
