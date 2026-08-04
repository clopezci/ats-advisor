import { timingSafeEqual } from "crypto";

/** Admin auth: fail-closed in production when ADMIN_SECRET is missing. */
export function isAdminSecret(secret: string | null | undefined): boolean {
  const expected = process.env.ADMIN_SECRET;
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (!expected) {
    // Local/dev only: accept "dev-admin". Never in production.
    if (isProd) return false;
    return secret === "dev-admin";
  }
  if (!secret) return false;
  try {
    const a = Buffer.from(secret);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function requireCronAuth(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (!cronSecret) {
    if (isProd) return { ok: false, status: 503, error: "CRON_SECRET no configurado" };
    // Dev: allow without secret
    return { ok: true };
  }
  if (auth !== `Bearer ${cronSecret}`) {
    return { ok: false, status: 401, error: "No autorizado" };
  }
  return { ok: true };
}
