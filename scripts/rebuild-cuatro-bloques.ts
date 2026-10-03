/**
 * Reescribe inductivo, numérico, verbal y secuencias (sin ciclos falsos).
 * No hay Excel en el repo: se reconstruye con patrones de tests + explicación/atajo.
 * Uso: npx tsx scripts/rebuild-cuatro-bloques.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura?: string };

function assertUnique(id: string, list: Item[]) {
  const stems = list.map((i) => i.enunciado.split("\n")[0]);
  if (new Set(stems).size !== stems.length) {
    const dup = stems.filter((s, i) => stems.indexOf(s) !== i);
    throw new Error(`${id} duplicados: ${[...new Set(dup)].join(" | ")}`);
  }
  for (const it of list) {
    const opts = [...it.enunciado.matchAll(/([A-D])\)\s*([^\n]+)/g)].map((m) => m[2].trim());
    if (opts.length >= 4) {
      const set = new Set(opts.slice(0, 4));
      if (set.size < 4) throw new Error(`${id} opciones repetidas: ${it.enunciado.split("\n")[0]}`);
    }
  }
}

const inductivo: Item[] = [
  {
    figura: "seq-diferencias",
    enunciado: "3, 4, 6, 9, 13, ?. Siguiente:\n\nA) 16   B) 17   C) 18   D) 19",
    respuesta: "C) 18",
    pasos: [
      "Diferencias: +1, +2, +3, +4 → el siguiente salto es +5.",
      "13+5=18.",
      "No elijas 17: esa sería +4 otra vez.",
      "Atajo: anota siempre las diferencias debajo de la serie.",
    ],
  },
  {
    figura: "diag-puntos",
    enunciado: "2, 3, 5, 8, 12, ?. Siguiente:\n\nA) 15   B) 16   C) 17   D) 18",
    respuesta: "C) 17",
    pasos: [
      "Diferencias +1,+2,+3,+4 → sigue +5.",
      "12+5=17.",
      "Es el mismo patrón de saltos crecientes.",
      "Atajo: diferencias crecientes de 1 en 1.",
    ],
  },
  {
    figura: "seq-diferencias",
    enunciado: "4, 5, 7, 10, 14, ?. Siguiente:\n\nA) 18   B) 19   C) 20   D) 21",
    respuesta: "B) 19",
    pasos: ["+1,+2,+3,+4 → +5.", "14+5=19.", "Atajo: misma familia que 3,4,6,9,13…", "Comprueba restando consecutivos."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "5, 6, 8, 11, 15, ?. Siguiente:\n\nA) 19   B) 20   C) 21   D) 22",
    respuesta: "B) 20",
    pasos: ["+1,+2,+3,+4 → +5.", "15+5=20.", "Atajo: saltos +1,+2,+3…", "Descarta 19 (+4 repetido)."],
  },
  {
    figura: "ind-triangulares",
    enunciado: "Triangulares: 3, 6, 10, 15, ?. Siguiente:\n\nA) 18   B) 20   C) 21   D) 24",
    respuesta: "C) 21",
    pasos: [
      "Sumas: +3,+4,+5 → siguiente +6.",
      "15+6=21 = 6º triangular (1+2+…+6).",
      "Fórmula: n(n+1)/2 con n=6 → 21.",
      "Atajo: dibuja puntos en filas 1,2,3…",
    ],
  },
  {
    figura: "ind-triangulares",
    enunciado: "1, 3, 6, 10, 15, 21, ?. Siguiente triangular:\n\nA) 25   B) 27   C) 28   D) 30",
    respuesta: "C) 28",
    pasos: ["+2,+3,+4,+5,+6 → +7.", "21+7=28.", "n=7: 7×8/2=28.", "Atajo: sumar el siguiente entero."],
  },
  {
    figura: "diag-letras",
    enunciado: "Letras: C, E, H, L, ?. Siguiente:\n\nA) N   B) O   C) P   D) Q",
    respuesta: "C) P",
    pasos: [
      "C→E (+2), E→H (+3), H→L (+4) → siguiente +5.",
      "L+5 = P.",
      "Los saltos crecen como en series numéricas.",
      "Atajo: pasa a número (C=3…) y mira diferencias.",
    ],
  },
  {
    figura: "diag-letras",
    enunciado: "A, C, F, J, ?. Siguiente:\n\nA) M   B) N   C) O   D) P",
    respuesta: "C) O",
    pasos: ["+2,+3,+4 → +5.", "J=10; 10+5=15 → O.", "Atajo: abecedario numerado.", "Comprueba A=1,C=3,F=6,J=10."],
  },
  {
    figura: "diag-letras",
    enunciado: "Z, X, U, Q, ?. Siguiente (hacia atrás):\n\nA) L   B) M   C) N   D) O",
    respuesta: "A) L",
    pasos: ["Z→X (−2), X→U (−3), U→Q (−4) → −5.", "Q−5 = L.", "Atajo: saltos negativos crecientes.", "Cuenta letras hacia atrás."],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Todos los lunes el bus llega tarde. Hoy llegó tarde. ¿Hoy es lunes?\n\nA) sí, seguro   B) no necesariamente   C) no, seguro   D) solo si llueve",
    respuesta: "B) no necesariamente",
    pasos: [
      "«Si lunes → tarde» no implica «si tarde → lunes».",
      "Puede llegar tarde otro día.",
      "Afirmar el consecuente es falacia.",
      "Atajo: la flecha A⇒B no se invierte sola.",
    ],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Si suena la alarma, hay humo. Hoy hay humo. ¿Suena la alarma?\n\nA) sí, seguro   B) no, seguro   C) no se puede asegurar   D) solo de noche",
    respuesta: "C) no se puede asegurar",
    pasos: [
      "Alarma ⇒ humo. Tener humo no obliga a que suene la alarma.",
      "Puede haber humo por otra causa.",
      "Misma falacia: afirmar el consecuente.",
      "Atajo: B no prueba A.",
    ],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Si estudia, aprueba. Ana aprobó. ¿Se puede concluir que estudió?\n\nA) sí   B) no   C) solo si es lunes   D) sí, con 100%",
    respuesta: "B) no",
    pasos: ["Estudiar ⇒ aprobar. Aprobar no prueba que estudió.", "Pudo aprobar por suerte u otra vía.", "Atajo: no inviertas la implicación.", "Conclusión válida sería: si NO aprobó, entonces NO estudió (modus tollens)."],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Si no llueve, salgo. No salí. ¿Qué se concluye?\n\nA) llovió   B) no llovió   C) nada   D) hace frío",
    respuesta: "A) llovió",
    pasos: [
      "Forma: ¬lluvia ⇒ salir. No salí ⇒ se niega el consecuente.",
      "Por tanto se niega el antecedente: no es cierto «no llueve» → llovió.",
      "Es modus tollens.",
      "Atajo: si A⇒B y no-B, entonces no-A.",
    ],
  },
  {
    figura: "diag-impar",
    enunciado:
      "¿Cuál no encaja? 2, 3, 5, 7, 9, 11\n\nA) 2   B) 9   C) 11   D) 3",
    respuesta: "B) 9",
    pasos: ["Casi todos son primos; 9=3×3 no es primo.", "2 es el único par pero sigue siendo primo.", "Atajo odd-one-out: busca la regla de la mayoría.", "Primos: 2,3,5,7,11."],
  },
  {
    figura: "diag-impar",
    enunciado:
      "¿Cuál no encaja? 16, 25, 36, 48, 49\n\nA) 16   B) 25   C) 48   D) 49",
    respuesta: "C) 48",
    pasos: ["16=4², 25=5², 36=6², 49=7²; 48 no es cuadrado perfecto.", "Atajo: prueba si √n es entero.", "48 queda fuera.", "Descarta por forma, no por tamaño."],
  },
  {
    figura: "diag-analogia",
    enunciado:
      "Inducción: 2→4, 3→9, 4→16, 5→?\n\nA) 20   B) 25   C) 10   D) 15",
    respuesta: "B) 25",
    pasos: ["Cada número se eleva al cuadrado: n→n².", "5²=25.", "No es ×2 (eso daría 10).", "Atajo: prueba ×k y potencias."],
  },
  {
    figura: "diag-analogia",
    enunciado:
      "Regla: 3→8, 4→15, 5→24, 6→?\n\nA) 30   B) 35   C) 36   D) 48",
    respuesta: "B) 35",
    pasos: ["3→8=3²−1; 4→15=4²−1; 5→24=5²−1.", "6²−1=35.", "Atajo: n²−1.", "Comprueba con 3: 9−1=8."],
  },
  {
    figura: "seq-intercalada",
    enunciado:
      "Serie intercalada: 2, 9, 4, 8, 6, 7, ?. (impares crecen +2; pares bajan −1)\n\nA) 5   B) 8   C) 10   D) 6",
    respuesta: "B) 8",
    pasos: [
      "Posiciones impares: 2,4,6,(8)…",
      "Posiciones pares: 9,8,7…",
      "El 7.º término (impar) sigue 2,4,6 → 8.",
      "Atajo: separa dos series con dos colores mentales.",
    ],
  },
  {
    figura: "seq-intercalada",
    enunciado:
      "1, 8, 3, 7, 5, 6, ?. Misma idea (impares +2; pares −1):\n\nA) 4   B) 7   C) 9   D) 5",
    respuesta: "B) 7",
    pasos: ["Impares: 1,3,5,(7).", "Pares: 8,7,6…", "7.º = siguiente impar = 7.", "Atajo: dos hilos."],
  },
  {
    figura: "diag-mas-menos",
    enunciado:
      "Patrón: A1, B2, C3, D4, ?. Siguiente:\n\nA) E4   B) E5   C) F5   D) D5",
    respuesta: "B) E5",
    pasos: ["Letra +1 y número +1 a la vez.", "D4 → E5.", "Atajo: dos contadores sincronizados.", "No saltes la letra."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "10, 11, 13, 16, 20, ?. Siguiente:\n\nA) 24   B) 25   C) 26   D) 30",
    respuesta: "B) 25",
    pasos: ["+1,+2,+3,+4 → +5; 20+5=25.", "Atajo diferencias.", "Familia clásica de inducción numérica."],
  },
  {
    figura: "ind-triangulares",
    enunciado:
      "Si 1,3,6,10 son triangulares, ¿cuál es el 8.º triangular?\n\nA) 28   B) 36   C) 45   D) 55",
    respuesta: "B) 36",
    pasos: ["n=8 → 8×9/2=36.", "Atajo: n(n+1)/2.", "Lista: …21,28,36,45…"],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Premisa: Todo A es B. Todo B es C. Conclusión válida:\n\nA) todo C es A   B) todo A es C   C) ningún C es A   D) nada se sigue",
    respuesta: "B) todo A es C",
    pasos: ["Transitividad: A⊂B⊂C ⇒ A⊂C.", "No se invierte: no todo C es A.", "Atajo: dibuja círculos (A dentro de B dentro de C).", "Silogismo clásico."],
  },
  {
    figura: "diag-impar",
    enunciado:
      "Figuras mentales: lunes, martes, miércoles, viernes. ¿Cuál rompe la regla de consecutivos?\n\nA) lunes   B) martes   C) miércoles   D) viernes",
    respuesta: "D) viernes",
    pasos: ["Lun-mar-mie son consecutivos; viernes salta jueves.", "Odd-one-out por salto.", "Atajo: busca la interrupción de la secuencia."],
  },
  {
    figura: "diag-letras",
    enunciado: "B, D, G, K, ?. Siguiente:\n\nA) N   B) O   C) P   D) Q",
    respuesta: "C) P",
    pasos: ["+2,+3,+4 → +5; K+5=P.", "Atajo numérico del abecedario.", "B=2,D=4,G=7,K=11,P=16."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "7, 10, 15, 22, 31, ?. Siguiente:\n\nA) 40   B) 42   C) 43   D) 45",
    respuesta: "B) 42",
    pasos: ["+3,+5,+7,+9 → +11 (impares).", "31+11=42.", "Atajo: diferencias son impares consecutivos."],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "«Solo si hay ticket, entras.» Pedro entró. ¿Tenía ticket?\n\nA) sí, se sigue   B) no se sigue   C) seguro que no   D) solo el viernes",
    respuesta: "A) sí, se sigue",
    pasos: [
      "«Entras solo si ticket» ≈ entrar ⇒ ticket.",
      "Pedro entró ⇒ tenía ticket.",
      "Distinto de «si ticket entonces entras».",
      "Atajo: «solo si» pone la condición necesaria al final.",
    ],
  },
  {
    figura: "diag-analogia",
    enunciado: "2→6, 3→12, 4→20, 5→?\n\nA) 25   B) 30   C) 35   D) 40",
    respuesta: "B) 30",
    pasos: ["2×3=6, 3×4=12, 4×5=20 → n(n+1).", "5×6=30.", "Atajo: producto con el siguiente."],
  },
  {
    figura: "seq-intercalada",
    enunciado:
      "Serie: 5, 100, 10, 90, 15, 80, ?. Siguiente (impares +5; pares −10):\n\nA) 20   B) 70   C) 25   D) 75",
    respuesta: "A) 20",
    pasos: ["Impares: 5,10,15,(20).", "Pares: 100,90,80…", "7.º impar → 20.", "Atajo: dos series."],
  },
  {
    figura: "ind-triangulares",
    enunciado:
      "Diferencias de triangulares consecutivos 1,3,6,10… ¿qué forman?\n\nA) pares   B) naturales 2,3,4,5…   C) primos   D) potencias de 2",
    respuesta: "B) naturales 2,3,4,5…",
    pasos: ["3−1=2, 6−3=3, 10−6=4…", "Las diferencias son 2,3,4,5…", "Por eso el siguiente triangular suma el siguiente natural.", "Atajo: definición acumulativa."],
  },
  {
    figura: "diag-letras",
    enunciado: "AZ, BY, CX, ?. Siguiente par:\n\nA) DW   B) DV   C) EW   D) DU",
    respuesta: "A) DW",
    pasos: ["Primera letra A,B,C,(D); segunda Z,Y,X,(W).", "Par: DW.", "Atajo: dos punteros en extremos del abecedario."],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Datos: Algunos gatos son negros. Algunos negros son grandes. ¿Todo gato es grande?\n\nA) sí   B) no se sigue   C) ninguno es grande   D) sí si son negros",
    respuesta: "B) no se sigue",
    pasos: ["«Algunos» no permite generalizar a «todos».", "Los conjuntos pueden solaparse sin forzar la conclusión.", "Atajo: diagramas de Venn mentales.", "No inventes cuantificadores."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "100, 96, 88, 76, 60, ?. Siguiente:\n\nA) 40   B) 44   C) 48   D) 50",
    respuesta: "A) 40",
    pasos: ["Diferencias −4,−8,−12,−16 → siguiente −20.", "60−20=40.", "Atajo: diferencias más negativas de 4 en 4."],
  },
  {
    figura: "diag-impar",
    enunciado:
      "¿Cuál no encaja? triángulo, cuadrado, pentágono, círculo, hexágono\n\nA) triángulo   B) círculo   C) hexágono   D) cuadrado",
    respuesta: "B) círculo",
    pasos: ["Los demás son polígonos (lados rectos).", "El círculo no tiene lados rectos.", "Atajo: clasifica por tipo de figura."],
  },
  {
    figura: "diag-analogia",
    enunciado: "Inducción: 1→1, 2→4, 3→9, 4→16 sugiere f(n)=\n\nA) 2n   B) n+3   C) n²   D) n³",
    respuesta: "C) n²",
    pasos: ["Coincide con cuadrados.", "Atajo: prueba las formas simples primero.", "n³ daría 1,8,27…"],
  },
  {
    figura: "seq-diferencias",
    enunciado: "8, 12, 20, 36, ?. (cada término ≈ 2×anterior − algo)\n\nA) 68   B) 66   C) 64   D) 70",
    respuesta: "A) 68",
    pasos: [
      "Patrón: ×2 −4: 8×2−4=12, 12×2−4=20, 20×2−4=36, 36×2−4=68.",
      "Atajo: prueba «doble menos constante».",
      "Comprueba en todos los pasos.",
    ],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Si el semáforo está en rojo, te detienes. Te detuviste. ¿El semáforo estaba en rojo?\n\nA) sí seguro   B) no necesariamente   C) no seguro   D) solo de noche",
    respuesta: "B) no necesariamente",
    pasos: ["Rojo ⇒ detenerse. Detenerse puede ser por otra razón (peatón, policía).", "Afirmar el consecuente.", "Atajo: no inviertas ⇒."],
  },
  {
    figura: "diag-letras",
    enunciado: "M, N, P, S, ?. Siguiente:\n\nA) U   B) V   C) W   D) X",
    respuesta: "C) W",
    pasos: ["+1,+2,+3 → +4; S+4=W.", "Atajo: saltos crecientes en letras."],
  },
  {
    figura: "seq-intercalada",
    enunciado:
      "7, 2, 14, 4, 28, 6, ?. (impares ×2; pares +2)\n\nA) 8   B) 56   C) 12   D) 30",
    respuesta: "B) 56",
    pasos: ["Impares: 7,14,28,(56).", "Pares: 2,4,6…", "7.º impar → 56.", "Atajo: dos reglas."],
  },
  {
    figura: "ind-triangulares",
    enunciado:
      "El 10.º número triangular es:\n\nA) 45   B) 55   C) 66   D) 78",
    respuesta: "B) 55",
    pasos: ["10×11/2=55.", "Atajo n(n+1)/2.", "9.º=45; 10.º=55."],
  },
  {
    figura: "diag-analogia",
    enunciado: "5→11, 6→13, 7→15, 8→?\n\nA) 16   B) 17   C) 18   D) 19",
    respuesta: "B) 17",
    pasos: ["2n+1: 2×5+1=11… 2×8+1=17.", "Atajo: lineal an+b.", "Comprueba con 5 y 6."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "9, 16, 25, 36, ?. Siguiente:\n\nA) 45   B) 47   C) 49   D) 64",
    respuesta: "C) 49",
    pasos: ["Cuadrados: 3²,4²,5²,6² → 7²=49.", "Atajo: reconoce potencias.", "No es +9 constante al final (36+13=49 por diferencia de cuadrados)."],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "Premisas: Ningún A es B. Todo C es A. Conclusión válida:\n\nA) todo C es B   B) ningún C es B   C) algún B es C   D) todo B es C",
    respuesta: "B) ningún C es B",
    pasos: ["C⊂A y A ∩ B = ∅ ⇒ C ∩ B = ∅.", "Ningún C es B.", "Atajo: Venn — C dentro de A, lejos de B."],
  },
  {
    figura: "diag-impar",
    enunciado:
      "¿Cuál no encaja? 2, 4, 8, 16, 24, 32\n\nA) 4   B) 24   C) 32   D) 8",
    respuesta: "B) 24",
    pasos: ["Potencias de 2: 2,4,8,16,32; 24 no lo es.", "Atajo: ¿se obtiene duplicando desde 2?"],
  },
  {
    figura: "seq-diferencias",
    enunciado: "2, 6, 12, 20, 30, ?. Siguiente:\n\nA) 40   B) 42   C) 44   D) 48",
    respuesta: "B) 42",
    pasos: ["+4,+6,+8,+10 → +12; 30+12=42.", "También n(n+1): 5×6=30, 6×7=42.", "Atajo: diferencias pares crecientes o n(n+1)."],
  },
  {
    figura: "diag-letras",
    enunciado: "ACE, BDF, CEG, ?. Siguiente grupo:\n\nA) DEF   B) DFH   C) DEH   D) EGI",
    respuesta: "B) DFH",
    pasos: ["Cada grupo: tres letras saltando una; el inicio avanza +1.", "D, luego F, luego H.", "Atajo: mira 1ª, 2ª y 3ª columna por separado."],
  },
  {
    figura: "ind-logica-flecha",
    enunciado:
      "«Si hay hielo, la calle está resbalosa.» La calle no está resbalosa. ¿Hay hielo?\n\nA) sí   B) no   C) tal vez   D) seguro que sí",
    respuesta: "B) no",
    pasos: ["Hielo ⇒ resbalosa. No resbalosa ⇒ no hielo (modus tollens).", "Atajo: no-B ⇒ no-A."],
  },
];

const secuencias: Item[] = [
  {
    figura: "seq-diferencias",
    enunciado: "5, 10, 20, 40, ?. Siguiente:\n\nA) 60   B) 70   C) 80   D) 90",
    respuesta: "C) 80",
    pasos: ["×2 cada vez.", "40×2=80.", "Atajo geométrica razón 2."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "11, 22, 44, 88, ?. Siguiente:\n\nA) 166   B) 176   C) 186   D) 198",
    respuesta: "B) 176",
    pasos: ["×2: 88×2=176.", "Atajo: duplicar."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "17, 34, 68, 136, ?. Siguiente:\n\nA) 250   B) 260   C) 272   D) 280",
    respuesta: "C) 272",
    pasos: ["×2: 136×2=272.", "Atajo geométrica."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "23, 46, 92, 184, ?. Siguiente:\n\nA) 350   B) 360   C) 368   D) 380",
    respuesta: "C) 368",
    pasos: ["184×2=368.", "Atajo ×2."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "29, 58, 116, 232, ?. Siguiente:\n\nA) 450   B) 464   C) 480   D) 500",
    respuesta: "B) 464",
    pasos: ["232×2=464.", "Atajo ×2."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "81, 27, 9, 3, ?. Siguiente:\n\nA) 0   B) 1   C) 2   D) 9",
    respuesta: "B) 1",
    pasos: ["÷3 cada vez: 3÷3=1.", "Atajo geométrica razón 1/3."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "243, 81, 27, 9, ?. Siguiente:\n\nA) 6   B) 3   C) 1   D) 0",
    respuesta: "B) 3",
    pasos: ["÷3: 9÷3=3.", "Atajo potencias de 3 hacia abajo."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "16, 25, 36, 49, ?. Siguiente:\n\nA) 56   B) 60   C) 64   D) 81",
    respuesta: "C) 64",
    pasos: ["4²,5²,6²,7² → 8²=64.", "Atajo cuadrados consecutivos."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "1, 8, 27, 64, ?. Siguiente:\n\nA) 100   B) 125   C) 128   D) 216",
    respuesta: "B) 125",
    pasos: ["1³,2³,3³,4³ → 5³=125.", "Atajo cubos."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "1, 1, 2, 3, 5, 8, ?. Siguiente:\n\nA) 11   B) 12   C) 13   D) 15",
    respuesta: "C) 13",
    pasos: ["Fibonacci: suma de los dos anteriores: 5+8=13.", "Atajo: a+b → siguiente."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "2, 3, 5, 8, 12, 17, ?. Siguiente:\n\nA) 22   B) 23   C) 24   D) 25",
    respuesta: "B) 23",
    pasos: ["+1,+2,+3,+4,+5 → +6; 17+6=23.", "Atajo diferencias +1,+2,+3…"],
  },
  {
    figura: "seq-diferencias",
    enunciado: "100, 95, 85, 70, ?. Siguiente:\n\nA) 40   B) 45   C) 50   D) 55",
    respuesta: "C) 50",
    pasos: ["−5,−10,−15 → −20; 70−20=50.", "Atajo diferencias −5,−10,−15…"],
  },
  {
    figura: "seq-intercalada",
    enunciado: "Serie intercalada: 1, 2, 3, 4, 5, 6, 7, ?. Siguiente natural:\n\nA) 6   B) 7   C) 8   D) 9",
    respuesta: "C) 8",
    pasos: ["Es la secuencia natural simple.", "Atajo: no sobrepienses si el patrón es +1.", "8 sigue a 7."],
  },
  {
    figura: "seq-intercalada",
    enunciado:
      "2, 5, 4, 10, 8, 15, 16, ?. (impares ×2; pares +5 empezando 5)\n\nA) 20   B) 32   C) 25   D) 18",
    respuesta: "A) 20",
    pasos: [
      "Posiciones impares: 2,4,8,16… (×2) — el 7.º ya es 16; el 8.º es posición par.",
      "Pares: 5,10,15,(20)…",
      "8.º término = 20.",
      "Atajo: separa impares/pares.",
    ],
  },
  {
    figura: "seq-diferencias",
    enunciado: "3, 9, 27, 81, ?. Siguiente:\n\nA) 162   B) 243   C) 324   D) 729",
    respuesta: "B) 243",
    pasos: ["×3: 81×3=243.", "Atajo potencias de 3."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "4, 9, 19, 39, ?. (×2+1)\n\nA) 78   B) 79   C) 80   D) 81",
    respuesta: "B) 79",
    pasos: ["4×2+1=9, 9×2+1=19, 19×2+1=39, 39×2+1=79.", "Atajo: ×2+1."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "7, 14, 28, 56, ?. Siguiente:\n\nA) 84   B) 96   C) 112   D) 120",
    respuesta: "C) 112",
    pasos: ["×2: 56×2=112.", "Atajo geométrica."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "0, 1, 1, 2, 3, 5, 8, 13, ?. Fibonacci:\n\nA) 18   B) 20   C) 21   D) 24",
    respuesta: "C) 21",
    pasos: ["8+13=21.", "Atajo suma de los dos previos."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "2, 6, 12, 20, 30, 42, ?. Siguiente:\n\nA) 54   B) 56   C) 60   D) 64",
    respuesta: "B) 56",
    pasos: ["n(n+1): 6×7=42, 7×8=56.", "Diferencias +4,+6,+8,+10,+12 → +14; 42+14=56.", "Atajo n(n+1)."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "121, 144, 169, 196, ?. Siguiente:\n\nA) 215   B) 225   C) 256   D) 289",
    respuesta: "B) 225",
    pasos: ["11²…14² → 15²=225.", "Atajo cuadrados."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "5, 6, 9, 15, 25, ?. (suma de digitos previos o +1,+3,+6,+10)\n\nA) 40   B) 41   C) 45   D) 50",
    respuesta: "A) 40",
    pasos: ["Diferencias +1,+3,+6,+10 (triangulares) → +15; 25+15=40.", "Atajo: diferencias triangulares."],
  },
  {
    figura: "seq-intercalada",
    enunciado:
      "10, 1, 20, 2, 30, 3, ?. Siguiente:\n\nA) 4   B) 40   C) 5   D) 35",
    respuesta: "B) 40",
    pasos: ["Impares: 10,20,30,(40). Pares: 1,2,3…", "7.º impar → 40.", "Atajo dos series."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "8, 27, 64, 125, ?. Siguiente:\n\nA) 216   B) 225   C) 256   D) 343",
    respuesta: "A) 216",
    pasos: ["2³,3³,4³,5³ → 6³=216.", "Atajo cubos desde 2."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "90, 80, 71, 63, 56, ?. Siguiente:\n\nA) 48   B) 49   C) 50   D) 45",
    respuesta: "C) 50",
    pasos: ["−10,−9,−8,−7 → −6; 56−6=50.", "Atajo restas decrecientes en 1."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "1, 2, 6, 24, 120, ?. Siguiente:\n\nA) 600   B) 620   C) 720   D) 840",
    respuesta: "C) 720",
    pasos: ["×2,×3,×4,×5 → ×6; 120×6=720 (factoriales).", "Atajo n! : 5!=120, 6!=720."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "13, 17, 19, 23, 29, ?. Siguiente primo:\n\nA) 31   B) 33   C) 35   D) 37",
    respuesta: "A) 31",
    pasos: ["Serie de primos; después de 29 viene 31.", "Atajo: lista de primos."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "4, 5, 8, 17, 44, ?. (×2+−algo: 4×1+1=5, 5×1+3=8, 8×2+1=17…)\n\nA) 107   B) 109   C) 111   D) 125",
    respuesta: "B) 109",
    pasos: ["Patrón ×3−7? Mejor: 4×1+1=5; 5×2−2=8; 8×2+1=17; 17×3−7=44; prueba 44×2+21…", "Regla clara: cada uno = anterior×n − (n−1)… Simplifica: 44×2 +21 no.", "Patrón popular: ×1+1, ×1+3, ×2+1, ×2+10? Alternativa: 44×2.5?", "Usar: 4→5 (+1), 5→8 (+3), 8→17 (+9), 17→44 (+27), 44→125 (+81) potencias de 3 — entonces 125. Recalcular opciones → D) 125."],
  },
];

// Fix last broken secuencias item
secuencias[secuencias.length - 1] = {
  figura: "seq-diferencias",
  enunciado: "4, 5, 8, 17, 44, ?. Diferencias +1,+3,+9,+27…\n\nA) 107   B) 109   C) 111   D) 125",
  respuesta: "D) 125",
  pasos: [
    "Diferencias: +1,+3,+9,+27 (×3 cada vez).",
    "Siguiente diferencia +81; 44+81=125.",
    "Atajo: mira si las diferencias son geométricas.",
  ],
};

// Continue secuencias to ~45
secuencias.push(
  {
    figura: "seq-diferencias",
    enunciado: "6, 11, 21, 41, ?. (×2−1)\n\nA) 81   B) 82   C) 80   D) 61",
    respuesta: "A) 81",
    pasos: ["6×2−1=11, 11×2−1=21, 21×2−1=41, 41×2−1=81.", "Atajo ×2−1."],
  },
  {
    figura: "seq-intercalada",
    enunciado: "3, 8, 6, 16, 12, 32, ?. Siguiente (impares ×2; pares ×2):\n\nA) 24   B) 48   C) 20   D) 64",
    respuesta: "A) 24",
    pasos: ["Impares: 3,6,12,(24). Pares: 8,16,32…", "7.º impar → 24.", "Atajo dos hilos ×2."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "2, 5, 10, 17, 26, ?. Siguiente:\n\nA) 35   B) 36   C) 37   D) 40",
    respuesta: "C) 37",
    pasos: ["+3,+5,+7,+9 → +11; 26+11=37.", "También n²+1: 6²+1=37.", "Atajo diferencias impares."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "50, 45, 40, 35, ?. Siguiente:\n\nA) 25   B) 30   C) 20   D) 15",
    respuesta: "B) 30",
    pasos: ["AP con d=−5; 35−5=30.", "Atajo resta constante."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "9, 18, 36, 72, ?. Siguiente:\n\nA) 108   B) 140   C) 144   D) 150",
    respuesta: "C) 144",
    pasos: ["×2: 72×2=144.", "Atajo geométrica."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "1, 4, 9, 16, 25, 36, ?. Siguiente:\n\nA) 42   B) 45   C) 49   D) 64",
    respuesta: "C) 49",
    pasos: ["Cuadrados: 7²=49.", "Atajo n²."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "14, 28, 32, 64, 68, ?. Siguiente:\n\nA) 136   B) 72   C) 132   D) 140",
    respuesta: "A) 136",
    pasos: ["Patrón: ×2, +4, ×2, +4… 68×2=136.", "Atajo alterna ×2 y +4."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "0.5, 1.5, 4.5, 13.5, ?. Siguiente:\n\nA) 27   B) 40.5   C) 45   D) 54",
    respuesta: "B) 40.5",
    pasos: ["×3 cada vez: 13.5×3=40.5.", "Atajo geométrica razón 3."],
  },
  {
    figura: "seq-intercalada",
    enunciado: "1, 10, 3, 9, 5, 8, 7, ?. Siguiente:\n\nA) 6   B) 7   C) 9   D) 11",
    respuesta: "A) 6",
    pasos: ["Impares 1,3,5,7… Pares 10,9,8,(7)? El 8.º es par: 10,9,8,(7) — wait next pair after 8 is 7.", "Pares: 10,9,8,7 → 8.º=7. Options say A) 6. Recheck.", "If pares −1: 10,9,8,7. Answer C) 7? Options A6 B7. Fix to B) 7."],
  }
);
secuencias[secuencias.length - 1] = {
  figura: "seq-intercalada",
  enunciado: "1, 10, 3, 9, 5, 8, 7, ?. (impares +2; pares −1)\n\nA) 6   B) 7   C) 9   D) 11",
  respuesta: "B) 7",
  pasos: ["Pares: 10,9,8,(7).", "8.º término par → 7.", "Atajo: dos series."],
};
secuencias.push(
  {
    figura: "seq-diferencias",
    enunciado: "5, 25, 125, 625, ?. Siguiente:\n\nA) 1250   B) 3125   C) 3025   D) 2500",
    respuesta: "B) 3125",
    pasos: ["×5: 625×5=3125 = 5^5.", "Atajo potencias de 5."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "2, 3, 8, 27, 112, ?. (×1+1, ×2+2, ×3+3, ×4+4…)\n\nA) 560   B) 565   C) 575   D) 448",
    respuesta: "B) 565",
    pasos: ["2×1+1=3; 3×2+2=8; 8×3+3=27; 27×4+4=112; 112×5+5=565.", "Atajo: ×n + n."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "18, 24, 32, 42, 54, ?. Siguiente:\n\nA) 66   B) 68   C) 70   D) 72",
    respuesta: "B) 68",
    pasos: ["+6,+8,+10,+12 → +14; 54+14=68.", "Atajo diferencias +2 cada vez."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "7, 8, 12, 21, 37, ?. (+1,+4,+9,+16)\n\nA) 54   B) 58   C) 62   D) 64",
    respuesta: "C) 62",
    pasos: ["Diferencias cuadrados: +1,+4,+9,+16 → +25; 37+25=62.", "Atajo diferencias = n²."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "1000, 200, 40, 8, ?. Siguiente:\n\nA) 1.6   B) 2   C) 4   D) 0",
    respuesta: "A) 1.6",
    pasos: ["÷5 cada vez: 8÷5=1.6.", "Atajo geométrica 1/5."],
  },
  {
    figura: "seq-diferencias",
    enunciado: "6, 7, 9, 13, 21, ?. (suma de potencias de 2: +1,+2,+4,+8)\n\nA) 29   B) 35   C) 37   D) 45",
    respuesta: "C) 37",
    pasos: ["+1,+2,+4,+8 → +16; 21+16=37.", "Atajo diferencias potencias de 2."],
  }
);

assertUnique("inductivo", inductivo);
assertUnique("secuencias", secuencias);

function pct(part: number, whole: number) {
  return Math.round((100 * part) / whole);
}

const numerico: Item[] = [];
// Porcentajes
for (const [p, w] of [
  [30, 150],
  [45, 150],
  [35, 150],
  [50, 150],
  [40, 200],
  [15, 60],
  [9, 36],
  [12, 48],
] as const) {
  const v = pct(p, w);
  const opts =
    v === 20
      ? "A) 20%   B) 25%   C) 30%   D) 15%"
      : v === 30
        ? "A) 20%   B) 30%   C) 25%   D) 35%"
        : v === 25
          ? "A) 20%   B) 30%   C) 25%   D) 15%"
          : `A) ${v - 5}%   B) ${v}%   C) ${v + 5}%   D) ${v + 10}%`;
  const letter = opts.includes(`A) ${v}%`)
    ? `A) ${v}%`
    : opts.includes(`B) ${v}%`)
      ? `B) ${v}%`
      : opts.includes(`C) ${v}%`)
        ? `C) ${v}%`
        : `D) ${v}%`;
  numerico.push({
    enunciado: `¿Qué % es ${p} de ${w}?\n\n${opts}`,
    respuesta: letter,
    pasos: [
      `Porcentaje = (parte/total)×100 = (${p}/${w})×100.`,
      `= ${v}%.`,
      "Atajo: simplifica la fracción antes de multiplicar por 100.",
      `Ej.: ${p}/${w} = ${(p / w).toFixed(2)} → ×100.`,
    ],
  });
}

numerico.push(
  {
    enunciado: "IVA 19% sobre $100.000. Total con IVA:\n\nA) 119.000   B) 19.000   C) 81.000   D) 100.019",
    respuesta: "A) 119.000",
    pasos: ["Total = base × 1.19.", "100.000×1.19=119.000.", "Atajo: 19% de 100.000=19.000; suma a la base.", "No pagues solo el IVA: preguntan el total."],
  },
  {
    enunciado: "IVA 19% sobre $50.000. Solo el IVA es:\n\nA) 9.500   B) 59.500   C) 19.000   D) 8.500",
    respuesta: "A) 9.500",
    pasos: ["IVA = 50.000×0.19=9.500.", "Atajo: 10%=5.000; 20%=10.000; 19%≈9.500.", "Distingue IVA vs total."],
  },
  {
    enunciado: "De 80 a 100, el aumento porcentual es:\n\nA) 20%   B) 25%   C) 18%   D) 80%",
    respuesta: "B) 25%",
    pasos: ["Aumento = (nuevo−viejo)/viejo ×100 = 20/80×100=25%.", "Atajo: no divides entre el nuevo.", "20/80=1/4."],
  },
  {
    enunciado: "De 50 a 40, la variación porcentual es:\n\nA) −10%   B) −20%   C) −25%   D) −15%",
    respuesta: "B) −20%",
    pasos: ["(40−50)/50×100=−20%.", "Atajo: baja 10 sobre base 50 = 20%.", "Signo negativo = disminución."],
  },
  {
    enunciado: "Si x/7 = 12, entonces x =\n\nA) 84   B) 19   C) 5   D) 72",
    respuesta: "A) 84",
    pasos: ["x = 12×7 = 84.", "Atajo: despeja multiplicando en cruz.", "Comprueba 84/7=12."],
  },
  {
    enunciado: "Si x/9 = 12, entonces x =\n\nA) 96   B) 108   C) 21   D) 3",
    respuesta: "B) 108",
    pasos: ["x=12×9=108.", "Atajo: multiplica."],
  },
  {
    enunciado: "Si x/5 = 12, entonces x =\n\nA) 60   B) 17   C) 2.4   D) 50",
    respuesta: "A) 60",
    pasos: ["x=12×5=60.", "Atajo: ×5."],
  },
  {
    enunciado: "Si 3/4 de un número es 36, el número es:\n\nA) 27   B) 48   C) 42   D) 54",
    respuesta: "B) 48",
    pasos: ["n×3/4=36 → n=36×4/3=48.", "Atajo: divide por la fracción (×4/3)."],
  },
  {
    enunciado: "Promedio de 9, 11 y 19:\n\nA) 12   B) 13   C) 14   D) 15",
    respuesta: "B) 13",
    pasos: ["(9+11+19)/3=39/3=13.", "Atajo: suma y divide entre cuántos hay."],
  },
  {
    enunciado: "Promedio de 12, 15 y 18:\n\nA) 14   B) 15   C) 16   D) 17",
    respuesta: "B) 15",
    pasos: ["(12+15+18)/3=45/3=15.", "Atajo: media aritmética."],
  },
  {
    enunciado: "Promedio ponderado: notas 4 y 5 con pesos 1 y 3. Media:\n\nA) 4.25   B) 4.5   C) 4.75   D) 5",
    respuesta: "C) 4.75",
    pasos: ["(4×1 + 5×3)/(1+3)=19/4=4.75.", "Atajo: suma (nota×peso) / suma pesos."],
  },
  {
    enunciado: "Simplifica la razón 18:24\n\nA) 3:4   B) 2:3   C) 4:5   D) 9:12",
    respuesta: "A) 3:4",
    pasos: ["Divide ambos entre 6: 3:4.", "Atajo: máximo común divisor."],
  },
  {
    enunciado: "Simplifica 45:60\n\nA) 2:3   B) 3:4   C) 4:5   D) 5:6",
    respuesta: "B) 3:4",
    pasos: ["÷15 → 3:4.", "Atajo MCD."],
  },
  {
    enunciado: "Una razón 3:5 equivale a:\n\nA) 6:10   B) 3:8   C) 5:3   D) 9:10",
    respuesta: "A) 6:10",
    pasos: ["Multiplica ambos términos por 2: 6:10.", "Atajo: misma fracción 3/5=6/10.", "5:3 sería la inversa."],
  },
  {
    enunciado: "2.5 horas en minutos:\n\nA) 120   B) 150   C) 180   D) 90",
    respuesta: "B) 150",
    pasos: ["2.5×60=150.", "Atajo: 2 h=120; media h=30; total 150."],
  },
  {
    enunciado: "3 horas 20 minutos en minutos:\n\nA) 180   B) 200   C) 220   D) 320",
    respuesta: "B) 200",
    pasos: ["3×60+20=200.", "Atajo: horas×60 + minutos."],
  },
  {
    enunciado: "Velocidad: 120 km en 2 h. ¿km/h?\n\nA) 40   B) 50   C) 60   D) 80",
    respuesta: "C) 60",
    pasos: ["v=d/t=120/2=60 km/h.", "Atajo: distancia÷tiempo."],
  },
  {
    enunciado: "A 80 km/h, ¿cuánto tarda en 240 km?\n\nA) 2 h   B) 3 h   C) 4 h   D) 5 h",
    respuesta: "B) 3 h",
    pasos: ["t=d/v=240/80=3 h.", "Atajo: tiempo = distancia÷velocidad."],
  },
  {
    enunciado: "Regla de 3: si 4 lápices cuestan 8.000, 10 lápices cuestan:\n\nA) 16.000   B) 18.000   C) 20.000   D) 24.000",
    respuesta: "C) 20.000",
    pasos: ["Unitario 2.000; ×10=20.000.", "Atajo: (8.000/4)×10.", "Directa: más lápices, más costo."],
  },
  {
    enunciado: "5 obreros hacen un trabajo en 12 días. ¿Cuántos días 6 obreros (mismo ritmo)?\n\nA) 8   B) 10   C) 12   D) 14",
    respuesta: "B) 10",
    pasos: ["Trabajo = 5×12=60 obrero-días; 60/6=10 días.", "Atajo inversa: más gente, menos días.", "5×12=6×?"],
  },
  {
    enunciado: "¿Cuánto es 15% de 200?\n\nA) 20   B) 25   C) 30   D) 35",
    respuesta: "C) 30",
    pasos: ["0.15×200=30.", "Atajo: 10%=20; 5%=10; total 30."],
  },
  {
    enunciado: "¿Cuánto es 12.5% de 80?\n\nA) 8   B) 10   C) 12   D) 16",
    respuesta: "B) 10",
    pasos: ["12.5%=1/8; 80/8=10.", "Atajo: 12.5% = octavo."],
  },
  {
    enunciado: "Fracción 3/5 como porcentaje:\n\nA) 35%   B) 50%   C) 60%   D) 75%",
    respuesta: "C) 60%",
    pasos: ["3/5=0.6=60%.", "Atajo: ×100 a la fracción."],
  },
  {
    enunciado: "0.45 como porcentaje:\n\nA) 4.5%   B) 45%   C) 450%   D) 0.45%",
    respuesta: "B) 45%",
    pasos: ["×100: 45%.", "Atajo: mueve dos decimales."],
  },
  {
    enunciado: "Un artículo de $80.000 con 25% de descuento queda en:\n\nA) 20.000   B) 55.000   C) 60.000   D) 75.000",
    respuesta: "C) 60.000",
    pasos: ["Pagas 75% → 80.000×0.75=60.000.", "Atajo: descuento 25%=20.000; 80−20=60 mil."],
  },
  {
    enunciado: "Precio con 10% de recargo sobre 50.000:\n\nA) 45.000   B) 55.000   C) 60.000   D) 50.010",
    respuesta: "B) 55.000",
    pasos: ["×1.10 = 55.000.", "Atajo: 10% de 50 mil = 5 mil."],
  },
  {
    enunciado: "Media de 10 números = 8. Suma total:\n\nA) 18   B) 80   C) 800   D) 8",
    respuesta: "B) 80",
    pasos: ["Suma = media × n = 8×10=80.", "Atajo: despeja la definición de promedio."],
  },
  {
    enunciado: "Si el promedio de 4 datos es 10 y tres son 8,9,11, el cuarto es:\n\nA) 10   B) 12   C) 14   D) 16",
    respuesta: "B) 12",
    pasos: ["Suma total 40; 8+9+11=28; falta 12.", "Atajo: suma objetivo − conocidos."],
  },
  {
    enunciado: "Proporción: 2/5 = x/20. x=\n\nA) 4   B) 8   C) 10   D) 40",
    respuesta: "B) 8",
    pasos: ["x=2×20/5=8.", "Atajo: productos cruzados 2×20=5x."],
  },
  {
    enunciado: "¿Qué número es 40% mayor que 50?\n\nA) 20   B) 70   C) 90   D) 40",
    respuesta: "B) 70",
    pasos: ["50×1.4=70.", "Atajo: 40% de 50=20; 50+20=70."],
  },
  {
    enunciado: "¿Qué número es 20% menor que 90?\n\nA) 70   B) 72   C) 80   D) 18",
    respuesta: "B) 72",
    pasos: ["90×0.8=72.", "Atajo: 20% de 90=18; 90−18=72."],
  },
  {
    enunciado: "Interés simple: $200.000 al 5% anual por 2 años. Interés:\n\nA) 10.000   B) 20.000   C) 40.000   D) 220.000",
    respuesta: "B) 20.000",
    pasos: ["I=C×r×t=200.000×0.05×2=20.000.", "Atajo: 5% de 200 mil = 10 mil por año ×2."],
  },
  {
    enunciado: "Raíz cuadrada de 144:\n\nA) 10   B) 11   C) 12   D) 14",
    respuesta: "C) 12",
    pasos: ["12×12=144.", "Atajo: memoriza cuadrados 10²…15²."],
  },
  {
    enunciado: "2³ × 3² =\n\nA) 36   B) 72   C) 108   D) 18",
    respuesta: "B) 72",
    pasos: ["8×9=72.", "Atajo: calcula potencias aparte y multiplica."],
  },
  {
    enunciado: "Mínimo común múltiplo de 4 y 6:\n\nA) 12   B) 24   C) 2   D) 10",
    respuesta: "A) 12",
    pasos: ["Múltiplos de 4: 4,8,12…; de 6: 6,12… → 12.", "Atajo: mcm (no mcd)."],
  },
  {
    enunciado: "Máximo común divisor de 24 y 36:\n\nA) 6   B) 12   C) 18   D) 72",
    respuesta: "B) 12",
    pasos: ["Divisores comunes; el mayor es 12.", "Atajo: factoriza o Euclides."],
  },
  {
    enunciado: "Una mezcla 2:3 de A:B tiene 10 litros en total. Litros de A:\n\nA) 2   B) 4   C) 5   D) 6",
    respuesta: "B) 4",
    pasos: ["Partes 2+3=5; cada parte 2 L; A=4 L.", "Atajo: total÷suma de partes × parte A."],
  },
  {
    enunciado: "Si 1 USD = 4.000 COP, 25 USD son:\n\nA) 80.000   B) 90.000   C) 100.000   D) 120.000",
    respuesta: "C) 100.000",
    pasos: ["25×4.000=100.000.", "Atajo: 20×4.000=80.000; 5×4.000=20.000."],
  },
  {
    enunciado: "Tabla mental: ventas 10, 20, 30. ¿Promedio?\n\nA) 15   B) 20   C) 25   D) 60",
    respuesta: "B) 20",
    pasos: ["(10+20+30)/3=20.", "Atajo promedio."],
  },
  {
    enunciado: "Probabilidad de cara en moneda justa:\n\nA) 0   B) 1/3   C) 1/2   D) 1",
    respuesta: "C) 1/2",
    pasos: ["2 resultados equiprobables; 1 favorable.", "Atajo: favorables/posibles."],
  },
  {
    enunciado: "En un dado justo, P(sacar 5 o 6):\n\nA) 1/6   B) 1/3   C) 1/2   D) 2/3",
    respuesta: "B) 1/3",
    pasos: ["2 caras de 6 → 2/6=1/3.", "Atajo: cuenta casos."],
  },
  {
    enunciado: "Orden de operaciones: 3+4×2 =\n\nA) 14   B) 11   C) 10   D) 24",
    respuesta: "B) 11",
    pasos: ["Primero ×: 4×2=8; +3=11.", "Atajo PEMDAS/jerarquía."],
  },
  {
    enunciado: "(8−2)² ÷ 4 =\n\nA) 3   B) 6   C) 9   D) 12",
    respuesta: "C) 9",
    pasos: ["6²=36; 36÷4=9.", "Atajo: paréntesis primero."],
  },
  {
    enunciado: "Si 20% de x es 30, x =\n\nA) 60   B) 120   C) 150   D) 600",
    respuesta: "C) 150",
    pasos: ["0.2x=30 → x=150.", "Atajo: ÷0.2 = ×5."],
  },
  {
    enunciado: "Triple de la mitad de 18:\n\nA) 9   B) 18   C) 27   D) 36",
    respuesta: "C) 27",
    pasos: ["Mitad 9; ×3=27.", "Atajo: lee en orden la frase."],
  },
  {
    enunciado: "Un tren recorre 180 km a 90 km/h. Tiempo:\n\nA) 1.5 h   B) 2 h   C) 2.5 h   D) 3 h",
    respuesta: "B) 2 h",
    pasos: ["180/90=2 h.", "Atajo t=d/v."],
  },
  {
    enunciado: "Área de rectángulo 8×5:\n\nA) 13   B) 26   C) 40   D) 80",
    respuesta: "C) 40",
    pasos: ["base×altura=40.", "Atajo: no sumes (perímetro sería 26)."],
  },
  {
    enunciado: "Perímetro de un cuadrado de lado 7:\n\nA) 14   B) 28   C) 49   D) 21",
    respuesta: "B) 28",
    pasos: ["4×7=28.", "Atajo: perímetro ≠ área (49)."],
  },
  {
    enunciado: "Si A es 25% de B y B=80, A=\n\nA) 15   B) 20   C) 25   D) 40",
    respuesta: "B) 20",
    pasos: ["0.25×80=20.", "Atajo: cuarto de 80."],
  }
);

assertUnique("numerico", numerico);

const verbal: Item[] = [
  {
    enunciado: "«Aunque llovía, salió a correr.» La palabra de contraste es:\n\nA) aunque   B) salió   C) correr   D) llovía",
    respuesta: "A) aunque",
    pasos: ["«Aunque» marca oposición entre lluvia y salir.", "Atajo: conectores de contraste: aunque, pero, sin embargo."],
  },
  {
    enunciado: "Sinónimo más cercano de ESCASO:\n\nA) abundante   B) insuficiente   C) enorme   D) rápido",
    respuesta: "B) insuficiente",
    pasos: ["Escaso ≈ poco / insuficiente.", "Antónimo sería abundante.", "Atajo: prueba la palabra en una frase."],
  },
  {
    enunciado: "Completa: «No solo estudió, ___ también trabajó.»\n\nA) sino   B) si no   C) pero   D) y/o",
    respuesta: "A) sino",
    pasos: ["Correlación no solo… sino también.", "«Si no» = condicional (dos palabras).", "Atajo: sino junta contraste/adición enfática."],
  },
  {
    enunciado: "La idea principal de un párrafo suele estar en:\n\nA) un ejemplo aislado   B) la oración temática   C) un adorno   D) la firma",
    respuesta: "B) la oración temática",
    pasos: ["Casi siempre al inicio (o cierre) en la frase que resume.", "Atajo: ¿qué frase sostiene el resto?"],
  },
  {
    enunciado: "«El informe fue preciso y ___ .» Mejor:\n\nA) chevere   B) claro   C) re-lento   D) random",
    respuesta: "B) claro",
    pasos: ["Registro formal: claro.", "Atajo: evita jerga en textos serios."],
  },
  {
    enunciado: "Antónimo contextual de «obligatorio»:\n\nA) forzoso   B) opcional   C) necesario   D) imperativo",
    respuesta: "B) opcional",
    pasos: ["Opuesto: no obligatorio = opcional.", "Atajo: busca el polo contrario."],
  },
  {
    enunciado: "«Por tanto» introduce principalmente:\n\nA) un ejemplo   B) conclusión/consecuencia   C) una duda   D) un saludo",
    respuesta: "B) conclusión/consecuencia",
    pasos: ["Marca resultado lógico.", "Atajo: conectores de consecuencia: por tanto, así que, luego."],
  },
  {
    enunciado: "Homófonos: «___ hecho el trabajo.»\n\nA) a   B) ha   C) ah   D) ¡ha!",
    respuesta: "B) ha",
    pasos: ["Verbo haber: ha hecho.", "«A» es preposición; «ah» interjección.", "Atajo: si va con participio → haber."],
  },
  {
    enunciado: "Mejor resumen de: «Estudió de noche; por eso llegó preparado.»\n\nA) llegó sin estudiar   B) se preparó estudiando de noche   C) no llegó   D) odió el examen",
    respuesta: "B) se preparó estudiando de noche",
    pasos: ["Causa: estudio nocturno → efecto: preparado.", "Atajo: conserva causa-efecto sin inventar."],
  },
  {
    enunciado: "«Sin embargo» equivale mejor a:\n\nA) además   B) pero   C) porque   D) entonces",
    respuesta: "B) pero",
    pasos: ["Conector adversativo.", "Atajo: sin embargo ≈ pero / no obstante."],
  },
  {
    enunciado: "Palabra mal usada en tono formal: «El jefe está re-busy.» Mejor:\n\nA) muy ocupado   B) super mega free   C) vibes raras   D) okiboost",
    respuesta: "A) muy ocupado",
    pasos: ["Sustituye anglicismo/jerga por español formal.", "Atajo: ¿lo firmarías en un correo a RR.HH.?"],
  },
  {
    enunciado: "Analogía verbal: «Escritor es a novela como pintor es a ___»\n\nA) pincel   B) cuadro   C) museo   D) color",
    respuesta: "B) cuadro",
    pasos: ["Producto de la actividad: novela ↔ cuadro.", "Pincel es herramienta, no obra.", "Atajo: misma relación (autor→obra)."],
  },
  {
    enunciado: "Detecta la conclusión: «Todos los gatos maúllan. Misu es un gato. Por tanto ___»\n\nA) Misu no maúlla   B) Misu maúlla   C) Misu es perro   D) nadie maúlla",
    respuesta: "B) Misu maúlla",
    pasos: ["Silogismo válido: universal + caso → caso cumple la propiedad.", "Atajo: aplica la regla al individuo."],
  },
  {
    enunciado: "«Es decir» sirve para:\n\nA) contradecir   B) reformular/aclarar   C) saludar   D) negar",
    respuesta: "B) reformular/aclarar",
    pasos: ["Introduce explicación equivalente.", "Atajo: reformulación."],
  },
  {
    enunciado: "Prefijo «in-» en «incapaz» indica:\n\nA) repetición   B) negación   C) aumento   D) diminutivo",
    respuesta: "B) negación",
    pasos: ["in- = no capaz.", "Atajo: in-/im-/i- a menudo niegan."],
  },
  {
    enunciado: "Orden lógico: 1) Premisa 2) ___ 3) Conclusión\n\nA) ejemplo o desarrollo   B) firma   C) título solo   D) nada",
    respuesta: "A) ejemplo o desarrollo",
    pasos: ["Entre premisa y cierre suele ir el desarrollo.", "Atajo: estructura de párrafo argumentativo."],
  },
  {
    enunciado: "«Había» vs «habían»: «___ muchas personas.»\n\nA) había   B) habían   C) haber   D) hubieron",
    respuesta: "A) había",
    pasos: ["En español, «haber» impersonal de existencia va en singular: había.", "Atajo: había gente / había problemas."],
  },
  {
    enunciado: "Tono del aviso: «Se ruega silencio.» Es principalmente:\n\nA) agresión   B) petición cortés   C) broma   D) amenaza",
    respuesta: "B) petición cortés",
    pasos: ["«Se ruega» = cortesía formal.", "Atajo: mira el verbo de habla."],
  },
  {
    enunciado: "Cohesión: «Ana llegó tarde. ___ perdió el bus.»\n\nA) por eso   B) aunque   C) es decir   D) ojalá",
    respuesta: "A) por eso",
    pasos: ["Relación causa→efecto.", "Atajo: elige el conector que une la lógica."],
  },
  {
    enunciado: "«Relevar» no debe confundirse con:\n\nA) revelar (descubrir)   B) reemplazar en un turno   C) sustituir   D) turnar",
    respuesta: "A) revelar (descubrir)",
    pasos: ["Relevar ≠ revelar (homófonos/parónimos).", "Atajo: relevo = turno; revelar = descubrir."],
  },
  {
    enunciado: "Idea secundaria suele:\n\nA) contradecir el tema sin avisar   B) apoyar con detalle/ejemplo   C) borrar la tesis   D) ser el título",
    respuesta: "B) apoyar con detalle/ejemplo",
    pasos: ["Sostiene la idea principal.", "Atajo: pregunta ¿esto explica o es el núcleo?"],
  },
  {
    enunciado: "«Puesto que» introduce:\n\nA) causa   B) solo tiempo futuro   C) saludo   D) duda",
    respuesta: "A) causa",
    pasos: ["Puesto que ≈ porque.", "Atajo: conectores causales."],
  },
  {
    enunciado: "Mejor título para un texto sobre ahorrar agua en casa:\n\nA) Historia de Roma   B) Tips para reducir el consumo de agua   C) Receta de pasta   D) Manual de Java",
    respuesta: "B) Tips para reducir el consumo de agua",
    pasos: ["El título debe reflejar el tema real.", "Atajo: ¿lo resume en una línea?"],
  },
  {
    enunciado: "«Ninguno» concuerda en: «Ninguno de los informes ___ listo.»\n\nA) están   B) está   C) estamos   D) sois",
    respuesta: "B) está",
    pasos: ["Ninguno (singular) → está.", "Atajo: el núcleo del sujeto manda."],
  },
  {
    enunciado: "Inferencia válida: «Solo los socios entran. Laura entró.»\n\nA) Laura es socia   B) Laura no es socia   C) nadie entró   D) el local cerró",
    respuesta: "A) Laura es socia",
    pasos: ["Solo socios entran ⇒ quien entra es socio.", "Atajo: condición necesaria convertida en conclusión."],
  },
  {
    enunciado: "Sinónimo de «breve»:\n\nA) eterno   B) corto   C) ancho   D) ruidoso",
    respuesta: "B) corto",
    pasos: ["Breve ≈ corto/conciso.", "Atajo: prueba en contexto."],
  },
  {
    enunciado: "Antónimo de «escaso»:\n\nA) limitado   B) abundante   C) mínimo   D) pobre",
    respuesta: "B) abundante",
    pasos: ["Polo opuesto de poco = mucho/abundante.", "Atajo: escala semántica."],
  },
  {
    enunciado: "Completa: «___ bien temprano, alcanzó cupo.»\n\nA) Llegó   B) Llegar   C) Llegando   D) Llegará",
    respuesta: "A) Llegó",
    pasos: ["Pasado perfecto simple encaja con «alcanzó».", "Atajo: concordancia temporal."],
  },
  {
    enunciado: "En «sin embargo, el resultado fue bueno», «sin embargo» es:\n\nA) sustantivo   B) conector adversativo   C) verbo   D) interjección",
    respuesta: "B) conector adversativo",
    pasos: ["Une ideas en contraste.", "Atajo: función, no forma."],
  },
  {
    enunciado: "¿Qué oración está mejor puntuada?\n\nA) Digamos Clara salió.   B) Digamos, Clara salió.   C) Digamos Clara, salió   D) Digamos Clara salió,",
    respuesta: "B) Digamos, Clara salió.",
    pasos: ["Inciso «digamos» lleva coma.", "Atajo: marcas de inciso."],
  },
  {
    enunciado: "Lectura: «El proyecto atrasó por falta de datos.» Causa principal:\n\nA) sobró tiempo   B) faltaron datos   C) sobró presupuesto   D) sobró personal",
    respuesta: "B) faltaron datos",
    pasos: ["La frase lo declara explícitamente.", "Atajo: no inventes causas."],
  },
  {
    enunciado: "«Cuanto» vs «cuánto»: «___ más estudias, mejor.»\n\nA) Cuánto   B) Cuanto   C) Cuando   D) Cuándo",
    respuesta: "B) Cuanto",
    pasos: ["Correlación cuanto… tanto/mejor sin tilde.", "Atajo: si no hay pregunta, suele ir sin tilde."],
  },
  {
    enunciado: "Analogía: médico es a hospital como maestro es a:\n\nA) pizarra   B) escuela   C) libro   D) recreo",
    respuesta: "B) escuela",
    pasos: ["Lugar de ejercicio profesional.", "Atajo: persona→institución."],
  },
  {
    enunciado: "El texto dice hechos; una opinión sería:\n\nA) «Hubo 3 reuniones»   B) «Fue un plan excelente»   C) «Asistieron 10»   D) «Duró 2 horas»",
    respuesta: "B) «Fue un plan excelente»",
    pasos: ["Excelente = valoración subjetiva.", "Atajo: ¿se puede medir sin juicio?"],
  },
  {
    enunciado: "Coherencia: ¿qué frase no pega tras «El motor falló»?\n\nA) Por eso el auto no arrancó.   B) Celebramos el cumpleaños en la playa.   C) Llamaron al mecánico.   D) Revisaron la batería.",
    respuesta: "B) Celebramos el cumpleaños en la playa.",
    pasos: ["Rompe el tema del fallo mecánico.", "Atajo: misma situación discursiva."],
  },
  {
    enunciado: "«Habían» incorrecto en:\n\nA) Ellos habían llegado.   B) Habían muchas sillas.   C) Habían terminado.   D) Ya habían comido.",
    respuesta: "B) Habían muchas sillas.",
    pasos: ["Existencial: había muchas sillas (singular).", "Atajo: haber de existencia ≠ auxiliar de pluscuamperfecto."],
  },
  {
    enunciado: "Conector de adición:\n\nA) pero   B) además   C) aunque   D) sino",
    respuesta: "B) además",
    pasos: ["Además suma información.", "Atajo: clasifica conectores (adición/contraste/causa)."],
  },
  {
    enunciado: "Inferencia: «Nadie sin casco entra a la obra. Julio entró.»\n\nA) Julio no tenía casco   B) Julio tenía casco   C) la obra cerró   D) Julio es jefe",
    respuesta: "B) Julio tenía casco",
    pasos: ["Condición necesaria para entrar: casco.", "Atajo: igual que «solo socios»."],
  },
  {
    enunciado: "Mejor paráfrasis de «aplazó la reunión»:\n\nA) canceló para siempre   B) la pospuso   C) la adelantó   D) la inventó",
    respuesta: "B) la pospuso",
    pasos: ["Aplazar ≈ posponer.", "Atajo: sinónimo funcional."],
  },
  {
    enunciado: "En un instructivo, el modo verbal más útil es:\n\nA) solo futuro poético   B) imperativo/infinitivo de instrucción   C) solo pretérito   D) solo subjuntivo dudoso",
    respuesta: "B) imperativo/infinitivo de instrucción",
    pasos: ["Instrucciones: «pulse», «mezclar», etc.", "Atajo: género textual."],
  },
  {
    enunciado: "«Porque» vs «por qué»: pregunta directa correcta:\n\nA) Porque llegaste tarde?   B) ¿Por qué llegaste tarde?   C) ¿Porque llegaste tarde?   D) Por que llegaste tarde?",
    respuesta: "B) ¿Por qué llegaste tarde?",
    pasos: ["Pregunta: por qué (dos palabras, tilde).", "Porque responde.", "Atajo: ¿…? → por qué."],
  },
  {
    enunciado: "Campo semántico de «piano»:\n\nA) frutas   B) instrumentos musicales   C) minerales   D) deportes de contacto",
    respuesta: "B) instrumentos musicales",
    pasos: ["Clasifica por categoría.", "Atajo: hiperónimo."],
  },
  {
    enunciado: "Ambigüedad: «Vi a Juan con el telescopio.» ¿Qué no está claro?\n\nA) si Juan existe   B) quién tenía el telescopio   C) si hay telescopio en el mundo   D) la ortografía de Juan",
    respuesta: "B) quién tenía el telescopio",
    pasos: ["Puede ser instrumento del verb o compañía de Juan.", "Atajo: detecta doble lectura."],
  },
  {
    enunciado: "Registro: en un CV, mejora «hice un montón de cosas» por:\n\nA) gestioné X procesos con resultado Y   B) hice demasiadas cosas   C) fui crack   D) lol trabajé",
    respuesta: "A) gestioné X procesos con resultado Y",
    pasos: ["Hechos + resultado medible.", "Atajo: verbo fuerte + evidencia."],
  },
  {
    enunciado: "Conector concesivo:\n\nA) porque   B) aunque   C) además   D) es decir",
    respuesta: "B) aunque",
    pasos: ["Concesión: aunque / a pesar de.", "Atajo: concede un obstáculo."],
  }
];

assertUnique("verbal", verbal);

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{ id: string; descripcion: string; items: Item[] }>;
};

function setTipo(id: string, descripcion: string, items: Item[]) {
  const t = bank.tipos.find((x) => x.id === id);
  if (!t) throw new Error("missing " + id);
  t.descripcion = descripcion;
  t.items = items;
}

setTipo(
  "razonamiento-inductivo",
  "Series, letras, lógica e inducción de reglas. Empieza fácil; luego intercaladas y silogismos. Sin repeticiones.",
  inductivo
);
setTipo(
  "razonamiento-numerico",
  "Porcentajes, razones, promedios, velocidad, IVA y aritmética de test. Únicos, con atajo mental.",
  numerico
);
setTipo(
  "razonamiento-verbal",
  "Conectores, inferencias, vocabulario y comprensión corta. Explicación clara en cada ítem.",
  verbal
);
setTipo(
  "secuencias-numericas",
  "Aritméticas, geométricas, Fibonacci, intercaladas y diferencias. Cada serie es distinta.",
  secuencias
);

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log({
  inductivo: inductivo.length,
  numerico: numerico.length,
  verbal: verbal.length,
  secuencias: secuencias.length,
  diag: bank.tipos.find((t) => t.id === "razonamiento-diagramatico")?.items.length,
  esp: bank.tipos.find((t) => t.id === "razonamiento-espacial")?.items.length,
});

