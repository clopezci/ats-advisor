/** Curso del rol anclado al aviso: áreas, herramientas, KPIs, controles y cómo hacerlo. */

import type { RoleReviewFamily } from "./types";

export type LessonBlock = {
  heading: string;
  /** Texto corrido. Si hay `points`, es el respaldo para lectores que no pintan la lista. */
  body: string;
  points?: string[];
  note?: string;
};

export type RoleCourseInput = {
  jobTitle: string;
  jobText?: string;
  family?: RoleReviewFamily;
  /** Tema del día (si viene vacío, se arma el mapa del cargo). */
  term?: string;
};

type RolePack = {
  areas: string[];
  mustKnow: string[];
  tools: string[];
  stakeholders: string[];
  registers: string[];
  controls: string[];
  kpis: string[];
  communications: string[];
  howTo: string[];
  firstMonth: string[];
};

const DIGITAL_TRANSFORM: RolePack = {
  areas: [
    "Estrategia digital y hoja de ruta (priorizar iniciativas, no solo proyectos sueltos)",
    "Gestión del cambio y adopción (personas, procesos, resistencia)",
    "Arquitectura / plataforma y datos (qué se construye y con qué criterio)",
    "Gobierno, riesgos, presupuesto y proveedores",
    "Medición de valor (KPI/OKR) y comunicación a dirección",
  ],
  mustKnow: [
    "Cómo se decide el portafolio: impacto, esfuerzo, riesgo y dependencia",
    "Diagnóstico de madurez digital (procesos, datos, canales, cultura)",
    "Modelo operativo: quién aprueba, quién ejecuta, quién opera",
    "Gestión de stakeholders y sponsoring ejecutivo",
    "Criterios de éxito más allá de “entregar el proyecto”",
  ],
  tools: [
    "Roadmap / portafolio (Jira Align, Azure DevOps, Notion, Miro o el tablero que use la empresa)",
    "OKR o tablero de indicadores (Excel/Power BI si no hay suite)",
    "CRM / ERP / core del negocio que la transformación toca",
    "Herramientas de colaboración y change (SharePoint, Teams, encuestas de adopción)",
  ],
  stakeholders: [
    "Patrocinador ejecutivo y comité de transformación",
    "Dueños de proceso (negocio) y áreas operativas impactadas",
    "TI / arquitectura / seguridad / datos",
    "Finanzas (presupuesto y ROI) y proveedores / integradores",
  ],
  registers: [
    "Backlog priorizado de iniciativas y dependencias",
    "RAID (riesgos, supuestos, issues, decisiones)",
    "Plan de adopción y comunicaciones por audiencia",
    "Registro de beneficios esperados vs logrados",
  ],
  controls: [
    "Gate de go/no-go por fase (descubrimiento → piloto → escala)",
    "Revisión de presupuesto y alcance cada sprint/mes",
    "Control de cambio: qué se aprueba fuera del plan",
    "Seguridad y cumplimiento cuando se tocan datos o canales",
  ],
  kpis: [
    "Adopción real (uso, no solo “go-live”)",
    "Tiempo a valor (días hasta el primer beneficio medible)",
    "Costo vs beneficio / payback",
    "Reducción de fricción operativa (errores, reproceso, tiempo de ciclo)",
    "Satisfacción de usuarios internos o clientes del proceso tocado",
  ],
  communications: [
    "Update semanal al sponsor: avance, bloqueo, decisión pedida",
    "Narrativa de cambio a las áreas: qué cambia para ellas y cuándo",
    "Demo corta de valor (antes/después) cada 2–4 semanas",
    "Escalamiento claro cuando falta decisión o presupuesto",
  ],
  howTo: [
    "Parte el aviso en 5–7 iniciativas concretas (no eslóganes).",
    "Para cada una: objetivo, dueño de negocio, métrica, riesgo y primer entregable en 2 semanas.",
    "Arma un piloto pequeño que demuestre valor antes de escalar.",
    "Deja por escrito decisiones y supuestos; sin eso el programa se diluye.",
  ],
  firstMonth: [
    "Semana 1: mapa de stakeholders, vocabulario del aviso y estado real (no el discurso).",
    "Semana 2: backlog priorizado + 1 piloto con métrica de adopción.",
    "Semana 3: rituales (comité, RAID, update) y primer corte de riesgos.",
    "Semana 4: demo de valor + ajuste de roadmap con el sponsor.",
  ],
};

