"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { ROUTE_14 } from "@/lib/workbook/route14";

const KEY = "ats_ruta14_done_v1";
const INTRO =
  "Ruta sugerida de 14 sesiones. No es un menú paralelo: es el mismo flujo del cuadernillo, ordenado para coach humano o IA. Marca lo hecho y sigue.";

export default function Ruta14Page() {
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(raw)) setDone(raw);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(n: number) {
    const set = new Set(done);
    if (set.has(n)) set.delete(n);
    else set.add(n);
    const next = [...set].sort((a, b) => a - b);
    setDone(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  const nextOpen = ROUTE_14.find((s) => !done.includes(s.n));

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · ruta</p>
            <h1 className="text-2xl font-semibold">14 sesiones</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          {done.length}/14 · {nextOpen ? `Siguiente: ${nextOpen.title}` : "Ruta completa"}
        </p>
        {nextOpen?.href ? (
          <Link href={nextOpen.href} className="btn-primary">
            Continuar sesión {nextOpen.n}
          </Link>
        ) : null}
      </section>

      {ROUTE_14.map((s) => (
        <article key={s.n} className="bento-card space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={done.includes(s.n)}
              onChange={() => toggle(s.n)}
            />
            <div className="flex-1 space-y-1">
              <h2 className="font-semibold text-sm">
                {s.n}. {s.title} · {s.pct}%
              </h2>
              <p className="text-xs muted">{s.focus}</p>
              <p className="text-xs muted">Coach: {s.coachHint}</p>
              {s.href ? (
                <Link href={s.href} className="text-sm underline">
                  Abrir herramienta
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      ))}

      <Link href="/outplacement/cuadernillo" className="btn-secondary">
        Hub del cuadernillo (fases)
      </Link>
      <Link href="/outplacement/coaches" className="btn-secondary">
        Coaches IA
      </Link>
    </div>
  );
}
