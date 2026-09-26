"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

/** Muestra en la barra si hay correo de sesión o si se usa la app sin entrar. */
export function SessionChip() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const sb = createBrowserSupabase();
    if (!sb) {
      setEmail(null);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email || null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (email === undefined) return null;

  return (
    <Link href="/cuenta" className="text-xs underline shrink-0" style={{ color: "var(--brand)" }}>
      {email ? email : "Sin entrar"}
    </Link>
  );
}
