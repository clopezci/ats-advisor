/** Feed curado de vacantes LATAM (demo/orientativo) + match vs texto de CV. */

export type FeedJob = {
  id: string;
  title: string;
  company: string;
  city: string;
  modality: "presencial" | "hibrido" | "remoto";
  seniority: string;
  keywords: string[];
  portal: string;
  url: string;
  postedLabel: string;
};

export const CURATED_JOBS: FeedJob[] = [
  {
    id: "j1",
    title: "Analista de datos",
    company: "Fintech CO",
    city: "Bogotá",
    modality: "hibrido",
    seniority: "Semi-senior",
    keywords: ["sql", "python", "power bi", "dashboard", "etl", "excel"],
    portal: "LinkedIn",
    url: "https://www.linkedin.com/jobs/",
    postedLabel: "Esta semana",
  },
  {
    id: "j2",
    title: "Desarrollador fullstack",
    company: "Producto SaaS",
    city: "Remoto LATAM",
    modality: "remoto",
    seniority: "Mid",
    keywords: ["react", "node", "typescript", "api", "postgresql", "aws"],
    portal: "Remote OK / LinkedIn",
    url: "https://www.linkedin.com/jobs/",
    postedLabel: "Reciente",
  },
  {
    id: "j3",
    title: "HRBP",
    company: "Retail nacional",
    city: "Medellín",
    modality: "presencial",
    seniority: "Senior",
    keywords: ["hrbp", "talent", "clima", "desempeño", "relaciones laborales", "nómina"],
    portal: "elempleo",
    url: "https://www.elempleo.com/",
    postedLabel: "Activa",
  },
  {
    id: "j4",
    title: "Customer success",
    company: "B2B Software",
    city: "Remoto CO",
    modality: "remoto",
    seniority: "Junior–Mid",
    keywords: ["customer success", "saas", "churn", "onboarding", "slack", "crm"],
    portal: "Computrabajo",
    url: "https://www.computrabajo.com.co/",
    postedLabel: "Esta semana",
  },
  {
    id: "j5",
    title: "Coordinador de operaciones",
    company: "Logística",
    city: "Cali",
    modality: "presencial",
    seniority: "Semi",
    keywords: ["operaciones", "kpi", "inventario", "mejora continua", "lean", "equipo"],
    portal: "Magneto",
    url: "https://magneto365.com/",
    postedLabel: "Nueva",
  },
  {
    id: "j6",
    title: "Product designer",
    company: "Startup EdTech",
    city: "Remoto",
    modality: "remoto",
    seniority: "Mid",
    keywords: ["figma", "ux", "ui", "research", "prototipo", "design system"],
    portal: "LinkedIn",
    url: "https://www.linkedin.com/jobs/",
    postedLabel: "Activa",
  },
  {
    id: "j7",
    title: "Analista financiero",
    company: "Servicios",
    city: "Bogotá",
    modality: "hibrido",
    seniority: "Junior",
    keywords: ["excel", "presupuesto", "flujo de caja", "contabilidad", "forecast", "erp"],
    portal: "elempleo",
    url: "https://www.elempleo.com/",
    postedLabel: "Esta semana",
  },
  {
    id: "j8",
    title: "Scrum master / PMO",
    company: "Consultora TI",
    city: "Remoto MX/CO",
    modality: "remoto",
    seniority: "Senior",
    keywords: ["scrum", "agile", "jira", "stakeholders", "delivery", "pmo"],
    portal: "LinkedIn",
    url: "https://www.linkedin.com/jobs/",
    postedLabel: "Reciente",
  },
];

export function scoreJobAgainstCv(job: FeedJob, cvText: string): number {
  const cv = (cvText || "").toLowerCase();
  if (cv.length < 40) return 0;
  let hits = 0;
  for (const k of job.keywords) {
    if (cv.includes(k.toLowerCase())) hits += 1;
  }
  const titleBits = job.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  for (const t of titleBits) {
    if (cv.includes(t)) hits += 0.5;
  }
  const max = job.keywords.length + titleBits.length * 0.5;
  return Math.round(Math.min(100, (hits / Math.max(1, max)) * 100));
}

export function rankJobs(cvText: string, jobs = CURATED_JOBS) {
  return [...jobs]
    .map((j) => ({ job: j, score: scoreJobAgainstCv(j, cvText) }))
    .sort((a, b) => b.score - a.score);
}
