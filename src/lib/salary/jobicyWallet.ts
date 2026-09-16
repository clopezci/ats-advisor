import { createServiceSupabase } from "@/lib/supabase/client";
import { notifyOwnerTelegram } from "@/lib/notify/channels";

/** Costo Jobicy documentado (~USD por lookup con dato nuevo). */
export const JOBICY_DEFAULT_COST_USD = 0.109;
export const JOBICY_DEFAULT_FUNDED_USD = 10;
export const JOBICY_ALERT_THRESHOLD_USD = 5;
/** Reaviso Telegram mientras siga sin fondear (ms). */
const ALERT_RESEND_MS = 4 * 60 * 60 * 1000;

const CLOUD_KEY = "jobicy_wallet";

export type JobicyLookupEntry = {
  at: string;
  role: string;
  country: string;
  costUsd: number;
};

export type JobicyWalletState = {
  costPerLookupUsd: number;
  /** Suma de fondeos confirmados por el owner (“Ya fondeé”). */
  fundedTotalUsd: number;
  spentUsd: number;
  lookupCount: number;
  alertThresholdUsd: number;
  /**
   * true cuando el saldo ≤ umbral.
   * Solo pasa a false con “Ya fondeé” (aunque el cálculo mejore).
   */
  alertActive: boolean;
  lastAlertAt: string | null;
  lastFundedAt: string | null;
  lastFundAmountUsd: number;
  recentLookups: JobicyLookupEntry[];
  updatedAt: string;
};

export type JobicyWalletView = JobicyWalletState & {
  balanceUsd: number;
  remainingLookupsEst: number;
  needsFundAck: boolean;
  cloud: boolean;
};

type G = { __jobicyWallet?: JobicyWalletState };
const g = globalThis as unknown as G;

