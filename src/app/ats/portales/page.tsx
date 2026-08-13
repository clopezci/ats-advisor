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
          <h1 className="text-xl font-semibold">Sitios donde postulas</h1>
          <SpeakButton text="Elige el portal donde vas a postular. Cada tarjeta es una lista para completar tu perfil allá. La app no envía la postulación por ti." />
        </div>
        <p className="text-sm muted leading-relaxed">
          Computrabajo, elempleo, LinkedIn o Magneto no solo leen tu PDF: también tienen un formulario.
          Si dejas el perfil a medias, te bajan aunque el CV esté bien.
        </p>
        <label className="text-sm">
          ¿En qué país estás postulando?
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
          <p className="text-sm leading-relaxed">{p.purpose}</p>
          <p className="text-xs muted">Países: {p.countries.join(" · ")}</p>
          <p className="text-sm font-medium">Qué completar en ese sitio</p>
          <ul className="text-sm muted space-y-1">
            {p.checklist.map((c) => (
              <li key={c}>☐ {c}</li>
            ))}
          </ul>
          <p className="text-sm font-medium">Consejos</p>
          <ul className="text-sm muted space-y-1">
            {p.tips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </section>
      ))}

      <Link href="/ats/screening" className="btn-primary">
        Preparar respuestas a las preguntas del portal
      </Link>
      <p className="text-xs muted text-center">
        Úsalo cuando LinkedIn o Computrabajo te pregunten disponibilidad, años de experiencia o salario.
      </p>
      <Link href="/ats" className="btn-secondary">
        Volver al análisis de CV
      </Link>
    </div>
  );
}
