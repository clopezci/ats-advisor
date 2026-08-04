"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import type { AtsAnalyzeResult, AtsProfile } from "@/lib/ats/engine";
import { DISCLAIMER_CV_REWRITE } from "@/lib/ats/coaching";
import { detectAtsProfile } from "@/lib/ats/detectAts";
import { buildCvDocx, downloadBlob } from "@/lib/ats/docxExport";
import { compareAtsResults, lineDiff, type ScoreDelta } from "@/lib/ats/compare";
import { buildHistoryPayload, pushAtsHistory, saveAtsWorkspace } from "@/lib/ats/history";
import { canRunAts, recordAtsRun } from "@/lib/limits/atsFree";
import { buildAtsReport, downloadText, openPrintableReport } from "@/lib/ats/report";
import { bumpStreak } from "@/lib/engagement/streak";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { upsertJob } from "@/lib/tracker/jobs";
import { syncAtsScan } from "@/lib/supabase/sync";

const PROFILES: { id: AtsProfile; label: string; hint: string }[] = [
  { id: "generic", label: "Genérico", hint: "Si no sabes cuál usan" },
  { id: "workday", label: "Workday", hint: "Semántico + formato estricto" },
  { id: "greenhouse", label: "Greenhouse", hint: "Parse limpio + scorecard humano" },
  { id: "taleo", label: "Taleo", hint: "Keywords literales" },
  { id: "successfactors", label: "SuccessFactors", hint: "Parse estricto SAP" },
  { id: "lever", label: "Lever", hint: "Relevancia + 1 columna" },
  { id: "sap", label: "SAP", hint: "Títulos literales" },
];

