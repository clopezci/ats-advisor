import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Herramientas gratis" };

const TOOLS = [
  {
    href: "/ats",
    title: "Analizador ATS",
    desc: "Compara tu CV con una oferta y obtén score + acciones.",
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
        <p className="text-sm muted">SEO orgánico: valor útil sin pagar. Un producto de LOTIC.</p>
      </section>
      {TOOLS.map((t) => (
        <Link key={t.href} href={t.href} className="bento-card block">
          <h2 className="font-semibold">{t.title}</h2>
          <p className="mt-1 text-sm muted">{t.desc}</p>
        </Link>
      ))}
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
