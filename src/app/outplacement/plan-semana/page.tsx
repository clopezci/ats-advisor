"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { buildWeekPlan, type WeekSlot } from "@/lib/engagement/weekPlan";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";

export default function PlanSemanaPage() {
  const [slots, setSlots] = useState<WeekSlot[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const plan = readEntitlement().plan;
    const hasOut09 = plan === "plus" || plan === "tester";
    setSlots(buildWeekPlan({ hasOut09: hasOut09 && canAccessOutplacement(plan) }));
    try {
      setDone(JSON.parse(localStorage.getItem("ats_week_done") || "{}"));
    } catch {
      setDone({});
    }
  }, []);

  function toggle(day: string) {
    const next = { ...done, [day]: !done[day] };
    setDone(next);
    localStorage.setItem("ats_week_done", JSON.stringify(next));
  }

  const completed = slots.filter((s) => done[s.day]).length;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 5 · ritmo</p>
            <h1 className="mt-1 text-2xl font-semibold">Plan de la semana</h1>
          </div>
          <SpeakButton text="Siete bloques cortos. Márcalos al completarlos para mantener el ritmo." />
        </div>
        <p className="text-sm muted">
          Completados {completed}/{slots.length} · ~{slots.reduce((a, s) => a + s.minutes, 0)} min/semana
        </p>
      </section>

      {slots.map((s) => (
        <article key={s.day} className="bento-card space-y-2">
          <div className="flex justify-between gap-2">
            <h2 className="font-semibold">
              {s.day} · {s.focus}
            </h2>
            <span className="text-xs muted">{s.minutes} min</span>
          </div>
          <div className="flex gap-2">
            <Link href={s.href} className="btn-secondary">
              Ir
            </Link>
            <button type="button" className="btn-primary" onClick={() => toggle(s.day)}>
              {done[s.day] ? "Hecho ✓" : "Marcar"}
            </button>
          </div>
        </article>
      ))}

      <Link href="/outplacement/progreso" className="btn-secondary">
        Ver progreso global
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
