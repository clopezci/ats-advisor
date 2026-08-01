/** @returns {import('../src/lib/outplacement/modules').OutModule[]} */
function q(question, options, answer) {
  return { question, options, answer };
}

function cap(day, title, content, quiz) {
  return { day, title, content, quiz };
}

const modules = [
  {
    code: "OUT-01",
    title: "Estabilización emocional y narrativa",
    summary: "Procesa la transición y redefine tu historia profesional con claridad.",
    days: 7,
    capsules: [
      cap(1, "Nombrar la transición", "Escribe en 5 líneas qué terminó, qué conservas y qué quieres atraer. Sin juicios.", q("¿Qué haces el día 1?", ["Ignorar el despido", "Nombrar hechos y aprendizajes", "Enviar 50 CVs"], 1)),
      cap(2, "Energía y rutina", "Define una rutina de 45 minutos: cuerpo, mente y búsqueda. La constancia supera la intensidad.", q("La clave es:", ["Rutina corta diaria", "Trabajar 14 horas", "Esperar motivación"], 0)),
      cap(3, "Narrativa de valor", "Frase base: 'Ayudo a X a lograr Y mediante Z'. Úsala en LinkedIn y entrevistas.", q("Tu frase debe incluir:", ["Solo cargo", "X, Y y Z (público, resultado, método)", "Solo salario"], 1)),
      cap(4, "Red de apoyo", "Lista 5 personas de confianza. Pide consejo concreto, no 'avísame si hay algo'.", q("Al pedir ayuda conviene:", ["Ser vago", "Pedir algo específico", "No pedir"], 1)),
      cap(5, "Cierre emocional", "Resume en audio de 60s tu narrativa. Escúchala y ajusta tono seguro, no defensivo.", q("El tono ideal es:", ["Defensivo", "Seguro y claro", "Arrogante"], 1)),
      cap(6, "Límites sanos", "Bloquea redes 2h al día para búsqueda profunda. Protege sueño y alimentación.", q("Prioridad esta semana:", ["Doomscroll", "Descanso + foco", "Aplicar a todo"], 1)),
      cap(7, "Ritual de cierre OUT-01", "Elige 1 frase de identidad profesional y pégala en tu escritorio/LinkedIn.", q("El entregable es:", ["Una frase clara de identidad", "Un CV de 5 páginas", "Nada"], 0)),
    ],
  },
  {
    code: "OUT-02",
    title: "Autoevaluación y mapa de competencias",
    summary: "FODA profesional y mapa de skills transferibles.",
    days: 7,
    capsules: [
      cap(1, "Inventario de logros", "Lista 8 logros con métrica. Si no hay número, estima alcance o tiempo ahorrado.", q("Cada logro debe tener:", ["Solo adjetivos", "Alguna métrica o alcance", "Fecha de nacimiento"], 1)),
      cap(2, "Hard vs soft", "Clasifica skills en técnicas y blandas. Marca las 5 más vendibles para tu próximo rol.", q("¿Cuántas skills priorizas?", ["Todas", "Las 5 más vendibles", "Ninguna"], 1)),
      cap(3, "FODA exprés", "Fortalezas, oportunidades, debilidades, amenazas del mercado. Una línea cada una.", q("El FODA incluye:", ["Solo fortalezas", "F, O, D y A", "Solo salario"], 1)),
      cap(4, "Skills transferibles", "Traduce logros de un sector a otro (ej. finanzas→ops: control, precisión, reporting).", q("Transferir skills sirve para:", ["Pivote de industria", "Borrar el CV", "Evitar entrevistas"], 0)),
      cap(5, "Evidencia observable", "Por cada skill top, escribe 1 prueba (proyecto, KPI, certificación).", q("Una skill sin evidencia es:", ["Débil ante reclutadores", "Suficiente", "Ilegal"], 0)),
      cap(6, "Propuesta de valor", "Une logros + skills + FODA en un párrafo de 80 palabras para tu CV.", q("El párrafo ideal tiene:", ["~80 palabras claras", "500 palabras", "Solo emojis"], 0)),
      cap(7, "Validar con un par", "Pide a un colega: ¿contratarías a esta propuesta? Ajusta feedback.", q("El objetivo del feedback es:", ["Validar claridad de valor", "Discutir política", "Pedir prestado dinero"], 0)),
    ],
  },
  {
    code: "OUT-03",
    title: "Inteligencia de mercado laboral LATAM",
    summary: "Roles target, bandas salariales y gaps reales.",
    days: 7,
    capsules: [
      cap(1, "3 roles target", "Elige 3 títulos de cargo reales en tu país. Copia requisitos comunes.", q("Debes elegir:", ["3 roles reales", "20 roles al azar", "Ninguno"], 0)),
      cap(2, "Banda salarial", "Investiga rango (computrabajo, eleempleo, niveles). Anota mínimo aceptable.", q("El mínimo aceptable se basa en:", ["Datos de mercado + tus costos", "Solo deseo", "El rumor de un amigo"], 0)),
      cap(3, "Gaps", "Compara tu mapa vs requisitos. Prioriza 2 gaps cerrables en 30 días.", q("Prioriza gaps:", ["Cerrables en ~30 días", "Imposibles", "Todos a la vez"], 0)),
      cap(4, "Demanda real", "Revisa 10 ofertas: ¿qué keywords se repiten? Anota top 10.", q("Las keywords repetidas indican:", ["Demanda del mercado", "Spam", "Nada"], 0)),
      cap(5, "Canales de oferta", "Lista dónde aparecen tus roles (LinkedIn, bolsas, referidos, consultoras).", q("El mercado oculto suele vivir en:", ["Referidos y red", "Solo portales genéricos", "TV"], 0)),
      cap(6, "Plan 30 días", "Calendario: aprendizaje, networking y postulaciones con cupos diarios.", q("Un plan bueno tiene:", ["Cupos diarios realistas", "Cero estructura", "Solo esperanza"], 0)),
      cap(7, "Decisión de foco", "Elige 1 rol primario y 1 secundario. Descarta el resto por 30 días.", q("Enfocarse evita:", ["Dispersión", "Éxito", "Aprendizaje"], 0)),
    ],
  },
  {
    code: "OUT-04",
    title: "Re-skilling / upskilling",
    summary: "Cierra brechas con cursos low-cost y práctica.",
    days: 7,
    capsules: [
      cap(1, "Elegir 1 skill", "Una sola skill prioritaria. Evita dispersión.", q("¿Cuántas skills nuevas a la vez?", ["1 prioritaria", "10", "0"], 0)),
      cap(2, "Recurso gratuito", "Elige un curso gratis/económico y agenda 25 min diarios.", q("La constancia ideal es:", ["Bloques cortos diarios", "Maratón anual", "Nunca"], 0)),
      cap(3, "Proyecto mínimo", "Crea un entregable pequeño para mostrar en CV/LinkedIn.", q("El proyecto sirve para:", ["Evidencia", "Decorar", "Ocultar gaps"], 0)),
      cap(4, "Práctica deliberada", "Repite el entregable mejorándolo con feedback o checklist.", q("Mejorar el mismo entregable es:", ["Práctica deliberada", "Pérdida de tiempo", "Ilegal"], 0)),
      cap(5, "Publicar evidencia", "Publica el proyecto o un post de aprendizaje con resultado.", q("Publicar evidencia ayuda a:", ["Marca y credibilidad", "Nada", "Bajar el score ATS"], 0)),
      cap(6, "Actualizar CV", "Agrega la skill con evidencia, no solo la palabra.", q("En el CV la skill debe ir con:", ["Evidencia/contexto", "Solo el nombre", "Color rosa"], 0)),
      cap(7, "Medir cierre de gap", "Re-corre ATSAdvisor vs una oferta target. ¿Subió el match?", q("El indicador de avance es:", ["Mejor match vs oferta real", "Likes", "Horas mirando videos"], 0)),
    ],
  },
  {
    code: "OUT-05",
    title: "Marca personal + CV/LinkedIn ATS",
    summary: "Rewrites STAR y perfil LinkedIn alineado al mercado.",
    days: 7,
    capsules: [
      cap(1, "Headline LinkedIn", "Cargo | Valor | Nicho. Sin frases vacías.", q("Un buen headline incluye:", ["Cargo, valor y nicho", "Solo 'open to work'", "Solo emojis"], 0)),
      cap(2, "About STAR", "3 logros STAR en el extracto.", q("STAR significa:", ["Situación, Tarea, Acción, Resultado", "Solo Resultado", "Salario"], 0)),
      cap(3, "CV una columna", "Formato ATS-safe: una columna, secciones estándar, PDF limpio.", q("Los ATS fallan más con:", ["Multi-columna e imágenes", "Texto plano", "Fechas"], 0)),
      cap(4, "Keywords honestas", "Integra keywords de ofertas reales sin inventar experiencia.", q("Keyword stuffing es:", ["Arriesgado / penalizable", "Obligatorio", "Invisible"], 0)),
      cap(5, "Prueba ATSAdvisor", "Corre un análisis ATS contra una oferta target y sube el score.", q("Debes iterar el CV hasta:", ["Mejorar el score de forma honesta", "Copiar la oferta entera", "Mentir"], 0)),
      cap(6, "Foto y banner", "Profesional, fondo simple. Banner con propuesta de valor corta.", q("La foto debe ser:", ["Profesional y clara", "Selfie borrosa", "Meme"], 0)),
      cap(7, "CTA de contacto", "Featured: CV o proyecto + mensaje de contacto fácil.", q("El featured sirve para:", ["Mostrar prueba social/trabajo", "Ocultar experiencia", "Nada"], 0)),
    ],
  },
  {
    code: "OUT-06",
    title: "Mercado oculto + networking",
    summary: "Scripts y outreach a reclutadores y hiring managers.",
    days: 7,
    capsules: [
      cap(1, "Mapa de 20 contactos", "Excompañeros, líderes de área, reclutadores del sector.", q("El mapa mínimo es:", ["~20 contactos relevantes", "1 persona", "0"], 0)),
      cap(2, "Script corto", "Mensaje de 5 líneas: contexto, valor, pedido concreto de 15 min.", q("El pedido debe ser:", ["Concreto (15 min)", "Vago", "Pedir empleo directo siempre"], 0)),
      cap(3, "5 outreaches", "Envía 5 mensajes personalizados hoy.", q("Personalizar el mensaje:", ["Aumenta respuesta", "Es opcional siempre", "Empeora"], 0)),
      cap(4, "Seguimiento", "Follow-up educado a los que no respondieron en 4-5 días.", q("El follow-up debe ser:", ["Educado y breve", "Agresivo diario", "Nunca"], 0)),
      cap(5, "Referidos", "Pide referidos solo cuando haya fit claro.", q("Pedir referido sin fit es:", ["Contraproducente", "Ideal", "Obligatorio"], 0)),
      cap(6, "Eventos / comunidades", "Participa en 1 comunidad del sector esta semana (online o presencial).", q("Las comunidades ayudan a:", ["Mercado oculto", "Nada", "Bajar skills"], 0)),
      cap(7, "CRM simple", "Lleva sheet: contacto, fecha, estado, próximo paso.", q("Sin seguimiento el networking:", ["Se enfría", "Se multiplica solo", "Es ilegal"], 0)),
    ],
  },
  {
    code: "OUT-07",
    title: "Entrevistas + negociación",
    summary: "Simulación, preguntas difíciles y salario.",
    days: 7,
    capsules: [
      cap(1, "Historias STAR", "Prepara 5 historias. Grábate 90 segundos cada una.", q("Cada historia debe durar ~:", ["90 segundos", "20 minutos", "5 segundos"], 0)),
      cap(2, "Preguntas difíciles", "Practica: gaps, despido, debilidad, conflicto.", q("Ante el despido conviene:", ["Hechos + aprendizaje", "Culpar a todos", "Mentir"], 0)),
      cap(3, "Preguntas al entrevistador", "3 preguntas inteligentes sobre éxito en el rol a 90 días.", q("Buenas preguntas muestran:", ["Interés estratégico", "Desesperación", "Nada"], 0)),
      cap(4, "Ancla salarial", "Define piso, meta y techo con datos de mercado.", q("Negociar sin ancla es:", ["Más débil", "Más fuerte", "Igual"], 0)),
      cap(5, "Simulacro", "Haz una entrevista mock por voz (filtro predictivo) y pide feedback.", q("El simulacro reduce:", ["Ansiedad y errores", "Preparación", "Ofertas"], 0)),
      cap(6, "Casos / pruebas", "Si hay case study: estructura problema → opciones → recomendación.", q("En un case conviene:", ["Estructurar el razonamiento", "Improvisar caos", "Callar"], 0)),
      cap(7, "Cierre de entrevista", "Resume fit en 20s y confirma próximos pasos/fechas.", q("Al cerrar debes:", ["Confirmar siguientes pasos", "Desaparecer", "Pedir el doble sin datos"], 0)),
    ],
  },
  {
    code: "OUT-08",
    title: "Oferta y primeros 90 días",
    summary: "Cierre de oferta, onboarding y retención.",
    days: 7,
    capsules: [
      cap(1, "Evaluar oferta", "Total compensation, aprendizaje, cultura, distancia/remoto.", q("Evalúa más que:", ["Solo salario base", "Todo el paquete", "El color de la oficina"], 1)),
      cap(2, "Negociar con datos", "Contraoferta educada con evidencia de mercado y valor.", q("La contraoferta debe ser:", ["Educada y con evidencia", "Ultimátum agresivo", "Silencio"], 0)),
      cap(3, "Plan 30-60-90", "Aprender, aportar, liderar. Compártelo con tu jefe.", q("El plan 30-60-90 comunica:", ["Expectativas claras", "Vacaciones", "Nada"], 0)),
      cap(4, "Pausa búsqueda", "Si aceptas, pausa outplacement y activa modo 90 días.", q("Al aceptar conviene:", ["Activar modo 90 días", "Seguir spammeando CVs", "Borrar LinkedIn"], 0)),
      cap(5, "Aliados internos", "Identifica 3 personas clave (buddy, peer, stakeholder).", q("Los aliados aceleran:", ["Onboarding", "Despidos", "Nada"], 0)),
      cap(6, "Quick wins", "Entrega 1 mejora visible en 30 días (doc, proceso, métrica).", q("Un quick win debe ser:", ["Visible y útil", "Invisible", "Riesgoso sin permiso"], 0)),
      cap(7, "Revisión con jefe", "Agenda feedback a los 30 días con tu plan 30-60-90.", q("Pedir feedback temprano:", ["Reduce sorpresas", "Molesta siempre", "Es opcional siempre"], 0)),
    ],
  },
];

const header = `export type OutModule = {
  code: string;
  title: string;
  summary: string;
  days: number;
  capsules: { day: number; title: string; content: string; quiz?: { question: string; options: string[]; answer: number } }[];
};

export const OUTPLACEMENT_MODULES: OutModule[] = ${JSON.stringify(modules, null, 2)};

export const OUT09_QUESTIONS = [
  { id: "important", label: "¿Qué es lo más importante que debe lograr este refuerzo?" },
  { id: "hardest", label: "¿Qué es lo que más se te dificulta hoy?" },
  { id: "urgent", label: "¿Qué quieres reforzar con más urgencia?" },
  { id: "level", label: "¿Cuál es tu nivel actual?", options: ["principiante", "intermedio", "avanzado"] },
  { id: "minutes", label: "¿Cuántos minutos al día puedes dedicar?", options: ["5", "10", "15"] },
] as const;
`;

require("fs").writeFileSync("src/lib/outplacement/modules.ts", header);
console.log("modules written", modules.length, "days", modules.reduce((a,m)=>a+m.days,0));
