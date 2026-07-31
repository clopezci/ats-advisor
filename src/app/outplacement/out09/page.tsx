"use client";

import { useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";
import { OUT09_QUESTIONS } from "@/lib/outplacement/modules";

type Skill = "soft" | "hard" | null;

export default function Out09Page() {
  const [step, setStep] = useState(1);
  const [skill, setSkill] = useState<Skill>(null);
  const [description, setDescription] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [course, setCourse] = useState<{
    title: string;
    objective: string;
    capsules: { day: number; title: string; content: string }[];
  } | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; usedPaid?: boolean; qualityScore?: number }>({});

  const placeholder =
    skill === "hard"
      ? "Ej.: Quiero dominar Power BI desde cero para reportes financieros…"
      : "Ej.: Quiero mejorar mi comunicación asertiva en reuniones con jefes difíciles…";

  const currentQ = OUT09_QUESTIONS[qIndex];

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/outplacement/out09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillType: skill, description, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setCourse(data.course);
      setMeta({ provider: data.provider, usedPaid: data.usedPaid, qualityScore: data.qualityScore });
      try {
        localStorage.setItem("out09_last", JSON.stringify(data.course));
      } catch {
        /* ignore */
      }
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs muted">OUT-09 · paso {step} de 5</p>
            <h1 className="text-xl font-semibold">Curso personalizado</h1>
          </div>
          <SpeakButton text="Elige si quieres reforzar una habilidad blanda o técnica, descríbela y responde un cuestionario corto para personalizar tu curso." />
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </section>

      {step === 1 && (
        <>
          <p className="text-sm muted">¿Qué tipo de habilidad quieres reforzar?</p>
          <button type="button" className="btn-primary" onClick={() => { setSkill("soft"); setStep(2); }}>
            Habilidad blanda (personal)
          </button>
          <button type="button" className="btn-secondary" onClick={() => { setSkill("hard"); setStep(2); }}>
            Habilidad técnica (dura)
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="bento-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">¿Qué quieres mejorar?</label>
              <DictationButton onResult={(t) => setDescription((p) => (p ? `${p} ${t}` : t))} />
            </div>
            <textarea
              className="field min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={placeholder}
            />
          </div>
          <button
            type="button"
            className="btn-primary"
            disabled={description.trim().length < 12}
            onClick={() => setStep(3)}
          >
            Continuar al cuestionario
          </button>
          <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
            Atrás
          </button>
        </>
      )}

      {step === 3 && currentQ && (
        <>
          <div className="bento-card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{currentQ.label}</p>
              <SpeakButton text={currentQ.label} />
            </div>
            {"options" in currentQ && currentQ.options ? (
              <div className="flex flex-col gap-2">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [currentQ.id]: opt }));
                      if (qIndex < OUT09_QUESTIONS.length - 1) setQIndex((i) => i + 1);
                      else setStep(4);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <input
                    className="field"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [currentQ.id]: e.target.value }))}
                    placeholder="Escribe o dicta tu respuesta"
                  />
                  <DictationButton
                    onResult={(t) =>
                      setAnswers((a) => ({
                        ...a,
                        [currentQ.id]: a[currentQ.id] ? `${a[currentQ.id]} ${t}` : t,
                      }))
                    }
                  />
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!(answers[currentQ.id] || "").trim()}
                  onClick={() => {
                    if (qIndex < OUT09_QUESTIONS.length - 1) setQIndex((i) => i + 1);
                    else setStep(4);
                  }}
                >
                  Siguiente
                </button>
              </>
            )}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="bento-card text-sm muted space-y-2">
            <p>
              <strong>Tipo:</strong> {skill === "hard" ? "Técnica" : "Blanda"}
            </p>
            <p>
              <strong>Pedido:</strong> {description}
            </p>
            {Object.entries(answers).map(([k, v]) => (
              <p key={k}>
                <strong>{k}:</strong> {v}
              </p>
            ))}
          </div>
          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
          <button type="button" className="btn-primary" disabled={loading} onClick={generate}>
            {loading ? "Generando curso…" : "Generar mi curso"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
            Editar cuestionario
          </button>
        </>
      )}

      {step === 5 && course && (
        <>
          <section className="bento-card space-y-2">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-sm muted">{course.objective}</p>
            <p className="text-xs muted">
              Motor: {meta.provider || "n/d"} · calidad {Math.round((meta.qualityScore || 0) * 100)}%
              {meta.usedPaid ? " · escaló a IA de mayor capacidad" : " · IA free/local"}
            </p>
          </section>
          {course.capsules?.slice(0, 5).map((c) => (
            <div key={c.day} className="bento-card">
              <p className="pill-brand">Día {c.day}</p>
              <h3 className="mt-2 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm muted">{c.content}</p>
            </div>
          ))}
          <p className="text-xs muted text-center">
            Curso guardado en este dispositivo. Con Supabase quedará en tu cuenta.
          </p>
          <Link href="/outplacement/out09/player" className="btn-primary">
            Abrir reproductor de cápsulas
          </Link>
          <Link href="/outplacement" className="btn-secondary">
            Volver a outplacement
          </Link>
        </>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Cancelar
      </Link>
    </div>
  );
}
