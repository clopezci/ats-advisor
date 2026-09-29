"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { WB_EX } from "@/lib/workbook/fieldExamples";
import { readWorkbook, writeWorkbook, type WorkbookState } from "@/lib/workbook/types";
import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";

const INTRO =
  "Filtro de 7 días: ¿emprendimiento como puente, destino o pausa? Evidencia primero; no abandones la búsqueda si tu pista es corta.";

const VENTURE_FIELDS = [
  ["customerProblem", "1. Problema de cliente (quién paga)", WB_EX.emprendimiento.customerProblem],
  ["offerOneLiner", "2. Oferta en una frase", WB_EX.emprendimiento.offerOneLiner],
  ["minPrice", "3. Precio mínimo viable", WB_EX.emprendimiento.minPrice],
  ["prospects", "4. Cinco prospectos con nombre", WB_EX.emprendimiento.prospects],
  ["weekConversations", "5. Conversaciones esta semana", WB_EX.emprendimiento.weekConversations],
  ["monthCosts", "6. Costos fijos del mes", WB_EX.emprendimiento.monthCosts],
  ["goNoGo", "7. Criterio a 30 días (sigo / pauso)", WB_EX.emprendimiento.goNoGo],
  ["segments", "Canvas · segmentos", WB_EX.emprendimiento.segments],
  ["channels", "Canvas · canales", WB_EX.emprendimiento.channels],
  ["pipeline", "Canvas · pipeline clientes", WB_EX.emprendimiento.pipeline],
] as const;

export default function EmprendimientoPage() {
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

  function patch(p: Partial<WorkbookState["venture"]>) {
    save({ ...wb!, venture: { ...wb!.venture, ...p, updatedAt: Date.now() } });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, emprendimiento: true },
      venture: { ...wb!.venture, updatedAt: Date.now() },
    });
    setMsg("Decisión registrada. Puedes profundizar en Segunda carrera si eliges vía independiente.");
  }

  const v = wb.venture;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · vía opcional</p>
            <h1 className="text-2xl font-semibold">Emprendimiento / puente</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      {VENTURE_FIELDS.map(([key, label, example]) => (
        <section key={key} className="bento-card space-y-2">
          <VoiceTextarea
            label={label}
            value={v[key]}
            onChange={(val) => patch({ [key]: val })}
            className="field min-h-20"
            example={example}
            dictationLabel="Dictar"
          />
        </section>
      ))}

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar emprendimiento como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/segunda-carrera" className="btn-secondary">
        Tracks 14 días (segunda carrera)
      </Link>
      <Link href="/outplacement/cuadernillo/finanzas" className="btn-secondary">
        Revisar pista financiera
      </Link>

      <WorkbookModuleFooter />

      <CoachAsk
        coachModule="mapa de carrera"
        placeholder="Ej.: ¿puedo combinar freelance 2 días con búsqueda activa?"
      />
    </div>
  );
}
