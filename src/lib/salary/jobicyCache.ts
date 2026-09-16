import { createServiceSupabase } from "@/lib/supabase/client";
import type { PremiumSalaryResult } from "@/lib/salary/premiumTypes";

/** Jobicy: mismo title+country sin cambio = $0 por 30 días. */
export const JOBICY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CLOUD_KEY = "jobicy_salary_cache";
const MAX_ENTRIES = 200;

export type JobicyCacheEntry = {
  key: string;
  fetchedAt: string;
  expiresAt: string;
  result: PremiumSalaryResult;
};

type CacheStore = { entries: Record<string, JobicyCacheEntry>; updatedAt: string };

type G = { __jobicySalaryCache?: CacheStore };
const g = globalThis as unknown as G;

export function normalizeJobicyCacheKey(title: string, country: string): string {
  const t = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 +&/-]/g, "")
    .slice(0, 80);
  const c = country.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 60);
  return `${t}::${c}`;
}

function emptyStore(): CacheStore {
  return { entries: {}, updatedAt: new Date().toISOString() };
}

async function loadStore(): Promise<{ store: CacheStore; cloud: boolean }> {
  const sb = createServiceSupabase();
  if (!sb) {
    if (!g.__jobicySalaryCache) g.__jobicySalaryCache = emptyStore();
    return { store: g.__jobicySalaryCache, cloud: false };
  }
  try {
    const { data } = await sb.from("app_settings").select("value").eq("key", CLOUD_KEY).maybeSingle();
    const raw = data?.value as CacheStore | undefined;
    const store: CacheStore =
      raw && typeof raw === "object" && raw.entries && typeof raw.entries === "object"
        ? { entries: raw.entries, updatedAt: String(raw.updatedAt || new Date().toISOString()) }
        : emptyStore();
    g.__jobicySalaryCache = store;
    return { store, cloud: true };
  } catch {
    if (!g.__jobicySalaryCache) g.__jobicySalaryCache = emptyStore();
    return { store: g.__jobicySalaryCache, cloud: false };
  }
}

function prune(store: CacheStore): CacheStore {
  const now = Date.now();
  const entries: Record<string, JobicyCacheEntry> = {};
  for (const [k, v] of Object.entries(store.entries || {})) {
    if (!v?.expiresAt) continue;
    if (Date.parse(v.expiresAt) > now) entries[k] = v;
  }
  const keys = Object.keys(entries);
  if (keys.length > MAX_ENTRIES) {
    keys
      .sort((a, b) => Date.parse(entries[a].fetchedAt) - Date.parse(entries[b].fetchedAt))
      .slice(0, keys.length - MAX_ENTRIES)
      .forEach((k) => delete entries[k]);
  }
  return { entries, updatedAt: new Date().toISOString() };
}

async function saveStore(store: CacheStore): Promise<void> {
  const next = prune(store);
  g.__jobicySalaryCache = next;
  const sb = createServiceSupabase();
  if (!sb) return;
  await sb.from("app_settings").upsert({
    key: CLOUD_KEY,
    value: next,
    updated_at: next.updatedAt,
  });
}

export async function getJobicyCached(
  title: string,
  country: string
): Promise<PremiumSalaryResult | null> {
  const key = normalizeJobicyCacheKey(title, country);
  const { store } = await loadStore();
  const hit = store.entries[key];
  if (!hit) return null;
  if (Date.parse(hit.expiresAt) <= Date.now()) return null;
  return {
    ...hit.result,
    cached: true,
    billable: false,
    message:
      (hit.result.message || "") +
      " Respuesta en caché (mismo título+país < 30 días): Jobicy no cobra repeat unchanged ($0).",
  };
}

export async function setJobicyCached(
  title: string,
  country: string,
  result: PremiumSalaryResult
): Promise<void> {
  const key = normalizeJobicyCacheKey(title, country);
  const now = Date.now();
  const entry: JobicyCacheEntry = {
    key,
    fetchedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + JOBICY_CACHE_TTL_MS).toISOString(),
    result: {
      ...result,
      cached: false,
      billable: true,
    },
  };
  const { store } = await loadStore();
  store.entries[key] = entry;
  await saveStore(store);
}
