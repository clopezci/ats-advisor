"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  deleteFeedbackScore,
  listFeedbackScores,
  type FeedbackScore,
} from "@/lib/workbook/simulations";

const INTRO =
  "Historial de scores de simulaciones. Úsalo para ver tendencia: qué mejora y qué se queda corto.";

export default function FeedbackHistorialPage() {
  const [items, setItems] = useState<FeedbackScore[]>([]);

  function refresh() {
    setItems(listFeedbackScores());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · entrevistas</p>
            <h1 className="text-2xl font-semibold">Historial de feedback</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      {!items.length ? (
        <p className="text-sm muted">Aún no hay scores. Corre una simulación primero.</p>
      ) : (
        items.map((it) => {
          const vals = Object.values(it.scores).filter((n) => n > 0);
          const avg = vals.length
            ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
            : "—";
          return (
            <article key={it.id} className="bento-card space-y-2">
              <h2 className="font-semibold text-sm">{it.caseTitle}</h2>
              <p className="text-xs muted">
                {new Date(it.createdAt).toLocaleString()} · promedio {avg}/5
              </p>
              <ul className="text-sm muted space-y-1">
                {Object.entries(it.scores).map(([k, v]) =>
                  v ? (
                    <li key={k}>
                      {k}: {v}
                    </li>
                  ) : null
                )}
              </ul>
              {it.notes ? <p className="text-sm">{it.notes}</p> : null}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  deleteFeedbackScore(it.id);
                  refresh();
                }}
              >
                Eliminar
              </button>
            </article>
          );
        })
      )}

      <Link href="/outplacement/cuadernillo/simulaciones" className="btn-secondary">
        Nueva simulación
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
