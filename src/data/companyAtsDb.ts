import type { AtsProfile } from "@/lib/ats/engine";

/**
 * Base “externa” embebida: dominio de empresa / carrera → ATS más usado.
 * Ampliable; se cruza con URL y texto de la oferta.
 */
export type CompanyAtsEntry = {
  domain: string;
  name: string;
  ats: AtsProfile;
  region?: string;
  notes?: string;
};

export const COMPANY_ATS_DB: CompanyAtsEntry[] = [
  // Global tech / product
  { domain: "google.com", name: "Google", ats: "greenhouse", region: "global" },
  { domain: "meta.com", name: "Meta", ats: "workday", region: "global" },
  { domain: "microsoft.com", name: "Microsoft", ats: "workday", region: "global" },
  { domain: "amazon.com", name: "Amazon", ats: "workday", region: "global" },
  { domain: "apple.com", name: "Apple", ats: "workday", region: "global" },
  { domain: "netflix.com", name: "Netflix", ats: "greenhouse", region: "global" },
  { domain: "spotify.com", name: "Spotify", ats: "greenhouse", region: "global" },
  { domain: "uber.com", name: "Uber", ats: "greenhouse", region: "global" },
  { domain: "airbnb.com", name: "Airbnb", ats: "greenhouse", region: "global" },
  { domain: "stripe.com", name: "Stripe", ats: "greenhouse", region: "global" },
  { domain: "shopify.com", name: "Shopify", ats: "greenhouse", region: "global" },
  { domain: "salesforce.com", name: "Salesforce", ats: "workday", region: "global" },
  { domain: "oracle.com", name: "Oracle", ats: "taleo", region: "global" },
  { domain: "sap.com", name: "SAP", ats: "successfactors", region: "global" },
  { domain: "ibm.com", name: "IBM", ats: "workday", region: "global" },
  { domain: "accenture.com", name: "Accenture", ats: "workday", region: "global" },
  { domain: "deloitte.com", name: "Deloitte", ats: "workday", region: "global" },
  { domain: "pwc.com", name: "PwC", ats: "workday", region: "global" },
  { domain: "ey.com", name: "EY", ats: "workday", region: "global" },
  { domain: "kpmg.com", name: "KPMG", ats: "workday", region: "global" },
  // LATAM / Colombia
  { domain: "bancolombia.com", name: "Bancolombia", ats: "successfactors", region: "CO" },
  { domain: "grupoaval.com", name: "Grupo Aval", ats: "successfactors", region: "CO" },
  { domain: "davivienda.com", name: "Davivienda", ats: "successfactors", region: "CO" },
  { domain: "bancodebogota.com", name: "Banco de Bogotá", ats: "successfactors", region: "CO" },
  { domain: "ecopetrol.com.co", name: "Ecopetrol", ats: "successfactors", region: "CO" },
  { domain: "avianca.com", name: "Avianca", ats: "workday", region: "CO" },
  { domain: "rappi.com", name: "Rappi", ats: "greenhouse", region: "LATAM" },
  { domain: "mercadolibre.com", name: "Mercado Libre", ats: "workday", region: "LATAM" },
  { domain: "mercadolivre.com", name: "Mercado Livre", ats: "workday", region: "LATAM" },
  { domain: "globant.com", name: "Globant", ats: "workday", region: "LATAM" },
  { domain: "accenture.com.co", name: "Accenture CO", ats: "workday", region: "CO" },
  { domain: "softtek.com", name: "Softtek", ats: "workday", region: "LATAM" },
  { domain: "cemex.com", name: "CEMEX", ats: "successfactors", region: "LATAM" },
  { domain: "femsa.com", name: "FEMSA", ats: "successfactors", region: "MX" },
  { domain: "america-movil.com", name: "América Móvil", ats: "successfactors", region: "LATAM" },
  { domain: "claro.com.co", name: "Claro CO", ats: "successfactors", region: "CO" },
  { domain: "movistar.co", name: "Movistar CO", ats: "successfactors", region: "CO" },
  { domain: "tigo.com.co", name: "Tigo CO", ats: "successfactors", region: "CO" },
  { domain: "sura.com", name: "SURA", ats: "successfactors", region: "CO" },
  { domain: "nutresa.com", name: "Nutresa", ats: "successfactors", region: "CO" },
  { domain: "argos.co", name: "Cementos Argos", ats: "successfactors", region: "CO" },
  { domain: "isa.co", name: "ISA", ats: "successfactors", region: "CO" },
  { domain: "epm.com.co", name: "EPM", ats: "successfactors", region: "CO" },
  { domain: "une.com.co", name: "UNE", ats: "successfactors", region: "CO" },
  { domain: "falabella.com", name: "Falabella", ats: "workday", region: "LATAM" },
  { domain: "cencosud.com", name: "Cencosud", ats: "workday", region: "LATAM" },
  { domain: "latam.com", name: "LATAM Airlines", ats: "workday", region: "LATAM" },
  { domain: "nubank.com", name: "Nubank", ats: "greenhouse", region: "LATAM" },
  { domain: "nu.com.co", name: "Nu Colombia", ats: "greenhouse", region: "CO" },
  { domain: "dlocal.com", name: "dLocal", ats: "greenhouse", region: "LATAM" },
  { domain: "pedidosya.com", name: "PedidosYa", ats: "greenhouse", region: "LATAM" },
  { domain: "cornershopapp.com", name: "Cornershop", ats: "greenhouse", region: "LATAM" },
  { domain: "bbva.com.co", name: "BBVA Colombia", ats: "successfactors", region: "CO" },
  { domain: "scotiabankcolpatria.com", name: "Scotiabank Colpatria", ats: "workday", region: "CO" },
  { domain: "itaucolombia.com", name: "Itaú Colombia", ats: "successfactors", region: "CO" },
  { domain: "github.com", name: "GitHub", ats: "greenhouse", region: "global" },
  { domain: "gitlab.com", name: "GitLab", ats: "greenhouse", region: "global" },
  { domain: "atlassian.com", name: "Atlassian", ats: "greenhouse", region: "global" },
  { domain: "asana.com", name: "Asana", ats: "greenhouse", region: "global" },
  { domain: "notion.so", name: "Notion", ats: "greenhouse", region: "global" },
];

