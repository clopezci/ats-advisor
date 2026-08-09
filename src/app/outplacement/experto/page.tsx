"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { EXPERT_SPECIALTIES, specialtyLabel } from "@/lib/experts/specialties";

type AllyPublic = {
  id: string;
  name: string;
  specialties: string[];
  specialtyLabels: string[];
  notes: string;
};

export default function ExpertoPage() {
  const [allies, setAllies] = useState<AllyPublic[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [allyId, setAllyId] = useState("");
  const [specialty, setSpecialty] = useState("cv");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setName(p.name);
      if (p?.email) setEmail(p.email);
    } catch {
      /* ignore */
    }
    fetch("/api/experts")
      .then((r) => r.json())
      .then((d) => {
        setEnabled(Boolean(d.enabled));
        setAllies(d.allies || []);
        if (d.allies?.[0]) setAllyId(d.allies[0].id);
      })
      .catch(() => setEnabled(false));
  }, []);

  const selected = allies.find((a) => a.id === allyId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/experts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allyId, name, email, phone, specialty, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "No se pudo enviar");
        return;
      }
      setMsg(data.message || "Enviado");
      setOpen(false);
      setMessage("");
    } catch {
      setMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 2 · aliados</p>
            <h1 className="mt-1 text-2xl font-semibold">Hablar con un experto</h1>
          </div>
          <SpeakButton text="Elige un aliado, completa el formulario corto y le llega la notificación por correo y Telegram si está configurado." />
        </div>
        <p className="text-sm muted">
          Convenios LOTIC: un humano revisa CV, entrevista u orientación. La app no cobra la sesión
          aquí — el aliado te contacta.
        </p>
      </section>

      {!enabled && (
        <p className="text-sm muted">Las solicitudes a expertos están desactivadas en admin.</p>
      )}

      {enabled && allies.length === 0 && (
        <section className="bento-card space-y-2 text-sm muted">
          <p>Aún no hay aliados activos. El owner debe cargarlos en /admin → Aliados expertos.</p>
        </section>
      )}

      {enabled &&
        allies.map((a) => (
          <section key={a.id} className="bento-card space-y-2">
            <h2 className="font-semibold">{a.name}</h2>
            <p className="text-xs muted">{a.specialtyLabels.join(" · ")}</p>
            {a.notes ? <p className="text-sm muted">{a.notes}</p> : null}
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setAllyId(a.id);
                setSpecialty(a.specialties[0] || "carrera");
                setOpen(true);
              }}
            >
              Solicitar a {a.name}
            </button>
          </section>
        ))}

      {open && selected && (
        <form className="bento-card space-y-3" onSubmit={submit}>
          <h2 className="font-semibold">Solicitud · {selected.name}</h2>
          <label className="block text-sm">
            Tu nombre
            <input className="field mt-1" required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-sm">
            Correo
            <input
              className="field mt-1"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Teléfono / WhatsApp (opcional)
            <input className="field mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="block text-sm">
            ¿Qué necesitas?
            <select
              className="field mt-1"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {EXPERT_SPECIALTIES.filter(
                (s) => !selected.specialties.length || selected.specialties.includes(s.id)
              ).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
              {/* si el filtro vacía, mostrar todas */}
              {selected.specialties.length > 0 &&
                !EXPERT_SPECIALTIES.some((s) => selected.specialties.includes(s.id)) &&
                selected.specialties.map((id) => (
                  <option key={id} value={id}>
                    {specialtyLabel(id)}
                  </option>
                ))}
            </select>
          </label>
          <label className="block text-sm">
            Cuéntale al experto (contexto breve)
            <textarea
              className="field mt-1 min-h-[100px]"
              required
              minLength={12}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej.: necesito revisión de CV para rol de analista de datos en Bogotá…"
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Enviando…" : "Enviar solicitud"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
