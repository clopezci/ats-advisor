import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Outplacement" };

const COPY =
  "Outplacement digital a precio accesible: módulos guiados, microcápsulas y cursos personalizados OUT-09. La suscripción se activa en fases siguientes.";

export default function OutplacementPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Carrera · F0</p>
            <h1 className="mt-1 text-2xl font-semibold">Outplacement</h1>
          </div>
          <SpeakButton text={COPY} />
        </div>
        <p className="muted text-sm leading-relaxed">{COPY}</p>
        <ul className="space-y-2 text-sm">
          <li>• OUT-01 a OUT-08 — ruta profesional completa</li>
          <li>• OUT-09 — curso personalizado (blanda/técnica + cuestionario)</li>
          <li>• Entrega por PWA, Telegram o WhatsApp</li>
        </ul>
      </section>

      <div className="flex flex-col gap-3">
        <button type="button" className="btn-primary" disabled>
          Empezar ruta (próximamente)
        </button>
        <Link href="/" className="btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
