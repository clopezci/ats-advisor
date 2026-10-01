"use client";

/**
 * Lectura en voz alta (es-CO) con mute persistente para el wizard de psicotécnicas.
 * Evita tormentas de cancel()/speak() que congelan Chrome.
 */

const MUTE_KEY = "ats_psico_speak_muted_v1";
const MAX_CHARS = 1200;
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
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  lastSpeakHash = "";
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
  // Misma frase o spam < 400ms: no cancelar/re-hablar (congela pestañas en Chrome).
  if (!opts?.force && clean === lastSpeakHash && now - lastSpeakAt < 2500) return false;
  if (!opts?.force && now - lastSpeakAt < 400) return false;

  lastSpeakAt = now;
  lastSpeakHash = clean;

  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }

  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = "es-CO";
  utter.rate = 0.95;
  if (opts?.onEnd) utter.onend = () => opts.onEnd?.();
  try {
    window.speechSynthesis.speak(utter);
  } catch {
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
  return `${f.titulo}. Tema: ${f.tema}. Regla: ${f.regla}. Ejemplo: ${f.ejemplo}`;
}

export function ejercicioSpeakScript(e: {
  tema: string;
  enunciado: string;
  respuesta?: string;
  pasos?: string[];
  errorComun?: string;
  includeAnswer?: boolean;
}): string {
  let s = `Prueba. ${e.tema}. Enunciado: ${e.enunciado}`;
  if (e.includeAnswer) {
    if (e.respuesta) s += ` Respuesta: ${e.respuesta}.`;
    if (e.pasos?.length) s += ` Pasos: ${e.pasos.slice(0, 4).join(". ")}.`;
    if (e.errorComun) s += ` Error común: ${e.errorComun}.`;
  } else {
    s += " Piensa tu respuesta y luego verifica.";
  }
  return s;
}
