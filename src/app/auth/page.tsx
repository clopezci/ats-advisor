"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { claimReferral } from "@/lib/growth/referral";

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
      setMsg("Supabase no está configurado aún. Sigue MANUAL-ACCIONES.md sección 2.");
      setLoading(false);
      return;
    }
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/cuenta`,
      },
    });
    setMsg(error ? error.message : "Te enviamos un enlace mágico. Revisa tu correo.");
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
      <p className="text-sm muted">Magic link por correo (Supabase). Sin contraseña.</p>
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
      <Link href="/cuenta" className="btn-secondary">
        Ir a mi cuenta
      </Link>
    </div>
  );
}
