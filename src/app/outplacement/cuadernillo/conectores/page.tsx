"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { readWorkbook, writeWorkbook, type WorkbookState } from "@/lib/workbook/types";

const INTRO =
  "Clasifica tu red: cercanos de confianza, aliados de objetivo y conectores. Evita relaciones que solo drenan. Anota 3 acciones de esta semana.";

const ROLES = [
  { id: "cercano", label: "Cercano de confianza" },
  { id: "aliado", label: "Aliado de objetivo" },
  { id: "conector", label: "Conector (une redes)" },
  { id: "drena", label: "Drena (límite)" },
  { id: "neutro", label: "Neutro" },
] as const;

export default function ConectoresPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [mapNote, setMapNote] = useState("");
  const [weekActions, setWeekActions] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const state = readWorkbook();
    setWb(state);
    try {
      const raw = JSON.parse(localStorage.getItem("ats_connectors_notes") || "null");
      if (raw?.mapNote) setMapNote(raw.mapNote);
      if (raw?.weekActions) setWeekActions(raw.weekActions);
    } catch {
      /* ignore */
    }
  }, []);

  function persistNotes(nextMap: string, nextWeek: string) {
    setMapNote(nextMap);
    setWeekActions(nextWeek);
    localStorage.setItem(
      "ats_connectors_notes",
      JSON.stringify({ mapNote: nextMap, weekActions: nextWeek, updatedAt: Date.now() })
    );
  }

  function markRelated() {
    if (!wb) return;
    writeWorkbook({
      ...wb,
      completed: { ...wb.completed, red: wb.completed.red || false },
    });
    setMsg("Notas guardadas. Sigue con plantillas y CRM.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · networking</p>
            <h1 className="text-2xl font-semibold">Cercanos, aliados, conectores</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
      </section>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Roles en tu red</h2>
        <ul className="text-sm muted space-y-2 leading-relaxed">
          <li>
            <strong>Cercano</strong> — feedback y ánimo; no siempre abre
            mercado.
          </li>
          <li>
            <strong>Aliado</strong> — mismo sector/objetivo; vacantes e
            intros.
          </li>
          <li>
            <strong>Conector</strong> — une redes distintas; presenta con
            contexto y busca que ambas partes ganen.
          </li>
          <li>
            <strong>Drena</strong> — solo pide; límites claros, menos
            tiempo.
          </li>
        </ul>
        <p className="text-xs muted">Etiquetas útiles: {ROLES.map((r) => r.label).join(" · ")}</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Ejercicio: mapa de 15</h2>
        <p className="text-xs muted">
          Escribe nombres y marca Cercano / Aliado / Conector / Drena / Neutro.
        </p>
        <VoiceTextarea
          label="Tu mapa"
          value={mapNote}
          onChange={(v) => persistNotes(v, weekActions)}
          className="field min-h-32"
          placeholder="1) Ana — Conector — intro a ops&#10;2) Luis — Aliado — …"
          dictationLabel="Dictar mapa"
        />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">3 acciones esta semana</h2>
        <VoiceTextarea
          label="Acciones"
          value={weekActions}
          onChange={(v) => persistNotes(mapNote, v)}
          className="field min-h-24"
          placeholder="1) Mensaje a [conector] pidiendo…&#10;2) …"
          dictationLabel="Dictar"
        />
        <button type="button" className="btn-primary" onClick={markRelated}>
          Guardar y continuar
        </button>
        {msg ? <p className="text-sm muted">{msg}</p> : null}
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Roleplay: pedir una intro</h2>
        <p className="text-sm leading-relaxed">
          Practica en voz alta (60–90 s): contexto → por qué esa persona → favor concreto →
          cómo facilitas la intro → cierre con fecha.
        </p>
        <ol className="text-xs muted space-y-2 list-decimal pl-4 leading-relaxed">
          <li>“Estoy explorando roles de [X] en [sector].”</li>
          <li>“Vi que conoces a [Nombre] en [empresa].”</li>
          <li>“¿Me presentarías para una charla de 15 min sobre el mercado (no pedirle empleo)?”</li>
          <li>“Te dejo un párrafo listo para reenviar + mi LinkedIn.”</li>
        </ol>
        <Link href="/outplacement/roleplay" className="btn-secondary">
          Practicar con coach Gabriel / Irene
        </Link>
      </section>

      <CoachAsk
        coachModule="networking"
        placeholder="Ej.: ¿cómo le pido una intro a un conector sin sonar interesad@?"
      />

      <Link href="/outplacement/cuadernillo/plantillas" className="btn-secondary">
        Banco de plantillas por audiencia
      </Link>
      <Link href="/outplacement/cuadernillo/red" className="btn-secondary">
        CRM del cuadernillo
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
