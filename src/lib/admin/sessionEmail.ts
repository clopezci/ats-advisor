import { createClient } from "@supabase/supabase-js";
import { hasSupabase, supabaseProjectUrl } from "@/lib/supabase/client";

/** Email de la sesión Supabase (Bearer) o null. */
export async function userEmailFromBearer(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || !hasSupabase()) return null;
  const sb = createClient(supabaseProjectUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data } = await sb.auth.getUser();
  return (data.user?.email || "").trim().toLowerCase() || null;
}
