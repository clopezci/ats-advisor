"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { readWorkbook, writeWorkbook, type WorkbookState } from "@/lib/workbook/types";
import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";

const INTRO =
  "Filtro de 7 días: ¿emprendimiento como puente, destino o pausa? Evidencia primero; no abandones la búsqueda si tu pista es corta.";

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

      {(
        [
          ["customerProblem", "1. Problema de cliente (quién paga)", "Quién tiene el dolor y por qué pagaría"],
          ["offerOneLiner", "2. Oferta en una frase", "Qué entregas / en cuánto tiempo"],
          ["minPrice", "3. Precio mínimo viable", "Monto + unidad"],
          ["prospects", "4. Cinco prospectos con nombre", "No genéricos"],
          ["weekConversations", "5. Conversaciones esta semana", "Meta y resultado"],
          ["monthCosts", "6. Costos fijos del mes", "Qué implica sostener la vía"],
          ["goNoGo", "7. Criterio a 30 días (sigo / pauso)", "Señales medibles"],
          ["segments", "Canvas · segmentos", "Quiénes son tus 2–3 segmentos"],
          ["channels", "Canvas · canales", "Cómo llegas a ellos"],
          ["pipeline", "Canvas · pipeline clientes", "Leads → charlas → propuestas → cierres"],
        ] as const
      ).map(([key, label, ph]) => (
        <section key={key} className="bento-card space-y-2">
          <VoiceTextarea
            label={label}
            value={v[key]}
            onChange={(val) => patch({ [key]: val })}
            className="field min-h-20"
            placeholder={ph}
            dictationLabel="Dictar"
          />
        </section>
      ))}

      <CoachAsk
        coachModule="mapa de carrera"
        placeholder="Ej.: ¿puedo combinar freelance 2 días con búsqueda activa?"
      />

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
    </div>
  );
}
