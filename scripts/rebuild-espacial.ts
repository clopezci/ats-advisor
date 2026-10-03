/**
 * Reescribe razonamiento-espacial: nets/dados fuertes, sin pobreza de contenido.
 * Uso: npx tsx scripts/rebuild-espacial.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura: string };

const items: Item[] = [
  // —— Nivel 1: bases ——
  {
    figura: "espacial-cubo-pintado",
    enunciado:
      "Cubo 3×3×3 pintado por fuera. ¿Cuántos cubitos con exactamente 1 cara pintada?\n\nA) 6   B) 8   C) 12   D) 1",
    respuesta: "A) 6",
    pasos: [
      "Exactamente 1 cara = solo el centro de cada cara grande.",
      "Hay 6 caras → 6 centros → 6 cubitos.",
      "Esquinas tienen 3 caras; aristas (sin esquina) tienen 2.",
      "Atajo: 1 cara = (3−2)² × 6 = 1×6 = 6.",
    ],
  },
  {
    figura: "esp-dado-suma7",
    enunciado:
      "Dados clásicos: opuestos suman 7. Opuesta a 3:\n\nA) 1   B) 4   C) 2   D) 6",
    respuesta: "B) 4",
    pasos: [
      "Regla fija: 1↔6, 2↔5, 3↔4.",
      "3 + 4 = 7 → opuesta es 4.",
      "No uses la cara de al lado: opuesta = la de atrás.",
      "Atajo: resta de 7 (7−3=4).",
    ],
  },
  {
    figura: "espacial-aristas",
    enunciado:
      "¿Cuántas aristas tiene un cubo?\n\nA) 8   B) 10   C) 12   D) 16",
    respuesta: "C) 12",
    pasos: [
      "Arista = borde donde se juntan dos caras.",
      "4 arriba + 4 abajo + 4 verticales = 12.",
      "No confundas con vértices (8) ni caras (6).",
      "Atajo: 8 vértices × 3 / 2 = 12.",
    ],
  },
  {
    figura: "espacial-caras-adyacentes",
    enunciado:
      "Cubo: ¿cuántas caras son adyacentes a la superior?\n\nA) 2   B) 3   C) 4   D) 5",
    respuesta: "C) 4",
    pasos: [
      "Adyacente = comparte una arista (se tocan).",
      "La tapa toca las 4 paredes laterales.",
      "La inferior es opuesta, no vecina.",
      "Atajo: cada cara tiene 4 vecinas y 1 opuesta.",
    ],
  },
  {
    figura: "espacial-espejo",
    enunciado:
      "Espejo vertical. Izquierda y derecha:\n\nA) se mantienen   B) se intercambian   C) rotan 90°   D) desaparecen",
    respuesta: "B) se intercambian",
    pasos: [
      "Espejo vertical = el del baño.",
      "Cambia izquierda↔derecha; arriba/abajo igual.",
      "No es un giro.",
      "Atajo: levanta la mano derecha frente al espejo.",
    ],
  },
  {
    figura: "giro-espejo-r",
    enunciado:
      "Si giras la letra «p» 180°, se parece más a:\n\nA) b   B) d   C) q   D) p",
    respuesta: "B) d",
    pasos: [
      "Giro 180° = media vuelta del papel (no espejo).",
      "La «p» queda como «d».",
      "Espejo sin girar daría otra letra.",
      "Atajo: dibuja p, gira la hoja media vuelta.",
    ],
  },

  // —— Nets / dados desarmados (núcleo del bloque) ——
  {
    figura: "esp-net-opuesta-a",
    enunciado:
      "Dado desarmado en cruz (letras A–F). ¿Qué cara queda opuesta a A?\n\nA) B   B) C   C) E   D) D",
    respuesta: "C) E",
    pasos: [
      "Columna A–C–E–F: en una fila de 4, la 1ª queda opuesta a la 3ª.",
      "A (1ª) ↔ E (3ª).",
      "B y D se tocan con C → son laterales, no opuestas a A.",
      "Atajo: opuestas = una cara en medio en línea recta (o dos pares en tira de 4).",
    ],
  },
  {
    figura: "esp-net-cruz-letras",
    enunciado:
      "En el mismo net en cruz, ¿qué cara es opuesta a C?\n\nA) A   B) F   C) B   D) D",
    respuesta: "B) F",
    pasos: [
      "Columna A–C–E–F: la 2ª (C) queda opuesta a la 4ª (F).",
      "A↔E y C↔F.",
      "B y D son opuestas entre sí (brazos de la cruz).",
      "Atajo: numera la tira 1-2-3-4 → opuestos 1↔3 y 2↔4.",
    ],
  },
  {
    figura: "esp-net-invalida-2x2",
    enunciado:
      "Mirando A (cruz) y B (con bloque 2×2), ¿cuál NO se puede plegar en cubo?\n\nA) solo A   B) solo B   C) ambas   D) ninguna",
    respuesta: "B) solo B",
    pasos: [
      "Regla de oro: un bloque sólido 2×2 en el net es inválido (caras se solapan).",
      "La cruz A es uno de los 11 nets válidos.",
      "B tiene el cuadrado 2×2 rojo → no forma cubo.",
      "Atajo: busca 2×2 o 5+ en línea antes de imaginar el pliegue.",
    ],
  },
  {
    figura: "esp-net-cinco-linea",
    enunciado:
      "Un desarrollo tiene 5 cuadrados en una sola fila y uno abajo. ¿Forma un cubo?\n\nA) sí   B) no   C) solo si se pinta   D) solo con cinta",
    respuesta: "B) no",
    pasos: [
      "Más de 4 cuadrados en línea recta no pueden plegarse a cubo.",
      "Al doblar, las puntas se solapan o no cierran.",
      "Hay exactamente 11 nets válidos; este patrón no está.",
      "Atajo: máx. 4 en una fila recta.",
    ],
  },
  {
    figura: "esp-net-t",
    enunciado:
      "Net en T con letras P Q R / S / T / U. ¿Opuesta a Q?\n\nA) P   B) S   C) T   D) U",
    respuesta: "C) T",
    pasos: [
      "Columna Q–S–T–U (4 caras): 1ª↔3ª y 2ª↔4ª.",
      "Q (1ª) ↔ T (3ª).",
      "S ↔ U; P y R son brazos laterales de Q.",
      "Atajo: marca la tira larga y aplica 1↔3, 2↔4.",
    ],
  },
  {
    figura: "esp-net-opuesta-q",
    enunciado:
      "En el net en T, ¿qué cara es opuesta a S?\n\nA) Q   B) T   C) U   D) P",
    respuesta: "C) U",
    pasos: [
      "Misma columna Q–S–T–U: S es la 2ª ↔ U la 4ª.",
      "Q↔T ya lo usaste; el otro par es S↔U.",
      "P toca a Q: adyacente, no opuesta a S.",
      "Atajo: los tres pares de opuestos cubren las 6 caras.",
    ],
  },
  {
    figura: "esp-net-numeros",
    enunciado:
      "Net de dado: columna 1–3–6–4 y laterales 2 y 5. ¿Opuesta a 1?\n\nA) 3   B) 6   C) 4   D) 2",
    respuesta: "B) 6",
    pasos: [
      "Tira 1–3–6–4: 1ª↔3ª → 1 opuesta a 6.",
      "También 3↔4 y laterales 2↔5 (suman 7).",
      "1 y 6 no comparten lado en el papel → coherente.",
      "Atajo: comprueba suma 7 + regla del net.",
    ],
  },
  {
    figura: "esp-net-numeros",
    enunciado:
      "En ese net de dado, ¿pueden 3 y 6 quedar adyacentes al armarse?\n\nA) sí, siempre   B) no, son opuestas   C) solo si giras el net   D) no se sabe",
    respuesta: "B) no, son opuestas",
    pasos: [
      "En la tira, 3 es la 2ª y 6 la 3ª… wait: 1–3–6–4 → 2ª=3, 3ª=6. Opposites are 1↔6 and 3↔4.",
      "3 y 6 SÍ se tocan en el net (comparten lado) → en el cubo son ADYACENTES, no opuestas.",
      "Recalcular: pregunta «¿pueden 3 y 6 quedar adyacentes?» → SÍ porque ya se tocan en el net.",
      "Respuesta correcta: A) sí, siempre (al menos en este net).",
    ],
  },
];

// Fix the broken item and continue with clean items
items.pop();
items.push(
  {
    figura: "esp-net-numeros",
    enunciado:
      "En el net 1–3–6–4 (laterales 2 y 5), 3 y 6 comparten lado. Al armar el cubo son:\n\nA) opuestas   B) adyacentes   C) la misma cara   D) imposibles",
    respuesta: "B) adyacentes",
    pasos: [
      "Regla: si dos caras comparten lado en el papel, en el cubo son vecinas (adyacentes).",
      "3 y 6 se tocan en el net → adyacentes.",
      "Las opuestas de este net son 1↔6, 3↔4 y 2↔5.",
      "Atajo: tocar en el net ⇒ nunca opuestas.",
    ],
  },
  {
    figura: "esp-net-zigzag",
    enunciado:
      "El desarrollo en Z (6 caras). ¿Es un net válido de cubo?\n\nA) no   B) sí   C) solo con 7 caras   D) solo simétrico",
    respuesta: "B) sí",
    pasos: [
      "La «z» o «s» es uno de los 11 nets válidos.",
      "Tiene 6 cuadrados unidos por lados, sin bloque 2×2 ni fila de 5.",
      "Se puede plegar sin solapar.",
      "Atajo: memoriza familias válidas: cruz, T, Z, silla, etc.",
    ],
  },
  {
    figura: "esp-net-letra",
    enunciado:
      "Net con F (frente), U (arriba), B (atrás), D (abajo), L/R. Si U queda arriba, ¿qué queda abajo?\n\nA) F   B) B   C) D   D) L",
    respuesta: "C) D",
    pasos: [
      "U y D están en la columna con caras entre medias: son el par arriba/abajo.",
      "Al poner U arriba, D queda abajo.",
      "F y B quedan frente/atrás según cómo gires.",
      "Atajo: en la cruz, la cara del extremo opuesto al brazo suele ser la opuesta.",
    ],
  },
  {
    figura: "espacial-net-cruz",
    enunciado:
      "Net en cruz: la cara opuesta al centro de la cruz suele ser:\n\nA) un brazo extremo   B) una esquina del papel   C) la misma cara   D) no hay opuesta",
    respuesta: "A) un brazo extremo",
    pasos: [
      "El centro toca a varias caras → no puede ser opuesta a ellas.",
      "La opuesta es la que no toca al centro: el extremo del brazo largo.",
      "Caras que comparten lado nunca son opuestas.",
      "Atajo: «opuesta = la que no toca».",
    ],
  },
  {
    figura: "cubo-caras-opuestas",
    enunciado:
      "En un desarrollo, dos caras marcadas se tocan por un lado. ¿Pueden ser opuestas en el cubo?\n\nA) sí   B) no   C) solo si son del mismo color   D) solo en nets inválidos",
    respuesta: "B) no",
    pasos: [
      "Opuestas nunca comparten arista.",
      "Si en el net ya se tocan, al plegar siguen siendo vecinas.",
      "Usa esto para descartar opciones rápidas.",
      "Atajo: tocar en el papel ⇒ adyacentes en 3D.",
    ],
  },

  // —— Dados 3D / vistas ——
  {
    figura: "esp-dado-abierto",
    enunciado:
      "Se ven las caras 1 (arriba), 2 y 3 (lados). ¿Puede verse también el 6 a la vez?\n\nA) sí   B) no   C) solo de lejos   D) solo si 1 no está",
    respuesta: "B) no",
    pasos: [
      "1 y 6 son opuestas: nunca se ven juntas.",
      "Con 1 visible, 6 está oculto abajo/atrás.",
      "Las tres visibles se juntan en un vértice.",
      "Atajo: de un par opuesto, como máximo ves una.",
    ],
  },
  {
    figura: "esp-dado-opuesta-vista",
    enunciado:
      "Visibles: 5 (arriba), 3 y 4 (lados). ¿Qué número está opuesto al 5 (oculto)?\n\nA) 1   B) 2   C) 6   D) 3",
    respuesta: "B) 2",
    pasos: [
      "Opuestos suman 7: 5↔2.",
      "3 y 4 visibles son adyacentes a 5 (no opuestas).",
      "6 sería opuesta a 1, no a 5.",
      "Atajo: 7 − cara visible = opuesta oculta.",
    ],
  },
  {
    figura: "esp-dado-suma7",
    enunciado:
      "Si la cara de abajo es 6, ¿qué cara queda arriba?\n\nA) 1   B) 2   C) 3   D) 5",
    respuesta: "A) 1",
    pasos: [
      "Abajo y arriba son opuestas.",
      "6↔1 porque 6+1=7.",
      "Las laterales pueden ser 2,3,4,5 según el giro.",
      "Atajo: arriba = 7 − abajo.",
    ],
  },
  {
    figura: "dado-opuestos-7",
    enunciado:
      "Un dado muestra 2 adelante y 3 arriba. ¿Cuál NO puede estar a la derecha (adyacente a ambas)?\n\nA) 1   B) 4   C) 5   D) 6",
    respuesta: "C) 5",
    pasos: [
      "2 y 5 son opuestas: 5 no puede ser adyacente a 2.",
      "La derecha toca a 2 y a 3 → debe ser una cara vecina a ambas.",
      "5 queda descartada de inmediato.",
      "Atajo: elimina primero la opuesta a cualquier cara visible.",
    ],
  },
  {
    figura: "esp-dado-abierto",
    enunciado:
      "Desde un vértice del cubo/dado siempre ves exactamente:\n\nA) 1 cara   B) 2 caras   C) 3 caras   D) 4 caras",
    respuesta: "C) 3 caras",
    pasos: [
      "Un vértice une 3 aristas y 3 caras.",
      "Por eso la vista típica del dado muestra 3 caras.",
      "Nunca 4: eso implicaría ver una opuesta.",
      "Atajo: vértice → 3 caras.",
    ],
  },

  // —— Cubos pintados / conteo ——
  {
    figura: "esp-cubo-pintado-2",
    enunciado:
      "Cubo 4×4×4 pintado por fuera. ¿Cuántos cubitos con exactamente 1 cara pintada?\n\nA) 6   B) 24   C) 16   D) 8",
    respuesta: "B) 24",
    pasos: [
      "Por cara: (4−2)² = 2² = 4 centros de cara.",
      "6 caras × 4 = 24.",
      "No cuentes aristas ni esquinas (tienen 2 o 3 caras).",
      "Atajo: (n−2)² × 6.",
    ],
  },
  {
    figura: "esp-cubo-pintado-0",
    enunciado:
      "Cubo 4×4×4 pintado. ¿Cuántos cubitos con 0 caras pintadas?\n\nA) 1   B) 4   C) 8   D) 0",
    respuesta: "C) 8",
    pasos: [
      "Interior = (4−2)³ = 2³ = 8.",
      "Son los que no tocan ninguna cara exterior.",
      "En 3×3×3 el interior es 1; en 4×4×4 son 8.",
      "Atajo: (n−2)³.",
    ],
  },
  {
    figura: "espacial-cubo-pintado",
    enunciado:
      "Cubo 3×3×3 pintado. ¿Cuántos con exactamente 2 caras pintadas?\n\nA) 6   B) 8   C) 12   D) 24",
    respuesta: "C) 12",
    pasos: [
      "2 caras = centros de cada arista (no esquina).",
      "Un cubo tiene 12 aristas → 12 cubitos.",
      "Esquinas = 3 caras (hay 8); centros de cara = 1.",
      "Atajo: 12 aristas → 12 de «dos caras».",
    ],
  },
  {
    figura: "espacial-cubo-pintado",
    enunciado:
      "Cubo 3×3×3 pintado. ¿Cuántos con exactamente 3 caras pintadas?\n\nA) 1   B) 6   C) 8   D) 12",
    respuesta: "C) 8",
    pasos: [
      "3 caras = solo las 8 esquinas del cubo grande.",
      "No hay más vértices.",
      "El centro absoluto tiene 0; centros de cara 1; aristas 2.",
      "Atajo: esquinas = 8 siempre en un cubo.",
    ],
  },
  {
    figura: "esp-estructura-cubos",
    enunciado:
      "Estructura: fila de 3 cubos en la base y una torre de 2 encima del del medio. ¿Cuántos cubos en total?\n\nA) 4   B) 5   C) 6   D) 3",
    respuesta: "B) 5",
    pasos: [
      "Base: 3. Torre: 2 encima del central.",
      "3+2=5 (el del medio de la base no se cuenta dos veces).",
      "Cuenta capas: suelo 3 + piso1 1 + piso2 1.",
      "Atajo: dibuja y numera cada cubo.",
    ],
  },

  // —— Vistas, giros, papel ——
  {
    figura: "espacial-cilindro",
    enunciado:
      "Vista desde arriba: círculo. Sólido más probable:\n\nA) cubo   B) cilindro   C) pirámide triangular   D) prisma triangular",
    respuesta: "B) cilindro",
    pasos: [
      "Vista superior circular → base redonda.",
      "Entre las opciones, cilindro encaja.",
      "Cubo daría cuadrado; prisma triangular, triángulo.",
      "Atajo: la planta te dice la forma de la base.",
    ],
  },
  {
    figura: "espacial-cono-lado",
    enunciado:
      "Vista lateral de un cono (punta arriba): se ve más como:\n\nA) círculo   B) triángulo   C) cuadrado   D) hexágono",
    respuesta: "B) triángulo",
    pasos: [
      "De lado: silueta triangular.",
      "Desde arriba sería círculo.",
      "No mezcles las vistas.",
      "Atajo: lateral ≠ planta.",
    ],
  },
  {
    figura: "esp-vistas-orto",
    enunciado:
      "Si el alzado (frente) es un cuadrado y la planta (arriba) es un círculo, el sólido puede ser:\n\nA) cubo   B) cilindro   C) pirámide   D) tetraedro",
    respuesta: "B) cilindro",
    pasos: [
      "Frente cuadrado/rectángulo + arriba círculo → cilindro típico.",
      "Un cubo tendría planta cuadrada.",
      "Pirámide suele mostrar triángulo de lado.",
      "Atajo: combina dos vistas antes de decidir.",
    ],
  },
  {
    figura: "espacial-doblez",
    enunciado:
      "Papel con flecha ↑; doblas por la mitad horizontal. La punta queda:\n\nA) hacia el pliegue   B) siempre abajo   C) impossible   D) a la derecha",
    respuesta: "A) hacia el pliegue",
    pasos: [
      "Doblar acerca los extremos al pliegue.",
      "La punta de la flecha se mueve hacia la línea del medio.",
      "No es lo mismo que girar 180°.",
      "Atajo: imagina cerrar un cuaderno.",
    ],
  },
  {
    figura: "esp-papel-agujeros",
    enunciado:
      "Doblas el papel una vez por la mitad y perforas un agujero en una capa. Al abrir, ¿cuántos agujeros ves en total?\n\nA) 1   B) 2   C) 4   D) 0",
    respuesta: "B) 2",
    pasos: [
      "Un doblez = 2 capas; el pinchazo atraviesa ambas.",
      "Al desplegar quedan 2 agujeros simétricos respecto al pliegue.",
      "Con 2 dobleces independientes podrías tener 4.",
      "Atajo: agujeros ≈ 2^(número de dobleces) si cada uno atraviesa todas las capas.",
    ],
  },
  {
    figura: "espacial-reloj",
    enunciado:
      "Reloj: manecilla en las 3. Giras el reloj 90° antihorario. ¿A qué hora «apunta» visualmente?\n\nA) 12   B) 3   C) 6   D) 9",
    respuesta: "A) 12",
    pasos: [
      "Giras el marco entero 90° antihorario.",
      "Lo que apuntaba a las 3 queda hacia las 12.",
      "Horario 90° desde las 3 iría a las 6.",
      "Atajo: un cuarto de vuelta «hacia atrás».",
    ],
  },
  {
    figura: "esp-giro-objeto",
    enunciado:
      "Una pestaña está arriba del rectángulo. Tras girar 90° horario, la pestaña queda:\n\nA) arriba   B) a la derecha   C) abajo   D) a la izquierda",
    respuesta: "B) a la derecha",
    pasos: [
      "Giro horario 90°: arriba → derecha.",
      "Es el mismo ciclo de flechas: ↑→→↓→←.",
      "No uses espejo: es rotación.",
      "Atajo: ciclo horario de 4.",
    ],
  },
  {
    figura: "espacial-mapa-180",
    enunciado:
      "Mapa: giras 180°. Lo que estaba arriba-izquierda queda:\n\nA) arriba-derecha   B) abajo-derecha   C) abajo-izquierda   D) igual",
    respuesta: "B) abajo-derecha",
    pasos: [
      "180° cambia arriba↔abajo e izquierda↔derecha a la vez.",
      "Arriba-izquierda → abajo-derecha.",
      "Como media vuelta del papel sobre la mesa.",
      "Atajo: ambas coordenadas se invierten.",
    ],
  },
  {
    figura: "espacial-brujula",
    enunciado:
      "Norte arriba. Caminas norte, luego este, luego sur. ¿Hacia dónde miras al final?\n\nA) norte   B) sur   C) este   D) oeste",
    respuesta: "B) sur",
    pasos: [
      "La mirada final = dirección del último tramo.",
      "Último tramo: sur.",
      "No sumes giros de más.",
      "Atajo: solo cuenta el rumbo final.",
    ],
  },
  {
    figura: "espacial-espejo",
    enunciado:
      "Silueta de L. Tras reflejo que cambia izquierda↔derecha, la L:\n\nA) queda igual   B) se invierte I/D   C) se pone de cabeza   D) desaparece",
    respuesta: "B) se invierte I/D",
    pasos: [
      "Espejo vertical cambia I/D.",
      "No la pone de cabeza (eso sería otro eje).",
      "Dibuja L y su espejo.",
      "Atajo: baño = I/D; lago = arriba/abajo.",
    ],
  },
  {
    figura: "espacial-dos-cubos",
    enunciado:
      "2 cubos pegados por una cara. ¿Máximo de caras visibles del sólido?\n\nA) 6   B) 8   C) 10   D) 12",
    respuesta: "C) 10",
    pasos: [
      "2×6 = 12 caras; al pegar se ocultan 2.",
      "12−2=10.",
      "Orientación típica muestra esas 10 del sólido completo.",
      "Atajo: totales − 2 ocultas.",
    ],
  },
  {
    figura: "espacial-escalera",
    enunciado:
      "Escalera vista de frente: los peldaños se ven como:\n\nA) círculos   B) rectángulos/líneas horizontales   C) triángulos   D) puntos",
    respuesta: "B) rectángulos/líneas horizontales",
    pasos: [
      "De frente: franjas horizontales.",
      "De perfil: forma de sierra.",
      "Elige según la vista pedida.",
      "Atajo: frente = sin profundidad.",
    ],
  },
  {
    figura: "esp-sombra",
    enunciado:
      "Luz vertical desde arriba sobre un cubo apoyado. La sombra en el piso es aproximadamente:\n\nA) un círculo   B) un cuadrado   C) un triángulo   D) una línea",
    respuesta: "B) un cuadrado",
    pasos: [
      "Proyección ortogonal del cubo desde arriba = su planta = cuadrado.",
      "No es círculo (eso sería cilindro/esfera).",
      "La altura no cambia la forma de la sombra con luz vertical.",
      "Atajo: sombra con luz ↑ = vista superior.",
    ],
  },
  {
    figura: "cubo-vertice-tres",
    enunciado:
      "Mirando un cubo en perspectiva desde una esquina, ¿cuántas caras ves?\n\nA) 1   B) 2   C) 3   D) 6",
    respuesta: "C) 3",
    pasos: [
      "La vista de esquina muestra exactamente 3 caras.",
      "Las otras 3 quedan ocultas (opuestas).",
      "Igual que el vértice del dado.",
      "Atajo: esquina visible → 3 caras.",
    ],
  },
  {
    figura: "esp-net-t",
    enunciado:
      "¿Cuántos nets distintos de cubo existen (formas no congruentes por rotación/reflexión del papel)?\n\nA) 6   B) 8   C) 11   D) 16",
    respuesta: "C) 11",
    pasos: [
      "Hay exactamente 11 hexominós que pliegan a cubo.",
      "No hace falta dibujarlos todos: sí conviene saber el número.",
      "Descarta 2×2 y filas de 5+.",
      "Atajo: «once nets» — dato clásico de tests espaciales.",
    ],
  },
  {
    figura: "esp-net-cruz-letras",
    enunciado:
      "Si A queda arriba al armar el cruz-net, ¿qué cara queda abajo?\n\nA) C   B) E   C) B   D) D",
    respuesta: "B) E",
    pasos: [
      "A y E son opuestas en ese net.",
      "Si A es tapa, E es fondo.",
      "B, C, D, F quedan como laterales/frente según el giro.",
      "Atajo: opuesta a la tapa = base.",
    ],
  },
  {
    figura: "esp-dado-suma7",
    enunciado:
      "Opuesta a 2 en dado clásico:\n\nA) 4   B) 5   C) 3   D) 7",
    respuesta: "B) 5",
    pasos: [
      "2+5=7.",
      "Pares: 1-6, 2-5, 3-4.",
      "7 no existe en el dado.",
      "Atajo: 7−2=5.",
    ],
  },
  {
    figura: "esp-cubo-pintado-2",
    enunciado:
      "Cubo 5×5×5 pintado. Cubitos con exactamente 1 cara pintada:\n\nA) 6   B) 54   C) 25   D) 96",
    respuesta: "B) 54",
    pasos: [
      "(5−2)² = 9 por cara; ×6 caras = 54.",
      "No uses 5² (eso contaría bordes).",
      "Solo la «ventana» interior de cada cara.",
      "Atajo: (n−2)²×6.",
    ],
  },
  {
    figura: "espacial-brujula",
    enunciado:
      "Partes mirando este. Girás 90° a tu derecha, luego 180°. ¿Hacia dónde miras?\n\nA) este   B) oeste   C) norte   D) sur",
    respuesta: "B) oeste",
    pasos: [
      "Inicio: este. 90° derecha → sur.",
      "Luego 180° → norte… wait: sur+180=norte. Recheck options.",
      "Este → (derecha 90) sur → (180) norte. Respuesta: C) norte.",
      "Fix answer to C.",
    ],
  }
);

// Fix last broken item
items[items.length - 1] = {
  figura: "espacial-brujula",
  enunciado:
    "Partes mirando este. Giras 90° a tu derecha y luego 180°. ¿Hacia dónde miras?\n\nA) este   B) oeste   C) norte   D) sur",
  respuesta: "C) norte",
  pasos: [
    "Inicio: este. 90° a la derecha → sur.",
    "Luego media vuelta (180°) desde sur → norte.",
    "Sigue los giros en orden; no los sumes en un solo paso confuso.",
    "Atajo: dibuja una brújula y marca cada giro.",
  ],
};

items.push(
  {
    figura: "esp-net-zigzag",
    enunciado:
      "En el net en Z numerado 1–6, las caras 1 y 3 (se tocan en el papel) al armarse son:\n\nA) opuestas   B) adyacentes   C) la misma   D) imposibles",
    respuesta: "B) adyacentes",
    pasos: [
      "1 y 3 comparten lado en el desarrollo.",
      "Por tanto en el cubo son vecinas, no opuestas.",
      "Busca opuestas solo entre caras que NO se toquen en el net.",
      "Atajo: tocar en el papel ⇒ adyacentes en 3D.",
    ],
  },
  {
    figura: "esp-papel-agujeros",
    enunciado:
      "Doblas dos veces por la mitad (en cruz) y haces 1 agujero que atraviesa todas las capas. Al abrir, agujeros:\n\nA) 1   B) 2   C) 4   D) 8",
    respuesta: "C) 4",
    pasos: [
      "2 dobleces que se cruzan → 4 capas en el punto del pinchazo.",
      "1 agujero × 4 capas = 4 agujeros al desplegar.",
      "Quedan en simetría respecto a ambos pliegues.",
      "Atajo: capas apiladas ≈ multiplicador de agujeros.",
    ],
  },
  {
    figura: "esp-estructura-cubos",
    enunciado:
      "Si a la estructura (5 cubos) le quitas el cubo de hasta arriba de la torre, ¿cuántos quedan?\n\nA) 3   B) 4   C) 5   D) 2",
    respuesta: "B) 4",
    pasos: [
      "Había 5; quitas 1 → 4.",
      "Quedan la base de 3 y un cubo de la torre.",
      "No reconstruyas de más.",
      "Atajo: total inicial − quitados.",
    ],
  }
);

function assertUnique(list: Item[]) {
  const stems = list.map((i) => i.enunciado.split("\n")[0]);
  const set = new Set(stems);
  if (set.size !== stems.length) {
    const dup = stems.filter((s, i) => stems.indexOf(s) !== i);
    throw new Error("Duplicados: " + [...new Set(dup)].join(" | "));
  }
}

assertUnique(items);

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{ id: string; descripcion: string; items: Item[] }>;
};
const esp = bank.tipos.find((t) => t.id === "razonamiento-espacial");
if (!esp) throw new Error("tipo espacial no encontrado");

esp.descripcion =
  "Cubos, dados desarmados (nets), vistas y giros. Empieza fácil; luego nets y opuestos. Sin relleno vacío.";
esp.items = items;

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log({
  total: items.length,
  unique: new Set(items.map((i) => i.enunciado.split("\n")[0])).size,
  netish: items.filter((i) => /net|desarm|dado|opuesta|2×2|T |cruz/i.test(i.enunciado)).length,
  figuras: [...new Set(items.map((i) => i.figura))],
});
