"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onResult: (text: string) => void;
  label?: string;
};

type Rec = {
  start: () => void;
  stop: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function DictationButton({ onResult, label = "Dictar" }: Props) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<Rec | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => Rec;
      webkitSpeechRecognition?: new () => Rec;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "es-CO";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (ev) => {
      const text = ev.results?.[0]?.[0]?.transcript || "";
      if (text) onResult(text);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, [onResult]);

  const toggle = () => {
    if (!recRef.current) {
      alert("Tu navegador no soporta dictado por voz. Usa Chrome/Edge en móvil o escritorio.");
      return;
    }
    if (listening) {
      recRef.current.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recRef.current.start();
  };

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={label}
      title={label}
      style={listening ? { outline: "2px solid var(--brand)" } : undefined}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z"
          fill="currentColor"
        />
        <path
          d="M19 11a7 7 0 01-14 0M12 18v3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
