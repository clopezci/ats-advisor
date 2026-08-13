"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCvVersion, listCvVersions, saveCvVersion, type CvVersion } from "@/lib/cv/versions";
import { CvPasteField } from "@/components/CvPasteField";

export default function CvsPage() {
  const [items, setItems] = useState<CvVersion[]>([]);
  const [name, setName] = useState("CV principal");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");

  function refresh() {
    setItems(listCvVersions());
  }

  useEffect(() => {
    refresh();
  }, []);

  function loadFromAts() {
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      const draft = localStorage.getItem("ats_cv_draft") || "";
      const t = ws?.cvText || draft;
      if (t) {
        setText(t);
        if (!name || name === "CV principal") setName("Desde ATS");
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-xl font-semibold">Versiones de CV</h1>
      <p className="text-sm muted">Guarda variantes por rol, industria o empresa (solo en este dispositivo).</p>
      <input
        className="field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ejemplo: CV para bancos"
      />
      <input
        className="field"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Etiqueta opcional (ej. finanzas, tech)"
      />
      <CvPasteField value={text} onChange={setText} label="Texto de esta versión del CV" />
      <button type="button" className="btn-secondary" onClick={loadFromAts}>
        Cargar desde workspace ATS
      </button>
      <button
        type="button"
        className="btn-primary"
        disabled={text.trim().length < 40}
        onClick={() => {
          const label = tag.trim() ? `${name.trim() || "CV"} · ${tag.trim()}` : name.trim() || "CV";
          saveCvVersion(label, text);
          setText("");
          setTag("");
          refresh();
        }}
      >
        Guardar versión
      </button>
      {items.map((c) => (
        <div key={c.id} className="bento-card space-y-2">
          <h2 className="font-semibold">{c.name}</h2>
          <p className="text-xs muted">{new Date(c.updatedAt).toLocaleString("es-CO")}</p>
          <p className="text-sm muted line-clamp-3">{c.text.slice(0, 220)}…</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              localStorage.setItem("ats_cv_draft", c.text);
              try {
                const ws = JSON.parse(localStorage.getItem("ats_workspace") || "{}");
                localStorage.setItem(
                  "ats_workspace",
                  JSON.stringify({ ...ws, cvText: c.text, savedAt: Date.now() })
                );
              } catch {
                /* ignore */
              }
              window.location.href = "/ats";
            }}
          >
            Usar en ATS
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              saveCvVersion(`${c.name} (copia)`, c.text);
              refresh();
            }}
          >
            Duplicar
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              deleteCvVersion(c.id);
              refresh();
            }}
          >
            Eliminar
          </button>
        </div>
      ))}
      <Link href="/ats/pack" className="btn-secondary">
        Pack ZIP
      </Link>
      <Link href="/cuenta" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
