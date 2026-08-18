"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  emptyDirectoryEntry,
  readWorkbook,
  writeWorkbook,
  type DirectoryEntry,
  type WorkbookState,
} from "@/lib/workbook/types";
import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";
import {
  HUNTER_LEGAL_NOTICE,
  SUGGESTED_HUNTERS,
} from "@/lib/networking/suggestedHunters";

const INTRO =
  "Arma tu directorio: hunters, HRBP y portales. Es tuyo, por industria y ciudad — no una lista mágica de terceros.";

export default function DirectorioPage() {
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

  function setEntry(i: number, patch: Partial<DirectoryEntry>) {
    const entries = wb!.directory.entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e));
    save({ ...wb!, directory: { ...wb!.directory, entries, updatedAt: Date.now() } });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, directorio: true },
      directory: { ...wb!.directory, updatedAt: Date.now() },
    });
    setMsg("Directorio guardado. Combínalo con CRM de red y páginas de carrera.");
  }

  const d = wb.directory;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · mercado</p>
            <h1 className="text-2xl font-semibold">Directorio de reclutadores</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <VoiceInput
          label="Industria target"
          value={d.industry}
          onChange={(v) =>
            save({ ...wb, directory: { ...d, industry: v, updatedAt: Date.now() } })
          }
          className="field"
          dictationLabel="Dictar industria"
        />
        <VoiceInput
          label="Ciudad / modalidad"
          value={d.city}
          onChange={(v) => save({ ...wb, directory: { ...d, city: v, updatedAt: Date.now() } })}
          className="field"
          placeholder="Bogotá híbrido / remoto LATAM…"
          dictationLabel="Dictar ciudad"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Lista sugerida (orientativa)</h2>
        <p className="text-xs muted leading-relaxed">{HUNTER_LEGAL_NOTICE}</p>
        <ul className="space-y-3">
          {SUGGESTED_HUNTERS.map((h) => (
            <li key={h.name} className="text-sm leading-relaxed">
              <span className="font-medium">{h.name}</span>
              <span className="muted">
                {" "}
                · {h.focus} · {h.region}
              </span>
              <br />
              <span className="text-xs muted">{h.note}</span>
              <button
                type="button"
                className="btn-secondary mt-2 text-xs"
                onClick={() =>
                  save({
                    ...wb,
                    directory: {
                      ...d,
                      entries: [
                        ...d.entries,
                        {
                          ...emptyDirectoryEntry(),
                          name: "",
                          org: h.name,
                          roles: h.focus,
                          notes: `Sugerido ATSAdvisor — verificar. ${h.note}`,
                        },
                      ],
                      updatedAt: Date.now(),
                    },
                  })
                }
              >
                Agregar a mi directorio (borrador)
              </button>
            </li>
          ))}
        </ul>
      </section>

      {d.entries.map((e, i) => (
        <section key={i} className="bento-card space-y-3">
          <h2 className="font-semibold text-sm">Contacto {i + 1}</h2>
          <VoiceInput
            label="Nombre"
            value={e.name}
            onChange={(v) => setEntry(i, { name: v })}
            className="field"
            dictationLabel="Dictar"
          />
          <VoiceInput
            label="Empresa / consultora"
            value={e.org}
            onChange={(v) => setEntry(i, { org: v })}
            className="field"
            dictationLabel="Dictar"
          />
          <VoiceInput
            label="Roles que suele cubrir"
            value={e.roles}
            onChange={(v) => setEntry(i, { roles: v })}
            className="field"
            dictationLabel="Dictar"
          />
          <VoiceInput
            label="Canal"
            value={e.channel}
            onChange={(v) => setEntry(i, { channel: v })}
            className="field"
            dictationLabel="Dictar"
          />
          <VoiceInput
            label="Último contacto"
            value={e.lastTouch}
            onChange={(v) => setEntry(i, { lastTouch: v })}
            className="field"
            placeholder="AAAA-MM-DD"
            dictationLabel="Dictar"
          />
          <VoiceTextarea
            label="Notas"
            value={e.notes}
            onChange={(v) => setEntry(i, { notes: v })}
            className="field min-h-16"
            dictationLabel="Dictar"
          />
        </section>
      ))}

      <button
        type="button"
        className="btn-secondary"
        onClick={() =>
          save({
            ...wb,
            directory: {
              ...d,
              entries: [...d.entries, emptyDirectoryEntry()],
              updatedAt: Date.now(),
            },
          })
        }
      >
        Agregar contacto
      </button>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Portales y páginas de carrera</h2>
        <VoiceTextarea
          label="Notas (URLs o nombres)"
          value={d.portalNotes}
          onChange={(v) =>
            save({ ...wb, directory: { ...d, portalNotes: v, updatedAt: Date.now() } })
          }
          className="field min-h-20"
          dictationLabel="Dictar"
        />
      </section>

      <CoachAsk
        coachModule="mercado y canales de búsqueda"
        placeholder="Ej.: ¿cómo escribo a un hunter sin pedir 'cualquier vacante'?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar directorio como completo
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/mercado" className="btn-secondary">
        Mercado · 3 canales
      </Link>

      <WorkbookModuleFooter />
    </div>
  );
}
