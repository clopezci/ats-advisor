"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { wipeHabeasLocal } from "@/lib/habeas/export";
import { downloadHabeasZip } from "@/lib/habeas/zip";
import {
  planLabel,
  readEntitlement,
  setPlan,
  type PlanId,
} from "@/lib/entitlements";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { ChannelChooser } from "@/components/ChannelChooser";
import { whatsappFinalPriceCop, type LearningChannel } from "@/lib/channels/pricing";

export default function CuentaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<LearningChannel>("pwa");
  const [msg, setMsg] = useState("");
  const [plan, setPlanState] = useState<PlanId>("free");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [allowLocalPlans, setAllowLocalPlans] = useState(false);
  const waPrice = whatsappFinalPriceCop();

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p) {
        setName(p.name || "");
        setEmail(p.email || "");
        setChannel(p.channel || "pwa");
      }
      setPlanState(readEntitlement().plan);
      const host = window.location.hostname;
      setAllowLocalPlans(
        host === "localhost" ||
          host === "127.0.0.1" ||
          localStorage.getItem("ats_admin_unlock") === "1"
      );
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

  async function exportHabeas() {
    const payload = await downloadHabeasZip({
      profile: { name, email, channel },
      plan: readEntitlement(),
    });
    if (email.includes("@")) {
      fetch("/api/account/habeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, payload }),
      }).catch(() => undefined);
    }
    setMsg("Descargamos ZIP Habeas Data (JSON + raw). Si hay Resend, también se intenta email.");
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
        <ChannelChooser value={channel} onChange={setChannel} whatsappPriceCop={waPrice} />
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
        <h2 className="font-semibold">Plan actual</h2>
        <p className="text-sm muted">
          {planLabel(plan)}. En producción el plan se confirma vía pago/webhook. El cambio local solo
          está disponible en localhost (o con unlock admin).
        </p>
        {allowLocalPlans && (
          <div className="flex flex-col gap-2">
            <p className="text-xs muted">Modo local / QA — no usar en producción pública.</p>
            {(["free", "carrera", "plus", "tester", "paused_90"] as PlanId[]).map((p) => (
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
        )}
        {!allowLocalPlans && (
          <Link href="/precios" className="btn-primary">
            Ver precios / activar plan
          </Link>
        )}
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Habeas Data y baja</h2>
        <Link href="/cuenta/cvs" className="btn-secondary">
          Versiones de CV
        </Link>
        <button type="button" className="btn-primary" onClick={exportHabeas}>
          Descargar mis datos (ZIP)
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
