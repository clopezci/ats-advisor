"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CoachAsk } from "@/components/workbook/CoachAsk";

const INTRO =
  "Checklist de identidad digital: un solo lugar para alinear CV, perfil profesional, foto y keywords con tu banco SOAR.";

const CHECKS = [
  { id: "foto", label: "Foto profesional coherente (mismo estilo CV/perfil)" },
  { id: "headline", label: "Headline con rol target + 1 resultado (no solo título actual)" },
  { id: "about", label: "About / resumen con pitch + 2 logros SOAR" },
  { id: "keywords", label: "Keywords del rol target (honestas) en CV y perfil" },
  { id: "experiencias", label: "Experiencias con verbos + métricas (no listas de tareas)" },
  { id: "skills", label: "Skills alineadas a top 5 competencias + SOAR" },
  { id: "url", label: "URL limpia / contacto fácil de encontrar" },
  { id: "consistencia", label: "Misma historia en CV, perfil y guion de salida" },
];

const KEY = "ats_marca_digital_v1";

export default function MarcaDigitalPage() {
  const [done, setDone] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(raw?.done)) setDone(raw.done);
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: string[]) {
    setDone(next);
    localStorage.setItem(KEY, JSON.stringify({ done: next, updatedAt: Date.now() }));
  }

  function toggle(id: string) {
    const set = new Set(done);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    persist([...set]);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · marca</p>
            <h1 className="text-2xl font-semibold">Identidad digital</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          {done.length}/{CHECKS.length} listos
        </p>
      </section>

      <section className="bento-card space-y-3">
        {CHECKS.map((c) => (
          <label key={c.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={done.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            <span>{c.label}</span>
          </label>
        ))}
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMsg("Checklist guardado en este dispositivo.")}
        >
          Guardar avance
        </button>
        {msg ? <p className="text-sm muted">{msg}</p> : null}
      </section>

      <CoachAsk
        coachModule="marca personal y SOAR"
        placeholder="Ej.: ¿cómo elijo keywords sin mentir en el perfil?"
      />

      <Link href="/outplacement/cuadernillo/soar" className="btn-secondary">
        Banco SOAR
      </Link>
      <Link href="/herramientas/linkedin" className="btn-secondary">
        Herramienta de perfil
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
