"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { pullAndMergeWorkbook, pushWorkbookToCloud } from "@/lib/workbook/cloudSync";
import { storedProfileEmail } from "@/lib/client/storedEmail";
import {
  WORKBOOK_MODULES,
  nextWorkbookModule,
  readWorkbook,
  workbookProgress,
  type WorkbookState,
} from "@/lib/workbook/types";

export default function CuadernilloHubPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await pullAndMergeWorkbook();
      if (cancelled) return;
      setWb(r.state);
      if (r.applied === "cloud") setSyncMsg("Cuadernillo restaurado desde cloud.");
      else if (r.applied === "local_pushed") setSyncMsg("Cambios locales subidos a cloud.");
      else if (storedProfileEmail()) setSyncMsg("Sync listo (local = cloud o sin cambios).");
      else setSyncMsg("Guarda tu correo en /cuenta para sync multi-dispositivo.");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function syncNow() {
    if (!wb) return;
    setSyncing(true);
    const r = await pushWorkbookToCloud(wb);
    setSyncing(false);
    if (r.ok && !("skipped" in r && r.skipped === "cloud_newer")) {
      setSyncMsg("Subido a cloud.");
    } else if (r && "skipped" in r && r.skipped === "cloud_newer") {
      setSyncMsg("Cloud tiene una versión más nueva. Recarga para bajarla.");
    } else if (r && "error" in r) {
      setSyncMsg(String((r as { error?: string }).error || "No se pudo sync."));
    } else {
      setSyncMsg("Sync no disponible (correo/plan/perfil).");
    }
    setWb(readWorkbook());
  }

  if (!wb) {
    return <p className="text-sm muted">Cargando cuadernillo…</p>;
  }

  const prog = workbookProgress(wb);
  const next = nextWorkbookModule(wb);
  const intro =
    "Tu cuadernillo digital. Completa cada bloque con entregables reales. Con correo de Carrera se sincroniza en cloud.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Carrera · ATSAdvisor</p>
            <h1 className="mt-1 text-2xl font-semibold">Mi cuadernillo</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${prog.pct}%` }} />
        </div>
        <p className="text-xs muted">
          {prog.done}/{prog.total} bloques · {prog.pct}%
        </p>
        {next ? (
          <Link href={next.href} className="btn-primary">
            Continuar: {next.title}
          </Link>
        ) : (
          <p className="text-sm">Cuadernillo completo. Revisa o profundiza cualquier bloque.</p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/outplacement/cuadernillo/funnel" className="btn-secondary">
            Funnel semanal
          </Link>
          <Link href="/outplacement/cuadernillo/export" className="btn-secondary">
            Exportar / PDF
          </Link>
          <button type="button" className="btn-secondary" disabled={syncing} onClick={syncNow}>
            {syncing ? "Sincronizando…" : "Sync cloud ahora"}
          </button>
        </div>
        {syncMsg ? <p className="text-xs muted">{syncMsg}</p> : null}
      </section>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Los tres canales (no solo portales)</h2>
        <p className="text-sm muted leading-relaxed">
          Portales concentran volumen y poca respuesta. Las mejores conversaciones suelen venir de tu
          red; muchas vacantes se ven primero (o solo) en la página de carrera de la empresa.
        </p>
        <Link href="/outplacement/cuadernillo/mercado" className="btn-secondary">
          Abrir: Mercado · 3 canales
        </Link>
      </section>

      <div className="flex flex-col gap-3">
        {WORKBOOK_MODULES.map((m) => {
          const done = Boolean(wb.completed[m.id]);
          return (
            <Link key={m.id} href={m.href} className="bento-card block space-y-1">
              <div className="flex justify-between gap-2">
                <h2 className="font-semibold text-sm">{m.title}</h2>
                <span className="text-xs muted">{done ? "Hecho" : `~${m.minutes} min`}</span>
              </div>
              <p className="text-xs muted">{m.goal}</p>
            </Link>
          );
        })}
      </div>

      <Link href="/outplacement/alumni" className="btn-secondary">
        Comunidad alumni / AMA
      </Link>
      <Link href="/outplacement/tablero" className="btn-secondary">
        Ver tablero de cursos
      </Link>
      <Link href="/outplacement" className="text-center text-sm muted">
        Volver
      </Link>
    </div>
  );
}
