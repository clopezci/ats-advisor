"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CapsuleQuiz } from "@/components/CapsuleQuiz";
import { getProgress, saveProgress } from "@/lib/progress/courses";

type Capsule = {
  day: number;
  title: string;
  content: string;
  quiz?: { question: string; options: string[]; answer: number };
};

type Course = { title: string; objective: string; capsules: Capsule[] };

export default function Out09PlayerPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [day, setDay] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [quizPassed, setQuizPassed] = useState(true);

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("out09_last") || "null");
      setCourse(c);
      const p = getProgress("OUT-09");
      setDay(p.day || 0);
      setCompleted(p.completed || []);
    } catch {
      setCourse(null);
    }
  }, []);

  useEffect(() => {
    const capsule = course?.capsules?.[day];
    setQuizPassed(!capsule?.quiz);
  }, [course, day]);

  if (!course) {
    return (
      <div className="flex flex-col gap-4">
        <p className="muted">No hay un curso a tu medida guardado en este dispositivo.</p>
        <Link href="/outplacement/out09" className="btn-primary">
          Crear curso
        </Link>
      </div>
    );
  }

  const capsule = course.capsules?.[day];
  const total = course.capsules?.length || 1;
  const pct = (completed.length / total) * 100;
  const needsQuiz = Boolean(capsule?.quiz);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-xs muted">Curso a tu medida</p>
            <h1 className="text-xl font-semibold">{course.title}</h1>
          </div>
          <SpeakButton text={`${course.title}. ${capsule?.title}. ${capsule?.content || ""}`} />
        </div>
        <p className="text-sm muted">{course.objective}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {capsule && (
        <section className="bento-card space-y-3">
          <p className="pill-brand">Día {capsule.day || day + 1}</p>
          <h2 className="font-semibold">{capsule.title}</h2>
          <p className="text-sm muted">{capsule.content}</p>
          {capsule.quiz && (
            <CapsuleQuiz quiz={capsule.quiz} onPassed={() => setQuizPassed(true)} />
          )}
        </section>
      )}

      <button
        type="button"
        className="btn-primary"
        disabled={needsQuiz && !quizPassed}
        onClick={() => {
          if (needsQuiz && !quizPassed) return;
          const done = Array.from(new Set([...completed, day]));
          setCompleted(done);
          const next = Math.min(total - 1, day + 1);
          setDay(next);
          saveProgress("OUT-09", next, done);
        }}
      >
        {needsQuiz && !quizPassed ? "Responde el quiz para continuar" : "Completar y siguiente"}
      </button>
      <Link href="/outplacement/out09" className="btn-secondary">
        Generar otro curso
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
