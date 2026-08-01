"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { readProgress } from "@/lib/progress/courses";
import { planLabel, readEntitlement } from "@/lib/entitlements";
import { readOrg } from "@/lib/b2b/org";

export default function CertificadoPage() {
  const [name, setName] = useState("Candidato ATSAdvisor");
  const [modulesDone, setModulesDone] = useState(0);
  const [plan, setPlanState] = useState("Gratis");
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [accent, setAccent] = useState("var(--brand)");
  const [logo, setLogo] = useState("");
  const date = useMemo(() => new Date().toLocaleDateString("es-CO", { dateStyle: "long" }), []);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setName(p.name);
      const prog = readProgress();
      setModulesDone(Object.values(prog).reduce((a, x) => a + (x.completed?.length || 0), 0));
      setPlanState(planLabel(readEntitlement().plan));
      const org = readOrg();
      if (org) {
        setBrandName(org.name);
        setTagline(org.brandTagline || "");
        if (org.brandAccent) setAccent(org.brandAccent);
        if (org.logoDataUrl) setLogo(org.logoDataUrl);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const header = brandName ? `LOTIC · ATSAdvisor · ${brandName}` : "LOTIC · ATSAdvisor";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-start justify-between print:hidden">
        <h1 className="text-xl font-semibold">Certificado de avance</h1>
        <SpeakButton text="Tu certificado de avance en outplacement. Si hay empresa B2B, aparece co-branding." />
      </div>

      <article
        className="bento-card space-y-4 text-center"
        style={{
          border: `2px solid ${accent}`,
          padding: "2rem 1.25rem",
          background: "linear-gradient(165deg, #fff 0%, #f7f5fb 55%, #efe8ff 100%)",
        }}
      >
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={brandName || "Logo"} className="mx-auto h-14 object-contain" />
        )}
        <p className="text-xs uppercase tracking-[0.2em] muted">{header}</p>
        {tagline && <p className="text-sm muted">{tagline}</p>}
        <h2 className="text-2xl font-semibold">Certificado de avance</h2>
        <p className="text-sm muted">Se reconoce el progreso de</p>
        <p className="text-xl font-semibold" style={{ color: accent }}>
          {name}
        </p>
        <p className="text-sm leading-relaxed">
          Por completar <strong>{modulesDone}</strong> cápsulas de microlearning en la ruta de
          outplacement (plan {plan}), demostrando constancia en su transición profesional.
          {brandName ? ` Programa patrocinado por ${brandName}.` : ""}
        </p>
        <p className="text-xs muted">{date}</p>
        <p className="text-xs muted">Documento informativo · no constituye título académico</p>
      </article>

      <div className="flex flex-col gap-2 print:hidden">
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          Imprimir / guardar PDF
        </button>
        <Link href="/outplacement" className="btn-secondary">
          Volver
        </Link>
      </div>
    </div>
  );
}
