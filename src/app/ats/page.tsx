"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DictationButton } from "@/components/DictationButton";
import { CvPasteField, JobPasteField } from "@/components/CvPasteField";
import { SpeakButton } from "@/components/SpeakButton";
import { AdSlot } from "@/components/AdSlot";
import type { AtsAnalyzeResult, AtsProfile } from "@/lib/ats/engine";
import { DISCLAIMER_CV_REWRITE } from "@/lib/ats/coaching";
import { detectAtsProfile } from "@/lib/ats/detectAts";
import { buildCvDocx, downloadBlob } from "@/lib/ats/docxExport";
import { extractPlainCv } from "@/lib/ats/plainCv";
import { HelpTip } from "@/components/HelpTip";
import { glossaryForTitle } from "@/lib/ats/glossary";
import { compareAtsResults, lineDiff, type ScoreDelta } from "@/lib/ats/compare";
import { buildHistoryPayload, pushAtsHistory, saveAtsWorkspace } from "@/lib/ats/history";
import { canRunAts, recordAtsRun } from "@/lib/limits/atsFree";
import { openPrintableReport } from "@/lib/ats/report";
import { bumpStreak } from "@/lib/engagement/streak";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";
import { upsertJob } from "@/lib/tracker/jobs";
import { saveCvVersion } from "@/lib/cv/versions";
import { VoiceTextarea } from "@/components/VoiceField";
import { syncAtsScan } from "@/lib/supabase/sync";
import { AtsStepCoach } from "@/components/ats/AtsStepCoach";
import { buildScoreSummary } from "@/lib/ats/scoreSummary";
import { FlowContinueBar } from "@/components/FlowContinueBar";
import {
  applyLocalSurgicalPatch,
  buildCvPatchPlan,
  buildSurgicalCvPrompt,
  cvTextForClipboard,
  cvTextForRescore,
  EXAMPLE_MARK,
  isFakeCvRewrite,
  kindLabel,
  splitSurgicalCvResponse,
  type PatchSuggestion,
} from "@/lib/ats/cvPatch";
import { isFakeCoverLetter } from "@/lib/ats/coverLetter";
import {
  buildLocalApplicationTips,
  buildLocalBulletRewrites,
  buildLocalCoverFromResult,
  isLeakedAiFallback,
} from "@/lib/ats/localAiFallbacks";
import { filterSkillTerms } from "@/lib/ats/phraseFilter";
import { withUserAiHeaders, hasUserAiKeys, USER_AI_KEYS_EVENT } from "@/lib/ai/userKeysClient";
import { createBrowserSupabase } from "@/lib/supabase/client";

