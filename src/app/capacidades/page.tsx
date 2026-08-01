"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  AUDIENCE_LABEL,
  CAPABILITIES,
  STATUS_LABEL,
  type Audience,
  type CapabilityStatus,
} from "@/lib/catalog/capabilities";

const AUDIENCES: Audience[] = ["candidato", "empresa", "admin", "tester", "publico"];

const STATUS_STYLE: Record<CapabilityStatus, { bg: string; color: string }> = {
  disponible: { bg: "rgba(5,150,105,0.12)", color: "#047857" },
  parcial: { bg: "rgba(245,158,11,0.15)", color: "#b45309" },
  requiere_config: { bg: "rgba(124,58,237,0.12)", color: "#6d28d9" },
  en_construccion: { bg: "rgba(59,130,246,0.12)", color: "#1d4ed8" },
  planificado: { bg: "rgba(107,98,128,0.12)", color: "#4b5563" },
};

export default function CapacidadesPage() {
  const [audience, setAudience] = useState<Audience | "todos">("todos");
  const [status, setStatus] = useState<CapabilityStatus | "todos">("todos");

  const filtered = useMemo(() => {
    return CAPABILITIES.filter((c) => {
      if (audience !== "todos" && !c.audience.includes(audience)) return false;
      if (status !== "todos" && c.status !== status) return false;
      return true;
    });
  }, [audience, status]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of CAPABILITIES) m[c.status] = (m[c.status] || 0) + 1;
    return m;
  }, []);

  const intro = `Catálogo completo de ATSAdvisor: ${CAPABILITIES.length} capacidades para personas, empresas RH, admin y testers. Filtra por audiencia y estado.`;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">Mapa del producto</p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight">
              Todo lo que puedes hacer aquí
            </h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
        <p className="text-xs muted">
          Incluye lo ya vivo, lo parcial, lo que espera tus keys y lo planificado (B2B, Analytics Pro,
          etc.).
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {(Object.keys(STATUS_LABEL) as CapabilityStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            className="bento-card text-left"
            style={
              status === s
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : undefined
            }
            onClick={() => setStatus(status === s ? "todos" : s)}
          >
            <p className="text-xs muted">{STATUS_LABEL[s]}</p>
            <p className="text-xl font-semibold">{counts[s] || 0}</p>
          </button>
        ))}
      </section>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">¿Para quién?</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary"
            style={{
              width: "auto",
              minHeight: "2.5rem",
              padding: "0.5rem 0.9rem",
              ...(audience === "todos"
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : {}),
            }}
            onClick={() => setAudience("todos")}
          >
            Todos
          </button>
          {AUDIENCES.map((a) => (
            <button
              key={a}
              type="button"
              className="btn-secondary"
              style={{
                width: "auto",
                minHeight: "2.5rem",
                padding: "0.5rem 0.9rem",
                ...(audience === a
                  ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                  : {}),
              }}
              onClick={() => setAudience(a)}
            >
              {AUDIENCE_LABEL[a]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm muted">
        Mostrando <strong>{filtered.length}</strong> de {CAPABILITIES.length}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.map((c) => {
          const st = STATUS_STYLE[c.status];
          const body = (
            <article className="bento-card space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: st.bg, color: st.color }}
                >
                  {STATUS_LABEL[c.status]}
                </span>
                {c.audience.map((a) => (
                  <span key={a} className="text-xs muted">
                    {AUDIENCE_LABEL[a]}
                  </span>
                ))}
              </div>
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

      <Link href="/" className="btn-secondary">
        Volver al inicio
      </Link>
    </div>
  );
}
