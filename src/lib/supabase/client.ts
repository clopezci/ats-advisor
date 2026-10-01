import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** La nota guardada trae /rest/v1. El cliente de acceso necesita la raíz del proyecto. */
export function supabaseProjectUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

export function hasSupabase() {
  return Boolean(supabaseProjectUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Un solo cliente en el navegador. Varios createClient() pelean por localStorage y congelan Chrome. */
let browserClient: SupabaseClient | null | undefined;

export function createBrowserSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (browserClient !== undefined) return browserClient;

  const url = supabaseProjectUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    browserClient = null;
    return null;
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}

export function createServiceSupabase(): SupabaseClient | null {
  const url = supabaseProjectUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Nunca usar anon key como service: sin RLS en app_settings sería writable desde browser.
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
