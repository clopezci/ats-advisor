"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  emptyNetworkContact,
  NETWORK_CATEGORIES,
  readWorkbook,
  writeWorkbook,
  type NetworkContact,
  type WorkbookState,
} from "@/lib/workbook/types";

const INTRO =
  "Tu CRM de red: no es pedir empleo a todos. Es pedir un favor concreto (feedback, intro, 15 min de mercado) y hacer follow-up. Esto suele convertir mejor que postular solo en portales.";

const STATUS: { id: NetworkContact["status"]; label: string }[] = [
  { id: "por_contactar", label: "Por contactar" },
  { id: "enviado", label: "Mensaje enviado" },
  { id: "respondio", label: "Respondió" },
  { id: "intro", label: "Pidió / dio intro" },
  { id: "cerrado", label: "Ciclo cerrado" },
];

export default function RedCrmPage() {
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

  function setContact(i: number, patch: Partial<NetworkContact>) {
    const contacts = wb!.network.contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    save({ ...wb!, network: { ...wb!.network, contacts, updatedAt: Date.now() } });
  }

  function addContact() {
    save({
      ...wb!,
      network: {
        ...wb!.network,
        contacts: [...wb!.network.contacts, emptyNetworkContact()],
        updatedAt: Date.now(),
      },
    });
  }

  function markDone() {
    save({
      ...wb!,
      completed: { ...wb!.completed, red: true },
      network: { ...wb!.network, updatedAt: Date.now() },
    });
    setMsg("CRM guardado. Meta semanal: 5 mensajes + 1 follow-up. Combínalo con páginas de carrera.");
  }

  const active = wb.network.contacts.filter((c) => c.name.trim()).length;
  const sent = wb.network.contacts.filter((c) =>
    ["enviado", "respondio", "intro", "cerrado"].includes(c.status)
  ).length;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · red</p>
            <h1 className="text-2xl font-semibold">CRM de contactos</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          {active} con nombre · {sent} con outreach iniciado
        </p>
        <VoiceInput
          label="Meta semanal de outreach"
          value={wb.network.weeklyOutreachGoal}
          onChange={(v) =>
            save({
              ...wb,
              network: { ...wb.network, weeklyOutreachGoal: v, updatedAt: Date.now() },
            })
          }
          className="field"
          dictationLabel="Dictar meta"
        />
      </section>

      {wb.network.contacts.map((c, i) => (
        <section key={i} className="bento-card space-y-3">
          <h2 className="font-semibold text-sm">Contacto {i + 1}</h2>
          <VoiceInput
            label="Nombre"
            value={c.name}
            onChange={(v) => setContact(i, { name: v })}
            className="field"
            dictationLabel="Dictar nombre"
          />
          <label className="block text-sm font-medium">
            Categoría
            <select
              className="field mt-1 w-full"
              value={c.category}
              onChange={(e) =>
                setContact(i, { category: e.target.value as NetworkContact["category"] })
              }
            >
              {NETWORK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <VoiceInput
            label="Canal (WhatsApp, mail, perfil profesional…)"
            value={c.channel}
            onChange={(v) => setContact(i, { channel: v })}
            className="field"
            dictationLabel="Dictar canal"
          />
          <VoiceTextarea
            label="Favor concreto (menos de 20 min)"
            value={c.favorAsked}
            onChange={(v) => setContact(i, { favorAsked: v })}
            className="field min-h-16"
            placeholder="Ej.: feedback a mi pitch / intro a 1 persona del área / 15 min de mercado"
            dictationLabel="Dictar favor"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <VoiceInput
              label="Último contacto"
              value={c.lastTouch}
              onChange={(v) => setContact(i, { lastTouch: v })}
              className="field"
              placeholder="AAAA-MM-DD"
              dictationLabel="Dictar fecha"
            />
            <VoiceInput
              label="Próximo follow-up"
              value={c.nextFollowUp}
              onChange={(v) => setContact(i, { nextFollowUp: v })}
              className="field"
              placeholder="AAAA-MM-DD (día 5–7)"
              dictationLabel="Dictar follow-up"
            />
          </div>
          <label className="block text-sm font-medium">
            Estado
            <select
              className="field mt-1 w-full"
              value={c.status}
              onChange={(e) =>
                setContact(i, { status: e.target.value as NetworkContact["status"] })
              }
            >
              {STATUS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <VoiceTextarea
            label="Notas"
            value={c.notes}
            onChange={(v) => setContact(i, { notes: v })}
            className="field min-h-16"
            dictationLabel="Dictar notas"
          />
        </section>
      ))}

      <button type="button" className="btn-secondary" onClick={addContact}>
        Agregar contacto
      </button>

      <CoachAsk
        coachModule="networking"
        placeholder="Ej.: ¿cómo escribo el follow-up sin sonar insistente?"
      />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar red como completa
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/guiones" className="btn-secondary">
        Usar guiones por audiencia
      </Link>
      <Link href="/outplacement/cuadernillo/mercado" className="btn-secondary">
        Volver a Mercado · 3 canales
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
