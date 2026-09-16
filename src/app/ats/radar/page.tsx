"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { CvPasteField } from "@/components/CvPasteField";
import { CareerUpsell } from "@/components/CareerUpsell";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import {
  DEFAULT_CRITERIA,
  parseTerms,
  readRadarCriteria,
  runRadarBatch,
  verdictLabel,
  writeRadarCriteria,
  type ModalityFilter,
  type RadarCriteria,
  type RadarJobResult,
} from "@/lib/jobs/radarCriteria";
import { upsertJob } from "@/lib/tracker/jobs";

const INTRO =
  "Define tus filtros una vez. Pega varios avisos (sepáralos con ---). Te decimos postula, revisa o descarta — sin recorrer LinkedIn vacante por vacante a ciegas.";

export default function RadarPage() {
  const [criteria, setCriteria] = useState<RadarCriteria>(DEFAULT_CRITERIA);
  const [mustRaw, setMustRaw] = useState("");
  const [excludeRaw, setExcludeRaw] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxYears, setMaxYears] = useState("");
  const [bulk, setBulk] = useState("");
  const [cv, setCv] = useState("");
  const [results, setResults] = useState<RadarJobResult[]>([]);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
    const c = readRadarCriteria();
    setCriteria(c);
    setMustRaw(c.mustHave.join(", "));
    setExcludeRaw(c.exclude.join(", "));
    setMinSalary(c.minSalaryCop ? String(c.minSalaryCop) : "");
    setMaxYears(c.maxYearsAsked ? String(c.maxYearsAsked) : "");
    try {
      const ws = JSON.parse(localStorage.getItem("ats_workspace") || "null");
      if (ws?.cvText) setCv(ws.cvText);
    } catch {
      /* ignore */
    }
  }, []);

  function saveCriteria(next: RadarCriteria) {
    setCriteria(next);
    writeRadarCriteria(next);
  }

  function persistFromFields(): RadarCriteria {
    const next: RadarCriteria = {
      minSalaryCop: minSalary.replace(/\D/g, "") ? Number(minSalary.replace(/\D/g, "")) : null,
      modality: criteria.modality,
      mustHave: parseTerms(mustRaw),
      exclude: parseTerms(excludeRaw),
      maxYearsAsked: maxYears.replace(/\D/g, "") ? Number(maxYears.replace(/\D/g, "")) : null,
    };
    saveCriteria(next);
    return next;
  }

  function run() {
    const c = persistFromFields();
    const ranked = runRadarBatch(bulk, c, cv);
    setResults(ranked);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Gratis · sin scrapear LinkedIn</p>
            <h1 className="text-2xl font-semibold">Radar de vacantes</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          Copia el texto del aviso desde LinkedIn u otro portal y pégalo aquí. Nosotros no entramos a tu cuenta.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">1. Tus filtros (se guardan en este dispositivo)</h2>
        <label className="text-sm block">
          Piso salarial mensual (COP, opcional)
          <input
            className="field mt-1"
            inputMode="numeric"
            placeholder="Ej.: 8000000"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
        </label>
        <label className="text-sm block">
          Modalidad
          <select
            className="field mt-1"
            value={criteria.modality}
            onChange={(e) => saveCriteria({ ...criteria, modality: e.target.value as ModalityFilter })}
          >
            <option value="any">Cualquiera</option>
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
            <option value="presencial">Presencial</option>
          </select>
        </label>
        <label className="text-sm block">
          Debe mencionar (tus skills / foco), separado por comas
          <input
            className="field mt-1"
            placeholder="Ej.: python, sql, liderazgo, finanzas"
            value={mustRaw}
            onChange={(e) => setMustRaw(e.target.value)}
          />
        </label>
        <label className="text-sm block">
          Descartar si menciona (dealbreakers)
          <input
            className="field mt-1"
            placeholder="Ej.: comisión pura, solo presencial, turnos nocturnos"
            value={excludeRaw}
            onChange={(e) => setExcludeRaw(e.target.value)}
          />
        </label>
        <label className="text-sm block">
          Tope de años que aceptas que pidan (opcional)
          <input
            className="field mt-1"
            inputMode="numeric"
            placeholder="Ej.: 8"
            value={maxYears}
            onChange={(e) => setMaxYears(e.target.value)}
          />
        </label>
        <button type="button" className="btn-secondary" onClick={() => persistFromFields()}>
          Guardar filtros
        </button>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">2. Tu CV (opcional, mejora el ranking)</h2>
        <CvPasteField framed={false} value={cv} onChange={setCv} />
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">3. Avisos en lote</h2>
        <p className="text-xs muted">
          Pega 1 o varios avisos completos. Si son varios, sepáralos con una línea que diga ---
        </p>
        <textarea
          className="field min-h-40"
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder={"Analista de datos — Empresa X\nRequisitos: SQL, Python…\n---\nOtro aviso…"}
        />
        <button type="button" className="btn-primary" disabled={bulk.trim().length < 40} onClick={run}>
          Evaluar lote
        </button>
      </section>

      {results.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Resultado ({results.length})</h2>
          {results.map((r) => (
            <article key={r.id} className="bento-card space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm leading-snug">{r.title}</h3>
                <span
                  className="pill-brand shrink-0"
                  style={
                    r.verdict === "descarta"
                      ? { background: "rgba(180,35,24,0.12)", color: "#b42318" }
                      : r.verdict === "revisa"
                        ? undefined
                        : undefined
                  }
                >
                  {verdictLabel(r.verdict)} · {r.score}
                </span>
              </div>
              <ul className="text-xs muted space-y-1">
                {r.reasons.map((x) => (
                  <li key={x}>• {x}</li>
                ))}
              </ul>
              <ul className="text-xs space-y-1">
                {r.flags.map((f) => (
                  <li
                    key={f.text}
                    style={{
                      color:
                        f.level === "bad"
                          ? "var(--danger, #b42318)"
                          : f.level === "ok"
                            ? "var(--brand)"
                            : undefined,
                    }}
                  >
                    {f.level === "ok" ? "✓" : f.level === "bad" ? "✗" : "·"} {f.text}
                  </li>
                ))}
              </ul>
              {r.cvMatch != null ? <p className="text-xs muted">Encaje CV: {r.cvMatch}%</p> : null}
              <div className="flex flex-col gap-2">
                {r.verdict !== "descarta" ? (
                  <Link
                    href="/ats"
                    className="btn-secondary"
                    onClick={() => {
                      try {
                        localStorage.setItem(
                          "ats_workspace",
                          JSON.stringify({
                            ...(JSON.parse(localStorage.getItem("ats_workspace") || "{}") || {}),
                            cvText: cv || undefined,
                            jobText: bulk.includes("---") ? undefined : bulk,
                          })
                        );
                      } catch {
                        /* ignore */
                      }
                    }}
                  >
                    Analizar a fondo en ATS
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    upsertJob({
                      title: r.title,
                      company: "Por completar",
                      status: r.verdict === "postula" ? "interes" : r.verdict === "descarta" ? "rechazo" : "interes",
                      score: r.cvMatch ?? r.score,
                      notes: `Radar: ${verdictLabel(r.verdict)}. ${r.reasons.join(" · ")}`,
                    });
                    alert("Guardado en el tracker.");
                  }}
                >
                  Guardar en tracker
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {!paid ? (
        <CareerUpsell
          context="Para acompañar la búsqueda completa (red, entrevistas y oferta)"
          nextHref="/outplacement/cuadernillo"
        />
      ) : null}

      <Link href="/ats/multi" className="btn-secondary">
        Comparar varias vacantes vs un CV (multi)
      </Link>
      <Link href="/ats" className="btn-secondary">
        Ir al analizador ATS
      </Link>
      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
