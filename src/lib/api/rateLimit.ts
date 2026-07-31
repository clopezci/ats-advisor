type Bucket = { count: number; resetAt: number };

const g = globalThis as unknown as { __atsRate?: Map<string, Bucket> };

function store() {
  if (!g.__atsRate) g.__atsRate = new Map();
  return g.__atsRate;
}

function clientKey(req: Request) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  return ip;
}

/**
 * In-memory rate limit (per serverless instance). Good enough for soft abuse control without Redis.
 */
export function rateLimit(
  req: Request,
  route: string,
  opts: { limit: number; windowMs: number } = { limit: 30, windowMs: 60_000 }
): { ok: true } | { ok: false; retryAfterSec: number } {
  const key = `${route}:${clientKey(req)}`;
  const now = Date.now();
  const map = store();
  const cur = map.get(key);
  if (!cur || cur.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }
  if (cur.count >= opts.limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)) };
  }
  cur.count += 1;
  return { ok: true };
}

export function rateLimitedResponse(retryAfterSec: number) {
  return Response.json(
    { error: `Demasiadas solicitudes. Espera ${retryAfterSec}s e intenta de nuevo.` },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}
