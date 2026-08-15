/** Plantillas de networking — autoría ATSAdvisor (sin textos de terceros). */

export type NetworkAudienceId =
  | "hh_frio"
  | "hh_conocido"
  | "excolega"
  | "exjefe"
  | "cercano"
  | "hr_empresa"
  | "gerente"
  | "frio_empresa"
  | "followup";

export type NetworkTemplate = {
  id: NetworkAudienceId;
  label: string;
  tip: string;
  short: string;
  long?: string;
};

export const NETWORK_TEMPLATES: NetworkTemplate[] = [
  {
    id: "hh_frio",
    label: "Headhunter / reclutador (no te conoce)",
    tip: "Valor + rol target + CTA de 15 min. Sin “cualquier vacante”.",
    short:
      "Hola [Nombre], soy [Tu nombre], [rol/expertise] con foco en [resultado]. Busco roles de [target]. ¿Tendrías 15 min esta semana para orientarme sobre el mercado de [nicho]?",
    long:
      "Estimado/a [Nombre]:\n\nSoy [Tu nombre], profesional de [dominio] con experiencia en [1–2 hilos]. En mi última etapa [logro 1 línea con número].\n\nEstoy explorando [rol/contexto] y valoro tu lectura del mercado. ¿Podríamos agendar una llamada breve? Adjunto perfil.\n\nGracias,\n[Tu nombre]",
  },
  {
    id: "hh_conocido",
    label: "Headhunter que ya te conoce",
    tip: "Actualización breve de foco y disponibilidad.",
    short:
      "Hola [Nombre], te actualizo: sigo en búsqueda de [rol]. Esta semana avancé en [N] procesos / foco en [sector]. Si abre algo alineado, ¿me avisas? Gracias.",
  },
  {
    id: "excolega",
    label: "Excolega / par",
    tip: "Ancla compartida + favor concreto (menos de 20 min).",
    short:
      "Hola [Nombre], ¿cómo vas? Estoy en transición hacia [rol]. ¿Me podrías [favor concreto]? Te cuento cómo me fue.",
    long:
      "Hola [Nombre], espero estés bien. Trabajamos juntos en [contexto] y siempre valoré [algo específico].\n\nEstoy buscando [rol]. ¿Tendrías 15–20 min para [consejo de mercado / intro a 1 persona / feedback a mi pitch]?\n\nGracias,\n[Tu nombre]",
  },
  {
    id: "exjefe",
    label: "Exjefe / mentor",
    tip: "Pide orientación, no empleo en el primer mensaje.",
    short:
      "Hola [Nombre], espero estés bien. Me gustaría pedirte 15 min de orientación sobre [tema]. ¿Te parece [día A] o [día B]?",
    long:
      "Hola [Nombre],\n\nEspero estés bien. Quería pedirte una orientación breve: estoy explorando [rol/contexto] y valoro tu mirada sobre [mercado / gaps / intros].\n\n¿Tendrías 15 minutos [día A] o [día B]?\n\nGracias,\n[Tu nombre]",
  },
  {
    id: "cercano",
    label: "Familia / amigos cercanos",
    tip: "Pide intros, no que “busquen trabajo por ti”.",
    short:
      "Estoy buscando roles de [rol] en [ciudad/modalidad]. Si conoces a alguien en [sector], ¿me presentas? No hace falta vacante abierta.",
  },
  {
    id: "hr_empresa",
    label: "Selección / HR (empresa objetivo)",
    tip: "Interés específico por área; pregunta por horizonte.",
    short:
      "Hola [Nombre], sigo con interés [Empresa] en roles de [área]. ¿Hay procesos abiertos o previstos en [horizonte]? Gracias por cualquier orientación.",
    long:
      "Hola [Nombre],\n\nMe interesa [Empresa], en particular el área de [área]. Mi perfil es [1 línea de valor]. ¿Podrías orientarme si hay procesos abiertos o previstos para [rol]?\n\nGracias,\n[Tu nombre]",
  },
  {
    id: "gerente",
    label: "Gerente / hiring manager",
    tip: "Ancla real (post, producto, expansión) + 1 logro.",
    short:
      "Hola [Nombre], vi [ancla: post, producto, expansión]. Trabajo en [expertise] y aporté [logro]. ¿15 min para entender prioridades del equipo?",
    long:
      "Hola [Nombre],\n\nVi [ancla concreta]. Trabajo en [expertise] y en mi última etapa [logro medible]. Me interesa cómo está priorizando el equipo [tema].\n\n¿Tendrías 15 minutos esta semana?\n\nGracias,\n[Tu nombre]",
  },
  {
    id: "frio_empresa",
    label: "Contacto frío (empresa objetivo)",
    tip: "Pide conversación de mercado, no el empleo.",
    short:
      "Hola [Nombre], no nos conocemos; trabajo en [dominio]. Me interesa cómo está el área de [X] en [Empresa]. ¿Tendrías 10–15 min de conversación de mercado (sin pedir empleo)? Gracias.",
  },
  {
    id: "followup",
    label: "Follow-up (día 5–7)",
    tip: "Una sola vez; dos horarios; sin culpa.",
    short:
      "Hola [Nombre], retomo por si se te pasó mi nota sobre [tema]. Sigo disponible [día A] o [día B]. Gracias.",
  },
];

export function getNetworkTemplate(id: string): NetworkTemplate {
  return NETWORK_TEMPLATES.find((t) => t.id === id) || NETWORK_TEMPLATES[0];
}

/** Rellena placeholders simples. */
export function fillNetworkTemplate(
  text: string,
  vars: Record<string, string>
): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    if (!v.trim()) continue;
    out = out.split(`[${k}]`).join(v.trim());
  }
  return out;
}
