"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  BIENESTAR_SECTIONS,
  DERECHOS_CO_SECTIONS,
  DISCLAIMER_CO,
} from "@/lib/outplacement/bienestarCo";

export default function BienestarPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 1 · OUT-01</p>
            <h1 className="mt-1 text-2xl font-semibold">Bienestar y derechos (CO)</h1>
          </div>
          <SpeakButton text="Guía de estabilización emocional y checklist laboral orientativa para Colombia. No es asesoría legal." />
        </div>
        <p className="text-sm muted">{DISCLAIMER_CO}</p>
      </section>

      <h2 className="text-lg font-semibold">Bienestar en la transición</h2>
      {BIENESTAR_SECTIONS.map((s) => (
        <section key={s.id} className="bento-card space-y-2">
          <h3 className="font-semibold">{s.title}</h3>
          <ul className="space-y-1 text-sm muted">
            {s.bullets.map((b) => (
              <li key={b.slice(0, 40)}>• {b}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2 className="text-lg font-semibold">Derechos laborales — checklist CO</h2>
      {DERECHOS_CO_SECTIONS.map((s) => (
        <section key={s.id} className="bento-card space-y-2">
          <h3 className="font-semibold">{s.title}</h3>
          <ul className="space-y-1 text-sm muted">
            {s.bullets.map((b) => (
              <li key={b.slice(0, 40)}>• {b}</li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs muted">{DISCLAIMER_CO}</p>
      <Link href="/outplacement/ruta?code=OUT-01" className="btn-primary">
        Ir a OUT-01 (ruta)
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
