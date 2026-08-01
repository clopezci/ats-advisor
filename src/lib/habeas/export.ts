/** Keys we persist for product state — used by Habeas export/delete. */
export const HABEAS_KEYS = [
  "ats_profile",
  "ats_history",
  "ats_entitlement",
  "ats_free_usage",
  "ats_streak",
  "ats_onboarded_v1",
  "ats_job_tracker",
  "ats_cv_versions",
  "ats_course_progress",
  "out09_last",
  "ats_last_checkout",
  "ats_last_result",
  "ats_cookie_ok",
  "ats_cv_draft",
  "ats_b2b_org",
  "ats_b2b_seats",
] as const;

export function collectHabeasPayload(extra?: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of HABEAS_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    } catch {
      /* ignore */
    }
  }
  return {
    exportedAt: new Date().toISOString(),
    product: "ATSAdvisor",
    ...extra,
    data,
  };
}

export function wipeHabeasLocal() {
  for (const key of HABEAS_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