/** Normaliza dominio (quita www, paths). */
export function normalizeDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "").replace(/^www\./, "");
  d = d.split("/")[0].split("?")[0];
  return d;
}

export function lookupCompanyAts(query: {
  domain?: string;
  companyName?: string;
  emailOrUrl?: string;
}): CompanyAtsEntry | null {
  const candidates: string[] = [];
  if (query.domain) candidates.push(normalizeDomain(query.domain));
  if (query.emailOrUrl) {
    const m = query.emailOrUrl.match(/@([a-z0-9.-]+\.[a-z]{2,})/i);
    if (m) candidates.push(normalizeDomain(m[1]));
    try {
      const host = new URL(
        query.emailOrUrl.startsWith("http") ? query.emailOrUrl : `https://${query.emailOrUrl}`
      ).hostname;
      candidates.push(normalizeDomain(host));
    } catch {
      /* ignore */
    }
  }

  for (const c of candidates) {
    const hit =
      COMPANY_ATS_DB.find((e) => e.domain === c) ||
      COMPANY_ATS_DB.find((e) => c.endsWith(`.${e.domain}`) || e.domain.endsWith(`.${c}`));
    if (hit) return hit;
  }

  if (query.companyName) {
    const n = query.companyName.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    const byName = COMPANY_ATS_DB.find((e) => {
      const en = e.name.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
      return n.includes(en) || en.includes(n);
    });
    if (byName) return byName;
  }

  return null;
}

/** Extrae posibles dominios / empresas del texto de oferta. */
export function extractCompanyHints(jobText: string, jobUrl?: string): { domains: string[]; names: string[] } {
  const domains = new Set<string>();
  const names: string[] = [];
  if (jobUrl) {
    try {
      domains.add(normalizeDomain(new URL(jobUrl).hostname));
    } catch {
      /* ignore */
    }
  }
  const urlMatches = jobText.matchAll(/https?:\/\/(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/gi);
  for (const m of urlMatches) domains.add(normalizeDomain(m[1]));
  const emailMatches = jobText.matchAll(/@([a-z0-9.-]+\.[a-z]{2,})/gi);
  for (const m of emailMatches) domains.add(normalizeDomain(m[1]));

  const companyLine = jobText.match(/(?:empresa|compañía|compania|about\s+us|sobre\s+nosotros)[:\s]+([^\n.]{3,60})/i);
  if (companyLine) names.push(companyLine[1].trim());

  return { domains: [...domains], names };
}
