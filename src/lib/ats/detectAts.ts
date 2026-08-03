import type { AtsProfile } from "@/lib/ats/engine";
import {
  COMPANY_ATS_DB,
  extractCompanyHints,
  lookupCompanyAts,
  type CompanyAtsEntry,
} from "@/data/companyAtsDb";

export type AtsDetection = {
  profile: AtsProfile;
  confidence: "high" | "medium" | "low";
  reason: string;
  signals: string[];
  company?: { name: string; domain: string };
};

const URL_RULES: { re: RegExp; profile: AtsProfile; label: string }[] = [
  { re: /myworkdayjobs\.com|workday\.com|wd\d+\.myworkday/i, profile: "workday", label: "URL Workday" },
  { re: /greenhouse\.io|boards\.greenhouse|job-boards\.greenhouse/i, profile: "greenhouse", label: "URL Greenhouse" },
  { re: /jobs\.lever\.co|lever\.co\/.*\/jobs/i, profile: "lever", label: "URL Lever" },
  { re: /taleo\.net|oraclecloud\.com\/.*taleo|tbe\.taleo/i, profile: "taleo", label: "URL Taleo" },
  { re: /successfactors\.|sap\.com\/.*career|jobs\.sap\./i, profile: "successfactors", label: "URL SuccessFactors/SAP" },
  { re: /icims\.com/i, profile: "generic", label: "URL iCIMS (genérico)" },
  { re: /smartrecruiters\.com/i, profile: "generic", label: "URL SmartRecruiters" },
  { re: /bamboohr\.com/i, profile: "generic", label: "URL BambooHR" },
  { re: /linkedin\.com\/jobs/i, profile: "generic", label: "LinkedIn Jobs" },
  { re: /computrabajo\.|elempleo\.|magneto365\.|indeed\.|occmundiale/i, profile: "generic", label: "Portal LATAM/empleo" },
];

const TEXT_RULES: { re: RegExp; profile: AtsProfile; label: string }[] = [
  { re: /\bworkday\b/i, profile: "workday", label: "Mención Workday" },
  { re: /\bgreenhouse\b/i, profile: "greenhouse", label: "Mención Greenhouse" },
  { re: /\blever\b/i, profile: "lever", label: "Mención Lever" },
  { re: /\btaleo\b/i, profile: "taleo", label: "Mención Taleo" },
  { re: /\bsuccessfactors\b|\bsap success/i, profile: "successfactors", label: "Mención SuccessFactors" },
  { re: /\bpowered by sap\b|\bcandidatos? sap\b/i, profile: "sap", label: "Mención SAP ATS" },
];

function fromCompany(entry: CompanyAtsEntry, via: string): AtsDetection {
  return {
    profile: entry.ats,
    confidence: "high",
    reason: `${entry.name} (${entry.domain}) suele usar ${entry.ats}. ${via}`,
    signals: [`Base empresas: ${entry.name}`, via],
    company: { name: entry.name, domain: entry.domain },
  };
}

/**
 * Detecta el ATS: URL del portal → base por dominio de empresa → menciones en texto.
 */
export function detectAtsProfile(input: {
  jobText?: string;
  jobUrl?: string;
  companyDomain?: string;
  companyName?: string;
}): AtsDetection {
  const signals: string[] = [];
  const url = (input.jobUrl || "").trim();
  const text = `${url}\n${input.jobText || ""}`;

  for (const rule of URL_RULES) {
    if (url && rule.re.test(url)) {
      signals.push(rule.label);
      // Si además hay match de empresa, enriquecer razón
      const company =
        lookupCompanyAts({
          domain: input.companyDomain,
          companyName: input.companyName,
          emailOrUrl: url,
        }) || null;
      return {
        profile: rule.profile,
        confidence: "high",
        reason: `Detectamos ${rule.label}. Ajustamos tips y pesos del análisis.`,
        signals,
        company: company ? { name: company.name, domain: company.domain } : undefined,
      };
    }
  }

  for (const rule of URL_RULES) {
    if (rule.re.test(text)) {
      signals.push(`${rule.label} (en el texto)`);
      return {
        profile: rule.profile,
        confidence: "high",
        reason: `Encontramos ${rule.label} dentro de la oferta.`,
        signals,
      };
    }
  }

  // Base por dominio / nombre de empresa
  const direct = lookupCompanyAts({
    domain: input.companyDomain,
    companyName: input.companyName,
    emailOrUrl: url || input.companyDomain,
  });
  if (direct) return fromCompany(direct, "Coincidencia directa en base de dominios.");

  const hints = extractCompanyHints(input.jobText || "", url);
  for (const d of hints.domains) {
    const hit = lookupCompanyAts({ domain: d });
    if (hit) return fromCompany(hit, "Dominio encontrado en la oferta/URL.");
  }
  for (const n of hints.names) {
    const hit = lookupCompanyAts({ companyName: n });
    if (hit) return fromCompany(hit, "Nombre de empresa detectado en el aviso.");
  }

  // Búsqueda difusa: alguna empresa de la DB mencionada en el texto
  const textN = text.toLowerCase();
  for (const e of COMPANY_ATS_DB) {
    if (textN.includes(e.name.toLowerCase()) || textN.includes(e.domain.replace(/\.\w+$/, ""))) {
      return fromCompany(e, "Mención de empresa en el texto de la vacante.");
    }
  }

  for (const rule of TEXT_RULES) {
    if (rule.re.test(text)) {
      signals.push(rule.label);
      return {
        profile: rule.profile,
        confidence: "medium",
        reason: `${rule.label} en el aviso. Confirma si es el portal real.`,
        signals,
      };
    }
  }

  if (/computrabajo|elempleo|magneto|occmundiale|linkedin/i.test(text)) {
    signals.push("Portal de empleo detectado");
    return {
      profile: "generic",
      confidence: "medium",
      reason: "Portal de empleo detectado; usamos perfil genérico (completa bien el formulario).",
      signals,
    };
  }

  return {
    profile: "generic",
    confidence: "low",
    reason: "No identificamos el ATS. Elige manualmente o indica el dominio de la empresa.",
    signals: ["Sin señales claras"],
  };
}
