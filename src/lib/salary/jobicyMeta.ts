import { createServiceSupabase } from "@/lib/supabase/client";
import { JOBICY_MARKETS } from "@/lib/salary/jobicyIntl";

const CLOUD_KEY = "jobicy_meta";

export type JobicyMetaStore = {
  syncedAt: string | null;
  countries: { name: string; code?: string }[];
  positions: string[];
  sourcePaths: string[];
  notes: string;
};

type G = { __jobicyMeta?: JobicyMetaStore };
const g = globalThis as unknown as G;

const META_CANDIDATES = [
  "https://jobicy.com/api/v2/salary/countries",
  "https://jobicy.com/api/v2/salary/positions",
  "https://jobicy.com/api/v2/salary/meta/countries",
  "https://jobicy.com/api/v2/salary/meta/positions",
  "https://jobicy.com/api/v2/salary/catalog/countries",
  "https://jobicy.com/api/v2/salary/catalog/positions",
];

function fallbackMeta(): JobicyMetaStore {
  return {
    syncedAt: null,
    countries: JOBICY_MARKETS.map((m) => ({ name: m.name, code: m.code })),
    positions: [],
    sourcePaths: [],
    notes: "Lista local de países (captura dashboard Jobicy). Positions vacías hasta sync con API key.",
  };
}

function extractList(data: unknown): string[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const o = item as Record<string, unknown>;
          return String(o.name || o.country || o.title || o.position || o.slug || o.code || "");
        }
        return "";
      })
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["countries", "positions", "data", "items", "results", "values"]) {
      const nested = extractList(o[k]);
      if (nested.length) return nested;
    }
  }
  return [];
}

async function loadMeta(): Promise<JobicyMetaStore> {
  const sb = createServiceSupabase();
  if (!sb) {
    if (!g.__jobicyMeta) g.__jobicyMeta = fallbackMeta();
    return g.__jobicyMeta;
  }
  try {
    const { data } = await sb.from("app_settings").select("value").eq("key", CLOUD_KEY).maybeSingle();
    if (data?.value && typeof data.value === "object") {
      const v = data.value as JobicyMetaStore;
      g.__jobicyMeta = {
        syncedAt: v.syncedAt || null,
        countries: Array.isArray(v.countries) && v.countries.length ? v.countries : fallbackMeta().countries,
        positions: Array.isArray(v.positions) ? v.positions : [],
        sourcePaths: Array.isArray(v.sourcePaths) ? v.sourcePaths : [],
        notes: String(v.notes || ""),
      };
      return g.__jobicyMeta;
    }
  } catch {
    /* ignore */
  }
  if (!g.__jobicyMeta) g.__jobicyMeta = fallbackMeta();
  return g.__jobicyMeta;
}

async function saveMeta(store: JobicyMetaStore) {
  g.__jobicyMeta = store;
  const sb = createServiceSupabase();
  if (!sb) return { cloud: false };
  const { error } = await sb.from("app_settings").upsert({
    key: CLOUD_KEY,
    value: store,
    updated_at: new Date().toISOString(),
  });
  return { cloud: !error };
}

export async function getJobicyMeta() {
  return loadMeta();
}

/**
 * Intenta bajar países/posiciones con la API key (paths documentados de forma genérica).
 * No cobra wallet: son endpoints de metadata, no salary lookup.
 */
export async function syncJobicyMeta(apiKey: string): Promise<{
  ok: boolean;
  meta: JobicyMetaStore;
  tried: { url: string; status: number }[];
  cloud: boolean;
}> {
  const tried: { url: string; status: number }[] = [];
  const countries: { name: string; code?: string }[] = [];
  const positions: string[] = [];
  const sourcePaths: string[] = [];

  for (const url of META_CANDIDATES) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
        cache: "no-store",
      });
      tried.push({ url, status: res.status });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      const list = extractList(json);
      if (!list.length) continue;
      sourcePaths.push(url);
      if (/country/i.test(url)) {
        for (const name of list) {
          if (!countries.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
            countries.push({ name });
          }
        }
      } else if (/position/i.test(url)) {
        for (const p of list) {
          if (!positions.includes(p)) positions.push(p);
        }
      } else {
        // genérico: si parece país corto, a countries; si no, positions
        for (const item of list) {
          if (item.length <= 40 && /^[A-Za-z .'-]+$/.test(item) && item.split(" ").length <= 4) {
            if (!countries.some((c) => c.name.toLowerCase() === item.toLowerCase())) {
              countries.push({ name: item });
            }
          } else if (!positions.includes(item)) {
            positions.push(item);
          }
        }
      }
    } catch {
      tried.push({ url, status: 0 });
    }
  }

  const base = fallbackMeta();
  const meta: JobicyMetaStore = {
    syncedAt: new Date().toISOString(),
    countries: countries.length ? countries : base.countries,
    positions,
    sourcePaths,
    notes: sourcePaths.length
      ? `Sync OK desde ${sourcePaths.length} endpoint(s).`
      : "No se pudo leer metadata Jobicy (paths 401/404/reset). Se mantiene lista local de países del dashboard. Revisa en su docs la URL exacta de countries/positions o pégala en JOBICY_META_COUNTRIES_URL / JOBICY_META_POSITIONS_URL.",
  };

  // Env overrides for exact URLs if Jobicy docs differ
  const extraCountryUrl = process.env.JOBICY_META_COUNTRIES_URL;
  const extraPosUrl = process.env.JOBICY_META_POSITIONS_URL;
  for (const [url, kind] of [
    [extraCountryUrl, "countries"],
    [extraPosUrl, "positions"],
  ] as const) {
    if (!url) continue;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
        cache: "no-store",
      });
      tried.push({ url, status: res.status });
      if (!res.ok) continue;
      const list = extractList(await res.json().catch(() => null));
      if (!list.length) continue;
      sourcePaths.push(url);
      if (kind === "countries") {
        meta.countries = list.map((name) => ({ name }));
      } else {
        meta.positions = list;
      }
      meta.notes = `Sync OK (env URL ${kind}).`;
    } catch {
      tried.push({ url, status: 0 });
    }
  }

  meta.sourcePaths = sourcePaths;
  const saved = await saveMeta(meta);
  return { ok: sourcePaths.length > 0 || meta.countries.length > 0, meta, tried, cloud: saved.cloud };
}
