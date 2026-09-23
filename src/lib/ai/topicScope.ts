/**
 * La IA solo contesta preguntas del tema de la pantalla.
 * Repaso, psicotécnicas y el análisis ATS los arma el código; este filtro
 * es para preguntas sueltas. Si la pregunta es de otro tema, devolvemos
 * un texto fijo (nunca una respuesta vacía).
 */

const CAREER =
  /cv|hoja de vida|\bhv\b|\bats\b|vacante|aviso|oferta|empleo|trabajo|puesto|cargo|\brol\b|entrevista|postul|reclut|selecci[oó]n|salario|compens|linkedin|logro|habilidad|experiencia|equipo|\bjefe\b|manager|empresa|carrera|networking|referid|\bstar\b|itil|devops|\bsla\b|\bkpi\b|\bokr\b|lider|viñeta|bullet|keyword|palabra clave|portal|workday|greenhouse|carta|cover|cultura|marca personal|soar|guion|pitch|negoci|primer d[ií]a|semana|incidente|operaci|infraestructura|plataforma|certific|curso|aprender|pr[aá]ctic|repaso|ticket|backlog|handoff|stakeholder|m[eé]trica|proceso|servicio|cloud|\baws\b|azure|\bgcp\b|finops|aiops|\bsre\b|observab|power\s*bi|excel|\bsql\b|python|reuni[oó]n|reporte|comunicaci|asertiv|feedback|1:1|uno a uno/i;

const OFF_TOPIC =
  /receta de |c[oó]mo (cocinar|preparar) |ingredientes para |bandeja paisa|partido de f[uú]tbol|quiniela|marcador del |poema de amor|escr[ií]beme un chiste|cu[eé]ntame un chiste|hacke(ar|o)|malware|contrase[nñ]a del wifi|diagn[oó]stico m[eé]dico|qu[eé] pastilla|s[ií]ntomas de la gripe|bitcoin|trading de cripto|tarea del colegio|revoluci[oó]n francesa|novi[oa]\b|cita rom[aá]ntica|capital de |fotos[ií]ntesis|qui[eé]n gan[aeoóá] el/i;

const SHORT_FOLLOWUP =
  /^(hola|buenas|ayuda|ay[uú]dame|me ayudas|s[ií]|no|ok|dale|gracias|m[aá]s|m[aá]s concreto( por favor)?|expl[ií]came|un ejemplo|dame un ejemplo|c[oó]mo as[ií]|por qu[eé]|y eso|y el salario|sigue|contin[uú]a)[?.!\s]*$/i;

export const OFF_TOPIC_REPLY =
  "Solo respondo sobre el tema de esta pantalla (empleo, tu CV, la vacante, la entrevista o la práctica que estás haciendo). Escribe la pregunta enfocada en eso.";

export function extractUserQuestion(prompt: string): string {
  const marked = prompt.match(/pregunta del usuario[^:\n]{0,90}:\s*([\s\S]+)/i);
  if (marked?.[1]) return marked[1].trim().slice(0, 700);
  const users = [...prompt.matchAll(/Usuario:\s*([^\n]+)/gi)];
  if (users.length) return users[users.length - 1][1].trim().slice(0, 700);
  return prompt.trim().slice(0, 700);
}

const STRUCTURED_TASKS = new Set([
  "cv_rewrite",
  "ats_suggest",
  "application_advice",
  "out09_outline",
  "out09_capsule",
  "role_review",
]);

export function isClearlyOffTopic(text: string): boolean {
  const q = text.trim();
  if (!q) return false;
  if (CAREER.test(q)) return false;
  return OFF_TOPIC.test(q);
}

export function isOnTopicQuestion(question: string, coachModule = ""): boolean {
  const q = question.trim();
  if (!q) return true;
  if (CAREER.test(q)) return true;
  const mod = coachModule.trim();
  if (mod.length >= 4 && q.toLowerCase().includes(mod.toLowerCase().slice(0, Math.min(12, mod.length)))) {
    return true;
  }
  if (OFF_TOPIC.test(q)) return false;
  if (SHORT_FOLLOWUP.test(q)) return true;
  // Seguimientos cortos del coach (“no entiendo esto”, “más detalle”).
  // Un texto largo sin señal de empleo se corta para no contestar otro tema.
  if (q.length <= 120) return true;
  return false;
}

/**
 * Tareas de producto (reescribir CV, carta, plan) no son chat libre.
 * Si traen una pregunta marcada, esa sí se filtra.
 */
export function assessTopicScope(opts: {
  task: string;
  coachModule?: string;
  prompt: string;
}): { ok: true } | { ok: false; reply: string } {
  const hasUserTurn = /pregunta del usuario|Usuario:/i.test(opts.prompt);
  if (STRUCTURED_TASKS.has(opts.task) || !hasUserTurn) {
    if (isClearlyOffTopic(hasUserTurn ? extractUserQuestion(opts.prompt) : opts.prompt)) {
      return { ok: false, reply: OFF_TOPIC_REPLY };
    }
    if (!hasUserTurn) return { ok: true };
  }
  const question = extractUserQuestion(opts.prompt);
  if (isOnTopicQuestion(question, opts.coachModule || "")) return { ok: true };
  const tema = (opts.coachModule || "").trim();
  const reply = tema ? `Solo respondo sobre «${tema}». ${OFF_TOPIC_REPLY}` : OFF_TOPIC_REPLY;
  return { ok: false, reply };
}
