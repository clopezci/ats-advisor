/**
 * Práctica psicotécnica de pago (IA / explicaciones 5+).
 * Incluida en Carrera, Plus y Tester. También se puede comprar sola como add-on.
 */

export const PSICO_PRACTICA_PRICE_COP = 39000;
export const PSICO_PRACTICA_MONTHLY_CAP = 180;
export const PSICO_PRACTICA_COOKIE = "ats_psico_practica";
const LOCAL_KEY = "ats_psico_practica";
const ENTITLEMENT_KEY = "ats_entitlement";

/** Carrera / Plus / Tester incluyen práctica psicotécnica (no se paga aparte). */
export function planIncludesPsicoPractica(plan: string | null | undefined): boolean {
  const p = String(plan || "").toLowerCase();
  return p === "carrera" || p === "plus" || p === "tester";
}

export function grantPsicoPractica(days = 31) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ until }));
  document.cookie = `${PSICO_PRACTICA_COOKIE}=${until}; path=/; max-age=${days * 24 * 60 * 60}; SameSite=Lax`;
  return until;
}

/** Quita el add-on local (p. ej. grant demo viejo). */
export function revokePsicoPractica() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_KEY);
  document.cookie = `${PSICO_PRACTICA_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
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

/** Acceso a explicaciones/IA: add-on local O plan Carrera/Plus/Tester. */
export function hasPsicoPracticaAccess(plan?: string | null): boolean {
  if (hasPsicoPracticaLocal()) return true;
  if (plan != null && String(plan).length > 0) return planIncludesPsicoPractica(plan);
  if (typeof window === "undefined") return false;
  try {
    const raw = JSON.parse(localStorage.getItem(ENTITLEMENT_KEY) || "null") as { plan?: string } | null;
    return planIncludesPsicoPractica(raw?.plan);
  } catch {
    return false;
  }
}

/** Explicación en «Pruebas por tipo»: primeras `freeCount` gratis; el resto exige add-on o Carrera. */
export function canExplainTipoItem(itemIndex: number, hasPracticaAddOn: boolean, freeCount = 4): boolean {
  if (hasPracticaAddOn) return true;
  return itemIndex >= 0 && itemIndex < freeCount;
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

export function planFromCookieHeader(cookieHeader: string): string {
  const m = cookieHeader.match(/(?:^|;\s*)ats_plan=([^;]+)/);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]).toLowerCase();
  } catch {
    return "";
  }
}

/** Server: cookie de add-on o plan Carrera/Plus/Tester. */
export function hasPsicoPracticaFromRequest(cookieHeader: string, now = Date.now()): boolean {
  if (hasPsicoPracticaCookie(cookieHeader, now)) return true;
  return planIncludesPsicoPractica(planFromCookieHeader(cookieHeader));
}
