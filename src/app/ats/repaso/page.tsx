import { Suspense } from "react";
import RepasoClient from "./RepasoClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-4 text-sm muted">Cargando…</p>}>
      <RepasoClient />
    </Suspense>
  );
}
