"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

type Alumni = {
  telegram_url: string;
  discord_url: string;
  ama_note: string;
  ama_next?: string;
  ama_topic?: string;
};

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni | null>(null);

  useEffect(() => {
    fetch("/api/alumni")
      .then((r) => r.json())
      .then((d) => setAlumni(d.alumni || null))
      .catch(() => setAlumni(null));
  }, []);

  const hasTelegram = Boolean(alumni?.telegram_url);
  const hasDiscord = Boolean(alumni?.discord_url);
  const hasAma = Boolean(alumni?.ama_next || alumni?.ama_topic);
  const intro =
    "Comunidad alumni ATSAdvisor: referidos, tips de mercado y AMA. Entra al canal y aporta con generosidad.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Comunidad</p>
            <h1 className="mt-1 text-2xl font-semibold">Alumni ATSAdvisor</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed">{intro}</p>
      </section>

      {hasAma ? (
        <section className="bento-card space-y-2" style={{ borderColor: "var(--brand)" }}>
          <p className="text-xs uppercase tracking-[0.12em] muted">Próximo AMA</p>
          {alumni?.ama_next ? <p className="text-sm font-medium">{alumni.ama_next}</p> : null}
          {alumni?.ama_topic ? <p className="text-sm muted">{alumni.ama_topic}</p> : null}
          <p className="text-xs muted">
            Preguntas concretas &gt; monólogos. Trae 1 duda de tu funnel o negociación.
          </p>
        </section>
      ) : null}

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Canales</h2>
        {hasTelegram ? (
          <a
            href={alumni!.telegram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Entrar a Telegram alumni
          </a>
        ) : (
          <p className="text-sm muted">
            El owner aún no configuró el enlace de Telegram en /admin → Alumni.
          </p>
        )}
        {hasDiscord ? (
          <a
            href={alumni!.discord_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Entrar a Discord
          </a>
        ) : (
          <p className="text-xs muted">Discord opcional — sin enlace configurado.</p>
        )}
      </section>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Notas de comunidad</h2>
        <p className="text-sm muted whitespace-pre-wrap">
          {alumni?.ama_note || "Próximamente: AMA mensual con alumni."}
        </p>
      </section>

      <section className="bento-card space-y-2 text-sm">
        <h2 className="font-semibold text-sm">Cómo aportar</h2>
        <ul className="list-disc space-y-1 pl-5 muted">
          <li>Comparte una vacante real (sin spam).</li>
          <li>Ofrece un café 20 min a alguien en transición.</li>
          <li>Si eres aliado coach, coordina con LOTIC el convenio y el corte de comisiones.</li>
        </ul>
      </section>

      <Link href="/outplacement/cuadernillo" className="btn-secondary">
        Volver al cuadernillo
      </Link>
      <Link href="/outplacement/marketplace" className="btn-secondary">
        Marketplace de coaches
      </Link>
      <Link href="/outplacement" className="text-center text-sm muted">
        Volver a outplacement
      </Link>
    </div>
  );
}
