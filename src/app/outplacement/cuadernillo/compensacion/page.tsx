"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { readWorkbook, writeWorkbook, type WorkbookState } from "@/lib/workbook/types";

const INTRO =
  "Negocia paquete total, no solo el sueldo base. Define piso, meta y techo antes de la llamada. Educativo: no es asesoría legal.";

const FIELDS = [
  ["base", "Salario base (actual o target)"],
  ["variable", "Variable / bono"],
  ["benefits", "Beneficios valorados (salud, póliza, etc.)"],
  ["flexibility", "Flexibilidad (remoto, horarios)"],
  ["growth", "Crecimiento (aprendizaje, scope)"],
  ["floor", "Piso (no bajo de…)"],
  ["target", "Meta"],
  ["stretch", "Techo / stretch"],
  ["dealbreakers", "Dealbreakers"],
  ["negotiables", "Negociables"],
] as const;

export default function CompensacionPage() {
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

  function patch(p: Partial<WorkbookState["compensation"]>) {
    save({ ...wb!, compensation: { ...wb!.compensation, ...p, updatedAt: Date.now() } });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, compensacion: true },
      compensation: { ...wb!.compensation, updatedAt: Date.now() },
    });
    setMsg("Compensación guardada. Usa el wizard de oferta para scripts con bandas CO.");
  }

  const c = wb.compensation;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · compensación</p>
            <h1 className="text-2xl font-semibold">Paquete total</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        {wb.finance.offerFloorNote ? (
          <p className="text-xs muted">Desde finanzas: {wb.finance.offerFloorNote.slice(0, 160)}</p>
        ) : null}
      </section>

      {FIELDS.map(([key, label]) => (
        <section key={key} className="bento-card space-y-2">
          <VoiceTextarea
            label={label}
            value={c[key]}
            onChange={(v) => patch({ [key]: v })}
            className="field min-h-16"
            dictationLabel="Dictar"
          />
        </section>
      ))}

      <CoachAsk
        coachModule="compensación y oferta"
        placeholder="Ej.: ¿cómo pido la banda sin sonar agresivo?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar compensación como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/oferta" className="btn-secondary">
        Scripts y bandas Colombia
      </Link>
      <Link href="/outplacement/cuadernillo/finanzas" className="btn-secondary">
        Revisar finanzas / pista
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
