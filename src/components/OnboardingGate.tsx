import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { completeOnboarding, isOnboarded } from "@/lib/engagement/streak";

const STEPS = [
  {
    title: "Pasa el ATS",
    body: "Sube o pega tu CV, compara con una oferta y recibe un score accionable.",
    href: "/ats",
    cta: "Probar ATS",
  },
  {
    title: "Organiza tu búsqueda",
    body: "Guarda vacantes en el tracker y avanza por estados sin perder el hilo.",
    href: "/tracker",
    cta: "Abrir tracker",
  },
  {
    title: "Reconstruye tu carrera",
    body: "Outplacement guiado + OUT-09 personalizado, con voz y microcápsulas.",
    href: "/outplacement",
    cta: "Ver outplacement",
  },
];

export function OnboardingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = isOnboarded();
    setShow(!done);
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!show) return <>{children}</>;

  const current = STEPS[step];
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Bienvenida · {step + 1}/3</p>
            <h1 className="text-2xl font-semibold">{current.title}</h1>
          </div>
          <SpeakButton text={`${current.title}. ${current.body}`} />
        </div>
        <p className="text-sm muted">{current.body}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
      </section>

      <Link href={current.href} className="btn-primary" onClick={() => completeOnboarding()}>
        {current.cta}
      </Link>

      {step < STEPS.length - 1 ? (
        <button type="button" className="btn-secondary" onClick={() => setStep((s) => s + 1)}>
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            completeOnboarding();
            setShow(false);
          }}
        >
          Empezar ya
        </button>
      )}

      <button
        type="button"
        className="text-center text-sm muted"
        onClick={() => {
          completeOnboarding();
          setShow(false);
        }}
      >
        Saltar introducción
      </button>
    </div>
  );
}
