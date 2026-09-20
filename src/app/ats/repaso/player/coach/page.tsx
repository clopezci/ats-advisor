import { Suspense } from "react";
import CoachClient from "./CoachClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-4 text-sm muted">Cargando simulacro…</p>}>
      <CoachClient />
    </Suspense>
  );
}
