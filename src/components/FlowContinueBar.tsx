"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resolveContinueTarget, type ContinueTarget } from "@/lib/engagement/focusPath";

/** Barra inferior reutilizable: un Continuar según camino del usuario. */
export function FlowContinueBar({ label = "Continuar" }: { label?: string }) {
  const [target, setTarget] = useState<ContinueTarget | null>(null);

  useEffect(() => {
    setTarget(resolveContinueTarget());
  }, []);

  if (!target) return null;

  return (
    <Link href={target.href} className="btn-primary">
      {label}: {target.label.replace(/^Continuar:\s*/, "")}
    </Link>
  );
}
