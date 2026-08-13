import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";

export const metadata = { title: "Herramientas gratis" };

const TOOLS = [
  {
    href: "/herramientas/calculadora",
    title: "¿Qué tan bien encaja tu CV?",
    desc: "Porcentaje rápido de coincidencia entre tu hoja de vida y la oferta. Luego puedes ir al análisis ATS completo.",
  },
  {
    href: "/ats",
    title: "Analizador ATS",
    desc: "Compara tu CV con una oferta y obtén score + acciones.",
  },
  {
    href: "/ats/multi",
    title: "Multi-oferta",
    desc: "Rankea varias vacantes y decide dónde postular primero.",
  },
  {
    href: "/ats/screening",
    title: "Preguntas del formulario",
    desc: "Cuando LinkedIn o Computrabajo te preguntan disponibilidad o años de experiencia, aquí armas la respuesta con tu CV.",
  },
  {
    href: "/ats/portales",
    title: "Sitios donde postulas",
    desc: "Listas para completar tu perfil en Computrabajo, elempleo, LinkedIn o Magneto. No postula por ti.",
  },
  {
    href: "/ats/pack",
    title: "Pack ZIP",
    desc: "CV + carta + LinkedIn + screening listos para enviar.",
  },
  {
    href: "/herramientas/checklist",
    title: "Checklist CV ATS",
    desc: "Lista rápida de formato compatible con robots.",
  },
  {
    href: "/herramientas/linkedin",
    title: "Optimizador LinkedIn",
    desc: "Headline y About alineados a ATS.",
  },
  {
    href: "/herramientas/carta",
    title: "Carta de presentación",
    desc: "Carta corta fiel a tu experiencia y a la oferta.",
  },
  {
    href: "/herramientas/salario",
    title: "Banda salarial",
    desc: "Ancla orientativa en COP para negociar.",
  },
  {
    href: "/herramientas/plantilla",
    title: "Plantilla CV ATS",
    desc: "CV de una columna listo para pegar/analizar.",
  },
  {
    href: "/herramientas/entrevistas",
    title: "Banco de entrevistas",
    desc: "Preguntas por perfil + feedback IA.",
  },
  {
    href: "/herramientas/cultura",
    title: "Ajuste cultural",
    desc: "Adapta lenguaje a la cultura de la oferta.",
  },
  {
    href: "/tracker",
    title: "Tracker de postulaciones",
    desc: "Kanban simple de tu búsqueda.",
  },
];

export default function HerramientasPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Herramientas gratis</h1>
          <SpeakButton text="Herramientas gratuitas de ATSAdvisor para mejorar tu CV y pasar filtros." />
        </div>
        <p className="text-sm muted">
          Gratis: CV, ATS, LinkedIn, carta y práctica básica. El acompañamiento completo (oferta,
          bienestar, rumbo, networking…) está en el plan Carrera.
        </p>
      </section>
      {TOOLS.map((t) => (
        <Link key={t.href} href={t.href} className="bento-card block">
          <h2 className="font-semibold">{t.title}</h2>
          <p className="mt-1 text-sm muted">{t.desc}</p>
        </Link>
      ))}
      <section className="bento-card space-y-2">
        <h2 className="font-semibold">¿Quieres el acompañamiento guiado?</h2>
        <p className="text-sm muted">
          Negociación de oferta, bienestar, assessment, CV remoto y la ruta paso a paso están en
          Carrera (de pago).
        </p>
        <Link href="/outplacement" className="btn-secondary">
          Ver acompañamiento de carrera
        </Link>
        <Link href="/precios" className="btn-primary">
          Ver precios
        </Link>
      </section>
      <AdSlot slot="herramientas-hub" />
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
