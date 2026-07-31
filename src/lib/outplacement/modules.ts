export type OutModule = {
  code: string;
  title: string;
  summary: string;
  days: number;
  capsules: { day: number; title: string; content: string; quiz?: { question: string; options: string[]; answer: number } }[];
};

export const OUTPLACEMENT_MODULES: OutModule[] = [
  {
    code: "OUT-01",
    title: "Estabilización emocional y narrativa",
    summary: "Procesa la transición y redefine tu historia profesional con claridad.",
    days: 5,
    capsules: [
      { day: 1, title: "Nombrar la transición", content: "Escribe en 5 líneas qué terminó, qué conservas y qué quieres atraer. Sin juicios.", quiz: { question: "¿Qué haces el día 1?", options: ["Ignorar el despido", "Nombrar hechos y aprendizajes", "Enviar 50 CVs"], answer: 1 } },
      { day: 2, title: "Energía y rutina", content: "Define una rutina de 45 minutos: cuerpo, mente y búsqueda. La constancia supera la intensidad.", quiz: { question: "La clave es:", options: ["Rutina corta diaria", "Trabajar 14 horas", "Esperar motivación"], answer: 0 } },
      { day: 3, title: "Narrativa de valor", content: "Frase base: 'Ayudo a X a lograr Y mediante Z'. Úsala en LinkedIn y entrevistas.", quiz: { question: "Tu frase debe incluir:", options: ["Solo cargo", "X, Y y Z (público, resultado, método)", "Solo salario"], answer: 1 } },
      { day: 4, title: "Red de apoyo", content: "Lista 5 personas de confianza. Pide consejo concreto, no 'avísame si hay algo'.", quiz: { question: "Al pedir ayuda conviene:", options: ["Ser vago", "Pedir algo específico", "No pedir"], answer: 1 } },
      { day: 5, title: "Cierre de fase", content: "Resume en audio de 60s tu narrativa. Escúchala y ajusta tono seguro, no defensivo.", quiz: { question: "El tono ideal es:", options: ["Defensivo", "Seguro y claro", "Arrogante"], answer: 1 } },
    ],
  },
  {
    code: "OUT-02",
    title: "Autoevaluación y mapa de competencias",
    summary: "FODA profesional y mapa de skills transferibles.",
    days: 4,
    capsules: [
      { day: 1, title: "Inventario de logros", content: "Lista 8 logros con métrica. Si no hay número, estima alcance o tiempo ahorrado." },
      { day: 2, title: "Hard vs soft", content: "Clasifica skills en técnicas y blandas. Marca las 5 más vendibles para tu próximo rol." },
      { day: 3, title: "FODA exprés", content: "Fortalezas, oportunidades, debilidades, amenazas del mercado. Una línea cada una." },
      { day: 4, title: "Propuesta de valor", content: "Une logros + skills + FODA en un párrafo de 80 palabras para tu CV." },
    ],
  },
  {
    code: "OUT-03",
    title: "Inteligencia de mercado laboral LATAM",
    summary: "Roles target, bandas salariales y gaps reales.",
    days: 4,
    capsules: [
      { day: 1, title: "3 roles target", content: "Elige 3 títulos de cargo reales en tu país. Copia requisitos comunes." },
      { day: 2, title: "Banda salarial", content: "Investiga rango (computrabajo, eleempleo, niveles.pro). Anota mínimo aceptable." },
      { day: 3, title: "Gaps", content: "Compara tu mapa vs requisitos. Prioriza 2 gaps cerrables en 30 días." },
      { day: 4, title: "Plan 30 días", content: "Calendario: aprendizaje, networking y postulaciones con cupos diarios." },
    ],
  },
  {
    code: "OUT-04",
    title: "Re-skilling / upskilling",
    summary: "Cierra brechas con cursos low-cost y práctica.",
    days: 5,
    capsules: [
      { day: 1, title: "Elegir 1 skill", content: "Una sola skill prioritaria. Evita dispersión." },
      { day: 2, title: "Recurso gratuito", content: "Elige un curso gratis/económico y agenda 25 min diarios." },
      { day: 3, title: "Proyecto mínimo", content: "Crea un entregable pequeño para mostrar en CV/LinkedIn." },
      { day: 4, title: "Publicar evidencia", content: "Publica el proyecto o un post de aprendizaje con resultado." },
      { day: 5, title: "Actualizar CV", content: "Agrega la skill con evidencia, no solo la palabra." },
    ],
  },
  {
    code: "OUT-05",
    title: "Marca personal + CV/LinkedIn ATS",
    summary: "Rewrites STAR y perfil LinkedIn alineado al mercado.",
    days: 5,
    capsules: [
      { day: 1, title: "Headline LinkedIn", content: "Cargo | Valor | Nicho. Sin frases vacías." },
      { day: 2, title: "About STAR", content: "3 logros STAR en el extracto." },
      { day: 3, title: "CV una columna", content: "Formato ATS-safe: una columna, secciones estándar, PDF limpio." },
      { day: 4, title: "Keywords honestas", content: "Integra keywords de ofertas reales sin inventar experiencia." },
      { day: 5, title: "Prueba ATSAdvisor", content: "Corre un análisis ATS contra una oferta target y sube el score." },
    ],
  },
  {
    code: "OUT-06",
    title: "Mercado oculto + networking",
    summary: "Scripts y outreach a reclutadores y hiring managers.",
    days: 5,
    capsules: [
      { day: 1, title: "Mapa de 20 contactos", content: "Excompañeros, líderes de área, reclutadores del sector." },
      { day: 2, title: "Script corto", content: "Mensaje de 5 líneas: contexto, valor, pedido concreto de 15 min." },
      { day: 3, title: "5 outreaches", content: "Envía 5 mensajes personalizados hoy." },
      { day: 4, title: "Seguimiento", content: "Follow-up educado a los que no respondieron en 4-5 días." },
      { day: 5, title: "Referidos", content: "Pide referidos solo cuando haya fit claro." },
    ],
  },
  {
    code: "OUT-07",
    title: "Entrevistas + negociación",
    summary: "Simulación, preguntas difíciles y salario.",
    days: 5,
    capsules: [
      { day: 1, title: "Historias STAR", content: "Prepara 5 historias. Grábate 90 segundos cada una." },
      { day: 2, title: "Preguntas difíciles", content: "Practica: gaps, despido, debilidad, conflicto." },
      { day: 3, title: "Preguntas al entrevistador", content: "3 preguntas inteligentes sobre éxito en el rol a 90 días." },
      { day: 4, title: "Ancla salarial", content: "Define piso, meta y techo con datos de mercado." },
      { day: 5, title: "Simulacro", content: "Haz una entrevista mock por voz y pide feedback." },
    ],
  },
  {
    code: "OUT-08",
    title: "Oferta y primeros 90 días",
    summary: "Cierre de oferta, onboarding y retención.",
    days: 4,
    capsules: [
      { day: 1, title: "Evaluar oferta", content: "Total compensation, aprendizaje, cultura, distancia/remoto." },
      { day: 2, title: "Negociar con datos", content: "Contraoferta educada con evidencia de mercado y valor." },
      { day: 3, title: "Plan 30-60-90", content: "Aprender, aportar, liderar. Compártelo con tu jefe." },
      { day: 4, title: "Pausa búsqueda", content: "Si aceptas, pausa outplacement y activa modo 90 días." },
    ],
  },
];

export const OUT09_QUESTIONS = [
  { id: "important", label: "¿Qué es lo más importante que debe lograr este refuerzo?" },
  { id: "hardest", label: "¿Qué es lo que más se te dificulta hoy?" },
  { id: "urgent", label: "¿Qué quieres reforzar con más urgencia?" },
  { id: "level", label: "¿Cuál es tu nivel actual?", options: ["principiante", "intermedio", "avanzado"] },
  { id: "minutes", label: "¿Cuántos minutos al día puedes dedicar?", options: ["5", "10", "15"] },
] as const;
