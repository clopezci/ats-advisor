"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput } from "@/components/VoiceField";
import {
  CONTACT_STATUS_LABEL,
  deleteContact,
  listContacts,
  messageTemplate,
  upsertContact,
  type ContactStatus,
  type NetworkContact,
} from "@/lib/networking/contacts";

export default function NetworkingPage() {
  const [items, setItems] = useState<NetworkContact[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [nextStep, setNextStep] = useState("Enviar mensaje LinkedIn");
  const [draft, setDraft] = useState("");

  function refresh() {
    setItems(listContacts());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Networking CRM</h1>
          <SpeakButton text="OUT-06: registra contactos, próximos pasos y plantillas de mensaje." />
        </div>
        <p className="text-sm muted">Hoja de networking en este dispositivo. Sin scrapear LinkedIn.</p>
      </section>

      <section className="bento-card space-y-3">
        <p className="text-sm font-medium">Nuevo contacto</p>
        <VoiceInput
          value={name}
          onChange={setName}
          placeholder="Ejemplo: Juan Pérez (la persona, no tú)"
          dictationLabel="Dictar nombre"
        />
        <VoiceInput
          value={company}
          onChange={setCompany}
          placeholder="Ejemplo: Bancolombia"
          dictationLabel="Dictar empresa"
        />
        <VoiceInput
          value={role}
          onChange={setRole}
          placeholder="Ejemplo: jefa de analítica"
          dictationLabel="Dictar rol"
        />
        <VoiceInput
          value={nextStep}
          onChange={setNextStep}
          placeholder="Ejemplo: escribirle por LinkedIn el jueves"
          dictationLabel="Dictar siguiente paso"
        />
        <button
          type="button"
          className="btn-primary"
          disabled={name.trim().length < 2 || company.trim().length < 2}
          onClick={() => {
            upsertContact({
              name: name.trim(),
              company: company.trim(),
              role: role.trim() || undefined,
              channel: "linkedin",
              status: "por_contactar",
              nextStep: nextStep.trim() || "Contactar",
            });
            setName("");
            setCompany("");
            setRole("");
            refresh();
          }}
        >
          Guardar contacto
        </button>
      </section>

      <section className="bento-card space-y-2">
        <p className="text-sm font-medium">Plantilla rápida</p>
        <div className="flex flex-col gap-2">
          {(["reclutador", "referido", "followup"] as const).map((k) => (
            <button
              key={k}
              type="button"
              className="btn-secondary"
              onClick={() => setDraft(messageTemplate(k, { name, role, company }))}
            >
              {k}
            </button>
          ))}
        </div>
        {draft && (
          <>
            <pre className="text-sm muted whitespace-pre-wrap">{draft}</pre>
            <button
              type="button"
              className="btn-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(draft);
                alert("Copiado");
              }}
            >
              Copiar
            </button>
          </>
        )}
      </section>

      {items.map((c) => (
        <article key={c.id} className="bento-card space-y-2">
          <h2 className="font-semibold">
            {c.name} · {c.company}
          </h2>
          <p className="text-xs muted">{c.role || "—"} · {CONTACT_STATUS_LABEL[c.status]}</p>
          <p className="text-sm muted">Próximo: {c.nextStep}</p>
          <select
            className="field"
            value={c.status}
            onChange={(e) => {
              upsertContact({ ...c, status: e.target.value as ContactStatus, id: c.id });
              refresh();
            }}
          >
            {(Object.keys(CONTACT_STATUS_LABEL) as ContactStatus[]).map((s) => (
              <option key={s} value={s}>
                {CONTACT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
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
        </article>
      ))}

      <Link href="/outplacement/ruta" className="btn-secondary">
        Volver a la ruta
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Outplacement
      </Link>
    </div>
  );
}
