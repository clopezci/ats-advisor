"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";
import {
  emptyMarketCompany,
  readWorkbook,
  writeWorkbook,
  type MarketChannelCompany,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Los portales de empleo concentran muchas postulaciones y poca respuesta. Una parte importante de las mejores oportunidades se mueve por networking, y otro bloque aparece primero —o solo— en la página de carrera de la empresa. Aquí aprendes a repartir tu tiempo entre los tres canales.";

const CHECKS = [
  { id: "net5", label: "5 mensajes de red personalizados" },
  { id: "co8", label: "Revisé portales de carrera de mi shortlist (empresas)" },
  { id: "port5", label: "Máx. 5 postulaciones de calidad en portales generales" },
  { id: "fu", label: "1 follow-up a mensajes sin respuesta" },
  { id: "track", label: "Actualicé el tracker con estados reales" },
];

export default function MercadoWizardPage() {
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

  function setCompany(i: number, patch: Partial<MarketChannelCompany>) {
    const companies = wb!.market.companies.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    save({ ...wb!, market: { ...wb!.market, companies, updatedAt: Date.now() } });
  }

  function addCompany() {
    save({
      ...wb!,
      market: {
        ...wb!.market,
        companies: [...wb!.market.companies, emptyMarketCompany()],
        updatedAt: Date.now(),
      },
    });
  }

  function toggleCheck(id: string) {
    const set = new Set(wb!.market.weeklyChecklistDone);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    save({
      ...wb!,
      market: { ...wb!.market, weeklyChecklistDone: [...set], updatedAt: Date.now() },
    });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, mercado: true },
      market: { ...wb!.market, updatedAt: Date.now() },
    });
    setMsg("Mercado guardado. Sigue con Guiones o tu red de contactos.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · paso guiado</p>
            <h1 className="text-2xl font-semibold">Mercado: tres canales</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-sm leading-relaxed">
          No uses el mito del “80% oculto” como cifra mágica. Lo útil es esto:{" "}
          <strong>portales = volumen</strong>, <strong>sitio de la empresa = menos ruido</strong>,{" "}
          <strong>red = mejor conversión a entrevista</strong>. Trabaja los tres.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Mix de tiempo sugerido (90–120 min)</h2>
        <ul className="text-sm muted space-y-1 leading-relaxed">
          <li>• 40% red — mensajes, intros, cafés cortos</li>
          <li>• 35% empresas objetivo — su página de carrera + mapa de personas</li>
          <li>• 25% portales generales — pocas postulaciones, CV ajustado</li>
        </ul>
        <VoiceInput
          label="Tu mix (ajústalo)"
          value={wb.market.timeMixNote}
          onChange={(v) =>
            save({ ...wb, market: { ...wb.market, timeMixNote: v, updatedAt: Date.now() } })
          }
          className="field"
          dictationLabel="Dictar mix"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Shortlist: páginas de carrera</h2>
        <p className="text-xs muted">
          Agrega empresas y la URL de “trabaja con nosotros”. Revísala 2 veces por semana. Si no hay
          vacante, anota a quién podrías escribir para una conversación de mercado (sin pedir empleo
          en el primer mensaje).
        </p>
        {wb.market.companies.map((c, i) => (
          <div key={i} className="space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <VoiceInput
              label={`Empresa ${i + 1}`}
              value={c.name}
              onChange={(v) => setCompany(i, { name: v })}
              className="field"
              dictationLabel="Dictar empresa"
            />
            <VoiceInput
              label="URL carreras"
              value={c.careersUrl}
              onChange={(v) => setCompany(i, { careersUrl: v })}
              className="field"
              dictationLabel="Dictar URL"
            />
            <VoiceInput
              label="Última revisión"
              value={c.lastCheck}
              onChange={(v) => setCompany(i, { lastCheck: v })}
              className="field"
              placeholder="AAAA-MM-DD"
              dictationLabel="Dictar fecha"
            />
            <VoiceTextarea
              label="EVP / por qué te atrae (resumen libre)"
              value={c.evp || ""}
              onChange={(v) => setCompany(i, { evp: v })}
              className="field min-h-16"
              dictationLabel="Dictar EVP"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["evpCulture", "Cultura"],
                  ["evpImpact", "Impacto"],
                  ["evpLearning", "Aprendizaje"],
                  ["evpComp", "Compensación"],
                  ["evpScope", "Scope / rol"],
                ] as const
              ).map(([key, label]) => (
                <VoiceInput
                  key={key}
                  label={label}
                  value={c[key] || ""}
                  onChange={(v) => setCompany(i, { [key]: v })}
                  className="field"
                  dictationLabel={label}
                />
              ))}
            </div>
            <VoiceTextarea
              label="Notas / personas / vacantes"
              value={c.notes}
              onChange={(v) => setCompany(i, { notes: v })}
              className="field min-h-16"
              dictationLabel="Dictar notas"
            />
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={addCompany}>
          Agregar empresa
        </button>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Top 5 por EVP / fit</h2>
        <p className="text-xs muted">
          Ordena mentalmente tus mejores empresas y resume por qué (no solo “pagan bien”).
        </p>
        <VoiceTextarea
          label="Resumen top 5"
          value={wb.market.evpTopSummary || ""}
          onChange={(v) =>
            save({ ...wb, market: { ...wb.market, evpTopSummary: v, updatedAt: Date.now() } })
          }
          className="field min-h-24"
          placeholder="1) Empresa — por …&#10;2) …"
          dictationLabel="Dictar top 5"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Checklist semanal</h2>
        {CHECKS.map((c) => (
          <label key={c.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={wb.market.weeklyChecklistDone.includes(c.id)}
              onChange={() => toggleCheck(c.id)}
            />
            <span>{c.label}</span>
          </label>
        ))}
      </section>

      <CoachAsk
        coachModule="mercado y canales de búsqueda"
        placeholder="Ej.: ¿cómo escribo a alguien de una empresa objetivo sin parecer desesperado?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar mercado como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}


      <WorkbookModuleFooter />
    </div>
  );
}
