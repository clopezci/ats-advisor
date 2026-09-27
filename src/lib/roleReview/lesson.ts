/** Curso corto por exigencia de la vacante. No recorta la explicación. */

export type LessonBlock = { heading: string; body: string };

export function lessonFor(term: string, jobTitle: string, explain?: string): LessonBlock[] {
  const topic = term.trim() || "este tema";
  const role = jobTitle.trim() || "este cargo";
  const what =
    explain && explain.trim().length > 40
      ? explain.trim()
      : `${topic} es una exigencia concreta de ${role}. No es un adjetivo: es algo que el equipo usa para decidir, entregar o medir.`;

  return [
    { heading: "Qué es", body: what },
    {
      heading: "Para qué sirve",
      body: `En ${role}, ${topic} sirve para que el trabajo no dependa de la memoria de una persona. Quien lo domina puede explicar el criterio, no solo el nombre.`,
    },
    {
      heading: "Qué problema resuelve",
      body: `Sin ${topic}, el equipo improvisa: prioridades que cambian, entregas que no se pueden defender y reuniones que no cierran. Con ${topic} hay un criterio repetible.`,
    },
    {
      heading: "Cómo se maneja en el día a día",
      body: `Una jornada típica: 1) miras el estado de lo que ya está en curso, 2) eliges un caso de ${topic} y lo dejas por escrito, 3) se lo cuentas a quien depende del resultado. El número (tiempo, personas, costo o antes/después) es lo que anota un jefe.`,
    },
    {
      heading: "El primer mes",
      body: `Semana 1: escuchas cómo lo hacen en ese equipo y anotas el vocabulario real. Semana 2: lo haces acompañado. Semanas 3 y 4: lo haces tú, pides feedback y corriges un entregable. Si aún no lo has vivido, practícalo en pequeño antes de decir que lo dominas.`,
    },
  ];
}

export function dayInRole(jobTitle: string, term: string): string {
  const role = jobTitle.trim() || "este cargo";
  const topic = term.trim() || "la prioridad del aviso";
  return [
    `Un día en ${role} no es una clase. Por la mañana revisas qué quedó pendiente y qué está bloqueado.`,
    `A media mañana trabajas un caso de ${topic}: lo acotas, lo escribes y dejas claro qué decisión hace falta.`,
    `Después de almuerzo alineas a una persona (jefe, par o usuario) en 15 minutos: qué pasó, qué sigue, qué riesgo hay.`,
    `Cierras el día con un entregable visible: una nota, un tablero o un cambio. Si no se puede mostrar, no cuenta como hecho.`,
  ].join(" ");
}
