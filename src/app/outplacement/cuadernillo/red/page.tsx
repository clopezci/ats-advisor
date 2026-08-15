"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import {
  CONTACT_CATEGORY_LABEL,
  CONTACT_STATUS_LABEL,
  deleteContact,
  listContacts,
  upsertContact,
  type ContactCategory,
  type ContactStatus,
  type NetworkContact,
} from "@/lib/networking/contacts";
import { readWorkbook, writeWorkbook } from "@/lib/workbook/types";

const INTRO =
  "CRM único de red: el mismo listado sirve al curso Networking y al cuadernillo. Pide un favor concreto y haz follow-up.";

const STATUSES = (Object.keys(CONTACT_STATUS_LABEL) as ContactStatus[]).filter(
  (s) => s !== "escrito"
);

export default function RedCrmPage() {
  const [items, setItems] = useState<NetworkContact[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    category: "excolega" as ContactCategory,
    channel: "",
    favorAsked: "",
    nextStep: "Enviar mensaje",
  });

  function refresh() {
    setItems(listContacts());
  }

  useEffect(() => {
    refresh();
  }, []);

  function markDone() {
    const wb = readWorkbook();
    writeWorkbook({ ...wb, completed: { ...wb.completed, red: true } });
    setMsg("Red marcada. Usa plantillas y registra estados aquí.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Fase 2 · CRM único</p>
            <h1 className="text-2xl font-semibold">Red de contactos</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">{items.length} contactos en este dispositivo</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Agregar contacto</h2>
        <VoiceInput
          label="Nombre"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          className="field"
          dictationLabel="Dictar"
        />
        <VoiceInput
          label="Empresa / org"
          value={form.company}
          onChange={(v) => setForm((f) => ({ ...f, company: v }))}
          className="field"
          dictationLabel="Dictar"
        />
        <VoiceInput
          label="Cargo"
          value={form.role}
          onChange={(v) => setForm((f) => ({ ...f, role: v }))}
          className="field"
          dictationLabel="Dictar"
        />
        <label className="block text-sm font-medium">
          Categoría
          <select
            className="field mt-1 w-full"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as ContactCategory }))
            }
          >
            {(Object.keys(CONTACT_CATEGORY_LABEL) as ContactCategory[]).map((c) => (
              <option key={c} value={c}>
                {CONTACT_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <VoiceInput
          label="Canal"
          value={form.channel}
          onChange={(v) => setForm((f) => ({ ...f, channel: v }))}
          className="field"
          placeholder="LinkedIn, mail, WhatsApp…"
          dictationLabel="Dictar"
        />
        <VoiceTextarea
          label="Favor concreto (menos de 20 min)"
          value={form.favorAsked}
          onChange={(v) => setForm((f) => ({ ...f, favorAsked: v }))}
          className="field min-h-16"
          dictationLabel="Dictar"
        />
        <button
          type="button"
          className="btn-primary"
          disabled={form.name.trim().length < 2}
          onClick={() => {
            upsertContact({
              name: form.name.trim(),
              company: form.company.trim() || "—",
              role: form.role.trim() || undefined,
              category: form.category,
              channel: form.channel.trim() || "linkedin",
              favorAsked: form.favorAsked.trim() || undefined,
              status: "por_contactar",
              nextStep: form.nextStep,
            });
            setForm({
              name: "",
              company: "",
              role: "",
              category: "excolega",
              channel: "",
              favorAsked: "",
              nextStep: "Enviar mensaje",
            });
            refresh();
          }}
        >
          Guardar en CRM
        </button>
      </section>

      {items.map((c) => (
        <section key={c.id} className="bento-card space-y-2">
          <h2 className="font-semibold text-sm">
            {c.name} · {c.company}
          </h2>
          <p className="text-xs muted">
            {CONTACT_CATEGORY_LABEL[c.category]} · {c.role || "—"} · {c.channel}
          </p>
          {c.favorAsked ? <p className="text-sm muted">Favor: {c.favorAsked}</p> : null}
          <label className="block text-sm font-medium">
            Estado
            <select
              className="field mt-1 w-full"
              value={c.status === "escrito" ? "enviado" : c.status}
              onChange={(e) => {
                upsertContact({ ...c, status: e.target.value as ContactStatus, id: c.id });
                refresh();
              }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {CONTACT_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              deleteContact(c.id);
              refresh();
            }}
          >
            Eliminar
          </button>
        </section>
      ))}

      <CoachAsk coachModule="networking" placeholder="Ej.: ¿cómo hago follow-up sin insistir?" />

      <button type="button" className="btn-primary" onClick={markDone}>
        Marcar red como completa
      </button>
      {msg ? <p className="text-sm muted">{msg}</p> : null}

      <Link href="/outplacement/cuadernillo/plantillas" className="btn-secondary">
        Plantillas por audiencia
      </Link>
      <Link href="/outplacement/cuadernillo/conectores" className="btn-secondary">
        Cercanos / aliados / conectores
      </Link>
      <Link href="/outplacement/networking" className="btn-secondary">
        Misma CRM en el curso Networking
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
