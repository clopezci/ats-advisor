/**
 * Dos caminos solamente: ruta gratis | plan Carrera.
 * Guarda avance y “dónde iba” para Continuar / Empezar de cero / Cambiar.
 */

import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { nextWorkbookModule, readWorkbook } from "@/lib/workbook/types";

export type FocusPath = "gratis" | "carrera";

const PATH_KEY = "ats_focus_path_v1";
const LAST_KEY = "ats_path_last_href_v1";
const FREE_STEP_KEY = "ats_free_step_v1";
const RESTART_FLAG = "ats_path_restart_v1";

/** Pasos guiados de la ruta gratis (estudiar / postular hoy). */
export const FREE_STEPS = [
  {
    id: "ats",
    href: "/ats",
    title: "Analizar mi CV",
    desc: "Compara tu CV con una vacante y mira qué ajustar.",
  },
  {
    id: "psico",
    href: "/outplacement/psicotecnicas",
    title: "Estudiar psicotécnicas",
    desc: "Fichas y pruebas para practicar el método. Gratis.",
  },
  {
    id: "tracker",
    href: "/tracker",
    title: "Anotar postulaciones",
    desc: "Lleva el control de a dónde enviaste tu CV.",
  },
  {
    id: "checklist",
    href: "/herramientas/checklist",
    title: "Checklist CV ATS",
    desc: "Revisa formato antes de enviar.",
  },
] as const;

export type FreeStepId = (typeof FREE_STEPS)[number]["id"];

export type ContinueTarget = {
  href: string;
  label: string;
  hint: string;
};

export function readFocusPath(): FocusPath | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(PATH_KEY);
    if (v === "carrera") return "carrera";
    if (v === "gratis" || v === "ats") return "gratis"; // migra “ats” → gratis
    return null;
  } catch {
    return null;
  }
}

export function writeFocusPath(path: FocusPath) {
  localStorage.setItem(PATH_KEY, path);
}

export function clearFocusPath() {
  try {
    localStorage.removeItem(PATH_KEY);
  } catch {
    /* ignore */
  }
}

function readLastMap(): Partial<Record<FocusPath, string>> {
  try {
    const raw = JSON.parse(localStorage.getItem(LAST_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

export function rememberPathVisit(pathname: string) {
  if (typeof window === "undefined") return;
  const p = pathname.replace(/\/$/, "") || "/";
  if (p === "/" || p === "/auth" || p === "/precios" || p.startsWith("/legal") || p.startsWith("/cuenta")) {
    return;
  }
  const path = readFocusPath();
  if (!path) return;
  const map = readLastMap();
  map[path] = p + (typeof window !== "undefined" ? window.location.search : "");
  localStorage.setItem(LAST_KEY, JSON.stringify(map));

  if (path === "gratis") {
    const step = FREE_STEPS.findIndex((s) => p === s.href || p.startsWith(s.href + "/"));
    if (step >= 0) {
      const cur = Number(localStorage.getItem(FREE_STEP_KEY) || "0");
      if (step >= cur) localStorage.setItem(FREE_STEP_KEY, String(step));
    }
  }
}

export function readLastHref(path: FocusPath): string | null {
  const href = readLastMap()[path];
  return href && href.startsWith("/") ? href : null;
}

export function readFreeStepIndex(): number {
  try {
    const n = Number(localStorage.getItem(FREE_STEP_KEY) || "0");
    return Number.isFinite(n) ? Math.max(0, Math.min(FREE_STEPS.length - 1, n)) : 0;
  } catch {
    return 0;
  }
}

export function advanceFreeStep() {
  const i = readFreeStepIndex();
  const next = Math.min(FREE_STEPS.length - 1, i + 1);
  localStorage.setItem(FREE_STEP_KEY, String(next));
  return FREE_STEPS[next];
}

/** Empezar de cero en la ruta actual (borra “dónde iba”). */
export function restartCurrentPath() {
  const path = readFocusPath() || "gratis";
  const map = readLastMap();
  delete map[path];
  localStorage.setItem(LAST_KEY, JSON.stringify(map));
  if (path === "gratis") localStorage.setItem(FREE_STEP_KEY, "0");
  try {
    sessionStorage.setItem(RESTART_FLAG, "1");
  } catch {
    /* ignore */
  }
}

export function consumeRestartFlag(): boolean {
  try {
    if (sessionStorage.getItem(RESTART_FLAG) === "1") {
      sessionStorage.removeItem(RESTART_FLAG);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function pathLabel(path: FocusPath | null): string {
  if (path === "carrera") return "Plan Carrera";
  if (path === "gratis") return "Ruta gratis";
  return "Sin ruta";
}

export function resolveFreeContinueTarget(): ContinueTarget {
  const last = readLastHref("gratis");
  if (last && last !== "/") {
    const step = FREE_STEPS.find((s) => last === s.href || last.startsWith(s.href + "/"));
    return {
      href: last,
      label: step ? `Continuar: ${step.title}` : "Continuar donde iba",
      hint: "Retoma el último paso de tu ruta gratis",
    };
  }
  const i = readFreeStepIndex();
  const step = FREE_STEPS[i] || FREE_STEPS[0];
  return {
    href: step.href,
    label: `Continuar: ${step.title}`,
    hint: `Paso ${i + 1} de ${FREE_STEPS.length} · ${step.desc}`,
  };
}

export function resolveCareerContinueTarget(): ContinueTarget {
  const paid = canAccessOutplacement(readEntitlement().plan);
  if (!paid) {
    return {
      href: "/precios?plan=carrera&next=%2Foutplacement%2Fcuadernillo",
      label: "Activar Plan Carrera",
      hint: "Cuadernillo guiado · si eres dueño/tester, actívalo sin pago",
    };
  }
  const last = readLastHref("carrera");
  if (last && last.startsWith("/outplacement")) {
    return {
      href: last,
      label: "Continuar donde iba",
      hint: "Vuelves al último módulo del cuadernillo",
    };
  }
  try {
    const next = nextWorkbookModule(readWorkbook());
    if (next) {
      return {
        href: next.href,
        label: `Continuar: ${next.title}`,
        hint: "Una tarea · vuelve cuando la termines",
      };
    }
    return {
      href: "/outplacement/cuadernillo/funnel",
      label: "Continuar: seguimiento semanal",
      hint: "Cuadernillo completo · mira cómo vas",
    };
  } catch {
    return {
      href: "/outplacement/cuadernillo",
      label: "Continuar: mi cuadernillo",
      hint: "Flujo en fases · un paso a la vez",
    };
  }
}

/** Un solo destino “Continuar” según camino + plan + avance. */
export function resolveContinueTarget(): ContinueTarget {
  const path = readFocusPath();
  if (path === "carrera") return resolveCareerContinueTarget();
  return resolveFreeContinueTarget();
}

export function focusHomeHref(): string {
  return resolveContinueTarget().href;
}
