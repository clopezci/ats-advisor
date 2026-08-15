"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { AdSlot } from "@/components/AdSlot";
import { DailyCourseReminder } from "@/components/DailyCourseReminder";
import {
  PERSON_GOALS,
  accessLabel,
  goalNeedsCarrera,
  matchGoalsFromText,
  orderGoalsForWalk,
  readGuidePlan,
  readGuideResume,
  writeGuidePlan,
  writeGuideResume,
  type GoalAccess,
  type PersonGoal,
} from "@/lib/flows/personGoals";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { CAREER_MODULE_PITCH } from "@/lib/outplacement/labels";
import { writeFocusPath } from "@/lib/engagement/focusPath";

type SoftGate = "none" | "save" | "pay";

function badge(access: GoalAccess) {
  if (access === "free") return "Gratis";
  if (access === "carrera") return "Carrera";
  if (access === "curso") return "Add-on";
  return "Sin suscripción";
}

function GoalRow({
  g,
  checked,
  onToggle,
}: {
  g: PersonGoal;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="bento-card flex items-start gap-3 cursor-pointer">
      <input type="checkbox" className="mt-1" checked={checked} onChange={onToggle} />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-sm">{g.title}</span>
          <span className="pill-brand text-[10px]">{badge(g.access)}</span>
        </span>
        <span className="block text-xs muted mt-0.5">{g.benefit}</span>
      </span>
    </label>
  );
}

