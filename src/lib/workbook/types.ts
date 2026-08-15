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
    title: "Marca y logros",
    goal: "Keywords, LinkedIn/CV y banco SOAR (vía herramientas).",
    href: "/herramientas/linkedin",
    coachModule: "marca personal",
    minutes: 40,
  },
  {
    id: "red",
    title: "Red de contactos",
    goal: "CRM y outreach con favor concreto.",
    href: "/outplacement/networking",
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

export type WorkbookState = {
  completed: Partial<Record<WorkbookModuleId, boolean>>;
  map: CareerMapData;
  scripts: ScriptsData;
  market: MarketChannelsData;
};

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
  };
}

const KEY = "ats_workbook_v1";

export function readWorkbook(): WorkbookState {
  if (typeof window === "undefined") return emptyWorkbook();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return emptyWorkbook();
    return { ...emptyWorkbook(), ...raw, map: { ...emptyWorkbook().map, ...raw.map }, scripts: { ...emptyWorkbook().scripts, ...raw.scripts }, market: { ...emptyWorkbook().market, ...raw.market } };
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
