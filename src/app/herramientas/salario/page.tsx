"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  CITY_MULT,
  NEGOTIATION_CHECKLIST,
  SALARY_BANDS,
  estimateBand,
  type CityTier,
} from "@/lib/salary/bandsCo";

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SalarioPage() {
  const [role, setRole] = useState(SALARY_BANDS[0].id);
  const [city, setCity] = useState<CityTier>("bogota_medellin");
  const est = useMemo(() => estimateBand(role, city), [role, city]);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Banda salarial (orientativa)</h1>
          <SpeakButton text="Estimación orientativa en pesos colombianos. No es asesoría laboral formal." />
        </div>
        <p className="text-sm muted">Referencias aproximadas Colombia 2026. Ajústalas con ofertas reales.</p>
      </section>

      <label className="text-sm">
        Rol
        <select className="field mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
          {SALARY_BANDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        Ciudad / modalidad
        <select className="field mt-1" value={city} onChange={(e) => setCity(e.target.value as CityTier)}>
          {(Object.keys(CITY_MULT) as CityTier[]).map((k) => (
            <option key={k} value={k}>
              {CITY_MULT[k].label}
            </option>
          ))}
        </select>
      </label>

      <section className="bento-card space-y-2">
        <p className="text-sm muted">
          {est.band.note} · {est.cityLabel}
        </p>
        <p className="text-2xl font-semibold score-ring">
          {fmt(est.min)} – {fmt(est.max)}
        </p>
        <ul className="text-sm muted space-y-1">
          <li>Piso (no bajes): {fmt(est.floor)}</li>
          <li>Meta: {fmt(est.target)}</li>
          <li>Techo / stretch: {fmt(est.stretch)}</li>
        </ul>
      </section>

      <section className="bento-card space-y-2">
        <h2 className="text-sm font-semibold">Checklist negociación (OUT-07)</h2>
        <ul className="text-sm muted space-y-1">
          {NEGOTIATION_CHECKLIST.map((c) => (
            <li key={c}>☐ {c}</li>
          ))}
        </ul>
      </section>

      <Link href="/outplacement/entrevista" className="btn-primary">
        Practicar negociación / STAR
      </Link>
      <Link href="/outplacement/filtro" className="btn-secondary">
        Ensayar filtro telefónico
      </Link>
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
