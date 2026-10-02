"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useJsonDraft } from "@/lib/client/useJsonDraft";
import { SpeakButton } from "@/components/SpeakButton";
import {
  answersMatch,
  loadTrialDone,
  materiaNombre,
  PSICO_BANK_COUNTS,
  PSICO_MATERIAS,
  PSICO_PREVIEW_FICHAS,
  saveTrialDone,
  trialExercises,
  type PsicoEjercicio,
  type PsicoFicha,
} from "@/lib/psicotecnicas";
import { AbstractFigure } from "@/components/psicotecnicas/AbstractFigures";
import { ejercicioSpeakScript, fichaSpeakScript, stopSpeaking } from "@/lib/psicotecnicas/speak";
import { writeFocusPath } from "@/lib/engagement/focusPath";

type Mode = "fichas" | "pruebas";

const INTRO =
  "Estudia gratis: fichas de método y banco de pruebas. Usa el ícono de audio para escuchar una ficha cuando quieras. Lo de pago es practicar con el método IA.";

export function PsicoClient() {
  const [mode, setMode] = useState<Mode>("fichas");
  const [done, setDone] = useState<number[]>([]);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [materia, setMateria] = useState(PSICO_MATERIAS[0]?.id || "");
  const [fichaI, setFichaI] = useState(0);
  const [bancoI, setBancoI] = useState(0);
  const [bankFichas, setBankFichas] = useState<PsicoFicha[] | null>(null);
  const [bankEjercicios, setBankEjercicios] = useState<PsicoEjercicio[] | null>(null);
  const [bankMsg, setBankMsg] = useState("");
  const [publicFichas, setPublicFichas] = useState<PsicoFicha[] | null>(null);

  useJsonDraft(
    "ats_psico_draft",
    { answer, revealed, materia, mode },
    (saved) => {
      if (typeof saved.answer === "string" && saved.answer) setAnswer(saved.answer);
      if (saved.revealed === true) setRevealed(true);
      if (typeof saved.materia === "string" && saved.materia) setMateria(saved.materia);
      if (saved.mode === "fichas" || saved.mode === "pruebas") setMode(saved.mode);
    }
  );

  const trial = useMemo(() => trialExercises(), []);

  useEffect(() => {
    writeFocusPath("gratis");
    setDone(loadTrialDone());
    // Un solo fetch (bank incluye fichas). Evita parsear el catálogo dos veces.
    fetch("/api/psicotecnicas/bank")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setBankMsg(data.error || "No se pudo abrir el banco.");
          return;
        }
        setBankFichas(data.fichas || []);
        setBankEjercicios(data.ejercicios || []);
        setPublicFichas(data.fichas || []);
      })
      .catch(() => setBankMsg("No se pudo abrir el banco."));
    return () => stopSpeaking();
  }, []);

  const fichas = useMemo(
    () => (bankFichas || publicFichas || PSICO_PREVIEW_FICHAS).filter((f) => f.subjectId === materia),
    [bankFichas, publicFichas, materia]
  );
  const ejercicios = useMemo(
    () => bankEjercicios || trial.map((t) => t.item),
    [bankEjercicios, trial]
  );
  const banco = useMemo(
    () =>
      ejercicios
        .map((item, index) => ({ item, index }))
        .filter((x) => x.item.materia === materia),
    [ejercicios, materia]
  );
  const ficha = fichas[Math.min(fichaI, Math.max(0, fichas.length - 1))];
  const bancoItem = banco[Math.min(bancoI, Math.max(0, banco.length - 1))];

  function markDone(index: number) {
    if (!done.includes(index)) setDone(saveTrialDone([...done, index]));
  }

  return (
    <div className="flex flex-1 flex-col gap-5 pb-20">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Ruta gratis · psicotécnicas</p>
            <h1 className="text-2xl font-semibold">Estudiar y practicar</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          {bankFichas
            ? `${bankFichas.length} fichas · ${bankEjercicios?.length || PSICO_BANK_COUNTS.ejercicios} pruebas · todo gratis para estudiar`
            : bankMsg || "Cargando material…"}
        </p>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={mode === "fichas" ? "btn-primary" : "btn-secondary"}
          onClick={() => setMode("fichas")}
        >
          1. Leer fichas (método)
        </button>
        <button
          type="button"
          className={mode === "pruebas" ? "btn-primary" : "btn-secondary"}
          onClick={() => {
            setMode("pruebas");
            setAnswer("");
            setRevealed(false);
          }}
        >
          2. Hacer pruebas
        </button>
      </div>

      <Link
        href="/outplacement/psicotecnicas/practica"
        className="btn-secondary w-full text-center"
        style={{ flexDirection: "column", gap: "0.15rem", minHeight: "3.5rem", lineHeight: 1.3 }}
      >
        <span>Practicar con método IA (de pago)</span>
        <span className="text-xs font-normal muted">Perfil · foto · pistas personalizadas</span>
      </Link>

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
      </section>

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
            style={
              materia === m.id
                ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                : undefined
            }
          >
            {m.corto}
          </button>
        ))}
      </div>

      {mode === "fichas" && ficha && (
        <section className="bento-card space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs muted">{ficha.tema}</p>
              <h2 className="text-lg font-semibold">{ficha.titulo}</h2>
            </div>
            <SpeakButton text={fichaSpeakScript(ficha)} label="Escuchar ficha" />
          </div>
          {materia === "exa.psico-personalidad" && fichaI === 0 ? (
            <p className="text-xs muted leading-relaxed rounded-lg border border-black/10 bg-black/[0.02] p-3">
              Aquí estudias cómo son los test de empresas (atención, juicio situacional, Acciones/Actitudes, sinceridad).
              El assessment de intereses RIASEC (tu código + roles) está aparte en{" "}
              <Link href="/outplacement/assessment" className="underline">
                /outplacement/assessment
              </Link>
              .
            </p>
          ) : null}
          <AbstractFigure id={ficha.figura} />
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{ficha.regla}</p>
          <p className="text-sm muted whitespace-pre-wrap leading-relaxed">{ficha.ejemplo}</p>
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
              disabled={fichaI >= fichas.length - 1}
              onClick={() => setFichaI((n) => Math.min(fichas.length - 1, n + 1))}
            >
              {`Siguiente (${fichaI + 1}/${fichas.length})`}
            </button>
          </div>
          <button type="button" className="btn-primary" onClick={() => setMode("pruebas")}>
            Pasar a hacer pruebas de{" "}
            {PSICO_MATERIAS.find((m) => m.id === materia)?.corto || "esta materia"}
          </button>
        </section>
      )}

      {mode === "fichas" && !ficha && (
        <p className="text-sm muted">No hay fichas para esta materia todavía.</p>
      )}

      {mode === "pruebas" && !bancoItem && (
        <p className="text-sm muted">{bankMsg || "Cargando pruebas…"}</p>
      )}

      {mode === "pruebas" && bancoItem && (
        <ExerciseCard
          nLabel={`${bancoI + 1} / ${banco.length} · ${bancoItem.item.tema}`}
          item={bancoItem.item}
          answer={answer}
          revealed={revealed}
          correct={revealed && answersMatch(answer, bancoItem.item.respuesta)}
          onAnswer={setAnswer}
          onSubmit={() => {
            setRevealed(true);
            markDone(bancoItem.index);
          }}
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

      <Link href="/" className="btn-secondary">
        Volver al inicio / Continuar ruta
      </Link>
      <Link href="/ats" className="btn-secondary">
        Siguiente típico: analizar mi CV
      </Link>
    </div>
  );
}