const OPS_PLATFORM: RolePack = {
  areas: [
    "Operación de plataforma / infraestructura (disponibilidad y continuidad)",
    "Incidentes, problemas y cambios (ITIL o equivalente)",
    "Observabilidad, capacidad y costo (FinOps si aplica)",
    "Seguridad operativa y cumplimiento",
    "Relación con desarrollo, negocio y proveedores cloud",
  ],
  mustKnow: [
    "Priorizar incidentes por impacto al negocio",
    "SLAs/SLOs y qué hacer cuando se rompen",
    "Cambios controlados vs hotfixes",
    "Señales de telemetría: logs, métricas, trazas",
  ],
  tools: ["Cloud (AWS/Azure/GCP)", "Monitoreo / APM", "ITSM (ServiceNow u otro)", "CI/CD y automatización", "Tablero de KPIs/SLA"],
  stakeholders: ["Soporte N1/N2", "Desarrollo / SRE", "Seguridad", "Negocio dueño del servicio", "Proveedor cloud"],
  registers: ["Cola de incidentes", "Cambios programados", "Postmortems", "Capacidad y costo"],
  controls: ["Ventana de cambio", "Rollback", "Escalamiento", "Revisión de postmortems"],
  kpis: ["Disponibilidad", "MTTR", "Cambios fallidos", "Costo cloud", "Cumplimiento de SLA"],
  communications: ["Update de incidente", "CAB / cambio", "Informe semanal de salud"],
  howTo: [
    "Traduce el aviso a servicios críticos y sus dueños.",
    "Define qué miras cada mañana (cola, cambios, alarmas).",
    "Practica un incidente: hipótesis, comunicación, cierre.",
  ],
  firstMonth: [
    "Semana 1: mapa de servicios y turnos.",
    "Semana 2: un incidente acompañado + nota de cierre.",
    "Semana 3: un cambio con checklist.",
    "Semana 4: informe de salud con 3 KPIs.",
  ],
};

const DATA_PACK: RolePack = {
  areas: ["Definición de métricas", "Calidad de datos", "Reportes / dashboards", "Peticiones de negocio", "Gobierno"],
  mustKnow: ["Definición de KPI", "Fuente y grano", "Trampas de interpretación", "Priorizar pedidos"],
  tools: ["SQL", "Power BI / Tableau", "Warehouse / lake", "Tickets de data"],
  stakeholders: ["Negocio", "Ingeniería de datos", "Finanzas", "Producto"],
  registers: ["Catálogo de métricas", "Cola de pedidos", "Incidentes de dato"],
  controls: ["Validación de cifras", "Accesos", "Cambios de definición"],
  kpis: ["Tiempo de entrega", "Errores de reporte", "Adopción del dashboard"],
  communications: ["Brief al stakeholder", "Nota de hallazgo", "Pregunta de negocio"],
  howTo: ["Elige 1 KPI del aviso y escríbelo con definición y fuente.", "Simula una caída del indicador y el checklist de revisión."],
  firstMonth: ["Semana 1: glosario", "Semana 2: 1 dashboard o query", "Semana 3: brief a negocio", "Semana 4: backlog priorizado"],
};

