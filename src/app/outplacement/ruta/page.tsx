"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CoursePlayer } from "@/components/CoursePlayer";
import { moduleToCourse } from "@/lib/courses/catalog";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { outModuleShort } from "@/lib/outplacement/labels";

function RutaInner() {
  const params = useSearchParams();
  const initial = params.get("code") || "OUT-01";
  const [code, setCode] = useState(initial);

  useEffect(() => {
    setCode(params.get("code") || "OUT-01");
  }, [params]);

  const course = useMemo(() => moduleToCourse(code), [code]);

  if (!course) {
    return <p className="muted">Módulo no encontrado.</p>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {OUTPLACEMENT_MODULES.map((m) => (
          <button
            key={m.code}
            type="button"
            className="pill-brand whitespace-nowrap"
            aria-pressed={m.code === code}
            style={m.code === code ? { boxShadow: "var(--shadow-brand)" } : undefined}
            onClick={() => setCode(m.code)}
          >
            {outModuleShort(m.code)}
          </button>
        ))}
      </div>
      <CoursePlayer course={course} backHref="/outplacement/tablero" />
      <Link href="/outplacement/tablero" className="btn-secondary">
        Ver tablero de todos los cursos
      </Link>
    </div>
  );
}

export default function RutaPage() {
  return (
    <Suspense fallback={<p className="muted">Cargando curso…</p>}>
      <RutaInner />
    </Suspense>
  );
}
