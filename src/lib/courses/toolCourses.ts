import type { CourseDef, CourseLesson } from "@/lib/courses/types";
import {
  TOOL_LESSON_ENRICHMENTS,
  toolEnrichmentKey,
} from "@/lib/courses/toolEnrichments";

type Sketch = {
  title: string;
  teaser: string;
  why: string;
  practice: string;
  tips?: string[];
  example?: string;
  template?: string;
};

function lesson(courseId: string, i: number, s: Sketch): CourseLesson {
  const id = `${courseId}-l${i + 1}`;
  const rich = TOOL_LESSON_ENRICHMENTS[toolEnrichmentKey(courseId, i)];
  return {
    id,
    title: s.title,
    teaser: s.teaser,
    why: rich?.why || s.why,
    howTo: rich?.howTo || [
      `Objetivo: ${s.title}.`,
      s.practice,
      "Hazlo por escrito (nota o doc). No lo dejes solo en la cabeza.",
      "Marca las tareas. Si te trabas, reduce a 20 minutos y cierra igual.",
      "Guarda evidencia para usarla en CV, LinkedIn o entrevistas.",
    ],
    tips: rich?.tips ||
      s.tips || [
        "Hecho > perfecto.",
        "Pide feedback a 1 persona si el entregable es público (CV, mensaje).",
        "Mañana: un solo siguiente paso concreto.",
      ],
    example:
      rich?.example ||
      s.example ||
      `Ejemplo: con 45–60 min hoy aplicas “${s.title}”. Entregable: texto o lista que puedas mostrar mañana.`,
    template:
      rich?.template ||
      s.template ||
      `Plantilla — ${s.title}
Fecha: ___
Contexto: …
Pasos hechos:
1. …
2. …
Evidencia: …
Siguiente paso: …`,
    tasks: [
      { id: `${id}-t1`, label: `Práctica: ${s.practice.slice(0, 110)}${s.practice.length > 110 ? "…" : ""}`, minutes: 25 },
      { id: `${id}-t2`, label: "Completar plantilla / guardar evidencia", minutes: 10 },
      { id: `${id}-t3`, label: "Definir siguiente paso de mañana (1 frase)", minutes: 5 },
    ],
  };
}

function course(
  partial: Omit<CourseDef, "lessons"> & { sketches: Sketch[]; toolHref?: string; toolLabel?: string }
): CourseDef & { toolHref?: string; toolLabel?: string } {
  const { sketches, toolHref, toolLabel, ...rest } = partial;
  return {
    ...rest,
    toolHref,
    toolLabel,
    lessons: sketches.map((s, i) => lesson(rest.id, i, s)),
  };
}

