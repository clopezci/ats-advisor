"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

type Mod = { code: string; title: string; summary: string; days: number };

export default function OutplacementPage() {
  const [modules, setModules] = useState<Mod[]>([]);

  useEffect(() => {
    fetch("/api/outplacement/modules")
      .then((r) => r.json())
      .then((d) => setModules(d.modules || []))
      .catch(() => setModules([]));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Carrera</p>
            <h1 className="mt-1 text-2xl font-semibold">Outplacement</h1>
          </div>
          <SpeakButton text="Elige un módulo de la ruta o crea un curso personalizado OUT-09." />
        </div>
        <p className="muted text-sm">
          Ruta completa OUT-01 a OUT-08. Desde $79.000 COP/mes. También puedes crear un curso a
          tu medida.
        </p>
      </section>

      <div className="flex flex-col gap-3">
        <Link href="/outplacement/out09" className="btn-primary">
          Crear curso personalizado (OUT-09)
        </Link>
        <Link href="/outplacement/ruta" className="btn-secondary">
          Ver ruta OUT-01 a OUT-08
        </Link>
      </div>

      <div className="space-y-3">
        {modules.map((m) => (
          <Link key={m.code} href={`/outplacement/ruta?code=${m.code}`} className="bento-card block">
            <div className="flex items-center justify-between gap-2">
              <span className="pill-brand">{m.code}</span>
              <span className="text-xs muted">{m.days} días</span>
            </div>
            <h2 className="mt-2 text-base font-semibold">{m.title}</h2>
            <p className="mt-1 text-sm muted">{m.summary}</p>
          </Link>
        ))}
      </div>

      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
