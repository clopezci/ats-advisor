"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";
import {
  getRoleReviewPlan,
  markChallengeDone,
  markDayDone,
  markTicketDone,
  markWeek1Done,
  planProgressPct,
  saveStarAnswer,
} from "@/lib/roleReview/storage";
import { ROLE_REVIEW_FAMILY_LABEL, type RoleReviewPlan } from "@/lib/roleReview/types";

type Tab = "dia" | "ticket" | "star" | "semana1";

export default function PlayerClient() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [plan, setPlan] = useState<RoleReviewPlan | null>(null);
  const [day, setDay] = useState(1);
  const [tab, setTab] = useState<Tab>("dia");

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
  const ticket = useMemo(() => {
    if (!plan) return null;
    if (current?.ticketId) {
      return plan.tickets.find((t) => t.id === current.ticketId) || null;
    }
    return plan.tickets.find((t) => t.day === day) || null;
  }, [plan, current, day]);
  const star = useMemo(() => {
    if (!plan) return null;
    if (current?.starId) {
      return plan.starBank.find((s) => s.id === current.starId) || null;
    }
    return plan.starBank.find((s) => s.day === day) || null;
  }, [plan, current, day]);

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
  const tkDone = ticket ? plan.completedTickets.includes(ticket.id) : false;
  const pct = planProgressPct(plan);
  const familyLabel = plan.roleFamily ? ROLE_REVIEW_FAMILY_LABEL[plan.roleFamily] : null;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">
              Día {day} de {plan.days.length} · {pct}% · {plan.completedDays.length} listos
              {familyLabel ? ` · ${familyLabel}` : ""}
            </p>
            <h1 className="text-xl font-semibold">{plan.title}</h1>
          </div>
          <SpeakButton text={current?.explain || plan.objective} />
        </div>
        <p className="text-sm muted">{plan.objective}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
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

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            ["dia", "Estudio"],
            ["ticket", "Ticket"],
            ["star", "STAR"],
            ["semana1", "Semana 1"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={tab === k ? "btn-primary" : "btn-secondary"}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "dia" && current ? (
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

          {challenge ? (
            <div
              className="space-y-2 rounded-lg p-3"
              style={{ border: "1px solid var(--brand)" }}
            >
              <p className="text-xs muted">Reto del trabajo diario · ~{challenge.timeMin} min</p>
              <h3 className="font-semibold text-sm">{challenge.title}</h3>
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
            </div>
          ) : null}

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

      {tab === "ticket" ? (
        <section className="bento-card space-y-3">
          {ticket ? (
            <>
              <div className="flex items-center gap-2 text-xs muted">
                <span className="pill-brand">{ticket.priority}</span>
                <span>{ticket.type}</span>
                <span>~{ticket.timeMin} min</span>
              </div>
              <h2 className="font-semibold">{ticket.title}</h2>
              <p className="text-sm leading-relaxed">{ticket.description}</p>
              <p className="text-xs muted">Del aviso: “{ticket.jdAnchor}”</p>
              <p className="text-sm font-medium">Criterios de aceptación</p>
              <ul className="text-sm muted space-y-1">
                {(ticket.acceptance || []).map((a) => (
                  <li key={a}>☐ {a}</li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-primary"
                disabled={tkDone}
                onClick={() => {
                  const next = markTicketDone(plan.id, ticket.id);
                  if (next) setPlan({ ...next });
                }}
              >
                {tkDone ? "Ticket cerrado" : "Cerrar ticket"}
              </button>
            </>
          ) : (
            <p className="text-sm muted">No hay ticket para este día.</p>
          )}
          {(plan.tickets || []).length > 1 ? (
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs muted">Backlog del plan</p>
              {plan.tickets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="w-full text-left text-sm rounded-lg p-2"
                  style={{ border: "1px solid var(--border)" }}
                  onClick={() => {
                    setDay(t.day);
                    setTab("ticket");
                  }}
                >
                  {plan.completedTickets.includes(t.id) ? "✓ " : ""}
                  {t.priority} · {t.title}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "star" ? (
        <section className="bento-card space-y-3">
          {star ? (
            <>
              <p className="text-xs muted">Banco STAR · día {star.day}</p>
              <h2 className="font-semibold text-sm leading-relaxed">{star.question}</h2>
              <p className="text-xs muted">{star.hint}</p>
              <p className="text-xs muted">Del aviso: “{star.jdAnchor}”</p>
              <div className="flex gap-2">
                <textarea
                  className="field min-h-32"
                  placeholder="Escribe tu STAR con hechos tuyos (o cómo lo practicarás en pequeño)."
                  value={plan.starAnswers[star.id] || ""}
                  onChange={(e) => {
                    const next = saveStarAnswer(plan.id, star.id, e.target.value);
                    if (next) setPlan({ ...next });
                  }}
                />
                <DictationButton
                  label="Dictar STAR"
                  onResult={(t) => {
                    const prev = plan.starAnswers[star.id] || "";
                    const next = saveStarAnswer(plan.id, star.id, `${prev} ${t}`.trim());
                    if (next) setPlan({ ...next });
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm muted">No hay pregunta STAR para este día.</p>
          )}
          {(plan.starBank || []).length > 1 ? (
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs muted">Otras preguntas del plan</p>
              {plan.starBank.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full text-left text-sm rounded-lg p-2"
                  style={{ border: "1px solid var(--border)" }}
                  onClick={() => {
                    setDay(s.day);
                    setTab("star");
                  }}
                >
                  {plan.starAnswers[s.id]?.trim() ? "✓ " : ""}Día {s.day}: {s.question.slice(0, 80)}…
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "semana1" ? (
        <section className="bento-card space-y-3">
          <h2 className="font-semibold">Checklist · primera semana</h2>
          <p className="text-xs muted">
            Para no llegar en frío al día 1: tacha lo que ya entiendes o simulaste.
          </p>
          {(plan.week1Checklist || []).length === 0 ? (
            <p className="text-sm muted">Sin checklist en este plan.</p>
          ) : (
            <ul className="space-y-2">
              {plan.week1Checklist.map((item) => {
                const done = plan.completedWeek1.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 text-sm rounded-lg p-2"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={done}
                      onChange={() => {
                        if (done) return;
                        const next = markWeek1Done(plan.id, item.id);
                        if (next) setPlan({ ...next });
                      }}
                    />
                    <div>
                      <p className="text-xs muted">{item.dayHint}</p>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs muted">{item.why}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
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
