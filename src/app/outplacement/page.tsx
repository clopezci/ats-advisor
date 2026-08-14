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
import { CAREER_MODULE_PITCH, CAREER_PATH_LABEL, outModuleShort } from "@/lib/outplacement/labels";

type Mod = { code: string; title: string; summary: string; days: number };

export default function OutplacementPage() {
  const [modules, setModules] = useState<Mod[]>([]);
  const [plan, setPlanState] = useState<PlanId>("free");
  const [msg, setMsg] = useState("");
  const [channel, setChannel] = useState<LearningChannel>("telegram");
  const [showMenu, setShowMenu] = useState(false);
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
      {unlocked && <DailyCourseReminder />}
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">
              Carrera · {planLabel(plan)}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Acompañamiento de carrera</h1>
          </div>
          <SpeakButton text={`Plan Carrera: ${CAREER_PATH_LABEL}. Estabilización, mercado, marca, networking, entrevistas y oferta. Un solo plan; el curso a tu medida es add-on.`} />
        </div>
        <p className="muted text-sm leading-relaxed">
          El corazón es la <strong>{CAREER_PATH_LABEL}</strong>. Cada área de Carrera (LinkedIn, carta,
          entrevistas, oferta, networking, bienestar…) es un <strong>curso</strong> con lecciones y
          tareas, más la herramienta práctica. Gratis solo: ATS, encaje y tracker.
        </p>
        <ul className="space-y-1 text-xs muted">
          {CAREER_MODULE_PITCH.map((m) => (
            <li key={m.code}>
              <strong style={{ color: "var(--text)" }}>{m.short}</strong> — {m.value}
            </li>
          ))}
        </ul>
        {unlocked ? (
          <>
            <Link href="/outplacement/tablero" className="btn-primary">
              Tablero de avance
            </Link>
            <Link href="/guia" className="btn-secondary">
              Armar / ajustar mi recorrido
            </Link>
          </>
        ) : (
          <Link href="/guia" className="btn-primary">
            ¿Qué quieres hacer? Armar mi recorrido
          </Link>
        )}
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
          reason="El acompañamiento completo (ruta, entrevistas, red, rumbo) está en el plan Carrera. El curso a tu medida se compra aparte (add-on). Mira precios si quieres desbloquear."
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

      <button type="button" className="btn-secondary" onClick={() => setShowMenu((v) => !v)}>
        {showMenu ? "Ocultar menú completo" : "Ver todas las herramientas (si ya sabes cuál)"}
      </button>

      {showMenu && (
      <div className="flex flex-col gap-3">
        <Link href="/outplacement/tablero" className="btn-primary">
          Tablero de avance (cursos)
        </Link>
        <Link href="/outplacement/progreso" className="btn-secondary">
          XP y racha
        </Link>
        <Link href="/outplacement/plan-semana" className="btn-secondary">
          Plan de la semana
        </Link>
        <Link href="/outplacement/misiones" className="btn-secondary">
          Misiones del día (+XP)
        </Link>
        <Link href="/outplacement/alertas" className="btn-secondary">
          Alertas de vacantes
        </Link>
        <Link href="/outplacement/portfolio" className="btn-secondary">
          Caso / portfolio STAR
        </Link>
        <Link href="/outplacement/vacantes" className="btn-secondary">
          Vacantes rankeadas
        </Link>
        <Link href="/outplacement/video-entrevista" className="btn-secondary">
          Video mock STAR
        </Link>
        <Link href="/outplacement/marketplace" className="btn-secondary">
          Marketplace coach / CV review
        </Link>
        <Link href="/outplacement/experto" className="btn-secondary">
          Hablar con un experto (aliado)
        </Link>
        <Link href="/outplacement/cursos" className="btn-secondary">
          Cursos externos low-cost
        </Link>
        <Link href="/outplacement/alumni" className="btn-secondary">
          Comunidad alumni
        </Link>
        <Link href="/outplacement/assessment" className="btn-secondary">
          Assessment RIASEC → roles LATAM
        </Link>
        <Link href="/outplacement/career-brief" className="btn-secondary">
          Career Brief (PDF 1 página)
        </Link>
        <Link href="/outplacement/oferta" className="btn-secondary">
          Wizard negociación de oferta
        </Link>
        <Link href="/outplacement/bienestar" className="btn-secondary">
          Bienestar + derechos laborales CO
        </Link>
        <Link href="/outplacement/remoto" className="btn-secondary">
          CV bilingüe ES→EN + remoto
        </Link>
        <Link
          href={hasOut09 ? "/outplacement/out09" : unlocked ? "/precios" : "/precios"}
          className="btn-secondary"
        >
          {hasOut09
            ? "Crear un curso a mi medida"
            : unlocked
              ? "Curso a tu medida (comprar add-on)"
              : "Curso a tu medida (add-on con Carrera)"}
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
          Ver la ruta semana a semana
        </Link>
        <Link href="/outplacement/certificado" className="btn-secondary">
          Certificado de avance
        </Link>
        <Link href="/precios" className="btn-secondary">
          Ver precios
        </Link>
      </div>
      )}

      {unlocked && (
        <div className="space-y-3">
          {modules.map((m) => (
            <Link key={m.code} href={`/outplacement/ruta?code=${m.code}`} className="bento-card block">
              <p className="text-xs muted">{outModuleShort(m.code)} · {m.days} días</p>
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
            Red de contactos
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
