"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { PaywallCard } from "@/components/PaywallCard";
import { canAccessOutplacement, readEntitlement, type PlanId } from "@/lib/entitlements";
import {
  answersMatch,
  loadTrialDone,
  materiaNombre,
  PSICO_BANK_COUNTS,
  PSICO_FREE_TRIAL,
  PSICO_MATERIAS,
  PSICO_PREVIEW_FICHAS,
  saveTrialDone,
  trialExercises,
  type PsicoEjercicio,
  type PsicoFicha,
} from "@/lib/psicotecnicas";

type Mode = "prueba" | "fichas" | "banco";

const INTRO =
  "Trucos de 60 segundos para pruebas de selección: numérico, abstracto y personalidad. Practica 3 gratis. El banco completo va con Carrera.";

export function PsicoClient() {
  const [plan, setPlan] = useState<PlanId>("free");
  const [mode, setMode] = useState<Mode>("prueba");
  const [done, setDone] = useState<number[]>([]);
  const [cursor, setCursor] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [materia, setMateria] = useState(PSICO_MATERIAS[0]?.id || "");
  const [fichaI, setFichaI] = useState(0);
  const [bancoI, setBancoI] = useState(0);
  const [bankFichas, setBankFichas] = useState<PsicoFicha[] | null>(null);
  const [bankEjercicios, setBankEjercicios] = useState<PsicoEjercicio[] | null>(null);
  const [bankMsg, setBankMsg] = useState("");

  const unlocked = canAccessOutplacement(plan);
  const trial = useMemo(() => trialExercises(), []);
  const trialUsed = trial.filter((t) => done.includes(t.index)).length;
  const trialLeft = Math.max(0, PSICO_FREE_TRIAL - trialUsed);
  const trialLocked = !unlocked && trialUsed >= PSICO_FREE_TRIAL;

  useEffect(() => {
    setPlan(readEntitlement().plan);
    setDone(loadTrialDone());
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    let cancel = false;
    fetch("/api/psicotecnicas/bank")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancel) return;
        if (!res.ok) {
          setBankMsg(data.error || "No se pudo abrir el banco.");
          return;
        }
        setBankFichas(data.fichas || []);
        setBankEjercicios(data.ejercicios || []);
      })
      .catch(() => {
        if (!cancel) setBankMsg("No se pudo abrir el banco.");
      });
    return () => {
      cancel = true;
    };
  }, [unlocked]);

  useEffect(() => {
    if (mode !== "prueba" || revealed) return;
    setSeconds(60);
    const id = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode, cursor, revealed]);

  const currentTrial = trial[Math.min(cursor, Math.max(0, trial.length - 1))];

  function openTrial(i: number) {
    setCursor(i);
    setAnswer("");
    setRevealed(false);
    setMode("prueba");
  }

  function submitTrial() {
    if (!currentTrial || revealed) return;
    if (trialLocked && !done.includes(currentTrial.index)) return;
    setRevealed(true);
    if (!done.includes(currentTrial.index)) {
      setDone(saveTrialDone([...done, currentTrial.index]));
    }
  }

  const fichas = (unlocked && bankFichas ? bankFichas : PSICO_PREVIEW_FICHAS).filter(
    (f) => f.subjectId === materia
  );
  const ejercicios = unlocked && bankEjercicios ? bankEjercicios : [];
  const banco = ejercicios.map((item, index) => ({ item, index })).filter((x) => x.item.materia === materia);
  const ficha = fichas[Math.min(fichaI, Math.max(0, fichas.length - 1))];
  const bancoItem = banco[Math.min(bancoI, Math.max(0, banco.length - 1))];

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Carrera · psicotécnicas</p>
            <h1 className="text-2xl font-semibold">Pruebas psicotécnicas</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          {unlocked
            ? `Plan con acceso completo · ${bankFichas?.length || PSICO_BANK_COUNTS.fichas} fichas · ${bankEjercicios?.length || PSICO_BANK_COUNTS.ejercicios} ejercicios.`
            : `Pruebas gratis: ${trialUsed}/${PSICO_FREE_TRIAL}. Te quedan ${trialLeft}.`}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => setMode("prueba")}>
            Prueba (60 s)
          </button>
          <button type="button" className="btn-secondary" onClick={() => setMode("fichas")}>
            Fichas
          </button>
          <button type="button" className="btn-secondary" onClick={() => setMode("banco")}>
            Banco
          </button>
        </div>
      </section>

      <section className="bento-card space-y-2 text-sm leading-relaxed">
        <h2 className="font-semibold text-sm">El método (7 reglas)</h2>
        <ol className="list-decimal pl-4 space-y-1 muted">
          <li>Trabaja desde las opciones hacia atrás, no desde la ecuación.</li>
          <li>Descarta antes de calcular: una pista tumba tres opciones.</li>
          <li>Compara en torneo: dos contra dos, no todas contra todas.</li>
          <li>Cada familia tiene una receta de tres pasos.</li>
          <li>Una palabra del enunciado decide la fórmula (cruzan vs alcanzan).</li>
          <li>Si se puede dibujar, dibújalo y cuenta.</li>
          <li>Comprueba hacia atrás en cinco segundos.</li>
        </ol>
        <p className="text-xs muted">
          No copiamos cuadernillos reales. Enunciados propios, mismo formato de selección.
        </p>
      </section>

      {mode === "prueba" && currentTrial && (
        <ExerciseCard
          nLabel={`Prueba ${cursor + 1} de ${trial.length}`}
          item={currentTrial.item}
          seconds={seconds}
          answer={answer}
          revealed={revealed}
          correct={revealed && answersMatch(answer, currentTrial.item.respuesta)}
          onAnswer={setAnswer}
          onSubmit={submitTrial}
          locked={trialLocked && !done.includes(currentTrial.index)}
        />
      )}

      {mode === "prueba" && (
        <div className="flex flex-wrap gap-2">
          {trial.map((t, i) => (
            <button key={t.index} type="button" className="btn-secondary" onClick={() => openTrial(i)}>
              {i + 1}. {materiaNombre(t.item.materia)}
              {done.includes(t.index) ? " ✓" : ""}
            </button>
          ))}
        </div>
      )}

      {(mode === "fichas" || mode === "banco") && (
        <div className="flex flex-wrap gap-2">
          {PSICO_MATERIAS.map((m) => (
            <button
              key={m.id}
              type="button"
              className="btn-secondary"
              onClick={() => {
                setMateria(m.id);
                setFichaI(0);
                setBancoI(0);
                setRevealed(false);
                setAnswer("");
              }}
            >
              {m.corto}
            </button>
          ))}
        </div>
      )}

      {mode === "fichas" && ficha && (unlocked || fichaI < 1) && (
        <section className="bento-card space-y-2">
          <p className="text-xs muted">{ficha.tema}</p>
          <h2 className="text-lg font-semibold">{ficha.titulo}</h2>
          <p className="text-sm">{ficha.regla}</p>
          <p className="text-sm muted">{ficha.ejemplo}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary"
              disabled={fichaI <= 0}
              onClick={() => setFichaI((n) => Math.max(0, n - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={fichaI >= fichas.length - 1 || (!unlocked && fichaI >= 0)}
              onClick={() => setFichaI((n) => Math.min(fichas.length - 1, n + 1))}
            >
              {unlocked ? `Siguiente (${fichaI + 1}/${fichas.length})` : "Siguiente (Carrera)"}
            </button>
          </div>
          {!unlocked && (
            <p className="text-xs muted">En gratis ves 1 ficha por materia. El resto abre con Carrera.</p>
          )}
        </section>
      )}

      {mode === "banco" && unlocked && !bankEjercicios && (
        <p className="text-sm muted">{bankMsg || "Cargando banco…"}</p>
      )}

      {mode === "banco" && bancoItem && unlocked && bankEjercicios && (
          <ExerciseCard
            nLabel={`${bancoI + 1} / ${banco.length} · ${bancoItem.item.tema}`}
            item={bancoItem.item}
            seconds={null}
            answer={answer}
            revealed={revealed}
            correct={revealed && answersMatch(answer, bancoItem.item.respuesta)}
            onAnswer={setAnswer}
            onSubmit={() => setRevealed(true)}
            locked={false}
            onNext={() => {
              setBancoI((n) => Math.min(banco.length - 1, n + 1));
              setAnswer("");
              setRevealed(false);
            }}
            onPrev={() => {
              setBancoI((n) => Math.max(0, n - 1));
              setAnswer("");
              setRevealed(false);
            }}
          />
      )}

      {mode === "banco" && !unlocked && (
          <PaywallCard
            currentPlan={plan}
            nextHref="/outplacement/psicotecnicas"
            title="El banco completo es de Carrera"
            reason={`Ya puedes probar ${PSICO_FREE_TRIAL} ejercicios (uno de cada tipo). El banco (${PSICO_BANK_COUNTS.ejercicios}) y las ${PSICO_BANK_COUNTS.fichas} fichas se desbloquean con el plan.`}
          />
      )}

      {trialLocked && mode === "prueba" && (
        <PaywallCard
          currentPlan={plan}
          nextHref="/outplacement/psicotecnicas"
          title="Usaste tus 3 pruebas gratis"
          reason="Sigue con fichas de 60 segundos y el banco de ejercicios en el plan Carrera. No inventamos preguntas de cuadernillos ajenos: es método + práctica propia."
        />
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver a Carrera
      </Link>
    </div>
  );
}

function ExerciseCard(props: {
  nLabel: string;
  item: PsicoEjercicio;
  seconds: number | null;
  answer: string;
  revealed: boolean;
  correct: boolean;
  locked: boolean;
  onAnswer: (v: string) => void;
  onSubmit: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const { item } = props;
  return (
    <section className="bento-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs muted">
            {props.nLabel} · {materiaNombre(item.materia)}
          </p>
          <h2 className="font-semibold text-sm mt-1">{item.tema}</h2>
        </div>
        {props.seconds != null && (
          <p className="text-sm font-semibold" style={{ color: props.seconds < 15 ? "#b45309" : "var(--brand)" }}>
            {props.seconds}s
          </p>
        )}
      </div>
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{item.enunciado}</p>
      {props.locked ? (
        <p className="text-sm">Esta prueba ya no está en el cupo gratis.</p>
      ) : (
        <>
          <label className="block text-sm">
            Tu respuesta
            <input
              className="field mt-1"
              value={props.answer}
              onChange={(e) => props.onAnswer(e.target.value)}
              placeholder="Número, letra o texto corto"
              disabled={props.revealed}
            />
          </label>
          {!props.revealed && (
            <button type="button" className="btn-primary" onClick={props.onSubmit} disabled={!props.answer.trim()}>
              Ver si cuadra
            </button>
          )}
        </>
      )}
      {props.revealed && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">{props.correct ? "Cuadra." : "No cuadra. Mira el atajo."}</p>
          <p>
            Respuesta: <strong>{item.respuesta}</strong>
          </p>
          <ol className="list-decimal pl-4 space-y-1 muted">
            {item.pasos.map((p) => (
              <li key={p.slice(0, 40)}>{p}</li>
            ))}
          </ol>
          {item.errorComun && (
            <p className="text-xs leading-relaxed">
              <strong>Error de siempre: </strong>
              {item.errorComun}
            </p>
          )}
        </div>
      )}
      {(props.onPrev || props.onNext) && (
        <div className="flex gap-2">
          {props.onPrev && (
            <button type="button" className="btn-secondary" onClick={props.onPrev}>
              Anterior
            </button>
          )}
          {props.onNext && (
            <button type="button" className="btn-secondary" onClick={props.onNext}>
              Siguiente
            </button>
          )}
        </div>
      )}
    </section>
  );
}
