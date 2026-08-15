/** Cuadernillo digital ATSAdvisor (autoría propia). */

export type WorkbookModuleId =
  | "mapa"
  | "pruebas"
  | "mercado"
  | "guiones"
  | "marca"
  | "red"
  | "entrevistas"
  | "compensacion"
  | "finanzas"
  | "directorio"
  | "emprendimiento"
  | "evaluacion";

export type WorkbookModuleDef = {
  id: WorkbookModuleId;
  title: string;
  goal: string;
  href: string;
  coachModule: string;
  minutes: number;
};

export const WORKBOOK_MODULES: WorkbookModuleDef[] = [
  {
    id: "mapa",
    title: "Mapa de carrera",
    goal: "Propósito, visión, objetivo y fortalezas defendibles.",
    href: "/outplacement/cuadernillo/mapa",
    coachModule: "mapa de carrera",
    minutes: 45,
  },
  {
    id: "pruebas",
    title: "Competencias (autoeval)",
    goal: "12 competencias propias con evidencia — top 5 al mapa/CV.",
    href: "/outplacement/cuadernillo/pruebas",
    coachModule: "mapa de carrera",
    minutes: 30,
  },
  {
    id: "mercado",
    title: "Mercado: 3 canales",
    goal: "Red + páginas de empresa + portales, con mix de tiempo.",
    href: "/outplacement/cuadernillo/mercado",
    coachModule: "mercado y canales de búsqueda",
    minutes: 40,
  },
  {
    id: "red",
    title: "Red de contactos (CRM)",
    goal: "Contactos por categoría, favor concreto y follow-up.",
    href: "/outplacement/cuadernillo/red",
    coachModule: "networking",
    minutes: 30,
  },
  {
    id: "guiones",
    title: "Guiones y matriz",
    goal: "Pitch, razón de salida y mensajes por audiencia.",
    href: "/outplacement/cuadernillo/guiones",
    coachModule: "guiones de comunicación",
    minutes: 35,
  },
  {
    id: "marca",
    title: "Marca y logros SOAR",
    goal: "Banco de logros cuantificados para CV, perfil y entrevistas.",
    href: "/outplacement/cuadernillo/soar",
    coachModule: "marca personal y SOAR",
    minutes: 40,
  },
  {
    id: "entrevistas",
    title: "Entrevistas",
    goal: "Roleplay con rúbrica y práctica STAR.",
    href: "/outplacement/roleplay",
    coachModule: "entrevistas",
    minutes: 35,
  },
  {
    id: "evaluacion",
    title: "Cómo te evalúan",
    goal: "Etapas de selección y qué medir en cada una.",
    href: "/outplacement/cuadernillo/evaluacion",
    coachModule: "entrevistas",
    minutes: 25,
  },
  {
    id: "compensacion",
    title: "Compensación",
    goal: "Paquete total, criterios y piso/meta/techo.",
    href: "/outplacement/cuadernillo/compensacion",
    coachModule: "compensación y oferta",
    minutes: 30,
  },
  {
    id: "finanzas",
    title: "Finanzas de transición",
    goal: "4 pilares: pista, flujo, liquidación, piso de oferta.",
    href: "/outplacement/cuadernillo/finanzas",
    coachModule: "compensación y oferta",
    minutes: 35,
  },
  {
    id: "directorio",
    title: "Directorio reclutadores",
    goal: "Tu lista de hunters, HRBP y portales de carrera.",
    href: "/outplacement/cuadernillo/directorio",
    coachModule: "mercado y canales de búsqueda",
    minutes: 40,
  },
  {
    id: "emprendimiento",
    title: "Emprendimiento / puente",
    goal: "Filtro de 7 días: ¿puente, destino o pausa?",
    href: "/outplacement/cuadernillo/emprendimiento",
    coachModule: "mapa de carrera",
    minutes: 35,
  },
];

export type CareerMapData = {
  strengths: string;
  motivators: string;
  values: string;
  purpose: string;
  vision: string;
  objective: string;
  pillarsEducation: string;
  pillarsExperience: string;
  pillarsSkills: string;
  pillarsFit: string;
  updatedAt?: number;
};

