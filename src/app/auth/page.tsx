"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { claimReferral } from "@/lib/growth/referral";

function authNotice(raw: string): string {
  const text = raw.toLowerCase();
  if (
    text.includes("failed to fetch") ||
    text.includes("network") ||
    text.includes("load failed") ||
    text.includes("fetch")
  ) {
    return "No pudimos enviar el enlace. El acceso por correo no está respondiendo. Inténtalo otra vez en un momento.";
  }
  if (text.includes("rate") || text.includes("too many") || text.includes("once every")) {
    return "Pediste varios enlaces seguidos. Espera un minuto y vuelve a intentar.";
  }
  if (text.includes("email") && (text.includes("invalid") || text.includes("unable"))) {
    return "Ese correo no se ve bien. Revísalo, por ejemplo nombre@hotmail.com, y vuelve a enviarlo.";
  }
  return "No pudimos enviar el enlace. Revisa el correo e inténtalo otra vez.";
}

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    const sb = createBrowserSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user?.email || null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setSessionEmail(session?.user?.email || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && ref.length >= 4) {
        claimReferral(ref);
        setMsg(`Referido ${ref.toUpperCase()} guardado.`);
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function sendLink() {
    setLoading(true);
    setMsg("");
    const sb = createBrowserSupabase();
    if (!sb) {
      setMsg("El acceso por correo no está conectado en este momento. Puedes seguir usando la app en este navegador.");
      setLoading(false);
      return;
    }
    try {
      const { error } = await sb.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/cuenta`,
        },
      });
      setMsg(error ? authNotice(error.message) : "Te enviamos un enlace. Ábrelo desde ese correo para guardar tu recorrido.");
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      setMsg(authNotice(raw));
    }
    setLoading(false);
  }

  async function signOut() {
    const sb = createBrowserSupabase();
    if (sb) await sb.auth.signOut();
    setSessionEmail(null);
    setMsg("Sesión cerrada.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <p className="text-sm leading-relaxed">
        El enlace guarda tu recorrido para consultarlo después, con este mismo correo. Analizar un CV no pide cuenta.
      </p>
      <p className="text-sm muted leading-relaxed">
        Si ya pagaste, entra con ese correo para reclamar el plan.
      </p>
      {sessionEmail ? (
        <section className="bento-card space-y-3">
          <p className="text-sm">
            Sesión activa: <strong>{sessionEmail}</strong>
          </p>
          <button type="button" className="btn-primary" onClick={signOut}>
            Cerrar sesión
          </button>
          <Link href="/cuenta" className="btn-secondary">
            Ir a mi cuenta
          </Link>
        </section>
      ) : (
        <>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
          />
          <button
            type="button"
            className="btn-primary"
            disabled={loading || !email.includes("@")}
            onClick={sendLink}
          >
            {loading ? "Enviando…" : "Enviar enlace"}
          </button>
        </>
      )}
      {msg && <p className="text-sm">{msg}</p>}
      {!sessionEmail ? (
        <Link href="/cuenta" className="text-sm underline" style={{ color: "var(--brand)" }}>
          Ya entré antes: ir a mi cuenta
        </Link>
      ) : null}
    </div>
  );
}
