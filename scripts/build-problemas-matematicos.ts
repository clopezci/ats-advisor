/**
 * Reconstruye problemas-matematicos: poca repetición + tipos nuevos.
 * Uso: npx tsx scripts/build-problemas-matematicos.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { explainProblemaMatematico } from "../src/lib/psicotecnicas/explainProblemas";

type Item = { enunciado: string; respuesta: string };

function withOptions(q: string, opts: [string, string, string, string], correct: 0 | 1 | 2 | 3): Item {
  const letters = ["A", "B", "C", "D"] as const;
  const enunciado = `${q}\n\nA) ${opts[0]}   B) ${opts[1]}   C) ${opts[2]}   D) ${opts[3]}`;
  return { enunciado, respuesta: `${letters[correct]}) ${opts[correct]}` };
}

const raw: Item[] = [
  // --- 2 de cada tipo clásico (refuerzo) ---
  withOptions("Un artículo vale $50.000. Con 10% de descuento. ¿cuánto pagas?", ["45.000", "40.000", "55.000", "5.000"], 0),
  withOptions("Un artículo vale $80.000. Con 25% de descuento. ¿cuánto pagas?", ["60.000", "20.000", "75.000", "55.000"], 0),
  withOptions("Recorres 4 km en 40 min. ¿Cuántos km en 1 hora al mismo ritmo?", ["6", "4", "8", "5"], 0),
  withOptions("Recorres 3 km en 30 min. ¿Cuántos km en 1 hora al mismo ritmo?", ["6", "3", "9", "5"], 0),
  withOptions("A llena en 6 h y B en 8 h. ¿Cuánto tardan juntas?", ["3,43", "6", "7", "2"], 0),
  withOptions("A llena en 4 h y B en 12 h. ¿Cuánto tardan juntas?", ["3", "4", "8", "2"], 0),
  withOptions("Reparten $90.000 en partes 2, 3 y 4. ¿Cuánto le toca a la de 3?", ["30.000", "20.000", "40.000", "10.000"], 0),
  withOptions("Reparten $180.000 en partes 2, 3 y 4. ¿Cuánto le toca a la de 3?", ["60.000", "40.000", "80.000", "20.000"], 0),
  withOptions("Si 10 obreros terminan en 8 días, ¿cuántos días tardan 16 (mismo ritmo)?", ["5", "8", "10", "4"], 0),
  withOptions("Si 6 obreros terminan en 10 días, ¿cuántos días tardan 12 (mismo ritmo)?", ["5", "6", "10", "8"], 0),
  withOptions("Un tren de 150 m pasa un poste en 6 s. ¿Velocidad en m/s?", ["25", "20", "30", "15"], 0),
  withOptions("Un tren de 210 m pasa un poste en 7 s. ¿Velocidad en m/s?", ["30", "25", "21", "35"], 0),
  withOptions("Si 8 cuadernos cuestan $40.000, ¿cuánto cuestan 5?", ["25.000", "20.000", "32.000", "8.000"], 0),
  withOptions("Si 10 cuadernos cuestan $60.000, ¿cuánto cuestan 4?", ["24.000", "30.000", "15.000", "40.000"], 0),

  // --- Tipos nuevos ---
  withOptions("Las notas 3, 4 y 5. ¿Promedio?", ["4", "3", "5", "12"], 0),
  withOptions("Las notas 2, 4, 4 y 6. ¿Promedio?", ["4", "3", "5", "16"], 0),
  withOptions(
    "Interés simple: $100.000 al 10% anual por 2 años. ¿Interés?",
    ["20.000", "10.000", "120.000", "2.000"],
    0
  ),
  withOptions(
    "Interés simple: $200.000 al 5% anual por 3 años. ¿Interés?",
    ["30.000", "15.000", "10.000", "60.000"],
    0
  ),
  withOptions("Un sueldo de $2.000.000 sube 10%. ¿Nuevo sueldo?", ["2.200.000", "200.000", "1.800.000", "2.100.000"], 0),
  withOptions("Un sueldo de $1.500.000 sube 20%. ¿Nuevo sueldo?", ["1.800.000", "300.000", "1.200.000", "1.700.000"], 0),
  withOptions("Rectángulo 8 m × 5 m. ¿Perímetro?", ["26", "40", "13", "20"], 0),
  withOptions("Rectángulo 12 m × 3 m. ¿Perímetro?", ["30", "36", "15", "24"], 0),
  withOptions("Cuadrado de lado 6. ¿Área?", ["36", "24", "12", "18"], 0),
  withOptions("Cuadrado de lado 9. ¿Área?", ["81", "36", "18", "27"], 0),
  withOptions("Suma 1 a 10. ¿Resultado?", ["55", "45", "50", "100"], 0),
  withOptions("Suma 1 a 20. ¿Resultado?", ["210", "200", "190", "220"], 0),
  withOptions(
    "Dos trenes a 60 y 40 km/h se acercan desde 200 km. ¿En cuántas horas se encuentran?",
    ["2", "4", "5", "3"],
    0
  ),
  withOptions(
    "Dos trenes a 50 y 30 km/h se acercan desde 160 km. ¿En cuántas horas se encuentran?",
    ["2", "3", "4", "5"],
    0
  ),
  withOptions("A llena en 6 h y B vacía en 12 h. ¿Cuánto tardan para llenar el tanque juntas?", ["12", "6", "9", "4"], 0),
  withOptions("A llena en 5 h y B vacía en 20 h. ¿Cuánto tardan para llenar el tanque juntas?", ["6,67", "5", "4", "10"], 0),
  withOptions("Lee 20 pág/h. ¿Cuántas páginas en 3,5 h?", ["70", "60", "23,5", "40"], 0),
  withOptions("Lee 15 pág/h. ¿Cuántas páginas en 4 h?", ["60", "45", "19", "30"], 0),
  withOptions("1 USD = 4.000 COP. ¿Cuántos USD con 20.000 COP?", ["5", "4", "8", "2"], 0),
  withOptions("1 USD = 4.000 COP. ¿Cuántos USD con 12.000 COP?", ["3", "4", "2", "6"], 0),
  withOptions("Al dividir 50 por 7 el resto es:", ["1", "7", "0", "5"], 0),
  withOptions("Al dividir 100 por 9 el resto es:", ["1", "9", "11", "0"], 0),
  withOptions("Compra a $40.000 y vende a $50.000. ¿% de ganancia?", ["25", "10", "20", "50"], 0),
  withOptions("Compra a $80.000 y vende a $100.000. ¿% de ganancia?", ["25", "20", "80", "12,5"], 0),
  withOptions("2 h 15 min en minutos. ¿Cuántos?", ["135", "215", "75", "150"], 0),
  withOptions("3 h 20 min en minutos. ¿Cuántos?", ["200", "320", "180", "60"], 0),
  withOptions("En mapa 1 cm = 5 km. 8 cm representan:", ["40", "13", "5", "80"], 0),
  withOptions("En mapa 1 cm = 10 km. 6 cm representan:", ["60", "16", "10", "6"], 0),
  withOptions("4 personas pagan juntos $80.000. ¿Cuánto paga cada una?", ["20.000", "40.000", "16.000", "80.000"], 0),
  withOptions("5 personas pagan juntos $100.000. ¿Cuánto paga cada una?", ["20.000", "25.000", "50.000", "5.000"], 0),
  withOptions("Recorren 240 km en 3 h. ¿Velocidad en km/h?", ["80", "240", "72", "60"], 0),
  withOptions("Recorren 150 km en 2 h. ¿Velocidad en km/h?", ["75", "150", "50", "100"], 0),
  withOptions("3/4 de 80 = ?", ["60", "20", "40", "75"], 0),
  withOptions("2/5 de 100 = ?", ["40", "20", "50", "25"], 0),
  withOptions("Triángulo rectángulo con catetos 3 y 4. ¿Hipotenusa?", ["5", "7", "12", "6"], 0),
  withOptions("Triángulo rectángulo con catetos 6 y 8. ¿Hipotenusa?", ["10", "14", "48", "9"], 0),
  withOptions("Tanque 120 L, sale a 15 L/min. ¿Minutos para vaciar?", ["8", "15", "120", "10"], 0),
  withOptions("Tanque 90 L, sale a 10 L/min. ¿Minutos para vaciar?", ["9", "10", "90", "19"], 0),
  withOptions("Hoy Ana tiene 20 y su madre 44. ¿En cuántos años la madre tendrá el doble de la edad de Ana?", ["4", "12", "24", "8"], 0),
  withOptions("Hoy Luis tiene 15 y su padre 40. ¿En cuántos años el padre tendrá el doble de la edad de Luis?", ["10", "5", "25", "15"], 0),
  withOptions("¿Ángulo entre manecillas a las 3?", ["90", "180", "45", "30"], 0),
  withOptions("¿Ángulo entre manecillas a las 6?", ["180", "90", "60", "120"], 0),
];

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{
    id: string;
    nombre: string;
    descripcion: string;
    items: Array<{ enunciado: string; respuesta: string; pasos: string[] }>;
  }>;
};

const tipo = bank.tipos.find((t) => t.id === "problemas-matematicos");
if (!tipo) throw new Error("no tipo");

const items = raw.map((r) => {
  const pasos = explainProblemaMatematico(r.enunciado);
  if (!pasos) {
    throw new Error(`Sin explicación: ${r.enunciado.split("\n")[0]}`);
  }
  return { ...r, pasos };
});

tipo.descripcion =
  "Variedad de problemas con atajos: regla de 3 directa/inversa, %, promedios, interés, geometría…";
tipo.items = items;

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log(`problemas-matematicos: ${items.length} ítems`);

// Diversidad
const kinds = new Set(
  items.map((i) => {
    const e = i.enunciado;
    if (/descuento/i.test(e)) return "descuento";
    if (/Recorres/i.test(e)) return "distancia";
    if (/A llena.*B en/i.test(e) && !/vac/i.test(e)) return "grifos";
    if (/vac[ií]a/i.test(e)) return "llena-vacia";
    if (/Reparten/i.test(e)) return "partes";
    if (/obreros/i.test(e)) return "obreros";
    if (/poste/i.test(e)) return "tren";
    if (/cuadernos/i.test(e)) return "cuadernos";
    if (/[Pp]romedio/i.test(e)) return "promedio";
    if (/[Ii]nter[eé]s/i.test(e)) return "interes";
    if (/sueldo/i.test(e)) return "aumento";
    if (/[Pp]er[ií]metro/i.test(e)) return "perimetro";
    if (/[ÁA]rea/i.test(e)) return "area";
    if (/[Ss]uma 1/i.test(e)) return "suma";
    if (/encuentran/i.test(e)) return "encuentro";
    if (/p[aá]g/i.test(e)) return "paginas";
    if (/USD/i.test(e)) return "cambio";
    if (/resto/i.test(e)) return "resto";
    if (/% de ganancia/i.test(e)) return "ganancia";
    if (/en minutos/i.test(e)) return "minutos";
    if (/mapa/i.test(e)) return "escala";
    if (/personas/i.test(e)) return "reparto";
    if (/Velocidad en km\/h/i.test(e)) return "vel-kmh";
    if (/\d+\/\d+ de/i.test(e)) return "fraccion";
    if (/[Hh]ipotenusa/i.test(e)) return "pitagoras";
    if (/[Tt]anque/i.test(e)) return "vaciar";
    if (/doble de la edad/i.test(e)) return "edades";
    if (/manecillas/i.test(e)) return "reloj";
    return "otro";
  })
);
console.log("tipos distintos:", kinds.size, [...kinds].sort().join(", "));
