"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { PaywallCard } from "@/components/PaywallCard";
import { ChannelChooser } from "@/components/ChannelChooser";
import {
  canAccessOutplacement,
  canClaimGuarantee,
  claimGuarantee,
  pauseFor90Days,
  planLabel,
  readEntitlement,
  startGuarantee,
  type PlanId,
} from "@/lib/entitlements";
import { whatsappFinalPriceCop, type LearningChannel } from "@/lib/channels/pricing";
import { CHANNEL_CHOICE_INTRO } from "@/lib/channels/pricing";

type Mod = { code: string; title: string; summary: string; days: number };

export default function OutplacementPage() {
  const [modules, setModules] = useState<Mod[]>([]);
  const [plan, setPlanState] = useState<PlanId>("free");
  const [msg, setMsg] = useState("");
  const [channel, setChannel] = useState<LearningChannel>("telegram");
  const unlocked = canAccessOutplacement(plan);
  const waPrice = whatsappFinalPriceCop();

  useEffect(() => {
    setPlanState(readEntitlement().plan);
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.channel) setChannel(p.channel);
    } catch {
      /* ignore */
    }
    fetch("/api/outplacement/modules")
      .then((r) => r.json())
      .then((d) => setModules(d.modules || []))
      .catch(() => setModules([]));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">
              Carrera · {planLabel(plan)}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Outplacement</h1>
          </div>
          <SpeakButton text="Elige un módulo de la ruta o crea un curso personalizado OUT-09." />
        </div>
        <p className="muted text-sm">
          Ruta completa OUT-01 a OUT-08. Desde $79.000 COP/mes. También puedes crear un curso a
          tu medida.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">¿Por dónde quieres las cápsulas?</h2>
        <p className="text-xs muted">{CHANNEL_CHOICE_INTRO}</p>
        <ChannelChooser
          value={channel}
          onChange={(c) => {
            setChannel(c);
            try {
              const p = JSON.parse(localStorage.getItem("ats_profile") || "{}");
              localStorage.setItem("ats_profile", JSON.stringify({ ...p, channel: c }));
            } catch {
              /* ignore */
            }
          }}
          whatsappPriceCop={waPrice}
          showIntro={false}
        />
      </section>

      {!unlocked && plan !== "paused_90" && (
        <PaywallCard
          currentPlan={plan}
          reason="El outplacement completo y OUT-09 están en Carrera / Plus. Puedes activar un plan en Precios (demo local si aún no tienes Wompi)."
        />
      )}

      {plan === "paused_90" && (
        <section className="bento-card space-y-2">
          <p className="pill-brand">Suscripción en pausa</p>
          <p className="text-sm muted">Modo primeros 90 días activo. Puedes retomar Carrera cuando quieras.</p>
          <Link href="/outplacement/90-dias" className="btn-primary">
            Abrir checklist 90 días
          </Link>
        </section>
      )}

      <div className="flex flex-col gap-3">
        <Link href={unlocked ? "/outplacement/out09" : "/precios"} className="btn-primary">
          Crear curso personalizado (OUT-09)
        </Link>
        <Link href="/outplacement/coach" className="btn-secondary">
          Chat coach (RAG)
        </Link>
        <Link href="/outplacement/entrevista" className="btn-secondary">
          Simulador de entrevista
        </Link>
        <Link href="/outplacement/filtro" className="btn-secondary">
          Score predictivo de filtro
        </Link>
        <Link href="/outplacement/90-dias" className="btn-secondary">
          Modo primeros 90 días
        </Link>
        <Link href={unlocked ? "/outplacement/segunda-carrera" : "/precios"} className="btn-secondary">
          Segunda carrera / emprendimiento
        </Link>
        <Link href={unlocked ? "/outplacement/ruta" : "/precios"} className="btn-secondary">
          Ver ruta OUT-01 a OUT-08
        </Link>
        <Link href="/outplacement/certificado" className="btn-secondary">
          Certificado de avance
        </Link>
        <Link href="/precios" className="btn-secondary">
          Ver precios
        </Link>
      </div>

      {unlocked && (
        <div className="space-y-3">
          {modules.map((m) => (
            <Link key={m.code} href={`/outplacement/ruta?code=${m.code}`} className="bento-card block">
              <div className="flex items-center justify-between gap-2">
                <span className="pill-brand">{m.code}</span>
                <span className="text-xs muted">{m.days} días</span>
              </div>
              <h2 className="mt-2 text-base font-semibold">{m.title}</h2>
              <p className="mt-1 text-sm muted">{m.summary}</p>
            </Link>
          ))}
        </div>
      )}

      {unlocked && (
        <section className="bento-card space-y-3">
          <h2 className="font-semibold text-sm">Retención (plan original)</h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              pauseFor90Days();
              setPlanState("paused_90");
              setMsg("Suscripción en pausa · modo 90 días.");
              window.location.href = "/outplacement/90-dias";
            }}
          >
            Conseguí empleo → pausar y abrir 90 días
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              startGuarantee();
              setMsg("Garantía de avance iniciada (30 días sin entrevistas).");
            }}
          >
            Activar garantía 30 días
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              const r = claimGuarantee();
              setMsg(r.ok ? "Garantía reclamada: mes de cortesía demo." : r.reason);
              if (r.ok) setPlanState(readEntitlement().plan);
            }}
          >
            Reclamar garantía ({canClaimGuarantee().ok ? "elegible" : "aún no"})
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </section>
      )}

      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