export default function AtsPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [detectMsg, setDetectMsg] = useState("");
  const [atsProfile, setAtsProfile] = useState<AtsProfile>("generic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AtsAnalyzeResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiTip, setAiTip] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [rewriteText, setRewriteText] = useState("");
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [applyTips, setApplyTips] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [originalCv, setOriginalCv] = useState("");
  const [scoreDelta, setScoreDelta] = useState<ScoreDelta | null>(null);
  const [rescoring, setRescoring] = useState(false);
  const [diffLines, setDiffLines] = useState<{ type: "same" | "add" | "del"; text: string }[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [freeAtsLimit, setFreeAtsLimit] = useState(5);

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
    fetch("/api/features")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ai_limits?.free_ats_per_day) setFreeAtsLimit(Number(d.ai_limits.free_ats_per_day) || 5);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!jobUrl.trim() && jobText.trim().length < 40) {
      setDetectMsg("");
      return;
    }
    const d = detectAtsProfile({ jobText, jobUrl, companyDomain, companyName });
    setDetectMsg(
      d.company
        ? `${d.reason} · Empresa: ${d.company.name}`
        : `${d.reason} (${d.confidence})`
    );
    if (d.confidence === "high" || d.confidence === "medium") {
      setAtsProfile(d.profile);
    }
  }, [jobUrl, jobText, companyDomain, companyName]);

  const intro = useMemo(() => {
    if (step === 1) return "Sube tu CV (PDF/DOCX/TXT), pégalo o dicta el texto.";
    if (step === 2) return "Ahora pega o dicta la oferta laboral.";
    if (step === 3) return "Elige el tipo de ATS o portal si lo conoces.";
    return "Resultado pro: match, must-have, formato, tips y ajuste de hoja de vida.";
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
          useKnowledge: true,
          prompt: `Perfil ATS: ${atsProfile}. Score ${result.score}%. Must-have faltantes: ${result.mustHave?.missing?.slice(0, 10).join(", ") || "n/a"}. Keywords faltantes: ${result.missingKeywords.slice(0, 12).join(", ")}. Acciones: ${result.actions.join(" | ")}. Sugiere 5 reescrituras de viñetas (sin inventar). CV: ${cvText.slice(0, 1600)}`,
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

  async function adjustCv() {
    if (!result) return;
    setRewriteLoading(true);
    setRewriteText("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "cv_rewrite",
          useKnowledge: true,
          prompt: [
            `DISCLAIMER obligatorio al inicio: ${DISCLAIMER_CV_REWRITE}`,
            `Perfil ATS objetivo: ${atsProfile}`,
            `Score actual: ${result.score}% · semántico ${result.semanticScore}%`,
            `Must-have faltantes: ${(result.mustHave?.missing || []).slice(0, 15).join(", ")}`,
            `Hard skills faltantes: ${result.hardSkills.missing.slice(0, 12).join(", ")}`,
            `Soft faltantes: ${result.softSkills.missing.slice(0, 8).join(", ")}`,
            `Cómo filtra este ATS: ${(result.atsInsights || []).join(" ")}`,
            `OFERTA (extracto): ${jobText.slice(0, 1800)}`,
            `CV ACTUAL COMPLETO:\n${cvText.slice(0, 7000)}`,
            "Tarea: reescribe el CV en texto plano tejiendo keywords faltantes SOLO donde el contexto del CV ya lo soporte. Frases de valor (verbo + contexto + skill + resultado). No inventes. Marca [REVISAR] si algo es dudoso.",
          ].join("\n\n"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      setRewriteText(data.text);
    } catch (e) {
      setRewriteText(e instanceof Error ? e.message : "No se pudo ajustar el CV");
    } finally {
      setRewriteLoading(false);
    }
  }

  async function askApplicationAdvice() {
    if (!result) return;
    setApplyLoading(true);
    setApplyTips("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "application_advice",
          useKnowledge: true,
          prompt: [
            `Quiero un plan de buena postulación para esta vacante.`,
            `Perfil ATS: ${atsProfile}. Score ${result.score}%. Prob. entrevista ${result.interviewProbability}%.`,
            `Excluyentes: ${result.exclusiveGaps.join(" | ") || "ninguno"}`,
            `Must-have OK: ${(result.mustHave?.matched || []).slice(0, 8).join(", ")}`,
            `Must-have faltantes: ${(result.mustHave?.missing || []).slice(0, 8).join(", ")}`,
            `Tips base del motor: ${(result.applicationTips || []).join(" | ")}`,
            `OFERTA: ${jobText.slice(0, 1600)}`,
            `CV (extracto): ${cvText.slice(0, 1000)}`,
            "Incluye: antes de postular, durante el formulario, mensaje/carta corta, LinkedIn, seguimiento y errores típicos según cómo filtran los ATS.",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      setApplyTips(data.text);
    } catch (e) {
      setApplyTips(e instanceof Error ? e.message : "No se pudo generar el plan");
    } finally {
      setApplyLoading(false);
    }
  }

  function applyRewriteToEditor() {
    if (!rewriteText.trim()) return;
    if (!originalCv) setOriginalCv(cvText);
    const marker = rewriteText.search(/\n(?:CV|Hoja de vida|Versión|TEXTO)[^\n]*:\s*\n/i);
    const body = marker >= 0 ? rewriteText.slice(marker).replace(/^[^\n]*\n/, "") : rewriteText;
    const next = body.trim() || rewriteText;
    setCvText(next);
    setDiffLines(lineDiff(originalCv || cvText, next));
    try {
      localStorage.setItem("ats_cv_draft", next);
    } catch {
      /* ignore */
    }
  }

  async function rescoreAfterRewrite() {
    if (!result) return;
    const textToScore = cvText.trim().length > 40 ? cvText : rewriteText;
    if (textToScore.trim().length < 40) return;
    setRescoring(true);
    try {
      const before = result;
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: textToScore,
          jobText,
          jobUrl,
          companyDomain,
          companyName,
          atsProfile,
          autoDetect: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al re-analizar");
      recordAtsRun();
      const after = data.result as AtsAnalyzeResult;
      setScoreDelta(compareAtsResults(before, after));
      setResult(after);
      setDiffLines(lineDiff(originalCv || before.parsePreview?.summary || "", textToScore));
      pushAtsHistory(
        buildHistoryPayload({
          score: after.score,
          semanticScore: after.semanticScore,
          interviewProbability: after.interviewProbability,
          profile: atsProfile,
          jobText,
          mustMissing: after.mustHave?.missing,
          embeddingProvider: after.embeddingProvider,
        })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo re-analizar");
    } finally {
      setRescoring(false);
    }
  }

  async function generateCoverLetter() {
    if (!result) return;
    setCoverLoading(true);
    setCoverLetter("");
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "application_advice",
          useKnowledge: true,
          prompt: `Redacta una CARTA / mensaje de postulación corto (160-220 palabras) en español LATAM. No inventes experiencia. Perfil ATS ${atsProfile}. Must-have a enfatizar si están en el CV: ${(result.mustHave?.matched || []).slice(0, 8).join(", ")}. Gaps honestos a no fingir: ${(result.mustHave?.missing || []).slice(0, 5).join(", ")}. CV:\n${cvText.slice(0, 2200)}\n\nOferta:\n${jobText.slice(0, 1800)}\n\nIncluye: saludo, encaje, 1-2 logros, cierre con disponibilidad. Disclaimer implícito: solo hechos del CV.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      setCoverLetter(data.text);
      try {
        localStorage.setItem("ats_cover_letter", data.text);
      } catch {
        /* ignore */
      }
    } catch (e) {
      setCoverLetter(e instanceof Error ? e.message : "No se pudo generar");
    } finally {
      setCoverLoading(false);
    }
  }

  async function analyze() {
    const entitlement = readEntitlement();
    const paid = canAccessOutplacement(entitlement.plan);
    const dailyLimit = paid ? 100 : freeAtsLimit;
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
    setRewriteText("");
    setApplyTips("");
    setAiTip("");
    try {
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          jobText,
          jobUrl,
          companyDomain,
          companyName,
          atsProfile,
          autoDetect: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      recordAtsRun();
      bumpStreak();
      if (data.atsProfileUsed) setAtsProfile(data.atsProfileUsed);
      if (data.detection?.reason) setDetectMsg(data.detection.reason);
      setResult(data.result);
      setStep(4);
      setOriginalCv(cvText);
      setScoreDelta(null);
      setDiffLines([]);
      try {
        pushAtsHistory(
          buildHistoryPayload({
            score: data.result.score,
            semanticScore: data.result.semanticScore,
            interviewProbability: data.result.interviewProbability,
            profile: data.atsProfileUsed || atsProfile,
            jobText,
            mustMissing: data.result.mustHave?.missing,
            embeddingProvider: data.result.embeddingProvider,
          })
        );
        saveAtsWorkspace({
          cvText,
          jobText,
          jobUrl,
          atsProfile: data.atsProfileUsed || atsProfile,
          result: data.result,
        });
        syncAtsScan(data.result).catch(() => undefined);
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
            <p className="text-xs uppercase tracking-[0.14em] muted">ATS Pro · paso {step} de 4</p>
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
            <Link href="/ats/multi" className="btn-secondary">
              Comparar varias ofertas
            </Link>
            <Link href="/ats/portales" className="btn-secondary">
              Portales LATAM
            </Link>
            <Link href="/cuenta/cvs" className="btn-secondary">
              Versiones de CV
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
            <label className="text-sm font-medium">URL de la vacante (opcional — detecta el ATS)</label>
            <input
              className="field"
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://empresa.wd5.myworkdayjobs.com/… o boards.greenhouse.io/…"
            />
            <label className="text-sm font-medium">Empresa / dominio (opcional)</label>
            <input
              className="field"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nombre empresa (ej. Bancolombia, Globant)"
            />
            <input
              className="field"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              placeholder="Dominio (ej. bancolombia.com, globant.com)"
            />
            {detectMsg && <p className="text-xs muted">{detectMsg}</p>}
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
            <p className="text-xs muted">
              Si pegaste la URL, ya intentamos detectarlo. Puedes corregirlo manualmente.
            </p>
            {detectMsg && <p className="text-xs" style={{ color: "var(--brand)" }}>{detectMsg}</p>}
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="btn-secondary text-left"
                  style={
                    atsProfile === p.id
                      ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                      : undefined
                  }
                  onClick={() => setAtsProfile(p.id)}
                >
                  <span className="block font-medium">{p.label}</span>
                  <span className="block text-xs muted">{p.hint}</span>
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
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
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs muted">Compatibilidad ATS ({atsProfile})</p>
                <p className="text-4xl font-semibold score-ring">{result.score}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs muted">Prob. entrevista</p>
                <p className="text-2xl font-semibold">{result.interviewProbability}%</p>
                <p className="mt-1 text-xs muted">
                  Semántico {result.semanticScore ?? "—"}% · {result.embeddingProvider || "local"}
                </p>
              </div>
              <SpeakButton
                text={`Tu compatibilidad es ${result.score} por ciento. ${(result.nextSteps || result.actions)[0] || ""}`}
              />
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${result.score}%` }} />
            </div>
            <p className="text-xs muted">
              Umbral típico de surfacing a reclutador: ~70%+. Esto es orientación, no garantía de entrevista.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/ats/multi" className="btn-secondary" style={{ width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}>
                Multi-oferta
              </Link>
              <Link href="/ats/screening" className="btn-secondary" style={{ width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}>
                Screening
              </Link>
              <Link href="/ats/portales" className="btn-secondary" style={{ width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}>
                Portales LATAM
              </Link>
              <Link href="/ats/pack" className="btn-secondary" style={{ width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}>
                Pack ZIP
              </Link>
              <Link href="/ats/benchmark" className="btn-secondary" style={{ width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}>
                Benchmark
              </Link>
            </div>
          </section>

          {result.recruiterSkim && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">Ojo del reclutador · {result.recruiterSkim.seconds}s</h2>
              <p className="text-sm font-medium">{result.recruiterSkim.verdict}</p>
              {result.recruiterSkim.firstGlance.length > 0 && (
                <ul className="text-sm muted space-y-1">
                  {result.recruiterSkim.firstGlance.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
              )}
              {result.recruiterSkim.redFlags.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Banderas rojas</p>
                  <ul className="text-sm muted space-y-1">
                    {result.recruiterSkim.redFlags.map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recruiterSkim.greenFlags.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Señales verdes</p>
                  <ul className="text-sm muted space-y-1">
                    {result.recruiterSkim.greenFlags.map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recruiterSkim.fixNow.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Arregla ya</p>
                  <ul className="text-sm muted space-y-1">
                    {result.recruiterSkim.fixNow.map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {typeof result.authenticityScore === "number" && (
            <section className="bento-card space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Autenticidad / anti-IA</h2>
                <span className="pill-brand">{result.authenticityScore}%</span>
              </div>
              <p className="text-xs muted">
                Detecta tono genérico de IA y keyword stuffing. Alto = más humano y creíble.
              </p>
              {(result.authenticityAlerts || []).length > 0 ? (
                <ul className="text-sm muted space-y-1">
                  {result.authenticityAlerts.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm muted">Sin alertas fuertes de tono IA o stuffing.</p>
              )}
            </section>
          )}

          <ResultBlock title="Cómo avanza ahora (prioridad)" items={result.nextSteps || result.actions} />
          <ResultBlock title="Cómo filtra este ATS" items={result.atsInsights || []} />
          <ResultBlock title="Qué explica el score" items={result.explanation} />

          {scoreDelta && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">Antes → después del ajuste</h2>
              <p className="text-2xl font-semibold">
                {scoreDelta.before}% → {scoreDelta.after}%{" "}
                <span style={{ color: scoreDelta.delta >= 0 ? "var(--brand)" : "var(--danger, #b42318)" }}>
                  ({scoreDelta.delta >= 0 ? "+" : ""}
                  {scoreDelta.delta})
                </span>
              </p>
              <p className="text-xs muted">
                Semántico {scoreDelta.semanticBefore}% → {scoreDelta.semanticAfter}%
              </p>
              {scoreDelta.mustGained.length > 0 && (
                <p className="text-sm muted">Must-have recuperados: {scoreDelta.mustGained.join(", ")}</p>
              )}
              {scoreDelta.mustStillMissing.length > 0 && (
                <p className="text-sm muted">Aún faltan: {scoreDelta.mustStillMissing.join(", ")}</p>
              )}
            </section>
          )}

          {result.parsePreview && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">Cómo te parsea el ATS (vista estructurada)</h2>
              <p className="text-xs muted">
                Así suele “ver” el bot tus campos. Si algo vacío o raro, el ranking baja aunque seas buen candidato.
              </p>
              <ul className="text-sm muted space-y-1">
                <li>Nombre: {result.parsePreview.name || "— no detectado —"}</li>
                <li>Email: {result.parsePreview.email || "—"}</li>
                <li>Tel: {result.parsePreview.phone || "—"}</li>
                <li>LinkedIn: {result.parsePreview.linkedin || "—"}</li>
                <li>Resumen: {result.parsePreview.summary || "—"}</li>
                <li>Skills parseadas: {result.parsePreview.skills.join(", ") || "—"}</li>
              </ul>
              {result.parsePreview.experienceSnippets.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Experiencia (extractos)</p>
                  <ul className="text-xs muted space-y-1">
                    {result.parsePreview.experienceSnippets.slice(0, 4).map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {result.bulletQuality && result.bulletQuality.total > 0 && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">
                Calidad de viñetas · promedio {result.bulletQuality.avgScore}%
              </h2>
              <p className="text-xs muted">
                Heurística tipo Resume Worded: verbo de acción + métrica + skill (sin inventar).
              </p>
              {result.bulletQuality.weakest.map((b) => (
                <div key={b.text.slice(0, 40)} className="text-sm border-b py-2" style={{ borderColor: "var(--border)" }}>
                  <p className="font-medium">{b.score}% · {b.text.slice(0, 140)}{b.text.length > 140 ? "…" : ""}</p>
                  <p className="text-xs muted">{b.tips[0]}</p>
                </div>
              ))}
            </section>
          )}

          {result.placementGuide && result.placementGuide.length > 0 && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">Dónde poner cada keyword</h2>
              <ul className="space-y-2 text-sm muted">
                {result.placementGuide.slice(0, 8).map((p) => (
                  <li key={p.term + p.where}>
                    <span className="font-medium" style={{ color: "var(--brand)" }}>
                      {p.term}
                    </span>{" "}
                    → {p.where}. {p.why}
                    <br />
                    <span className="text-xs">{p.pattern}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.heatmap?.length > 0 && (
            <section className="bento-card space-y-3">
              <h2 className="text-sm font-semibold">Heatmap de keywords (oferta vs CV)</h2>
              <p className="text-xs muted">
                Rojo = falta · ámbar = débil · verde = ok. Intensidad según frecuencia en la oferta.
              </p>
              <div className="flex flex-wrap gap-2">
                {result.heatmap.map((h) => {
                  const bg =
                    h.status === "missing"
                      ? "rgba(180,35,24,0.18)"
                      : h.status === "weak"
                        ? "rgba(180,120,20,0.18)"
                        : "rgba(124,58,237,0.14)";
                  const border =
                    h.status === "missing" ? "#b42318" : h.status === "weak" ? "#b47814" : "var(--brand)";
                  return (
                    <span
                      key={h.term}
                      title={`Oferta ×${h.jobCount} · CV ×${h.cvCount}`}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        opacity: 0.55 + h.intensity / 200,
                      }}
                    >
                      {h.term}{" "}
                      <span className="muted">
                        {h.cvCount}/{h.jobCount}
                      </span>
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {result.sectionHits?.length > 0 && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">Keywords por sección del CV</h2>
              <ul className="space-y-2 text-sm muted">
                {result.sectionHits.map((s) => (
                  <li key={s.section}>
                    <span className="font-medium" style={{ color: "var(--ink, inherit)" }}>
                      {s.section}
                    </span>
                    : {s.hits} hits
                    {s.sample.length ? ` · ${s.sample.join(", ")}` : " · sin keywords de la oferta"}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bento-card space-y-2">
            <h2 className="text-sm font-semibold">Cobertura de secciones (parse)</h2>
            <ul className="grid grid-cols-2 gap-1 text-sm muted">
              {result.sectionCoverage &&
                Object.entries(result.sectionCoverage).map(([k, ok]) => (
                  <li key={k}>
                    {ok ? "✓" : "✗"} {labelSection(k)}
                  </li>
                ))}
            </ul>
          </section>

          <ChipBlock title="Must-have presentes" items={result.mustHave?.matched || []} tone="ok" />
          <ChipBlock title="Must-have faltantes" items={result.mustHave?.missing || []} tone="warn" />
          <ChipBlock title="Nice-to-have faltantes" items={result.niceToHave?.missing || []} tone="muted" />
          <ChipBlock title="Hard skills OK" items={result.hardSkills.matched} tone="ok" />
          <ChipBlock title="Hard skills faltantes" items={result.hardSkills.missing} tone="warn" />
          <ChipBlock title="Soft skills OK" items={result.softSkills.matched} tone="ok" />
          <ChipBlock title="Keywords presentes" items={result.matchedKeywords.slice(0, 20)} tone="ok" />
          <ChipBlock title="Keywords faltantes" items={result.missingKeywords.slice(0, 20)} tone="warn" />

          <ResultBlock title="Requisitos excluyentes" items={result.exclusiveGaps} />
          <ResultBlock title="Alertas de formato" items={result.formatAlerts} />
          <ResultBlock title="Trampas / riesgos" items={result.trapAlerts} />
          <ResultBlock title="Formación sugerida" items={result.trainingSuggestions} />
          <ResultBlock title="Para el reclutador humano (después del ATS)" items={result.recruiterTips || []} />
          <ResultBlock title="Checklist postulación (base)" items={result.applicationTips || []} />

          <section className="bento-card space-y-3">
            <h2 className="text-sm font-semibold">Ajustar hoja de vida</h2>
            <p className="text-xs muted">{DISCLAIMER_CV_REWRITE}</p>
            <button type="button" className="btn-primary" disabled={rewriteLoading} onClick={adjustCv}>
              {rewriteLoading ? "Ajustando con IA…" : "Ajustar hoja de vida"}
            </button>
            {rewriteText && (
              <>
                <SpeakButton text={rewriteText.slice(0, 400)} />
                <pre className="text-sm muted whitespace-pre-wrap max-h-96 overflow-auto rounded-lg p-3" style={{ background: "var(--surface-2, #f6f4fb)" }}>
                  {rewriteText}
                </pre>
                <button type="button" className="btn-secondary" onClick={applyRewriteToEditor}>
                  Cargar texto ajustado al editor (revisar antes de usar)
                </button>
                <button type="button" className="btn-primary" disabled={rescoring} onClick={rescoreAfterRewrite}>
                  {rescoring ? "Re-analizando…" : "Re-analizar score (antes → después)"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={async () => {
                    await navigator.clipboard.writeText(rewriteText);
                    alert("Copiado. Revísalo antes de postular.");
                  }}
                >
                  Copiar ajuste
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={async () => {
                    const blob = await buildCvDocx(rewriteText, { title: "Hoja de vida — ATSAdvisor" });
                    downloadBlob(`CV-ajustado-ATSAdvisor.docx`, blob);
                  }}
                >
                  Descargar DOCX del ajuste
                </button>
                {diffLines.length > 0 && (
                  <div className="max-h-64 overflow-auto text-xs space-y-1">
                    <p className="font-medium text-sm">Diff rápido</p>
                    {diffLines.slice(0, 40).map((d, i) => (
                      <p
                        key={`${d.type}-${i}`}
                        style={{
                          color:
                            d.type === "add" ? "var(--brand)" : d.type === "del" ? "var(--danger, #b42318)" : undefined,
                          opacity: d.type === "same" ? 0.55 : 1,
                        }}
                      >
                        {d.type === "add" ? "+ " : d.type === "del" ? "− " : "  "}
                        {d.text.slice(0, 160)}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <section className="bento-card space-y-3">
            <h2 className="text-sm font-semibold">Carta / mensaje de postulación</h2>
            <p className="text-xs muted">
              Generada con el contexto de este análisis (must-have y CV). Revísala antes de enviar.
            </p>
            <button type="button" className="btn-primary" disabled={coverLoading} onClick={generateCoverLetter}>
              {coverLoading ? "Redactando…" : "Generar carta de postulación"}
            </button>
            {coverLetter && (
              <>
                <p className="text-sm muted whitespace-pre-wrap">{coverLetter}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={async () => {
                    await navigator.clipboard.writeText(coverLetter);
                    try {
                      localStorage.setItem("ats_cover_letter", coverLetter);
                    } catch {
                      /* ignore */
                    }
                    alert("Carta copiada (también en pack ZIP)");
                  }}
                >
                  Copiar carta
                </button>
              </>
            )}
            <Link href="/herramientas/carta" className="btn-secondary">
              Abrir herramienta carta (con datos del ATS)
            </Link>
            <Link href="/herramientas/linkedin" className="btn-secondary">
              Optimizar LinkedIn para esta vacante
            </Link>
          </section>

          <section className="bento-card space-y-3">
            <h2 className="text-sm font-semibold">Cómo lograr una buena postulación</h2>
            <p className="text-xs muted">
              Plan accionable según esta vacante y cómo filtran los ATS (parse → match → ranking → humano).
            </p>
            <button type="button" className="btn-primary" disabled={applyLoading} onClick={askApplicationAdvice}>
              {applyLoading ? "Preparando plan…" : "Consejos de buena postulación"}
            </button>
            {applyTips && <p className="text-sm muted whitespace-pre-wrap">{applyTips}</p>}
          </section>

          <section className="bento-card space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Reescrituras puntuales (5 viñetas)</h2>
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
              onClick={async () => {
                const text = rewriteText.trim() || cvText;
                const blob = await buildCvDocx(text, { title: "Hoja de vida — ATSAdvisor" });
                downloadBlob(`CV-ATSAdvisor.docx`, blob);
              }}
            >
              Descargar CV en DOCX
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                downloadText(`atsadvisor-informe-${result.score}.txt`, buildAtsReport(result, { profile: atsProfile }))
              }
            >
              Descargar informe TXT
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => openPrintableReport(result, { profile: atsProfile })}
            >
              Exportar PDF (imprimir)
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
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                try {
                  const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
                  const score = last?.result?.score ?? result.score;
                  upsertJob({
                    title: "Vacante desde ATS",
                    company: "Por completar",
                    status: "interes",
                    score,
                    notes: `Score ATS ${score}% · perfil ${atsProfile}. Edita cargo/empresa en el tracker.`,
                  });
                  window.location.href = "/tracker?from=ats";
                } catch {
                  window.location.href = "/tracker";
                }
              }}
            >
              Guardar en tracker
            </button>
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

function labelSection(k: string) {
  const map: Record<string, string> = {
    experience: "Experiencia",
    education: "Educación",
    skills: "Skills",
    contact: "Contacto",
    summary: "Resumen",
  };
  return map[k] || k;
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

function ChipBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "ok" | "warn" | "muted";
}) {
  if (!items?.length) return null;
  const color =
    tone === "ok" ? "var(--brand)" : tone === "warn" ? "var(--danger, #b42318)" : "var(--muted, #6b6575)";
  return (
    <section className="bento-card space-y-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 24).map((item) => (
          <span
            key={item}
            className="text-xs px-2 py-1 rounded-full"
            style={{ border: `1px solid ${color}`, color }}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
