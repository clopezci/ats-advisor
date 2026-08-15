"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { PaywallCard } from "@/components/PaywallCard";
import { ChannelChooser } from "@/components/ChannelChooser";
import { DailyCourseReminder } from "@/components/DailyCourseReminder";
import {
  canAccessOutplacement,
  pauseFor90Days,
  planLabel,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";
import { whatsappFinalPriceCop, type LearningChannel } from "@/lib/channels/pricing";
import { CHANNEL_CHOICE_INTRO } from "@/lib/channels/pricing";
import { CAREER_PATH_LABEL } from "@/lib/outplacement/labels";
import { writeFocusPath } from "@/lib/engagement/focusPath";
import { nextWorkbookModule, readWorkbook, workbookProgress } from "@/lib/workbook/types";

export default function OutplacementPage() {
  const [plan, setPlanState] = useState<PlanId>("free");
  const [msg, setMsg] = useState("");
  const [channel, setChannel] = useState<LearningChannel>("telegram");
  const [showMenu, setShowMenu] = useState(false);
  const [showChannel, setShowChannel] = useState(false);
  const [continueHref, setContinueHref] = useState("/outplacement/cuadernillo");
  const [continueLabel, setContinueLabel] = useState("Continuar: mi cuadernillo");
  const [pct, setPct] = useState(0);
  const unlocked = canAccessOutplacement(plan);
  const waPrice = whatsappFinalPriceCop();

  useEffect(() => {
    writeFocusPath("carrera");
    setPlanState(readEntitlement().plan);
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.channel) setChannel(p.channel);
    } catch {
      /* ignore */
    }
    const wb = readWorkbook();
    const prog = workbookProgress(wb);
    setPct(prog.pct);
    const next = nextWorkbookModule(wb);
    if (next) {
      setContinueHref(next.href);
      setContinueLabel(`Continuar: ${next.title}`);
    } else {
      setContinueHref("/outplacement/cuadernillo/funnel");
      setContinueLabel("Continuar: funnel semanal");
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      {unlocked && <DailyCourseReminder />}

      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">
              Carrera · {planLabel(plan)}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Tu acompañamiento</h1>
          </div>
          <SpeakButton
            text={`Un solo Continuar. El corazón es el cuadernillo de la ${CAREER_PATH_LABEL}. El resto está bajo Más opciones.`}
          />
        </div>
        <p className="muted text-sm leading-relaxed">
          No explores el menú. Pulsa <strong>Continuar</strong>, cierra el entregable y vuelve
          mañana. Las herramientas satélite viven dentro de cada fase.
        </p>
        {unlocked ? (
          <>
            <p className="text-xs muted">Avance cuadernillo {pct}%</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <Link
              href={continueHref}
              className="btn-primary"
              style={{ minHeight: "4rem", fontSize: "1.1rem" }}
            >
              {continueLabel}
            </Link>
            <Link href="/outplacement/cuadernillo" className="text-sm muted underline">
              Ver las 6 fases
            </Link>
          </>
        ) : (
          <>
            <Link href="/precios?plan=carrera&next=%2Foutplacement%2Fcuadernillo" className="btn-primary">
              Desbloquear Carrera
            </Link>
            <p className="text-xs muted leading-relaxed">
              Para probar ya: en{" "}
              <Link href="/cuenta" style={{ color: "var(--brand)" }}>
                Cuenta
              </Link>{" "}
              activa plan local <strong>Tester</strong> o <strong>Carrera</strong>, luego vuelve y
              pulsa Continuar.
            </p>
          </>
        )}
      </section>

      {!unlocked && plan !== "paused_90" && (
        <PaywallCard
          currentPlan={plan}
          reason="El acompañamiento completo está en el plan Carrera. Gratis: ATS, encaje y tracker."
        />
      )}

      {plan === "paused_90" && (
        <section className="bento-card space-y-2">
          <p className="pill-brand">Suscripción en pausa</p>
          <Link href="/outplacement/90-dias" className="btn-primary">
            Abrir checklist 90 días
          </Link>
        </section>
      )}

      <button type="button" className="btn-secondary" onClick={() => setShowChannel((v) => !v)}>
        {showChannel ? "Ocultar canal de cápsulas" : "Canal de cápsulas (Telegram / WA)"}
      </button>
      {showChannel ? (
        <section className="bento-card space-y-3">
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
      ) : null}

      <button type="button" className="btn-secondary" onClick={() => setShowMenu((v) => !v)}>
        {showMenu ? "Ocultar más opciones" : "Más opciones (si ya sabes qué buscas)"}
      </button>

      {showMenu && (
        <div className="flex flex-col gap-3">
          <Link href="/outplacement/tablero" className="btn-secondary">
            Tablero de cursos
          </Link>
          <Link href="/outplacement/ruta" className="btn-secondary">
            Ruta semana a semana
          </Link>
          <Link href="/outplacement/coaches" className="btn-secondary">
            Coaches IA
          </Link>
          <Link href="/outplacement/roleplay" className="btn-secondary">
            Roleplay entrevista
          </Link>
          <Link href="/outplacement/networking" className="btn-secondary">
            CRM networking
          </Link>
          <Link href="/outplacement/oferta" className="btn-secondary">
            Wizard de oferta
          </Link>
          <Link href="/guia" className="btn-secondary">
            Personalizar recorrido (avanzado)
          </Link>
          <Link href="/precios" className="btn-secondary">
            Precios
          </Link>
          {unlocked ? (
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
          ) : null}
          {msg ? <p className="text-sm">{msg}</p> : null}
        </div>
      )}

      <Link href="/" className="text-center text-sm muted">
        Volver a Inicio
      </Link>
    </div>
  );
}