export default function GuiaPage() {
  const [phase, setPhase] = useState<"elegir" | "recorrido">("elegir");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [need, setNeed] = useState("");
  const [idx, setIdx] = useState(0);
  const [paid, setPaid] = useState(false);
  const [gate, setGate] = useState<SoftGate>("none");
  const [saveName, setSaveName] = useState("");
  const [saveEmail, setSaveEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const freeGoals = useMemo(() => PERSON_GOALS.filter((g) => g.access === "free"), []);
  const carreraGoals = useMemo(() => PERSON_GOALS.filter((g) => g.access === "carrera"), []);
  const extraGoals = useMemo(
    () => PERSON_GOALS.filter((g) => g.access === "curso" || g.access === "open"),
    []
  );

  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setSaveName(p.name);
      if (p?.email) setSaveEmail(p.email);
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams(window.location.search);
    const resume = readGuideResume();
    const saved = readGuidePlan();
    if (saved.length) {
      const map: Record<string, boolean> = {};
      saved.forEach((id) => {
        map[id] = true;
      });
      setSelected(map);
    }
    if (params.get("recorrido") === "1" && resume) {
      const map: Record<string, boolean> = {};
      resume.ids.forEach((id) => {
        map[id] = true;
      });
      setSelected(map);
      setIdx(Math.min(resume.idx, Math.max(0, resume.ids.length - 1)));
      setPhase("recorrido");
      window.history.replaceState({}, "", "/guia");
    }
  }, []);

  const chosen = useMemo(() => {
    const raw = PERSON_GOALS.filter((g) => selected[g.id]);
    return orderGoalsForWalk(raw);
  }, [selected]);

  const current = chosen[idx];

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function selectFree() {
    const map: Record<string, boolean> = { ...selected };
    freeGoals.forEach((g) => {
      map[g.id] = true;
    });
    setSelected(map);
  }

  function selectCarreraPack() {
    const map: Record<string, boolean> = { ...selected };
    [...freeGoals, ...carreraGoals].forEach((g) => {
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

  function persistResume(nextIdx: number, ids: string[]) {
    writeGuidePlan(ids);
    writeGuideResume({ ids, idx: nextIdx, phase: "recorrido" });
  }

  function startWalk() {
    const ordered = orderGoalsForWalk(PERSON_GOALS.filter((g) => selected[g.id]));
    const ids = ordered.map((g) => g.id);
    if (!ids.length) return;
    persistResume(0, ids);
    setIdx(0);
    setGate("none");
    setPhase("recorrido");
  }

  function goTo(nextIdx: number) {
    const ids = chosen.map((g) => g.id);
    persistResume(nextIdx, ids);
    setIdx(nextIdx);
    setGate("none");
  }

  function hasSavedEmail() {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      return Boolean(p?.email && String(p.email).includes("@"));
    } catch {
      return false;
    }
  }

  function openLockedFlow() {
    const ids = chosen.map((g) => g.id);
    persistResume(idx, ids);
    if (!hasSavedEmail()) {
      setGate("save");
      return;
    }
    setGate("pay");
  }

  function saveProgressProfile() {
    if (!saveEmail.includes("@")) {
      setSaveMsg("Escribe un correo válido para poder recuperar tu avance.");
      return;
    }
    try {
      const prev = JSON.parse(localStorage.getItem("ats_profile") || "{}");
      localStorage.setItem(
        "ats_profile",
        JSON.stringify({
          ...prev,
          name: saveName.trim() || prev.name || "",
          email: saveEmail.trim().toLowerCase(),
        })
      );
    } catch {
      /* ignore */
    }
    setSaveMsg("Guardado en este dispositivo. Siguiente: desbloquear Carrera.");
    setGate("pay");
  }

  function payHref() {
    const next = encodeURIComponent("/guia?recorrido=1");
    return `/precios?plan=carrera&next=${next}`;
  }

  if (phase === "recorrido" && current) {
    const locked = goalNeedsCarrera(current, paid);

    return (
      <div className="flex flex-1 flex-col gap-5">
        <section className="bento-card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs muted">
                Paso {idx + 1} de {chosen.length} · {accessLabel(current.access)}
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
        </section>

        {locked && gate === "none" && (
          <section className="bento-card space-y-3">
            <h2 className="font-semibold text-sm">Siguiente: acompañamiento Carrera</h2>
            <p className="text-sm muted">
              Hasta aquí usaste lo gratis (ATS / encaje / tracker). Este paso es del plan Carrera —
              sobre todo la ruta de 8 módulos y las herramientas de acompañamiento. Guardamos tu
              correo para no perder el avance; pagas y vuelves aquí.
            </p>
            <button type="button" className="btn-primary" onClick={openLockedFlow}>
              Continuar (guardar y desbloquear)
            </button>
            {idx < chosen.length - 1 && (
              <button type="button" className="btn-secondary" onClick={() => goTo(idx + 1)}>
                Saltar este paso por ahora
              </button>
            )}
          </section>
        )}

        {locked && gate === "save" && (
          <section className="bento-card space-y-3">
            <h2 className="font-semibold">Guarda tu avance</h2>
            <p className="text-sm muted">
              Sin fricción: solo nombre (opcional) y correo. Así puedes reclamar el plan después del
              pago y retomar este paso.
            </p>
            <VoiceInput
              label="Tu nombre (opcional)"
              value={saveName}
              onChange={setSaveName}
              placeholder="Ejemplo: María Gómez"
              dictationLabel="Dictar nombre"
            />
            <label className="block text-sm">
              Correo
              <input
                className="field mt-1"
                type="email"
                value={saveEmail}
                onChange={(e) => setSaveEmail(e.target.value)}
                placeholder="maria@correo.com"
              />
            </label>
            <button type="button" className="btn-primary" onClick={saveProgressProfile}>
              Guardar y seguir al pago
            </button>
            {saveMsg && <p className="text-sm muted">{saveMsg}</p>}
          </section>
        )}

        {locked && gate === "pay" && (
          <section className="bento-card space-y-3">
            <h2 className="font-semibold">Desbloquea Carrera</h2>
            <p className="text-sm muted">
              Un solo plan. Los cursos a tu medida se compran aparte si los necesitas. Al pagar te
              devolvemos a este paso del recorrido.
            </p>
            <Link href={payHref()} className="btn-primary">
              Ir a pagar Carrera
            </Link>
            <button type="button" className="btn-secondary" onClick={() => setGate("save")}>
              Cambiar correo
            </button>
          </section>
        )}

        {!locked && (
          <Link href={current.href} className="btn-primary">
            Hacer esto ahora
          </Link>
        )}

        {idx < chosen.length - 1 ? (
          <button type="button" className="btn-secondary" onClick={() => goTo(idx + 1)}>
            Siguiente del plan
          </button>
        ) : (
          <p className="text-sm muted text-center">
            Terminaste este recorrido. Puedes volver a elegir más.
          </p>
        )}

        {idx > 0 && (
          <button type="button" className="btn-secondary" onClick={() => goTo(idx - 1)}>
            Anterior
          </button>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setPhase("elegir");
            setGate("none");
          }}
        >
          Volver a la lista
        </button>
        <Link href="/" className="text-center text-sm muted">
          Inicio
        </Link>
      </div>
    );
  }

  const freeCount = freeGoals.filter((g) => selected[g.id]).length;
  const carreraCount = carreraGoals.filter((g) => selected[g.id]).length;

  function startStandardCarrera() {
    writeFocusPath("carrera");
    if (paid) {
      window.location.href = "/outplacement/cuadernillo";
      return;
    }
    selectCarreraPack();
    // Prefill and go to unlock path via outplacement hub (less checkbox maze)
    const ids = orderGoalsForWalk([...freeGoals, ...carreraGoals]).map((g) => g.id);
    writeGuidePlan(ids);
    writeGuideResume({ ids, idx: 0, phase: "recorrido" });
    window.location.href = "/outplacement";
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      {paid && <DailyCourseReminder />}
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Un paso a la vez</p>
            <h1 className="mt-1 text-2xl font-semibold">Empieza aquí</h1>
          </div>
          <SpeakButton text="Un solo botón para el flujo Carrera. Personalizar es opcional y para usuarios avanzados." />
        </div>
        <p className="text-sm muted leading-relaxed">
          Las mejores apps no te piden armar un menú: te dan un camino. Aquí el estándar es el
          cuadernillo con Continuar.
        </p>
        <button
          type="button"
          className="btn-primary"
          style={{ minHeight: "4rem", fontSize: "1.1rem" }}
          onClick={startStandardCarrera}
        >
          {paid ? "Continuar mi cuadernillo" : "Empezar flujo Carrera"}
        </button>
        {!paid ? (
          <p className="text-xs muted">
            Si estás probando: activa Tester/Carrera en{" "}
            <Link href="/cuenta" style={{ color: "var(--brand)" }}>
              Cuenta
            </Link>
            .
          </p>
        ) : null}
        <Link href="/ats" className="btn-secondary">
          Solo ATS gratis
        </Link>
      </section>

      <details className="bento-card space-y-3">
        <summary className="font-semibold text-sm cursor-pointer">
          Personalizar recorrido (avanzado)
        </summary>
        <p className="text-xs muted leading-relaxed">
          Solo si quieres mezclar piezas a mano. Si no, ignora esta sección.
        </p>

        <VoiceTextarea
          label="Dilo con tus palabras (opcional)"
          value={need}
          onChange={setNeed}
          className="field min-h-24"
          placeholder="Ej.: me echaron, necesito CV y practicar entrevistas…"
          dictationLabel="Dictar prioridad"
        />
        <button
          type="button"
          className="btn-secondary"
          onClick={applyVoice}
          disabled={need.trim().length < 6}
        >
          Marcar según esto
        </button>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={selectFree}>
            Solo lo gratis
          </button>
          <button type="button" className="btn-secondary" onClick={selectCarreraPack}>
            Gratis + Carrera
          </button>
          <button type="button" className="btn-secondary" onClick={() => setSelected({})}>
            Limpiar
          </button>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Gratis ({freeCount}/3)</h2>
          {freeGoals.map((g) => (
            <GoalRow
              key={g.id}
              g={g}
              checked={Boolean(selected[g.id])}
              onToggle={() => toggle(g.id)}
            />
          ))}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Plan Carrera ({carreraCount})</h2>
          <div className="bento-card space-y-1 text-xs muted">
            {CAREER_MODULE_PITCH.map((m) => (
              <p key={m.code}>
                <strong style={{ color: "var(--text)" }}>{m.short}</strong> — {m.value}
              </p>
            ))}
          </div>
          {carreraGoals.map((g) => (
            <GoalRow
              key={g.id}
              g={g}
              checked={Boolean(selected[g.id])}
              onToggle={() => toggle(g.id)}
            />
          ))}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Extras</h2>
          {extraGoals.map((g) => (
            <GoalRow
              key={g.id}
              g={g}
              checked={Boolean(selected[g.id])}
              onToggle={() => toggle(g.id)}
            />
          ))}
        </section>

        <button type="button" className="btn-primary" disabled={!chosen.length} onClick={startWalk}>
          Empezar recorrido personalizado ({chosen.length})
        </button>
      </details>

      <AdSlot slot="guia" />
      <Link href="/" className="text-center text-sm muted">
        Volver al inicio
      </Link>
    </div>
  );
}
