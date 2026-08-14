"use client";


import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { PaywallCard } from "@/components/PaywallCard";
import {
  canAccessOutplacement,
  readEntitlement,
  type PlanId,
} from "@/lib/entitlements";
import { DEEP_TRACKS, getDeepTrack } from "@/lib/outplacement/deepTracks";

function SegundaCarreraTool() {
  const [plan, setPlan] = useState<PlanId>("free");
  const [trackId, setTrackId] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const unlocked = canAccessOutplacement(plan);
  const deep = trackId ? getDeepTrack(trackId) : null;

  useEffect(() => {
    setPlan(readEntitlement().plan);
  }, []);

  async function generateAi() {
    if (!trackId || context.trim().length < 20) return;
    setLoading(true);
    setOutline("");
    try {
      const t = DEEP_TRACKS.find((x) => x.id === trackId);
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "general",
          useKnowledge: true,
          prompt: `Personaliza el plan de 14 días "${t?.title}" con este contexto: ${context}
Devuelve Día 1…14 con título + 2 acciones. Español LATAM.`,
        }),
      });
      const data = await res.json();
      setOutline(data.text || data.content || JSON.stringify(data));
    } catch {
      setOutline("No se pudo generar con IA. Usa la plantilla fija abajo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Segunda carrera</h1>
            <p className="text-sm muted">Tracks profundos 14 días + opcional IA.</p>
          </div>
          <SpeakButton text="Elige pivote, freelance o startup. Hay plantilla día a día y puedes personalizar con IA." />
        </div>
      </section>

      {!unlocked && (
        <PaywallCard
          currentPlan={plan}
          reason="Segunda carrera profunda está en el plan Carrera."
        />
      )}

      {unlocked && (
        <>
          <div className="flex flex-col gap-2">
            {DEEP_TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="btn-secondary text-left"
                style={trackId === t.id ? { borderColor: "var(--brand)" } : undefined}
                onClick={() => setTrackId(t.id)}
              >
                <span className="font-semibold">{t.title}</span>
                <span className="block text-xs muted">{t.summary}</span>
              </button>
            ))}
          </div>

          {deep && (
            <section className="bento-card space-y-3">
              <h2 className="font-semibold">Plantilla · {deep.title}</h2>
              <div className="max-h-80 space-y-2 overflow-y-auto text-sm">
                {deep.days.map((d) => (
                  <div key={d.day}>
                    <p className="font-medium">
                      Día {d.day}: {d.title}
                    </p>
                    <ul className="muted">
                      {d.actions.map((a) => (
                        <li key={a}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <VoiceTextarea
                label="Cuéntale tu situación (para personalizar)"
                value={context}
                onChange={setContext}
                className="field min-h-[80px]"
                placeholder="Ejemplo: 8 años en bancos, quiero vender servicios de Excel a pymes en Bogotá, tengo $2 millones para empezar."
                dictationLabel="Dictar situación"
              />
              <button
                type="button"
                className="btn-primary"
                disabled={loading || context.trim().length < 20}
                onClick={generateAi}
              >
                {loading ? "Generando…" : "Personalizar con IA"}
              </button>
              {outline && <pre className="whitespace-pre-wrap text-sm muted">{outline}</pre>}
              <Link href="/outplacement/experto" className="btn-secondary">
                Pedir mentor de emprendimiento
              </Link>
            </section>
          )}
        </>
      )}

      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}


export default function Page() {
  const course = toolCourseById("segunda-carrera");
  if (!course) return null;
  return (
    <CourseWithTool course={course}>
      <SegundaCarreraTool />
    </CourseWithTool>
  );
}
