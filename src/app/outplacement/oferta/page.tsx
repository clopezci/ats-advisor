"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput } from "@/components/VoiceField";
import { formatCop } from "@/lib/channels/pricing";
import { CITY_MULT, SALARY_BANDS, type CityTier } from "@/lib/salary/bandsCo";
import {
  buildScriptsCo,
  computeNegotiationNumbers,
  OFFER_STORAGE_KEY,
  type OfferWizardState,
} from "@/lib/outplacement/offerWizard";

const STEPS = ["Mercado", "Oferta", "Scripts", "Cierre"];

export default function OfertaWizardPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Analista");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<OfferWizardState>({
    bandId: "analista_semi",
    city: "bogota_medellin",
    offerAmount: 0,
    hasBonus: false,
    remoteDays: 0,
    learningBudget: false,
    otherBenefits: "",
  });

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setName(p.name);
      const raw = JSON.parse(localStorage.getItem(OFFER_STORAGE_KEY) || "null");
      if (raw?.bandId) setState((s) => ({ ...s, ...raw }));
    } catch {
      /* ignore */
    }
  }, []);

  const nums = useMemo(() => computeNegotiationNumbers(state), [state]);
  const scripts = useMemo(
    () =>
      buildScriptsCo({
        name,
        role,
        company,
        floor: nums.floor,
        target: nums.target,
        stretch: nums.stretch,
        offer: nums.offer,
        counter: nums.counter,
        verdict: nums.verdict,
      }),
    [name, role, company, nums]
  );

  function persist(next: OfferWizardState) {
    setState(next);
    localStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 1 · Entrevistas y oferta</p>
            <h1 className="mt-1 text-2xl font-semibold">Wizard de oferta</h1>
          </div>
          <SpeakButton text="Define piso, meta y techo con bandas Colombia y genera scripts de negociación." />
        </div>
        <p className="text-sm muted">Paso {step + 1}/4 · {STEPS[step]}</p>
        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              className="btn-secondary text-xs"
              style={i === step ? { borderColor: "var(--brand)" } : undefined}
              onClick={() => setStep(i)}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {step === 0 && (
        <section className="bento-card space-y-3">
          <label className="block text-sm">
            Banda de mercado
            <select
              className="field mt-1"
              value={state.bandId}
              onChange={(e) => persist({ ...state, bandId: e.target.value })}
            >
              {SALARY_BANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label} ({b.note})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Ciudad / modalidad
            <select
              className="field mt-1"
              value={state.city}
              onChange={(e) => persist({ ...state, city: e.target.value as CityTier })}
            >
              {(Object.keys(CITY_MULT) as CityTier[]).map((k) => (
                <option key={k} value={k}>
                  {CITY_MULT[k].label}
                </option>
              ))}
            </select>
          </label>
          <VoiceInput
            label="Cargo que te ofrecieron"
            value={role}
            onChange={setRole}
            placeholder="Ejemplo: Analista de datos"
            dictationLabel="Dictar cargo"
          />
          <p className="text-sm">
            Piso <strong>{formatCop(nums.floor)}</strong> · Meta{" "}
            <strong>{formatCop(nums.target)}</strong> · Techo{" "}
            <strong>{formatCop(nums.stretch)}</strong>
          </p>
          <p className="text-xs muted">{nums.cityLabel} · orientativo, no es encuesta oficial.</p>
          <button type="button" className="btn-primary" onClick={() => setStep(1)}>
            Siguiente: oferta recibida
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="bento-card space-y-3">
          <VoiceInput
            label="Empresa que te hizo la oferta"
            value={company}
            onChange={setCompany}
            placeholder="Ejemplo: Bancolombia"
            dictationLabel="Dictar empresa"
          />
          <label className="block text-sm">
            Sueldo mensual que te dijeron (pesos, sin puntos)
            <input
              className="field mt-1"
              type="number"
              value={state.offerAmount || ""}
              onChange={(e) => persist({ ...state, offerAmount: Number(e.target.value) || 0 })}
              placeholder="Ejemplo: 4500000"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.hasBonus}
              onChange={(e) => persist({ ...state, hasBonus: e.target.checked })}
            />
            Incluye bono / variable
          </label>
          <label className="block text-sm">
            Días remoto / semana
            <input
              className="field mt-1"
              type="number"
              min={0}
              max={5}
              value={state.remoteDays}
              onChange={(e) => persist({ ...state, remoteDays: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.learningBudget}
              onChange={(e) => persist({ ...state, learningBudget: e.target.checked })}
            />
            Presupuesto de aprendizaje
          </label>
          {nums.verdict !== "sin_oferta" && (
            <p className="text-sm">
              Veredicto vs mercado:{" "}
              <strong style={{ color: "var(--brand)" }}>{nums.verdict}</strong>
              {nums.verdict === "bajo" && ` · Contraoferta sugerida ${formatCop(nums.counter)}`}
            </p>
          )}
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => setStep(0)}>
              Atrás
            </button>
            <button type="button" className="btn-primary" onClick={() => setStep(2)}>
              Ver scripts
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="bento-card space-y-4">
          {(
            [
              ["Pedir rango primero", scripts.askRange],
              ["Anclar piso / meta", scripts.stateFloor],
              ["Negociar paquete total", scripts.totalComp],
              ["Pedir 24–48 h", scripts.time],
              ["Declinar con puerta abierta", scripts.declineSoft],
            ] as const
          ).map(([t, body]) => (
            <div key={t}>
              <p className="text-sm font-medium">{t}</p>
              <p className="mt-1 text-sm muted leading-relaxed">{body}</p>
              <button
                type="button"
                className="btn-secondary mt-2 text-xs"
                onClick={() => navigator.clipboard?.writeText(body)}
              >
                Copiar
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
              Atrás
            </button>
            <button type="button" className="btn-primary" onClick={() => setStep(3)}>
              Checklist de cierre
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="bento-card space-y-3">
          <ul className="space-y-2 text-sm">
            <li>• Todo acuerdo relevante por escrito (salario, bono, remoto, fecha).</li>
            <li>• Revisa tipo de contrato y periodo de prueba (ver guía bienestar/derechos).</li>
            <li>• Si aceptas: pausa Carrera y abre modo 90 días.</li>
            <li>• Si rechazas: deja la puerta abierta sin quemar el puente.</li>
          </ul>
          <Link href="/outplacement/bienestar" className="btn-secondary">
            Guía derechos CO
          </Link>
          <Link href="/outplacement/90-dias" className="btn-secondary">
            Modo 90 días
          </Link>
          <button type="button" className="btn-primary" onClick={() => setStep(0)}>
            Reiniciar wizard
          </button>
        </section>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
