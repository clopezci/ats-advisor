"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import {
  getRoleReviewPlan,
  markChallengeDone,
  markDayDone,
} from "@/lib/roleReview/storage";
import type { RoleReviewPlan } from "@/lib/roleReview/types";

export default function PlayerClient() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [plan, setPlan] = useState<RoleReviewPlan | null>(null);
  const [day, setDay] = useState(1);

  useEffect(() => {
    const p = id ? getRoleReviewPlan(id) : null;
    setPlan(p);
    if (p?.days?.length) {
      const firstOpen = p.days.find((d) => !p.completedDays.includes(d.day));
      setDay(firstOpen?.day || p.days[0].day);
    }
  }, [id]);

  const current = useMemo(
    () => plan?.days?.find((d) => d.day === day) || null,
    [plan, day]
  );
  const challenge = useMemo(
    () => plan?.challenges?.find((c) => c.id === current?.challengeId) || null,
    [plan, current]
  );

  if (!plan) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-sm muted">No hay plan cargado.</p>
        <Link href="/ats/repaso" className="btn-primary">
          Crear repaso
        </Link>
      </div>
    );
  }

  const dayDone = plan.completedDays.includes(day);
  const chDone = challenge ? plan.completedChallenges.includes(challenge.id) : false;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">
              Día {day} de {plan.days.length} · {plan.completedDays.length} listos
            </p>
            <h1 className="text-xl font-semibold">{plan.title}</h1>
          </div>
          <SpeakButton text={current?.explain || plan.objective} />
        </div>
        <p className="text-sm muted">{plan.objective}</p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {plan.days.map((d) => (
          <button
            key={d.day}
            type="button"
            className="pill-brand whitespace-nowrap"
            onClick={() => setDay(d.day)}
            style={
              plan.completedDays.includes(d.day)
                ? { opacity: 0.85, outline: "1px solid var(--brand)" }
                : undefined
            }
          >
            Día {d.day}
            {plan.completedDays.includes(d.day) ? " ✓" : ""}
          </button>
        ))}
      </div>

      {current ? (
        <section className="bento-card space-y-3">
          <h2 className="font-semibold">{current.title}</h2>
          {current.learnTopics?.length ? (
            <p className="text-xs muted">Aprendes: {current.learnTopics.join(" · ")}</p>
          ) : null}
          <div className="space-y-2 text-sm leading-relaxed">
            <p>
              <span className="font-medium">Qué / para qué: </span>
              {current.explain}
            </p>
            <p>
              <span className="font-medium">En una empresa: </span>
              {current.realWorld}
            </p>
            <ul className="muted space-y-1">
              {(current.practices || []).map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
            <p>
              <span className="font-medium">Pregunta de entrevista: </span>
              {current.interviewQ}
            </p>
            <p className="text-xs muted">Listo cuando: {(current.doneWhen || []).join(" · ")}</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            disabled={dayDone}
            onClick={() => {
              const next = markDayDone(plan.id, day);
              if (next) setPlan({ ...next });
            }}
          >
            {dayDone ? "Día marcado" : "Marcar día como hecho"}
          </button>
        </section>
      ) : null}

      {challenge ? (
        <section
          className="bento-card space-y-3"
          style={{ borderColor: "var(--brand)" }}
        >
          <p className="text-xs muted">Reto del trabajo diario · ~{challenge.timeMin} min</p>
          <h2 className="font-semibold">{challenge.title}</h2>
          <p className="text-sm leading-relaxed">{challenge.brief}</p>
          <p className="text-xs muted">Del aviso: “{challenge.jdAnchor}”</p>
          <ol className="text-sm muted space-y-1 list-decimal pl-4">
            {(challenge.steps || []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="text-sm">
            <span className="font-medium">Entregable: </span>
            {challenge.deliverable}
          </p>
          {(challenge.pitfalls || []).length ? (
            <p className="text-xs muted">Evita: {challenge.pitfalls.join(" · ")}</p>
          ) : null}
          <button
            type="button"
            className="btn-primary"
            disabled={chDone}
            onClick={() => {
              const next = markChallengeDone(plan.id, challenge.id);
              if (next) setPlan({ ...next });
            }}
          >
            {chDone ? "Reto completado" : "Completé el reto"}
          </button>
        </section>
      ) : null}

      <div className="flex flex-col gap-2">
        <Link href="/ats/repaso" className="btn-secondary">
          Nuevo repaso
        </Link>
        <Link href="/tracker" className="btn-secondary">
          Ir al tracker
        </Link>
      </div>
    </div>
  );
}