const TECH_PACK: RolePack = {
  areas: ["Entrega de software", "Calidad", "Operación del servicio", "Colaboración con producto"],
  mustKnow: ["Priorizar backlog", "Definition of done", "Incidentes básicos", "Comunicación async"],
  tools: ["Git", "CI/CD", "Tracker (Jira)", "Observabilidad"],
  stakeholders: ["Producto", "QA", "Ops", "Usuarios internos"],
  registers: ["Backlog", "Bugs", "Deploys"],
  controls: ["PR review", "Tests", "Feature flags / rollback"],
  kpis: ["Lead time", "Fallos en prod", "Throughput"],
  communications: ["Update diario", "Demo", "Postmortem corto"],
  howTo: ["Prioriza 5 ítems impacto×esfuerzo.", "Escribe un update hecho/curso/bloqueo."],
  firstMonth: ["Semana 1: entorno y rituales", "Semana 2: 1 entrega pequeña", "Semana 3: un bug en prod simulado", "Semana 4: demo"],
};

const GENERAL_PACK: RolePack = {
  areas: ["Entregables del aviso", "Priorización", "Stakeholders", "Seguimiento"],
  mustKnow: ["Qué pide el aviso en concreto", "Quién decide", "Cómo se mide el éxito"],
  tools: ["El stack que nombra el aviso", "Tablero de seguimiento", "Plantillas de update"],
  stakeholders: ["Jefe", "Pares", "Áreas que dependen del resultado"],
  registers: ["Lista de prioridades", "Decisiones", "Riesgos"],
  controls: ["Revisión semanal", "Criterio de listo"],
  kpis: ["Los que nombra el aviso o proxies de entrega"],
  communications: ["Update corto", "Pregunta clara", "Cierre de acuerdo"],
  howTo: ["Extrae del aviso 5 responsabilidades medibles.", "Arma un plan de 2 semanas con dueño y evidencia."],
  firstMonth: ["Semana 1: escuchar y mapear", "Semana 2: 1 entregable acompañado", "Semana 3: 1 entregable solo", "Semana 4: feedback y ajuste"],
};

const DIGITAL_RE =
  /transformaci[oó]n\s+digital|digital\s+transformation|chief digital|\bcdo\b/;

export function isDigitalTransformation(jobTitle: string, jobText: string): boolean {
  return DIGITAL_RE.test(`${jobTitle} ${jobText}`.toLowerCase());
}

function pickPack(jobTitle: string, jobText: string, family?: RoleReviewFamily): RolePack {
  const blob = `${jobTitle} ${jobText}`.toLowerCase();
  if (isDigitalTransformation(jobTitle, jobText)) {
    return DIGITAL_TRANSFORM;
  }
  if (family === "ops" || /plataforma|infraestructura|itil|sre|observab/.test(blob)) return OPS_PLATFORM;
  if (family === "data") return DATA_PACK;
  if (family === "tech") return TECH_PACK;
  return GENERAL_PACK;
}

/** Saca temas útiles del aviso cuando el usuario no marcó nada concreto. */
export function extractTopicsFromJob(jobTitle: string, jobText: string): string[] {
  const blob = `${jobTitle}\n${jobText}`;
  const found: string[] = [];
  const rules: { term: string; re: RegExp }[] = [
    { term: "Transformación digital", re: /transformaci[oó]n\s+digital|digital\s+transformation/i },
    { term: "Gestión del cambio", re: /gesti[oó]n del cambio|change management|adopci[oó]n/i },
    { term: "Roadmap y portafolio", re: /roadmap|portafolio|prioriz/i },
    { term: "OKR y KPIs", re: /\bokr\b|\bkpi\b|indicadores?/i },
    { term: "Gobierno y riesgos", re: /gobierno|gobernanza|riesgos?|raid\b/i },
    { term: "Datos y analítica", re: /anal[ií]tica|power\s*bi|\bsql\b|data\s*(engineer|analyst)|warehouse/i },
    { term: "Cloud", re: /\baws\b|azure|\bgcp\b|\bcloud\b/i },
    { term: "ITIL / incidentes", re: /\bitil\b|incidentes?|\bsre\b|observab/i },
    { term: "FinOps", re: /finops|costo cloud|optimizaci[oó]n de costos/i },
    { term: "Stakeholders y sponsor", re: /stakeholder|sponsor|comit[eé]|patrocinador/i },
    { term: "Agile / delivery", re: /agile|scrum|kanban|delivery/i },
  ];
  for (const r of rules) {
    if (r.re.test(blob) && !found.includes(r.term)) found.push(r.term);
    if (found.length >= 6) break;
  }
  if (!found.length) {
    const role = jobTitle.trim() || "el cargo";
    return [
      `Mapa de responsabilidades de ${role}`,
      "Herramientas del aviso",
      "KPIs y seguimiento",
      "Comunicación con el equipo",
    ];
  }
  return found;
}

