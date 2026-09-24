/** Cuestionario de perfil. Se responde una vez; el bloque de vacante se actualiza por proceso. */

export type PreguntaPerfil = { id: string; texto: string };

export type BloquePerfil = {
  id: string;
  titulo: string;
  nota?: string;
  preguntas: PreguntaPerfil[];
};

function bloque(id: string, titulo: string, textos: string[], nota?: string): BloquePerfil {
  return {
    id,
    titulo,
    nota,
    preguntas: textos.map((texto, i) => ({ id: `${id}-${i + 1}`, texto })),
  };
}

export const BLOQUES_PERFIL: BloquePerfil[] = [
  bloque(
    "trayectoria",
    "Trayectoria profesional",
    [
      "Nombre completo.",
      "Formación académica: pregrado, posgrados y certificaciones vigentes, con institución y año.",
      "Años de experiencia total y años en roles de liderazgo.",
      "Sectores o industrias en los que ha trabajado.",
      "Últimos tres cargos: empresa, cargo, tamaño del equipo a cargo y duración.",
      "¿Qué tipo de problemas le han encargado resolver de forma recurrente?",
      "Dos o tres logros de los que se sienta orgulloso, con el resultado concreto.",
      "¿Tiene o ha tenido emprendimientos o roles fuera del empleo formal?",
      "Idiomas y nivel.",
      "Herramientas y metodologías en las que es fuerte.",
    ],
    "Si ya tiene hoja de vida, responda solo lo que no esté allí."
  ),
  bloque(
    "vacante",
    "Vacante o assessment de este proceso",
    [
      "Cargo al que se postula y empresa, si se conoce.",
      "Responsabilidades y requisitos tal como los publicó la empresa.",
      "Nivel jerárquico: operativo, coordinación, jefatura, gerencia, dirección o C-level.",
      "Tamaño y tipo de organización: startup, pyme, multinacional, sector público.",
      "Modalidad, país y ciudad.",
      "¿Qué competencias cree que la empresa está evaluando primero?",
      "¿Qué prueba va a presentar? Nombre del instrumento si lo conoce.",
      "¿Es cronometrada? ¿Cuántas preguntas aproximadamente?",
      "¿Hay algo de su perfil que podría jugar en contra? Se registra para decirlo con honestidad, no para ocultarlo.",
    ],
    "Único bloque que se actualiza en cada postulación."
  ),
  bloque("liderazgo", "Estilo de liderazgo", [
    "Si tuviera que nombrar su estilo de liderazgo en una frase, ¿cuál sería?",
    "¿Cómo describirían su liderazgo quienes le han reportado? ¿Y sus jefes?",
    "Cuando delega, ¿qué entrega y qué retiene? ¿Hace seguimiento o suelta por completo?",
    "Ante un colaborador con bajo desempeño: ¿indaga la causa, corrige directo, forma o escala?",
    "¿Construye la solución con el equipo o llega con la solución ya pensada?",
    "¿Qué tan cómodo se siente tomando decisiones impopulares?",
    "Un colaborador comete un error costoso. ¿Qué haría en las primeras 24 horas?",
    "¿Cómo motiva de forma natural?",
    "¿Prefiere liderar expertos o formar gente desde cero?",
    "¿Qué es lo que no tolera en un equipo?",
  ]),
  bloque("valores", "Valores y principios", [
    "Tres a cinco valores que rigen su forma de trabajar, con un ejemplo real de cada uno.",
    "¿Qué haría si le piden algo que funciona para el negocio pero que usted considera incorrecto?",
    "¿Qué pesa más: el resultado del trimestre o la relación con el equipo y los clientes a largo plazo?",
    "Ante un error del equipo, ¿busca responsables o se enfoca en la solución?",
    "¿Qué tan estricto es con políticas y procedimientos? ¿Qué excepciones aceptaría?",
    "En una negociación, ¿busca ganar-ganar, maximizar su posición o ceder para preservar la relación?",
    "¿Comparte la información completa con el equipo o la dosifica?",
    "Nombre una situación en la que tuvo que elegir entre dos cosas correctas. ¿Cómo decidió?",
  ]),
  bloque("decisiones", "Decisiones y riesgo", [
    "¿Decide con datos, con intuición o con una mezcla? ¿En qué proporción?",
    "Con información incompleta, ¿avanza con lo que tiene o espera claridad?",
    "¿Con qué frecuencia pide claridad antes de ejecutar?",
    "¿Qué tan rápido decide? ¿Le han dicho que es impaciente o que es lento?",
    "Frente a una innovación riesgosa: ¿piloto controlado, lanzamiento completo o esperar a que otro valide?",
    "¿Prefiere anticiparse para prevenir o reaccionar bien cuando el problema aparece?",
    "Cuando algo falla, ¿corrige el síntoma o busca la causa raíz aunque tome más tiempo?",
    "¿Escala a su jefe pronto, tarde o solo cuando no tiene salida?",
    "¿Cómo prioriza cuando tiene cinco cosas urgentes?",
    "Una decisión difícil de la que hoy se arrepiente. ¿Qué haría distinto?",
  ]),
  bloque("conflicto", "Conflicto, presión y errores", [
    "Cuando dos personas de su equipo están en conflicto, ¿media, los deja resolverlo o escala?",
    "¿Aborda los conflictos apenas aparecen o espera a ver si se resuelven solos?",
    "Si alguien le habla mal de un tercero, ¿qué hace?",
    "¿Cómo reacciona cuando lo critican injustamente delante de otros?",
    "¿Cómo maneja el enojo en el trabajo? ¿Se le nota?",
    "Bajo presión extrema, ¿se cierra y ejecuta solo, o convoca al equipo y pide ayuda?",
    "¿Le cuesta pedir ayuda? ¿Por qué?",
    "Si su jefe da una instrucción que considera equivocada, ¿la discute, la ejecuta, o la ejecuta y documenta su desacuerdo?",
    "¿Cómo reconoce públicamente un error propio?",
    "¿Qué le genera más estrés: la ambigüedad, el conflicto interpersonal, la sobrecarga o el fracaso público?",
  ]),
  bloque("comunicacion", "Comunicación y relacionamiento", [
    "¿Su comunicación es directa, diplomática o depende del interlocutor?",
    "¿Deja los acuerdos por escrito o confía en lo hablado?",
    "¿Qué tanto verifica que el mensaje se entendió?",
    "Ante una mala noticia para el equipo, ¿la comunica de inmediato y completa, o la dosifica?",
    "¿Se apoya en su red interna o resuelve dentro de su propia área?",
    "¿Qué tan cómodo está hablando en público o presentando ante directivos?",
    "En una reunión, ¿escucha primero o propone primero?",
    "Ante un cliente molesto, ¿confirma que entendió el problema o va directo a la solución?",
    "¿Cómo maneja las diferencias culturales o de estilo en equipos diversos?",
    "¿Es más introvertido o extrovertido en el trabajo? ¿Y fuera de él?",
  ]),
  bloque("disciplina", "Disciplina operativa", [
    "¿Cómo organiza su semana? ¿Planifica con anticipación o va resolviendo?",
    "Ordene de 1 a 6 lo que haría primero al iniciar la semana: revisar tareas, reuniones con el equipo, informes, contactar stakeholders, balances de gestión, tareas administrativas.",
    "¿Empieza por lo de mayor impacto o por lo más rápido de quitar de encima?",
    "¿Qué herramientas usa para hacer seguimiento? ¿Registra todo o confía en la memoria?",
    "¿Qué tan riguroso es con los plazos propios? ¿Y con los del equipo?",
    "Si un proyecto no cabe en el tiempo: ¿renegocia el plazo, recorta alcance, pide recursos o trabaja de más?",
    "¿Trabaja fuera de horario con frecuencia? ¿Lo evita o lo acepta como normal?",
    "Antes de iniciar algo nuevo, ¿investiga a fondo, consulta a quien ya lo hizo, o arranca y ajusta?",
  ]),
  bloque("motivadores", "Motivadores", [
    "Ordene de mayor a menor lo que realmente lo mueve: autonomía, impacto, dinero, estatus, seguridad, aprendizaje, reconocimiento, pertenencia, balance de vida.",
    "¿Qué tan determinante es el salario? ¿Aceptaría menos dinero a cambio de qué?",
    "¿Qué lo haría renunciar a un buen cargo?",
    "¿Qué tipo de tarea lo energiza y cuál lo desgasta?",
    "¿Prefiere un rol de alta visibilidad o trabajar tras bambalinas?",
    "¿Qué tan competitivo es? ¿Compite con otros o consigo mismo?",
    "¿Le importa más el título del cargo o el contenido del trabajo?",
    "¿Qué clima laboral necesita para dar lo mejor de sí?",
  ]),
  bloque("autoconciencia", "Autoconciencia", [
    "Tres fortalezas que le reconocen de forma consistente.",
    "Tres debilidades reales, no disfrazadas de fortaleza. ¿Qué hace para manejarlas?",
    "¿Cómo recibe la crítica?",
    "¿Busca feedback de forma activa o espera a que llegue?",
    "¿Ha hecho evaluaciones 360, coaching o procesos similares? ¿Qué aprendió?",
    "Ante una habilidad que le falta: ¿se forma, pide apoyo, contrata a quien la tenga o la evita?",
    "¿Busca mentores más capaces que usted?",
    "¿Qué crítica le han hecho más de una vez?",
    "¿Cómo reacciona cuando alguien más se lleva el crédito de su trabajo?",
  ]),
  bloque(
    "balance",
    "Vida personal y balance",
    [
      "Situación familiar en términos generales (solo lo que quiera compartir).",
      "¿Dónde vive y cómo es su entorno?",
      "¿Qué hace para desconectarse?",
      "¿Qué lugar ocupa el trabajo frente a la familia y la salud cuando entran en conflicto?",
      "¿Ha vivido un episodio de agotamiento por exceso de trabajo? ¿Qué cambió después?",
      "¿Disfruta los eventos sociales del trabajo o los sobrelleva?",
      "¿Qué límites tiene claros? Horarios, fines de semana, viajes, disponibilidad.",
      "¿Hay causas o temas sociales que le importen?",
    ],
    "Comparta solo lo que considere pertinente."
  ),
  bloque("futuro", "Visión y propósito", [
    "¿Dónde se ve en cinco años? ¿Y en diez?",
    "¿Qué quiere que digan de usted las personas que le reportaron?",
    "¿Cuál es el propósito detrás de su trabajo, más allá del ingreso?",
    "¿Aspira a seguir creciendo en jerarquía, a especializarse o a independizarse?",
    "¿Qué legado quiere dejar en las organizaciones por las que pasa?",
    "Si el dinero no fuera un problema, ¿a qué dedicaría su tiempo?",
  ]),
];

