const KEY = "ats_free_usage";

type Usage = { day: string; count: number };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getAtsUsage(): Usage {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw?.day === today()) return raw;
  } catch {
    /* ignore */
  }
  return { day: today(), count: 0 };
}

export function canRunAts(limit = 5): { ok: boolean; remaining: number; used: number } {
  const u = getAtsUsage();
  return { ok: u.count < limit, remaining: Math.max(0, limit - u.count), used: u.count };
}

export function recordAtsRun() {
  const u = getAtsUsage();
  const next = { day: today(), count: u.count + 1 };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