export type ScriptsData = {
  pitch: string;
  exitReason: string;
  matrixNotes: string;
  updatedAt?: number;
};

export type MarketChannelCompany = {
  name: string;
  careersUrl: string;
  lastCheck: string;
  /** Qué te atrae / EVP percibido (cultura, impacto, aprendizaje…). */
  evp: string;
  /** Atributos EVP estructurados (cultura, impacto, aprendizaje, compensación, scope). */
  evpCulture: string;
  evpImpact: string;
  evpLearning: string;
  evpComp: string;
  evpScope: string;
  notes: string;
};

export type MarketChannelsData = {
  timeMixNote: string;
  companies: MarketChannelCompany[];
  /** Resumen top 5 empresas por EVP / fit. */
  evpTopSummary: string;
  weeklyChecklistDone: string[];
  updatedAt?: number;
};

export type SoarEntry = {
  situation: string;
  obstacle: string;
  action: string;
  result: string;
  oneLiner: string;
  /** Competencias / skills técnicas evidenciadas en este logro. */
  techSkills: string;
  /** Competencias blandas / liderazgo evidenciadas. */
  softSkills: string;
};

export type SoarBankData = {
  entries: SoarEntry[];
  updatedAt?: number;
};

export type NetworkCategory =
  | "cercano"
  | "excolega"
  | "exjefe"
  | "puente"
  | "reclutador"
  | "empresa_objetivo";

export type NetworkContact = {
  name: string;
  category: NetworkCategory;
  channel: string;
  favorAsked: string;
  lastTouch: string;
  nextFollowUp: string;
  status: "por_contactar" | "enviado" | "respondio" | "intro" | "cerrado";
  notes: string;
};

export type NetworkCrmData = {
  contacts: NetworkContact[];
  weeklyOutreachGoal: string;
  updatedAt?: number;
};

export type FinanceData = {
  monthlyFixed: string;
  runwayMonths: string;
  weeklyNotes: string;
  liquidationChecklist: string[];
  offerFloorNote: string;
  updatedAt?: number;
};

export type DirectoryEntry = {
  name: string;
  org: string;
  roles: string;
  channel: string;
  lastTouch: string;
  notes: string;
};

export type DirectoryData = {
  industry: string;
  city: string;
  entries: DirectoryEntry[];
  portalNotes: string;
  updatedAt?: number;
};

export type VentureData = {
  customerProblem: string;
  offerOneLiner: string;
  minPrice: string;
  prospects: string;
  weekConversations: string;
  monthCosts: string;
  goNoGo: string;
  /** Canvas corto: segmentos, canales, pipeline. */
  segments: string;
  channels: string;
  pipeline: string;
  updatedAt?: number;
};

export type EvaluationData = {
  notesByStage: string;
  threeStories: string;
  questionsReady: string;
  checklistDone: string[];
  updatedAt?: number;
};

export type FunnelWeek = {
  weekLabel: string;
  outreach: number;
  companyPages: number;
  applications: number;
  screens: number;
  interviews: number;
  offers: number;
  notes: string;
};

export type FunnelData = {
  weeks: FunnelWeek[];
  updatedAt?: number;
};

export type CompetenciesData = {
  ratings: { id: string; score: number; evidence: string }[];
  gap30Days: string;
  /** Perfil de estilo de comunicación (instrumento propio ATSAdvisor). */
  styleAnswers: Record<string, string>;
  styleSummary: string;
  updatedAt?: number;
};

export type CompensationData = {
  base: string;
  variable: string;
  benefits: string;
  flexibility: string;
  growth: string;
  floor: string;
  target: string;
  stretch: string;
  dealbreakers: string;
  negotiables: string;
  objectionScripts: string;
  updatedAt?: number;
};

