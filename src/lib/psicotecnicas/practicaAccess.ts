/** Add-on de práctica con IA de pago. No va dentro de Carrera: cada pregunta con foto tiene costo. */

export const PSICO_PRACTICA_PRICE_COP = 39000;
export const PSICO_PRACTICA_MONTHLY_CAP = 180;
export const PSICO_PRACTICA_COOKIE = "ats_psico_practica";
const LOCAL_KEY = "ats_psico_practica";

export function grantPsicoPractica(days = 31) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ until }));
  document.cookie = `${PSICO_PRACTICA_COOKIE}=${until}; path=/; max-age=${days * 24 * 60 * 60}; SameSite=Lax`;
  return until;
}

export function hasPsicoPracticaLocal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || "null") as { until?: number } | null;
    return Number(raw?.until) > Date.now();
  } catch {
    return false;
  }
}

export function psicoPracticaUntilFromCookie(cookieHeader: string): number {
  const m = cookieHeader.match(/(?:^|;\s*)ats_psico_practica=([^;]+)/);
  if (!m) return 0;
  const n = Number(decodeURIComponent(m[1]));
  return Number.isFinite(n) ? n : 0;
}

export function hasPsicoPracticaCookie(cookieHeader: string, now = Date.now()): boolean {
  return psicoPracticaUntilFromCookie(cookieHeader) > now;
}
