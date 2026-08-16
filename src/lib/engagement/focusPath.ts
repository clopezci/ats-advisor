/** Camino de foco: máximo 1 decisión al inicio, luego solo Continuar. */

import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { nextWorkbookModule, readWorkbook } from "@/lib/workbook/types";

export type FocusPath = "carrera" | "ats";

const KEY = "ats_focus_path_v1";

export function readFocusPath(): FocusPath | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "carrera" || v === "ats") return v;
    return null;
  } catch {
    return null;
  }
}

export function writeFocusPath(path: FocusPath) {
  localStorage.setItem(KEY, path);
}

export function clearFocusPath() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export type ContinueTarget = {
  href: string;
  label: string;
  hint: string;
};

/** Destino Continuar del camino Carrera (para Inicio, junto al ATS fijo). */
export function resolveCareerContinueTarget(): ContinueTarget {
  const paid = canAccessOutplacement(readEntitlement().plan);
  if (!paid) {
    return {
      href: "/outplacement",
      label: "Continuar: mi acompañamiento",
      hint: "Desbloquea Carrera o activa Tester en Cuenta para el cuadernillo",
    };
  }
  try {
    const next = nextWorkbookModule(readWorkbook());
    if (next) {
      return {
        href: next.href,
        label: `Continuar: ${next.title}`,
        hint: "Un entregable · vuelve cuando termines",
      };
    }
    return {
      href: "/outplacement/cuadernillo/funnel",
      label: "Continuar: funnel semanal",
      hint: "Cuadernillo completo · mide el ritmo",
    };
  } catch {
    return {
      href: "/outplacement/cuadernillo",
      label: "Continuar: mi cuadernillo",
      hint: "Flujo en 6 fases",
    };
  }
}

/** Un solo destino “Continuar” según camino + plan + avance. */
export function resolveContinueTarget(): ContinueTarget {
  const path = readFocusPath();
  if (path === "ats") {
    return {
      href: "/ats",
      label: "Continuar: analizador ATS",
      hint: "CV vs una oferta · gratis",
    };
  }
  return resolveCareerContinueTarget();
}

export function focusHomeHref(): string {
  const t = resolveContinueTarget();
  return t.href;
}
