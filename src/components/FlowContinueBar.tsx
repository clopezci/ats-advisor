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

  const action = target.label.replace(/^Continuar:\s*/, "");

  return (
    <Link
      href={target.href}
      className="btn-primary w-full"
      style={{
        minHeight: "4.75rem",
        lineHeight: 1.35,
        flexDirection: "column",
        gap: "0.2rem",
        textAlign: "center",
      }}
    >
      <span>
        {label}: {action}
      </span>
      <span className="text-xs font-normal opacity-90">{target.hint}</span>
    </Link>
  );
}
