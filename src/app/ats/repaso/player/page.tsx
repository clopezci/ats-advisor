import { Suspense } from "react";
import PlayerClient from "./PlayerClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-4 text-sm muted">Cargando plan…</p>}>
      <PlayerClient />
    </Suspense>
  );
}
