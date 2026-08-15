import type { CourseDef, CourseLesson } from "@/lib/courses/types";

const KEY = "ats_lesson_progress_v1";
const CURSOR_KEY = "ats_learning_cursor_v1";

export type LessonProgress = {
  /** taskId → done */
  tasks: Record<string, boolean>;
  lessonDone: boolean;
  updatedAt: number;
};

export type CourseProgressMap = Record<string, Record<string, LessonProgress>>;

export type LearningCursor = {
  courseId: string;
  lessonId: string;
  updatedAt: number;
};

export function readLessonProgress(): CourseProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function writeLessonProgress(all: CourseProgressMap) {
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getLessonState(courseId: string, lessonId: string): LessonProgress {
  const all = readLessonProgress();
  return all[courseId]?.[lessonId] || { tasks: {}, lessonDone: false, updatedAt: 0 };
}

export function toggleTask(courseId: string, lessonId: string, taskId: string, lesson: CourseLesson) {
  const all = readLessonProgress();
  const cur = getLessonState(courseId, lessonId);
  const tasks = { ...cur.tasks, [taskId]: !cur.tasks[taskId] };
  const allDone = lesson.tasks.every((t) => tasks[t.id]);
  const next: LessonProgress = {
    tasks,
    lessonDone: allDone,
    updatedAt: Date.now(),
  };
  if (!all[courseId]) all[courseId] = {};
  all[courseId][lessonId] = next;
  writeLessonProgress(all);
  if (!allDone) {
    setLearningCursor({ courseId, lessonId, updatedAt: Date.now() });
  }
  return next;
}

export function markLessonDone(courseId: string, lessonId: string, done = true) {
  const all = readLessonProgress();
  const cur = getLessonState(courseId, lessonId);
  if (!all[courseId]) all[courseId] = {};
  all[courseId][lessonId] = { ...cur, lessonDone: done, updatedAt: Date.now() };
  writeLessonProgress(all);
}

export function courseStats(course: CourseDef) {
  const all = readLessonProgress()[course.id] || {};
  const totalLessons = course.lessons.length;
  const doneLessons = course.lessons.filter((l) => all[l.id]?.lessonDone).length;
  let totalTasks = 0;
  let doneTasks = 0;
  for (const l of course.lessons) {
    totalTasks += l.tasks.length;
    const st = all[l.id];
    for (const t of l.tasks) {
      if (st?.tasks[t.id]) doneTasks++;
    }
  }
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;
  return { totalLessons, doneLessons, totalTasks, doneTasks, pct };
}

export function nextOpenLesson(course: CourseDef): CourseLesson | null {
  const all = readLessonProgress()[course.id] || {};
  return course.lessons.find((l) => !all[l.id]?.lessonDone) || null;
}

export function setLearningCursor(c: LearningCursor) {
  localStorage.setItem(CURSOR_KEY, JSON.stringify(c));
  try {
    void import("@/lib/supabase/sync").then((m) => m.syncLearningCursor(c)).catch(() => undefined);
  } catch {
    /* ignore */
  }
}

export function readLearningCursor(): LearningCursor | null {
  try {
    const raw = JSON.parse(localStorage.getItem(CURSOR_KEY) || "null");
    if (!raw?.courseId || !raw?.lessonId) return null;
    return raw;
  } catch {
    return null;
  }
}
