"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { claimReferral } from "@/lib/growth/referral";
import { readAuthNextFromSearch } from "@/lib/client/authReturn";
import { applySessionPrivileges } from "@/lib/client/sessionPrivileges";
import { safeAppPath } from "@/lib/validation";

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
  if (text.includes("rate") || text.includes("too many") || text.includes("once every") || text.includes("over_email")) {
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
  const [returnTo, setReturnTo] = useState("/cuenta");
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const next = readAuthNextFromSearch(window.location.search, "/cuenta");
    setReturnTo(next);
    try {
      sessionStorage.setItem("ats_auth_return", next);
    } catch {
      /* ignore */
    }

    const sb = createBrowserSupabase();
    if (!sb) return;
    sb.auth.getSession().then(async ({ data }) => {
      const mail = data.session?.user?.email || null;
      setSessionEmail(mail);
      if (mail) {
        await applySessionPrivileges(mail);
        goBackAfterLogin(next);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      const mail = session?.user?.email || null;
      setSessionEmail(mail);
      // Solo en login real; TOKEN_REFRESHED/INITIAL_SESSION no deben redirigir en bucle.
      if (mail && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY")) {
        void applySessionPrivileges(mail).then(() => goBackAfterLogin(next));
      }
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

  function goBackAfterLogin(next: string) {
    if (switching) return;
    if (!new URLSearchParams(window.location.search).has("next")) return;
    const target = safeAppPath(next, "/cuenta");
    if (target === "/auth" || window.location.pathname !== "/auth") return;
    window.location.replace(target);
  }

  async function sendLink() {
    setLoading(true);
    setMsg("");
    const sb = createBrowserSupabase();
    if (!sb) {
      setMsg("El acceso por correo no está conectado en este momento. Puedes seguir usando la app en este navegador.");
      setLoading(false);
      return;
    }
    if (sessionEmail) {
      await sb.auth.signOut();
      setSessionEmail(null);
    }
    const next = safeAppPath(returnTo, "/cuenta");
    try {
      sessionStorage.setItem("ats_auth_return", next);
    } catch {
      /* ignore */
    }
    try {
      const { error } = await sb.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(next)}`,
          shouldCreateUser: true,
        },
      });
      setMsg(
        error
          ? authNotice(error.message)
          : "Te enviamos un enlace de un solo uso. Ábrelo solo tú, desde ese correo. Caduca pronto."
      );
      setSwitching(false);
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      setMsg(authNotice(raw));
    }
    setLoading(false);
  }

  async function signOut() {
    setSwitching(true);
    const sb = createBrowserSupabase();
    if (sb) await sb.auth.signOut();
    setSessionEmail(null);
    setMsg("Sesión cerrada. Puedes entrar con otro correo.");
  }

  const showForm = !sessionEmail || switching;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <p className="text-sm leading-relaxed">
        El enlace guarda tu recorrido para consultarlo después, con este mismo correo. Analizar un CV no pide cuenta.
      </p>
      <p className="text-sm muted leading-relaxed">
        Si ya pagaste, entra con ese correo para reclamar el plan.
      </p>
      {returnTo !== "/cuenta" ? (
        <p className="text-sm leading-relaxed">Cuando abras el enlace, volvemos a donde ibas.</p>
      ) : null}

      {sessionEmail && !switching ? (
        <section className="bento-card space-y-3">
          <p className="text-sm">
            Entraste con <strong>{sessionEmail}</strong>.
          </p>
          <Link href={returnTo} className="btn-primary">
            Seguir donde iba
          </Link>
          <button type="button" className="btn-primary" onClick={() => void signOut()}>
            Salir / entrar con otro correo
          </button>
          <Link href="/cuenta" className="btn-secondary">
            Ir a mi cuenta
          </Link>
        </section>
      ) : null}

      {showForm ? (
        <section className="bento-card space-y-3">
          <h2 className="text-sm font-semibold">{sessionEmail ? "Entrar con otro correo" : "Tu correo"}</h2>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
          />
          <button
            type="button"
            className="btn-primary"
            disabled={loading || !email.includes("@")}
            onClick={() => void sendLink()}
          >
            {loading ? "Enviando…" : "Enviar enlace"}
          </button>
        </section>
      ) : null}

      {msg && <p className="text-sm">{msg}</p>}

      <section className="bento-card space-y-2">
        <h2 className="text-sm font-semibold">Seguridad del acceso</h2>
        <p className="text-sm muted leading-relaxed">
          El enlace es de un solo uso y caduca. Quien pueda leer ese buzón puede entrar: protege el correo con
          verificación en dos pasos. No reenvíes el mensaje.
        </p>
        <p className="text-sm muted leading-relaxed">
          El panel de administración no se abre solo con el correo: pide una clave aparte en el servidor. El correo del
          dueño desbloquea el producto completo (Tester), no la consola admin.
        </p>
      </section>

      {!sessionEmail ? (
        <Link
          href={returnTo === "/cuenta" ? "/cuenta" : returnTo}
          className="text-sm underline"
          style={{ color: "var(--brand)" }}
        >
          {returnTo === "/cuenta" ? "Ya entré antes: ir a mi cuenta" : "Cancelar y volver"}
        </Link>
      ) : null}
    </div>
  );
}
