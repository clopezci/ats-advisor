/** Cuadernillo digital ATSAdvisor (autoría propia). */

export type WorkbookModuleId =
  | "mapa"
  | "mercado"
  | "guiones"
  | "marca"
  | "red"
  | "entrevistas"
  | "compensacion"
  | "finanzas";

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
    id: "mercado",
    title: "Mercado: 3 canales",
    goal: "Red + páginas de empresa + portales, con mix de tiempo.",
    href: "/outplacement/cuadernillo/mercado",
    coachModule: "mercado y canales de búsqueda",
    minutes: 40,
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
    id: "red",
    title: "Red de contactos (CRM)",
    goal: "Contactos por categoría, favor concreto y follow-up.",
    href: "/outplacement/cuadernillo/red",
    coachModule: "networking",
    minutes: 30,
  },
  {
    id: "entrevistas",
    title: "Entrevistas",
    goal: "STAR/filtro y práctica con feedback.",
    href: "/outplacement/entrevista",
    coachModule: "entrevistas",
    minutes: 35,
  },
  {
    id: "compensacion",
    title: "Compensación",
    goal: "Paquete total y criterios de negociación.",
    href: "/outplacement/oferta",
    coachModule: "compensación y oferta",
    minutes: 30,
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
  notes: string;
};

export type MarketChannelsData = {
  timeMixNote: string;
  companies: MarketChannelCompany[];
  weeklyChecklistDone: string[];
  updatedAt?: number;
};

export type SoarEntry = {
  situation: string;
  obstacle: string;
  action: string;
  result: string;
  oneLiner: string;
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

export type WorkbookState = {
  completed: Partial<Record<WorkbookModuleId, boolean>>;
  map: CareerMapData;
  scripts: ScriptsData;
  market: MarketChannelsData;
  soar: SoarBankData;
  network: NetworkCrmData;
};

export const NETWORK_CATEGORIES: { id: NetworkCategory; label: string }[] = [
  { id: "cercano", label: "Cercano (confianza)" },
  { id: "excolega", label: "Excolega" },
  { id: "exjefe", label: "Exjefe / mentor" },
  { id: "puente", label: "Puente (otra industria/ciudad)" },
  { id: "reclutador", label: "Reclutador / hunter" },
  { id: "empresa_objetivo", label: "En empresa objetivo" },
];

export function emptySoarEntry(): SoarEntry {
  return { situation: "", obstacle: "", action: "", result: "", oneLiner: "" };
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
      companies: [
        { name: "", careersUrl: "", lastCheck: "", notes: "" },
        { name: "", careersUrl: "", lastCheck: "", notes: "" },
        { name: "", careersUrl: "", lastCheck: "", notes: "" },
      ],
      weeklyChecklistDone: [],
    },
    soar: {
      entries: [emptySoarEntry(), emptySoarEntry(), emptySoarEntry()],
    },
    network: {
      contacts: [emptyNetworkContact(), emptyNetworkContact(), emptyNetworkContact()],
      weeklyOutreachGoal: "5 mensajes personalizados + 1 follow-up",
    },
  };
}

const KEY = "ats_workbook_v1";

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
      market: { ...base.market, ...raw.market },
      soar: {
        ...base.soar,
        ...raw.soar,
        entries:
          Array.isArray(raw.soar?.entries) && raw.soar.entries.length
            ? raw.soar.entries.map((e: Partial<SoarEntry>) => ({ ...emptySoarEntry(), ...e }))
            : base.soar.entries,
      },
      network: {
        ...base.network,
        ...raw.network,
        contacts:
          Array.isArray(raw.network?.contacts) && raw.network.contacts.length
            ? raw.network.contacts.map((c: Partial<NetworkContact>) => ({
                ...emptyNetworkContact(),
                ...c,
              }))
            : base.network.contacts,
      },
    };
  } catch {
    return emptyWorkbook();
  }
}

export function writeWorkbook(state: WorkbookState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function workbookProgress(state: WorkbookState) {
  const total = WORKBOOK_MODULES.length;
  const done = WORKBOOK_MODULES.filter((m) => state.completed[m.id]).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function nextWorkbookModule(state: WorkbookState): WorkbookModuleDef | null {
  return WORKBOOK_MODULES.find((m) => !state.completed[m.id]) || null;
}

/** Frase SOAR en una línea (sugerencia local). */
export function composeSoarOneLiner(e: SoarEntry): string {
  const r = e.result.trim();
  const a = e.action.trim();
  const s = e.situation.trim();
  const o = e.obstacle.trim();
  if (!r && !a) return "";
  const parts = [
    r ? `Logré ${r}` : "Logré [resultado]",
    a ? `mediante ${a}` : null,
    s ? `en ${s}` : null,
    o ? `superando ${o}` : null,
  ].filter(Boolean);
  return parts.join(" ") + ".";
}
