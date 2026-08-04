import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function hasSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createBrowserSupabase(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Nunca usar anon key como service: sin RLS en app_settings sería writable desde browser.
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
