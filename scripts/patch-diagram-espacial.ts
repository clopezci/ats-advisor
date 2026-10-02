/**
 * Asigna figuras SVG y atajos a diagramático + espacial.
 * Uso: npx tsx scripts/patch-diagram-espacial.ts
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
        "Atajo: ciclo horario de 4 → ↑ derecha ↓ izquierda (y vuelve a ↑).",
        "Desde arriba, un giro 90° horario = derecha.",
        "Antihorario sería lo contrario: arriba → izquierda.",
        "Respuesta: derecha.",
      ],
    };
  }
  if (/Puntos en figuras/i.test(e)) {
    return {
      ...item,
      figura: "diag-puntos",
      pasos: [
        "Atajo: anota las diferencias entre números seguidos.",
        "Si crecen +1, +2, +3… el siguiente salto suma uno más.",
        "Aplica ese salto al último número de la lista.",
        "Comprueba con la figura: cada círculo suma más puntos.",
      ],
    };
  }
  if (/blanco,\s*negro/i.test(e)) {
    return {
      ...item,
      figura: "diag-bn",
      pasos: [
        "Atajo: patrón de 2 posiciones (impar / par).",
        "Si 1ª = blanco, entonces impares = blanco y pares = negro.",
        "Mira si el número pedido es impar o par y elige el color.",
        "No cuentes de más: solo importa la posición.",
      ],
    };
  }
  if (/Ciclo de tamaños|grande → mediana/i.test(e)) {
    return {
      ...item,
      figura: "diag-tamanos",
      pasos: [
        "Atajo ciclo de 3: G → M → P → G → …",
        "Posición n equivale a la posición ((n−1) mod 3) + 1.",
        "La 4ª = misma que la 1ª; la 5ª = misma que la 2ª.",
        "Cuenta rápido con los dedos: 1G 2M 3P 4G…",
      ],
    };
  }
  if (/Alterna ⊕|⊖/i.test(e)) {
    return {
      ...item,
      figura: "diag-mas-menos",
      pasos: [
        "Atajo: una posición ⊕, la siguiente ⊖ (alternancia estricta).",
        "Si el 5.º es ⊕, el 6.º (siguiente) es ⊖.",
        "Regla: impar/par según cómo empiece la serie en el enunciado.",
        "No inventes un tercer símbolo: solo hay dos.",
      ],
    };
  }
  if (/Matriz:|letras/i.test(e)) {
    return {
      ...item,
      figura: "matriz-puntos",
      pasos: [
        "Atajo: pasa letras a número (A=1, B=2…) y mira cuánto suma el ejemplo.",
        "Aplica el mismo salto a la letra que preguntan.",
        "Vuelve a letra: 1=A, 2=B, 3=C…",
        "Comprueba con el par del enunciado antes de marcar.",
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
        "Atajo 3×3×3: piensa las 6 caras del cubo grande.",
        "Exactamente 1 cara pintada = solo el cubito del CENTRO de cada cara.",
        "6 caras → 6 cubitos.",
        "Esquinas = 3 caras; aristas (no esquina) = 2; el muy centro interior = 0.",
      ],
    };
  }
  if (/giras la letra|letra «p»/i.test(e)) {
    return {
      ...item,
      figura: "giro-espejo-r",
      pasos: [
        "Atajo: gira el papel mentalmente (o la cabeza) 180°.",
        "La «p» rotada 180° se parece a una «d».",
        "Espejo (sin girar) daría otra letra: no confundas giro con reflejo.",
        "Respuesta: d.",
      ],
    };
  }
  if (/Norte arriba|Caminas norte/i.test(e)) {
    return {
      ...item,
      figura: "espacial-brujula",
      pasos: [
        "Atajo: la dirección en la que MIRAS al final = el último tramo.",
        "Norte → este → sur: terminas caminando al sur.",
        "No sumes giros de más: solo sigue la secuencia del enunciado.",
        "Respuesta: sur.",
      ],
    };
  }
  if (/Dados clásicos/i.test(e)) {
    return {
      ...item,
      figura: "dado-opuestos-7",
      pasos: [
        "Atajo de dado estándar: opuestos suman 7.",
        "1↔6, 2↔5, 3↔4.",
        "Si preguntan opuesta a 3 → 4.",
        "No uses dados «raros» de juegos especiales salvo que lo digan.",
      ],
    };
  }
  if (/Espejo vertical/i.test(e)) {
    return {
      ...item,
      figura: "espacial-espejo",
      pasos: [
        "Atajo: espejo vertical = cambia izquierda/derecha.",
        "Arriba y abajo se quedan iguales.",
        "Piensa en el espejo del baño: tu mano derecha parece la izquierda.",
        "Respuesta: se invierten.",
      ],
    };
  }
  if (/Vista desde arriba: círculo/i.test(e)) {
    return {
      ...item,
      figura: "espacial-cilindro",
      pasos: [
        "Atajo: vista superior circular ⇒ cuerpo redondo.",
        "El sólido más simple: cilindro (también podría ser cono visto desde arriba).",
        "Un cubo desde arriba se ve cuadrado, no círculo.",
        "Respuesta: cilindro (o sólido de base circular).",
      ],
    };
  }
  if (/papel con flecha|dobla/i.test(e)) {
    return {
      ...item,
      figura: "espacial-doblez",
      pasos: [
        "Atajo: al doblar por la mitad, la punta se acerca al pliegue.",
        "Visualiza la flecha ↑ y el pliegue horizontal: la punta baja hacia el centro.",
        "No la gires 180° salvo que el enunciado diga girar.",
        "Sigue solo la instrucción de doblar.",
      ],
    };
  }
  if (/caras adyacentes a la superior/i.test(e)) {
    return {
      ...item,
      figura: "cubo-vertice-tres",
      pasos: [
        "Atajo: un cubo tiene 6 caras; la superior toca a 4 laterales.",
        "La inferior NO es adyacente a la superior (está opuesta).",
        "Respuesta: 4.",
        "Dibujo mental: tapa de una caja y sus cuatro paredes.",
      ],
    };
  }
  if (/Reloj: manecilla/i.test(e)) {
    return {
      ...item,
      figura: "espacial-reloj",
      pasos: [
        "Atajo: 90° antihorario = un cuarto de vuelta «hacia atrás» en el reloj.",
        "Si apunta a las 3, antihorario 90° apunta hacia las 12.",
        "Horario 90° desde las 3 iría a las 6.",
        "Dibuja el reloj rápido en el margen si puedes.",
      ],
    };
  }
  if (/Silueta de L|reflejo horizontal/i.test(e)) {
    return {
      ...item,
      figura: "espacial-espejo",
      pasos: [
        "Atajo: en estos ítems «reflejo horizontal» = espejo que cambia izquierda↔derecha.",
        "La L se ve como su espejo (no gira 90°).",
        "Arriba/abajo no cambian; solo I/D.",
        "Dibuja la L y el espejo vertical antes de marcar.",
      ],
    };
  }
  if (/aristas tiene un cubo/i.test(e)) {
    return {
      ...item,
      figura: "cubo-vertice-tres",
      pasos: [
        "Atajo: cubo = 12 aristas (4 arriba + 4 abajo + 4 verticales).",
        "También: 8 vértices × 3 aristas / 2 = 12.",
        "Caras = 6; vértices = 8; aristas = 12.",
        "Respuesta: 12.",
      ],
    };
  }
  if (/Vista lateral de un cono/i.test(e)) {
    return {
      ...item,
      figura: "espacial-cono-lado",
      pasos: [
        "Atajo: cono de lado = triángulo (o silueta triangular).",
        "Desde arriba sería círculo; de frente/lado suele verse el triángulo.",
        "No lo confundas con el cilindro (rectángulo de lado).",
        "Respuesta: triángulo.",
      ],
    };
  }
  if (/2 cubos pegados|Pieza: 2 cubos/i.test(e)) {
    return {
      ...item,
      figura: "cubo-vertice-tres",
      pasos: [
        "Atajo: 2 cubos sueltos = 12 caras; al pegarlos se ocultan 2 caras (1 de cada).",
        "Visibles = 12 − 2 = 10 en el máximo típico.",
        "Orienta para no tapar más caras de la cuenta.",
        "Respuesta: 10 (según opciones del ítem).",
      ],
    };
  }
  if (/Mapa: giras 180/i.test(e)) {
    return {
      ...item,
      figura: "espacial-brujula",
      pasos: [
        "Atajo giro 180°: arriba↔abajo e izquierda↔derecha a la vez.",
        "Lo de arriba-izquierda pasa a abajo-derecha.",
        "Como girar el mapa media vuelta sobre la mesa.",
        "Respuesta: abajo-derecha.",
      ],
    };
  }
  if (/Net de cubo|cruz/i.test(e)) {
    return {
      ...item,
      figura: "espacial-net-cruz",
      pasos: [
        "Atajo del desarrollo en cruz: el centro toca a cuatro brazos.",
        "La cara opuesta al centro suele ser el extremo del brazo largo (el que no toca al centro por un lado).",
        "Caras que comparten lado en el papel NO pueden ser opuestas en el cubo.",
        "Marca mentalmente «opuesta = no toca».",
      ],
    };
  }
  if (/Escalera vista/i.test(e)) {
    return {
      ...item,
      figura: "espacial-escalera",
      pasos: [
        "Atajo: de frente, los peldaños se ven como líneas/rectángulos apilados.",
        "No inventes profundidad si preguntan la silueta frontal.",
        "De perfil se vería la forma de sierra; de frente, franjas.",
        "Elige la opción que coincida con «frente».",
      ],
    };
  }
  return { ...item, figura: item.figura || "cubo-vertice-tres" };
}

const diag = bank.tipos.find((t) => t.id === "razonamiento-diagramatico");
const esp = bank.tipos.find((t) => t.id === "razonamiento-espacial");
if (!diag || !esp) throw new Error("tipos faltantes");

diag.descripcion =
  "Patrones con figura: giros, colores, tamaños y series. Usa el atajo de la imagen.";
diag.items = diag.items.map(assignDiag);

esp.descripcion =
  "Espacio con figura: cubos, dados, caminos y vistas. Atajo visual + regla corta.";
esp.items = esp.items.map(assignEspacial);

const missingDiag = diag.items.filter((i) => !i.figura).length;
const missingEsp = esp.items.filter((i) => !i.figura).length;
writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log({
  diag: diag.items.length,
  withFigDiag: diag.items.filter((i) => i.figura).length,
  missingDiag,
  esp: esp.items.length,
  withFigEsp: esp.items.filter((i) => i.figura).length,
  missingEsp,
});