export type WorkbookState = {
  completed: Partial<Record<WorkbookModuleId, boolean>>;
  map: CareerMapData;
  scripts: ScriptsData;
  market: MarketChannelsData;
  soar: SoarBankData;
  network: NetworkCrmData;
  finance: FinanceData;
  directory: DirectoryData;
  venture: VentureData;
  evaluation: EvaluationData;
  funnel: FunnelData;
  competencies: CompetenciesData;
  compensation: CompensationData;
  meta?: { updatedAt: number; syncedAt?: number };
};

export const NETWORK_CATEGORIES: { id: NetworkCategory; label: string }[] = [
  { id: "cercano", label: "Cercano (confianza)" },
  { id: "excolega", label: "Excolega" },
  { id: "exjefe", label: "Exjefe / mentor" },
  { id: "puente", label: "Puente (otra industria/ciudad)" },
  { id: "reclutador", label: "Reclutador / hunter" },
  { id: "empresa_objetivo", label: "En empresa objetivo" },
];

export const FINANCE_LIQUIDATION_CHECKS = [
  { id: "liq", label: "Pedí liquidación desglosada por escrito" },
  { id: "cert", label: "Guardé certificado laboral / terminación" },
  { id: "salud", label: "Revisé cobertura salud / caja / fechas" },
  { id: "deudas", label: "Ajusté mínimos de deudas al flujo semanal" },
  { id: "cesantias", label: "Revisé cesantías / intereses (si aplica CO)" },
  { id: "vacaciones", label: "Validé vacaciones pendientes en la liquidación" },
  { id: "arl", label: "Confirmé fin de cobertura ARL / riesgos" },
  { id: "cuenta", label: "Tengo cuenta y documentos listos para nueva vinculación" },
];

export const EVAL_CHECKS = [
  { id: "ats", label: "Sé qué mide el ATS en mi CV (keywords honestas)" },
  { id: "filtro", label: "Tengo pitch 60s + logística + pretensión" },
  { id: "hm", label: "3 historias STAR/SOAR listas para hiring manager" },
  { id: "panel", label: "2 preguntas inteligentes por etapa" },
  { id: "assess", label: "Sé qué suele medir un assessment / caso" },
  { id: "refs", label: "Avisé a 2 referencias y alineé mensajes" },
  { id: "post", label: "Después de cada entrevista anoto qué midieron" },
];

export function emptySoarEntry(): SoarEntry {
  return {
    situation: "",
    obstacle: "",
    action: "",
    result: "",
    oneLiner: "",
    techSkills: "",
    softSkills: "",
  };
}

export function emptyMarketCompany(): MarketChannelCompany {
  return {
    name: "",
    careersUrl: "",
    lastCheck: "",
    evp: "",
    evpCulture: "",
    evpImpact: "",
    evpLearning: "",
    evpComp: "",
    evpScope: "",
    notes: "",
  };
}

export function emptyNetworkContact(): NetworkContact {
  return {
    name: "",
    category: "excolega",
    channel: "",
    favorAsked: "",
    lastTouch: "",
    nextFollowUp: "",
    status: "por_contactar",
    notes: "",
  };
}

export function emptyDirectoryEntry(): DirectoryEntry {
  return { name: "", org: "", roles: "", channel: "", lastTouch: "", notes: "" };
}

export function emptyFunnelWeek(): FunnelWeek {
  return {
    weekLabel: "",
    outreach: 0,
    companyPages: 0,
    applications: 0,
    screens: 0,
    interviews: 0,
    offers: 0,
    notes: "",
  };
}

