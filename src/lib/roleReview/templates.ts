import type { RoleReviewFamily, RoleReviewTicket, RoleReviewWeek1Item } from "./types";

/** Detecta familia de rol a partir del aviso/cargo (heurística corta). */
export function detectRoleFamily(jobTitle: string, jobText: string): RoleReviewFamily {
  const t = `${jobTitle} ${jobText}`.toLowerCase();
  if (/\b(sql|python|etl|bi|tableau|power\s*bi|analytics|data\s*engineer|analista de datos)\b/.test(t)) {
    return "data";
  }
  if (/\b(react|node|java|\.net|devops|kubernetes|aws|backend|frontend|fullstack|desarrollador|software)\b/.test(t)) {
    return "tech";
  }
  if (/\b(contab|finanzas|tesorer|auditor|ifp|budget|presupuesto|niff|niif)\b/.test(t)) {
    return "finanzas";
  }
  if (/\b(logística|supply|operaciones|warehouse|inventario|producción|calidad)\b/.test(t)) {
    return "ops";
  }
  if (/\b(ventas|comercial|account\s*manager|customer\s*success|cs\b|bdr|sdr|hunter)\b/.test(t)) {
    return "comercial";
  }
  return "general";
}

/** Tickets semilla por familia (cuando la IA no trae tickets). */
export function seedTicketsForFamily(
  family: RoleReviewFamily,
  jobTitle: string,
  jdSlice: string
): RoleReviewTicket[] {
  const anchor = jdSlice.slice(0, 100) || "Responsabilidad del aviso";
  const base: Record<RoleReviewFamily, Omit<RoleReviewTicket, "id" | "day">[]> = {
    tech: [
      {
        title: "Prioriza el backlog de la semana",
        priority: "P1",
        type: "task",
        description: `Como ${jobTitle || "dev"}, ordena 5 ítems (impacto × esfuerzo) y justifica el top 2.`,
        acceptance: ["Lista priorizada", "Criterio escrito en 5 líneas", "Riesgo del #1 nombrado"],
        jdAnchor: anchor,
        timeMin: 25,
      },
      {
        title: "Update a manager (async)",
        priority: "P2",
        type: "update",
        description: "Escribe un update de 8 líneas: hecho / en curso / bloqueo / próxima acción.",
        acceptance: ["Formato hecho/curso/bloqueo", "Sin jerga vacía", "Una pregunta clara al final"],
        jdAnchor: anchor,
        timeMin: 15,
      },
      {
        title: "Spike: investiga un fallo",
        priority: "P0",
        type: "spike",
        description: "Simula un incidente: hipótesis, qué mirarías primero, rollback o fix.",
        acceptance: ["3 hipótesis", "Orden de diagnóstico", "Criterio de listo/no listo"],
        jdAnchor: anchor,
        timeMin: 30,
      },
    ],
    data: [
      {
        title: "Define métrica + definición",
        priority: "P1",
        type: "task",
        description: "Elige 1 KPI del aviso y escribe definición, fuente y trampa típica.",
        acceptance: ["Definición en 1 frase", "Fuente de datos", "Anti-patrón de interpretación"],
        jdAnchor: anchor,
        timeMin: 25,
      },
      {
        title: "Revisa un SQL 'roto' (simulado)",
        priority: "P0",
        type: "bug",
        description: "Escribe qué revisarías si un dashboard bajó 30% de un día para otro.",
        acceptance: ["Checklist de 5 checks", "1 pregunta al negocio", "1 hipótesis técnica"],
        jdAnchor: anchor,
        timeMin: 30,
      },
      {
        title: "Brief al stakeholder",
        priority: "P2",
        type: "update",
        description: "Resume un hallazgo en lenguaje de negocio (sin jerga de joins).",
        acceptance: ["3 bullets negocio", "1 recomendación", "Sin inventar números"],
        jdAnchor: anchor,
        timeMin: 20,
      },
    ],
    finanzas: [
      {
        title: "Cierre: checklist del día",
        priority: "P1",
        type: "task",
        description: "Arma checklist de cierre/revisión (qué validar antes de reportar).",
        acceptance: ["6–8 checks", "Orden lógico", "Qué escala a jefe"],
        jdAnchor: anchor,
        timeMin: 25,
      },
      {
        title: "Variación vs presupuesto",
        priority: "P0",
        type: "spike",
        description: "Explica cómo investigarías una variación relevante (pasos, no números inventados).",
        acceptance: ["Pasos de análisis", "2 causas típicas", "Cómo lo comunicarías"],
        jdAnchor: anchor,
        timeMin: 30,
      },
      {
        title: "Nota a controller",
        priority: "P2",
        type: "update",
        description: "Borrador de nota corta: hallazgo, impacto, siguiente paso.",
        acceptance: ["≤10 líneas", "Impacto claro", "Acción pedida"],
        jdAnchor: anchor,
        timeMin: 15,
      },
    ],
    ops: [
      {
        title: "Prioriza excepciones del día",
        priority: "P0",
        type: "task",
        description: "Lista 5 excepciones típicas del rol y cómo las priorizas (cliente/seguridad/costo).",
        acceptance: ["Criterio de prioridad", "Top 2 justificadas", "Escalamiento"],
        jdAnchor: anchor,
        timeMin: 25,
      },
      {
        title: "Handoff de turno",
        priority: "P1",
        type: "update",
        description: "Escribe handoff: abiertos, riesgos, pendientes para el siguiente turno.",
        acceptance: ["Abiertos claros", "1 riesgo", "1 pendiente crítico"],
        jdAnchor: anchor,
        timeMin: 15,
      },
      {
        title: "Root cause light",
        priority: "P1",
        type: "spike",
        description: "Para un atraso típico: 5 porqués + acción correctiva mínima.",
        acceptance: ["5 porqués", "Acción en 48h", "Métrica de seguimiento"],
        jdAnchor: anchor,
        timeMin: 30,
      },
    ],
    comercial: [
      {
        title: "Pipeline hygiene",
        priority: "P1",
        type: "task",
        description: "Clasifica 6 oportunidades ficticias (etapa, próximo paso, riesgo).",
        acceptance: ["Etapa por ítem", "Próximo paso con fecha", "1 deal en riesgo justificado"],
        jdAnchor: anchor,
        timeMin: 25,
      },
      {
        title: "Update a manager de ventas",
        priority: "P2",
        type: "update",
        description: "Forecast corto: ganado / en riesgo / perdido probable + por qué.",
        acceptance: ["3 líneas por bucket", "Sin inventar montos exactos", "Pedido de ayuda concreto"],
        jdAnchor: anchor,
        timeMin: 15,
      },
      {
        title: "Objeción del aviso",
        priority: "P0",
        type: "spike",
        description: "Elige 1 objeción típica del sector del aviso y escribe respuesta honesta (no script agresivo).",
        acceptance: ["Objeción nombrada", "Respuesta ≤8 líneas", "Pregunta de descubrimiento"],
        jdAnchor: anchor,
        timeMin: 20,
      },
    ],
    general: [
      {
        title: "Prioriza el backlog del rol",
        priority: "P1",
        type: "task",
        description: `Ordena 5 tareas típicas de ${jobTitle || "este cargo"} por impacto.`,
        acceptance: ["Lista priorizada", "Criterio escrito", "Top 1 justificado"],
        jdAnchor: anchor,
        timeMin: 25,
      },
      {
        title: "Update a tu jefe",
        priority: "P2",
        type: "update",
        description: "Update async: hecho / en curso / bloqueo / próxima acción.",
        acceptance: ["4 bloques", "Sin relleno", "1 pregunta"],
        jdAnchor: anchor,
        timeMin: 15,
      },
      {
        title: "Caso del aviso",
        priority: "P0",
        type: "spike",
        description: "Toma 1 responsabilidad del aviso y escribe cómo la ejecutarías el lunes.",
        acceptance: ["Pasos", "Stakeholders", "Señal de avance"],
        jdAnchor: anchor,
        timeMin: 30,
      },
    ],
  };

  return base[family].map((t, i) => ({
    ...t,
    id: `tk${i + 1}`,
    day: i + 1,
  }));
}

