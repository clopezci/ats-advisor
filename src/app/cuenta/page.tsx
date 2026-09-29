"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput } from "@/components/VoiceField";
import { wipeHabeasLocal } from "@/lib/habeas/export";
import { downloadHabeasZip } from "@/lib/habeas/zip";
import {
  planLabel,
  readEntitlement,
  setPlan,
  type PlanId,
} from "@/lib/entitlements";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { applySessionPrivileges } from "@/lib/client/sessionPrivileges";
import { ChannelChooser } from "@/components/ChannelChooser";
import { whatsappFinalPriceCop, type LearningChannel } from "@/lib/channels/pricing";
import {
  readFocusPath,
  writeFocusPath,
  type FocusPath,
} from "@/lib/engagement/focusPath";

export default function CuentaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<LearningChannel>("pwa");
  const [msg, setMsg] = useState("");
  const [plan, setPlanState] = useState<PlanId>("free");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [allowLocalPlans, setAllowLocalPlans] = useState(false);
  const [focusPath, setFocusPath] = useState<FocusPath | null>(null);
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
      setFocusPath(readFocusPath());
      const host = window.location.hostname;
      const unlock = localStorage.getItem("ats_admin_unlock") === "1";
      setAllowLocalPlans(host === "localhost" || host === "127.0.0.1" || unlock);
    } catch {
      /* ignore */
    }
    const sb = createBrowserSupabase();
    if (!sb) {
      setSessionReady(true);
      return;
    }
    sb.auth.getSession().then(async ({ data }) => {
      const e = data.session?.user?.email;
      if (e) {
        setSessionEmail(e);
        setEmail((prev) => prev || e);
        const elevated = await applySessionPrivileges(e);
        if (elevated) setPlanState(elevated);
        else await syncCloudPlan(e);
      }
      setSessionReady(true);
    }).catch(() => setSessionReady(true));
  }, []);

  async function syncCloudPlan(em: string) {
    try {
      const res = await fetch(`/api/entitlements?email=${encodeURIComponent(em)}`);
      if (!res.ok) return;
      const d = await res.json();
      if (d.plan && ["free", "carrera", "plus", "tester"].includes(d.plan)) {
        setPlan(d.plan as PlanId, "webhook");
        setPlanState(d.plan as PlanId);
        if (d.pendingApplied > 0) {
          setMsg(`Se aplicaron ${d.pendingApplied} pago(s) pendiente(s). Plan: ${planLabel(d.plan)}.`);
        }
      }
    } catch {
      /* ignore */
    }
  }

  async function claimPayments() {
    if (!email.includes("@")) {
      setMsg("Escribe el correo con el que pagaste.");
      return;
    }
    setMsg("Reclamando pagos…");
    try {
      const res = await fetch("/api/payments/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      await syncCloudPlan(email);
      setMsg(d.message || "Listo.");
    } catch {
      setMsg("No se pudo reclamar el pago.");
    }
  }

  async function exportHabeas() {
    const payload = await downloadHabeasZip({
      profile: { name, email, channel },
      plan: readEntitlement(),
    });
    if (email.includes("@")) {
      fetch("/api/account/habeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, payload, action: "export" }),
      }).catch(() => undefined);
    }
    setMsg("Descargamos ZIP Habeas Data (JSON + raw). Si hay Resend, también se intenta email.");
  }

  async function wipeCloudAndLocal() {
    if (!confirm("¿Borrar datos locales y cloud (plan free)? Esta acción no se puede deshacer.")) return;
    wipeHabeasLocal();
    setName("");
    setPlanState("free");
    if (email.includes("@")) {
      try {
        const sb = createBrowserSupabase();
        const { data: sess } = sb ? await sb.auth.getSession() : { data: { session: null } };
        const token = sess.session?.access_token;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch("/api/account/habeas", {
          method: "POST",
          headers,
          body: JSON.stringify({ email, payload: {}, action: "wipe" }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMsg(
            data.error ||
              "Wipe local OK. Cloud requiere sesión (magic link) con el mismo correo."
          );
          return;
        }
      } catch {
        setMsg("Datos locales eliminados. No se pudo contactar wipe cloud.");
        return;
      }
    }
    setMsg("Datos locales eliminados. Si había perfil cloud autenticado, quedó en plan free.");
  }

  function deleteLocal() {
    wipeHabeasLocal();
    setName("");
    setEmail("");
    setPlanState("free");
    window.location.href = "/";
  }

  function save() {
    localStorage.setItem("ats_profile", JSON.stringify({ name, email, channel }));
    setMsg("Preferencias guardadas.");
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
    setMsg("Sesión cerrada. Puedes entrar con otro correo.");
    window.location.href = "/auth";
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Mi cuenta</h1>
          <SpeakButton text="Sin cuenta puedes comparar un CV con una vacante y ver el resultado aquí. Entra con tu correo si quieres guardar ese resultado y consultarlo después." />
        </div>
        {sessionEmail ? (
          <>
            <p className="text-sm">
              Entraste con <strong>{sessionEmail}</strong>.
            </p>
            <button type="button" className="btn-primary" onClick={() => void signOut()}>
              Salir / cambiar de correo
            </button>
          </>
        ) : (
          <p className="text-sm">Aún no has entrado.</p>
        )}
        <p className="text-sm">
          Plan: <span className="font-medium" style={{ color: "var(--brand)" }}>{planLabel(plan)}</span>
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Sin cuenta, o con correo</h2>
        <p className="text-sm leading-relaxed">
          Puedes comparar un CV con una vacante sin cuenta. Ves el resultado en ese recorrido.
        </p>
        <p className="text-sm muted leading-relaxed">
          Entra con tu correo si quieres guardar ese resultado y consultarlo después. Si pagaste un plan, usa el mismo correo.
        </p>
        {sessionReady && !sessionEmail ? (
          <Link href="/auth" className="btn-primary">
            Entrar con mi correo
          </Link>
        ) : null}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Por dónde sigues</h2>
        <p className="text-sm muted leading-relaxed">
          Elige si sigues el cuadernillo o analizas tu CV. Puedes cambiarlo después.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn-secondary"
            style={
              focusPath === "carrera"
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : undefined
            }
            onClick={() => {
              writeFocusPath("carrera");
              setFocusPath("carrera");
              setMsg("Listo. Tu prioridad es el cuadernillo de carrera.");
            }}
          >
            Cuadernillo de carrera
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={
              focusPath === "ats"
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : undefined
            }
            onClick={() => {
              writeFocusPath("ats");
              setFocusPath("ats");
              setMsg("Listo. Tu prioridad es analizar tu CV.");
            }}
          >
            Analizar mi CV
          </button>
        </div>
      </section>

      <div className="bento-card space-y-3">
        <VoiceInput
          label="Tu nombre"
          value={name}
          onChange={setName}
          placeholder="Ejemplo: María Gómez"
          dictationLabel="Dictar nombre"
        />
        <label className="block text-sm">
          Correo (el mismo si pagaste, para activar el plan)
          <input
            className="field mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ejemplo: maria@correo.com"
          />
        </label>
        <p className="text-sm font-medium">Canal de microlearning</p>
        <ChannelChooser value={channel} onChange={setChannel} whatsappPriceCop={waPrice} />
        <button type="button" className="btn-primary" onClick={save}>
          Guardar
        </button>
        {sessionEmail && (
          <button type="button" className="btn-secondary" onClick={() => void signOut()}>
            Salir / cambiar de correo
          </button>
        )}
        <Link href="/auth" className="btn-secondary">
          {sessionEmail ? "Pedir enlace a otro correo" : "Entrar con enlace al correo"}
        </Link>
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Plan actual</h2>
        <p className="text-sm muted">
          {planLabel(plan)}. Si pagaste, reclama el plan con el mismo correo del pago.
        </p>
        <Link href="/precios" className="btn-primary">
          Ver precios
        </Link>
        <button type="button" className="btn-secondary" onClick={claimPayments}>
          Reclamar pago
        </button>
        {allowLocalPlans && (
          <details className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            <summary className="cursor-pointer text-sm font-medium">Probar un plan en este equipo</summary>
            <div className="mt-3 flex flex-col gap-2">
              {(
                [
                  ["free", "Gratis"],
                  ["carrera", "Carrera"],
                  ["plus", "Carrera (plan anterior)"],
                  ["tester", "Tester"],
                  ["paused_90", "Pausa 90 días"],
                ] as const
              ).map(([p, label]) => (
                <button
                  key={p}
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setPlan(p, "local");
                    setPlanState(p);
                    setMsg(label);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </details>
        )}
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Mi IA (clave propia)</h2>
        <p className="text-xs muted leading-relaxed">
          Pega tu clave de Groq o Gemini. Se guarda en este dispositivo y se usa en carta, tips y ajustes.
        </p>
        <Link href="/cuenta/mi-ia" className="btn-primary">
          Configurar Mi IA
        </Link>
      </div>

      <div className="bento-card space-y-3">
        <h2 className="font-semibold">Habeas Data y baja</h2>
        <Link href="/cuenta/referidos" className="btn-secondary">
          Invitar amigos (referidos)
        </Link>
        <Link href="/cuenta/cvs" className="btn-secondary">
          Versiones de CV
        </Link>
        <button type="button" className="btn-primary" onClick={exportHabeas}>
          Descargar mis datos (ZIP)
        </button>
        <button type="button" className="btn-secondary" onClick={deleteLocal}>
          Eliminar datos locales
        </button>
        <button type="button" className="btn-secondary" onClick={wipeCloudAndLocal}>
          Baja completa (local + cloud)
        </button>
      </div>

      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
