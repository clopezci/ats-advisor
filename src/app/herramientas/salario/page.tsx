"use client";

import { CourseWithTool } from "@/components/CourseWithTool";
import { toolCourseById } from "@/lib/courses/toolCourses";
import { CareerUpsell } from "@/components/CareerUpsell";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  COMPANY_SIZES,
  CITY_MULT,
  INDUSTRIES,
  NEGOTIATION_CHECKLIST,
  ROLE_FAMILIES,
  SALARY_DISCLAIMER_SHORT,
  SALARY_LEGAL_NOTICE,
  estimateSalary,
  type CityTier,
  type CompanySize,
  type IndustryId,
  type SalaryEstimate,
} from "@/lib/salary/matrix";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

const PROFILE_KEY = "ats_salary_profile_v1";

type SavedProfile = {
  roleId: string;
  city: CityTier;
  targetIndustry: IndustryId;
  targetSize: CompanySize;
  prevSalary: string;
  prevIndustry: IndustryId | "";
  prevSize: CompanySize | "";
};

function SalarioTool() {
  const [roleId, setRoleId] = useState(ROLE_FAMILIES[0].id);
  const [city, setCity] = useState<CityTier>("bogota_medellin");
  const [targetIndustry, setTargetIndustry] = useState<IndustryId>("servicios");
  const [targetSize, setTargetSize] = useState<CompanySize>("mediana");
  const [prevSalary, setPrevSalary] = useState("");
  const [prevIndustry, setPrevIndustry] = useState<IndustryId | "">("");
  const [prevSize, setPrevSize] = useState<CompanySize | "">("");
  const [cpi, setCpi] = useState(1);
  const [asOf, setAsOf] = useState("—");
  const [methodNote, setMethodNote] = useState("");
  const [showFullMatrix, setShowFullMatrix] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
    try {
      const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") as SavedProfile | null;
      if (raw) {
        if (raw.roleId) setRoleId(raw.roleId);
        if (raw.city) setCity(raw.city);
        if (raw.targetIndustry) setTargetIndustry(raw.targetIndustry);
        if (raw.targetSize) setTargetSize(raw.targetSize);
        if (raw.prevSalary) setPrevSalary(raw.prevSalary);
        if (raw.prevIndustry) setPrevIndustry(raw.prevIndustry);
        if (raw.prevSize) setPrevSize(raw.prevSize);
      }
    } catch {
      /* ignore */
    }
    fetch("/api/salary/matrix?roleId=analista_junior")
      .then((r) => r.json())
      .then((d) => {
        if (d?.snapshot?.cpiFactorFromSeed) setCpi(d.snapshot.cpiFactorFromSeed);
        if (d?.snapshot?.asOf) setAsOf(d.snapshot.asOf);
        if (d?.snapshot?.notes) setMethodNote(d.snapshot.notes);
        else if (d?.snapshot?.method) setMethodNote(d.snapshot.method);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const payload: SavedProfile = {
      roleId,
      city,
      targetIndustry,
      targetSize,
      prevSalary,
      prevIndustry,
      prevSize,
    };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [roleId, city, targetIndustry, targetSize, prevSalary, prevIndustry, prevSize]);

  const est: SalaryEstimate = useMemo(() => {
    const prev = Number(String(prevSalary).replace(/\D/g, ""));
    return estimateSalary({
      roleId,
      city,
      targetIndustry,
      targetSize,
      prevSalary: prev > 0 ? prev : undefined,
      prevIndustry: prevIndustry || undefined,
      prevSize: prevSize || undefined,
      cpiFactor: cpi,
    });
  }, [roleId, city, targetIndustry, targetSize, prevSalary, prevIndustry, prevSize, cpi]);

  const matrixByIndustry = useMemo(() => {
    const map = new Map<string, typeof est.matrix>();
    for (const row of est.matrix) {
      const list = map.get(row.industryLabel) || [];
      list.push(row);
      map.set(row.industryLabel, list);
    }
    return Array.from(map.entries());
  }, [est.matrix]);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-xs muted">Gratis · actualizado {asOf}</p>
            <h1 className="text-xl font-semibold">Bandas por cargo, industria y tamaño</h1>
          </div>
          <SpeakButton text="Compara tu expectativa contra el mismo tipo de empresa e industria. Un sueldo alto en una grande no se traslada solo a una pequeña." />
        </div>
        <p className="text-sm muted leading-relaxed">
          El mismo cargo paga distinto en startup, mediana o multilatina, y según la industria.
          Ingresa tu último fijo para anclar piso/meta al segmento comparable.
        </p>
        <p
          className="text-xs leading-relaxed rounded-lg p-2"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid var(--border)" }}
          role="note"
        >
          {SALARY_DISCLAIMER_SHORT}
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">1. Cargo y ciudad</h2>
        <label className="text-sm block">
          Rol / familia
          <select className="field mt-1" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            {ROLE_FAMILIES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm block">
          Ciudad / modalidad
          <select className="field mt-1" value={city} onChange={(e) => setCity(e.target.value as CityTier)}>
            {(Object.keys(CITY_MULT) as CityTier[]).map((k) => (
              <option key={k} value={k}>
                {CITY_MULT[k].label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">2. Empresa a la que postulaste (segmento objetivo)</h2>
        <label className="text-sm block">
          Industria
          <select
            className="field mt-1"
            value={targetIndustry}
            onChange={(e) => setTargetIndustry(e.target.value as IndustryId)}
          >
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm block">
          Tamaño
          <select
            className="field mt-1"
            value={targetSize}
            onChange={(e) => setTargetSize(e.target.value as CompanySize)}
          >
            {COMPANY_SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {s.hint}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="text-sm font-semibold">3. Tu último empleo (ancla)</h2>
        <p className="text-xs muted">
          Obligatorio para comparar bien: sin esto, solo ves el mercado genérico del segmento objetivo.
        </p>
        <label className="text-sm block">
          Último salario fijo mensual (COP)
          <input
            className="field mt-1"
            inputMode="numeric"
            placeholder="Ej.: 10000000"
            value={prevSalary}
            onChange={(e) => setPrevSalary(e.target.value)}
          />
        </label>
        <label className="text-sm block">
          Industria anterior
          <select
            className="field mt-1"
            value={prevIndustry}
            onChange={(e) => setPrevIndustry(e.target.value as IndustryId | "")}
          >
            <option value="">— Elegir —</option>
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm block">
          Tamaño anterior
          <select
            className="field mt-1"
            value={prevSize}
            onChange={(e) => setPrevSize(e.target.value as CompanySize | "")}
          >
            <option value="">— Elegir —</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="bento-card space-y-3" style={{ borderColor: "var(--brand)" }}>
        <p className="text-xs muted">
          {est.target.role.note} · {est.target.industryLabel} · {est.target.sizeLabel} ·{" "}
          {est.target.cityLabel}
        </p>
        <p className="text-sm font-medium">Rango de mercado (segmento objetivo)</p>
        <p className="text-2xl font-semibold score-ring">
          {fmt(est.target.p25)} – {fmt(est.target.p75)}
        </p>
        <ul className="text-sm muted space-y-1">
          <li>p25: {fmt(est.target.p25)}</li>
          <li>p50 (medio): {fmt(est.target.p50)}</li>
          <li>p75: {fmt(est.target.p75)}</li>
        </ul>
        <div className="pt-2 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium">Tu ancla de negociación</p>
          <ul className="text-sm muted space-y-1">
            <li>Piso (no bajes): {fmt(est.floor)}</li>
            <li>Meta: {fmt(est.metaTarget)}</li>
            <li>Techo / stretch: {fmt(est.stretch)}</li>
          </ul>
        </div>
        {est.prevSalary && est.previousSegment ? (
          <p className="text-xs muted leading-relaxed">
            Tu último fijo {fmt(est.prevSalary)} · mercado de tu segmento anterior (
            {est.previousSegment.industryLabel} · {est.previousSegment.sizeLabel}):{" "}
            {fmt(est.previousSegment.p25)}–{fmt(est.previousSegment.p75)} (p50{" "}
            {fmt(est.previousSegment.p50)}).
          </p>
        ) : null}
        <p className="text-xs muted leading-relaxed pt-1">{SALARY_DISCLAIMER_SHORT}</p>
      </section>

      {est.warnings.length > 0 ? (
        <section className="bento-card space-y-2">
          <h2 className="text-sm font-semibold">Alertas de comparación</h2>
          <ul className="text-sm space-y-2" style={{ color: "var(--danger, #b42318)" }}>
            {est.warnings.map((w) => (
              <li key={w.slice(0, 48)}>• {w}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {est.guidance.length > 0 ? (
        <section className="bento-card space-y-2">
          <h2 className="text-sm font-semibold">Cómo leerlo</h2>
          <ul className="text-sm muted space-y-2">
            {est.guidance.map((g) => (
              <li key={g.slice(0, 48)}>• {g}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bento-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Matriz del cargo (industria × tamaño)</h2>
          <button type="button" className="text-sm muted" onClick={() => setShowFullMatrix((v) => !v)}>
            {showFullMatrix ? "Ocultar" : "Ver rangos"}
          </button>
        </div>
        <p className="text-xs muted">
          Mismos números que usa el cálculo. Úsalos para no mezclar “grande tech” con “pequeña retail”.
        </p>
        {showFullMatrix
          ? matrixByIndustry.map(([indLabel, rows]) => (
              <div key={indLabel} className="space-y-1">
                <p className="text-xs font-medium">{indLabel}</p>
                <ul className="text-xs muted space-y-1">
                  {rows.map((r) => (
                    <li key={r.industry + r.size}>
                      {r.sizeLabel}: {fmt(r.cell.p25)} – {fmt(r.cell.p75)}{" "}
                      <span className="opacity-70">(p50 {fmt(r.cell.p50)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : null}
      </section>

      <section className="bento-card space-y-2">
        <h2 className="text-sm font-semibold">Checklist negociación</h2>
        <ul className="text-sm muted space-y-1">
          {NEGOTIATION_CHECKLIST.map((c) => (
            <li key={c}>☐ {c}</li>
          ))}
        </ul>
      </section>

      <p className="text-xs muted leading-relaxed" role="note">
        {SALARY_LEGAL_NOTICE}
        {methodNote ? ` Actualización: ${methodNote}` : ""}
      </p>

      {!paid ? (
        <CareerUpsell
          context="Para practicar la negociación con scripts, coach y el módulo de oferta"
          nextHref="/outplacement/oferta"
        />
      ) : (
        <Link href="/outplacement/oferta" className="btn-primary">
          Ir a negociación guiada (Carrera)
        </Link>
      )}

      <Link href="/herramientas" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}

export default function Page() {
  const course = toolCourseById("bandas-salario");
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    setPaid(canAccessOutplacement(readEntitlement().plan));
  }, []);

  if (!course) return <SalarioTool />;
  if (!paid) return <SalarioTool />;
  return (
    <CourseWithTool course={course} defaultMode="practica">
      <SalarioTool />
    </CourseWithTool>
  );
}