export function emptyWorkbook(): WorkbookState {
  return {
    completed: {},
    map: {
      strengths: "",
      motivators: "",
      values: "",
      purpose: "",
      vision: "",
      objective: "",
      pillarsEducation: "",
      pillarsExperience: "",
      pillarsSkills: "",
      pillarsFit: "",
    },
    scripts: { pitch: "", exitReason: "", matrixNotes: "" },
    market: {
      timeMixNote: "40% red · 35% empresas · 25% portales",
      companies: [emptyMarketCompany(), emptyMarketCompany(), emptyMarketCompany()],
      evpTopSummary: "",
      weeklyChecklistDone: [],
    },
    soar: {
      entries: [emptySoarEntry(), emptySoarEntry(), emptySoarEntry()],
    },
    network: {
      contacts: [emptyNetworkContact(), emptyNetworkContact(), emptyNetworkContact()],
      weeklyOutreachGoal: "5 mensajes personalizados + 1 follow-up",
    },
    finance: {
      monthlyFixed: "",
      runwayMonths: "",
      weeklyNotes: "",
      liquidationChecklist: [],
      offerFloorNote: "",
    },
    directory: {
      industry: "",
      city: "",
      entries: [emptyDirectoryEntry(), emptyDirectoryEntry(), emptyDirectoryEntry()],
      portalNotes: "",
    },
    venture: {
      customerProblem: "",
      offerOneLiner: "",
      minPrice: "",
      prospects: "",
      weekConversations: "",
      monthCosts: "",
      goNoGo: "",
      segments: "",
      channels: "",
      pipeline: "",
    },
    evaluation: {
      notesByStage: "",
      threeStories: "",
      questionsReady: "",
      checklistDone: [],
    },
    funnel: {
      weeks: [{ ...emptyFunnelWeek(), weekLabel: "Esta semana" }],
    },
    competencies: {
      ratings: [],
      gap30Days: "",
      styleAnswers: {},
      styleSummary: "",
    },
    compensation: {
      base: "",
      variable: "",
      benefits: "",
      flexibility: "",
      growth: "",
      floor: "",
      target: "",
      stretch: "",
      dealbreakers: "",
      negotiables: "",
      objectionScripts: "",
    },
    meta: { updatedAt: 0 },
  };
}

const KEY = "ats_workbook_v1";

function mergeList<T>(raw: unknown, fallback: T[], fill: (p: Partial<T>) => T): T[] {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((e) => fill(e as Partial<T>));
}

export function readWorkbook(): WorkbookState {
  if (typeof window === "undefined") return emptyWorkbook();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return emptyWorkbook();
    const base = emptyWorkbook();
    return {
      ...base,
      ...raw,
      map: { ...base.map, ...raw.map },
      scripts: { ...base.scripts, ...raw.scripts },
      market: {
        ...base.market,
        ...raw.market,
        companies: mergeList(raw.market?.companies, base.market.companies, (c) => ({
          ...emptyMarketCompany(),
          ...c,
        })),
      },
      soar: {
        ...base.soar,
        ...raw.soar,
        entries: mergeList(raw.soar?.entries, base.soar.entries, (e) => ({
          ...emptySoarEntry(),
          ...e,
        })),
      },
      network: {
        ...base.network,
        ...raw.network,
        contacts: mergeList(raw.network?.contacts, base.network.contacts, (c) => ({
          ...emptyNetworkContact(),
          ...c,
        })),
      },
      finance: { ...base.finance, ...raw.finance },
      directory: {
        ...base.directory,
        ...raw.directory,
        entries: mergeList(raw.directory?.entries, base.directory.entries, (e) => ({
          ...emptyDirectoryEntry(),
          ...e,
        })),
      },
      venture: { ...base.venture, ...raw.venture },
      evaluation: { ...base.evaluation, ...raw.evaluation },
      funnel: {
        ...base.funnel,
        ...raw.funnel,
        weeks: mergeList(raw.funnel?.weeks, base.funnel.weeks, (w) => ({
          ...emptyFunnelWeek(),
          ...w,
        })),
      },
      competencies: {
        ...base.competencies,
        ...raw.competencies,
        ratings: Array.isArray(raw.competencies?.ratings) ? raw.competencies.ratings : [],
        styleAnswers: {
          ...base.competencies.styleAnswers,
          ...(raw.competencies?.styleAnswers || {}),
        },
      },
      compensation: {
        ...base.compensation,
        ...raw.compensation,
        objectionScripts: raw.compensation?.objectionScripts || "",
      },
      meta: { ...base.meta, ...raw.meta },
    };
  } catch {
    return emptyWorkbook();
  }
}

