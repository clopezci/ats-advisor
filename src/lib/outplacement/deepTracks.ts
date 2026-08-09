/** Tracks profundos segunda carrera (plantillas 14 días sin depender de IA). */

export type TrackDay = { day: number; title: string; actions: string[] };

export type DeepTrack = {
  id: string;
  title: string;
  summary: string;
  days: TrackDay[];
};

export const DEEP_TRACKS: DeepTrack[] = [
  {
    id: "pivot",
    title: "Pivote de industria",
    summary: "Traduce evidencia al sector destino y valida con 5 conversaciones.",
    days: Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const blocks: Record<number, TrackDay> = {
        1: { day: 1, title: "Elegir sector destino", actions: ["Lista 3 industrias", "Criterio: skills transferibles + demanda"] },
        2: { day: 2, title: "Mapa de transferencia", actions: ["Tabla skill antigua → evidencia → lenguaje nuevo"] },
        3: { day: 3, title: "CV pivote v1", actions: ["Reescribe 5 bullets", "Valida en ATSAdvisor vs 1 oferta"] },
        4: { day: 4, title: "LinkedIn pivote", actions: ["Headline nuevo", "About con 1 logro del sector destino"] },
        5: { day: 5, title: "Glosario del sector", actions: ["20 términos", "Úsalos en 3 bullets"] },
        6: { day: 6, title: "Lista de 15 empresas", actions: ["Mix grandes + medianas + startups"] },
        7: { day: 7, title: "Networking 3 intros", actions: ["Mensaje corto", "Pide 15 min, no vacante"] },
        8: { day: 8, title: "Mock filtro", actions: ["Practica en /outplacement/filtro"] },
        9: { day: 9, title: "Caso de estudio", actions: ["1 página: problema → acción → resultado en lenguaje destino"] },
        10: { day: 10, title: "5 postulaciones alineadas", actions: ["Solo match ≥60%", "Tracker al día"] },
        11: { day: 11, title: "Follow-up networking", actions: ["A quienes no respondieron (día 4–5)"] },
        12: { day: 12, title: "STAR del pivote", actions: ["3 historias que demuestren transferencia"] },
        13: { day: 13, title: "Ajuste CV v2", actions: ["Incorpora keywords reales de ofertas"] },
        14: { day: 14, title: "Plan 30 días", actions: ["Career Brief", "Métricas semanales"] },
      };
      return blocks[day];
    }),
  },
  {
    id: "freelance",
    title: "Freelance / consultoría",
    summary: "Oferta clara, precio, primer cliente y entrega repetible.",
    days: Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const titles = [
        "Define servicio estrella",
        "Cliente ideal (ICP)",
        "Paquete y precio",
        "One-pager / LinkedIn",
        "Prueba social / caso",
        "Lista 20 prospectos",
        "5 mensajes de outreach",
        "Llamada de discovery",
        "Propuesta 1 página",
        "Cierre o learnings",
        "Plantilla de entrega",
        "Cobro y contrato básico",
        "Segundo outreach batch",
        "Retrospectiva 14 días",
      ];
      return {
        day,
        title: titles[i],
        actions: ["Ejecuta en ≤90 min", "Anota 1 aprendizaje", "Actualiza tracker de prospectos"],
      };
    }),
  },
  {
    id: "startup",
    title: "Emprendimiento lean",
    summary: "Valida problema, oferta mínima y primeras entrevistas de cliente.",
    days: Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const titles = [
        "Problema en 1 frase",
        "Hipótesis de cliente",
        "5 entrevistas exploratorias",
        "Síntesis de dolores",
        "Oferta mínima (MVP)",
        "Landing o WhatsApp funnel",
        "Métrica norte",
        "Primer experimento",
        "Costo de adquisición",
        "Iteración de mensaje",
        "Pilot de early adopters",
        "Precio smoke-test",
        "Decisión: pivot / persevera",
        "Plan 30 días post-validación",
      ];
      return {
        day,
        title: titles[i],
        actions: ["Evidencia escrita", "Habla con 1 persona real", "No construyas de más"],
      };
    }),
  },
];

export function getDeepTrack(id: string) {
  return DEEP_TRACKS.find((t) => t.id === id) || null;
}
