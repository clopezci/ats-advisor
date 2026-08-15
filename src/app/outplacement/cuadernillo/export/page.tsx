"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  readWorkbook,
  workbookProgress,
  workbookToPlainText,
  type WorkbookState,
} from "@/lib/workbook/types";

export default function ExportCuadernilloPage() {
  const [wb, setWb] = useState<WorkbookState | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const state = readWorkbook();
    setWb(state);
    setText(workbookToPlainText(state));
  }, []);

  function downloadTxt() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuadernillo-atsadvisor-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!wb) return <p className="text-sm muted">Cargando…</p>;

  const prog = workbookProgress(wb);
  const intro =
    "Exporta tu cuadernillo: descarga texto o imprime / guarda como PDF desde el navegador. Los datos viven en este dispositivo.";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3 print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-2 print:hidden">
          <div>
            <p className="text-xs muted">Cuadernillo · export</p>
            <h1 className="text-2xl font-semibold">Exportar / PDF</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="text-sm muted leading-relaxed print:hidden">{intro}</p>
        <p className="text-xs muted print:hidden">
          Avance: {prog.done}/{prog.total} · {prog.pct}%
        </p>
        <div className="flex flex-col gap-2 print:hidden">
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            Imprimir / guardar como PDF
          </button>
          <button type="button" className="btn-secondary" onClick={downloadTxt}>
            Descargar .txt
          </button>
        </div>
      </section>

      <article className="bento-card space-y-4 print:shadow-none print:border-0">
        <h2 className="text-lg font-semibold">Mi cuadernillo ATSAdvisor</h2>
        <p className="text-xs muted">Generado {new Date().toLocaleString()}</p>

        <section className="space-y-1">
          <h3 className="font-semibold text-sm">Mapa</h3>
          <p className="text-sm whitespace-pre-wrap">{wb.map.objective || "—"}</p>
          <p className="text-sm muted whitespace-pre-wrap">{wb.map.purpose}</p>
        </section>

        <section className="space-y-1">
          <h3 className="font-semibold text-sm">Pitch</h3>
          <p className="text-sm whitespace-pre-wrap">{wb.scripts.pitch || "—"}</p>
        </section>

        <section className="space-y-1">
          <h3 className="font-semibold text-sm">SOAR</h3>
          <ul className="text-sm space-y-1">
            {wb.soar.entries
              .filter((e) => e.oneLiner || e.result)
              .map((e, i) => (
                <li key={i}>• {e.oneLiner || e.result}</li>
              ))}
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="font-semibold text-sm">Red</h3>
          <ul className="text-sm space-y-1">
            {wb.network.contacts
              .filter((c) => c.name)
              .map((c, i) => (
                <li key={i}>
                  • {c.name} · {c.status} · {c.favorAsked}
                </li>
              ))}
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="font-semibold text-sm">Finanzas</h3>
          <p className="text-sm">Pista (meses): {wb.finance.runwayMonths || "—"}</p>
          <p className="text-sm whitespace-pre-wrap">{wb.finance.offerFloorNote}</p>
        </section>

        <section className="space-y-1">
          <h3 className="font-semibold text-sm">Funnel</h3>
          {wb.funnel.weeks.map((w, i) => (
            <p key={i} className="text-sm">
              {w.weekLabel}: red {w.outreach} · empresas {w.companyPages} · post {w.applications} ·
              ent {w.interviews} · of {w.offers}
            </p>
          ))}
        </section>

        <pre className="text-xs muted whitespace-pre-wrap overflow-auto print:hidden max-h-48">
          {text}
        </pre>
      </article>

      <Link href="/outplacement/cuadernillo/funnel" className="btn-secondary print:hidden">
        Ver funnel
      </Link>
      <Link href="/outplacement/cuadernillo" className="text-center text-sm muted print:hidden">
        Volver al cuadernillo
      </Link>
    </div>
  );
}
