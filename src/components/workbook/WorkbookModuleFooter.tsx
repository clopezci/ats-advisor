"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  nextWorkbookModule,
  readWorkbook,
  type WorkbookModuleDef,
} from "@/lib/workbook/types";

/** Un solo Continuar al terminar un módulo del cuadernillo. */
export function WorkbookModuleFooter() {
  const [next, setNext] = useState<WorkbookModuleDef | null>(null);

  useEffect(() => {
    setNext(nextWorkbookModule(readWorkbook()));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {next ? (
        <Link href={next.href} className="btn-primary">
          Continuar: {next.title}
        </Link>
      ) : (
        <Link href="/outplacement/cuadernillo/funnel" className="btn-primary">
          Continuar: funnel semanal
        </Link>
      )}
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