const PROFILES: { id: AtsProfile; label: string; hint: string }[] = [
  { id: "generic", label: "No lo sé", hint: "Sirve para la mayoría de avisos" },
  { id: "workday", label: "Workday", hint: "Entiende el sentido y exige formato limpio" },
  { id: "greenhouse", label: "Greenhouse", hint: "Lee bien el texto; luego lo revisa una persona" },
  { id: "taleo", label: "Taleo", hint: "Busca las palabras exactas del aviso" },
  { id: "successfactors", label: "SuccessFactors", hint: "Formato estricto (SAP)" },
  { id: "lever", label: "Lever", hint: "Relevancia + CV de una columna" },
  { id: "sap", label: "SAP", hint: "Títulos literales del aviso" },
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
  const [aiTip, setAiTip] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [rewriteText, setRewriteText] = useState("");
  const [rewriteChangelog, setRewriteChangelog] = useState("");
  const [rewriteMode, setRewriteMode] = useState<"surgical" | "full" | null>(null);
  const [rewriteSource, setRewriteSource] = useState<"ai" | "local" | null>(null);
  const [rewriteSuggestions, setRewriteSuggestions] = useState<PatchSuggestion[]>([]);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [applyTips, setApplyTips] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [originalCv, setOriginalCv] = useState("");
  const [scoreDelta, setScoreDelta] = useState<ScoreDelta | null>(null);
  const [rescoring, setRescoring] = useState(false);
  const [diffLines, setDiffLines] = useState<{ type: "same" | "add" | "del"; text: string }[]>([]);
  const [editedCv, setEditedCv] = useState("");
  const [cvVersionName, setCvVersionName] = useState("");
  const [savedCompare, setSavedCompare] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [freeAtsLimit, setFreeAtsLimit] = useState(5);
  const [ownAi, setOwnAi] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [resultPhase, setResultPhase] = useState(1);

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
    const syncKey = () => setOwnAi(hasUserAiKeys());
    syncKey();
    window.addEventListener("focus", syncKey);
    window.addEventListener("storage", syncKey);
    window.addEventListener(USER_AI_KEYS_EVENT, syncKey);
    document.addEventListener("visibilitychange", syncKey);
    return () => {
      window.removeEventListener("focus", syncKey);
      window.removeEventListener("storage", syncKey);
      window.removeEventListener(USER_AI_KEYS_EVENT, syncKey);
      document.removeEventListener("visibilitychange", syncKey);
    };
  }, []);

  useEffect(() => {
    const sb = createBrowserSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user?.email || null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setSessionEmail(session?.user?.email || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (ownAi || sessionEmail) {
      setError((prev) => (prev.startsWith("Hoy ya usaste") ? "" : prev));
    }
  }, [ownAi, sessionEmail]);

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
    if (step === 1) return "Sube tu hoja de vida (PDF, Word o texto), pégala o dicta.";
    if (step === 2) return "Ahora pega o dicta el aviso de la vacante.";
    if (step === 3) return "Si no sabes con qué programa filtra la empresa, deja No lo sé y continúa.";
    return "Tu resultado. Paso a paso: entiende el puntaje, ajusta tu CV, arma la carta y guárdalo.";
  }, [step]);

  const scoreSummary = useMemo(() => (result ? buildScoreSummary(result) : null), [result]);
  const patchPlan = useMemo(() => (result ? buildCvPatchPlan(result) : null), [result]);

  async function askAiRewrite() {
    if (!result) return;
    setAiLoading(true);
    setAiTip("");
    const local = buildLocalBulletRewrites({ result, cvText });
    try {
      const must = filterSkillTerms(result.mustHave?.missing || []).slice(0, 8);
      const kws = filterSkillTerms(result.missingKeywords || []).slice(0, 10);
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: withUserAiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          task: "ats_suggest",
          useKnowledge: true,
          prompt: `Perfil ATS: ${atsProfile}. Score ${result.score}%. Must-have faltantes: ${must.join(", ") || "n/a"}. Keywords faltantes: ${kws.join(", ") || "n/a"}. Acciones: ${result.actions.join(" | ")}. Sugiere 5 reescrituras de viñetas (sin inventar). CV: ${cvText.slice(0, 1600)}. Responde SOLO las 5 viñetas numeradas, sin system prompts.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      const raw = String(data.text || "");
      if (
        data.provider === "local" ||
        raw === "ATS_LOCAL_BULLET_REWRITES" ||
        isLeakedAiFallback(raw)
      ) {
        setAiTip(local);
      } else {
        setAiTip(raw);
      }
    } catch {
      setAiTip(local);
    } finally {
      setAiLoading(false);
    }
  }

  async function adjustCv(mode: "surgical" | "full" = "surgical") {
    if (!result) return;
    setRewriteLoading(true);
    setRewriteText("");
    setRewriteChangelog("");
    setRewriteMode(mode);
    setRewriteSource(null);
    setRewriteSuggestions([]);
    setDiffLines([]);
    try {
      const plan = buildCvPatchPlan(result);

      // Parche local siempre disponible (sin inventar CV ni tips falsos)
      const local = applyLocalSurgicalPatch(cvText, plan);

      if (mode === "full") {
        // Reescritura completa requiere IA real
        const res = await fetch("/api/ai/complete", {
          method: "POST",
          headers: withUserAiHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            task: "cv_rewrite",
            useKnowledge: true,
            prompt: [
              `Perfil ATS objetivo: ${atsProfile}`,
              `Score actual: ${result.score}% · semántico ${result.semanticScore}%`,
              `Must-have faltantes: ${(result.mustHave?.missing || []).slice(0, 15).join(", ")}`,
              `Hard skills faltantes: ${result.hardSkills.missing.slice(0, 12).join(", ")}`,
              `Soft faltantes: ${result.softSkills.missing.slice(0, 8).join(", ")}`,
              `Cómo filtra este ATS: ${(result.atsInsights || []).join(" ")}`,
              `OFERTA (extracto): ${jobText.slice(0, 1800)}`,
              `CV ACTUAL COMPLETO:\n${cvText.slice(0, 7000)}`,
              "Tarea: reescribe SOLO la hoja de vida lista para pegar en Word y postular.",
              "Estructura: Nombre, contacto, perfil profesional, experiencia (viñetas), educación, habilidades, idiomas/certificaciones si aplican.",
              "NO escribas títulos internos como «Resumen de cambios», «CV reescrito», «texto plano» ni disclaimers.",
              "Teje keywords faltantes SOLO si el CV actual ya lo soporta. No inventes. Si algo es dudoso, deja [REVISAR] dentro de la misma viñeta.",
            ].join("\n\n"),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "IA no disponible");
        const raw = String(data.text || "");
        const provider = String(data.provider || "");
        if (provider === "local" || raw === "ATS_LOCAL_NO_AI" || isFakeCvRewrite(raw, cvText)) {
          setRewriteText(local.cv);
          setRewriteChangelog(
            local.changelog +
              "\n\nNo hay IA online para reescritura completa. Se aplicó el parche local (skills). Las viñetas siguen siendo manuales."
          );
          setRewriteSource("local");
          setRewriteSuggestions(local.suggestions);
          setRewriteMode("surgical");
          setDiffLines(lineDiff(cvText, local.cv).filter((d) => d.type !== "same"));
          return;
        }
        const plain = extractPlainCv(raw) || raw;
        setRewriteText(plain);
        setRewriteSource("ai");
        setRewriteSuggestions([]);
        setDiffLines(lineDiff(cvText, plain).filter((d) => d.type !== "same"));
        return;
      }

      // Surgical: intenta IA; si falla → parche local real sobre el CV
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: withUserAiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          task: "cv_rewrite",
          useKnowledge: true,
          prompt: buildSurgicalCvPrompt({
            atsProfile,
            score: result.score,
            cvText,
            jobText,
            plan,
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      const raw = String(data.text || "");
      const provider = String(data.provider || "");

      if (provider === "local" || raw === "ATS_LOCAL_NO_AI" || isFakeCvRewrite(raw, cvText)) {
        setRewriteText(local.cv);
        setRewriteChangelog(local.changelog);
        setRewriteSource("local");
        setRewriteSuggestions(local.suggestions);
        setDiffLines(lineDiff(cvText, local.cv).filter((d) => d.type !== "same"));
        return;
      }

      const split = splitSurgicalCvResponse(raw);
      const plain = extractPlainCv(split.cv) || split.cv;
      if (isFakeCvRewrite(plain, cvText)) {
        setRewriteText(local.cv);
        setRewriteChangelog(local.changelog);
        setRewriteSource("local");
        setRewriteSuggestions(local.suggestions);
        setDiffLines(lineDiff(cvText, local.cv).filter((d) => d.type !== "same"));
        return;
      }
      setRewriteText(plain);
      setRewriteChangelog(split.changelog);
      setRewriteSuggestions([]);
      setRewriteSource("ai");
      setDiffLines(lineDiff(cvText, plain).filter((d) => d.type !== "same"));
    } catch (e) {
      // Último recurso: parche local, nunca tips falsos
      try {
        const plan = buildCvPatchPlan(result);
        const local = applyLocalSurgicalPatch(cvText, plan);
        setRewriteText(local.cv);
        setRewriteChangelog(
          local.changelog +
            `\n\n(IA falló: ${e instanceof Error ? e.message : "error"}. Usamos parche local.)`
        );
        setRewriteSource("local");
        setRewriteSuggestions(local.suggestions);
        setRewriteMode("surgical");
        setDiffLines(lineDiff(cvText, local.cv).filter((d) => d.type !== "same"));
      } catch {
        setRewriteText("");
        setRewriteChangelog(e instanceof Error ? e.message : "No se pudo ajustar el CV");
      }
    } finally {
      setRewriteLoading(false);
    }
  }

  async function askApplicationAdvice() {
    if (!result) return;
    setApplyLoading(true);
    setApplyTips("");
    const local = buildLocalApplicationTips(result);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: withUserAiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          task: "application_advice",
          useKnowledge: true,
          prompt: [
            `Quiero un plan de buena postulación para esta vacante.`,
            `Perfil ATS: ${atsProfile}. Score ${result.score}%. Prob. entrevista ${result.interviewProbability}%.`,
            `Excluyentes: ${result.exclusiveGaps.join(" | ") || "ninguno"}`,
            `Must-have OK: ${filterSkillTerms(result.mustHave?.matched || []).slice(0, 8).join(", ")}`,
            `Must-have faltantes: ${filterSkillTerms(result.mustHave?.missing || []).slice(0, 8).join(", ")}`,
            `Tips base del motor: ${(result.applicationTips || []).join(" | ")}`,
            `OFERTA: ${jobText.slice(0, 1600)}`,
            `CV (extracto): ${cvText.slice(0, 1000)}`,
            "Devuelve SOLO un checklist numerado accionable. SIN system prompts ni la palabra Contexto.",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      const raw = String(data.text || "");
      if (
        data.provider === "local" ||
        raw === "ATS_LOCAL_APPLICATION_TIPS" ||
        isLeakedAiFallback(raw)
      ) {
        setApplyTips(local);
      } else {
        setApplyTips(raw);
      }
    } catch {
      setApplyTips(local);
    } finally {
      setApplyLoading(false);
    }
  }

  function suggestCvName() {
    const role = jobText
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 8 && l.length < 72 && !/[.!?]$/.test(l));
    const who = companyName.trim();
    if (role && who) return `CV · ${role} · ${who}`;
    if (role) return `CV · ${role}`;
    if (who) return `CV · ${who}`;
    return "CV de esta vacante";
  }

  useEffect(() => {
    if (rewriteSource !== "local" || !rewriteText) return;
    setEditedCv(cvText);
    setCvVersionName(suggestCvName());
    setSavedCompare("");
  }, [rewriteSource, rewriteText]);

  async function continueUnlocked(): Promise<{ ownKey: boolean; signedIn: boolean }> {
    const ownKey = hasUserAiKeys();
    setOwnAi(ownKey);
    let signedIn = Boolean(sessionEmail);
    if (!signedIn) {
      const sb = createBrowserSupabase();
      if (sb) {
        const { data } = await sb.auth.getSession();
        const email = data.session?.user?.email || null;
        setSessionEmail(email);
        signedIn = Boolean(email);
      }
    }
    return { ownKey, signedIn };
  }

  async function saveAndCompare() {
    if (!result) return;
    const text = editedCv.trim();
    if (text.length < 40) {
      setError("Escribe la hoja antes de comparar. Hace falta un poco más de texto.");
      return;
    }
    const paid = canAccessOutplacement(readEntitlement().plan);
    const access = await continueUnlocked();
    const blocked = atsDayBlocked(paid, freeAtsLimit, access.ownKey, access.signedIn);
    if (blocked) {
      setError(blocked);
      return;
    }
    setRescoring(true);
    setSavedCompare("");
    setError("");
    try {
      const before = result;
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: text,
          jobText,
          jobUrl,
          companyDomain,
          companyName,
          atsProfile,
          autoDetect: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al comparar");
      recordAtsRun();
      const after = data.result as AtsAnalyzeResult;
      const delta = compareAtsResults(before, after);
      setScoreDelta(delta);
      setResult(after);
      setCvText(text);
      const label = cvVersionName.trim() || suggestCvName();
      const role = label.replace(/^CV · /, "").split(" · ")[0] || "Vacante";
      const job = upsertJob({
        title: role,
        company: companyName.trim() || "Por completar",
        url: jobUrl.trim() || undefined,
        status: "interes",
        score: after.score,
        jobText: jobText.trim() || undefined,
        notes: `CV «${label}». Puntaje ${delta.before}% → ${delta.after}%.`,
      });
      saveCvVersion(label, text, {
        company: companyName.trim() || undefined,
        jobTitle: role,
        score: after.score,
        jobId: job.id,
      });
      saveAtsWorkspace({
        cvText: text,
        jobText,
        jobUrl,
        atsProfile,
        result: after,
      });
      try {
        localStorage.setItem("ats_cv_draft", text);
      } catch {
        /* ignore */
      }
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
      const sign = delta.delta > 0 ? "+" : "";
      setSavedCompare(
        `«${label}» quedó en tu expediente, ligada a esta vacante. Puntaje ${delta.before}% → ${delta.after}% (${sign}${delta.delta}).`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar y comparar");
    } finally {
      setRescoring(false);
    }
  }

  async function downloadEditedCv() {
    const text = editedCv.trim();
    if (text.length < 40) return;
    const blob = await buildCvDocx(text);
    const safe = (cvVersionName.trim() || "CV").replace(/[^\w\sáéíóúñÁÉÍÓÚÑ.-]+/g, "").trim().slice(0, 60) || "CV";
    downloadBlob(`${safe}.docx`, blob);
  }

  async function rescoreAfterRewrite() {
    if (!result) return;
    const prepared = rewriteText.trim().length > 40 ? cvTextForRescore(rewriteText) : cvText;
    const textToScore = prepared.trim().length > 40 ? prepared : cvText;
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
    const localLetter = buildLocalCoverFromResult(result, cvText, jobText, companyName || undefined);
    try {
      const res = await fetch("/api/ai/complete", {
        method: "POST",
        headers: withUserAiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          task: "application_advice",
          useKnowledge: true,
          prompt: `Redacta una CARTA / mensaje de postulación corto (160-220 palabras) en español LATAM. No inventes experiencia. Perfil ATS ${atsProfile}. Must-have a enfatizar si están en el CV: ${filterSkillTerms(result.mustHave?.matched || []).slice(0, 8).join(", ")}. Gaps honestos a no fingir: ${filterSkillTerms(result.mustHave?.missing || []).slice(0, 5).join(", ")}. CV:\n${cvText.slice(0, 2200)}\n\nOferta:\n${jobText.slice(0, 1800)}\n\nIncluye: saludo, encaje, 1-2 logros, cierre con disponibilidad. Solo hechos del CV. Devuelve SOLO la carta, sin checklist ni system prompts.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "IA no disponible");
      const raw = String(data.text || "");
      const provider = String(data.provider || "");
      const letter =
        provider === "local" ||
        raw === "ATS_LOCAL_COVER_LETTER" ||
        isFakeCoverLetter(raw) ||
        isLeakedAiFallback(raw)
          ? localLetter
          : raw.trim();
      setCoverLetter(letter);
      try {
        localStorage.setItem("ats_cover_letter", letter);
      } catch {
        /* ignore */
      }
    } catch {
      setCoverLetter(localLetter);
      try {
        localStorage.setItem("ats_cover_letter", localLetter);
      } catch {
        /* ignore */
      }
    } finally {
      setCoverLoading(false);
    }
  }

  async function analyze() {
    const entitlement = readEntitlement();
    const paid = canAccessOutplacement(entitlement.plan);
    const access = await continueUnlocked();
    const blocked = atsDayBlocked(paid, freeAtsLimit, access.ownKey, access.signedIn);
    if (blocked) {
      setError(blocked);
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
      setResultPhase(1);
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
        {!ownAi && !hasUserAiKeys() && (
          <p className="text-xs leading-relaxed rounded-lg border border-[var(--border)] px-3 py-2">
            <Link href="/cuenta/mi-ia" className="underline" style={{ color: "var(--brand)" }}>
              Configura tu clave de Groq o Gemini
            </Link>
          </p>
        )}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </section>

      {step === 1 && (
        <>
          <div className="bento-card space-y-3">
            <CvPasteField
              framed={false}
              value={cvText}
              onChange={setCvText}
              label="Tu hoja de vida"
              hint="Tu hoja de vida (PDF o Word). La vacante va en el siguiente paso."
            />
          </div>
          {error && step === 1 && <AtsNotice text={error} />}
          <div className="flex flex-col gap-3">
            <button type="button" className="btn-primary" disabled={cvText.trim().length < 40} onClick={() => setStep(2)}>
              Continuar
            </button>
            <Link href="/" className="btn-secondary">
              Volver
            </Link>
          </div>
          <AtsStepCoach step={1} cvText={cvText} />
        </>
      )}

      {step === 2 && (
        <>
          <div className="bento-card space-y-3">
            <JobPasteField
              framed={false}
              value={jobText}
              onChange={setJobText}
              label="El aviso de la vacante"
              hint="Pega el aviso: cargo, requisitos y funciones. Acá no va tu CV."
            />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">URL de la vacante (opcional)</label>
              <DictationButton label="Dictar URL" onResult={(t) => setJobUrl((p) => (p ? `${p} ${t}` : t))} />
            </div>
            <input
              className="field"
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://… (enlace de la oferta)"
            />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Empresa (opcional)</label>
              <DictationButton label="Dictar empresa" onResult={(t) => setCompanyName((p) => (p ? `${p} ${t}` : t))} />
            </div>
            <input
              className="field"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nombre empresa (ej. Bancolombia, Globant)"
            />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Dominio web (opcional)</label>
              <DictationButton label="Dictar dominio" onResult={(t) => setCompanyDomain((p) => (p ? `${p} ${t}` : t))} />
            </div>
            <input
              className="field"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              placeholder="ej. bancolombia.com"
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
          <AtsStepCoach step={2} cvText={cvText} jobText={jobText} />
        </>
      )}

      {step === 3 && (
        <>
          <div className="bento-card space-y-3">
            <p className="text-sm font-medium">¿Con qué sistema filtra la empresa? (si lo sabes)</p>
            <p className="text-xs muted">
              Workday, Greenhouse, etc. son programas de RH. Si no lo sabes, deja “Genérico” y continúa. No pasa nada.
            </p>
            {detectMsg && <p className="text-xs" style={{ color: "var(--brand)" }}>{detectMsg}</p>}
            {(() => {
              const generic = PROFILES.find((p) => p.id === "generic")!;
              const selected = PROFILES.find((p) => p.id === atsProfile) ?? generic;
              const named = PROFILES.filter((p) => p.id !== "generic");
              return (
                <>
                  <button
                    type="button"
                    className="btn-secondary w-full flex-col items-start text-left"
                    style={
                      atsProfile === generic.id
                        ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                        : undefined
                    }
                    onClick={() => setAtsProfile(generic.id)}
                  >
                    <span className="block font-medium">{generic.label}</span>
                    <span className="block text-xs muted">{generic.hint}</span>
                  </button>
                  {atsProfile !== generic.id ? (
                    <button
                      type="button"
                      className="btn-secondary w-full flex-col items-start text-left"
                      style={{ borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }}
                      onClick={() => setAtsProfile(selected.id)}
                    >
                      <span className="block font-medium">{selected.label}</span>
                      <span className="block text-xs muted">{selected.hint}</span>
                    </button>
                  ) : null}
                  <details className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <summary className="cursor-pointer text-sm font-medium">
                      Conozco el sistema (Workday, Greenhouse…)
                    </summary>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {named.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="btn-secondary flex-col items-start text-left"
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
                  </details>
                </>
              );
            })()}
          </div>
          {error && <AtsNotice text={error} />}
          <div className="flex flex-col gap-3">
            <button type="button" className="btn-primary" disabled={loading} onClick={analyze}>
              {loading ? "Analizando…" : "Analizar ahora"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
              Atrás
            </button>
          </div>
          <AtsStepCoach step={3} cvText={cvText} jobText={jobText} atsProfile={atsProfile} />
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
              Umbral típico para que un reclutador lo vea: ~70%+. Esto es orientación, no garantía de entrevista.
            </p>
          </section>

          {scoreSummary && resultPhase >= 1 && (
            <section className="bento-card space-y-4" style={{ borderColor: "var(--brand)" }}>
              <div>
                <span className="pill-brand">{scoreSummary.bandLabel}</span>
                <p className="mt-2 text-sm leading-relaxed">{scoreSummary.headline}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Por qué este puntaje</h2>
                <ul className="text-sm muted space-y-1.5 leading-relaxed">
                  {scoreSummary.whyScore.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>

              {scoreSummary.blockers.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold">Lo que más te baja el score</h2>
                  <ul className="space-y-2">
                    {scoreSummary.blockers.map((b) => (
                      <li key={b.label + b.detail.slice(0, 40)} className="text-sm">
                        <span
                          className="text-xs font-medium uppercase tracking-wide"
                          style={{ color: b.impact === "alto" ? "var(--danger, #b42318)" : "var(--brand)" }}
                        >
                          {b.impact === "alto" ? "Impacto alto" : "Impacto medio"} · {b.label}
                        </span>
                        <p className="muted mt-0.5 leading-relaxed">{b.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.score < 70 && scoreSummary.toReach70.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold">Para llegar a 70%+ (visible para reclutador)</h2>
                  <ul className="text-sm muted space-y-1.5 leading-relaxed">
                    {scoreSummary.toReach70.map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.score < 85 && scoreSummary.toReach85.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold">Para un puntaje alto (85%+)</h2>
                  <ul className="text-sm muted space-y-1.5 leading-relaxed">
                    {scoreSummary.toReach85.map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <ResultBlock title="Qué hacer ahora (prioridad)" items={result.nextSteps || result.actions} />

          {(result.mustHave?.missing?.length ?? 0) > 0 && (
            <ChipBlock
              title="Must-have que aún no detectamos en tu CV"
              items={result.mustHave!.missing}
              tone="warn"
            />
          )}

          {result.exclusiveGaps.length > 0 && (
            <ResultBlock title="Requisitos excluyentes a resolver primero" items={result.exclusiveGaps} />
          )}

          {resultPhase >= 2 && result.recruiterSkim && (
            <section className="bento-card space-y-2">
              <h2 className="text-sm font-semibold">Qué mira un reclutador en 8 segundos</h2>
              <p className="text-xs muted">
                Al abrir el PDF no lee la hoja entera. En ese momento solo alcanza a ver tu nombre, el cargo y si hay un logro con cifra. Si eso no convence, pasa al siguiente candidato.
              </p>
              <p className="text-sm font-medium">{result.recruiterSkim.verdict}</p>
              {result.recruiterSkim.greenFlags.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Lo que sí se ve</p>
                  <ul className="text-sm muted space-y-1">
                    {result.recruiterSkim.greenFlags.map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recruiterSkim.redFlags.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Lo que frena</p>
                  <ul className="text-sm muted space-y-1">
                    {result.recruiterSkim.redFlags.map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recruiterSkim.fixNow.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Qué cambiar ahora</p>
                  <ul className="text-sm muted space-y-1">
                    {result.recruiterSkim.fixNow.map((x) => (
                      <li key={x}>• {x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {resultPhase >= 2 && typeof result.authenticityScore === "number" && (
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

          <details className="bento-card space-y-2">
            <summary className="text-sm font-semibold cursor-pointer">Detalle técnico del cálculo</summary>
            <div className="mt-3 space-y-3">
              <ResultBlock title="Qué explica el score (motor)" items={result.explanation} />
              <ResultBlock title="Cómo filtra este ATS" items={result.atsInsights || []} />
            </div>
          </details>

          {resultPhase < 2 && (
            <button type="button" className="btn-primary" onClick={() => setResultPhase(2)}>
              Siguiente: ver qué falta en tu CV
            </button>
          )}

          {resultPhase >= 2 && scoreDelta && (
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

          {resultPhase >= 2 && (
          <>
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
              <HelpTip
                label={`Calidad de viñetas · promedio ${result.bulletQuality.avgScore}%`}
                help={glossaryForTitle("Calidad de viñetas") || ""}
              />
              <p className="text-xs muted">
                Cada logro debería tener verbo + qué hiciste + un número o resultado (sin inventar).
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
              <HelpTip
                label="Dónde poner cada palabra clave"
                help={glossaryForTitle("Dónde poner cada keyword") || ""}
              />
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
              <HelpTip
                label="Palabras de la oferta vs tu CV"
                help={glossaryForTitle("Heatmap de keywords") || ""}
              />
              <p className="text-xs muted">
                Rojo = no está en tu CV · ámbar = aparece poco · morado = sí está. El número es
                veces en el CV / veces en la oferta.
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
              <HelpTip
                label="Palabras clave por sección del CV"
                help={glossaryForTitle("Keywords por sección") || ""}
              />
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
            <HelpTip
              label="¿El CV tiene las secciones que el robot espera?"
              help={glossaryForTitle("Cobertura de secciones") || ""}
            />
            <ul className="grid grid-cols-2 gap-1 text-sm muted">
              {result.sectionCoverage &&
                Object.entries(result.sectionCoverage).map(([k, ok]) => (
                  <li key={k}>
                    {ok ? "✓" : "✗"} {labelSection(k)}
                  </li>
                ))}
            </ul>
          </section>

          <ChipBlock title="Requisitos indispensables que sí tienes" items={result.mustHave?.matched || []} tone="ok" />
          <ChipBlock title="Requisitos indispensables que faltan" items={result.mustHave?.missing || []} tone="warn" />
          <ChipBlock title="Requisitos deseables que faltan" items={result.niceToHave?.missing || []} tone="muted" />
          <ChipBlock title="Habilidades técnicas que sí tienes" items={result.hardSkills.matched} tone="ok" />
          <ChipBlock title="Habilidades técnicas que faltan" items={result.hardSkills.missing} tone="warn" />
          <ChipBlock title="Habilidades blandas que sí tienes" items={result.softSkills.matched} tone="ok" />
          <ChipBlock title="Palabras clave presentes" items={result.matchedKeywords.slice(0, 20)} tone="ok" />
          <ChipBlock title="Palabras clave faltantes" items={result.missingKeywords.slice(0, 20)} tone="warn" />

          <ResultBlock title="Requisitos excluyentes" items={result.exclusiveGaps} />
          <ResultBlock title="Alertas de formato" items={result.formatAlerts} />
          <ResultBlock title="Trampas / riesgos" items={result.trapAlerts} />
          <ResultBlock title="Formación sugerida" items={result.trainingSuggestions} />
          <ResultBlock title="Para el reclutador humano (después del ATS)" items={result.recruiterTips || []} />
          <ResultBlock title="Checklist postulación (base)" items={result.applicationTips || []} />
          </>
          )}

          {resultPhase === 2 && (
            <button type="button" className="btn-primary" onClick={() => setResultPhase(3)}>
              Siguiente: ver ejemplos de ajuste
            </button>
          )}

          {resultPhase >= 3 && (
          <section className="bento-card space-y-3">
            <h2 className="text-sm font-semibold">Ajustar hoja de vida</h2>
            <p className="text-xs muted">{DISCLAIMER_CV_REWRITE}</p>
            <p className="text-sm leading-relaxed">
              No cambia tu hoja. Muestra dos o tres ejemplos de cómo podría quedar una viñeta. Úsalos solo si el dato es real.
            </p>
            {patchPlan && patchPlan.items.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs muted">{patchPlan.summary}</p>
                <ul className="text-sm muted space-y-1.5 max-h-48 overflow-auto">
                  {patchPlan.items.map((item) => (
                    <li key={item.id}>
                      <span className="font-medium" style={{ color: "var(--text)" }}>
                        {kindLabel(item.kind)}:
                      </span>{" "}
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs muted">Casi no hay huecos; el ajuste será mínimo.</p>
            )}
            <button
              type="button"
              className="btn-primary"
              disabled={rewriteLoading}
              onClick={() => adjustCv("surgical")}
            >
              {rewriteLoading && rewriteMode === "surgical"
                ? "Aplicando cambios…"
                : "Ver ejemplos"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={rewriteLoading}
              onClick={() => adjustCv("full")}
            >
              {rewriteLoading && rewriteMode === "full"
                ? "Reescribiendo…"
                : "Reescritura completa (opcional)"}
            </button>
            {rewriteText && (
              <>
                {rewriteSource === "local" ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Ejemplos</h3>
                    <p className="text-xs muted">
                      Ideas para tus logros. Cópialas o reescríbelas en tu hoja, abajo.
                    </p>
                    {rewriteSuggestions.map((s, i) => (
                      <div key={s.id} className="rounded-lg p-3 text-sm" style={{ background: "var(--surface-2, #f6f4fb)" }}>
                        <p className="text-xs muted mb-1">Ejemplo {i + 1}</p>
                        <p className="leading-relaxed">{renderMetricMarks(s.paste)}</p>
                      </div>
                    ))}
                    {rewriteSuggestions.length > 0 ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={async () => {
                          await navigator.clipboard.writeText(rewriteSuggestions.map((s) => s.paste).join("\n\n"));
                          alert("Ejemplos copiados.");
                        }}
                      >
                        Copiar ejemplos
                      </button>
                    ) : (
                      <p className="text-sm muted">No hay ejemplos para esta hoja.</p>
                    )}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-semibold">Tu hoja</h3>
                      <p className="text-xs muted">
                        Edita tu texto, ponle nombre y guárdalo para compararlo con esta vacante.
                      </p>
                      <VoiceTextarea
                        label="Texto del CV"
                        value={editedCv}
                        onChange={setEditedCv}
                        className="field min-h-64"
                      />
                      <label className="block text-sm font-medium">Nombre de esta versión</label>
                      <input
                        className="field"
                        value={cvVersionName}
                        onChange={(e) => setCvVersionName(e.target.value)}
                        placeholder="CV · Gerente de transformación · Empresa"
                      />
                      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                        <button type="button" className="btn-primary" disabled={rescoring} onClick={() => void saveAndCompare()}>
                          {rescoring ? "Comparando…" : "Guardar y comparar"}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          disabled={editedCv.trim().length < 40}
                          onClick={() => void downloadEditedCv()}
                        >
                          Descargar Word
                        </button>
                      </div>
                      {savedCompare ? (
                        <div className="rounded-lg p-3 text-sm space-y-2" style={{ background: "var(--surface-2, #f6f4fb)" }}>
                          <p>{savedCompare}</p>
                          {scoreDelta ? (
                            <p>
                              {scoreDelta.before}% → {scoreDelta.after}%
                              {scoreDelta.mustGained.length > 0
                                ? `. Ahora aparecen: ${scoreDelta.mustGained.slice(0, 4).join(", ")}.`
                                : ""}
                            </p>
                          ) : null}
                          <p className="text-xs">
                            <Link className="underline" href="/cuenta/cvs">Ver en Mis CVs</Link>
                            {" · "}
                            <Link className="underline" href="/tracker">Ver en el seguimiento</Link>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">Revisa la redacción antes de usarla.</p>
                    <div
                      className="text-sm leading-relaxed max-h-96 overflow-auto rounded-lg p-3 space-y-2"
                      style={{ background: "var(--surface-2, #f6f4fb)" }}
                    >
                      {rewriteText.split("\n").map((line, i) => {
                        const shown = line.replace(EXAMPLE_MARK, "").trim();
                        if (!shown) return <div key={i} className="h-2" />;
                        return <p key={i}>{shown}</p>;
                      })}
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={async () => {
                          await navigator.clipboard.writeText(cvTextForClipboard(rewriteText));
                          alert("Texto copiado.");
                        }}
                      >
                        Copiar texto
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={isFakeCvRewrite(rewriteText, cvText)}
                        onClick={async () => {
                          if (isFakeCvRewrite(rewriteText, cvText)) return;
                          const blob = await buildCvDocx(extractPlainCv(rewriteText) || rewriteText);
                          downloadBlob("CV-ATSAdvisor.docx", blob);
                        }}
                      >
                        Descargar Word
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
          )}

          {resultPhase === 3 && (
            <button type="button" className="btn-primary" onClick={() => setResultPhase(4)}>
              Siguiente: carta de postulación
            </button>
          )}

          {resultPhase >= 4 && (
          <>
          <section className="bento-card space-y-3">
            <h2 className="text-sm font-semibold">Carta / mensaje de postulación</h2>
            <p className="text-xs muted">
              Redacta el mensaje de esta vacante a partir de tu análisis. Revísalo antes de enviarlo.
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

          {resultPhase === 4 && (
            <button type="button" className="btn-primary" onClick={() => setResultPhase(5)}>
              Siguiente: guardar y descargar
            </button>
          )}
          </>
          )}

          {resultPhase >= 5 && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                try {
                  const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
                  const score = last?.result?.score ?? result.score;
                  const saved = upsertJob({
                    title: companyName.trim() || "Vacante desde ATS",
                    company: companyName.trim() || "Por completar",
                    url: jobUrl.trim() || undefined,
                    status: "interes",
                    score,
                    jobText: jobText.trim() || undefined,
                    notes: `Score ATS ${score}%. Edita cargo/empresa en el tracker.`,
                  });
                  try {
                    localStorage.setItem(
                      "ats_last_result",
                      JSON.stringify({
                        ...(last || {}),
                        result,
                        jobText,
                        companyName,
                        jobId: saved.id,
                      })
                    );
                  } catch {
                    /* ignore */
                  }
                  window.location.href = "/tracker?from=ats";
                } catch {
                  window.location.href = "/tracker";
                }
              }}
            >
              Guardar interés en el tracker
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                try {
                  const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
                  const score = last?.result?.score ?? result.score;
                  const appliedAt = Date.now();
                  const saved = upsertJob({
                    title: companyName.trim() || "Vacante desde ATS",
                    company: companyName.trim() || "Por completar",
                    url: jobUrl.trim() || undefined,
                    status: "aplicado",
                    appliedAt,
                    score,
                    jobText: jobText.trim() || undefined,
                    notes: `Postulé ${new Date(appliedAt).toLocaleDateString("es-CO")}. Score ATS ${score}%.`,
                  });
                  try {
                    localStorage.setItem(
                      "ats_last_result",
                      JSON.stringify({
                        ...(last || {}),
                        result,
                        jobText,
                        companyName,
                        jobId: saved.id,
                      })
                    );
                  } catch {
                    /* ignore */
                  }
                  window.location.href = `/tracker?from=ats&applied=${saved.id}`;
                } catch {
                  window.location.href = "/tracker";
                }
              }}
            >
              Ya postulé (guarda con fecha)
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                try {
                  const last = JSON.parse(localStorage.getItem("ats_last_result") || "null");
                  localStorage.setItem(
                    "ats_last_result",
                    JSON.stringify({
                      ...(last || {}),
                      result,
                      jobText,
                      companyName,
                    })
                  );
                } catch {
                  /* ignore */
                }
                window.location.href = "/ats/repaso";
              }}
            >
              Quiero repasar este rol (plan + retos)
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={async () => {
                const text = extractPlainCv(rewriteText) || rewriteText.trim() || cvText;
                const blob = await buildCvDocx(text);
                downloadBlob(`CV-ATSAdvisor.docx`, blob);
              }}
            >
              Descargar CV en Word
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => openPrintableReport(result, { profile: atsProfile })}
            >
              Exportar informe (PDF / imprimir)
            </button>
            <FlowContinueBar label="Seguir" />
            <Link href="/guia" className="btn-secondary">
              Ver mi plan de búsqueda
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStep(1);
                setResult(null);
                setResultPhase(1);
              }}
            >
              Nuevo análisis
            </button>
            <AdSlot slot="ats-results" />
          </div>
          )}
          <AtsStepCoach
            step={4}
            resultPhase={resultPhase}
            atsProfile={atsProfile}
            result={result}
            summary={scoreSummary}
            cvText={cvText}
            jobText={jobText}
          />
        </>
      )}
    </div>
  );
}

function renderMetricMarks(text: string) {
  const bits = text.split(/(\[\d[\d.,]*\s*%?\])/g);
  return bits.map((bit, i) =>
    /^\[\d/.test(bit) ? (
      <span key={i} style={{ color: "#6D28D9", fontWeight: 700 }}>
        {bit}
      </span>
    ) : (
      <span key={i}>{bit}</span>
    )
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
  const help = glossaryForTitle(title);
  return (
    <section className="bento-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        {help ? <HelpTip label={title} help={help} /> : <h2 className="text-sm font-semibold">{title}</h2>}
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

function atsDayBlocked(paid: boolean, freeLimit: number, ownKey: boolean, signedIn: boolean): string | null {
  if (ownKey || signedIn) return null;
  const dailyLimit = paid ? 100 : freeLimit;
  const gate = canRunAts(dailyLimit);
  if (gate.ok) return null;
  if (paid) return "Límite alto alcanzado. Reintenta mañana.";
  return "Hoy ya usaste los análisis gratis.";
}

function AtsNotice({ text }: { text: string }) {
  const quota = text.startsWith("Hoy ya usaste");
  if (!quota) {
    return (
      <p className="text-sm" style={{ color: "var(--danger)" }}>
        {text}
      </p>
    );
  }
  return (
    <div className="bento-card space-y-3">
      <p className="text-sm leading-relaxed">{text} Entra con tu correo para seguir.</p>
      <Link href="/auth" className="btn-primary">
        Entrar con mi correo
      </Link>
    </div>
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
  const help = glossaryForTitle(title);
  return (
    <section className="bento-card space-y-2">
      {help ? <HelpTip label={title} help={help} /> : <h2 className="text-sm font-semibold">{title}</h2>}
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