function listBody(items: string[]): string {
  return items.map((x, i) => `${i + 1}) ${x}`).join(" ");
}

/**
 * Curso usable del rol. Usa el aviso y la familia; el “tema del día” solo enfoca, no rellena plantillas vacías.
 */
export function buildRoleCourse(input: RoleCourseInput): LessonBlock[] {
  const role = input.jobTitle.trim() || "este cargo";
  const text = (input.jobText || "").trim();
  const pack = pickPack(role, text, input.family);
  const focus = (input.term || "").trim();
  const focusNote =
    focus && !/^responsabilidades del rol$/i.test(focus) && !/^pr[aá]ctica:/i.test(focus)
      ? ` Enfoque de hoy: ${focus} (sale del aviso o de lo que marcaste para aprender).`
      : "";

  const fromJd = text
    ? ` Del aviso tomamos señales concretas (requisitos, herramientas y resultados).${focusNote}`
    : focusNote;

  const specificFocus =
    focus && !/^responsabilidades del rol$/i.test(focus) && !/^pr[aá]ctica:/i.test(focus);
  const today: LessonBlock[] = specificFocus
    ? [
        {
          heading: `Hoy: ${focus}`,
          body: `Este día se practica “${focus}” dentro de ${role}. Relaciónalo con “${pack.kpis[0]}” y con ${pack.stakeholders[0]}. El entregable es una nota de media página: qué es, para qué lo usa este cargo y qué harías el lunes.`,
        },
      ]
    : [];

  const listed = (heading: string, points: string[], note?: string): LessonBlock => ({
    heading,
    body: note ? `${listBody(points)} ${note}` : listBody(points),
    points,
    note,
  });

  return [
    ...today,
    listed(
      "Áreas principales del rol",
      pack.areas,
      `En ${role} el trabajo gira alrededor de estas áreas.${fromJd}`
    ),
    listed("Qué debes saber", pack.mustKnow),
    listed(
      "Herramientas que debes manejar",
      pack.tools,
      "Si el aviso nombra otras, esas mandan: anótalas y practica con ellas, no con genéricos."
    ),
    listed("Con quién interactúas", pack.stakeholders),
    listed("Registros que debes llevar", pack.registers),
    listed("Controles", pack.controls),
    listed("KPIs / cómo se mide", pack.kpis),
    listed("Comunicaciones típicas", pack.communications),
    listed("Cómo se hace (paso a paso)", pack.howTo),
    listed("El primer mes", pack.firstMonth),
  ];
}

/** @deprecated Usa buildRoleCourse. Se mantiene para llamadas viejas. */
export function lessonFor(term: string, jobTitle: string, explain?: string): LessonBlock[] {
  return buildRoleCourse({
    jobTitle,
    term,
    jobText: explain && explain.length > 80 ? explain : "",
  });
}

export function dayInRole(jobTitle: string, term: string, jobText = ""): string {
  const role = jobTitle.trim() || "este cargo";
  const pack = pickPack(role, jobText);
  const topic = term.trim() || pack.areas[0];
  return [
    `Un día en ${role}: empiezas revisando el tablero (iniciativas, bloqueos y decisiones pendientes).`,
    `A media mañana avanzas un entregable de “${topic}”: lo acotas, lo dejas escrito y defines la métrica.`,
    `Luego alineas 15 minutos con un stakeholder: qué cambió, qué falta y qué decisión necesitas.`,
    `Cierras con un update corto (hecho / en curso / riesgo). Si no se puede mostrar, no cuenta.`,
  ].join(" ");
}
