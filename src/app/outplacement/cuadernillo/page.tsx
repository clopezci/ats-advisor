"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { pullAndMergeWorkbook, pushWorkbookToCloud } from "@/lib/workbook/cloudSync";
import { storedProfileEmail } from "@/lib/client/storedEmail";
import { WORKBOOK_PHASES } from "@/lib/workbook/phases";
import {
  WORKBOOK_MODULES,
  nextWorkbookModule,
  readWorkbook,
  workbookProgress,
  type WorkbookModuleId,
  type WorkbookState,
} from "@/lib/workbook/types";

function modDef(id: WorkbookModuleId) {
  return WORKBOOK_MODULES.find((m) => m.id === id);
}

export default function CuadernilloHubPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [openPhase, setOpenPhase] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await pullAndMergeWorkbook();
      if (cancelled) return;
      setWb(r.state);
      const next = nextWorkbookModule(r.state);
      if (next) {
        const phase = WORKBOOK_PHASES.find((p) => p.moduleIds.includes(next.id));
        setOpenPhase(phase?.id || WORKBOOK_PHASES[0].id);
      } else {
        setOpenPhase(WORKBOOK_PHASES[0].id);
      }
      if (r.applied === "cloud") setSyncMsg("Restaurado desde cloud.");
      else if (storedProfileEmail()) setSyncMsg("Sync listo.");
      else setSyncMsg("Correo en /cuenta para sync multi-dispositivo.");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function syncNow() {
    if (!wb) return;
    setSyncing(true);
    await pushWorkbookToCloud(wb);
    setSyncing(false);
    setSyncMsg("Sync intentado.");
    setWb(readWorkbook());
  }

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  const prog = workbookProgress(wb);
  const next = nextWorkbookModule(wb);
  const intro =
    "Un solo flujo en 6 fases. Cada día: abre Continuar, cierra un entregable, vuelve. Las herramientas satélite viven dentro de su fase.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Flujo Carrera</p>
            <h1 className="mt-1 text-2xl font-semibold">Mi cuadernillo</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${prog.pct}%` }} />
        </div>
        <p className="text-xs muted">
          {prog.done}/{prog.total} · {prog.pct}%
        </p>
        {next ? (
          <Link href={next.href} className="btn-primary">
            Continuar: {next.title}
          </Link>
        ) : (
          <Link href="/outplacement/cuadernillo/funnel" className="btn-primary">
            Completo — ir al funnel
          </Link>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-secondary" disabled={syncing} onClick={syncNow}>
            {syncing ? "…" : "Sync cloud"}
          </button>
          <Link href="/outplacement/tablero" className="btn-secondary">
            Tablero de cursos
          </Link>
        </div>
        {syncMsg ? <p className="text-xs muted">{syncMsg}</p> : null}
      </section>

      {WORKBOOK_PHASES.map((phase) => {
        const mods = phase.moduleIds.map(modDef).filter(Boolean);
        const doneCount = phase.moduleIds.filter((id) => wb.completed[id]).length;
        const open = openPhase === phase.id;
        return (
          <section key={phase.id} className="bento-card space-y-3">
            <button
              type="button"
              className="w-full text-left space-y-1"
              onClick={() => setOpenPhase(open ? null : phase.id)}
            >
              <div className="flex justify-between gap-2">
                <h2 className="font-semibold text-sm">
                  {phase.step}. {phase.title}
                </h2>
                <span className="text-xs muted">
                  {doneCount}/{phase.moduleIds.length} · {open ? "−" : "+"}
                </span>
              </div>
              <p className="text-xs muted">{phase.blurb}</p>
            </button>
            {open ? (
              <div className="space-y-2">
                {mods.map((m) =>
                  m ? (
                    <Link key={m.id} href={m.href} className="btn-secondary block text-left">
                      {wb.completed[m.id] ? "✓ " : ""}
                      {m.title}
                      <span className="block text-xs muted font-normal">{m.goal}</span>
                    </Link>
                  ) : null
                )}
                {phase.tools?.map((t) => (
                  <Link key={t.href} href={t.href} className="btn-secondary block text-left text-sm">
                    · {t.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}

      <Link href="/outplacement" className="text-center text-sm muted">
        Volver
      </Link>
    </div>
  );
}
