"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { applySessionPrivileges } from "@/lib/client/sessionPrivileges";

/** Muestra el correo de sesión y permite salir para cambiar de usuario. */
export function SessionChip() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const sb = createBrowserSupabase();
    if (!sb) {
      setEmail(null);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      const mail = data.session?.user?.email || null;
      setEmail(mail);
      if (mail) void applySessionPrivileges(mail);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      const mail = session?.user?.email || null;
      setEmail(mail);
      if (mail) void applySessionPrivileges(mail);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const sb = createBrowserSupabase();
    if (sb) await sb.auth.signOut();
    setEmail(null);
    window.location.href = "/auth";
  }

  if (email === undefined) return null;

  if (!email) {
    return (
      <Link href="/auth" className="text-xs underline shrink-0" style={{ color: "var(--brand)" }}>
        Sin entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0 max-w-[min(100%,14rem)]">
      <Link
        href="/cuenta"
        className="text-xs underline truncate"
        style={{ color: "var(--brand)" }}
        title={email}
      >
        {email}
      </Link>
      <button
        type="button"
        className="text-xs underline shrink-0"
        style={{ color: "var(--brand)" }}
        onClick={() => void signOut()}
      >
        Salir
      </button>
    </div>
  );
}
