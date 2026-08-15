"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import {
  emptyFunnelWeek,
  readWorkbook,
  writeWorkbook,
  type FunnelWeek,
  type WorkbookState,
} from "@/lib/workbook/types";
import { listJobs } from "@/lib/tracker/jobs";

const INTRO =
  "Funnel semanal: mide outreach, páginas de empresa, postulaciones, filtros, entrevistas y ofertas. Sin números no sabes si el mix de canales funciona.";

export default function FunnelPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [msg, setMsg] = useState("");

  const [trackerHint, setTrackerHint] = useState({
    total: 0,
    aplicado: 0,
    entrevista: 0,
    oferta: 0,
  });

  useEffect(() => {
    setWb(readWorkbook());
    const jobs = listJobs();
    setTrackerHint({
      total: jobs.length,
      aplicado: jobs.filter((j) => j.status === "aplicado").length,
      entrevista: jobs.filter((j) => j.status === "entrevista").length,
      oferta: jobs.filter((j) => j.status === "oferta").length,
    });
  }, []);

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  function save(next: WorkbookState) {
    setWb(next);
    writeWorkbook(next);
  }

  function setWeek(i: number, patch: Partial<FunnelWeek>) {
    const weeks = wb!.funnel.weeks.map((w, idx) => (idx === i ? { ...w, ...patch } : w));
    save({ ...wb!, funnel: { weeks, updatedAt: Date.now() } });
  }

  function addWeek() {
    save({
      ...wb!,
      funnel: {
        weeks: [...wb!.funnel.weeks, { ...emptyFunnelWeek(), weekLabel: "Nueva semana" }],
        updatedAt: Date.now(),
      },
    });
  }

  function markCompensacionHint() {
    setMsg("Funnel guardado en este dispositivo. Exporta el cuadernillo cuando quieras un PDF.");
  }

  const latest = wb.funnel.weeks[0];
  const conv =
    latest && latest.applications > 0
      ? Math.round((latest.interviews / latest.applications) * 100)
      : null;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Outcomes · F4</p>
            <h1 className="text-2xl font-semibold">Funnel de búsqueda</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          Tracker: {trackerHint.total} vacantes · aplicadas {trackerHint.aplicado} · entrevistas{" "}
          {trackerHint.entrevista} · ofertas {trackerHint.oferta}
        </p>
        {conv != null ? (
          <p className="text-sm">
            Conversión esta semana (entrevistas / postulaciones): <strong>{conv}%</strong>
          </p>
        ) : null}
      </section>

      {wb.funnel.weeks.map((w, i) => (
        <section key={i} className="bento-card space-y-3">
          <VoiceInput
            label="Semana"
            value={w.weekLabel}
            onChange={(v) => setWeek(i, { weekLabel: v })}
            className="field"
            dictationLabel="Dictar"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["outreach", "Mensajes de red"],
                ["companyPages", "Páginas de carrera revisadas"],
                ["applications", "Postulaciones calidad"],
                ["screens", "Filtros / screens"],
                ["interviews", "Entrevistas"],
                ["offers", "Ofertas"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm font-medium">
                {label}
                <input
                  className="field mt-1 w-full"
                  type="number"
                  min={0}
                  value={w[key]}
                  onChange={(e) => setWeek(i, { [key]: Number(e.target.value) || 0 })}
                />
              </label>
            ))}
          </div>
          <VoiceTextarea
            label="Notas / ajuste de mix"
            value={w.notes}
            onChange={(v) => setWeek(i, { notes: v })}
            className="field min-h-16"
            placeholder="Ej.: subí red al 50% porque portales no responden"
            dictationLabel="Dictar"
          />
        </section>
      ))}

      <button type="button" className="btn-secondary" onClick={addWeek}>
        Agregar semana
      </button>
      <button type="button" className="btn-primary" onClick={markCompensacionHint}>
        Guardar (auto al editar)
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/tracker" className="btn-secondary">
        Abrir tracker de vacantes
      </Link>
      <Link href="/outplacement/cuadernillo/export" className="btn-secondary">
        Exportar / imprimir PDF
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
