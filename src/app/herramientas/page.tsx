import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import { FREE_TOOL_BLURBS } from "@/lib/entitlements/freePaths";
import { CAREER_MODULE_PITCH, CAREER_PATH_LABEL } from "@/lib/outplacement/labels";

export const metadata = { title: "Herramientas" };

const PAID_TEASERS = [
  { title: "LinkedIn, carta y plantilla CV", desc: "Textos listos para postular." },
  { title: "Multi-oferta, screening y pack ZIP", desc: "Compara vacantes y arma el paquete de envío." },
  { title: "Entrevistas, filtro y negociación", desc: "Práctica STAR y scripts de oferta." },
  { title: CAREER_PATH_LABEL, desc: "El acompañamiento completo, semana a semana." },
];

export default function HerramientasPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Herramientas</h1>
          <SpeakButton text="Solo tres cosas son gratis: analizador ATS, encaje rápido y tracker. Todo lo demás está en el plan Carrera, con la ruta de 8 módulos." />
        </div>
        <p className="text-sm muted leading-relaxed">
          <strong>Gratis (3):</strong> probar el ATS, un encaje rápido y anotar postulaciones. Todo lo
          demás de Carrera son <strong>cursos</strong> (lecciones + tareas + tablero), no anuncios
          cortos — LinkedIn, carta, entrevistas, oferta, networking, ruta de 8 módulos, bienestar…
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Gratis</h2>
        {FREE_TOOL_BLURBS.map((t) => (
          <Link key={t.href} href={t.href} className="bento-card block">
            <h3 className="font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm muted">{t.desc}</p>
          </Link>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Con plan Carrera (cursos + práctica)</h2>
        <p className="text-sm muted">
          Cada tema abre como curso (solo títulos → lección completa). Luego usas la herramienta.
          El corazón sigue siendo la {CAREER_PATH_LABEL}.
        </p>
        <ul className="space-y-2 text-sm muted">
          {PAID_TEASERS.map((t) => (
            <li key={t.title}>
              <strong style={{ color: "var(--text)" }}>{t.title}.</strong> {t.desc}
            </li>
          ))}
        </ul>
        <p className="text-xs font-medium">Los 8 módulos incluyen:</p>
        <ul className="space-y-1 text-xs muted">
          {CAREER_MODULE_PITCH.map((m) => (
            <li key={m.code}>
              <strong style={{ color: "var(--text)" }}>{m.short}</strong> — {m.value}
            </li>
          ))}
        </ul>
        <Link href="/precios" className="btn-primary">
          Ver plan Carrera
        </Link>
        <Link href="/guia" className="btn-secondary">
          Armar mi recorrido
        </Link>
      </section>

      <AdSlot slot="herramientas-hub" />
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
