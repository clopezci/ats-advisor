"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { PORTALS_LATAM, portalsForCountry } from "@/lib/ats/portalsLatam";

export default function PortalesPage() {
  const [country, setCountry] = useState("CO");
  const list = country === "ALL" ? PORTALS_LATAM : portalsForCountry(country);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Portales LATAM</h1>
          <SpeakButton text="Checklists para Computrabajo, elempleo, Magneto, LinkedIn y más." />
        </div>
        <p className="text-sm muted">
          El PDF no basta: el formulario del portal también rankea. Sigue el checklist del canal donde postulas.
        </p>
        <label className="text-sm">
          País
          <select className="field mt-1" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="CO">Colombia</option>
            <option value="MX">México</option>
            <option value="AR">Argentina</option>
            <option value="PE">Perú</option>
            <option value="CL">Chile</option>
            <option value="ALL">Todos</option>
          </select>
        </label>
      </section>

      {list.map((p) => (
        <section key={p.id} className="bento-card space-y-2">
          <h2 className="font-semibold">{p.name}</h2>
          <p className="text-xs muted">{p.countries.join(" · ")}</p>
          <p className="text-sm font-medium">Checklist</p>
          <ul className="text-sm muted space-y-1">
            {p.checklist.map((c) => (
              <li key={c}>☐ {c}</li>
            ))}
          </ul>
          <p className="text-sm font-medium">Tips</p>
          <ul className="text-sm muted space-y-1">
            {p.tips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </section>
      ))}

      <Link href="/ats/screening" className="btn-primary">
        Preparar respuestas de screening
      </Link>
      <Link href="/ats" className="btn-secondary">
        Volver al ATS
      </Link>
    </div>
  );
}
