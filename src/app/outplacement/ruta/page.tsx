"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { CapsuleQuiz } from "@/components/CapsuleQuiz";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";
import { getProgress, saveProgress } from "@/lib/progress/courses";

function RutaInner() {
  const params = useSearchParams();
  const initial = params.get("code") || "OUT-01";
  const [code, setCode] = useState(initial);
  const [day, setDay] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);

  const mod = useMemo(
    () => OUTPLACEMENT_MODULES.find((m) => m.code === code) || OUTPLACEMENT_MODULES[0],
    [code]
  );
  const capsule = mod.capsules[day];
  const progress = (completed.length / Math.max(1, mod.capsules.length)) * 100;
  const needsQuiz = Boolean(capsule?.quiz);

  useEffect(() => {
    const p = getProgress(code);
    setDay(p.day || 0);
    setCompleted(p.completed || []);
  }, [code]);

  useEffect(() => {
    setQuizPassed(!needsQuiz);
  }, [code, day, needsQuiz]);

  function goNext() {
    if (needsQuiz && !quizPassed) return;
    const done = Array.from(new Set([...completed, day]));
    setCompleted(done);
    const next = Math.min(mod.capsules.length - 1, day + 1);
    setDay(next);
    saveProgress(code, next, done);
  }

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
          Completadas {completed.length}/{mod.capsules.length} · cápsula actual {day + 1}
        </p>
      </section>

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
            {m.code}
          </button>
        ))}
      </div>

      {capsule && (
        <section className="bento-card space-y-3">
          <h2 className="text-lg font-semibold">{capsule.title}</h2>
          <p className="text-sm leading-relaxed muted">{capsule.content}</p>
          {capsule.quiz && (
            <CapsuleQuiz quiz={capsule.quiz} onPassed={() => setQuizPassed(true)} />
          )}
        </section>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={needsQuiz && !quizPassed}
          onClick={goNext}
        >
          {needsQuiz && !quizPassed ? "Responde el quiz para continuar" : "Marcar y siguiente"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={day <= 0}
          onClick={() => {
            const prev = Math.max(0, day - 1);
            setDay(prev);
            saveProgress(code, prev, completed);
          }}
        >
          Anterior
        </button>
        <Link href="/outplacement/90-dias" className="btn-secondary">
          Modo 90 días
        </Link>
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
