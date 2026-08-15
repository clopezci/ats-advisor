"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  FINANCE_LIQUIDATION_CHECKS,
  readWorkbook,
  writeWorkbook,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Finanzas de transición: cuatro pilares educativos. Calcula tu pista de aterrizaje y ancla el piso de oferta a esa realidad — sin asesoría legal ni tributaria.";

export default function FinanzasWizardPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setWb(readWorkbook());
  }, []);

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  function save(next: WorkbookState) {
    setWb(next);
    writeWorkbook(next);
  }

  function patch(p: Partial<WorkbookState["finance"]>) {
    save({ ...wb!, finance: { ...wb!.finance, ...p, updatedAt: Date.now() } });
  }

  function toggleCheck(id: string) {
    const set = new Set(wb!.finance.liquidationChecklist);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    patch({ liquidationChecklist: [...set] });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, finanzas: true },
      finance: { ...wb!.finance, updatedAt: Date.now() },
    });
    setMsg("Finanzas guardadas. Úsalas al negociar en Compensación.");
  }

  const f = wb.finance;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · finanzas</p>
            <h1 className="text-2xl font-semibold">4 pilares de transición</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">1. Pista de aterrizaje</h2>
        <VoiceInput
          label="Gastos fijos mensuales (aprox.)"
          value={f.monthlyFixed}
          onChange={(v) => patch({ monthlyFixed: v })}
          className="field"
          placeholder="Ej.: 3.500.000 COP"
          dictationLabel="Dictar gastos"
        />
        <VoiceInput
          label="Meses de pista (ahorro ÷ gastos)"
          value={f.runwayMonths}
          onChange={(v) => patch({ runwayMonths: v })}
          className="field"
          placeholder="Ej.: 2.5"
          dictationLabel="Dictar meses"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">2. Flujo semanal</h2>
        <VoiceTextarea
          label="Qué pauso / qué mantengo / ingreso puente"
          value={f.weeklyNotes}
          onChange={(v) => patch({ weeklyNotes: v })}
          className="field min-h-24"
          dictationLabel="Dictar flujo"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">3. Liquidación y documentos</h2>
        {FINANCE_LIQUIDATION_CHECKS.map((c) => (
          <label key={c.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={f.liquidationChecklist.includes(c.id)}
              onChange={() => toggleCheck(c.id)}
            />
            <span>{c.label}</span>
          </label>
        ))}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">4. Piso de oferta</h2>
        <VoiceTextarea
          label="Piso anclado a pista + dignidad de mercado"
          value={f.offerFloorNote}
          onChange={(v) => patch({ offerFloorNote: v })}
          className="field min-h-20"
          placeholder="No acepto menos de … porque …"
          dictationLabel="Dictar piso"
        />
      </section>

      <CoachAsk
        coachModule="compensación y oferta"
        placeholder="Ej.: ¿cómo defino un piso si mi pista es de 6 semanas?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar finanzas como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/oferta" className="btn-secondary">
        Ir a wizard de compensación
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
