"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  completeMission,
  missionsForToday,
  readMissionProgress,
  xpRank,
  type Mission,
  type MissionProgress,
} from "@/lib/engagement/missions";
import { bumpStreak, readStreak } from "@/lib/engagement/streak";

export default function MisionesPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [prog, setProg] = useState<MissionProgress>({ day: "", done: [], xpTotal: 0 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setMissions(missionsForToday());
    setProg(readMissionProgress());
    setStreak(readStreak().count);
  }, []);

  function mark(m: Mission) {
    const next = completeMission(m);
    setProg(next);
    setStreak(bumpStreak().count);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 2 · hábito</p>
            <h1 className="mt-1 text-2xl font-semibold">Misiones del día</h1>
          </div>
          <SpeakButton text="Tres misiones diarias con experiencia. Mantén la racha y sube de rango." />
        </div>
        <p className="text-sm">
          XP total: <strong>{prog.xpTotal}</strong> · Rango:{" "}
          <span className="pill-brand">{xpRank(prog.xpTotal)}</span>
          {streak > 0 ? ` · Racha ${streak}d` : ""}
        </p>
      </section>

      {missions.map((m) => {
        const done = prog.done.includes(m.id);
        return (
          <section key={m.id} className="bento-card space-y-2">
            <div className="flex justify-between gap-2">
              <h2 className="font-semibold">{m.title}</h2>
              <span className="text-xs muted">+{m.xp} XP</span>
            </div>
            <div className="flex gap-2">
              <Link href={m.href} className="btn-secondary">
                Ir
              </Link>
              <button
                type="button"
                className="btn-primary"
                disabled={done}
                onClick={() => mark(m)}
              >
                {done ? "Hecha" : "Marcar hecha"}
              </button>
            </div>
          </section>
        );
      })}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
