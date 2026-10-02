/**
 * Asigna figuras SVG y atajos a diagramático + espacial.
 * Uso: npx tsx scripts/patch-diagram-espacial.ts
 *
 * Reglas:
 * - figura debe coincidir con el enunciado
 * - captions (UI) = método, sin dar la respuesta
 * - pasos = explicación fácil (se ven al revelar)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura?: string };

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{ id: string; descripcion: string; items: Item[] }>;
};

function assignDiag(item: Item): Item {
  const e = item.enunciado;
  if (/gira\s+\d+°\s+horario/i.test(e)) {
    return {
      ...item,
      figura: "diag-giro-90",
      pasos: [
        "Imagina una flecha. Giro horario 90° = un cuarto de vuelta a la derecha (como las manecillas del reloj).",
        "Orden del ciclo: arriba → derecha → abajo → izquierda → (vuelve a arriba).",
        "Si ahora apunta arriba, el siguiente paso del ciclo es derecha.",
        "Truco: antihorario sería al revés (arriba → izquierda).",
      ],
    };
  }
  if (/Puntos en figuras/i.test(e)) {
    return {
      ...item,
      figura: "diag-puntos",
      pasos: [
        "No mires solo los números: mira cuánto crece de uno al siguiente.",
        "2→3 (+1), 3→5 (+2), 5→8 (+3), 8→12 (+4). Los saltos aumentan de 1 en 1.",
        "El siguiente salto es +5: 12 + 5 = 17.",
        "Si las diferencias no crecen parejo, prueba otra regla; aquí sí crecen.",
      ],
    };
  }
  if (/blanco,\s*negro/i.test(e)) {
    return {
      ...item,
      figura: "diag-bn",
      pasos: [
        "Hay solo 2 opciones que se repiten: blanco, negro, blanco, negro…",
        "Si la 1ª es blanca: posiciones impares = blanco; pares = negro.",
        "El 7.º es impar → blanco.",
        "Atajo: divide la posición entre 2; si sobra 1 (impar) = el color de la 1ª.",
      ],
    };
  }
  if (/Ciclo de tamaños|grande → mediana/i.test(e)) {
    return {
      ...item,
      figura: "diag-tamanos",
      pasos: [
        "El ciclo tiene 3 pasos y luego se repite: grande → mediana → pequeña → grande…",
        "Cuenta con los dedos: 1 grande, 2 mediana, 3 pequeña, 4 grande…",
        "La 4ª vuelve a ser la misma que la 1ª → grande.",
        "Fórmula mental: resto al dividir la posición entre 3 (4÷3 sobra 1 → como la 1ª).",
      ],
    };
  }
  if (/Alterna ⊕|⊖/i.test(e)) {
    return {
      ...item,
      figura: "diag-mas-menos",
      pasos: [
        "Solo alternan dos símbolos: uno, el otro, uno, el otro…",
        "Si el 5.º es ⊕, el 6.º tiene que ser el contrario: ⊖.",
        "No inventes un tercer símbolo (⊗ no entra en la regla).",
        "Atajo: consecutivo = siempre el opuesto del anterior.",
      ],
    };
  }
  if (/Matriz:\s*A→C|A→C \(\+2 letras\)/i.test(e)) {
    return {
      ...item,
      figura: "diag-letras",
      pasos: [
        "Este no es un dibujo de números: es un salto de letras (como el abecedario).",
        "A→C: desde A saltas 2 letras (A→B→C). El salto es +2.",
        "Aplica el mismo salto a B: B→C→D. Respuesta: d.",
        "Atajo: A=1, B=2, C=3… Entonces 1+2=3 (C); 2+2=4 (D).",
      ],
    };
  }
  return item;
}

function assignEspacial(item: Item): Item {
  const e = item.enunciado;
  if (/Cubo 3×3×3 pintado|cara pintada/i.test(e)) {
    return {
      ...item,
      figura: "espacial-cubo-pintado",
      pasos: [
        "Piensa un Rubik 3×3×3 pintado solo por fuera.",
        "Exactamente 1 cara pintada = el cubito del centro de cada cara grande (no esquina ni arista).",
        "Un cubo tiene 6 caras → 6 centros → 6 cubitos.",
        "Para no confundirte: esquinas tienen 3 caras pintadas; aristas (sin esquina) tienen 2.",
      ],
    };
  }
  if (/giras la letra|letra «p»/i.test(e)) {
    return {
      ...item,
      figura: "giro-espejo-r",
      pasos: [
        "Giro 180° = media vuelta (como dar la vuelta al papel), no es un espejo.",
        "La panza de la «p» queda arriba al otro lado → se parece a una «d».",
        "Espejo (sin girar) daría otra letra; aquí el enunciado dice girar.",
        "Truco: dibuja una p, gira la hoja media vuelta y mira qué letra ves.",
      ],
    };
  }
  if (/Norte arriba|Caminas norte/i.test(e)) {
    return {
      ...item,
      figura: "espacial-brujula",
      pasos: [
        "No hace falta dibujar un mapa perfecto: solo sigue el último tramo.",
        "Caminas: 1) norte, 2) este, 3) sur.",
        "Al final miras hacia donde vas en el último paso → sur.",
        "Los tramos anteriores cambian de lugar, pero la mirada final = último rumbo.",
      ],
    };
  }
  if (/Dados clásicos/i.test(e)) {
    return {
      ...item,
      figura: "dado-opuestos-7",
      pasos: [
        "En el dado clásico, cada cara y su opuesta suman 7.",
        "Parejas: 1 con 6, 2 con 5, 3 con 4.",
        "Opuesta a 3 → 4 (porque 3+4=7).",
        "No uses la cara de al lado: pregunta por la opuesta (la de atrás).",
      ],
    };
  }
  if (/Espejo vertical/i.test(e)) {
    return {
      ...item,
      figura: "espacial-espejo",
      pasos: [
        "Espejo vertical = el del baño (eje de arriba abajo).",
        "Lo de la izquierda pasa a la derecha y viceversa.",
        "Arriba y abajo no se cambian.",
        "Por eso izquierda y derecha se intercambian.",
      ],
    };
  }
  if (/Vista desde arriba: círculo/i.test(e)) {
    return {
      ...item,
      figura: "espacial-cilindro",
      pasos: [
        "Si desde arriba ves un círculo, la base del sólido es redonda.",
        "Entre las opciones, el cilindro encaja (lata vista desde arriba).",
        "Un cubo desde arriba se vería cuadrado; un prisma triangular, triángulo.",
        "El cono también da círculo desde arriba, pero aquí la opción más directa es cilindro.",
      ],
    };
  }
  if (/papel con flecha|dobla/i.test(e)) {
    return {
      ...item,
      figura: "espacial-doblez",
      pasos: [
        "Doblar no es girar: es juntar dos mitades por el pliegue.",
        "La flecha ↑ está en el papel; al doblar por la mitad horizontal, la punta se acerca al pliegue.",
        "Piensa en cerrar un cuaderno: lo de arriba baja hacia la línea del medio.",
        "Respuesta: hacia el pliegue.",
      ],
    };
  }
  if (/caras adyacentes a la superior/i.test(e)) {
    return {
      ...item,
      figura: "espacial-caras-adyacentes",
      pasos: [
        "Adyacente = que toca (comparte una arista).",
        "La cara de arriba (tapa) toca las 4 laterales (paredes).",
        "No toca la de abajo: esa es la opuesta, no vecina.",
        "Respuesta: 4.",
      ],
    };
  }
  if (/Reloj: manecilla/i.test(e)) {
    return {
      ...item,
      figura: "espacial-reloj",
      pasos: [
        "Giras el reloj entero 90° antihorario (un cuarto de vuelta en sentido contrario a las manecillas).",
        "Lo que apuntaba a las 3 queda apuntando hacia donde estaba el 12.",
        "Atajo: antihorario 90° desde las 3 → 12; horario 90° desde las 3 → 6.",
        "Si puedes, gira el teléfono/papel un cuarto y comprueba.",
      ],
    };
  }
  if (/Silueta de L|reflejo horizontal/i.test(e)) {
    return {
      ...item,
      figura: "espacial-espejo",
      pasos: [
        "Aquí «reflejo horizontal» se usa como espejo que cambia izquierda↔derecha (como el del baño).",
        "La L se ve como su espejo: no gira 90° ni se pone de cabeza.",
        "Arriba/abajo se mantienen; solo se invierte I/D.",
        "Dibuja una L y su espejo antes de marcar.",
      ],
    };
  }
  if (/aristas tiene un cubo/i.test(e)) {
    return {
      ...item,
      figura: "espacial-aristas",
      pasos: [
        "Arista = cada borde donde se juntan dos caras.",
        "Cuenta fácil: 4 arriba + 4 abajo + 4 verticales = 12.",
        "No confundas con vértices (esquinas = 8) ni caras (6).",
        "Respuesta: 12.",
      ],
    };
  }
  if (/Vista lateral de un cono/i.test(e)) {
    return {
      ...item,
      figura: "espacial-cono-lado",
      pasos: [
        "Vista lateral = mirar el cono de lado (no desde arriba).",
        "De lado se ve como un triángulo; desde arriba se vería un círculo.",
        "No elijas círculo si el enunciado dice «lateral».",
        "Respuesta: triángulo.",
      ],
    };
  }
  if (/2 cubos pegados|Pieza: 2 cubos/i.test(e)) {
    return {
      ...item,
      figura: "espacial-dos-cubos",
      pasos: [
        "Dos cubos sueltos tienen 6+6 = 12 caras.",
        "Al pegarlos por una cara, se ocultan 2 caras (una de cada cubo).",
        "Visibles = 12 − 2 = 10.",
        "Ese es el máximo típico si solo se tocan por una cara.",
      ],
    };
  }
  if (/Mapa: giras 180/i.test(e)) {
    return {
      ...item,
      figura: "espacial-mapa-180",
      pasos: [
        "Giro 180° = media vuelta del mapa sobre la mesa.",
        "Lo de arriba pasa abajo y lo de la izquierda pasa a la derecha (a la vez).",
        "Por eso arriba-izquierda termina en abajo-derecha.",
        "Truco: marca un punto en una esquina de un papel y gíralo media vuelta.",
      ],
    };
  }
  if (/Net de cubo|cruz/i.test(e)) {
    return {
      ...item,
      figura: "espacial-net-cruz",
      pasos: [
        "El «net» es el cubo desarmado en el papel (cruz).",
        "El centro de la cruz toca a varias caras; la opuesta no puede tocar al centro.",
        "Suele ser el extremo del brazo largo (la cara más lejos en esa fila).",
        "Regla de oro: si dos caras comparten lado en el papel, no son opuestas en el cubo.",
      ],
    };
  }
  if (/Escalera vista/i.test(e)) {
    return {
      ...item,
      figura: "espacial-escalera",
      pasos: [
        "«De frente» = miras los peldaños de cara, sin ver el costado en sierra.",
        "Se ven como franjas o rectángulos uno encima de otro.",
        "De perfil (lado) se vería la forma de escalones en zigzag.",
        "Elige la opción de franjas/rectángulos horizontales.",
      ],
    };
  }
  return { ...item, figura: item.figura || "cubo-vertice-tres" };
}

const diag = bank.tipos.find((t) => t.id === "razonamiento-diagramatico");
const esp = bank.tipos.find((t) => t.id === "razonamiento-espacial");
if (!diag || !esp) throw new Error("tipos faltantes");

diag.descripcion =
  "Patrones con figura: giros, colores, tamaños y series. Lee el atajo de la imagen y luego el enunciado.";
diag.items = diag.items.map(assignDiag);

esp.descripcion =
  "Espacio con figura: cubos, dados, caminos y vistas. Usa el dibujo + el atajo corto.";
esp.items = esp.items.map(assignEspacial);

const missingDiag = diag.items.filter((i) => !i.figura).length;
const missingEsp = esp.items.filter((i) => !i.figura).length;
const badLetter = diag.items.filter((i) => /A→C/i.test(i.enunciado) && i.figura !== "diag-letras");
writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log({
  diag: diag.items.length,
  withFigDiag: diag.items.filter((i) => i.figura).length,
  missingDiag,
  esp: esp.items.length,
  withFigEsp: esp.items.filter((i) => i.figura).length,
  missingEsp,
  badLetter: badLetter.length,
  letterFig: diag.items.find((i) => /A→C/i.test(i.enunciado))?.figura,
  letterPaso0: diag.items.find((i) => /A→C/i.test(i.enunciado))?.pasos[0],
});
