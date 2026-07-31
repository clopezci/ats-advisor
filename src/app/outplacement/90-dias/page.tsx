"use client";

import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

const DAYS = [
  { d: 1, t: "Escucha activa", c: "Agenda 1:1 con tu jefe: ¿cómo se ve el éxito a 30 días?" },
  { d: 15, t: "Primer aporte visible", c: "Entrega un quick win documentado y compártelo." },
  { d: 30, t: "Mapa de stakeholders", c: "Lista quién decide, quién influye y quién informa." },
  { d: 60, t: "Mejora de proceso", c: "Propón un cambio pequeño con métrica." },
  { d: 90, t: "Revisión de trayectoria", c: "Pide feedback formal y acuerda siguientes metas." },
];

export default function NoventaPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Primeros 90 días</h1>
          <SpeakButton text="Modo onboarding: checklist para asegurar tu nuevo empleo en los primeros 90 días." />
        </div>
        <p className="text-sm muted">Actívalo al pausar outplacement cuando consigas trabajo.</p>
      </section>
      {DAYS.map((x) => (
        <div key={x.d} className="bento-card">
          <p className="pill-brand">Día {x.d}</p>
          <h2 className="mt-2 font-semibold">{x.t}</h2>
          <p className="mt-1 text-sm muted">{x.c}</p>
        </div>
      ))}
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
