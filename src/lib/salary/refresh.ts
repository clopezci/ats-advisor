import fs from "fs";
import path from "path";
import type { SalarySnapshot } from "./snapshot";
import { EMBEDDED_SNAPSHOT } from "./snapshot";
import { createServiceSupabase } from "@/lib/supabase/client";

const SNAPSHOT_REL = path.join("data", "salary", "matrix-snapshot.json");
const CLOUD_KEY = "salary_matrix";

export function snapshotPath(): string {
  return path.join(process.cwd(), SNAPSHOT_REL);
}

export function readSalarySnapshotFromDisk(): SalarySnapshot {
  try {
    const raw = fs.readFileSync(snapshotPath(), "utf8");
    const parsed = JSON.parse(raw) as SalarySnapshot;
    if (parsed?.cpiFactorFromSeed && parsed.asOf) return parsed;
  } catch {
    /* fallback */
  }
  return EMBEDDED_SNAPSHOT;
}

export async function readSalarySnapshot(): Promise<SalarySnapshot> {
  const sb = createServiceSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("app_settings").select("value").eq("key", CLOUD_KEY).maybeSingle();
      if (data?.value && typeof data.value === "object") {
        const v = data.value as SalarySnapshot;
        if (v.cpiFactorFromSeed && v.asOf) return v;
      }
    } catch {
      /* fall through */
    }
  }
  return readSalarySnapshotFromDisk();
}

export function writeSalarySnapshotDisk(snap: SalarySnapshot) {
  const p = snapshotPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(snap, null, 2) + "\n", "utf8");
}

export async function persistSalarySnapshot(snap: SalarySnapshot): Promise<{ disk: boolean; cloud: boolean }> {
  let disk = false;
  let cloud = false;
  try {
    writeSalarySnapshotDisk(snap);
    disk = true;
  } catch {
    /* Vercel FS efímero */
  }
  const sb = createServiceSupabase();
  if (sb) {
    try {
      const { error } = await sb.from("app_settings").upsert({
        key: CLOUD_KEY,
        value: snap,
        updated_at: new Date().toISOString(),
      });
      cloud = !error;
    } catch {
      /* ignore */
    }
  }
  return { disk, cloud };
}

/**
 * Factor CPI mensual aproximado Colombia.
 * Env SALARY_MONTHLY_CPI_PCT (ej. 0.004 = 0.4%/mes). Default 0.35%/mes.
 */
export function monthlyCpiFactor(): number {
  const env = process.env.SALARY_MONTHLY_CPI_PCT;
  if (env && !Number.isNaN(Number(env))) {
    return 1 + Number(env);
  }
  return 1.0035;
}

export type ExternalSalaryFeed = {
  asOf?: string;
  cpiFactorFromSeed?: number;
  monthlyCpiPct?: number;
  notes?: string;
  sources?: { name: string; detail: string }[];
};

export async function fetchExternalSalaryFeed(): Promise<ExternalSalaryFeed | null> {
  const url = process.env.SALARY_FEED_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ExternalSalaryFeed;
  } catch {
    return null;
  }
}

export async function refreshSalarySnapshot(): Promise<{
  snapshot: SalarySnapshot;
  persisted: { disk: boolean; cloud: boolean };
  feedUsed: boolean;
}> {
  const current = await readSalarySnapshot();
  const feed = await fetchExternalSalaryFeed();
  const factor = feed?.monthlyCpiPct != null ? 1 + feed.monthlyCpiPct : monthlyCpiFactor();

  const next: SalarySnapshot = {
    ...current,
    asOf: feed?.asOf || new Date().toISOString().slice(0, 10),
    cpiFactorFromSeed: Number(
      (feed?.cpiFactorFromSeed ?? current.cpiFactorFromSeed * factor).toFixed(6)
    ),
    version: (current.version || 1) + 1,
    method: current.method,
    currency: "COP",
    sources: feed?.sources?.length
      ? [...(current.sources || []), ...feed.sources]
      : current.sources,
    notes: feed?.notes
      ? `Feed externo aplicado. ${feed.notes}`
      : `Ajuste mensual ×${factor.toFixed(4)}. Sin SALARY_FEED_URL: CPI proxy. Para bandas de un proveedor real, configura SALARY_FEED_URL con JSON { asOf, cpiFactorFromSeed?, monthlyCpiPct?, sources? }.`,
  };

  const persisted = await persistSalarySnapshot(next);
  return { snapshot: next, persisted, feedUsed: Boolean(feed) };
}
