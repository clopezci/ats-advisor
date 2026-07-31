"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

function RutaInner() {
  const params = useSearchParams();
  const initial = params.get("code") || "OUT-01";
  const [code, setCode] = useState(initial);
  const [day, setDay] = useState(0);

  const mod = useMemo(
    () => OUTPLACEMENT_MODULES.find((m) => m.code === code) || OUTPLACEMENT_MODULES[0],
    [code]
  );
  const capsule = mod.capsules[day];
  const progress = ((day + 1) / mod.capsules.length) * 100;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs muted">{mod.code}</p>
            <h1 className="text-xl font-semibold">{mod.title}</h1>
          </div>
          <SpeakButton text={`${mod.title}. ${capsule?.title}. ${capsule?.content}`} />
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs muted">
          Cápsula {day + 1} de {mod.capsules.length}
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {OUTPLACEMENT_MODULES.map((m) => (
          <button
            key={m.code}
            type="button"
            className="pill-brand whitespace-nowrap"
            style={m.code === code ? { boxShadow: "var(--shadow-brand)" } : undefined}
            onClick={() => {
              setCode(m.code);
              setDay(0);
            }}
          >
            {m.code}
          </button>
        ))}
      </div>

      {capsule && (
        <section className="bento-card space-y-3">
          <h2 className="text-lg font-semibold">{capsule.title}</h2>
          <p className="text-sm leading-relaxed muted">{capsule.content}</p>
          {capsule.quiz && (
            <div className="rounded-xl p-3" style={{ background: "var(--brand-soft)" }}>
              <p className="text-sm font-medium">{capsule.quiz.question}</p>
              <div className="mt-2 flex flex-col gap-2">
                {capsule.quiz.options.map((opt, idx) => (
                  <button
                    key={opt}
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      alert(idx === capsule.quiz!.answer ? "Correcto" : "Revisa de nuevo la cápsula")
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={day >= mod.capsules.length - 1}
          onClick={() => setDay((d) => Math.min(mod.capsules.length - 1, d + 1))}
        >
          Siguiente cápsula
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={day <= 0}
          onClick={() => setDay((d) => Math.max(0, d - 1))}
        >
          Anterior
        </button>
        <Link href="/outplacement" className="btn-secondary">
          Volver a módulos
        </Link>
      </div>
    </div>
  );
}

export default function RutaPage() {
  return (
    <Suspense fallback={<p className="muted">Cargando ruta…</p>}>
      <RutaInner />
    </Suspense>
  );
}
