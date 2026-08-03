"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { SpeakButton } from "@/components/SpeakButton";
import { buildCvDocx, downloadBlob } from "@/lib/ats/docxExport";

/** ZIP listo para postular: CV DOCX + carta + LinkedIn + screening. */
export default function PackPage() {
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState({ cv: false, letter: false, linkedin: false, screening: false });

  useEffect(() => {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      const letter = localStorage.getItem("ats_cover_letter") || "";
      const li = localStorage.getItem("ats_linkedin_blurb") || "";
      const sc = localStorage.getItem("ats_screening_answers") || "";
      setReady({
        cv: Boolean(ws?.cvText || localStorage.getItem("ats_cv_draft")),
        letter: letter.length > 40,
        linkedin: li.length > 40,
        screening: sc.length > 40,
      });
    } catch {
      /* ignore */
    }
  }, []);

  async function buildZip() {
    setStatus("Armando ZIP…");
    const zip = new JSZip();
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      const cvText = ws?.cvText || localStorage.getItem("ats_cv_draft") || "";
      const letter = localStorage.getItem("ats_cover_letter") || "Genera la carta en /ats o /herramientas/carta";
      const li = localStorage.getItem("ats_linkedin_blurb") || "Genera LinkedIn en /herramientas/linkedin";
      const sc = localStorage.getItem("ats_screening_answers") || "Genera screening en /ats/screening";
      const report = localStorage.getItem("ats_last_result");

      if (cvText.length > 40) {
        const docx = await buildCvDocx(cvText, { title: "Hoja de vida" });
        const buf = await docx.arrayBuffer();
        zip.file("01-CV-ATSAdvisor.docx", buf);
      }
      zip.file("02-carta-presentacion.txt", letter);
      zip.file("03-linkedin.txt", li);
      zip.file("04-screening-respuestas.txt", sc);
      zip.file(
        "00-README.txt",
        [
          "Pack listo para postular — ATSAdvisor / LOTIC",
          "1) Revisa el CV DOCX (veracidad).",
          "2) Adjunta carta si el portal la pide.",
          "3) Actualiza LinkedIn antes de Easy Apply.",
          "4) Usa las respuestas de screening en el formulario.",
          "Disclaimer: eres responsable de la exactitud de tu información.",
        ].join("\n")
      );
      if (report) zip.file("05-ultimo-analisis.json", report);

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(`ATSAdvisor-pack-postulacion.zip`, blob);
      setStatus("ZIP descargado. Revisa cada archivo antes de enviar.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "No se pudo crear el ZIP");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Pack listo para enviar</h1>
          <SpeakButton text="Descarga un ZIP con CV, carta, LinkedIn y respuestas de screening." />
        </div>
        <p className="text-sm muted">Un solo archivo para postular con orden. Tú validas la veracidad.</p>
      </section>

      <section className="bento-card space-y-1 text-sm muted">
        <p>{ready.cv ? "✓" : "○"} CV en workspace</p>
        <p>{ready.letter ? "✓" : "○"} Carta (genera en ATS o /herramientas/carta y copia a local)</p>
        <p>{ready.linkedin ? "✓" : "○"} Blurb LinkedIn</p>
        <p>{ready.screening ? "✓" : "○"} Respuestas screening</p>
        <p className="text-xs mt-2">
          Tip: tras generar carta/LinkedIn/screening, usa “Copiar” — guardamos en este dispositivo para el ZIP.
        </p>
      </section>

      <button type="button" className="btn-primary" onClick={buildZip}>
        Descargar ZIP de postulación
      </button>
      {status && <p className="text-sm muted">{status}</p>}

      <Link href="/ats/screening" className="btn-secondary">
        Screening
      </Link>
      <Link href="/herramientas/carta" className="btn-secondary">
        Carta
      </Link>
      <Link href="/ats" className="btn-secondary">
        ATS
      </Link>
    </div>
  );
}
