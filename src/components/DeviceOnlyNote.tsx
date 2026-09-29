"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readSaveChoice } from "@/lib/client/saveChoice";
import { authHref } from "@/lib/client/authReturn";
import { createBrowserSupabase } from "@/lib/supabase/client";

/** Avisa si la persona sigue sin correo: nada queda para consultarlo después. */
export function DeviceOnlyNote() {
  const [show, setShow] = useState(false);
  const [href, setHref] = useState("/auth");

  useEffect(() => {
    setHref(authHref());
    const choice = readSaveChoice();
    if (!choice) {
      setShow(false);
      return;
    }
    const sb = createBrowserSupabase();
    if (!sb) {
      setShow(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setShow(!data.session?.user?.email);
    });
  }, []);

  if (!show) return null;

  return (
    <p className="text-xs leading-relaxed rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)" }}>
      Sigues sin correo. Lo de esta visita no queda guardado para consultarlo después.{" "}
      <Link href={href} className="underline" style={{ color: "var(--brand)" }}>
        Entrar con mi correo
      </Link>
    </p>
  );
}
