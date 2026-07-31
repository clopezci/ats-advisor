import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

const INTRO =
  "ATSAdvisor te ayuda a pasar filtros ATS y a reconstruir tu carrera. Elige solo una cosa para empezar.";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="bento-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Paso 1 de 1</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">¿Qué quieres hacer ahora?</h1>
          </div>
          <SpeakButton text={`${INTRO} Opción uno: analizar mi CV con el ATS. Opción dos: ver el outplacement.`} />
        </div>
        <p className="muted text-sm leading-relaxed">{INTRO}</p>
      </section>

      <div className="flex flex-col gap-3">
        <Link href="/ats" className="btn-primary">
          Analizar mi CV (ATS gratis)
        </Link>
        <Link href="/outplacement" className="btn-secondary">
          Ver outplacement
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-3">
        <div className="bento-card">
          <p className="text-xs muted">Facilidad</p>
          <p className="mt-1 text-sm font-medium">Máximo 2 decisiones por pantalla</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Voz</p>
          <p className="mt-1 text-sm font-medium">Escuchar y dictar en todo el flujo</p>
        </div>
      </section>
    </div>
  );
}
