"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { loadRiasecResult } from "@/lib/outplacement/riasec";
import { openCareerBriefPrint } from "@/lib/outplacement/careerBrief";

export default function CareerBriefPage() {
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [city, setCity] = useState("Colombia");
  const [strengths, setStrengths] = useState("");
  const [gaps, setGaps] = useState("");
  const [next30, setNext30] = useState("");
  const [hasRiasec, setHasRiasec] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setName(p.name);
      const r = loadRiasecResult();
      setHasRiasec(Boolean(r));
      if (r?.roles[0]) setTargetRole(r.roles[0].title);
    } catch {
      /* ignore */
    }
  }, []);

  function generate() {
    const riasec = loadRiasecResult();
    const ok = openCareerBriefPrint({
      name: name || "Candidato",
      targetRole,
      city,
      riasec,
      strengths,
      gaps,
      next30,
    });
    setMsg(
      ok
        ? "Abrimos el brief para imprimir / guardar PDF. Si no ves la ventana, permite pop-ups."
        : "El navegador bloqueó la ventana. Permite pop-ups o usa otro navegador."
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 1 · OUT-02/03</p>
            <h1 className="mt-1 text-2xl font-semibold">Career Brief</h1>
          </div>
          <SpeakButton text="Genera una página PDF con tu perfil RIASEC, roles LATAM y plan de 30 días." />
        </div>
        <p className="text-sm muted">
          Artefacto de 1 página para compartir con coach, familia o RH.{" "}
          {hasRiasec ? "Assessment detectado." : "Recomendado: haz antes el assessment RIASEC."}
        </p>
        {!hasRiasec && (
          <Link href="/outplacement/assessment" className="btn-secondary">
            Ir al assessment
          </Link>
        )}
      </section>

      <div className="bento-card space-y-3">
        <label className="block text-sm">
          Nombre
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm">
          Ciudad / país
          <input className="field mt-1" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label className="block text-sm">
          Rol objetivo
          <input
            className="field mt-1"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Fortalezas (3 evidencias)
          <textarea
            className="field mt-1 min-h-[80px]"
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="Ej.: lideré migración X; reduje tiempo Y un 30%…"
          />
        </label>
        <label className="block text-sm">
          Gaps a cerrar
          <textarea
            className="field mt-1 min-h-[80px]"
            value={gaps}
            onChange={(e) => setGaps(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Plan 30 días
          <textarea
            className="field mt-1 min-h-[80px]"
            value={next30}
            onChange={(e) => setNext30(e.target.value)}
          />
        </label>
        <button type="button" className="btn-primary" onClick={generate}>
          Generar / imprimir PDF
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </div>

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