export function writeWorkbook(
  state: WorkbookState,
  opts?: { skipCloudPush?: boolean }
) {
  const next: WorkbookState = {
    ...state,
    meta: {
      syncedAt: state.meta?.syncedAt,
      updatedAt: opts?.skipCloudPush
        ? Number(state.meta?.updatedAt) || Date.now()
        : Date.now(),
    },
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  if (!opts?.skipCloudPush && typeof window !== "undefined") {
    void import("@/lib/workbook/cloudSync")
      .then((m) => m.scheduleWorkbookCloudPush(next))
      .catch(() => undefined);
  }
}

export function workbookProgress(state: WorkbookState) {
  const total = WORKBOOK_MODULES.length;
  const done = WORKBOOK_MODULES.filter((m) => state.completed[m.id]).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function nextWorkbookModule(state: WorkbookState): WorkbookModuleDef | null {
  return WORKBOOK_MODULES.find((m) => !state.completed[m.id]) || null;
}

export function composeSoarOneLiner(e: SoarEntry): string {
  const s = e.situation.trim();
  const o = e.obstacle.trim();
  const a = e.action.trim();
  const r = e.result.trim();
  if (!a && !r) return "";
  const parts = [
    r ? `Logré ${r}` : "Logré [resultado]",
    a ? `mediante ${a}` : "",
    s ? `en ${s}` : "",
    o ? `superando ${o}` : "",
  ].filter(Boolean);
  return parts.join(" ").replace(/\s+/g, " ").trim() + ".";
}

/** Export plano para CV / LinkedIn (una línea por logro). */
export function exportSoarForCv(entries: SoarEntry[]): string {
  return entries
    .filter((e) => e.oneLiner.trim() || e.result.trim())
    .map((e, i) => {
      const line = e.oneLiner.trim() || composeSoarOneLiner(e);
      const skills = [e.techSkills, e.softSkills].filter((x) => x.trim()).join(" · ");
      return `${i + 1}. ${line}${skills ? `\n   Skills: ${skills}` : ""}`;
    })
    .join("\n\n");
}

/** Texto plano para exportar / imprimir. */
export function workbookToPlainText(state: WorkbookState): string {
  const lines: string[] = ["# Mi cuadernillo ATSAdvisor", ""];
  const m = state.map;
  lines.push(
    "## Mapa",
    `Objetivo: ${m.objective}`,
    `Propósito: ${m.purpose}`,
    `Visión: ${m.vision}`,
    `Fortalezas: ${m.strengths}`,
    ""
  );
  lines.push("## Guiones", `Pitch: ${state.scripts.pitch}`, `Salida: ${state.scripts.exitReason}`, "");
  lines.push("## SOAR");
  state.soar.entries.forEach((e, i) => {
    if (e.oneLiner || e.result) {
      lines.push(`${i + 1}. ${e.oneLiner || e.result}`);
      if (e.techSkills || e.softSkills) {
        lines.push(`   Skills: ${[e.techSkills, e.softSkills].filter(Boolean).join(" · ")}`);
      }
    }
  });
  lines.push("", "## Red");
  state.network.contacts.forEach((c) => {
    if (c.name) lines.push(`- ${c.name} (${c.category}) · ${c.status} · ${c.favorAsked}`);
  });
  lines.push("", "## Finanzas", `Pista (meses): ${state.finance.runwayMonths}`, state.finance.offerFloorNote, "");
  lines.push("## Compensación", `Piso: ${state.compensation.floor}`, `Meta: ${state.compensation.target}`, "");
  lines.push("## Emprendimiento", state.venture.offerOneLiner, state.venture.goNoGo, "");
  lines.push("## Competencias top");
  [...state.competencies.ratings]
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .forEach((r) => lines.push(`- ${r.id}: ${r.score}/5 ${r.evidence}`));
  lines.push("", "## Funnel");
  state.funnel.weeks.forEach((w) => {
    lines.push(
      `${w.weekLabel}: outreach ${w.outreach}, empresas ${w.companyPages}, postulaciones ${w.applications}, filtros ${w.screens}, entrevistas ${w.interviews}, ofertas ${w.offers}`
    );
  });
  return lines.join("\n");
}
