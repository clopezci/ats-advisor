"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
    </div>
  );
}
