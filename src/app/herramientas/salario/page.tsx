"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

const BANDS: Record<string, { min: number; max: number; note: string }> = {
  "analista junior": { min: 2800000, max: 4200000, note: "Ciudades principales CO" },
  "analista semi": { min: 4200000, max: 6500000, note: "Con 2-4 años" },
  "especialista": { min: 6500000, max: 9500000, note: "Skills escasas" },
  "coordinador": { min: 5500000, max: 8500000, note: "Liderazgo de equipo" },
  "gerente": { min: 9000000, max: 16000000, note: "Varía fuerte por industria" },
};

export default function SalarioPage() {
  const [role, setRole] = useState("analista junior");
  const band = BANDS[role];

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Banda salarial (orientativa)</h1>
          <SpeakButton text="Estimación orientativa en pesos colombianos. No es asesoría laboral formal." />
        </div>
        <p className="text-sm muted">Referencias aproximadas para Colombia 2026. Ajústalas con ofertas reales.</p>
      </section>

      <select className="field" value={role} onChange={(e) => setRole(e.target.value)}>
        {Object.keys(BANDS).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      <section className="bento-card space-y-2">
        <p className="text-sm muted">{band.note}</p>
        <p className="text-2xl font-semibold score-ring">
          ${(band.min / 1e6).toFixed(1)}M – ${(band.max / 1e6).toFixed(1)}M COP
        </p>
        <p className="text-xs muted">Usa esto como ancla en OUT-07 (negociación), no como garantía.</p>
      </section>

      <Link href="/outplacement/entrevista" className="btn-primary">
        Practicar negociación
      </Link>
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
