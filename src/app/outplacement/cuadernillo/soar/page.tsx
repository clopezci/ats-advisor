"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  composeSoarOneLiner,
  emptySoarEntry,
  exportSoarForCv,
  readWorkbook,
  writeWorkbook,
  type SoarEntry,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Banco SOAR: Situación, Obstáculo, Acción y Resultado. Cada logro debe poder usarse en CV, perfil profesional y entrevistas. Apunta a 8–12 entradas; empieza con 3 sólidas.";

export default function SoarWizardPage() {
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

  function setEntry(i: number, patch: Partial<SoarEntry>) {
    const entries = wb!.soar.entries.map((e, idx) => {
      if (idx !== i) return e;
      const next = { ...e, ...patch };
      if (
        patch.situation !== undefined ||
        patch.obstacle !== undefined ||
        patch.action !== undefined ||
        patch.result !== undefined
      ) {
        if (!patch.oneLiner) next.oneLiner = composeSoarOneLiner(next);
      }
      return next;
    });
    save({ ...wb!, soar: { ...wb!.soar, entries, updatedAt: Date.now() } });
  }

  function addEntry() {
    save({
      ...wb!,
      soar: {
        ...wb!.soar,
        entries: [...wb!.soar.entries, emptySoarEntry()],
        updatedAt: Date.now(),
      },
    });
  }

  function markDone() {
    const filled = wb!.soar.entries.filter((e) => e.result.trim() || e.oneLiner.trim()).length;
    save({
      ...wb!,
      completed: { ...wb!.completed, marca: true },
      soar: { ...wb!.soar, updatedAt: Date.now() },
    });
    setMsg(
      filled >= 3
        ? "Banco SOAR guardado. Copia las frases a tu CV y perfil. Sigue con Red (CRM)."
        : "Guardado. Ideal: al menos 3 logros con resultado medible antes de marcar completo."
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · marca</p>
            <h1 className="text-2xl font-semibold">Logros SOAR</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          Tip: sin número, usa proxy (tiempo, %, personas, ciclos, errores, antes/después).
        </p>
      </section>

      {wb.soar.entries.map((e, i) => (
        <section key={i} className="bento-card space-y-3">
          <h2 className="font-semibold text-sm">Logro {i + 1}</h2>
          <VoiceTextarea
            label="S — Situación"
            value={e.situation}
            onChange={(v) => setEntry(i, { situation: v })}
            className="field min-h-16"
            placeholder="Contexto breve (equipo, proyecto, momento)"
            dictationLabel="Dictar situación"
          />
          <VoiceTextarea
            label="O — Obstáculo"
            value={e.obstacle}
            onChange={(v) => setEntry(i, { obstacle: v })}
            className="field min-h-16"
            placeholder="Qué complicaba el resultado"
            dictationLabel="Dictar obstáculo"
          />
          <VoiceTextarea
            label="A — Acción (tú)"
            value={e.action}
            onChange={(v) => setEntry(i, { action: v })}
            className="field min-h-16"
            placeholder="Verbos: lideré, diseñé, negocié…"
            dictationLabel="Dictar acción"
          />
          <VoiceTextarea
            label="R — Resultado"
            value={e.result}
            onChange={(v) => setEntry(i, { result: v })}
            className="field min-h-16"
            placeholder="Número, plazo o antes/después"
            dictationLabel="Dictar resultado"
          />
          <VoiceTextarea
            label="Frase lista (CV / entrevista)"
            value={e.oneLiner}
            onChange={(v) => setEntry(i, { oneLiner: v })}
            className="field min-h-20"
            placeholder="Logré … mediante … en … superando …"
            dictationLabel="Dictar frase"
          />
          <VoiceTextarea
            label="Skills técnicas (este logro)"
            value={e.techSkills || ""}
            onChange={(v) => setEntry(i, { techSkills: v })}
            className="field min-h-12"
            placeholder="SQL, Excel, SAP, Python…"
            dictationLabel="Dictar"
          />
          <VoiceTextarea
            label="Skills blandas / liderazgo"
            value={e.softSkills || ""}
            onChange={(v) => setEntry(i, { softSkills: v })}
            className="field min-h-12"
            placeholder="Influencia, priorización, coaching…"
            dictationLabel="Dictar"
          />
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => setEntry(i, { oneLiner: composeSoarOneLiner(e) })}
          >
            Regenerar frase desde SOAR
          </button>
        </section>
      ))}

      <button type="button" className="btn-secondary" onClick={addEntry}>
        Agregar otro logro
      </button>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Export a CV / perfil</h2>
        <pre className="text-sm whitespace-pre-wrap font-sans muted">
          {exportSoarForCv(wb.soar.entries) || "Completa al menos un logro con resultado o frase."}
        </pre>
        <button
          type="button"
          className="btn-secondary"
          onClick={async () => {
            const t = exportSoarForCv(wb.soar.entries);
            if (!t) return;
            await navigator.clipboard.writeText(t);
            setMsg("Export copiado al portapapeles.");
          }}
        >
          Copiar export
        </button>
      </section>

      <CoachAsk
        coachModule="marca personal y SOAR"
        placeholder="Ej.: ¿cómo cuantifico un logro sin tener el % exacto?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar marca/SOAR como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/marca" className="btn-secondary">
        Checklist identidad digital
      </Link>
      <Link href="/herramientas/linkedin" className="btn-secondary">
        Llevar frases a la herramienta de perfil
      </Link>
      <Link href="/outplacement/cuadernillo/red" className="btn-secondary">
        Siguiente: Red (CRM)
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
