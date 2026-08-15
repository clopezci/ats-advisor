import { storedProfileEmail } from "@/lib/client/storedEmail";
import {
  emptyWorkbook,
  readWorkbook,
  writeWorkbook,
  type WorkbookState,
} from "@/lib/workbook/types";

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushMs = 0;

export function workbookUpdatedAt(state: WorkbookState): number {
  return Number(state.meta?.updatedAt) || 0;
}

/** Programa subida a cloud (debounce). No-op sin email. */
export function scheduleWorkbookCloudPush(state: WorkbookState) {
  if (typeof window === "undefined") return;
  const email = storedProfileEmail();
  if (!email) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    void pushWorkbookToCloud(state, email);
  }, 2500);
}

export async function pushWorkbookToCloud(state: WorkbookState, email = storedProfileEmail()) {
  if (!email || typeof window === "undefined") return { ok: false as const, skipped: true };
  const now = Date.now();
  if (now - lastPushMs < 1500) return { ok: false as const, skipped: true };
  lastPushMs = now;
  try {
    const res = await fetch("/api/workbook/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        workbook: state,
        updatedAt: workbookUpdatedAt(state) || Date.now(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false as const, error: "network" };
  }
}

/**
 * Baja cloud y, si es más nuevo, reemplaza local.
 * Si local es más nuevo, empuja.
 */
export async function pullAndMergeWorkbook(): Promise<{
  applied: "cloud" | "local_pushed" | "none" | "error";
  state: WorkbookState;
}> {
  if (typeof window === "undefined") {
    return { applied: "none", state: emptyWorkbook() };
  }

  const local = readWorkbook();
  const email = storedProfileEmail();
  if (!email) return { applied: "none", state: local };

  try {
    const res = await fetch(`/api/workbook/sync?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) return { applied: "error", state: local };

    const cloud = data.workbook as WorkbookState | null;
    const cloudAt = Number(data.updatedAt) || 0;
    const localAt = workbookUpdatedAt(local);

    if (cloud && cloudAt > localAt + 2000) {
      const merged: WorkbookState = {
        ...emptyWorkbook(),
        ...cloud,
        meta: { updatedAt: cloudAt, syncedAt: Date.now() },
      };
      writeWorkbook(merged, { skipCloudPush: true });
      return { applied: "cloud", state: merged };
    }

    if (localAt >= cloudAt && localAt > 0) {
      await pushWorkbookToCloud(local, email);
      return { applied: "local_pushed", state: local };
    }

    return { applied: "none", state: local };
  } catch {
    return { applied: "error", state: local };
  }
}
