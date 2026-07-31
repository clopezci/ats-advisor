"use client";

import { useEffect } from "react";
import Link from "next/link";
import { clientReportError } from "@/lib/observability";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clientReportError("error.tsx", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Algo salió mal</h1>
      <p className="text-sm muted">
        No es tu culpa. Puedes reintentar. Si sigue fallando, vuelve al inicio.
      </p>
      <p className="text-xs muted">{error.message}</p>
      <button type="button" className="btn-primary" onClick={reset}>
        Reintentar
      </button>
      <Link href="/" className="btn-secondary text-center">
        Ir al inicio
      </Link>
      <Link href="/feedback" className="text-center text-sm" style={{ color: "var(--brand)" }}>
        Enviar feedback →
      </Link>
    </div>
  );
}
