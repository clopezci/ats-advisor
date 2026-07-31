"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCvVersion, listCvVersions, saveCvVersion, type CvVersion } from "@/lib/cv/versions";

export default function CvsPage() {
  const [items, setItems] = useState<CvVersion[]>([]);
  const [name, setName] = useState("CV principal");
  const [text, setText] = useState("");

  function refresh() {
    setItems(listCvVersions());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-xl font-semibold">Versiones de CV</h1>
      <p className="text-sm muted">Guarda variantes por rol/empresa (local).</p>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className="field min-h-32" value={text} onChange={(e) => setText(e.target.value)} />
      <button
        type="button"
        className="btn-primary"
        disabled={text.trim().length < 40}
        onClick={() => {
          saveCvVersion(name.trim() || "CV", text);
          setText("");
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
              window.location.href = "/ats";
            }}
          >
            Usar en ATS
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
      <Link href="/cuenta" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
