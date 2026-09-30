import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import { FREE_TOOL_BLURBS } from "@/lib/entitlements/freePaths";
import {
  CAREER_MODULE_PITCH,
  CAREER_PATH_LABEL,
  CAREER_PLAN_INCLUDES,
} from "@/lib/outplacement/labels";
import { FlowContinueBar } from "@/components/FlowContinueBar";
import { CareerUpsell } from "@/components/CareerUpsell";

export const metadata = { title: "Herramientas" };

export default function HerramientasPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Herramientas</h1>
          <SpeakButton text="Gratis: analizador ATS, psicotécnicas para estudiar, encaje, tracker, checklist CV y bandas salariales. Carrera es el acompañamiento completo con cuadernillo guiado." />
        </div>
        <p className="text-sm muted leading-relaxed">
          <strong>Ruta gratis:</strong> ATS, estudiar psicotécnicas, tracker, checklist y salarios.{" "}
          <strong>Plan Carrera:</strong> cuadernillo guiado, cursos, red, entrevistas y negociación.
        </p>
      </section>

      <FlowContinueBar label="Seguir" />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Ruta gratis</h2>
        {FREE_TOOL_BLURBS.map((t) => (
          <Link key={t.href} href={t.href} className="bento-card block">
            <h3 className="font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm muted">{t.desc}</p>
          </Link>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Con plan Carrera</h2>
        <p className="text-sm muted">
          Todo el acompañamiento en un solo plan. El corazón es la {CAREER_PATH_LABEL} y el
          cuadernillo guiado.
        </p>
        <ul className="space-y-2 text-sm muted">
          {CAREER_PLAN_INCLUDES.map((t) => (
            <li key={t.title}>
              <strong style={{ color: "var(--text)" }}>{t.title}.</strong> {t.desc}
            </li>
          ))}
        </ul>
        <p className="text-xs font-medium">Detalle de los 8 módulos:</p>
        <ul className="space-y-1 text-xs muted">
          {CAREER_MODULE_PITCH.map((m) => (
            <li key={m.code}>
              <strong style={{ color: "var(--text)" }}>{m.short}</strong> — {m.value}
            </li>
          ))}
        </ul>
        <Link href="/outplacement/cuadernillo" className="btn-secondary">
          Ir al cuadernillo
        </Link>
      </section>

      <CareerUpsell nextHref="/outplacement/cuadernillo" />

      <AdSlot slot="herramientas-hub" />
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
