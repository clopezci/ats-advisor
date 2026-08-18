"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput } from "@/components/VoiceField";
import { CoachAsk } from "@/components/workbook/CoachAsk";
import { WorkbookModuleFooter } from "@/components/workbook/WorkbookModuleFooter";
import {
  NETWORK_TEMPLATES,
  fillNetworkTemplate,
  getNetworkTemplate,
  type NetworkAudienceId,
} from "@/lib/networking/templates";

const INTRO =
  "Banco de plantillas por audiencia. Elige el público, copia la versión corta o larga, personaliza los corchetes y registra el envío en tu CRM.";

export default function PlantillasNetworkingPage() {
  const [audience, setAudience] = useState<NetworkAudienceId>("excolega");
  const [vars, setVars] = useState<Record<string, string>>({
    Nombre: "",
    "Tu nombre": "",
    rol: "",
    resultado: "",
    Empresa: "",
    "favor concreto": "",
  });
  const [copied, setCopied] = useState("");

  const tpl = useMemo(() => getNetworkTemplate(audience), [audience]);
  const shortFilled = fillNetworkTemplate(tpl.short, vars);
  const longFilled = tpl.long ? fillNetworkTemplate(tpl.long, vars) : "";

  async function copy(text: string, which: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("error");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs muted">Cuadernillo · networking</p>
            <h1 className="text-2xl font-semibold">Plantillas por audiencia</h1>
          </div>
          <SpeakButton text={INTRO} />
        </div>
        <p className="text-sm muted leading-relaxed">{INTRO}</p>
        <p className="text-xs muted">
          Autoría ATSAdvisor. Combínalas con el marco de cercanos / aliados / conectores.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Audiencia</h2>
        <div className="flex flex-col gap-2">
          {NETWORK_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="btn-secondary text-left text-sm"
              style={
                audience === t.id
                  ? { borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }
                  : undefined
              }
              onClick={() => setAudience(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs muted">{tpl.tip}</p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Relleno rápido (opcional)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["Nombre", "Nombre del contacto"],
              ["Tu nombre", "Tu nombre"],
              ["rol", "Rol que buscas"],
              ["resultado", "Logro / resultado"],
              ["Empresa", "Empresa"],
              ["favor concreto", "Favor concreto"],
            ] as const
          ).map(([key, label]) => (
            <VoiceInput
              key={key}
              label={label}
              value={vars[key] || ""}
              onChange={(v) => setVars((prev) => ({ ...prev, [key]: v }))}
              className="field"
              dictationLabel="Dictar"
            />
          ))}
        </div>
      </section>

      {tpl.subject ? (
        <section className="bento-card space-y-2">
          <h2 className="font-semibold text-sm">Asunto (email)</h2>
          <pre className="text-sm whitespace-pre-wrap font-sans">
            {fillNetworkTemplate(tpl.subject, vars)}
          </pre>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => copy(fillNetworkTemplate(tpl.subject!, vars), "subj")}
          >
            {copied === "subj" ? "Copiado" : "Copiar asunto"}
          </button>
        </section>
      ) : null}

      {tpl.inmail ? (
        <section className="bento-card space-y-2">
          <h2 className="font-semibold text-sm">InMail / mensaje corto (~200)</h2>
          <p className="text-xs muted">{fillNetworkTemplate(tpl.inmail, vars).length} caracteres</p>
          <pre className="text-sm whitespace-pre-wrap font-sans">
            {fillNetworkTemplate(tpl.inmail, vars)}
          </pre>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => copy(fillNetworkTemplate(tpl.inmail!, vars), "inmail")}
          >
            {copied === "inmail" ? "Copiado" : "Copiar InMail"}
          </button>
        </section>
      ) : null}

      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-sm">Versión corta</h2>
          <SpeakButton text={shortFilled} />
        </div>
        <pre className="text-sm whitespace-pre-wrap leading-relaxed font-sans">{shortFilled}</pre>
        <button type="button" className="btn-primary" onClick={() => copy(shortFilled, "short")}>
          {copied === "short" ? "Copiado" : "Copiar corta"}
        </button>
      </section>

      {longFilled ? (
        <section className="bento-card space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-sm">Versión larga</h2>
            <SpeakButton text={longFilled.slice(0, 800)} />
          </div>
          <pre className="text-sm whitespace-pre-wrap leading-relaxed font-sans">{longFilled}</pre>
          <button type="button" className="btn-secondary" onClick={() => copy(longFilled, "long")}>
            {copied === "long" ? "Copiado" : "Copiar larga"}
          </button>
        </section>
      ) : null}

      <CoachAsk
        coachModule="networking"
        placeholder="Ej.: ¿cómo suavizo este mensaje a un gerente que no me conoce?"
      />

      <Link href="/outplacement/cuadernillo/red" className="btn-secondary">
        Registrar envío en CRM
      </Link>
      <Link href="/outplacement/cuadernillo/conectores" className="btn-secondary">
        Marco: cercanos, aliados, conectores
      </Link>
      <Link href="/outplacement/networking" className="btn-secondary">
        CRM herramienta (curso)
      </Link>

      <WorkbookModuleFooter />
    </div>
  );
}