export const PARES_CALIBRACION: { id: string; a: string; b: string }[] = [
  { id: "cal-1", a: "Actuar rápido con lo que se tiene", b: "Pedir claridad antes de actuar" },
  { id: "cal-2", a: "Resolverlo yo mismo", b: "Convocar al equipo" },
  { id: "cal-3", a: "Corregir el síntoma ya", b: "Buscar la causa raíz" },
  { id: "cal-4", a: "Cumplir el plazo prometido", b: "Renegociar el plazo y entregar bien" },
  { id: "cal-5", a: "Hablar directo aunque incomode", b: "Cuidar la forma y el vínculo" },
  { id: "cal-6", a: "Seguir el procedimiento", b: "Adaptarlo al caso concreto" },
  { id: "cal-7", a: "Formar a la persona", b: "Asignar la tarea a quien ya sabe" },
  { id: "cal-8", a: "Escalar al jefe temprano", b: "Resolver en mi nivel primero" },
  { id: "cal-9", a: "Innovar asumiendo riesgo", b: "Replicar lo que ya funcionó" },
  { id: "cal-10", a: "Impacto en el negocio", b: "Bienestar del equipo" },
  { id: "cal-11", a: "Decidir con datos", b: "Decidir con criterio e intuición" },
  { id: "cal-12", a: "Reconocimiento individual", b: "Logro colectivo" },
];

export const PREGUNTAS_PERFIL = BLOQUES_PERFIL.flatMap((b) => b.preguntas);

export function textoPregunta(id: string): string {
  const q = PREGUNTAS_PERFIL.find((p) => p.id === id);
  if (q) return q.texto;
  const par = PARES_CALIBRACION.find((p) => p.id === id);
  if (par) return `${par.a} vs ${par.b}`;
  return id;
}
