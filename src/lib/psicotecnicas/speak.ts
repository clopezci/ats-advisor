"use client";

/**
 * Lectura en voz alta (es-CO). Mute persistente.
 * Sin auto-bucles: cancel()/speak() agresivos congelan Chrome.
 */

const MUTE_KEY = "ats_psico_speak_muted_v1";
const MAX_CHARS = 800;
let speaking = false;
let lastSpeakAt = 0;
let lastSpeakHash = "";

export function isPsicoSpeakMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setPsicoSpeakMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (muted) stopSpeaking();
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speaking = false;
  lastSpeakHash = "";
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

export function speakText(
  text: string,
  opts?: { force?: boolean; onEnd?: () => void }
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  if (!opts?.force && isPsicoSpeakMuted()) return false;
  const clean = text.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
  if (!clean) return false;

  const now = Date.now();
  if (!opts?.force && (speaking || now - lastSpeakAt < 800)) return false;
  if (!opts?.force && clean === lastSpeakHash && now - lastSpeakAt < 4000) return false;

  lastSpeakAt = now;
  lastSpeakHash = clean;
  speaking = true;

  try {
    // Solo cancelar si realmente hay cola; cancel() en vacío también puede trabar.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  } catch {
    speaking = false;
    return false;
  }

  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = "es-CO";
  utter.rate = 0.95;
  utter.onend = () => {
    speaking = false;
    opts?.onEnd?.();
  };
  utter.onerror = () => {
    speaking = false;
  };
  try {
    window.speechSynthesis.speak(utter);
  } catch {
    speaking = false;
    return false;
  }
  return true;
}

export function fichaSpeakScript(f: {
  tema: string;
  titulo: string;
  regla: string;
  ejemplo: string;
}): string {
  // Solo título + regla (el ejemplo largo satura speechSynthesis en Chrome).
  return `${f.titulo}. ${f.regla}`;
}

export function ejercicioSpeakScript(e: {
  tema: string;
  enunciado: string;
  respuesta?: string;
  pasos?: string[];
  errorComun?: string;
  includeAnswer?: boolean;
}): string {
  let s = `${e.tema}. ${e.enunciado}`;
  if (e.includeAnswer && e.respuesta) s += ` Respuesta: ${e.respuesta}.`;
  return s;
}