function ExerciseCard(props: {
  nLabel: string;
  item: PsicoEjercicio;
  answer: string;
  revealed: boolean;
  correct: boolean;
  onAnswer: (v: string) => void;
  onSubmit: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const { item } = props;
  const listenPrompt = ejercicioSpeakScript({
    tema: item.tema,
    enunciado: item.enunciado,
    includeAnswer: false,
  });
  const listenAnswer = ejercicioSpeakScript({
    tema: item.tema,
    enunciado: "Verificación.",
    respuesta: item.respuesta,
    pasos: item.pasos,
    errorComun: item.errorComun,
    includeAnswer: true,
  });

  return (
    <section className="bento-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs muted">
            {props.nLabel} · {materiaNombre(item.materia)}
          </p>
          <h2 className="font-semibold text-sm mt-1">{item.tema}</h2>
        </div>
        <SpeakButton
          text={props.revealed ? listenAnswer : listenPrompt}
          label={props.revealed ? "Escuchar solución" : "Escuchar enunciado"}
        />
      </div>
      <AbstractFigure id={item.figura} />
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{item.enunciado}</p>
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
        <button
          type="button"
          className="btn-primary"
          onClick={props.onSubmit}
          disabled={!props.answer.trim()}
        >
          Ver si cuadra
        </button>
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
              Siguiente prueba
            </button>
          )}
        </div>
      )}
    </section>
  );
}
