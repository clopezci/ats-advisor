"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { addSeatsFromEmails, listSeats, parseInviteCsv, readOrg } from "@/lib/b2b/org";

export default function InvitacionesPage() {
  const [raw, setRaw] = useState("Ana Pérez, ana@empresa.com\nCarlos Ruiz, carlos@empresa.com");
  const [msg, setMsg] = useState("");
  const [purchased, setPurchased] = useState(25);
  const [used, setUsed] = useState(0);

  useEffect(() => {
    const o = readOrg();
    if (o) setPurchased(o.seatsPurchased);
    setUsed(listSeats().length);
  }, []);

  function invite() {
    const rows = parseInviteCsv(raw);
    const result = addSeatsFromEmails(rows, purchased);
    setUsed(listSeats().length);
    setMsg(
      result.reason
        ? result.reason
        : `Invitados: ${result.added}. Omitidos: ${result.skipped}. (Demo local — con Resend se enviaría el magic link.)`
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold">Invitaciones</h1>
          <SpeakButton text="Pega una lista nombre coma correo, una persona por línea. Respeta el tope de cupos contratados." />
        </div>
        <p className="text-sm muted">
          Cupos: {used}/{purchased}. Formato: <code>Nombre, correo</code> o solo correo.
        </p>
      </section>

      <textarea className="field min-h-40 font-mono text-sm" value={raw} onChange={(e) => setRaw(e.target.value)} />
      <button type="button" className="btn-primary" onClick={invite}>
        Cargar invitaciones
      </button>
      {msg && <p className="text-sm">{msg}</p>}

      <Link href="/empresa/dashboard" className="btn-secondary">
        Ver dashboard
      </Link>
      <Link href="/empresa" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
