"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { DictationButton } from "@/components/DictationButton";
import { appendCoachMessage, getRoleReviewPlan } from "@/lib/roleReview/storage";
import { bumpRoleReviewMetric } from "@/lib/roleReview/metrics";
import { getJob } from "@/lib/tracker/jobs";
import type { RoleReviewPlan } from "@/lib/roleReview/types";
import { withUserAiHeaders } from "@/lib/ai/userKeysClient";
import { canAccessOutplacement, readEntitlement, type PlanId } from "@/lib/entitlements";
import { PaywallCard } from "@/components/PaywallCard";

export default function CoachClient() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [plan, setPlan] = useState<RoleReviewPlan | null>(null);
  const [reply, setReply] = useState("");
  const [nudge, setNudge] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [jobText, setJobText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [planId, setPlanId] = useState<PlanId>("free");

  useEffect(() => {
    setPlanId(readEntitlement().plan);
    const p = id ? getRoleReviewPlan(id) : null;
    setPlan(p);
    if (!p) return;
    setJobTitle(p.title.replace(/^Repaso:\s*/i, ""));
    if (p.jobId) {
      const j = getJob(p.jobId);
      if (j) {
        setJobTitle(j.title);
        setCompany(j.company);
        if (j.jobText) setJobText(j.jobText);
      }
    }
    try {
      const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
      if (!jobText && last?.jobText) setJobText(last.jobText);
    } catch {
      /* ignore */
    }
  }, [id]);

  async function askManager(userReply?: string) {
    if (!plan) return;
    setLoading(true);
    try {
      const focus =
        plan.days.find((d) => !plan.completedDays.includes(d.day))?.title ||
        plan.days[0]?.title ||
        "";
      const res = await fetch("/api/role-review/coach", {
        method: "POST",
        headers: withUserAiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          jobTitle,
          company,
          jobText,
          focus,
          userReply: userReply || "",
          history: (plan.coachTranscript || []).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNudge(data.error || "No pudimos evaluar tu respuesta. Intenta de nuevo.");
        return;
      }
      let next = plan;
      if (userReply?.trim()) {
        next = appendCoachMessage(plan.id, { role: "you", text: userReply.trim() }) || plan;
      }
      const managerText = String(data.manager || "").trim();
      if (managerText) {
        next = appendCoachMessage(next.id, { role: "manager", text: managerText }) || next;
      }
      setPlan({ ...next });
      const tip = String(data.nudge || "").trim();
      if (userReply?.trim()) {
        setNudge(
          tip ||
            "A mejorar. No recibimos el veredicto completo. Responde con una acción de esta semana y un alcance."
        );
      } else {
        setNudge(tip);
      }
      setDone(Boolean(data.done));
      setReply("");
    } catch {
      setNudge("No pudimos conectar. Revisa la red e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!plan) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-sm muted">No hay plan para el simulacro.</p>
        <Link href="/ats/repaso" className="btn-primary">
          Crear repaso
        </Link>
      </div>
    );
  }

  if (!canAccessOutplacement(planId)) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <PaywallCard
          currentPlan={planId}
          nextHref={`/ats/repaso/player/coach?id=${encodeURIComponent(plan.id)}`}
          title="El 1:1 va con Carrera"
          reason="Aquí el manager te dice si la respuesta sirve o hay que mejorarla. Es práctica con IA."
          bullets={[
            "Veredicto Sirve / A mejorar en cada respuesta",
            "Preguntas ancladas al aviso",
            "Curso completo, retos, tickets y STAR",
          ]}
        />
        <Link
          href={`/ats/repaso/player?id=${encodeURIComponent(plan.id)}`}
          className="btn-secondary"
        >
          Volver al mapa del rol (gratis)
        </Link>
      </div>
    );
  }

  const transcript = plan.coachTranscript || [];

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Simulacro 1:1 · manager</p>
            <h1 className="text-xl font-semibold">{plan.title}</h1>
          </div>
          <SpeakButton
            text={
              transcript.filter((m) => m.role === "manager").slice(-1)[0]?.text ||
              "Abre el 1:1 con tu manager."
            }
          />
        </div>
        <p className="text-sm muted">
          Con Carrera practicas el 1:1. Al enviar, ves si la respuesta sirve o hay que mejorarla.
        </p>
      </section>

      <section className="bento-card space-y-3 max-h-[50vh] overflow-y-auto">
        {transcript.length === 0 ? (
          <p className="text-sm muted">Aún no hay mensajes. Empieza el 1:1.</p>
        ) : (
          transcript.map((m, i) => (
            <div
              key={`${m.at}-${i}`}
              className="rounded-lg p-3 text-sm"
              style={{
                border: "1px solid var(--border)",
                background: m.role === "manager" ? "transparent" : "color-mix(in srgb, var(--brand) 8%, transparent)",
              }}
            >
              <p className="text-xs muted mb-1">{m.role === "manager" ? "Manager" : "Tú"}</p>
              <p className="leading-relaxed">{m.text}</p>
            </div>
          ))
        )}
      </section>

      {nudge ? (
        <section
          className="bento-card space-y-2"
          style={{
            borderColor: nudge.startsWith("Sirve")
              ? "var(--brand)"
              : nudge.startsWith("A mejorar")
                ? "#b45309"
                : "var(--border)",
            borderWidth: 2,
          }}
        >
          <p className="text-xs muted">Veredicto de tu última respuesta</p>
          <h2 className="text-base font-semibold">
            {nudge.startsWith("Sirve")
              ? "Tu respuesta sirve"
              : nudge.startsWith("A mejorar")
                ? "Tu respuesta hay que mejorarla"
                : "Sobre tu respuesta"}
          </h2>
          <p className="text-sm leading-relaxed">{nudge}</p>
        </section>
      ) : null}
      {done ? (
        <p className="text-sm" style={{ color: "var(--brand)" }}>
          1:1 cerrado. Vuelve al player o re-analiza el CV.
        </p>
      ) : null}

      <section className="bento-card space-y-3">
        {transcript.length === 0 ? (
          <button
            type="button"
            className="btn-primary"
            disabled={loading}
            onClick={() => {
              bumpRoleReviewMetric("coachSessions");
              void askManager();
            }}
          >
            {loading ? "Abriendo…" : "Empezar 1:1"}
          </button>
        ) : (
          <>
            <div className="flex gap-2">
              <textarea
                className="field min-h-24"
                placeholder="Tu respuesta al manager…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                disabled={done}
              />
              <DictationButton
                label="Dictar"
                onResult={(t) => setReply((p) => `${p} ${t}`.trim())}
              />
            </div>
            <button
              type="button"
              className="btn-primary"
              disabled={loading || done || reply.trim().length < 8}
              onClick={() => askManager(reply)}
            >
              {loading ? "Respondiendo…" : "Enviar"}
            </button>
          </>
        )}
      </section>

      <div className="flex flex-col gap-2">
        <Link
          href={`/ats/repaso/player?id=${encodeURIComponent(plan.id)}`}
          className="btn-secondary"
        >
          Volver al player
        </Link>
        <Link href="/ats" className="btn-secondary">
          Re-analizar CV vs esta vacante
        </Link>
      </div>
    </div>
  );
}
