"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

export default function CuentaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<"pwa" | "telegram" | "whatsapp">("pwa");
  const [msg, setMsg] = useState("");

  function exportHabeas() {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: { name, email, channel },
      ats_history: safeParse("ats_history"),
      out09_last: safeParse("out09_last"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atsadvisor-habeas-data.json";
    a.click();
    URL.revokeObjectURL(url);
    if (email.includes("@")) {
      fetch("/api/account/habeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, payload }),
      }).catch(() => undefined);
    }
    setMsg("Descargamos tu paquete de datos (Habeas Data). Si hay Resend, también se intenta email.");
  }

  function deleteLocal() {
    localStorage.removeItem("ats_history");
    localStorage.removeItem("out09_last");
    localStorage.removeItem("ats_profile");
    setName("");
    setEmail("");
    setMsg("Datos locales eliminados. Con Supabase también se borrará la cuenta en servidor.");
  }

  function save() {
    localStorage.setItem("ats_profile", JSON.stringify({ name, email, channel }));
    setMsg("Preferencias guardadas en este dispositivo.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Mi cuenta</h1>
          <SpeakButton text="Administra tu perfil, canal de aprendizaje, Habeas Data y baja." />
        </div>
        <p className="text-sm muted">
          Auth completa con Supabase se activa cuando configures las keys (ver MANUAL-ACCIONES.md).
        </p>
      </section>

      <div className="bento-card space-y-3">
        <label className="block text-sm">
          Nombre
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm">
          Correo
          <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <p className="text-sm font-medium">Canal de microlearning</p>
        <div className="flex flex-col gap-2">
          {([
            ["pwa", "Solo en la app"],
            ["telegram", "Telegram"],
            ["whatsapp", "WhatsApp (addon)"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="btn-secondary"
              style={channel === id ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" } : undefined}
              onClick={() => setChannel(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={save}>
          Guardar
        </button>
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Habeas Data y baja</h2>
        <button type="button" className="btn-primary" onClick={exportHabeas}>
          Descargar mis datos
        </button>
        <button type="button" className="btn-secondary" onClick={deleteLocal}>
          Eliminar datos / dar de baja (local)
        </button>
      </div>

      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}

function safeParse(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}
