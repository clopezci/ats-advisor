"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  pathLabel,
  readFocusPath,
  rememberPathVisit,
  resolveContinueTarget,
  restartCurrentPath,
  writeFocusPath,
  type ContinueTarget,
  type FocusPath,
} from "@/lib/engagement/focusPath";

/**
 * Barra siempre visible: ruta actual, Continuar, Cambiar, Empezar de cero.
 */
export function PathBar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [path, setPath] = useState<FocusPath | null>(null);
  const [target, setTarget] = useState<ContinueTarget | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const p = readFocusPath();
    setPath(p);
    try {
      rememberPathVisit(pathname);
      setTarget(resolveContinueTarget());
    } catch {
      setTarget(null);
    }
  }, [pathname]);

  function switchTo(next: FocusPath) {
    writeFocusPath(next);
    setPath(next);
    setMenu(false);
    try {
      setTarget(resolveContinueTarget());
      router.push(resolveContinueTarget().href);
    } catch {
      router.push(next === "carrera" ? "/precios?plan=carrera" : "/ats");
    }
  }

  function restart() {
    restartCurrentPath();
    setMenu(false);
    const href =
      readFocusPath() === "carrera"
        ? "/outplacement/cuadernillo"
        : "/ats";
    writeFocusPath(readFocusPath() || "gratis");
    router.push(href);
    setTarget(resolveContinueTarget());
  }

  if (!path) return null;

  return (
    <div
      className="rounded-xl border px-3 py-2 space-y-2"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="muted text-xs">Ruta:</span>
        <span className="font-medium text-sm">{pathLabel(path)}</span>
        {target ? (
          <Link href={target.href} className="underline shrink-0" style={{ color: "var(--brand)" }}>
            Continuar
          </Link>
        ) : null}
        <button
          type="button"
          className="underline muted shrink-0"
          onClick={() => setMenu((v) => !v)}
        >
          {menu ? "Cerrar" : "Cambiar o reiniciar"}
        </button>
      </div>
      {menu ? (
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => switchTo("gratis")}
          >
            Ruta gratis (ATS + psicotécnicas + tracker)
          </button>
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => switchTo("carrera")}
          >
            Plan Carrera (cuadernillo guiado)
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={restart}>
            Empezar esta ruta desde el principio
          </button>
          <Link href="/" className="btn-secondary text-sm text-center" onClick={() => setMenu(false)}>
            Ir al inicio
          </Link>
        </div>
      ) : null}
    </div>
  );
}
