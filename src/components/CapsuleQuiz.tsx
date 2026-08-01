"use client";

import { useEffect, useState } from "react";

type Quiz = { question: string; options: string[]; answer: number };

type Props = {
  quiz: Quiz;
  onPassed?: () => void;
  requireCorrectToPass?: boolean;
};

export function CapsuleQuiz({ quiz, onPassed, requireCorrectToPass = true }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected !== null && selected === quiz.answer;

  useEffect(() => {
    setSelected(null);
    setChecked(false);
  }, [quiz.question]);

  useEffect(() => {
    if (checked && correct) onPassed?.();
  }, [checked, correct, onPassed]);

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{ background: "var(--brand-soft)" }}
      role="group"
      aria-labelledby="quiz-q"
    >
      <p id="quiz-q" className="text-sm font-medium">
        {quiz.question}
      </p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Opciones del quiz">
        {quiz.options.map((opt, idx) => {
          const isSel = selected === idx;
          let border: string | undefined;
          if (checked && idx === quiz.answer) border = "var(--success)";
          else if (checked && isSel && !correct) border = "var(--danger)";
          else if (isSel) border = "var(--brand)";
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={isSel}
              className="btn-secondary text-left"
              style={border ? { borderColor: border, boxShadow: "var(--shadow-brand)" } : undefined}
              onClick={() => {
                if (checked && correct && requireCorrectToPass) return;
                setSelected(idx);
                setChecked(false);
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={selected === null}
        onClick={() => setChecked(true)}
      >
        Comprobar
      </button>
      {checked && (
        <p className="text-sm" style={{ color: correct ? "var(--success)" : "var(--danger)" }} role="status">
          {correct ? "Correcto. Puedes continuar." : "Revisa la cápsula e inténtalo de nuevo."}
        </p>
      )}
    </div>
  );
}
