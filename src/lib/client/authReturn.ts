import { safeAppPath } from "@/lib/validation";

/** Enlace a /auth que, tras el correo, vuelve al paso actual. */
export function authHref(nextPath?: string): string {
  const raw =
    nextPath ??
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/cuenta");
  const next = safeAppPath(raw, "/cuenta");
  return `/auth?next=${encodeURIComponent(next)}`;
}

export function readAuthNextFromSearch(search: string, fallback = "/cuenta"): string {
  try {
    return safeAppPath(new URLSearchParams(search).get("next"), fallback);
  } catch {
    return fallback;
  }
}
