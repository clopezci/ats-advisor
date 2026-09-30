"use client";

import { useEffect, useState } from "react";
import {
  isPsicoSpeakMuted,
  setPsicoSpeakMuted,
  stopSpeaking,
} from "@/lib/psicotecnicas/speak";

/** Botón flotante para silenciar / reactivar el wizard hablado de aprendizaje. */
export function PsicoMuteFab({
  visible,
  onMuteChange,
}: {
  visible: boolean;
  onMuteChange?: (muted: boolean) => void;
}) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isPsicoSpeakMuted());
  }, []);

  if (!visible) return null;

  function toggle() {
    const next = !muted;
    setPsicoSpeakMuted(next);
    setMuted(next);
    if (next) stopSpeaking();
    onMuteChange?.(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed z-50 rounded-full shadow-lg px-4 py-3 text-sm font-medium"
      style={{
        right: "1rem",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        background: muted ? "var(--text)" : "var(--brand)",
        color: "#fff",
        boxShadow: "var(--shadow-brand)",
      }}
      aria-pressed={muted}
      aria-label={muted ? "Reactivar voz del wizard" : "Silenciar wizard hablado"}
      title={muted ? "Reactivar voz" : "Silenciar"}
    >
      {muted ? "Voz apagada · tocar para oír" : "Silenciar voz"}
    </button>
  );
}
