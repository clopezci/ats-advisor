/** Fases del cuadernillo — un flujo, no un menú infinito. */

import type { WorkbookModuleId } from "@/lib/workbook/types";

export type WorkbookPhase = {
  id: string;
  step: number;
  title: string;
  blurb: string;
  /** Módulos principales (cuentan avance). */
  moduleIds: WorkbookModuleId[];
  /** Herramientas satélite (no suman bloques; viven dentro de la fase). */
  tools?: { label: string; href: string }[];
};

export const WORKBOOK_PHASES: WorkbookPhase[] = [
  {
    id: "diag",
    step: 1,
    title: "Diagnóstico",
    blurb: "Mapa, competencias y (opcional) estilo de comunicación.",
    moduleIds: ["mapa", "pruebas"],
  },
  {
    id: "mercado_red",
    step: 2,
    title: "Mercado y red",
    blurb: "Tres canales, directorio, CRM único, guiones y plantillas.",
    moduleIds: ["mercado", "directorio", "red", "guiones"],
    tools: [
      { label: "Cercanos / aliados / conectores", href: "/outplacement/cuadernillo/conectores" },
      { label: "Plantillas por audiencia", href: "/outplacement/cuadernillo/plantillas" },
    ],
  },
  {
    id: "marca",
    step: 3,
    title: "Marca y evidencia",
    blurb: "SOAR, identidad digital y export a CV.",
    moduleIds: ["marca"],
    tools: [{ label: "Checklist identidad digital", href: "/outplacement/cuadernillo/marca" }],
  },
  {
    id: "entrevistas",
    step: 4,
    title: "Entrevistas",
    blurb: "Cómo te evalúan, roleplay, simulaciones y rúbrica.",
    moduleIds: ["evaluacion", "entrevistas"],
    tools: [
      { label: "Simulaciones por caso", href: "/outplacement/cuadernillo/simulaciones" },
      { label: "Historial de feedback", href: "/outplacement/cuadernillo/feedback" },
    ],
  },
  {
    id: "oferta",
    step: 5,
    title: "Oferta y cierre",
    blurb: "Compensación, finanzas y scripts de negociación.",
    moduleIds: ["compensacion", "finanzas"],
    tools: [{ label: "Scripts + bandas CO", href: "/outplacement/oferta" }],
  },
  {
    id: "extra",
    step: 6,
    title: "Extra (si aplica)",
    blurb: "Emprendimiento puente, funnel y export.",
    moduleIds: ["emprendimiento"],
    tools: [
      { label: "Funnel semanal", href: "/outplacement/cuadernillo/funnel" },
      { label: "Exportar / PDF", href: "/outplacement/cuadernillo/export" },
      { label: "Ruta 14 sesiones", href: "/outplacement/cuadernillo/ruta14" },
      { label: "Alumni / AMA", href: "/outplacement/alumni" },
    ],
  },
];
