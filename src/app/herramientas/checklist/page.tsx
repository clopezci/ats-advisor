import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Checklist CV ATS" };

const ITEMS = [
  "Una sola columna, sin tablas complejas",
  "Secciones: Contacto, Experiencia, Educación, Skills",
  "PDF texto seleccionable (no escaneo de imagen)",
  "Logros con números",
  "Keywords de la oferta sin inventar experiencia",
  "Sin texto blanco ni font 1px",
];

export default function ChecklistPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Checklist CV ATS</h1>
          <SpeakButton text={`Checklist. ${ITEMS.join(". ")}`} />
        </div>
      </section>
      <ul className="bento-card space-y-2 text-sm">
        {ITEMS.map((i) => (
          <li key={i}>☐ {i}</li>
        ))}
      </ul>
      <Link href="/ats" className="btn-primary">
        Analizar mi CV
      </Link>
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
