/**
 * Reemplaza razonamiento-diagramático por ítems profesionales (SHL/Kenexa):
 * - Enunciados cortos SIN revelar la regla
 * - Cada ítem con figura dpro-* coherente
 * - Explicación solo en pasos
 *
 * Uso: npx tsx scripts/rebuild-diagramatico-pro.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura: string };

const SET =
  "Observa los conjuntos A y B y la figura de prueba (?).\n¿A qué conjunto pertenece?\n\nA) Conjunto A\nB) Conjunto B\nC) Ninguno";
const OUT = "Observa el ejemplo y aplica el mismo operador a la segunda fila.\n¿Cuál opción (A–D) es el resultado correcto?";
const FIND_OP =
  "En ambas filas falta el operador (?).\n¿Cuál icono (A–D) transforma la entrada en la salida en ambos casos?";
const FIND_IN =
  "Observa el ejemplo del operador. En la segunda fila falta la entrada.\n¿Cuál opción (A–D) es la entrada correcta?";
const CHAIN = "Observa qué hace cada operador en los ejemplos superiores.\nAplícalos en cadena a la fila inferior. ¿Cuál es el resultado (A–D)?";
const SER = "¿Qué figura continúa la serie?\nElige entre A–D.";
const MTX = "Completa la celda marcada con ?. Elige entre A–D.";
const ANA = "A es a B como C es a ?\nElige entre A–D.";
const ODD = "¿Cuál figura no pertenece al grupo?\nElige entre A–E.";

const items: Item[] = [
  // —— Conjuntos ——
  {
    figura: "dpro-set-clock-parity",
    enunciado: SET,
    respuesta: "A) Conjunto A",
    pasos: [
      "Compara las manecillas de A y de B: no mires la hora «legible», mira paridad (impar/par) de cada número señalado.",
      "En A, exactamente una manecilla cae en número impar; en B, ninguna (ambas en par).",
      "La prueba (6 y 9) tiene exactamente una en impar → pertenece a A.",
      "Atajo assessment: anota I/P bajo cada manecilla; clasifica el patrón, no inventes una regla de «hora exacta».",
    ],
  },
  {
    figura: "dpro-set-clock-sum",
    enunciado: SET,
    respuesta: "A",
    pasos: [
      "Suma los dos números a los que apuntan las manecillas en cada reloj.",
      "A: sumas impares. B: sumas pares.",
      "Prueba 10+5=15 impar → A.",
      "Atajo: ignora la longitud de la manecilla; solo suma los números.",
    ],
  },
  {
    figura: "dpro-set-mirror",
    enunciado: SET,
    respuesta: "A",
    pasos: [
      "En A cada par es el mismo glifo en espejo horizontal (uno relleno, uno contorno).",
      "En B los pares no son espejo (copia, giro 180° o volteo vertical).",
      "La prueba son dos semicírculos espejados → A.",
      "Atajo: dobla mentalmente por el eje vertical del par; si coinciden, es A.",
    ],
  },
  {
    figura: "dpro-set-petal",
    enunciado: SET,
    respuesta: "A",
    pasos: [
      "Fíjate solo en las 12:00 (arriba del núcleo).",
      "A siempre tiene pétalo arriba. B siempre tiene hueco arriba.",
      "La prueba tiene pétalo a las 12 → A.",
      "Atajo: no cuentes pétalos totales primero; mira la posición clave.",
    ],
  },
  {
    figura: "dpro-set-polyline",
    enunciado: SET,
    respuesta: "C",
    pasos: [
      "Cuenta segmentos de la polilínea (n puntos → n−1 segmentos) y si cada punto está dentro/fuera de la concavidad.",
      "A: 3 segmentos + 1 punto dentro y 1 fuera. B: 4 segmentos + ambos dentro.",
      "La prueba tiene 5 segmentos → no cumple A ni B → Ninguno.",
      "Atajo típico SHL: «ni A ni B» es opción real; no fuerces encaje.",
    ],
  },
  {
    figura: "dpro-set-grid",
    enunciado: SET,
    respuesta: "B",
    pasos: [
      "En la cuadrícula 2×2 cuenta celdas grises (barra y puntos son distractores).",
      "A: exactamente 1 celda gris. B: más de una.",
      "La prueba tiene 2 grises (columna izquierda) → B.",
      "Atajo: separa atributos; primero la 2×2, luego valida que barra/puntos no definen el set.",
    ],
  },
  {
    figura: "dpro-set-colinear",
    enunciado: SET,
    respuesta: "A",
    pasos: [
      "Los tres símbolos ¿están en una línea recta?",
      "A: siempre colineales. B: nunca (forman «L» o triángulo).",
      "La prueba está en horizontal recta → A.",
      "Atajo: ignora forma/relleno al clasificar; la geometría de posición manda.",
    ],
  },
  {
    figura: "dpro-set-stars",
    enunciado: SET,
    respuesta: "B",
    pasos: [
      "Cuenta solo estrellas grises (los arcos distraen).",
      "A: 0 o 3 grises. B: exactamente 1 gris.",
      "La prueba tiene 1 gris → B.",
      "Atajo: anota el conteo; reglas de «0 o 3» vs «exactamente 1» son clásicas.",
    ],
  },
  {
    figura: "dpro-set-nest",
    enunciado: SET,
    respuesta: "B",
    pasos: [
      "Mira el contorno exterior y dónde apoya la figura interior.",
      "A: contorno cerrado + interior centrado. B: contorno abierto abajo + interior apoyado en la base.",
      "La prueba tiene apertura inferior e interior abajo → B.",
      "Atajo: «¿reposa en la base abierta?» sí → B.",
    ],
  },
  {
    figura: "dpro-set-blackcount",
    enunciado: SET,
    respuesta: "A",
    pasos: [
      "Cuenta regiones/negras (relleno oscuro), no el tipo de forma.",
      "A: cantidad impar. B: cantidad par.",
      "La prueba tiene 3 negras → A.",
      "Atajo: paridad del conteo; las formas cambian a propósito para despistar.",
    ],
  },
  {
    figura: "dpro-set-arrow-dir",
    enunciado: SET,
    respuesta: "A",
    pasos: [
      "En cada trío, mira si los ángulos crecen o decrecen de izquierda a derecha.",
      "A: rotación creciente (sentido horario en el SVG). B: decreciente.",
      "La prueba 330→30→90 crece (+60) → A.",
      "Atajo: anota los tres ángulos y resta; el signo del salto define el set.",
    ],
  },
  {
    figura: "dpro-set-dot-parity",
    enunciado: SET,
    respuesta: "B",
    pasos: [
      "Cuenta los puntos en las esquinas del cuadrado (la figura central es distractor).",
      "A: número par de puntos. B: número impar.",
      "La prueba tiene 3 → B.",
      "Atajo: no inventes reglas sobre «qué esquina»; la paridad basta.",
    ],
  },
  {
    figura: "dpro-set-cond",
    enunciado: SET,
    respuesta: "B",
    pasos: [
      "Regla condicional por forma: en A, todo triángulo va relleno y el resto contorno; en B es al revés.",
      "Comprueba cada celda de A y B con esa lectura.",
      "Prueba: triángulo contorno + hexágono relleno → encaja en B.",
      "Atajo: «si X entonces Y» es frecuente en diagramático avanzado.",
    ],
  },

  // —— Operadores ——
  {
    figura: "dpro-op-swap-ends",
    enunciado: OUT,
    respuesta: "B",
    pasos: [
      "El ejemplo intercambia la 1.ª y la 3.ª barra; la del medio no se mueve.",
      "Aplica lo mismo: [26,38,18] → [18,38,26] en alturas/rellenos.",
      "Eso es la opción B.",
      "Atajo: marca 1-2-3 y reescribe 3-2-1.",
    ],
  },
  {
    figura: "dpro-op-shade-all",
    enunciado: OUT,
    respuesta: "C",
    pasos: [
      "El operador invierte el relleno de cada sector.",
      "Entrada [oscuro,oscuro,claro,oscuro] → [claro,claro,oscuro,claro].",
      "Opción C.",
      "Atajo: togglear bit a bit; no muevas piezas de sitio.",
    ],
  },
  {
    figura: "dpro-op-resize-mid",
    enunciado: OUT,
    respuesta: "A",
    pasos: [
      "Solo cambia el tamaño del círculo central (grande↔pequeño).",
      "En la pregunta el centro ya es grande → debe quedar pequeño.",
      "Opción A.",
      "Atajo: extremos iguales al ejemplo; solo inspecciona el medio.",
    ],
  },
  {
    figura: "dpro-op-tri-to-circ",
    enunciado: CHAIN,
    respuesta: "D",
    pasos: [
      "Arriba: sombreado invierte rellenos; sol sustituye triángulos por círculos (mismo relleno).",
      "Fila: [sq oscuro, △ claro, △ oscuro] → sombreado → [sq claro, △ oscuro, △ claro] → sol → [sq claro, ○ oscuro, ○ claro].",
      "Opción D.",
      "Atajo: aplica operadores de izquierda a derecha; no combines en un solo paso mental.",
    ],
  },
  {
    figura: "dpro-op-rotate-ccw",
    enunciado: OUT,
    respuesta: "C",
    pasos: [
      "Cada escuadra gira 90° antihorario (resta 90° al ángulo).",
      "[180,0,270] → [90,270,180].",
      "Opción C.",
      "Atajo: dibuja una L mental y gírala un cuarto a la izquierda.",
    ],
  },
  {
    figura: "dpro-op-shift-left",
    enunciado: OUT,
    respuesta: "A",
    pasos: [
      "Cada arco se desplaza una posición a la izquierda; el primero pasa al final.",
      "[180,0,270,90] → [0,270,90,180].",
      "Opción A.",
      "Atajo: escribe la cola y pega la cabeza al final.",
    ],
  },
  {
    figura: "dpro-op-find-op-swap",
    enunciado: FIND_OP,
    respuesta: "C",
    pasos: [
      "En ambas filas solo se intercambian extremos; el centro queda igual.",
      "Eso corresponde al icono de flechas de intercambio (opción C).",
      "Rotación o sombreado alterarían orientación/relleno, no solo el orden.",
      "Atajo: si 1↔3 y 2 fijo → swap.",
    ],
  },
  {
    figura: "dpro-op-find-op-reflect",
    enunciado: FIND_OP,
    respuesta: "D",
    pasos: [
      "El resultado invierte el orden y espeja cada glifo horizontalmente.",
      "Eso es un reflejo del grupo respecto a un eje vertical (opción D).",
      "Un swap sin espejo no voltearía cada pieza; el reflejo vertical voltearía arriba/abajo.",
      "Atajo: orden invertido + sx−1 ⇒ reflect horizontal del conjunto.",
    ],
  },
  {
    figura: "dpro-op-find-input",
    enunciado: FIND_IN,
    respuesta: "C",
    pasos: [
      "El operador solo cambia el tamaño del centro.",
      "La salida tiene centro pequeño ⇒ la entrada tenía centro grande (mismos extremos y rellenos).",
      "Opción C.",
      "Atajo: trabaja el operador al revés desde la salida.",
    ],
  },
  {
    figura: "dpro-op-double-chain",
    enunciado: CHAIN,
    respuesta: "B",
    pasos: [
      "Sombreado invierte rellenos; tamaño solo afecta el centro.",
      "[oscuro,claro,oscuro] + centro grande → sombreado → [claro,oscuro,claro] mismo tamaño → tamaño → centro pequeño.",
      "Opción B.",
      "Atajo: dos atributos distintos; resuélvelos en orden.",
    ],
  },
  {
    figura: "dpro-op-replace-star",
    enunciado: OUT,
    respuesta: "C",
    pasos: [
      "El operador sustituye estrellas por cuadrados (mismo relleno); el resto no cambia.",
      "[○, ★ oscura, ★ clara] → [○, ■ oscuro, ■ claro].",
      "Opción C.",
      "Atajo: busca qué forma desaparece y cuál aparece.",
    ],
  },
  {
    figura: "dpro-op-shade-straight",
    enunciado: OUT,
    respuesta: "B",
    pasos: [
      "El ejemplo invierte relleno solo en figuras de bordes rectos (cuadrado, triángulo), no en el círculo.",
      "En la pregunta: círculos iguales; el rombo (rectos) cambia de claro a oscuro.",
      "Opción B.",
      "Atajo: clasifica «curva vs recta» antes de togglear.",
    ],
  },
  {
    figura: "dpro-op-swap-23",
    enunciado: OUT,
    respuesta: "A",
    pasos: [
      "El operador intercambia la 2.ª y la 3.ª figura; la 1.ª no se mueve.",
      "[◆, ○, ★] → [◆, ★, ○].",
      "Opción A.",
      "Atajo: distinto del swap de extremos; aquí mueve el bloque derecho.",
    ],
  },
  {
    figura: "dpro-op-mirror-v",
    enunciado: OUT,
    respuesta: "C",
    pasos: [
      "Cada glifo se refleja verticalmente (arriba↔abajo), sin cambiar el orden.",
      "La opción con sy−1 en todas y mismo orden es C.",
      "A es espejo horizontal; D además reordena.",
      "Atajo: compara una punta asimétrica (gancho) arriba vs abajo.",
    ],
  },
  {
    figura: "dpro-op-triple-chain",
    enunciado: CHAIN,
    respuesta: "B",
    pasos: [
      "Orden: sombreado → intercambio extremos → sol (△→○).",
      "Partida [△ oscuro, ◆ claro, ■ oscuro] → sombreado [△ claro, ◆ oscuro, ■ claro] → swap [■ claro, ◆ oscuro, △ claro] → sol [■ claro, ◆ oscuro, ○ claro].",
      "Opción B.",
      "Atajo: escribe tres columnas y aplica una transformación por línea.",
    ],
  },

  // —— Series / matrices / analogías / impar ——
  {
    figura: "dpro-ser-dual",
    enunciado: SER,
    respuesta: "C",
    pasos: [
      "Dos reglas a la vez: +45° cada paso y alternancia de relleno.",
      "Tras 135° claro viene 180° oscuro.",
      "Opción C.",
      "Atajo: resuelve ángulo y relleno por separado; luego cruza.",
    ],
  },
  {
    figura: "dpro-ser-dotwalk",
    enunciado: SER,
    respuesta: "B",
    pasos: [
      "El punto recorre esquinas en sentido horario: 0→1→2→3→0→1…",
      "El relleno va en pares: oscuro,oscuro,claro,claro,oscuro,oscuro…",
      "Siguiente: esquina 1 y oscuro → B.",
      "Atajo: periodos distintos (4 vs 2); no los sincronices mal.",
    ],
  },
  {
    figura: "dpro-ser-nested",
    enunciado: SER,
    respuesta: "C",
    pasos: [
      "Lados del polígono exterior: 3→4→5→6.",
      "Relleno del interior: claro→oscuro→claro→oscuro.",
      "Hexágono con interior oscuro → C.",
      "Atajo: una serie numérica + una binaria.",
    ],
  },
  {
    figura: "dpro-ser-binary",
    enunciado: SER,
    respuesta: "B",
    pasos: [
      "Las marcas codifican 1,2,3,4… en binario (lectura de bits).",
      "Siguiente es 5.",
      "Opción B.",
      "Atajo: asigna 1/0 a cada marca fija y convierte a decimal.",
    ],
  },
  {
    figura: "dpro-ser-layer",
    enunciado: SER,
    respuesta: "D",
    pasos: [
      "Tres capas con periodos distintos: borde continuo/discontinuo (2), forma media (c→s→t ciclo 3), punto en esquina (ciclo 4).",
      "Siguiente: borde discontinuo, triángulo, punto en esquina 1.",
      "Opción D.",
      "Atajo: anota tres secuencias cortas; es el truco de series «multicapa».",
    ],
  },
  {
    figura: "dpro-mtx-xor",
    enunciado: MTX,
    respuesta: "C",
    pasos: [
      "En cada fila, la 3.ª celda es la XOR de presencia de formas de las dos primeras (lo común se cancela).",
      "Fila 3: {c,s,t} XOR {c,t} = {s}.",
      "Opción C (solo cuadrado).",
      "Atajo: piensa conjuntos, no dibujo «bonito».",
    ],
  },
  {
    figura: "dpro-mtx-add",
    enunciado: MTX,
    respuesta: "A",
    pasos: [
      "Cada lado del cuadrado es un bit; la 3.ª celda es XOR de lados de las dos primeras.",
      "Fila 3: LRT XOR RB = LT B (R se cancela) → TLB.",
      "Opción A.",
      "Atajo: dibuja T/R/B/L como cuatro interruptores.",
    ],
  },
  {
    figura: "dpro-mtx-rowcol",
    enunciado: MTX,
    respuesta: "B",
    pasos: [
      "Filas: la flecha gira 0°, 90°, 180°… Según la fila.",
      "Columnas: el relleno sigue 0→1→2 (claro→oscuro→gris).",
      "Celda inferior derecha: rot 180° y relleno de columna 2 (gris) → B.",
      "Atajo: una regla en filas, otra en columnas (Raven clásico).",
    ],
  },
  {
    figura: "dpro-mtx-prog",
    enunciado: MTX,
    respuesta: "D",
    pasos: [
      "Por fila aumenta el número de puntos (1,2,3).",
      "Por columna gira el triángulo 0°, 90°, 180°.",
      "Falta: 3 puntos y 180° → D.",
      "Atajo: no mezcles el contador de puntos con el giro.",
    ],
  },
  {
    figura: "dpro-ana-transform",
    enunciado: ANA,
    respuesta: "D",
    pasos: [
      "A→B: giro 180° e inversión de relleno.",
      "Aplica a C (oscuro): 180° + claro → contorno.",
      "Opción D.",
      "Atajo: traduce el cambio a verbos («girar + invertir») y applícalos a C.",
    ],
  },
  {
    figura: "dpro-ana-parts",
    enunciado: ANA,
    respuesta: "C",
    pasos: [
      "A→B: la diagonal parte el cuadrado en dos triángulos iguales.",
      "C tiene un diámetro: debe partir el círculo en dos semicírculos iguales.",
      "Opción C (no un solo semi, ni partes desiguales).",
      "Atajo: analogía de partición, no de «quitar una mitad».",
    ],
  },
  {
    figura: "dpro-odd-orient",
    enunciado: ODD,
    respuesta: "C",
    pasos: [
      "Regla del grupo: flecha rellena solo si apunta arriba o abajo (0°/180°); si apunta a un lado, va en contorno.",
      "A, B, D y E cumplen. C está rellena apuntando a la derecha → rompe la regla.",
      "Respuesta C.",
      "Atajo odd-one-out: formula una regla que cumplan 4; la que falle es la respuesta.",
    ],
  },
  {
    figura: "dpro-odd-count",
    enunciado: ODD,
    respuesta: "D",
    pasos: [
      "Cuenta piezas en cada panel: 5,2,3,4,3.",
      "Cuatro conteos son primos; 4 es compuesto.",
      "La D no pertenece.",
      "Atajo: cuando las formas varían mucho, prueba conteo/paridad/primo.",
    ],
  },
  {
    figura: "dpro-odd-symmetry",
    enunciado: ODD,
    respuesta: "E",
    pasos: [
      "Cuatro figuras tienen simetría vertical (espejo izquierda-derecha).",
      "La E está torcida a propósito y no coincide al doblar.",
      "Respuesta E.",
      "Atajo: dobla mentalmente por el eje central de cada una.",
    ],
  },
];

function main() {
  const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
  const banco = JSON.parse(readFileSync(path, "utf8"));
  const tipo = banco.tipos.find((t: { id: string }) => t.id === "razonamiento-diagramatico");
  if (!tipo) throw new Error("tipo razonamiento-diagramatico no encontrado");

  const setMap: Record<string, string> = {
    A: "A) Conjunto A",
    B: "B) Conjunto B",
    C: "C) Ninguno",
  };
  for (const it of items) {
    const letter = it.respuesta.trim().toUpperCase().replace(/[^A-E].*/, "");
    if (it.figura.startsWith("dpro-set-") && setMap[letter]) it.respuesta = setMap[letter];
    else if (/^[A-E]$/i.test(it.respuesta.trim())) it.respuesta = `${letter})`;
  }

  const figs = new Set(items.map((i) => i.figura));
  if (figs.size !== items.length) throw new Error("figuras duplicadas en el banco nuevo");

  tipo.items = items;
  tipo.descripcion =
    "Razonamiento diagramático nivel assessment (conjuntos, operadores, series y matrices). Las reglas no se revelan en el enunciado: dedúcelas del diagrama.";

  writeFileSync(path, JSON.stringify(banco, null, 2) + "\n", "utf8");
  console.log(`OK diagramático: ${items.length} ítems profesionales`);
  console.log([...figs].join(", "));
}

main();
