"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { PaywallCard } from "@/components/PaywallCard";
import { ChannelChooser } from "@/components/ChannelChooser";
import {
  canAccessOutplacement,
  pauseFor90Days,
  planLabel,
  readEntitlement,
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
  const hasOut09 = plan === "plus" || plan === "tester";

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
          <SpeakButton text="Elige un módulo de la ruta. OUT-09 personalizado está en Carrera Plus." />
        </div>
        <p className="muted text-sm">
          Ruta OUT-01 a OUT-08 desde $79.000 COP/mes. Curso personalizado OUT-09 solo en Carrera Plus
          ($99.000) o como compra extra.
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
          reason="El outplacement OUT-01…08 está en Carrera / Plus. OUT-09 personalizado solo en Plus. Activa un plan en Precios."
        />
      )}

      {plan === "paused_90" && (
        <section className="bento-card space-y-2">
          <p className="pill-brand">Suscripción en pausa</p>
          <p className="text-sm muted">
            Modo primeros 90 días activo (checklist de onboarding al nuevo empleo — sin cobro extra).
            Puedes retomar Carrera cuando quieras.
          </p>
          <Link href="/outplacement/90-dias" className="btn-primary">
            Abrir checklist 90 días
          </Link>
        </section>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href={hasOut09 ? "/outplacement/out09" : unlocked ? "/precios" : "/precios"}
          className="btn-primary"
        >
          {hasOut09
            ? "Crear curso personalizado (OUT-09)"
            : unlocked
              ? "OUT-09 → upgrade a Plus o compra extra"
              : "OUT-09 (requiere Carrera Plus)"}
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
          Modo primeros 90 días (post-empleo)
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
          <h2 className="font-semibold text-sm">Tras conseguir empleo</h2>
          <p className="text-xs muted">
            Pausas la suscripción de búsqueda y abres el checklist de onboarding (incluidos en el
            plan; no es un plan aparte de $39k).
          </p>
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
          <Link href="/outplacement/networking" className="btn-secondary">
            CRM networking (OUT-06)
          </Link>
          <Link href="/outplacement/coach" className="btn-secondary">
            Coach multi-turno
          </Link>
          {msg && <p className="text-sm">{msg}</p>}
        </section>
      )}

      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
