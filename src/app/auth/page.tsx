"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <p className="text-sm muted">Magic link por correo (Supabase). Sin contraseña.</p>
      <input
        className="field"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
      />
      <button type="button" className="btn-primary" disabled={loading || !email.includes("@")} onClick={sendLink}>
        {loading ? "Enviando…" : "Enviar enlace"}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/cuenta" className="btn-secondary">
        Ir a mi cuenta
      </Link>
    </div>
  );
}
