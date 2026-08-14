"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CapsuleQuiz } from "@/components/CapsuleQuiz";
import type { CourseDef, CourseLesson } from "@/lib/courses/types";
import {
  courseStats,
  getLessonState,
  markLessonDone,
  nextOpenLesson,
  setLearningCursor,
  toggleTask,
  type LessonProgress,
} from "@/lib/courses/progress";

function LessonBody({
  course,
  lesson,
  state,
  onChange,
}: {
  course: CourseDef;
  lesson: CourseLesson;
  state: LessonProgress;
  onChange: (s: LessonProgress) => void;
}) {
  const [quizOk, setQuizOk] = useState(!lesson.quiz);

  useEffect(() => {
    setQuizOk(!lesson.quiz);
    setLearningCursor({ courseId: course.id, lessonId: lesson.id, updatedAt: Date.now() });
  }, [course.id, lesson.id, lesson.quiz]);

  return (
    <div className="space-y-4">
      <section className="bento-card space-y-2">
        <div className="flex justify-between gap-2">
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          <SpeakButton
            text={`${lesson.title}. ${lesson.why}. ${lesson.howTo.join(". ")}`}
          />
        </div>
        <p className="text-sm muted">{lesson.teaser}</p>
      </section>

      <section className="bento-card space-y-2">
        <h3 className="font-semibold text-sm">Por qué importa</h3>
        <p className="text-sm leading-relaxed">{lesson.why}</p>
      </section>

      <section className="bento-card space-y-2">
        <h3 className="font-semibold text-sm">Cómo hacerlo</h3>
        <ol className="list-decimal pl-4 space-y-2 text-sm leading-relaxed">
          {lesson.howTo.map((step) => (
            <li key={step.slice(0, 48)}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="bento-card space-y-2">
        <h3 className="font-semibold text-sm">Tips</h3>
        <ul className="space-y-1 text-sm muted">
          {lesson.tips.map((t) => (
            <li key={t.slice(0, 40)}>• {t}</li>
          ))}
        </ul>
      </section>

      <section className="bento-card space-y-2">
        <h3 className="font-semibold text-sm">Ejemplo</h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{lesson.example}</p>
      </section>

      <section className="bento-card space-y-2">
        <h3 className="font-semibold text-sm">Plantilla (cópiala)</h3>
        <pre className="text-xs muted whitespace-pre-wrap font-sans leading-relaxed">{lesson.template}</pre>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigator.clipboard?.writeText(lesson.template)}
        >
          Copiar plantilla
        </button>
      </section>

      <section className="bento-card space-y-3">
        <h3 className="font-semibold text-sm">Tareas de esta lección</h3>
        {lesson.tasks.map((t) => (
          <label key={t.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={Boolean(state.tasks[t.id])}
              onChange={() => onChange(toggleTask(course.id, lesson.id, t.id, lesson))}
            />
            <span>
              {t.label}
              {t.minutes ? <span className="muted"> · ~{t.minutes} min</span> : null}
            </span>
          </label>
        ))}
      </section>

      {lesson.quiz && (
        <section className="bento-card space-y-2">
          <h3 className="font-semibold text-sm">Autochequeo</h3>
          <CapsuleQuiz quiz={lesson.quiz} onPassed={() => setQuizOk(true)} />
        </section>
      )}

      <button
        type="button"
        className="btn-primary"
        disabled={Boolean(lesson.quiz) && !quizOk}
        onClick={() => {
          markLessonDone(course.id, lesson.id, true);
          onChange(getLessonState(course.id, lesson.id));
        }}
      >
        {state.lessonDone ? "✓ Lección completada" : "Marcar lección como vista / hecha"}
      </button>
    </div>
  );
}

/** Índice (solo títulos) + lección abierta + barra de avance. */
export function CoursePlayer({
  course,
  backHref = "/outplacement/tablero",
}: {
  course: CourseDef;
  backHref?: string;
}) {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const stats = useMemo(() => courseStats(course), [course, tick]);
  const lesson = course.lessons.find((l) => l.id === lessonId) || null;
  const [state, setState] = useState(() =>
    lesson ? getLessonState(course.id, lesson.id) : { tasks: {}, lessonDone: false, updatedAt: 0 }
  );

  useEffect(() => {
    if (!lessonId) {
      const n = nextOpenLesson(course);
      // stay on outline by default
      if (n) setLearningCursor({ courseId: course.id, lessonId: n.id, updatedAt: Date.now() });
    }
  }, [course, lessonId]);

  useEffect(() => {
    if (lesson) setState(getLessonState(course.id, lesson.id));
  }, [course.id, lesson]);

  if (lesson) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <button type="button" className="btn-secondary" onClick={() => setLessonId(null)}>
          ← Volver al índice del curso
        </button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${stats.pct}%` }} />
        </div>
        <p className="text-xs muted">
          Curso {stats.doneLessons}/{stats.totalLessons} lecciones · tareas {stats.doneTasks}/
          {stats.totalTasks}
        </p>
        <LessonBody
          course={course}
          lesson={lesson}
          state={state}
          onChange={(s) => {
            setState(s);
            setTick((x) => x + 1);
          }}
        />
        <div className="flex gap-2">
          {(() => {
            const i = course.lessons.findIndex((l) => l.id === lesson.id);
            const prev = course.lessons[i - 1];
            const next = course.lessons[i + 1];
            return (
              <>
                {prev && (
                  <button type="button" className="btn-secondary" onClick={() => setLessonId(prev.id)}>
                    Anterior
                  </button>
                )}
                {next && (
                  <button type="button" className="btn-primary" onClick={() => setLessonId(next.id)}>
                    Siguiente lección
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-xs muted">{course.short}</p>
            <h1 className="text-2xl font-semibold">{course.title}</h1>
          </div>
          <SpeakButton text={`${course.title}. ${course.summary}`} />
        </div>
        <p className="text-sm muted leading-relaxed">{course.summary}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${stats.pct}%` }} />
        </div>
        <p className="text-xs muted">
          Avance {stats.pct}% · {stats.doneLessons}/{stats.totalLessons} lecciones · {stats.doneTasks}/
          {stats.totalTasks} tareas
        </p>
      </section>

      <p className="text-sm font-medium">Lecciones (toca para abrir el curso completo)</p>
      <div className="space-y-2">
        {course.lessons.map((l, i) => {
          const st = getLessonState(course.id, l.id);
          return (
            <button
              key={l.id}
              type="button"
              className="bento-card w-full text-left space-y-1"
              onClick={() => setLessonId(l.id)}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">
                  {i + 1}. {l.title}
                </span>
                <span className="text-xs muted">{st.lessonDone ? "Hecha" : "Abrir →"}</span>
              </span>
              <span className="block text-xs muted">{l.teaser}</span>
            </button>
          );
        })}
      </div>

      <Link href={backHref} className="btn-secondary">
        Tablero de avance
      </Link>
    </div>
  );
}
