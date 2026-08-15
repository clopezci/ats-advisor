import { createBrowserSupabase, hasSupabase } from "@/lib/supabase/client";

/** Push ATS scan when user is logged in and Supabase is configured. No-op otherwise. */
export async function syncAtsScan(result: unknown) {
  if (!hasSupabase() || typeof window === "undefined") return { ok: false, skipped: true };
  const sb = createBrowserSupabase();
  if (!sb) return { ok: false, skipped: true };
  const { data: sess } = await sb.auth.getSession();
  const userId = sess.session?.user?.id;
  if (!userId) return { ok: false, skipped: true };
  const score =
    typeof result === "object" && result && "score" in result
      ? Number((result as { score: number }).score)
      : null;
  const { error } = await sb.from("ats_scans").insert({
    user_id: userId,
    score,
    result,
  });
  return { ok: !error, skipped: false, error: error?.message };
}

export async function syncJobApplication(job: {
  title: string;
  company: string;
  url?: string;
  status: string;
  notes?: string;
  score?: number;
}) {
  if (!hasSupabase() || typeof window === "undefined") return { ok: false, skipped: true };
  const sb = createBrowserSupabase();
  if (!sb) return { ok: false, skipped: true };
  const { data: sess } = await sb.auth.getSession();
  const userId = sess.session?.user?.id;
  if (!userId) return { ok: false, skipped: true };
  const { error } = await sb.from("job_applications").insert({
    user_id: userId,
    title: job.title,
    company: job.company,
    url: job.url,
    status: job.status,
    notes: job.notes,
    score: job.score,
  });
  return { ok: !error, skipped: false, error: error?.message };
}

export async function syncProfilePlan(_plan: string) {
  if (!hasSupabase() || typeof window === "undefined") return { ok: false, skipped: true };
  const sb = createBrowserSupabase();
  if (!sb) return { ok: false, skipped: true };
  const { data: sess } = await sb.auth.getSession();
  const userId = sess.session?.user?.id;
  const email = sess.session?.user?.email;
  if (!userId) return { ok: false, skipped: true };
  // No empujar plan desde el cliente: el plan cloud lo escribe el webhook / service role.
  const { error } = await sb.from("profiles").upsert({
    id: userId,
    email,
    updated_at: new Date().toISOString(),
  });
  return { ok: !error, skipped: false, error: error?.message };
}

export async function syncLearningCursor(cursor: {
  courseId: string;
  lessonId: string;
  updatedAt?: number;
}) {
  if (!hasSupabase() || typeof window === "undefined") return { ok: false, skipped: true };
  const sb = createBrowserSupabase();
  if (!sb) return { ok: false, skipped: true };
  const { data: sess } = await sb.auth.getSession();
  const userId = sess.session?.user?.id;
  const email = sess.session?.user?.email;
  if (!userId) return { ok: false, skipped: true };
  const { error } = await sb.from("profiles").upsert({
    id: userId,
    email,
    learning_course_id: cursor.courseId,
    learning_lesson_id: cursor.lessonId,
    learning_cursor_at: new Date(cursor.updatedAt || Date.now()).toISOString(),
    updated_at: new Date().toISOString(),
  });
  return { ok: !error, skipped: false, error: error?.message };
}
