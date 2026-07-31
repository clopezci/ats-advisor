"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import type { AtsAnalyzeResult, AtsProfile } from "@/lib/ats/engine";
import { canRunAts, recordAtsRun } from "@/lib/limits/atsFree";
import { buildAtsReport, downloadText } from "@/lib/ats/report";
import { bumpStreak } from "@/lib/engagement/streak";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";

const PROFILES: { id: AtsProfile; label: string }[] = [
  { id: "generic", label: "Genérico" },
  { id: "workday", label: "Workday" },
  { id: "greenhouse", label: "Greenhouse" },
  { id: "taleo", label: "Taleo" },
  { id: "successfactors", label: "SuccessFactors" },
  { id: "lever", label: "Lever" },
  { id: "sap", label: "SAP" },
];

export default function AtsPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [atsProfile, setAtsProfile] = useState<AtsProfile>("generic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AtsAnalyzeResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiTip, setAiTip] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    try {
      const draft = localStorage.getItem("ats_cv_draft");
      if (draft) {
        setCvText(draft);
        localStorage.removeItem("ats_cv_draft");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const intro = useMemo(() => {
    if (step === 1) return "Sube tu CV (PDF/DOCX/TXT), pégalo o dicta el texto.";
    if (step === 2) return "Ahora pega o dicta la oferta laboral.";
    if (step === 3) return "Elige el tipo de ATS o portal si lo conoces.";
    return "Resultado de tu análisis ATS.";
  }, [step]);

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/ats/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo leer");
      setCvText(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  async function askAiRewrite() {
    if (!result) return;
    setAiLoading(true);
    setAiTip("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "ats_suggest",
          prompt: `Con base en este análisis ATS, sugiere 5 reescrituras concretas de viñetas (sin inventar experiencia). Faltantes: ${result.missingKeywords.slice(0, 12).join(", ")}. Acciones: ${result.actions.join(" | ")}. CV (extracto): ${cvText.slice(0, 1200)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      setAiTip(data.text);
    } catch (e) {
      setAiTip(e instanceof Error ? e.message : "No hay IA configurada aún");
    } finally {
      setAiLoading(false);
    }
  }

  async function analyze() {
    const entitlement = readEntitlement();
    const paid = canAccessOutplacement(entitlement.plan);
    const dailyLimit = paid ? 100 : 5;
    const gate = canRunAts(dailyLimit);
    if (!gate.ok) {
      setError(
        paid
          ? `Límite alto alcanzado (${gate.used}/${dailyLimit}). Reintenta mañana.`
          : `Límite diario free alcanzado (${gate.used}/${dailyLimit}). Vuelve mañana o ve a Precios.`
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobText, atsProfile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      recordAtsRun();
      bumpStreak();
      setResult(data.result);
      setStep(4);
      try {
        const prev = JSON.parse(localStorage.getItem("ats_history") || "[]");
        prev.unshift({ at: Date.now(), score: data.result.score });
        localStorage.setItem("ats_history", JSON.stringify(prev.slice(0, 30)));
        localStorage.setItem("ats_last_result", JSON.stringify({ result: data.result, atsProfile }));
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo analizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">ATS · paso {step} de 4</p>
            <h1 className="mt-1 text-2xl font-semibold">Analizar mi CV</h1>
          </div>
          <SpeakButton text={intro} />
        </div>
        <p className="muted text-sm">{intro}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </section>

      {step === 1 && (
        <>
          <div className="bento-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">CV (archivo o texto)</label>
              <DictationButton onResult={(t) => setCvText((p) => (p ? `${p} ${t}` : t))} />
            </div>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md,application/pdf"
              className="field"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
            {uploading && <p className="text-xs muted">Leyendo archivo…</p>}
            <textarea
              className="field min-h-40"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="O pega aquí el contenido de tu CV…"
            />
          </div>
          {error && step === 1 && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <div className="flex flex-col gap-3">
            <button type="button" className="btn-primary" disabled={cvText.trim().length < 40} onClick={() => setStep(2)}>
              Continuar
            </button>
            <Link href="/" className="btn-secondary">
              Volver
            </Link>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="bento-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Oferta laboral</label>
              <DictationButton onResult={(t) => setJobText((p) => (p ? `${p} ${t}` : t))} />
            </div>
            <textarea
              className="field min-h-40"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Pega aquí la descripción del puesto…"
            />
          </div>
          <div className="flex flex-col gap-3">
            <button type="button" className="btn-primary" disabled={jobText.trim().length < 40} onClick={() => setStep(3)}>
              Continuar
            </button>
            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
              Atrás
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="bento-card space-y-3">
            <p className="text-sm font-medium">¿A qué ATS o portal postulas?</p>
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="btn-secondary"
                  style={
                    atsProfile === p.id
                      ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                      : undefined
                  }
                  onClick={() => setAtsProfile(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
          <div className="flex flex-col gap-3">
            <button type="button" className="btn-primary" disabled={loading} onClick={analyze}>
              {loading ? "Analizando…" : "Analizar ahora"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
              Atrás
            </button>
          </div>
        </>
      )}

      {step === 4 && result && (
        <>
          <section className="bento-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs muted">Compatibilidad ATS</p>
                <p className="text-4xl font-semibold score-ring">{result.score}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs muted">Prob. entrevista</p>
                <p className="text-2xl font-semibold">{result.interviewProbability}%</p>
              </div>
              <SpeakButton
                text={`Tu compatibilidad es ${result.score} por ciento. Probabilidad de entrevista ${result.interviewProbability}. ${result.actions[0] || ""}`}
              />
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${result.score}%` }} />
            </div>
          </section>

          <ResultBlock title="Qué hacer ahora" items={result.actions} />
          <ResultBlock title="Palabras faltantes" items={result.missingKeywords.slice(0, 12)} />
          <ResultBlock title="Requisitos excluyentes" items={result.exclusiveGaps} />
          <ResultBlock title="Alertas de formato" items={result.formatAlerts} />
          <ResultBlock title="Trampas / riesgos" items={result.trapAlerts} />
          <ResultBlock title="Formación sugerida" items={result.trainingSuggestions} />

          <section className="bento-card space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Sugerencias IA (reescritura fiel)</h2>
              <SpeakButton text={aiTip || "Pide sugerencias de reescritura basadas en el análisis."} />
            </div>
            <button type="button" className="btn-secondary" disabled={aiLoading} onClick={askAiRewrite}>
              {aiLoading ? "Generando…" : "Pedir reescrituras con IA"}
            </button>
            {aiTip && <p className="text-sm muted whitespace-pre-wrap">{aiTip}</p>}
          </section>

          {!canAccessOutplacement(readEntitlement().plan) && <AdSlot slot="ats-results" />}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                downloadText(
                  `atsadvisor-informe-${result.score}.txt`,
                  buildAtsReport(result, { profile: atsProfile })
                )
              }
            >
              Descargar informe
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={async () => {
                const text = buildAtsReport(result, { profile: atsProfile });
                if (navigator.share) {
                  await navigator.share({ title: "Informe ATSAdvisor", text });
                } else {
                  await navigator.clipboard.writeText(text);
                  alert("Informe copiado al portapapeles");
                }
              }}
            >
              Compartir informe
            </button>
            <Link href="/ats/historial" className="btn-secondary">
              Ver historial
            </Link>
            <Link href="/tracker" className="btn-secondary">
              Guardar en tracker
            </Link>
            <Link href="/precios" className="btn-secondary">
              Ver planes / quitar límites
            </Link>
            <Link href="/outplacement" className="btn-primary">
              Mejorar con outplacement
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStep(1);
                setResult(null);
              }}
            >
              Nuevo análisis
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ResultBlock({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  const text = `${title}. ${items.join(". ")}`;
  return (
    <section className="bento-card space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <SpeakButton text={text} />
      </div>
      <ul className="space-y-1 text-sm muted">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
