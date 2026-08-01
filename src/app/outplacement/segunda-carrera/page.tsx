"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";
import { PaywallCard } from "@/components/PaywallCard";
import {
  canAccessOutplacement,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";

const TRACKS = [
  {
    id: "pivot",
    title: "Pivote de industria",
    body: "Traduce tu experiencia a un sector nuevo sin reiniciar desde cero.",
  },
  {
    id: "freelance",
    title: "Freelance / consultoría",
    body: "Empaqueta servicios, precios y primeros clientes.",
  },
  {
    id: "startup",
    title: "Emprendimiento lean",
    body: "Valida problema, oferta mínima y narrativa de fundador.",
  },
];

export default function SegundaCarreraPage() {
  const [plan, setPlan] = useState<PlanId>("free");
  const [track, setTrack] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const unlocked = canAccessOutplacement(plan);

  useEffect(() => {
    setPlan(readEntitlement().plan);
  }, []);

  async function generate() {
    if (!track || context.trim().length < 20) return;
    setLoading(true);
    setOutline("");
    try {
      const t = TRACKS.find((x) => x.id === track);
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          prompt: `Diseña un plan de 14 días (microcápsulas) para el modo "segunda carrera / emprendimiento".
Pista: ${t?.title} — ${t?.body}
Contexto del usuario: ${context}
Formato: lista Día 1… Día 14 con título + 2-3 acciones concretas. Español LATAM, realista.`,
        }),
      });
      const data = await res.json();
      setOutline(data.text || data.error || "Sin respuesta");
    } finally {
      setLoading(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <PaywallCard
          title="Segunda carrera"
          reason="Este modo está incluido en Carrera / Plus. Activa un plan en Precios o demo local en Cuenta."
          currentPlan={plan}
        />
        <Link href="/outplacement" className="btn-secondary">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="pill-brand">Modo especial</p>
            <h1 className="mt-2 text-xl font-semibold">Segunda carrera</h1>
          </div>
          <SpeakButton text="Elige pivote, freelance o emprendimiento y genera un plan de catorce días a tu medida." />
        </div>
        <p className="text-sm muted">Para quien no solo busca el mismo rol: pivote, independiente o startup.</p>
      </section>

      {!track && (
        <div className="flex flex-col gap-3">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="bento-card text-left"
              onClick={() => setTrack(t.id)}
            >
              <h2 className="font-semibold">{t.title}</h2>
              <p className="mt-1 text-sm muted">{t.body}</p>
            </button>
          ))}
        </div>
      )}

      {track && (
        <>
          <textarea
            className="field min-h-28"
            placeholder="Cuéntanos tu background y meta…"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <DictationButton onResult={(t) => setContext((c) => `${c} ${t}`.trim())} />
          <button type="button" className="btn-primary" disabled={loading || context.length < 20} onClick={generate}>
            {loading ? "Generando plan…" : "Generar plan 14 días"}
          </button>
          {outline && (
            <section className="bento-card">
              <SpeakButton text={outline.slice(0, 800)} />
              <pre className="mt-2 whitespace-pre-wrap text-sm font-sans">{outline}</pre>
            </section>
          )}
          <button type="button" className="btn-secondary" onClick={() => { setTrack(null); setOutline(""); }}>
            Cambiar pista
          </button>
        </>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
