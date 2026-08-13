"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { AdSlot } from "@/components/AdSlot";
import {
  PERSON_GOALS,
  matchGoalsFromText,
  readGuidePlan,
  writeGuidePlan,
} from "@/lib/flows/personGoals";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";

export default function GuiaPage() {
  const [phase, setPhase] = useState<"elegir" | "recorrido">("elegir");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [need, setNeed] = useState("");
  const [idx, setIdx] = useState(0);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
    const saved = readGuidePlan();
    if (saved.length) {
      const map: Record<string, boolean> = {};
      saved.forEach((id) => {
        map[id] = true;
      });
      setSelected(map);
    }
  }, []);

  const chosen = useMemo(
    () => PERSON_GOALS.filter((g) => selected[g.id]),
    [selected]
  );
  const current = chosen[idx];

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function selectAll() {
    const map: Record<string, boolean> = {};
    PERSON_GOALS.forEach((g) => {
      map[g.id] = true;
    });
    setSelected(map);
  }

  function applyVoice() {
    const ids = matchGoalsFromText(need);
    const map = { ...selected };
    ids.forEach((id) => {
      map[id] = true;
    });
    setSelected(map);
  }

  function startWalk() {
    const ids = PERSON_GOALS.filter((g) => selected[g.id]).map((g) => g.id);
    if (!ids.length) return;
    writeGuidePlan(ids);
    setIdx(0);
    setPhase("recorrido");
  }

  if (phase === "recorrido" && current) {
    const locked = current.paid && !paid;
    return (
      <div className="flex flex-1 flex-col gap-5">
        <section className="bento-card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs muted">
                Paso {idx + 1} de {chosen.length}
              </p>
              <h1 className="mt-1 text-2xl font-semibold">{current.title}</h1>
            </div>
            <SpeakButton text={`${current.title}. ${current.benefit}`} />
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((idx + 1) / chosen.length) * 100}%` }}
            />
          </div>
          <p className="text-sm muted">{current.benefit}</p>
          {locked && (
            <p className="text-sm">
              Esto está en el plan Carrera. Puedes ver precios o seguir al siguiente paso.
            </p>
          )}
        </section>

        {locked ? (
          <Link href="/precios" className="btn-primary">
            Ver planes Carrera
          </Link>
        ) : (
          <Link href={current.href} className="btn-primary">
            Hacer esto ahora
          </Link>
        )}

        {idx < chosen.length - 1 ? (
          <button type="button" className="btn-secondary" onClick={() => setIdx((i) => i + 1)}>
            Siguiente del plan
          </button>
        ) : (
          <p className="text-sm muted text-center">Terminaste este recorrido. Puedes volver a elegir más.</p>
        )}

        {idx > 0 && (
          <button type="button" className="btn-secondary" onClick={() => setIdx((i) => i - 1)}>
            Anterior
          </button>
        )}

        <button type="button" className="btn-secondary" onClick={() => setPhase("elegir")}>
          Volver a la lista (marcar más)
        </button>
        <Link href="/" className="text-center text-sm muted">
          Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Un paso a la vez</p>
            <h1 className="mt-1 text-2xl font-semibold">¿Qué necesitas ahora?</h1>
          </div>
          <SpeakButton text="Marca lo que te importa, o dicta tu prioridad. Luego te llevamos uno a uno, sin abrumarte." />
        </div>
        <p className="text-sm muted">
          Marca casillas, pulsa “Marcar todo”, o escribe/dicta lo más urgente y armamos el plan.
          Después verás <strong>una sola cosa</strong> por pantalla.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <VoiceTextarea
          label="Dilo con tus palabras (opcional)"
          value={need}
          onChange={setNeed}
          className="field min-h-24"
          placeholder="Ej.: me echaron, necesito CV y practicar entrevistas…"
          dictationLabel="Dictar prioridad"
        />
        <button type="button" className="btn-secondary" onClick={applyVoice} disabled={need.trim().length < 6}>
          Marcar según esto
        </button>
      </section>

      <div className="flex gap-2">
        <button type="button" className="btn-secondary" onClick={selectAll}>
          Marcar todo
        </button>
        <button type="button" className="btn-secondary" onClick={() => setSelected({})}>
          Limpiar
        </button>
      </div>

      <div className="space-y-2">
        {PERSON_GOALS.map((g) => (
          <label key={g.id} className="bento-card flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={Boolean(selected[g.id])}
              onChange={() => toggle(g.id)}
            />
            <span>
              <span className="block font-medium text-sm">{g.title}</span>
              <span className="block text-xs muted">{g.benefit}</span>
              {g.paid && !paid && <span className="text-xs muted"> · en plan Carrera</span>}
            </span>
          </label>
        ))}
      </div>

      <button type="button" className="btn-primary" disabled={!chosen.length} onClick={startWalk}>
        Empezar mi recorrido ({chosen.length})
      </button>
      <AdSlot slot="guia" />
      <Link href="/" className="btn-secondary">
        Volver al inicio
      </Link>
    </div>
  );
}
