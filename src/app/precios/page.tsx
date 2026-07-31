"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

const PLANS = [
  {
    id: "carrera",
    name: "Carrera",
    price: "$79.000 COP/mes",
    points: ["OUT-01 a OUT-08", "1× OUT-09 / mes", "Telegram", "Voz en toda la app"],
  },
  {
    id: "plus",
    name: "Carrera Plus",
    price: "$99.000 COP/mes",
    points: ["Todo Carrera", "2× OUT-09 / mes", "WhatsApp", "Más simulador"],
  },
  {
    id: "out09",
    name: "OUT-09 extra",
    price: "$22.000 COP",
    points: ["1 curso personalizado adicional", "Misma entrega por microcápsulas"],
  },
];

export default function PreciosPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Precios</h1>
          <SpeakButton text="Planes Carrera, Carrera Plus y curso OUT-09 extra. El ATS básico es gratis." />
        </div>
        <p className="text-sm muted">
          ATS gratis con límites. Outplacement democratizado. Pagos Wompi se activan con tus llaves
          (MANUAL-ACCIONES.md).
        </p>
      </section>

      {PLANS.map((p) => (
        <section key={p.id} className="bento-card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{p.name}</h2>
            <span className="pill-brand">{p.price}</span>
          </div>
          <ul className="space-y-1 text-sm muted">
            {p.points.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              alert(
                "Checkout listo para conectar Wompi. Configura WOMPI_* en Vercel y el webhook /api/webhooks/payments."
              )
            }
          >
            Elegir {p.name}
          </button>
        </section>
      ))}

      <Link href="/outplacement" className="btn-secondary">
        Ver outplacement
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
