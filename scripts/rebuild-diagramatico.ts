/**
 * Reescribe razonamiento-diagramático: sin repeticiones, dificultad progresiva.
 * Uso: npx tsx scripts/rebuild-diagramatico.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura: string };

const items: Item[] = [
  // —— Nivel 1: bases (fáciles) ——
  {
    figura: "diag-giro-90",
    enunciado:
      "Regla: gira 90° horario. Si ahora apunta arriba, el siguiente apunta:\n\nA) igual   B) izquierda   C) derecha (▶)   D) abajo",
    respuesta: "C) derecha (▶)",
    pasos: [
      "Giro horario 90° = un cuarto de vuelta a la derecha (como el reloj).",
      "Ciclo: arriba → derecha → abajo → izquierda → arriba.",
      "Desde arriba, el siguiente es derecha.",
      "Atajo: antihorario sería al revés (arriba → izquierda).",
    ],
  },
  {
    figura: "diag-puntos",
    enunciado:
      "Puntos en figuras: 2, 3, 5, 8, 12, ?. ¿Cuántos puntos siguen?\n\nA) 16   B) 19   C) 17   D) 24",
    respuesta: "C) 17",
    pasos: [
      "Mira las diferencias: 2→3 (+1), 3→5 (+2), 5→8 (+3), 8→12 (+4).",
      "Los saltos crecen de 1 en 1; el siguiente es +5.",
      "12 + 5 = 17.",
      "Atajo: anota siempre las diferencias antes de adivinar el patrón.",
    ],
  },
  {
    figura: "diag-bn",
    enunciado:
      "Fila: blanco, negro, blanco, negro… El 7.º es:\n\nA) negro   B) gris   C) blanco   D) no se sabe",
    respuesta: "C) blanco",
    pasos: [
      "Solo hay 2 colores que alternan.",
      "1ª blanca → impares = blanco; pares = negro.",
      "7 es impar → blanco.",
      "Atajo: posición impar = color de la 1ª.",
    ],
  },
  {
    figura: "diag-tamanos",
    enunciado:
      "Ciclo de tamaños: grande → mediana → pequeña → (repite). La 4.ª es:\n\nA) mediana   B) grande   C) pequeña   D) vacía",
    respuesta: "B) grande",
    pasos: [
      "Ciclo de 3: G → M → P → G…",
      "Posición 4 = misma que la 1 → grande.",
      "Cuenta con dedos: 1G 2M 3P 4G.",
      "Atajo: resto al dividir entre 3 (4÷3 sobra 1 → como la 1ª).",
    ],
  },
  {
    figura: "diag-mas-menos",
    enunciado:
      "Alterna ⊕ ⊖ ⊕ ⊖… Si el 5.º es ⊕, el 6.º es:\n\nA) ⊕   B) ⊗   C) ⊖   D) igual siempre",
    respuesta: "C) ⊖",
    pasos: [
      "Solo dos símbolos que se turnan.",
      "Si el 5.º es ⊕, el siguiente (6.º) es el contrario: ⊖.",
      "No inventes un tercer símbolo.",
      "Atajo: consecutivo = siempre el opuesto del anterior.",
    ],
  },
  {
    figura: "diag-letras",
    enunciado:
      "Matriz: A→C (+2 letras), B→?. Misma regla:\n\nA) e   B) f   C) a   D) d",
    respuesta: "D) d",
    pasos: [
      "No es una matriz de números: es un salto en el abecedario.",
      "A→C salta 2 letras (A→B→C).",
      "B con el mismo salto: B→C→D.",
      "Atajo: A=1…C=3; 1+2=3 y 2+2=4 → D.",
    ],
  },

  // —— Nivel 2: una regla más clara / series ——
  {
    figura: "ciclo-flechas-90",
    enunciado:
      "Serie de flechas: cada paso gira 90° horario. Si la 1ª apunta ↑, la 5ª apunta:\n\nA) ↑   B) →   C) ↓   D) ←",
    respuesta: "A) ↑",
    pasos: [
      "Cada paso = +90° horario. Ciclo de 4 posiciones.",
      "1↑ 2→ 3↓ 4← 5↑ (vuelve al inicio).",
      "La 5ª = misma que la 1ª.",
      "Atajo: posición mod 4; resto 1 → como la 1ª.",
    ],
  },
  {
    figura: "serie-triangulo-puntos",
    enunciado:
      "En cada figura: el triángulo gira 90° horario y suma 1 punto. Tras la 4ª (4 puntos), la 5ª tiene:\n\nA) 4 puntos y misma orientación que la 1ª   B) 5 puntos y orientación de la 1ª   C) 5 puntos y orientación de la 2ª   D) 3 puntos",
    respuesta: "B) 5 puntos y orientación de la 1ª",
    pasos: [
      "Dos reglas a la vez: +1 punto y giro 90° horario.",
      "Puntos: 1→2→3→4→5.",
      "Giro: tras 4 giros de 90° (=360°) vuelve a la orientación de la 1ª.",
      "Atajo: puntos = número de paso; orientación cicla cada 4.",
    ],
  },
  {
    figura: "diag-lados",
    enunciado:
      "Serie de polígonos: 3 lados, 4 lados, 5 lados… El siguiente tiene:\n\nA) 5   B) 6   C) 7   D) 8",
    respuesta: "B) 6",
    pasos: [
      "Cuenta lados: triángulo(3) → cuadrado(4) → pentágono(5).",
      "Siguiente = hexágono = 6 lados.",
      "Sube de 1 en 1.",
      "Atajo: ignora el dibujo «bonito» y cuenta solo lados/puntas.",
    ],
  },
  {
    figura: "diag-punto-esquina",
    enunciado:
      "Un punto negro recorre las esquinas de un cuadrado en sentido horario. Si va: esquina superior-izq → superior-der → inferior-der, la siguiente es:\n\nA) superior-izq   B) inferior-izq   C) centro   D) superior-der",
    respuesta: "B) inferior-izq",
    pasos: [
      "Horario en un cuadrado: SI → SD → ID → II → SI…",
      "Vas en inferior-derecha; el siguiente es inferior-izquierda.",
      "No saltes al centro: el marcador va por el borde.",
      "Atajo: dibuja las 4 esquinas y avanza una por paso.",
    ],
  },
  {
    figura: "diag-impar",
    enunciado:
      "Cuatro círculos A B C D. Tres están vacíos y uno relleno. ¿Cuál no encaja?\n\nA) A   B) B   C) C   D) D",
    respuesta: "C) C",
    pasos: [
      "Odd-one-out: busca la regla que cumplen tres.",
      "A, B y D vacíos; C relleno → C rompe la regla.",
      "La forma es igual; lo que cambia es el relleno.",
      "Atajo: revisa forma, tamaño, relleno, orientación —uno basta.",
    ],
  },
  {
    figura: "diag-analogia",
    enunciado:
      "Analogía: cuadrado vacío es a cuadrado relleno como círculo vacío es a:\n\nA) cuadrado vacío   B) círculo relleno   C) triángulo   D) círculo vacío",
    respuesta: "B) círculo relleno",
    pasos: [
      "Traduce A→B: solo cambió el relleno (vacío→lleno); la forma se mantuvo.",
      "Aplica lo mismo a C: círculo vacío → círculo relleno.",
      "No cambies la forma (no pases a cuadrado).",
      "Atajo: «mismo cambio, misma categoría».",
    ],
  },
  {
    figura: "diag-simetria",
    enunciado:
      "¿Cuál figura tiene simetría vertical (espejo izquierda-derecha)?\n\nA) A (triángulo irregular)   B) B (rectángulo con eje al medio)   C) C (forma torcida)   D) ninguna",
    respuesta: "B) B (rectángulo con eje al medio)",
    pasos: [
      "Simetría vertical: si doblas por el eje del medio, las mitades coinciden.",
      "El rectángulo B tiene ese eje dibujado/claro.",
      "A y C quedan distintas al doblar.",
      "Atajo: imagina el espejo en el centro y compara bordes.",
    ],
  },
  {
    figura: "diag-letras",
    enunciado:
      "Serie de letras con figura: C, F, I, L, ?. Siguiente:\n\nA) M   B) N   C) O   D) P",
    respuesta: "C) O",
    pasos: [
      "Pasa a números: C=3, F=6, I=9, L=12 → van de +3.",
      "12+3=15 → O.",
      "No es +1 del abecedario; el salto es constante +3.",
      "Atajo: si las letras «saltan», mide el salto en números.",
    ],
  },
  {
    figura: "diag-bn",
    enunciado:
      "Patrón de 3: blanco, gris, negro, blanco, gris, negro… El 8.º es:\n\nA) blanco   B) gris   C) negro   D) no se sabe",
    respuesta: "B) gris",
    pasos: [
      "Ciclo de 3 colores: B G N B G N…",
      "Posición 8: 8÷3 = 2 ciclos y sobra 2 → mismo que la 2ª = gris.",
      "1B 2G 3N 4B 5G 6N 7B 8G.",
      "Atajo: resto 1→1º color, resto 2→2º, resto 0→3º.",
    ],
  },

  // —— Nivel 3: dos reglas / matrices / operadores ——
  {
    figura: "diag-doble-regla",
    enunciado:
      "Cada paso: el cuadrado gira 45° horario y alterna relleno (vacío↔lleno). Tras vacío a 0°, el 4.º paso (índice 3) queda:\n\nA) vacío a 135°   B) lleno a 135°   C) vacío a 90°   D) lleno a 45°",
    respuesta: "B) lleno a 135°",
    pasos: [
      "Regla 1 — giro: 0° → 45° → 90° → 135°.",
      "Regla 2 — relleno: vacío, lleno, vacío, lleno… (índice 0 vacío → índice 3 lleno).",
      "Ambas deben cumplirse: 135° y lleno.",
      "Atajo: resuelve giro y relleno por separado; luego junta.",
    ],
  },
  {
    figura: "matriz-puntos",
    enunciado:
      "Matriz 3×3: el número = fila×columna (1,2,3). El relleno oscurece de izq a der. ¿Qué va en la celda inferior derecha?\n\nA) 6 claro   B) 9 oscuro   C) 9 claro   D) 3 oscuro",
    respuesta: "B) 9 oscuro",
    pasos: [
      "Números: fila3×col3 = 9.",
      "Relleno: columnas blanco → gris → negro (la 3ª es la más oscura).",
      "Falta 9 en negro/oscuro.",
      "Atajo: no mezcles la regla del número con la del color.",
    ],
  },
  {
    figura: "diag-matriz-suma",
    enunciado:
      "En cada fila, la 3ª celda es la suma de las dos primeras. ¿Qué va en el ?\n\nA) 8   B) 10   C) 12   D) 9",
    respuesta: "B) 10",
    pasos: [
      "Fila 1: 2+3=5. Fila 2: 4+1=5. Se cumple la suma.",
      "Fila 3: 6+4 = 10.",
      "Comprueba también columnas si dudas; aquí la fila basta.",
      "Atajo matriz: prueba suma, resta o producto en filas y columnas.",
    ],
  },
  {
    figura: "diag-operador",
    enunciado:
      "Operador desconocido. Ejemplo: triángulo negro ↑ pasa a triángulo blanco ↓. Si entra cuadrado negro →, sale:\n\nA) cuadrado blanco ←   B) cuadrado negro ←   C) círculo blanco →   D) cuadrado blanco →",
    respuesta: "A) cuadrado blanco ←",
    pasos: [
      "Del ejemplo: (1) invierte relleno negro↔blanco y (2) gira 180° (↑→↓).",
      "Cuadrado negro → : relleno → blanco; flecha/orientación 180° → ←.",
      "La forma (cuadrado) se mantiene.",
      "Atajo: lista los cambios del ejemplo y aplícalos uno por uno.",
    ],
  },
  {
    figura: "diagramatico-ordenes",
    enunciado:
      "Orden «invertir»: la fila se lee al revés. Entrada □ △ ○. Salida:\n\nA) □ △ ○   B) ○ △ □   C) △ □ ○   D) ○ □ △",
    respuesta: "B) ○ △ □",
    pasos: [
      "Invertir = primer elemento ↔ último.",
      "□ △ ○ al revés = ○ △ □.",
      "El del medio se queda en el medio.",
      "Atajo: escribe 1-2-3 y cámbialo a 3-2-1.",
    ],
  },
  {
    figura: "diag-xor",
    enunciado:
      "Combinación: A tiene círculo+cuadrado; B tiene cuadrado+triángulo. Lo común se cancela. ¿Qué queda?\n\nA) círculo+cuadrado   B) solo cuadrado   C) círculo+triángulo   D) nada",
    respuesta: "C) círculo+triángulo",
    pasos: [
      "Regla tipo XOR: lo que está en ambos desaparece; lo único permanece.",
      "Cuadrado está en A y B → se cancela.",
      "Quedan círculo (solo A) y triángulo (solo B).",
      "Atajo: tacha mentalmente las piezas repetidas.",
    ],
  },
  {
    figura: "diag-borde-anillo",
    enunciado:
      "Serie: cuadrado exterior fijo; el círculo interior crece y en el 2.º paso se rellena. El 4.º paso (siguiente tras el 3.º) debe:\n\nA) círculo más grande y vacío   B) círculo más pequeño relleno   C) sin círculo   D) cuadrado relleno",
    respuesta: "A) círculo más grande y vacío",
    pasos: [
      "Exterior (cuadrado) no cambia.",
      "Interior: tamaño crece cada paso; relleno alterna vacío/lleno/vacío…",
      "Tras el 3.º (más grande vacío o según serie), el 4.º sigue creciendo y toca vacío si el patrón de relleno es alterno empezando vacío.",
      "Atajo: separa «anillo exterior» de «figura interior».",
    ],
  },
  {
    figura: "diag-posiciones",
    enunciado:
      "Una ficha recorre los 4 cuadrantes en sentido horario partiendo del superior-izquierdo. Tras 5 pasos (la 6.ª posición contando el inicio como 0), ¿dónde está?\n\nA) superior-izq   B) superior-der   C) inferior-der   D) inferior-izq",
    respuesta: "B) superior-der",
    pasos: [
      "Cuadrantes horario: SI → SD → ID → II → SI…",
      "Inicio = paso 0 en SI. Tras 5 avances: 5 mod 4 = 1 → SD.",
      "Ciclo de 4; solo importa el resto.",
      "Atajo: numera 0,1,2,3 y usa módulo 4.",
    ],
  },
  {
    figura: "diag-180-color",
    enunciado:
      "Cada paso la flecha gira 180° y el fondo alterna claro/oscuro. Si empiezas flecha ↑ en claro, tras 2 pasos tienes:\n\nA) ↑ claro   B) ↑ oscuro   C) ↓ claro   D) ↓ oscuro",
    respuesta: "A) ↑ claro",
    pasos: [
      "Giro 180° dos veces = 360° → misma dirección ↑.",
      "Fondo: claro → oscuro → claro (2 cambios = vuelve a claro).",
      "Resultado: ↑ en claro.",
      "Atajo: par de pasos de 180° = orientación inicial; par de alternancias = color inicial.",
    ],
  },
  {
    figura: "diag-conteo",
    enunciado:
      "En la figura (triángulo grande partido por una altura y una línea media), ¿cuántos triángulos hay en total?\n\nA) 3   B) 4   C) 5   D) 6",
    respuesta: "D) 6",
    pasos: [
      "Cuenta por tamaños: 1 grande + 2 medianos (mitades) + pequeños creados por la línea media.",
      "Con altura y transversal típica salen 6 triángulos.",
      "Marca cada uno para no contar dos veces ni dejar fuera.",
      "Atajo: grande → mitades → trozos chicos.",
    ],
  },

  // —— Nivel 4: más exigentes ——
  {
    figura: "ciclo-flechas-90",
    enunciado:
      "Serie: giro 90° antihorario cada paso + número de marcas en el borde (0,1,2,3…). Si la 1ª está a 0° con 0 marcas, la 3ª (paso 2) queda:\n\nA) 180° con 2 marcas   B) 90° con 2 marcas   C) 270° con 2 marcas   D) 180° con 1 marca",
    respuesta: "A) 180° con 2 marcas",
    pasos: [
      "Antihorario 90° por paso: 0° → 270° → 180° (en el paso 2).",
      "Marcas = número de paso: 0, 1, 2 → en el paso 2 hay 2 marcas.",
      "Junta ambas reglas: 180° y 2 marcas.",
      "Atajo: tabla de dos columnas (ángulo | marcas).",
    ],
  },
  {
    figura: "diag-matriz-suma",
    enunciado:
      "Matriz: en cada fila el producto de las dos primeras da la tercera. Fila: 3, 4, ?. Valor de ?:\n\nA) 7   B) 12   C) 1   D) 34",
    respuesta: "B) 12",
    pasos: [
      "Si la regla es producto: 3×4=12.",
      "Descarta suma (daría 7) si el resto de la matriz usa productos.",
      "Comprueba otra fila del enunciado/figura antes de marcar.",
      "Atajo: prueba +, × y − en ese orden mental.",
    ],
  },
  {
    figura: "diag-xor",
    enunciado:
      "Tercera figura = (primera XOR segunda): piezas que no se repiten. 1ª: ●■  2ª: ■▲  3ª:\n\nA) ●■▲   B) ■   C) ●▲   D) vacía",
    respuesta: "C) ●▲",
    pasos: [
      "■ está en ambas → se cancela.",
      "● solo en la 1ª; ▲ solo en la 2ª → ambos quedan.",
      "Resultado ●▲.",
      "Atajo: «unión menos intersección».",
    ],
  },
  {
    figura: "diag-operador",
    enunciado:
      "Dos operadores en serie: (1) girar 90° horario (2) invertir relleno. Entrada: triángulo blanco ↑. Salida:\n\nA) triángulo negro →   B) triángulo blanco →   C) triángulo negro ↑   D) triángulo negro ←",
    respuesta: "A) triángulo negro →",
    pasos: [
      "Aplica en orden: primero giro, luego relleno.",
      "↑ +90° horario → apunta a la derecha →.",
      "Blanco invertido → negro.",
      "Atajo: nunca mezcles el orden de los operadores.",
    ],
  },
  {
    figura: "diag-punto-esquina",
    enunciado:
      "El punto avanza 1 esquina horario cada paso, pero cada 2 pasos también cambia de negro a blanco (y viceversa). Tras 4 pasos desde SI negro, está en:\n\nA) SI blanco   B) SI negro   C) SD blanco   D) II negro",
    respuesta: "A) SI blanco",
    pasos: [
      "Posición: 4 pasos horario = vuelta completa → misma esquina SI.",
      "Color: cambia cada 2 pasos → en 4 pasos cambia 2 veces → vuelve… espera: cada 2 pasos un cambio: tras paso 2 cambia, tras paso 4 cambia otra vez → 2 cambios desde negro = blanco? Negro→(2)blanco→(4)negro. Hmm.",
      "Releer: «cada 2 pasos cambia». Tras 2 pasos: 1 cambio (negro→blanco). Tras 4: 2 cambios (blanco→negro). Entonces SI negro.",
      "Corrección: 2 cambios → color original. Respuesta coherente: SI negro. Ajustamos opciones: B.",
    ],
  },
];

// Fix the last item - I made a mess in pasos. Let me redefine it properly in the array.
// I'll fix by replacing the last item after the array... actually rewrite the end of the array cleanly.

function assertUnique(list: Item[]) {
  const stems = list.map((i) => i.enunciado.split("\n")[0]);
  const set = new Set(stems);
  if (set.size !== stems.length) {
    const dup = stems.filter((s, i) => stems.indexOf(s) !== i);
    throw new Error("Duplicados: " + [...new Set(dup)].join(" | "));
  }
}

// Replace broken last item and append more clean hard items
items.pop();
items.push(
  {
    figura: "diag-punto-esquina",
    enunciado:
      "El punto avanza 1 esquina en horario cada paso y cambia de color cada 2 pasos (negro↔blanco). Parte en SI negro. Tras 4 pasos está en:\n\nA) SI blanco   B) SI negro   C) SD blanco   D) II negro",
    respuesta: "B) SI negro",
    pasos: [
      "4 avances horario = una vuelta → vuelve a SI.",
      "Color cambia en el paso 2 y en el 4: negro→blanco→negro.",
      "Queda SI negro.",
      "Atajo: posición con mod 4; color con «cada 2 pasos».",
    ],
  },
  {
    figura: "diag-posiciones",
    enunciado:
      "La ficha salta dos cuadrantes en horario cada vez (SI→ID→SI…). Tras partir de SI, la 3.ª posición (2 saltos) es:\n\nA) SI   B) SD   C) ID   D) II",
    respuesta: "A) SI",
    pasos: [
      "Salto de 2 en ciclo de 4: SI(0) → ID(2) → SI(4≡0).",
      "Tras 2 saltos vuelves a SI.",
      "Es un ciclo de 2 posiciones (pares).",
      "Atajo: +2 mod 4.",
    ],
  },
  {
    figura: "diag-conteo",
    enunciado:
      "Si solo cuentas triángulos que apuntan hacia arriba en esa figura partida, ¿cuántos hay?\n\nA) 1   B) 2   C) 3   D) 4",
    respuesta: "C) 3",
    pasos: [
      "El grande apunta arriba; además hay pequeños/medios que también apuntan arriba.",
      "Los que apuntan abajo no entran en esta pregunta.",
      "Total típico hacia arriba en esta partición: 3.",
      "Atajo: filtra por orientación antes de sumar.",
    ],
  },
  {
    figura: "diag-lados",
    enunciado:
      "Serie: cada figura gana 1 lado y pierde el relleno si lo tenía (alterna). 3 vacío → 4 lleno → 5 vacío → ?. Siguiente:\n\nA) 6 vacío   B) 6 lleno   C) 5 lleno   D) 7 lleno",
    respuesta: "B) 6 lleno",
    pasos: [
      "Lados: 3→4→5→6.",
      "Relleno: vacío, lleno, vacío, lleno…",
      "Siguiente: 6 lados y lleno.",
      "Atajo: dos columnas otra vez (lados | relleno).",
    ],
  },
  {
    figura: "diag-analogia",
    enunciado:
      "Analogía: ▲↑ : ▲→ :: ■↑ : ?\n\nA) ■↑   B) ■→   C) ▲→   D) ■↓",
    respuesta: "B) ■→",
    pasos: [
      "A→B: el triángulo giró 90° horario; la forma se mantuvo.",
      "Aplica a ■↑: gira 90° horario → ■→.",
      "No cambies a triángulo.",
      "Atajo: identifica el operador (aquí solo rotación).",
    ],
  },
  {
    figura: "ciclo-flechas-90",
    enunciado:
      "Flechas en ciclo horario de 90°. ¿Cuántos pasos mínimos para volver a la orientación inicial?\n\nA) 2   B) 3   C) 4   D) 8",
    respuesta: "C) 4",
    pasos: [
      "90°×4 = 360° = una vuelta completa.",
      "Por eso el ciclo tiene 4 figuras distintas y luego repite.",
      "Con 180° el ciclo sería de 2; aquí es 90° → 4.",
      "Atajo: 360 ÷ ángulo del paso.",
    ],
  },
  {
    figura: "diag-simetria",
    enunciado:
      "Si reflejas la figura B (rectángulo) en un espejo vertical, el resultado:\n\nA) cambia por completo   B) se ve igual   C) gira 90°   D) se pone de cabeza",
    respuesta: "B) se ve igual",
    pasos: [
      "B ya es simétrica respecto al eje vertical.",
      "Su reflejo vertical coincide con ella misma.",
      "No necesita «verse distinta» tras el espejo.",
      "Atajo: si tiene simetría vertical, espejo vertical = misma figura.",
    ],
  },
  {
    figura: "matriz-puntos",
    enunciado:
      "En la matriz, ¿qué regla explica mejor los números 1 2 3 / 2 4 6 / 3 6 ?\n\nA) suma de vecinos   B) fila × columna   C) siempre pares   D) números aleatorios",
    respuesta: "B) fila × columna",
    pasos: [
      "Fila1: 1×1,1×2,1×3. Fila2: 2×1,2×2,2×3. Fila3: 3×1,3×2 → falta 3×3.",
      "Encaja perfecto con fila×columna.",
      "La suma de vecinos no reproduce toda la grilla.",
      "Atajo: prueba productos fila/columna en matrices numéricas.",
    ],
  },
  {
    figura: "diag-borde-anillo",
    enunciado:
      "Exterior siempre cuadrado; interior cicla ○ → △ → □ → ○… Si ahora el interior es △, el siguiente interior es:\n\nA) ○   B) △   C) □   D) hexágono",
    respuesta: "C) □",
    pasos: [
      "Ciclo de 3 formas interiores: círculo → triángulo → cuadrado → círculo…",
      "Después de △ sigue □.",
      "El exterior no cambia la respuesta.",
      "Atajo: memoriza solo el ciclo del interior.",
    ],
  },
  {
    figura: "diagramatico-ordenes",
    enunciado:
      "Dos órdenes seguidos: (1) invertir (2) invertir otra vez. Entrada □ △ ○. Salida final:\n\nA) ○ △ □   B) □ △ ○   C) △ ○ □   D) ○ □ △",
    respuesta: "B) □ △ ○",
    pasos: [
      "Invertir dos veces = volver al original.",
      "□ △ ○ → ○ △ □ → □ △ ○.",
      "Cualquier operador «involutivo» dos veces anula el efecto.",
      "Atajo: si la operación es su propia inversa, ×2 = identidad.",
    ],
  },
  {
    figura: "diag-impar",
    enunciado:
      "Odd-one-out: cuatro flechas; tres apuntan arriba y una apunta abajo. ¿Cuál no sigue la regla de las demás?\n\nA) la más grande   B) la que apunta abajo   C) la del medio   D) ninguna",
    respuesta: "B) la que apunta abajo",
    pasos: [
      "La propiedad común de tres es la orientación hacia arriba.",
      "La que apunta abajo rompe esa regla.",
      "Tamaño o posición no bastan si solo una orientación difiere.",
      "Atajo: pregunta «¿qué tienen en común exactamente tres?».",
    ],
  },
  {
    figura: "serie-triangulo-puntos",
    enunciado:
      "Si en cada paso sumas 1 punto pero giras 180° (no 90°), ¿cada cuántos pasos se repite la misma orientación?\n\nA) cada 1   B) cada 2   C) cada 4   D) nunca",
    respuesta: "B) cada 2",
    pasos: [
      "180°×2 = 360° → orientación inicial cada 2 pasos.",
      "Los puntos siguen creciendo; solo la orientación cicla en 2.",
      "Distinto del ciclo de 4 cuando el giro es 90°.",
      "Atajo: periodo = 360 / ángulo.",
    ],
  },
  {
    figura: "diag-180-color",
    enunciado:
      "Reglas independientes: giro 180° cada paso; color cambia solo en pasos impares. Inicio ↑ claro. Tras 3 pasos:\n\nA) ↓ claro   B) ↓ oscuro   C) ↑ claro   D) ↑ oscuro",
    respuesta: "B) ↓ oscuro",
    pasos: [
      "Giro: 3×180° = 540° = 180° neto → ↓.",
      "Color en pasos 1 y 3 (impares): 2 cambios → claro→oscuro→claro? Paso1 cambia, paso2 no, paso3 cambia → 2 cambios = vuelve a claro. Recalcular.",
      "Inicio claro. Tras paso1 (impar): oscuro. Paso2 (par): sin cambio oscuro. Paso3 (impar): claro. Entonces ↓ claro → A.",
      "Ajustado: respuesta A) ↓ claro.",
    ],
  },
);

// Fix the last broken item properly
items[items.length - 1] = {
  figura: "diag-180-color",
  enunciado:
    "Reglas independientes: giro 180° cada paso; el color solo cambia en pasos impares. Inicio ↑ claro. Tras 3 pasos:\n\nA) ↓ claro   B) ↓ oscuro   C) ↑ claro   D) ↑ oscuro",
  respuesta: "A) ↓ claro",
  pasos: [
    "Orientación: 3×180° = media vuelta neta → ↓.",
    "Color: cambia en paso 1 y 3 (no en el 2): claro→oscuro→oscuro→claro.",
    "Queda ↓ claro.",
    "Atajo: aplica cada regla en su propio calendario de pasos.",
  ],
};

items.push(
  {
    figura: "diag-matriz-suma",
    enunciado:
      "En cada columna, la celda de abajo es el doble de la de arriba. Arriba hay 3; abajo debe ser:\n\nA) 3   B) 5   C) 6   D) 9",
    respuesta: "C) 6",
    pasos: [
      "Regla de columna: abajo = 2× arriba.",
      "2×3 = 6.",
      "Si también miras filas, confirma que no contradice.",
      "Atajo: en matrices, prueba filas Y columnas.",
    ],
  },
  {
    figura: "diag-operador",
    enunciado:
      "Operador R = girar 90° horario; operador I = invertir relleno. Orden I luego R. Entrada: ■↑ (cuadrado negro arriba). Salida:\n\nA) □→   B) ■→   C) □↑   D) □←",
    respuesta: "A) □→",
    pasos: [
      "Primero I: negro→blanco (□) sigue ↑.",
      "Luego R: □↑ gira 90° horario → □→.",
      "Orden I→R ≠ R→I (el resultado puede cambiar).",
      "Atajo: escribe el estado tras cada operador.",
    ],
  },
  {
    figura: "diag-xor",
    enunciado:
      "Si A∪B tiene 4 piezas distintas y A∩B tiene 1, ¿cuántas quedan tras cancelar la intersección (XOR)?\n\nA) 1   B) 2   C) 3   D) 4",
    respuesta: "C) 3",
    pasos: [
      "|A XOR B| = |A∪B| − |A∩B| = 4 − 1 = 3.",
      "Es la cantidad de piezas que no se comparten.",
      "No confundas con la unión (4) ni solo la intersección (1).",
      "Atajo: XOR = unión menos lo común.",
    ],
  },
  {
    figura: "diag-conteo",
    enunciado:
      "En la figura partida, si cuentas TODOS los triángulos (arriba y abajo), el total es:\n\nA) 3   B) 4   C) 5   D) 6",
    respuesta: "D) 6",
    pasos: [
      "Incluye el grande, las mitades y los trozos pequeños.",
      "No te quedes solo con los que apuntan arriba.",
      "Marca cada triángulo para no repetir ni omitir: total 6.",
      "Atajo: grande → medianos → pequeños.",
    ],
  },
  {
    figura: "diag-doble-regla",
    enunciado:
      "Serie doble: +45° horario cada paso y relleno alterno empezando vacío. ¿Qué tiene el 5.º frame (índice 4)?\n\nA) 180° vacío   B) 180° lleno   C) 135° vacío   D) 90° lleno",
    respuesta: "A) 180° vacío",
    pasos: [
      "Ángulos: 0, 45, 90, 135, 180 → el 5.º está a 180°.",
      "Relleno índice 0 vacío, 1 lleno, 2 vacío, 3 lleno, 4 vacío.",
      "180° y vacío.",
      "Atajo: resuelve ángulo y relleno en dos columnas.",
    ],
  },
  {
    figura: "diag-letras",
    enunciado:
      "Serie: Z, X, V, T, ?. Siguiente letra:\n\nA) S   B) R   C) Q   D) P",
    respuesta: "B) R",
    pasos: [
      "Va hacia atrás de 2 en 2: Z→X (-2), X→V (-2), V→T (-2).",
      "T−2 = R.",
      "No es el abecedario normal hacia adelante.",
      "Atajo: convierte a número (Z=26) y resta 2.",
    ],
  },
  {
    figura: "diag-analogia",
    enunciado:
      "Analogía: ○ pequeño : ○ grande :: ■ pequeño : ?\n\nA) ○ grande   B) ■ grande   C) ■ pequeño   D) ▲ grande",
    respuesta: "B) ■ grande",
    pasos: [
      "El cambio es solo de tamaño (pequeño→grande); la forma se mantiene.",
      "■ pequeño → ■ grande.",
      "No cambies a círculo ni a triángulo.",
      "Atajo: aísla la variable que cambió en el ejemplo.",
    ],
  },
  {
    figura: "ciclo-flechas-90",
    enunciado:
      "Si la flecha gira 90° antihorario cada paso y ahora apunta →, después de 3 pasos apuntará:\n\nA) →   B) ↑   C) ←   D) ↓",
    respuesta: "D) ↓",
    pasos: [
      "Antihorario (contrario al reloj): → → ↑ → ← → ↓.",
      "Paso 1: ↑. Paso 2: ←. Paso 3: ↓.",
      "Tras 3 pasos queda ↓.",
      "Atajo: dibuja el ciclo antihorario de 4 y cuenta 3 marcas.",
    ],
  }
);

assertUnique(items);

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{ id: string; nombre: string; descripcion: string; items: Item[] }>;
};
const diag = bank.tipos.find((t) => t.id === "razonamiento-diagramatico");
if (!diag) throw new Error("tipo no encontrado");

diag.descripcion =
  "Series, matrices, analogías y operadores con figura. Empieza fácil; luego sube la dificultad. Sin repeticiones.";
diag.items = items;

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log({
  total: items.length,
  unique: new Set(items.map((i) => i.enunciado.split("\n")[0])).size,
  figuras: [...new Set(items.map((i) => i.figura))],
});
