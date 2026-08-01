"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { collectHabeasPayload, wipeHabeasLocal } from "@/lib/habeas/export";
import {
  planLabel,
  readEntitlement,
  setPlan,
  type PlanId,
} from "@/lib/entitlements";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function CuentaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<"pwa" | "telegram" | "whatsapp">("pwa");
  const [msg, setMsg] = useState("");
  const [plan, setPlanState] = useState<PlanId>("free");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p) {
        setName(p.name || "");
        setEmail(p.email || "");
        setChannel(p.channel || "pwa");
      }
      setPlanState(readEntitlement().plan);
    } catch {
      /* ignore */
    }
    const sb = createBrowserSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      const e = data.session?.user?.email;
      if (e) {
        setSessionEmail(e);
        setEmail((prev) => prev || e);
      }
    });
  }, []);

  function exportHabeas() {
    const payload = collectHabeasPayload({
      profile: { name, email, channel },
      plan: readEntitlement(),
    });
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
    setMsg("Descargamos tu paquete completo de datos (Habeas Data).");
  }

  function deleteLocal() {
    wipeHabeasLocal();
    setName("");
    setEmail("");
    setPlanState("free");
    setMsg("Datos locales eliminados (perfil, tracker, CVs, racha, plan, historial).");
  }

  function save() {
    localStorage.setItem("ats_profile", JSON.stringify({ name, email, channel }));
    setMsg("Preferencias guardadas en este dispositivo.");
    if (email.includes("@")) {
      fetch(`/api/testers/check?email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.tester) {
            setPlan("tester", "admin");
            setPlanState("tester");
            setMsg("Preferencias guardadas. Correo en whitelist → plan Tester activado.");
          }
        })
        .catch(() => undefined);
    }
  }

  async function signOut() {
    const sb = createBrowserSupabase();
    if (sb) await sb.auth.signOut();
    setSessionEmail(null);
    setMsg("Sesión cerrada.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Mi cuenta</h1>
          <SpeakButton text="Administra tu perfil, plan, canal de aprendizaje, Habeas Data y baja." />
        </div>
        <p className="text-sm muted">
          Plan: <span className="font-medium" style={{ color: "var(--brand)" }}>{planLabel(plan)}</span>
          {sessionEmail ? ` · sesión ${sessionEmail}` : " · sin sesión Supabase"}
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
            ["whatsapp", "WhatsApp (addon Plus)"],
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
        {sessionEmail && (
          <button type="button" className="btn-secondary" onClick={signOut}>
            Cerrar sesión
          </button>
        )}
        <Link href="/auth" className="btn-secondary">
          Entrar con magic link
        </Link>
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Plan (local / demo)</h2>
        <p className="text-sm muted">
          Sin Wompi puedes activar Carrera o Tester en este dispositivo para probar gates.
        </p>
        <div className="flex flex-col gap-2">
          {(["free", "carrera", "plus", "tester"] as PlanId[]).map((p) => (
            <button
              key={p}
              type="button"
              className="btn-secondary"
              onClick={() => {
                setPlan(p, "local");
                setPlanState(p);
                setMsg(`Plan local: ${planLabel(p)}`);
              }}
            >
              {planLabel(p)}
            </button>
          ))}
        </div>
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Habeas Data y baja</h2>
        <Link href="/cuenta/cvs" className="btn-secondary">
          Versiones de CV
        </Link>
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
