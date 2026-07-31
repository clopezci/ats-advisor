const ONBOARD_KEY = "ats_onboarded_v1";
const STREAK_KEY = "ats_streak";

export function isOnboarded() {
  try {
    return localStorage.getItem(ONBOARD_KEY) === "1";
  } catch {
    return true;
  }
}

export function completeOnboarding() {
  localStorage.setItem(ONBOARD_KEY, "1");
}

export type Streak = { count: number; lastDay: string };

export function readStreak(): Streak {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDay":""}');
  } catch {
    return { count: 0, lastDay: "" };
  }
}

export function bumpStreak(): Streak {
  const today = new Date().toISOString().slice(0, 10);
  const prev = readStreak();
  if (prev.lastDay === today) return prev;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const next: Streak = {
    count: prev.lastDay === yesterday ? prev.count + 1 : 1,
    lastDay: today,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}