/** Cursos de herramientas / áreas Carrera (además de ruta OUT y bienestar). */
export const TOOL_COURSES: (CourseDef & { toolHref?: string; toolLabel?: string })[] = [
  course({
    id: "linkedin-opt",
    title: "Optimizar LinkedIn",
    short: "LinkedIn",
    summary: "Headline, About y keywords alineados a tu rol target — luego generas el texto en la herramienta.",
    href: "/herramientas/linkedin",
    toolHref: "/herramientas/linkedin",
    toolLabel: "Abrir generador LinkedIn",
    sketches: [
      {
        title: "Headline que vende",
        teaser: "Cargo + valor + para quién, no solo el título genérico.",
        why: "El headline es lo primero que ve un reclutador en búsqueda.",
        practice: "Escribe 3 versiones: (1) rol target (2) resultado que entregas (3) industria/ciudad.",
        template: `Headline v1: ___ | ___ | ___
Headline v2: …
Headline elegida: …`,
      },
      {
        title: "About con método STAR",
        teaser: "Párrafos cortos: quién eres, prueba, CTA.",
        why: "El About cierra la decisión de escribirte o no.",
        practice: "Redacta About en 4 bloques: presentas / 2 logros con número / cómo trabajas / CTA.",
      },
      {
        title: "Keywords honestas",
        teaser: "Las mismas que en la oferta, sin inventar experiencia.",
        why: "Sin keywords no apareces; con keywords falsas te queman en entrevista.",
        practice: "Lista 10 keywords de 2 ofertas reales y márcalas solo si las puedes defender.",
      },
      {
        title: "Foto, banner y CTA",
        teaser: "Señales de confianza y cómo contactarte.",
        why: "Perfiles sin foto o sin CTA bajan respuesta.",
        practice: "Checklist: foto clara, banner simple, email/WhatsApp o “escríbeme”.",
      },
      {
        title: "Generar y pegar",
        teaser: "Usa la herramienta y ajusta con tu voz.",
        why: "La IA acelera; tú validas que suene a ti.",
        practice: "Genera headline/About en la herramienta, edita 5 minutos y pega en LinkedIn.",
      },
    ],
  }),
  course({
    id: "carta-postulacion",
    title: "Carta o mensaje de postulación",
    short: "Carta",
    summary: "Estructura fiel a tu CV y a ESA oferta; luego generas el borrador.",
    href: "/herramientas/carta",
    toolHref: "/herramientas/carta",
    toolLabel: "Abrir generador de carta",
    sketches: [
      {
        title: "Carta vs mensaje corto",
        teaser: "Cuándo un párrafo y cuándo una carta.",
        why: "En Easy Apply casi siempre gana un mensaje de 8–12 líneas.",
        practice: "Decide para tu vacante actual: mensaje LinkedIn, email o carta PDF.",
      },
      {
        title: "Estructura de 4 bloques",
        teaser: "Gancho · prueba · encaje · cierre.",
        why: "Sin estructura el reclutador abandona a la mitad.",
        practice: "Escribe 1 frase por bloque usando UN logro con métrica de tu CV.",
      },
      {
        title: "Alinear a la oferta",
        teaser: "Espejo de 3 requisitos del aviso.",
        why: "Cartas genéricas se detectan en segundos.",
        practice: "Copia 3 requisitos del JD y escribe cómo los cumples (sin inventar).",
      },
      {
        title: "Tone check y red flags",
        teaser: "Sin mendigar ni exagerar.",
        why: "El tono vende tanto como el contenido.",
        practice: "Relee en voz alta. Tacha adjetivos vacíos (“proactivo”, “apasionado”) sin prueba.",
      },
      {
        title: "Generar borrador",
        teaser: "Herramienta + tu edición final.",
        why: "El borrador IA es el 60%; tu edición es el 40% que decide.",
        practice: "Genera con CV+oferta, edita nombres/métricas y guarda la versión final.",
      },
    ],
  }),
  course({
    id: "plantilla-cv-ats",
    title: "Plantilla CV ATS (una columna)",
    short: "Plantilla CV",
    summary: "Formato que leen robots y humanos; luego llenas la plantilla.",
    href: "/herramientas/plantilla",
    toolHref: "/herramientas/plantilla",
    toolLabel: "Abrir plantilla CV",
    sketches: [
      {
        title: "Por qué una columna",
        teaser: "Tablas y columnas rompen parsers.",
        why: "Muchos ATS fallan con diseños de dos columnas.",
        practice: "Abre tu CV actual y lista 3 elementos de diseño riesgosos (tabla, text box, íconos).",
      },
      {
        title: "Secciones mínimas",
        teaser: "Perfil, experiencia, logros, skills, educación.",
        why: "Secciones raras confunden al parser y al reclutador.",
        practice: "Arma el outline de secciones en el orden ATS.",
      },
      {
        title: "Logros con métrica",
        teaser: "Verbo + acción + número/alcance.",
        why: "Sin métrica pareces lista de tareas.",
        practice: " Reescribe 5 viñetas con al menos un número o alcance.",
      },
      {
        title: "Keywords del aviso",
        teaser: "Solo las que puedes defender.",
        why: "Match de keywords sube score; inventarlas te destruye en entrevista.",
        practice: "Pega 15 keywords del JD y marca SÍ/NO con evidencia.",
      },
      {
        title: "Llenar la plantilla",
        teaser: "Usa la herramienta y exporta/copia.",
        why: "El formato listo evita rehacer el CV desde cero.",
        practice: "Completa la plantilla ATS y pásala por el analizador gratis.",
      },
    ],
  }),
  course({
    id: "checklist-ats",
    title: "Checklist de formato ATS",
    short: "Checklist ATS",
    summary: "Autochequeo de formato antes de enviar el PDF.",
    href: "/herramientas/checklist",
    toolHref: "/herramientas/checklist",
    toolLabel: "Abrir checklist",
    sketches: [
      {
        title: "Parsers vs humanos",
        teaser: "Primero el robot, luego la persona.",
        why: "Si el parser falla, nadie lee tu diseño bonito.",
        practice: "Exporta a TXT mentalmente: ¿se lee en orden?",
      },
      {
        title: "Prohibidos frecuentes",
        teaser: "Tablas, headers, imágenes de texto.",
        why: "Son los top killers de ATS.",
        practice: "Marca en tu CV cada elemento de riesgo.",
      },
      {
        title: "PDF con texto seleccionable",
        teaser: "No escanees el CV como imagen.",
        why: "PDF imagen = score cero.",
        practice: "Abre el PDF y selecciona una frase. Si no se selecciona, regenera.",
      },
      {
        title: "Autochequeo final",
        teaser: "Lista antes de enviar.",
        why: "Un checklist de 3 minutos evita rebotes tontos.",
        practice: "Completa la checklist interactiva de la herramienta.",
      },
    ],
  }),
  course({
    id: "entrevistas-star",
    title: "Práctica de entrevistas STAR",
    short: "Entrevistas",
    summary: "Historias STAR listas + simulador con feedback.",
    href: "/outplacement/entrevista",
    toolHref: "/outplacement/entrevista",
    toolLabel: "Abrir simulador STAR",
    sketches: [
      {
        title: "Método STAR",
        teaser: "Situación, Tarea, Acción, Resultado.",
        why: "Sin estructura divagas; con STAR demuestras impacto.",
        practice: "Escribe una historia en 4 líneas S/T/A/R.",
      },
      {
        title: "Banco de 5 historias",
        teaser: "Logro, conflicto, liderazgo, error, aprendizaje.",
        why: "Las mismas 5 cubren el 80% de preguntas conductuales.",
        practice: "Nombra las 5 historias y el rol donde ocurrieron.",
      },
      {
        title: "Preguntas difíciles",
        teaser: "Despido, gap, debilidad.",
        why: "La preparación evita tono defensivo.",
        practice: "Escribe respuesta de 60–90s a “¿por qué saliste?”.",
      },
      {
        title: "Preguntas al entrevistador",
        teaser: "3 preguntas inteligentes.",
        why: "Muestras criterio y cierras con interés real.",
        practice: "Lista 3 preguntas sobre equipo, éxito a 90 días y retos.",
      },
      {
        title: "Simulador + feedback",
        teaser: "Practica en la herramienta.",
        why: "La repetición baja ansiedad.",
        practice: "Haz 1 ronda en el simulador y anota 2 mejoras.",
      },
    ],
  }),
  course({
    id: "filtro-telefonico",
    title: "Filtro telefónico (primera llamada)",
    short: "Filtro",
    summary: "Las 3 preguntas típicas + ensayo con score.",
    href: "/outplacement/filtro",
    toolHref: "/outplacement/filtro",
    toolLabel: "Ensayar filtro",
    sketches: [
      {
        title: "Qué busca el filtro",
        teaser: "Encaje rápido, no la entrevista final.",
        why: "El filtro descarta; no enamora.",
        practice: "Lista qué SÍ/NO aceptas (ciudad, híbrido, sueldo piso).",
      },
      {
        title: "Disponibilidad y logística",
        teaser: "Cuándo puedes empezar y modalidad.",
        why: "Respuestas vagas matan el proceso.",
        practice: "Escribe tu respuesta de 20s a disponibilidad.",
      },
      {
        title: "Pretensión sin quemarte",
        teaser: "Rango + ancla a mercado.",
        why: "Un número solo te deja sin margen.",
        practice: "Define piso/meta y una frase de pretensión.",
      },
      {
        title: "“Cuéntame de ti” en 60s",
        teaser: "Pitch corto alineado al rol.",
        why: "Es la pregunta #1 del filtro.",
        practice: "Graba o escribe pitch 60s (presente · prueba · por qué este rol).",
      },
      {
        title: "Ensayo con score",
        teaser: "Usa la herramienta de filtro.",
        why: "Practicar baja el nerviosismo de la llamada real.",
        practice: "Completa las 3 preguntas en la herramienta y revisa el score.",
      },
    ],
  }),
  course({
    id: "negociacion-oferta",
    title: "Negociar oferta y salario",
    short: "Oferta",
    summary: "Piso/meta/techo, scripts CO y wizard de contraoferta.",
    href: "/outplacement/oferta",
    toolHref: "/outplacement/oferta",
    toolLabel: "Abrir wizard de oferta",
    sketches: [
      {
        title: "Compensación total",
        teaser: "Base + variable + beneficios.",
        why: "Negociar solo el base deja plata en la mesa.",
        practice: "Lista todos los componentes de tu oferta actual o ideal.",
      },
      {
        title: "Piso, meta y techo",
        teaser: "Tres números antes de hablar.",
        why: "Sin piso aceptas de miedo; sin techo no pides.",
        practice: "Define los 3 números en COP para tu rol/ciudad.",
      },
      {
        title: "Anclas de mercado",
        teaser: "Bandas orientativas + ofertas reales.",
        why: "El ancla cambia la conversación.",
        practice: "Anota 2 referencias (banda app + 1 oferta/amigo).",
      },
      {
        title: "Texto de contraoferta",
        teaser: "Agradece · valor · pide · alternativa.",
        why: "Un script reduce ansiedad y tono agresivo.",
        practice: "Escribe un párrafo de contraoferta con tu meta.",
      },
      {
        title: "Wizard práctico",
        teaser: "Completa el asistente de oferta.",
        why: "La herramienta calcula y arma scripts Colombia.",
        practice: "Pasa el wizard y guarda el script final.",
      },
    ],
  }),
  course({
    id: "networking-crm",
    title: "Networking y mercado oculto",
    short: "Networking",
    summary: "Mapa de contactos, favores concretos y CRM simple.",
    href: "/outplacement/networking",
    toolHref: "/outplacement/networking",
    toolLabel: "Abrir CRM de contactos",
    sketches: [
      {
        title: "Mapa de 20 contactos",
        teaser: "Cercanos, profesionales y puentes.",
        why: "El mercado oculto vive en personas, no solo en portales.",
        practice: "Escribe 20 nombres en 3 columnas.",
      },
      {
        title: "Favor concreto",
        teaser: "Pedidos de <20 minutos.",
        why: "“Si ves algo” no genera acción.",
        practice: "Para 5 personas define UN favor específico.",
      },
      {
        title: "Script de mensaje",
        teaser: "Corto, claro, fácil de responder.",
        why: "Mensajes largos se ignoran.",
        practice: "Redacta 1 mensaje LinkedIn/email con CTA sí/no.",
      },
      {
        title: "Seguimiento",
        teaser: "Día 4–7 sin acosar.",
        why: "La mayoría del valor está en el follow-up.",
        practice: "Agenda 3 follow-ups en tu calendario.",
      },
      {
        title: "CRM en la app",
        teaser: "Registra y actualiza estados.",
        why: "Sin registro pierdes hilos.",
        practice: "Carga 5 contactos en el CRM y define next step.",
      },
    ],
  }),
  course({
    id: "portfolio-star",
    title: "Caso / portfolio STAR",
    short: "Portfolio",
    summary: "Un caso de impacto listo para CV y entrevistas.",
    href: "/outplacement/portfolio",
    toolHref: "/outplacement/portfolio",
    toolLabel: "Armar caso STAR",
    sketches: [
      {
        title: "Elegir el logro",
        teaser: "El que tenga número y relevancia al rol target.",
        why: "Un caso mediocre diluye tu marca.",
        practice: "Elige 1 logro top y por qué aplica al rol que buscas.",
      },
      {
        title: "Situación y tarea",
        teaser: "Contexto en 3 líneas.",
        why: "Sin contexto el resultado no pesa.",
        practice: "Escribe S y T en máximo 60 palabras.",
      },
      {
        title: "Acción medible",
        teaser: "Qué hiciste TÚ (no el equipo genérico).",
        why: "Los reclutadores detectan “nosotros” vacío.",
        practice: "Lista 4 acciones en primera persona.",
      },
      {
        title: "Resultado con número",
        teaser: "% · tiempo · plata · usuarios.",
        why: "El resultado cierra la historia.",
        practice: "Escribe R con al menos una métrica (o alcance estimado honesto).",
      },
      {
        title: "Llevarlo a CV y tool",
        teaser: "Viñeta + caso completo en la app.",
        why: "El mismo caso alimenta CV, LinkedIn y entrevista.",
        practice: "Completa el caso en la herramienta portfolio.",
      },
    ],
  }),
  course({
    id: "bandas-salario",
    title: "Bandas salariales (orientativo CO)",
    short: "Salario",
    summary: "Leer rangos y usarlos en negociación.",
    href: "/herramientas/salario",
    toolHref: "/herramientas/salario",
    toolLabel: "Abrir bandas salariales",
    sketches: [
      {
        title: "Cómo leer una banda",
        teaser: "Mínimo no es tu piso personal.",
        why: "Confundir banda de mercado con tu pretensión te hace pedir mal.",
        practice: "Anota min/max de tu rol y marca tu piso personal.",
      },
      {
        title: "Ciudad y modalidad",
        teaser: "Bogotá/Medellín vs otras / remoto.",
        why: "El multiplicador cambia el número real.",
        practice: "Compara tu rol en 2 ciudades con la calculadora.",
      },
      {
        title: "Usar el rango en entrevista",
        teaser: "Frase de pretensión con rango.",
        why: "Un solo número te encierra.",
        practice: "Escribe la frase con piso–meta.",
      },
      {
        title: "Calcular en la app",
        teaser: "Herramienta + checklist negociación.",
        why: "Cierra con números listos para el wizard de oferta.",
        practice: "Genera banda y copia piso/meta/techo a tus notas.",
      },
    ],
  }),
  course({
    id: "cultura-oferta",
    title: "Leer la cultura en la oferta",
    short: "Cultura",
    summary: "Señales de ritmo, autonomía y red flags en el aviso.",
    href: "/herramientas/cultura",
    toolHref: "/herramientas/cultura",
    toolLabel: "Analizar oferta",
    sketches: [
      {
        title: "Señales de ritmo y autonomía",
        teaser: "Lo que el JD dice entre líneas.",
        why: "El misfit cultural quema más que el sueldo bajo.",
        practice: "Subraya 5 frases del aviso que indiquen ritmo/autonomía.",
      },
      {
        title: "Red flags",
        teaser: "Urgencia tóxica, vaguedad, overtime glorificado.",
        why: "Detectarlas evita aceptar mal.",
        practice: "Marca SÍ/NO en una checklist de 6 red flags.",
      },
      {
        title: "Preguntas de discovery",
        teaser: "Qué preguntar en entrevista.",
        why: "Validas la cultura antes de firmar.",
        practice: "Escribe 3 preguntas de cultura para el hiring manager.",
      },
      {
        title: "Analizar con la herramienta",
        teaser: "Pega el aviso y lee el resultado.",
        why: "Acelera el diagnóstico.",
        practice: "Corre el análisis cultural y anota 2 insights.",
      },
    ],
  }),
  course({
    id: "remoto-bilingue",
    title: "CV bilingüe y empleo remoto",
    short: "Remoto EN",
    summary: "Viñetas ES→EN y checklist de remoto.",
    href: "/outplacement/remoto",
    toolHref: "/outplacement/remoto",
    toolLabel: "Abrir CV bilingüe",
    sketches: [
      {
        title: "Formato EN para remoto",
        teaser: "Una columna, keywords EN.",
        why: "Roles remote-first suelen filtrar en inglés.",
        practice: "Lista 10 keywords EN de un JD remoto real.",
      },
      {
        title: "Traducir sin inventar",
        teaser: "Fiel a tu experiencia.",
        why: "Overclaim en EN se nota en la entrevista.",
        practice: "Traduce 5 viñetas manteniendo la métrica.",
      },
      {
        title: "Logística remota",
        teaser: "Zona horaria, contrato, equipo.",
        why: "Muchos procesos mueren por logística no dicha.",
        practice: "Escribe tu disponibilidad TZ y restricciones.",
      },
      {
        title: "Usar la herramienta",
        teaser: "Genera viñetas y checklist.",
        why: "Aceleras el CV EN.",
        practice: "Completa el flujo remoto/bilingüe en la app.",
      },
    ],
  }),
  course({
    id: "rumbo-riasec",
    title: "Rumbo profesional (RIASEC)",
    short: "Rumbo",
    summary: "Intereses Holland + roles típicos LATAM.",
    href: "/outplacement/assessment",
    toolHref: "/outplacement/assessment",
    toolLabel: "Hacer assessment",
    sketches: [
      {
        title: "Qué mide RIASEC",
        teaser: "Intereses, no inteligencia.",
        why: "Sirve para orientar roles, no para etiquetarte.",
        practice: "Lee las 6 letras y anota cuál te resuena a priori.",
      },
      {
        title: "Cómo responder",
        teaser: "Honesto, sin “debería”.",
        why: "Respuestas aspiracionales sesgan el código.",
        practice: "Responde 5 ítems de práctica en papel (1–5).",
      },
      {
        title: "Leer tu código",
        teaser: "Top 3 letras y combinación.",
        why: "El código abre familias de roles.",
        practice: "Anota 3 roles LATAM compatibles con tu hipótesis.",
      },
      {
        title: "Tomar el assessment",
        teaser: "18 ítems en la app.",
        why: "Cierra con un resultado guardado.",
        practice: "Completa el assessment y guarda el código.",
      },
    ],
  }),
  course({
    id: "career-brief",
    title: "Career brief (1 página)",
    short: "Career brief",
    summary: "Resumen ejecutivo de tu narrativa profesional.",
    href: "/outplacement/career-brief",
    toolHref: "/outplacement/career-brief",
    toolLabel: "Generar brief",
    sketches: [
      {
        title: "Para qué sirve el brief",
        teaser: "Alinear CV, LinkedIn y pitch.",
        why: "Sin brief cada canal cuenta una historia distinta.",
        practice: "Escribe en 2 frases tu posicionamiento target.",
      },
      {
        title: "Proof points",
        teaser: "3 pruebas con número.",
        why: "El brief sin evidencia es marketing vacío.",
        practice: "Lista 3 proof points defendibles.",
      },
      {
        title: "Versión 1 página",
        teaser: "Bloques claros.",
        why: "Debe caber en una pantalla.",
        practice: "Outline: perfil · pruebas · target · CTA.",
      },
      {
        title: "Generar en la app",
        teaser: "Herramienta career brief.",
        why: "Aceleras el documento base.",
        practice: "Genera el brief y edítalo 10 minutos.",
      },
    ],
  }),
  course({
    id: "primeros-90-dias",
    title: "Primeros 90 días en el empleo",
    short: "90 días",
    summary: "Checklist para no fallar el periodo de prueba.",
    href: "/outplacement/90-dias",
    toolHref: "/outplacement/90-dias",
    toolLabel: "Abrir checklist 90 días",
    sketches: [
      {
        title: "Días 1–7",
        teaser: "Mapa de stakeholders y expectativas.",
        why: "La primera semana define percepción.",
        practice: "Lista 5 personas clave y qué esperan de ti.",
      },
      {
        title: "Primeros 30",
        teaser: "Aprender el sistema y quick wins chicos.",
        why: "Demuestras tracción sin romper procesos.",
        practice: "Define 2 quick wins factibles en 30 días.",
      },
      {
        title: "60 días",
        teaser: "Entregables visibles.",
        why: "Mitad de prueba: necesitas evidencia.",
        practice: "Escribe 1 entregable medible a día 60.",
      },
      {
        title: "90 días",
        teaser: "Impacto y feedback con jefe.",
        why: "Cierras la prueba con narrativa de valor.",
        practice: "Prepara 5 bullets de impacto para la 1:1.",
      },
      {
        title: "Checklist en la app",
        teaser: "Marca el plan 30-60-90.",
        why: "El seguimiento evita olvidos.",
        practice: "Abre la checklist y marca lo ya hecho.",
      },
    ],
  }),
  course({
    id: "segunda-carrera",
    title: "Segunda carrera / pivote",
    short: "Pivote",
    summary: "Explorar pivote, freelance o startup con plan accionable.",
    href: "/outplacement/segunda-carrera",
    toolHref: "/outplacement/segunda-carrera",
    toolLabel: "Abrir segunda carrera",
    sketches: [
      {
        title: "Por qué pivote",
        teaser: "Motivo real vs fantasía.",
        why: "Pivote sin diagnóstico gasta meses.",
        practice: "Escribe en 5 líneas por qué quieres cambiar.",
      },
      {
        title: "Skills transferibles",
        teaser: "Qué llevas al nuevo campo.",
        why: "No partes de cero.",
        practice: "Lista 8 skills y márcalas transferibles SÍ/NO.",
      },
      {
        title: "Validar demanda",
        teaser: "Mini-investigación de mercado.",
        why: "Evitas estudiar algo sin vacantes.",
        practice: "Encuentra 5 vacantes del rol target y anota requisitos comunes.",
      },
      {
        title: "Mini-experimento",
        teaser: "7–14 días de prueba.",
        why: "Barato aprender antes de renunciar a todo.",
        practice: "Diseña un experimento (curso corto, freelance piloto, coffee chat x5).",
      },
      {
        title: "Plan en la app",
        teaser: "Usa el track de segunda carrera.",
        why: "Te da estructura día a día.",
        practice: "Elige track y personaliza con tu contexto.",
      },
    ],
  }),
  course({
    id: "video-mock",
    title: "Video entrevista asíncrona",
    short: "Video mock",
    summary: "Ensayo grabado con rúbrica de autoevaluación.",
    href: "/outplacement/video-entrevista",
    toolHref: "/outplacement/video-entrevista",
    toolLabel: "Grabar ensayo",
    sketches: [
      {
        title: "Formato asíncrono",
        teaser: "Qué evalúan en video.",
        why: "Es distinto a la entrevista live.",
        practice: "Lista 4 criterios (claridad, STAR, energía, tiempo).",
      },
      {
        title: "Setup",
        teaser: "Luz, audio, fondo.",
        why: "Mala tech distrae del contenido.",
        practice: "Haz checklist de setup y prueba 10s de video.",
      },
      {
        title: "STAR en 90s",
        teaser: "Historia completa sin relleno.",
        why: "El tiempo es estricto.",
        practice: "Escribe guion 90s de tu mejor historia.",
      },
      {
        title: "Grabar y rúbrica",
        teaser: "Usa la herramienta de video.",
        why: "Te ves y corriges.",
        practice: "Graba 1 toma y completa la rúbrica.",
      },
    ],
  }),
  course({
    id: "banco-entrevistas-tool",
    title: "Banco de preguntas por perfil",
    short: "Banco Q",
    summary: "Preguntas por tipo de rol + feedback IA.",
    href: "/herramientas/entrevistas",
    toolHref: "/herramientas/entrevistas",
    toolLabel: "Abrir banco de entrevistas",
    sketches: [
      {
        title: "Elegir el banco",
        teaser: "General, tech, datos, liderazgo…",
        why: "Practicar genérico no prepara tu proceso.",
        practice: "Elige el banco de tu rol target.",
      },
      {
        title: "Respuesta escrita STAR",
        teaser: "Primero estructura, luego oral.",
        why: "Escribir fija la historia.",
        practice: "Responde 1 pregunta por escrito con STAR.",
      },
      {
        title: "Feedback IA",
        teaser: "Pide mejoras concretas.",
        why: "Aceleras iteración.",
        practice: "Envía a feedback y aplica 2 cambios.",
      },
      {
        title: "Otra pregunta",
        teaser: "Repite con variación.",
        why: "La variedad prepara sorpresas.",
        practice: "Haz 2 rondas más en la herramienta.",
      },
    ],
  }),
];

export function toolCourseByHref(href: string) {
  return TOOL_COURSES.find((c) => c.href === href || c.toolHref === href) || null;
}

export function toolCourseById(id: string) {
  return TOOL_COURSES.find((c) => c.id === id) || null;
}
