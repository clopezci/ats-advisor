"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

const RUBRIC = [
  { id: "s", label: "Situación clara en ≤20 s" },
  { id: "t", label: "Tarea / objetivo explícito" },
  { id: "a", label: "Acciones concretas (yo hice…)" },
  { id: "r", label: "Resultado medible o aprendizaje" },
  { id: "tono", label: "Tono seguro, sin muletillas excesivas" },
  { id: "largo", label: "Duración 60–120 s (ni telegrama ni novela)" },
];

export default function VideoEntrevistaPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [prompt, setPrompt] = useState(
    "Cuéntame de un logro reciente usando STAR (Situación, Tarea, Acción, Resultado)."
  );

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  async function start() {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      chunks.current = [];
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      };
      rec.start();
      setRecording(true);
    } catch {
      setErr("No pudimos acceder a cámara/micrófono. Revisa permisos del navegador.");
    }
  }

  function stop() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  const score = Math.round(
    (RUBRIC.filter((r) => checks[r.id]).length / RUBRIC.length) * 100
  );

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 2 · entrevista</p>
            <h1 className="mt-1 text-2xl font-semibold">Video mock STAR</h1>
          </div>
          <SpeakButton text="Graba una respuesta STAR, mírate y autoevalúa con la rúbrica. El video no se sube a ningún servidor." />
        </div>
        <p className="text-sm muted">Todo queda en tu dispositivo (privacidad).</p>
      </section>

      <section className="bento-card space-y-2">
        <label className="block text-sm">
          Pregunta
          <textarea
            className="field mt-1 min-h-[70px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <video ref={videoRef} className="w-full rounded-lg bg-black aspect-video" muted playsInline />
        <div className="flex gap-2">
          {!recording ? (
            <button type="button" className="btn-primary" onClick={start}>
              Grabar
            </button>
          ) : (
            <button type="button" className="btn-secondary" onClick={stop}>
              Detener
            </button>
          )}
        </div>
        {err && <p className="text-sm" style={{ color: "var(--danger)" }}>{err}</p>}
      </section>

      {blobUrl && (
        <section className="bento-card space-y-3">
          <h2 className="font-semibold">Playback</h2>
          <video ref={playbackRef} src={blobUrl} controls className="w-full rounded-lg aspect-video" />
          <h3 className="text-sm font-medium">Rúbrica (autoevaluación) · {score}%</h3>
          {RUBRIC.map((r) => (
            <label key={r.id} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(checks[r.id])}
                onChange={() => setChecks((c) => ({ ...c, [r.id]: !c[r.id] }))}
              />
              <span>{r.label}</span>
            </label>
          ))}
          <Link href="/outplacement/experto" className="btn-secondary">
            Pedir feedback a un experto humano
          </Link>
        </section>
      )}

      <Link href="/outplacement/entrevista" className="btn-secondary">
        Simulador texto STAR
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