export function defaultJobicyWallet(): JobicyWalletState {
  return {
    costPerLookupUsd: JOBICY_DEFAULT_COST_USD,
    fundedTotalUsd: JOBICY_DEFAULT_FUNDED_USD,
    spentUsd: 0,
    lookupCount: 0,
    alertThresholdUsd: JOBICY_ALERT_THRESHOLD_USD,
    alertActive: false,
    lastAlertAt: null,
    lastFundedAt: null,
    lastFundAmountUsd: JOBICY_DEFAULT_FUNDED_USD,
    recentLookups: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalize(raw: Partial<JobicyWalletState> | null | undefined): JobicyWalletState {
  const d = defaultJobicyWallet();
  if (!raw || typeof raw !== "object") return d;
  return {
    costPerLookupUsd: num(raw.costPerLookupUsd, d.costPerLookupUsd),
    fundedTotalUsd: num(raw.fundedTotalUsd, d.fundedTotalUsd),
    spentUsd: num(raw.spentUsd, d.spentUsd),
    lookupCount: Math.max(0, Math.floor(num(raw.lookupCount, d.lookupCount))),
    alertThresholdUsd: num(raw.alertThresholdUsd, d.alertThresholdUsd),
    alertActive: Boolean(raw.alertActive),
    lastAlertAt: typeof raw.lastAlertAt === "string" ? raw.lastAlertAt : null,
    lastFundedAt: typeof raw.lastFundedAt === "string" ? raw.lastFundedAt : null,
    lastFundAmountUsd: num(raw.lastFundAmountUsd, d.lastFundAmountUsd),
    recentLookups: Array.isArray(raw.recentLookups)
      ? raw.recentLookups.slice(0, 40).map((e) => ({
          at: String(e.at || ""),
          role: String(e.role || "").slice(0, 80),
          country: String(e.country || "").slice(0, 60),
          costUsd: num(e.costUsd, d.costPerLookupUsd),
        }))
      : [],
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : d.updatedAt,
  };
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function balanceOf(w: JobicyWalletState): number {
  return Math.round((w.fundedTotalUsd - w.spentUsd) * 1000) / 1000;
}

export function toView(w: JobicyWalletState, cloud: boolean): JobicyWalletView {
  const balanceUsd = balanceOf(w);
  const cost = Math.max(0.001, w.costPerLookupUsd);
  return {
    ...w,
    balanceUsd,
    remainingLookupsEst: Math.max(0, Math.floor(balanceUsd / cost)),
    needsFundAck: w.alertActive,
    cloud,
  };
}

async function loadFromCloud(): Promise<{ state: JobicyWalletState; cloud: boolean }> {
  const sb = createServiceSupabase();
  if (!sb) {
    if (!g.__jobicyWallet) g.__jobicyWallet = defaultJobicyWallet();
    return { state: normalize(g.__jobicyWallet), cloud: false };
  }
  try {
    const { data } = await sb.from("app_settings").select("value").eq("key", CLOUD_KEY).maybeSingle();
    const state = normalize((data?.value as Partial<JobicyWalletState>) || undefined);
    g.__jobicyWallet = state;
    return { state, cloud: true };
  } catch {
    if (!g.__jobicyWallet) g.__jobicyWallet = defaultJobicyWallet();
    return { state: normalize(g.__jobicyWallet), cloud: false };
  }
}

async function saveState(state: JobicyWalletState): Promise<{ cloud: boolean }> {
  const next = { ...state, updatedAt: new Date().toISOString() };
  g.__jobicyWallet = next;
  const sb = createServiceSupabase();
  if (!sb) return { cloud: false };
  const { error } = await sb.from("app_settings").upsert({
    key: CLOUD_KEY,
    value: next,
    updated_at: next.updatedAt,
  });
  return { cloud: !error };
}

async function maybeNotifyLowBalance(w: JobicyWalletState, force: boolean): Promise<JobicyWalletState> {
  if (!w.alertActive) return w;
  const now = Date.now();
  const last = w.lastAlertAt ? Date.parse(w.lastAlertAt) : 0;
  if (!force && last && now - last < ALERT_RESEND_MS) return w;

  const bal = balanceOf(w);
  await notifyOwnerTelegram(
    `⚠ Jobicy wallet bajo: ~$${bal.toFixed(2)} USD (umbral $${w.alertThresholdUsd}).\n` +
      `Usos: ${w.lookupCount} · gastado ~$${w.spentUsd.toFixed(2)} · fondeado $${w.fundedTotalUsd.toFixed(2)}.\n` +
      `Fondea en Jobicy y en /admin pulsa «Ya fondeé» para silenciar esta alerta.`
  );
  return { ...w, lastAlertAt: new Date().toISOString() };
}

export async function getJobicyWallet(opts?: { notifyIfAlert?: boolean }): Promise<JobicyWalletView> {
  let { state, cloud } = await loadFromCloud();
  if (opts?.notifyIfAlert && state.alertActive) {
    state = await maybeNotifyLowBalance(state, false);
    const saved = await saveState(state);
    cloud = saved.cloud || cloud;
  }
  return toView(state, cloud);
}

/** Registra un lookup billable exitoso y activa alerta si saldo ≤ umbral. */
export async function recordJobicyLookup(opts: {
  role: string;
  country: string;
}): Promise<JobicyWalletView> {
  let { state, cloud } = await loadFromCloud();
  const cost = Math.max(0.001, state.costPerLookupUsd);
  const entry: JobicyLookupEntry = {
    at: new Date().toISOString(),
    role: opts.role.slice(0, 80),
    country: opts.country.slice(0, 60),
    costUsd: cost,
  };
  state = {
    ...state,
    spentUsd: Math.round((state.spentUsd + cost) * 1000) / 1000,
    lookupCount: state.lookupCount + 1,
    recentLookups: [entry, ...state.recentLookups].slice(0, 40),
  };

  const bal = balanceOf(state);
  const crossed = bal <= state.alertThresholdUsd;
  if (crossed) {
    const first = !state.alertActive;
    state = { ...state, alertActive: true };
    state = await maybeNotifyLowBalance(state, first);
  }

  const saved = await saveState(state);
  return toView(state, saved.cloud || cloud);
}

/** Owner confirma fondeo: suma monto, apaga alerta. */
export async function acknowledgeJobicyFund(amountUsd: number): Promise<JobicyWalletView> {
  const amount = Math.max(0.01, Math.round(amountUsd * 100) / 100);
  let { state, cloud } = await loadFromCloud();
  state = {
    ...state,
    fundedTotalUsd: Math.round((state.fundedTotalUsd + amount) * 1000) / 1000,
    lastFundAmountUsd: amount,
    lastFundedAt: new Date().toISOString(),
    alertActive: false,
    lastAlertAt: null,
  };
  const saved = await saveState(state);
  await notifyOwnerTelegram(
    `✓ Jobicy fondeo registrado: +$${amount.toFixed(2)} USD.\n` +
      `Saldo estimado ahora: ~$${balanceOf(state).toFixed(2)} · usos acumulados: ${state.lookupCount}.`
  );
  return toView(state, saved.cloud || cloud);
}

export async function updateJobicyWalletMeta(patch: {
  costPerLookupUsd?: number;
  alertThresholdUsd?: number;
  /** Reinicia contadores y deja funded = initialFundedUsd (default 10). */
  resetWithFundedUsd?: number;
}): Promise<JobicyWalletView> {
  let { state, cloud } = await loadFromCloud();
  if (typeof patch.costPerLookupUsd === "number" && patch.costPerLookupUsd > 0) {
    state = { ...state, costPerLookupUsd: patch.costPerLookupUsd };
  }
  if (typeof patch.alertThresholdUsd === "number" && patch.alertThresholdUsd >= 0) {
    state = { ...state, alertThresholdUsd: patch.alertThresholdUsd };
  }
  if (typeof patch.resetWithFundedUsd === "number" && patch.resetWithFundedUsd >= 0) {
    state = {
      ...defaultJobicyWallet(),
      fundedTotalUsd: patch.resetWithFundedUsd,
      lastFundAmountUsd: patch.resetWithFundedUsd,
      lastFundedAt: new Date().toISOString(),
      costPerLookupUsd: state.costPerLookupUsd,
      alertThresholdUsd: state.alertThresholdUsd,
    };
  }
  // Si tras editar umbral el saldo ya está bajo, activa alerta
  if (balanceOf(state) <= state.alertThresholdUsd) {
    state = { ...state, alertActive: true };
  }
  const saved = await saveState(state);
  return toView(state, saved.cloud || cloud);
}