export function seedWeek1Checklist(jobTitle: string): RoleReviewWeek1Item[] {
  const role = jobTitle || "el cargo";
  return [
    {
      id: "w1",
      dayHint: "Día 1",
      title: "Mapa de stakeholders",
      why: `Quién decide, quién usa tu trabajo y a quién le reportas en ${role}.`,
    },
    {
      id: "w2",
      dayHint: "Día 1–2",
      title: "Rituales del equipo",
      why: "Standup, handoff, herramientas, dónde viven los docs.",
    },
    {
      id: "w3",
      dayHint: "Día 2–3",
      title: "Definition of done del equipo",
      why: "Qué cuenta como terminado (calidad, revisión, comunicación).",
    },
    {
      id: "w4",
      dayHint: "Día 3–4",
      title: "Primer entregable pequeño",
      why: "Algo visible en <2 días para generar confianza.",
    },
    {
      id: "w5",
      dayHint: "Día 5",
      title: "1:1 con tu jefe: prioridades",
      why: "Confirmar top 3 de las 2 primeras semanas y cómo te miden.",
    },
    {
      id: "w6",
      dayHint: "Fin de semana 1",
      title: "Nota de aprendizaje",
      why: "Qué aprendiste del aviso vs la realidad; qué practicarás la semana 2.",
    },
  ];
}
