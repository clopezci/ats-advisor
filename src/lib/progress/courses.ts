const PROGRESS_KEY = "ats_course_progress";

export type CourseProgress = Record<string, { day: number; completed: number[]; updatedAt: number }>;

export function readProgress(): CourseProgress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveProgress(code: string, day: number, completed: number[]) {
  const all = readProgress();
  all[code] = { day, completed, updatedAt: Date.now() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function getProgress(code: string) {
  return readProgress()[code] || { day: 0, completed: [], updatedAt: 0 };
}
