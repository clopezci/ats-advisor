"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  addAlert,
  readAlerts,
  removeAlert,
  touchAlert,
  type JobAlert,
} from "@/lib/engagement/weekPlan";

export default function AlertasPage() {
  const [list, setList] = useState<JobAlert[]>([]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Colombia / remoto");
  const [remoteOk, setRemoteOk] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setList(readAlerts());
  }, []);

  function save() {
    if (query.trim().length < 3) return;
    setList(
      addAlert({
        query: query.trim(),
        city: city.trim(),
        remoteOk,
        notes: notes.trim(),
      })
    );
    setQuery("");
    setNotes("");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 5 · búsqueda</p>
            <h1 className="mt-1 text-2xl font-semibold">Alertas de vacantes</h1>
          </div>
          <SpeakButton text="Guarda criterios de búsqueda y marca cuándo los revisaste. El feed curado está en Vacantes." />
        </div>
        <p className="text-sm muted">
          Sin scraping ilegal: tú defines qué buscas; te recordamos revisar el feed y portales.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <input
          className="field"
          placeholder="Rol / keywords (ej. analista de datos Bogotá)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          className="field"
          placeholder="Ciudad / país"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remoteOk} onChange={(e) => setRemoteOk(e.target.checked)} />
          Acepto remoto
        </label>
        <textarea
          className="field min-h-16"
          placeholder="Notas (portales, empresas target…)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="button" className="btn-primary" onClick={save}>
          Guardar alerta
        </button>
      </section>

      <div className="space-y-3">
        {list.map((a) => (
          <article key={a.id} className="bento-card space-y-2 text-sm">
            <h2 className="font-semibold">{a.query}</h2>
            <p className="muted">
              {a.city}
              {a.remoteOk ? " · remoto OK" : ""}
            </p>
            {a.notes && <p className="muted">{a.notes}</p>}
            <p className="text-xs muted">
              Creada {new Date(a.createdAt).toLocaleDateString("es-CO")}
              {a.lastCheckedAt
                ? ` · Revisada ${new Date(a.lastCheckedAt).toLocaleString("es-CO")}`
                : " · Sin revisar"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/outplacement/vacantes" className="btn-primary">
                Ver feed
              </Link>
              <button type="button" className="btn-secondary" onClick={() => setList(touchAlert(a.id))}>
                Marqué revisión
              </button>
              <button type="button" className="btn-secondary" onClick={() => setList(removeAlert(a.id))}>
                Quitar
              </button>
            </div>
          </article>
        ))}
        {!list.length && <p className="text-sm muted">Aún no hay alertas.</p>}
      </div>

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
