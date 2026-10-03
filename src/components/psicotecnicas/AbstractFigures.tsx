"use client";

import type { ReactNode } from "react";
import { DIAGRAMATICO_FIGURES } from "@/components/psicotecnicas/diagramaticoFigures";

const stroke = "#1e293b";
const muted = "#64748b";
const fill = "#f8fafc";
const accent = "#6d28d9";

function Frame({
  children,
  caption,
  w = 360,
  h = 200,
}: {
  children: ReactNode;
  caption?: string;
  w?: number;
  h?: number;
}) {
  return (
    <figure className="mx-auto my-2 w-full max-w-[280px] overflow-visible rounded-lg border border-black/10 bg-white p-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mx-auto block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={caption || "Figura"}
      >
        {children}
      </svg>
      {caption ? <figcaption className="text-[11px] muted mt-1.5 text-center leading-snug">{caption}</figcaption> : null}
    </figure>
  );
}

function LetterR({ x, y, mirror = false, rot = 0 }: { x: number; y: number; mirror?: boolean; rot?: number }) {
  const sx = mirror ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx} 1)`}>
      <path
        d="M-14,-28 L-14,28 M-14,-28 L8,-28 Q22,-28 22,-12 Q22,2 8,2 L-14,2 M0,2 L18,28"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Triangle({
  x,
  y,
  rot = 0,
  dots = 0,
  size = 28,
}: {
  x: number;
  y: number;
  rot?: number;
  dots?: number;
  size?: number;
}) {
  const h = size;
  const pts = `0,${-h} ${h * 0.9},${h * 0.6} ${-h * 0.9},${h * 0.6}`;
  const positions = [
    [0, -4],
    [-8, 8],
    [8, 8],
    [0, 10],
    [-10, -2],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth="3" />
      {Array.from({ length: dots }).map((_, i) => (
        <circle key={i} cx={positions[i][0]} cy={positions[i][1]} r="3.5" fill={accent} />
      ))}
    </g>
  );
}

function ArrowUp({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <line x1="0" y1="22" x2="0" y2="-10" stroke={stroke} strokeWidth="4" />
      <polygon points="0,-28 12,-8 -12,-8" fill={stroke} />
    </g>
  );
}

/** Desarrollo (net) de cubo: celdas en grilla col/fila. */
function CubeNet({
  cells,
  size = 34,
  ox = 40,
  oy = 20,
}: {
  cells: Array<{ c: number; r: number; label?: string; fill?: string; ink?: string }>;
  size?: number;
  ox?: number;
  oy?: number;
}) {
  return (
    <g>
      {cells.map((cell, i) => {
        const x = ox + cell.c * size;
        const y = oy + cell.r * size;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={size}
              height={size}
              fill={cell.fill || fill}
              stroke={stroke}
              strokeWidth="2"
            />
            {cell.label ? (
              <text
                x={x + size / 2}
                y={y + size / 2 + 5}
                textAnchor="middle"
                fontSize={size > 30 ? 13 : 11}
                fill={cell.ink || stroke}
                fontWeight="700"
              >
                {cell.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function DiceFace({ x, y, n, size = 56 }: { x: number; y: number; n: number; size?: number }) {
  const s = size;
  const dots: Record<number, Array<[number, number]>> = {
    1: [[0.5, 0.5]],
    2: [
      [0.28, 0.28],
      [0.72, 0.72],
    ],
    3: [
      [0.28, 0.28],
      [0.5, 0.5],
      [0.72, 0.72],
    ],
    4: [
      [0.28, 0.28],
      [0.72, 0.28],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
    5: [
      [0.28, 0.28],
      [0.72, 0.28],
      [0.5, 0.5],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
    6: [
      [0.28, 0.25],
      [0.72, 0.25],
      [0.28, 0.5],
      [0.72, 0.5],
      [0.28, 0.75],
      [0.72, 0.75],
    ],
  };
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx="6" fill={fill} stroke={stroke} strokeWidth="2.5" />
      {(dots[n] || []).map(([px, py], i) => (
        <circle key={i} cx={x + px * s} cy={y + py * s} r={s * 0.08} fill={stroke} />
      ))}
    </g>
  );
}

function Gear({
  x,
  y,
  r,
  label,
  teeth = 10,
}: {
  x: number;
  y: number;
  r: number;
  label: string;
  teeth?: number;
}) {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.28) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.5) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a3 = ((i + 0.72) / teeth) * Math.PI * 2 - Math.PI / 2;
    const outer = r + Math.max(5, r * 0.14);
    pts.push(`${x + Math.cos(a0) * r},${y + Math.sin(a0) * r}`);
    pts.push(`${x + Math.cos(a1) * outer},${y + Math.sin(a1) * outer}`);
    pts.push(`${x + Math.cos(a2) * outer},${y + Math.sin(a2) * outer}`);
    pts.push(`${x + Math.cos(a3) * r},${y + Math.sin(a3) * r}`);
  }
  return (
    <g>
      <polygon points={pts.join(" ")} fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x} cy={y} r={r * 0.38} fill="white" stroke={stroke} strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={r > 45 ? 13 : 11} fill={stroke} fontWeight="700">
        {label}
      </text>
    </g>
  );
}

const FIGURES: Record<string, { caption: string; node: ReactNode }> = {
  "serie-triangulo-puntos": {
    caption: "En cada paso: giro 90° a la derecha y un punto más adentro.",
    node: (
      <Frame caption="Serie: ¿qué cambia en cada figura?" w={360} h={200}>
        <Triangle x={48} y={95} rot={0} dots={1} size={24} />
        <text x={88} y={100} fill={muted} fontSize="20">
          →
        </text>
        <Triangle x={130} y={95} rot={90} dots={2} size={24} />
        <text x={170} y={100} fill={muted} fontSize="20">
          →
        </text>
        <Triangle x={212} y={95} rot={180} dots={3} size={24} />
        <text x={252} y={100} fill={muted} fontSize="20">
          →
        </text>
        <Triangle x={294} y={95} rot={270} dots={4} size={24} />
        <text x={48} y={175} textAnchor="middle" fontSize="12" fill={muted}>
          1
        </text>
        <text x={130} y={175} textAnchor="middle" fontSize="12" fill={muted}>
          2
        </text>
        <text x={212} y={175} textAnchor="middle" fontSize="12" fill={muted}>
          3
        </text>
        <text x={294} y={175} textAnchor="middle" fontSize="12" fill={muted}>
          4
        </text>
      </Frame>
    ),
  },
  "ciclo-flechas-90": {
    caption: "Giro de 90°: la 5ª vuelve a verse como la 1ª.",
    node: (
      <Frame caption="Ciclo de cuatro giros" w={360} h={190}>
        <ArrowUp x={40} y={85} rot={0} />
        <ArrowUp x={110} y={85} rot={90} />
        <ArrowUp x={180} y={85} rot={180} />
        <ArrowUp x={250} y={85} rot={270} />
        <ArrowUp x={320} y={85} rot={0} />
        {["1↑", "2→", "3↓", "4←", "5↑"].map((t, i) => (
          <text key={t} x={40 + i * 70} y={170} textAnchor="middle" fontSize="12" fill={muted}>
            {t}
          </text>
        ))}
      </Frame>
    ),
  },
  "giro-espejo-r": {
    caption: "Atajo: giro 180° ≠ espejo. Sigue la panza de la letra hasta ver a qué se parece.",
    node: (
      <Frame caption="Espejo vs giro 180°" w={360} h={220}>
        <text x={60} y={28} textAnchor="middle" fontSize="12" fill={muted}>
          Original
        </text>
        <LetterR x={60} y={110} />
        <text x={180} y={28} textAnchor="middle" fontSize="12" fill={muted}>
          Espejo
        </text>
        <LetterR x={180} y={110} mirror />
        <text x={300} y={28} textAnchor="middle" fontSize="12" fill={muted}>
          Giro 180°
        </text>
        <LetterR x={300} y={110} rot={180} />
        <text x={180} y={200} textAnchor="middle" fontSize="11" fill={accent}>
          No son lo mismo: lee si dice espejo o giro
        </text>
      </Frame>
    ),
  },
  "matriz-puntos": {
    caption: "Atajo: busca una regla para el número y otra para el relleno (no mezcles las dos).",
    node: (
      <Frame caption="Matriz 3×3: dos reglas" h={220} w={260}>
        {[
          [1, 2, 3],
          [2, 4, 6],
          [3, 6, null],
        ].map((row, r) =>
          row.map((n, c) => {
            const x = 30 + c * 70;
            const y = 20 + r * 65;
            const fills = ["#ffffff", "#cbd5e1", "#1e293b"];
            const cellFill = fills[c];
            const ink = c === 2 ? "#f8fafc" : stroke;
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x}
                  y={y}
                  width="58"
                  height="55"
                  fill={n === null ? fill : cellFill}
                  stroke={stroke}
                  strokeWidth="2"
                  strokeDasharray={n === null ? "4 3" : undefined}
                />
                {n === null ? (
                  <text x={x + 29} y={y + 34} textAnchor="middle" fontSize="20" fill={accent}>
                    ?
                  </text>
                ) : (
                  <text x={x + 29} y={y + 34} textAnchor="middle" fontSize="18" fill={ink} fontWeight="700">
                    {n}
                  </text>
                )}
              </g>
            );
          })
        )}
      </Frame>
    ),
  },
  "diag-letras": {
    caption: "Atajo: pasa letras a número (A=1, B=2…), aplica el mismo salto y vuelve a letra.",
    node: (
      <Frame caption="Salto de letras" w={320} h={160}>
        <text x="50" y="55" textAnchor="middle" fontSize="28" fill={stroke} fontWeight="700">
          A
        </text>
        <text x="110" y="50" textAnchor="middle" fontSize="14" fill={accent}>
          +2
        </text>
        <text x="110" y="70" textAnchor="middle" fontSize="18" fill={accent}>
          →
        </text>
        <text x="170" y="55" textAnchor="middle" fontSize="28" fill={stroke} fontWeight="700">
          C
        </text>
        <text x="50" y="120" textAnchor="middle" fontSize="28" fill={stroke} fontWeight="700">
          B
        </text>
        <text x="110" y="115" textAnchor="middle" fontSize="14" fill={accent}>
          +?
        </text>
        <text x="110" y="135" textAnchor="middle" fontSize="18" fill={accent}>
          →
        </text>
        <text x="170" y="120" textAnchor="middle" fontSize="28" fill={accent} fontWeight="700">
          ?
        </text>
        <text x="250" y="90" textAnchor="middle" fontSize="11" fill={muted}>
          misma regla
        </text>
      </Frame>
    ),
  },
  "diagramatico-ordenes": {
    caption: "Orden = invertir la fila. Entrada □ △ ○ → salida ○ △ □. Anota el resultado tras CADA orden.",
    node: (
      <Frame caption="Entrada → orden → salida" h={150} w={340}>
        <rect x="12" y="55" width="28" height="28" fill={fill} stroke={stroke} strokeWidth="2" />
        <polygon points="55,55 72,83 38,83" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="95" cy="69" r="14" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="125" y="74" fontSize="16" fill={muted}>
          →
        </text>
        <rect x="145" y="48" width="70" height="42" rx="6" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="180" y="65" textAnchor="middle" fontSize="10" fill={accent}>
          orden
        </text>
        <text x="180" y="80" textAnchor="middle" fontSize="10" fill={stroke}>
          invertir
        </text>
        <text x="230" y="74" fontSize="16" fill={muted}>
          →
        </text>
        <circle cx="260" cy="69" r="14" fill={fill} stroke={stroke} strokeWidth="2" />
        <polygon points="290,55 307,83 273,83" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="318" y="55" width="28" height="28" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="55" y="120" textAnchor="middle" fontSize="10" fill={muted}>
          entrada
        </text>
        <text x="180" y="120" textAnchor="middle" fontSize="10" fill={muted}>
          símbolo
        </text>
        <text x="295" y="120" textAnchor="middle" fontSize="10" fill={muted}>
          salida
        </text>
      </Frame>
    ),
  },
  "cubo-caras-opuestas": {
    caption: "En el desarrollo: caras opuestas no comparten lado.",
    node: (
      <Frame caption="Desarrollo de cubo" h={220} w={300}>
        <rect x="110" y="20" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="135" y="50" textAnchor="middle" fontSize="14" fill={stroke}>
          ●
        </text>
        <rect x="60" y="70" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="110" y="70" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="135" y="100" textAnchor="middle" fontSize="16" fill={stroke}>
          X
        </text>
        <rect x="160" y="70" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="210" y="70" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="235" y="100" textAnchor="middle" fontSize="16" fill={stroke}>
          —
        </text>
        <rect x="110" y="120" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
      </Frame>
    ),
  },
  "cubo-vertice-tres": {
    caption: "Desde un vértice siempre ves exactamente tres caras.",
    node: (
      <Frame caption="Cubo en perspectiva" h={200} w={260}>
        <polygon points="80,140 130,110 180,140 130,170" fill="#e2e8f0" stroke={stroke} strokeWidth="2" />
        <polygon points="80,140 80,70 130,40 130,110" fill={fill} stroke={stroke} strokeWidth="2" />
        <polygon points="130,110 130,40 180,70 180,140" fill="#cbd5e1" stroke={stroke} strokeWidth="2" />
        <circle cx="105" cy="95" r="4" fill={accent} />
        <text x="200" y="50" fontSize="11" fill={muted}>
          3 caras visibles
        </text>
      </Frame>
    ),
  },
  "dado-opuestos-7": {
    caption: "Atajo: en un dado clásico, cada cara tiene una opuesta fija (suma constante).",
    node: (
      <Frame caption="Dado" h={180} w={220}>
        <rect x="60" y="50" width="80" height="80" rx="8" fill={fill} stroke={stroke} strokeWidth="3" />
        <circle cx="80" cy="70" r="5" fill={stroke} />
        <circle cx="120" cy="70" r="5" fill={stroke} />
        <circle cx="100" cy="90" r="5" fill={stroke} />
        <circle cx="80" cy="110" r="5" fill={stroke} />
        <circle cx="120" cy="110" r="5" fill={stroke} />
        <text x="160" y="95" fontSize="14" fill={muted}>
          5 ↔ 2
        </text>
      </Frame>
    ),
  },
  "cuadricula-cuadrados": {
    caption: "Cuenta por tamaño: 1×1, 2×2, 3×3… y suma.",
    node: (
      <Frame caption="Cuadrícula 3×3" h={200} w={200}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={30} y1={30 + i * 40} x2={150} y2={30 + i * 40} stroke={stroke} strokeWidth="2" />
            <line x1={30 + i * 40} y1={30} x2={30 + i * 40} y2={150} stroke={stroke} strokeWidth="2" />
          </g>
        ))}
        <rect x="30" y="30" width="80" height="80" fill="none" stroke={accent} strokeWidth="3" />
      </Frame>
    ),
  },
  "abanico-triangulos": {
    caption: "Base partida en n: hay n(n+1)/2 triángulos.",
    node: (
      <Frame caption="Abanico de triángulos" h={180} w={260}>
        <polygon points="130,30 30,150 230,150" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="130" y1="30" x2="97" y2="150" stroke={stroke} strokeWidth="2" />
        <line x1="130" y1="30" x2="163" y2="150" stroke={stroke} strokeWidth="2" />
        <text x="63" y="165" textAnchor="middle" fontSize="11" fill={muted}>
          1
        </text>
        <text x="130" y={165} textAnchor="middle" fontSize="11" fill={muted}>
          2
        </text>
        <text x="197" y={165} textAnchor="middle" fontSize="11" fill={muted}>
          3
        </text>
      </Frame>
    ),
  },
  "venn-silogismo": {
    caption: "Todo A está dentro de B. Estar en B no implica ser A.",
    node: (
      <Frame caption="Todos los A son B" h={180} w={280}>
        <circle cx="150" cy="90" r="70" fill="#ede9fe" stroke={stroke} strokeWidth="2" />
        <circle cx="150" cy="95" r="35" fill="#ddd6fe" stroke={accent} strokeWidth="2" />
        <text x="150" y="100" textAnchor="middle" fontSize="14" fill={accent} fontWeight="700">
          A
        </text>
        <text x="150" y="40" textAnchor="middle" fontSize="14" fill={stroke}>
          B
        </text>
      </Frame>
    ),
  },
  "engranajes-opuestos": {
    caption: "Dos ruedas que se tocan giran en sentido contrario.",
    node: (
      <Frame caption="Engranajes en contacto" w={360} h={180}>
        <Gear x={115} y={95} r={42} label="A" teeth={12} />
        <Gear x={225} y={95} r={42} label="B" teeth={12} />
        <text x={115} y={40} textAnchor="middle" fontSize="16" fill={accent}>
          ↻
        </text>
        <text x={225} y={40} textAnchor="middle" fontSize="16" fill={accent}>
          ↺
        </text>
      </Frame>
    ),
  },
  "engranajes-dientes": {
    caption: "Chico 10 dientes / grande 40. Si el chico da 4 vueltas, el grande da 1 (10×4 = 40×1).",
    node: (
      <Frame caption="Mismo «recorrido» de dientes: 40 = 40" w={360} h={210}>
        <Gear x={95} y={115} r={28} label="10" teeth={10} />
        <Gear x={230} y={115} r={70} label="40" teeth={20} />
        <text x={95} y={38} textAnchor="middle" fontSize="11" fill={muted}>
          chico
        </text>
        <text x={95} y={54} textAnchor="middle" fontSize="12" fill={accent}>
          4 vueltas
        </text>
        <text x={95} y={190} textAnchor="middle" fontSize="11" fill={stroke}>
          10 × 4 = 40
        </text>
        <text x={230} y={28} textAnchor="middle" fontSize="11" fill={muted}>
          grande
        </text>
        <text x={230} y={44} textAnchor="middle" fontSize="12" fill={accent}>
          1 vuelta
        </text>
        <text x={230} y={190} textAnchor="middle" fontSize="11" fill={stroke}>
          40 × 1 = 40
        </text>
      </Frame>
    ),
  },
  "ruedas-diametro": {
    caption: "Misma 1 vuelta: la rueda de diámetro doble avanza el doble (perímetro = π×D).",
    node: (
      <Frame caption="Ruedas que ruedan por el suelo" w={360} h={200}>
        <line x1="20" y1="160" x2="340" y2="160" stroke={stroke} strokeWidth="3" />
        <circle cx="90" cy="130" r="30" fill={fill} stroke={stroke} strokeWidth="3" />
        <line x1="90" y1="130" x2="120" y2="130" stroke={accent} strokeWidth="3" />
        <text x="90" y="135" textAnchor="middle" fontSize="11" fill={stroke}>
          D
        </text>
        <text x="90" y="185" textAnchor="middle" fontSize="11" fill={muted}>
          avanza π·D
        </text>
        <circle cx="250" cy={160 - 60} r="60" fill={fill} stroke={stroke} strokeWidth="3" />
        <line x1="250" y1={100} x2="310" y2={100} stroke={accent} strokeWidth="3" />
        <text x="250" y="105" textAnchor="middle" fontSize="11" fill={stroke}>
          2D
        </text>
        <text x="250" y="185" textAnchor="middle" fontSize="11" fill={muted}>
          avanza 2·π·D
        </text>
      </Frame>
    ),
  },
  "orden-alturas": {
    caption: "Flecha ↑ = «más alto que». Raya sin punta = iguales. Luego cuenta.",
    node: (
      <Frame caption="Mapa de alturas" h={170} w={340}>
        <text x="35" y="85" fontSize="13" fill={stroke}>
          Laura
        </text>
        <text x="95" y="55" fontSize="18" fill={accent}>
          ↑
        </text>
        <text x="125" y="85" fontSize="13" fill={stroke}>
          Andrés = Sofía
        </text>
        <text x="245" y="55" fontSize="18" fill={accent}>
          ↑
        </text>
        <text x="275" y="85" fontSize="13" fill={stroke}>
          Diego
        </text>
        <text x="170" y="130" textAnchor="middle" fontSize="11" fill={muted}>
          Laura &gt; Andrés=Sofía &gt; Diego
        </text>
      </Frame>
    ),
  },
  "familia-arbol": {
    caption: "Lee la frase de atrás hacia adelante. Cada trozo te lleva a la siguiente persona.",
    node: (
      <Frame caption="Pasos: hijo → hermana → padre" w={340} h={200}>
        <text x="40" y="45" fontSize="12" fill={muted}>
          1. mi padre
        </text>
        <text x="40" y="75" fontSize="12" fill={stroke}>
          2. hijo de mi padre = yo
        </text>
        <text x="40" y="105" fontSize="12" fill={stroke}>
          3. hermana de ese hijo = mi hermana
        </text>
        <text x="40" y="135" fontSize="12" fill={accent} fontWeight="700">
          4. padre de esa hermana = mi padre
        </text>
        <text x="170" y="175" textAnchor="middle" fontSize="11" fill={muted}>
          Frase: «el padre de la hermana del hijo de mi padre»
        </text>
      </Frame>
    ),
  },
  "plantilla-hueco": {
    caption: "El hueco estrella es el «raro»: solo una pieza lo tapa. Empieza por ese.",
    node: (
      <Frame caption="Plantilla (izquierda) y piezas (derecha)" w={360} h={180}>
        <rect x="20" y="35" width="120" height="110" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="80" y="28" textAnchor="middle" fontSize="10" fill={muted}>
          plantilla
        </text>
        <polygon points="55,70 65,55 80,55 90,70 80,85 65,85" fill="white" stroke={accent} strokeWidth="2.5" />
        <circle cx="110" cy="95" r="16" fill="white" stroke={stroke} strokeWidth="2" />
        <text x="220" y="28" textAnchor="middle" fontSize="10" fill={muted}>
          piezas
        </text>
        <circle cx="175" cy="80" r="18" fill="#e2e8f0" stroke={stroke} strokeWidth="2" />
        <rect x="210" y="62" width="36" height="36" fill="#ede9fe" stroke={stroke} strokeWidth="2" />
        <polygon points="280,55 295,70 280,85 265,70" fill="#c4b5fd" stroke={accent} strokeWidth="2.5" />
        <text x="280" y="110" textAnchor="middle" fontSize="10" fill={accent}>
          ← encaja
        </text>
      </Frame>
    ),
  },
  "engranajes-correa": {
    caption: "Con correa (sin cruce) las dos giran al mismo sentido.",
    node: (
      <Frame caption="Poleas con correa" w={360} h={180}>
        <circle cx="100" cy="90" r="35" fill={fill} stroke={stroke} strokeWidth="3" />
        <circle cx="250" cy="90" r="35" fill={fill} stroke={stroke} strokeWidth="3" />
        <path d="M100,55 Q175,20 250,55" fill="none" stroke={accent} strokeWidth="3" />
        <path d="M100,125 Q175,160 250,125" fill="none" stroke={accent} strokeWidth="3" />
        <text x="100" y="95" textAnchor="middle" fontSize="12" fill={stroke}>
          A
        </text>
        <text x="250" y="95" textAnchor="middle" fontSize="12" fill={stroke}>
          B
        </text>
      </Frame>
    ),
  },
  "polea-fija": {
    caption: "Polea fija: cambia la dirección, no ahorra fuerza.",
    node: (
      <Frame caption="Polea fija" h={200} w={220}>
        <line x1="110" y1="20" x2="110" y2="50" stroke={stroke} strokeWidth="3" />
        <circle cx="110" cy="70" r="22" fill={fill} stroke={stroke} strokeWidth="3" />
        <line x1="110" y1="92" x2="110" y2="150" stroke={accent} strokeWidth="3" />
        <rect x="95" y="150" width="30" height="25" fill={stroke} />
        <text x="150" y="100" fontSize="11" fill={muted}>
          carga
        </text>
      </Frame>
    ),
  },
  "palanca": {
    caption: "Fuerza × brazo = resistencia × brazo.",
    node: (
      <Frame caption="Palanca" h={160} w={300}>
        <polygon points="150,110 140,130 160,130" fill={stroke} />
        <line x1="40" y1="100" x2="260" y2="100" stroke={stroke} strokeWidth="4" />
        <rect x="50" y="70" width="24" height="28" fill={accent} />
        <text x="62" y="55" textAnchor="middle" fontSize="11" fill={muted}>
          F
        </text>
        <rect x="220" y="75" width="30" height="22" fill={stroke} />
        <text x="235" y="60" textAnchor="middle" fontSize="11" fill={muted}>
          R
        </text>
      </Frame>
    ),
  },
  "secuencia-c": {
    caption: "La abertura de la C gira; sigue solo ese detalle.",
    node: (
      <Frame caption="Serie tipo C" w={360} h={160}>
        {[0, 90, 180, 270].map((rot, i) => (
          <g key={rot} transform={`translate(${55 + i * 80} 80) rotate(${rot})`}>
            <path d="M18,0 A18,18 0 1,1 -18,0" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}
        <text x="340" y="85" fontSize="22" fill={accent}>
          ?
        </text>
      </Frame>
    ),
  },
  "rectangulo-mitad": {
    caption: "Mitad de largo y mitad de ancho → área queda en 1/4.",
    node: (
      <Frame caption="Área al partir lados" h={160} w={300}>
        <rect x="30" y="40" width="120" height="80" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="90" y="85" textAnchor="middle" fontSize="12" fill={muted}>
          original
        </text>
        <text x="170" y="85" fontSize="20" fill={muted}>
          →
        </text>
        <rect x="200" y="60" width="60" height="40" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="230" y="85" textAnchor="middle" fontSize="11" fill={accent}>
          1/4
        </text>
      </Frame>
    ),
  },
  "circulo-diametro": {
    caption: "Perímetro ≈ 3 × diámetro (más un poquito).",
    node: (
      <Frame caption="Círculo y diámetro" h={160} w={220}>
        <circle cx="110" cy="80" r="50" fill={fill} stroke={stroke} strokeWidth="3" />
        <line x1="60" y1="80" x2="160" y2="80" stroke={accent} strokeWidth="3" />
        <text x="110" y="70" textAnchor="middle" fontSize="11" fill={accent}>
          diámetro
        </text>
      </Frame>
    ),
  },
  "memoria-lamina": {
    caption: "Barridos: esquinas → letreros → personas → lo raro.",
    node: (
      <Frame caption="Lámina de memoria (esquema)" h={180} w={300}>
        <rect x="30" y="30" width="240" height="120" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="50" y="55" width="70" height="45" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="85" y="82" textAnchor="middle" fontSize="10" fill={accent}>
          TIENDA
        </text>
        <circle cx="200" cy="90" r="12" fill={stroke} />
        <rect x="230" y="50" width="20" height="50" fill="#cbd5e1" stroke={stroke} />
        <text x="150" y="140" textAnchor="middle" fontSize="10" fill={muted}>
          anota lo raro
        </text>
      </Frame>
    ),
  },
  "balancin": {
    caption: "Equilibrio: masa × distancia igual a ambos lados.",
    node: (
      <Frame caption="Balancín" h={150} w={300}>
        <line x1="40" y1="90" x2="260" y2="90" stroke={stroke} strokeWidth="4" />
        <polygon points="150,90 140,115 160,115" fill={stroke} />
        <circle cx="70" cy="70" r="14" fill={accent} />
        <text x="70" y="74" textAnchor="middle" fontSize="10" fill="white">
          2
        </text>
        <circle cx="230" cy="70" r="18" fill={stroke} />
        <text x="230" y="74" textAnchor="middle" fontSize="10" fill="white">
          1
        </text>
      </Frame>
    ),
  },
  "circuito-serie": {
    caption: "En serie: si se abre un interruptor, se apaga todo.",
    node: (
      <Frame caption="Circuito en serie" h={120} w={300}>
        <rect x="30" y="45" width="30" height="30" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="60" y1="60" x2="120" y2="60" stroke={stroke} strokeWidth="2" />
        <circle cx="140" cy="60" r="12" fill="#fef08a" stroke={stroke} />
        <line x1="152" y1="60" x2="210" y2="60" stroke={stroke} strokeWidth="2" />
        <line x1="210" y1="50" x2="230" y2="70" stroke={accent} strokeWidth="3" />
        <line x1="230" y1="60" x2="270" y2="60" stroke={stroke} strokeWidth="2" />
      </Frame>
    ),
  },
  "atencion-una-diferencia": {
    caption: "Modelo con rayita arriba-derecha. Solo tachas las que NO tienen esa rayita igual.",
    node: (
      <Frame caption="Atención: modelo vs fila" h={200} w={360}>
        <text x="40" y="28" fontSize="12" fill={muted}>
          MODELO
        </text>
        <rect x="40" y="40" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="78" y1="48" x2="82" y2="42" stroke={accent} strokeWidth="3" />
        <text x="120" y="70" fontSize="18" fill={muted}>
          →
        </text>
        <text x="160" y="28" fontSize="12" fill={muted}>
          FILA (tacha las distintas)
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 160 + i * 38;
          const same = i !== 2 && i !== 4;
          return (
            <g key={i}>
              <rect x={x} y="40" width="32" height="32" fill={fill} stroke={same ? stroke : accent} strokeWidth="2" />
              {same ? <line x1={x + 24} y1="48" x2={x + 28} y2="44" stroke={accent} strokeWidth="2" /> : null}
              {!same ? (
                <line x1={x + 4} y1="44" x2={x + 28} y2="68" stroke={accent} strokeWidth="2" />
              ) : null}
            </g>
          );
        })}
        <text x="180" y="120" fontSize="11" fill={muted}>
          Detalle a vigilar: la rayita de la esquina
        </text>
        <text x="180" y="150" fontSize="11" fill={accent}>
          ✕ = distintas del modelo (tachar)
        </text>
      </Frame>
    ),
  },
  "atencion-fila-tachado": {
    caption: "Trabaja de izquierda a derecha sin devolverte. Ritmo parejo.",
    node: (
      <Frame caption="Fila de atención" h={140} w={360}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const x = 25 + i * 42;
          const done = i < 3;
          return (
            <g key={i}>
              <rect x={x} y="50" width="34" height="34" fill={fill} stroke={stroke} strokeWidth="2" opacity={done ? 0.45 : 1} />
              {done ? <line x1={x + 4} y1="54" x2={x + 30} y2="80" stroke={muted} strokeWidth="2" /> : null}
              {i === 3 ? (
                <rect x={x - 2} y="48" width="38" height="38" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="4 2" />
              ) : null}
            </g>
          );
        })}
        <text x="180" y="120" textAnchor="middle" fontSize="11" fill={accent}>
          estás aquí → sigue, no vuelvas atrás
        </text>
      </Frame>
    ),
  },
  "situacional-opciones": {
    caption: "Lees el VERBO del enunciado, luego el caso, luego tachas opciones incompletas.",
    node: (
      <Frame caption="Juicio situacional" h={200} w={340}>
        <rect x="20" y="20" width="300" height="36" rx="6" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="170" y="43" textAnchor="middle" fontSize="12" fill={accent}>
          Enunciado: ¿qué es lo MÁS adecuado?
        </text>
        <rect x="20" y="70" width="300" height="40" rx="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <text x="30" y="95" fontSize="11" fill={muted}>
          Caso: un compañero llega tarde otra vez…
        </text>
        {["A) Ignorarlo", "B) Reportar ya", "C) Hablar en privado y documentar", "D) Reprender en público"].map((t, i) => (
          <text key={t} x="30" y={130 + i * 16} fontSize="11" fill={i === 2 ? accent : stroke}>
            {i === 2 ? "→ " : "  "}
            {t}
          </text>
        ))}
      </Frame>
    ),
  },
  "acciones-actitudes": {
    caption: "Acciones = frecuencia real. Actitudes = acuerdo. No son la misma escala.",
    node: (
      <Frame caption="Acciones vs Actitudes" h={180} w={340}>
        <rect x="20" y="30" width="140" height="120" rx="8" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="90" y="55" textAnchor="middle" fontSize="13" fill={accent} fontWeight="700">
          ACCIONES
        </text>
        <text x="90" y="80" textAnchor="middle" fontSize="11" fill={muted}>
          ¿Con qué frecuencia…?
        </text>
        <text x="90" y="110" textAnchor="middle" fontSize="10" fill={stroke}>
          Nunca → Siempre
        </text>
        <rect x="180" y="30" width="140" height="120" rx="8" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="250" y="55" textAnchor="middle" fontSize="13" fill={accent} fontWeight="700">
          ACTITUDES
        </text>
        <text x="250" y="80" textAnchor="middle" fontSize="11" fill={muted}>
          ¿Qué tan de acuerdo…?
        </text>
        <text x="250" y="110" textAnchor="middle" fontSize="10" fill={stroke}>
          En desacuerdo → De acuerdo
        </text>
      </Frame>
    ),
  },
  "likert-acuerdo": {
    caption: "Escala de acuerdo: responde con tu patrón real, sin extremos inventados.",
    node: (
      <Frame caption="Escala Likert" h={140} w={340}>
        {["1", "2", "3", "4", "5"].map((n, i) => (
          <g key={n}>
            <circle cx={50 + i * 60} cy="60" r="18" fill={i === 2 ? "#ede9fe" : fill} stroke={i === 2 ? accent : stroke} strokeWidth="2" />
            <text x={50 + i * 60} y="65" textAnchor="middle" fontSize="14" fill={stroke}>
              {n}
            </text>
          </g>
        ))}
        <text x="50" y="110" textAnchor="middle" fontSize="10" fill={muted}>
          Muy en desacuerdo
        </text>
        <text x="290" y="110" textAnchor="middle" fontSize="10" fill={muted}>
          Muy de acuerdo
        </text>
      </Frame>
    ),
  },
  "escala-sinceridad": {
    caption: "Si marcas siempre lo «perfecto», la escala de sinceridad te delata.",
    node: (
      <Frame caption="Trampa del extremo virtuoso" h={160} w={340}>
        <text x="20" y="35" fontSize="12" fill={stroke}>
          «Nunca me he equivocado en el trabajo»
        </text>
        <rect x="20" y="50" width="300" height="28" rx="4" fill={fill} stroke={stroke} />
        <text x="30" y="69" fontSize="11" fill={accent}>
          Totalmente de acuerdo ← sospechoso
        </text>
        <text x="20" y="110" fontSize="11" fill={muted}>
          Respuesta creíble: a veces / casi nunca (coherente con tu vida real)
        </text>
      </Frame>
    ),
  },
  "diag-giro-90": {
    caption: "Atajo: memoriza el ciclo horario de 4 direcciones; cada 90° avanza un paso.",
    node: (
      <Frame caption="Ciclo 90° horario" w={280} h={200}>
        <ArrowUp x={140} y={45} rot={0} />
        <text x={140} y={18} textAnchor="middle" fontSize="11" fill={muted}>
          ↑
        </text>
        <ArrowUp x={210} y={100} rot={90} />
        <text x={245} y={105} textAnchor="middle" fontSize="11" fill={muted}>
          →
        </text>
        <ArrowUp x={140} y={155} rot={180} />
        <text x={140} y={190} textAnchor="middle" fontSize="11" fill={muted}>
          ↓
        </text>
        <ArrowUp x={70} y={100} rot={270} />
        <text x={35} y={105} textAnchor="middle" fontSize="11" fill={muted}>
          ←
        </text>
        <text x={140} y={105} textAnchor="middle" fontSize="12" fill={accent}>
          ⟳
        </text>
      </Frame>
    ),
  },
  "diag-puntos": {
    caption: "Atajo: anota cuánto crece de un número al siguiente; el salto suele crecer.",
    node: (
      <Frame caption="Puntos en figuras" w={360} h={160}>
        {[2, 3, 5, 8].map((n, i) => (
          <g key={n}>
            <circle cx={45 + i * 80} cy={70} r={28} fill={fill} stroke={stroke} strokeWidth="2" />
            <text x={45 + i * 80} y={76} textAnchor="middle" fontSize="16" fill={stroke} fontWeight="700">
              {n}
            </text>
            {i < 3 ? (
              <text x={85 + i * 80} y={76} textAnchor="middle" fontSize="12" fill={accent}>
                +?
              </text>
            ) : (
              <text x={85 + i * 80} y={76} textAnchor="middle" fontSize="14" fill={accent}>
                →
              </text>
            )}
          </g>
        ))}
        <text x={340} y={76} textAnchor="middle" fontSize="16" fill={accent} fontWeight="700">
          ?
        </text>
      </Frame>
    ),
  },
  "diag-bn": {
    caption: "Atajo: con dos colores, usa impar / par según cómo empieza la fila.",
    node: (
      <Frame caption="Alternancia blanco / negro" w={340} h={140}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={20 + i * 50}
            y={40}
            width="40"
            height="40"
            fill={i % 2 === 0 ? "#ffffff" : "#1e293b"}
            stroke={stroke}
            strokeWidth="2"
          />
        ))}
        <text x={170} y={110} textAnchor="middle" fontSize="12" fill={muted}>
          1 · 2 · 3 · 4 · 5 · 6 · …
        </text>
      </Frame>
    ),
  },
  "diag-tamanos": {
    caption: "Atajo ciclo de 3: la posición 4 repite la 1; la 5 repite la 2…",
    node: (
      <Frame caption="Grande → mediana → pequeña" w={340} h={160}>
        <rect x="30" y="40" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="130" y="55" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="220" y="70" width="30" height="30" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="280" y={90} fontSize="22" fill={accent}>
          ?
        </text>
        <text x="65" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          1ª
        </text>
        <text x="155" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          2ª
        </text>
        <text x="235" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          3ª
        </text>
      </Frame>
    ),
  },
  "diag-mas-menos": {
    caption: "Atajo: solo hay dos símbolos; alternan uno sí y uno no.",
    node: (
      <Frame caption="Alterna ⊕ ⊖" w={320} h={130}>
        {["⊕", "⊖", "⊕", "⊖", "⊕", "?"].map((t, i) => (
          <g key={i}>
            <circle
              cx={35 + i * 50}
              cy={55}
              r={18}
              fill={i === 5 ? "#ede9fe" : fill}
              stroke={i === 5 ? accent : stroke}
              strokeWidth="2"
            />
            <text x={35 + i * 50} y={62} textAnchor="middle" fontSize="16" fill={stroke}>
              {t}
            </text>
          </g>
        ))}
      </Frame>
    ),
  },
  "espacial-cubo-pintado": {
    caption: "Atajo: clasifica cubitos por caras pintadas (esquina / arista / centro de cara).",
    node: (
      <Frame caption="Cubo 3×3×3 pintado por fuera" w={300} h={220}>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const x = 85 + c * 40;
            const y = 35 + r * 40;
            const center = r === 1 && c === 1;
            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width="36"
                height="36"
                fill={center ? accent : "#e2e8f0"}
                stroke={stroke}
                strokeWidth="2"
              />
            );
          })
        )}
        <text x="150" y="180" textAnchor="middle" fontSize="12" fill={accent} fontWeight="700">
          morado = centro de una cara
        </text>
        <text x="150" y="200" textAnchor="middle" fontSize="11" fill={muted}>
          ¿cuántas caras tiene el cubo grande?
        </text>
      </Frame>
    ),
  },
  "espacial-brujula": {
    caption: "Atajo: la dirección en la que miras al final = el último tramo del camino.",
    node: (
      <Frame caption="Camino por tramos" w={280} h={200}>
        <line x1="140" y1="160" x2="140" y2="90" stroke={stroke} strokeWidth="3" />
        <polygon points="140,70 132,90 148,90" fill={stroke} />
        <line x1="140" y1="80" x2="190" y2="80" stroke={accent} strokeWidth="3" />
        <line x1="200" y1="80" x2="200" y2="130" stroke={accent} strokeWidth="3" />
        <polygon points="200,145 192,125 208,125" fill={accent} />
        <text x="125" y="120" fontSize="11" fill={muted}>
          1
        </text>
        <text x="160" y="70" fontSize="11" fill={muted}>
          2
        </text>
        <text x="215" y="120" fontSize="11" fill={muted}>
          3
        </text>
        <circle cx="140" cy="160" r="5" fill={stroke} />
        <text x="140" y="185" textAnchor="middle" fontSize="11" fill={muted}>
          inicio
        </text>
      </Frame>
    ),
  },
  "espacial-espejo": {
    caption: "Atajo: en espejo vertical, piensa qué se mantiene y qué se invierte.",
    node: (
      <Frame caption="Espejo vertical" w={300} h={160}>
        <text x="80" y="70" textAnchor="middle" fontSize="36" fill={stroke} fontWeight="700">
          L
        </text>
        <line x1="150" y1="25" x2="150" y2="120" stroke={accent} strokeWidth="3" strokeDasharray="4 3" />
        <g transform="translate(220 70) scale(-1 1)">
          <text x="0" y="0" textAnchor="middle" fontSize="36" fill={stroke} fontWeight="700">
            L
          </text>
        </g>
        <text x="80" y="120" textAnchor="middle" fontSize="11" fill={muted}>
          original
        </text>
        <text x="220" y="120" textAnchor="middle" fontSize="11" fill={muted}>
          reflejo
        </text>
      </Frame>
    ),
  },
  "espacial-cilindro": {
    caption: "Atajo: la vista superior te dice la forma de la base del sólido.",
    node: (
      <Frame caption="Vista desde arriba" w={280} h={160}>
        <ellipse cx="140" cy="75" rx="55" ry="55" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="140" y="80" textAnchor="middle" fontSize="14" fill={muted}>
          círculo
        </text>
        <text x="140" y="150" textAnchor="middle" fontSize="11" fill={muted}>
          ¿qué sólido tiene esta vista?
        </text>
      </Frame>
    ),
  },
  "espacial-reloj": {
    caption: "Atajo: 90° = un cuarto de vuelta; antihorario va «hacia atrás» en el reloj.",
    node: (
      <Frame caption="Reloj" w={260} h={180}>
        <circle cx="130" cy="90" r="55" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="130" y1="90" x2="175" y2="90" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <text x="130" y="40" textAnchor="middle" fontSize="12" fill={stroke}>
          12
        </text>
        <text x="185" y="95" fontSize="12" fill={stroke}>
          3
        </text>
        <text x="130" y="155" textAnchor="middle" fontSize="11" fill={muted}>
          manecilla en las 3
        </text>
      </Frame>
    ),
  },
  "espacial-net-cruz": {
    caption: "Atajo: caras que comparten lado en el papel no pueden ser opuestas en el cubo.",
    node: (
      <Frame caption="Desarrollo en cruz" w={260} h={220}>
        <rect x="100" y="20" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="50" y="70" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="100" y="70" width="50" height="50" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="125" y="100" textAnchor="middle" fontSize="12" fill={accent}>
          centro
        </text>
        <rect x="150" y="70" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="100" y="120" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="100" y="170" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
      </Frame>
    ),
  },
  "espacial-doblez": {
    caption: "Atajo: al doblar, imagina el pliegue y hacia dónde se mueve cada punta.",
    node: (
      <Frame caption="Doblez horizontal" w={300} h={180}>
        <rect x="40" y="30" width="90" height="120" fill={fill} stroke={stroke} strokeWidth="2" />
        <ArrowUp x={85} y={90} rot={0} />
        <text x="85" y="165" textAnchor="middle" fontSize="11" fill={muted}>
          antes
        </text>
        <text x="145" y="95" fontSize="18" fill={accent}>
          →
        </text>
        <rect x="170" y="50" width="90" height="60" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="170" y1="80" x2="260" y2="80" stroke={accent} strokeWidth="2" strokeDasharray="4 3" />
        <text x="215" y="70" textAnchor="middle" fontSize="11" fill={muted}>
          pliegue
        </text>
        <text x="215" y="130" textAnchor="middle" fontSize="11" fill={accent}>
          ¿dónde queda la punta?
        </text>
      </Frame>
    ),
  },
  "espacial-cono-lado": {
    caption: "Atajo: no mezcles vista de lado con vista desde arriba.",
    node: (
      <Frame caption="Vistas de un cono" w={300} h={170}>
        <polygon points="70,40 30,130 110,130" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="70" y="155" textAnchor="middle" fontSize="11" fill={muted}>
          de lado
        </text>
        <ellipse cx="220" cy="90" rx="45" ry="45" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="220" y="155" textAnchor="middle" fontSize="11" fill={muted}>
          desde arriba
        </text>
      </Frame>
    ),
  },
  "espacial-escalera": {
    caption: "Atajo: desde el frente ignora la profundidad; mira solo la silueta.",
    node: (
      <Frame caption="Escalera: ¿frente o perfil?" w={300} h={180}>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={`f-${i}`}
            x={30}
            y={30 + i * 28}
            width={100}
            height="20"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        ))}
        <text x="80" y="160" textAnchor="middle" fontSize="11" fill={muted}>
          frente
        </text>
        <polyline
          points="180,140 200,120 220,120 240,100 260,100 280,80"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
        />
        <text x="230" y="160" textAnchor="middle" fontSize="11" fill={muted}>
          perfil
        </text>
      </Frame>
    ),
  },
  "espacial-mapa-180": {
    caption: "Atajo giro 180°: media vuelta; arriba/abajo e izquierda/derecha cambian juntos.",
    node: (
      <Frame caption="Giro del mapa 180°" w={300} h={180}>
        <rect x="30" y="30" width="90" height="90" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="50" r="10" fill={accent} />
        <text x="75" y="140" textAnchor="middle" fontSize="11" fill={muted}>
          marca arriba-izq
        </text>
        <text x="150" y="80" fontSize="18" fill={accent}>
          ⟳180°
        </text>
        <rect x="180" y="30" width="90" height="90" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="250" cy="100" r="10" fill="#ede9fe" stroke={accent} strokeWidth="2" strokeDasharray="3 2" />
        <text x="225" y="140" textAnchor="middle" fontSize="11" fill={muted}>
          ¿dónde queda?
        </text>
      </Frame>
    ),
  },
  "espacial-aristas": {
    caption: "Atajo: cuenta aristas de arriba, de abajo y las verticales (sin contar dos veces).",
    node: (
      <Frame caption="Aristas de un cubo" w={260} h={200}>
        <path
          d="M70,50 L160,50 L200,90 L110,90 Z"
          fill="#ede9fe"
          stroke={stroke}
          strokeWidth="2"
        />
        <path d="M70,50 L70,140 L110,180 L110,90" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M160,50 L160,140 L200,180 L200,90" fill="none" stroke={stroke} strokeWidth="2" />
        <line x1="70" y1="140" x2="160" y2="140" stroke={stroke} strokeWidth="2" />
        <line x1="110" y1="180" x2="200" y2="180" stroke={stroke} strokeWidth="2" />
        <text x="130" y="195" textAnchor="middle" fontSize="11" fill={muted}>
          cuenta cada arista una vez
        </text>
      </Frame>
    ),
  },
  "espacial-dos-cubos": {
    caption: "Atajo: caras visibles = caras totales − las que quedan pegadas por dentro.",
    node: (
      <Frame caption="2 cubos pegados" w={300} h={170}>
        <rect x="50" y="40" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="120" y="40" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="120" y1="40" x2="120" y2="110" stroke={accent} strokeWidth="3" strokeDasharray="4 3" />
        <text x="120" y="135" textAnchor="middle" fontSize="11" fill={accent}>
          unión (se ocultan caras)
        </text>
        <text x="150" y="155" textAnchor="middle" fontSize="11" fill={muted}>
          2×6 caras − ocultas = visibles
        </text>
      </Frame>
    ),
  },
  "espacial-caras-adyacentes": {
    caption: "Atajo: la tapa toca las paredes laterales; el fondo es la cara opuesta (no vecina).",
    node: (
      <Frame caption="Caras del cubo" w={280} h={180}>
        <rect x="90" y="20" width="70" height="40" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="125" y="45" textAnchor="middle" fontSize="11" fill={accent}>
          superior
        </text>
        <rect x="40" y="60" width="50" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="90" y="60" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="160" y="60" width="50" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="90" y="130" width="70" height="30" fill="#e2e8f0" stroke={stroke} strokeWidth="2" />
        <text x="125" y="150" textAnchor="middle" fontSize="10" fill={muted}>
          inferior
        </text>
      </Frame>
    ),
  },
  "diag-doble-regla": {
    caption: "Atajo: busca DOS cambios a la vez (p. ej. giro + relleno). Ambos deben cumplirse.",
    node: (
      <Frame caption="Serie: giro + relleno" w={360} h={160}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${40 + i * 80} 70)`}>
            <rect
              x={-22}
              y={-22}
              width="44"
              height="44"
              fill={i % 2 === 0 ? fill : "#1e293b"}
              stroke={stroke}
              strokeWidth="2"
              transform={`rotate(${i * 45})`}
            />
          </g>
        ))}
        <text x="340" y="75" textAnchor="middle" fontSize="22" fill={accent}>
          ?
        </text>
        <text x="180" y="140" textAnchor="middle" fontSize="11" fill={muted}>
          cada paso: +45° y alterna relleno
        </text>
      </Frame>
    ),
  },
  "diag-lados": {
    caption: "Atajo: cuenta lados (o puntas). Suele subir de 1 en 1.",
    node: (
      <Frame caption="¿Cuántos lados?" w={340} h={150}>
        <polygon points="50,110 70,50 90,110" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="120" y="55" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <polygon points="220,55 250,75 240,110 200,110 190,75" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="300" y="90" textAnchor="middle" fontSize="22" fill={accent}>
          ?
        </text>
        <text x="70" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          3
        </text>
        <text x="145" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          4
        </text>
        <text x="220" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          5
        </text>
      </Frame>
    ),
  },
  "diag-impar": {
    caption: "Atajo odd-one-out: busca la regla que cumplen 3 y rompe 1.",
    node: (
      <Frame caption="¿Cuál no encaja?" w={340} h={140}>
        {[
          { x: 40, fill: fill },
          { x: 110, fill: fill },
          { x: 180, fill: "#1e293b" },
          { x: 250, fill: fill },
        ].map((c, i) => (
          <g key={i}>
            <circle cx={c.x + 20} cy={60} r={22} fill={c.fill} stroke={stroke} strokeWidth="2" />
            <text x={c.x + 20} y={110} textAnchor="middle" fontSize="12" fill={muted}>
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        ))}
      </Frame>
    ),
  },
  "diag-analogia": {
    caption: "Atajo: A es a B como C es a ?. Traduce el cambio A→B y aplícalo a C.",
    node: (
      <Frame caption="Analogía de figuras" w={340} h={150}>
        <rect x="20" y="40" width="40" height="40" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="75" y="65" fontSize="16" fill={accent}>
          →
        </text>
        <rect x="95" y="40" width="40" height="40" fill="#1e293b" stroke={stroke} strokeWidth="2" />
        <text x="155" y="65" fontSize="18" fill={muted}>
          ::
        </text>
        <circle cx="200" cy={60} r={20} fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="240" y="65" fontSize="16" fill={accent}>
          →
        </text>
        <text x="280" y="68" fontSize="22" fill={accent}>
          ?
        </text>
        <text x="170" y="130" textAnchor="middle" fontSize="11" fill={muted}>
          mismo cambio de relleno
        </text>
      </Frame>
    ),
  },
  "diag-punto-esquina": {
    caption: "Atajo: el marcador suele avanzar una esquina por paso (horario o antihorario).",
    node: (
      <Frame caption="Punto en el borde" w={340} h={150}>
        {[0, 1, 2].map((i) => {
          const corners = [
            [18, 18],
            [52, 18],
            [52, 52],
            [18, 52],
          ];
          const [dx, dy] = corners[i % 4];
          return (
            <g key={i} transform={`translate(${30 + i * 100} 35)`}>
              <rect x="0" y="0" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
              <circle cx={dx} cy={dy} r="7" fill={accent} />
            </g>
          );
        })}
        <text x="320" y="75" fontSize="22" fill={accent}>
          ?
        </text>
      </Frame>
    ),
  },
  "diag-operador": {
    caption: "Atajo operadores: deduce qué hace cada caja con los ejemplos; luego aplícalo.",
    node: (
      <Frame caption="Entrada → operador → salida" w={340} h={150}>
        <polygon points="40,40 70,90 10,90" fill="#1e293b" stroke={stroke} strokeWidth="2" />
        <text x="90" y="70" fontSize="16" fill={muted}>
          →
        </text>
        <rect x="110" y="45" width="70" height="40" rx="6" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="145" y="70" textAnchor="middle" fontSize="11" fill={accent}>
          ? regla
        </text>
        <text x="200" y="70" fontSize="16" fill={muted}>
          →
        </text>
        <polygon points="250,90 280,40 220,40" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="170" y="130" textAnchor="middle" fontSize="11" fill={muted}>
          ejemplo: negro↑ → blanco↓ (¿qué hizo?)
        </text>
      </Frame>
    ),
  },
  "diag-matriz-suma": {
    caption: "Atajo matriz: prueba fila y columna. A menudo la 3ª celda combina las dos primeras.",
    node: (
      <Frame caption="Matriz 2×2 → falta una" w={260} h={200}>
        {[
          ["2", "3", "5"],
          ["4", "1", "5"],
          ["6", "4", "?"],
        ].map((row, r) =>
          row.map((v, c) => (
            <g key={`${r}-${c}`}>
              <rect
                x={30 + c * 70}
                y={20 + r * 55}
                width="58"
                height="48"
                fill={v === "?" ? "#ede9fe" : fill}
                stroke={v === "?" ? accent : stroke}
                strokeWidth="2"
              />
              <text
                x={59 + c * 70}
                y={50 + r * 55}
                textAnchor="middle"
                fontSize="16"
                fill={stroke}
                fontWeight="700"
              >
                {v}
              </text>
            </g>
          ))
        )}
      </Frame>
    ),
  },
  "diag-xor": {
    caption: "Atajo combinación: lo que está en ambas se cancela; lo único se queda.",
    node: (
      <Frame caption="A + B = ?" w={340} h={150}>
        <circle cx="50" cy="60" r="18" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="80" y="42" width="36" height="36" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="140" y="68" fontSize="18" fill={accent}>
          +
        </text>
        <rect x="170" y="42" width="36" height="36" fill={fill} stroke={stroke} strokeWidth="2" />
        <polygon points="230,42 248,78 212,78" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="270" y="68" fontSize="18" fill={accent}>
          =
        </text>
        <text x="310" y="72" fontSize="22" fill={accent}>
          ?
        </text>
        <text x="170" y="130" textAnchor="middle" fontSize="11" fill={muted}>
          el cuadrado se repite → se cancela
        </text>
      </Frame>
    ),
  },
  "diag-180-color": {
    caption: "Atajo: a veces el giro y el color cambian en pasos distintos (uno cada vez / uno cada dos).",
    node: (
      <Frame caption="Serie mixta" w={360} h={140}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${50 + i * 100} 55)`}>
            <ArrowUp x={0} y={0} rot={i * 180} />
            <circle cx="0" cy="0" r="28" fill={i % 2 === 0 ? fill : "#cbd5e1"} stroke={stroke} strokeWidth="2" opacity={0.35} />
          </g>
        ))}
        <text x="340" y="60" fontSize="22" fill={accent}>
          ?
        </text>
      </Frame>
    ),
  },
  "diag-simetria": {
    caption: "Atajo simetría: dobla mentalmente por el eje; si coinciden las mitades, es simétrica.",
    node: (
      <Frame caption="¿Cuál es simétrica vertical?" w={300} h={140}>
        <path d="M40,40 L70,100 L10,100 Z" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="40" y="125" textAnchor="middle" fontSize="11" fill={muted}>
          A
        </text>
        <rect x="120" y="40" width="50" height="60" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="145" y1="40" x2="145" y2="100" stroke={accent} strokeWidth="2" strokeDasharray="3 2" />
        <text x="145" y="125" textAnchor="middle" fontSize="11" fill={muted}>
          B
        </text>
        <path d="M220,50 L260,40 L250,100 L210,90 Z" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="235" y="125" textAnchor="middle" fontSize="11" fill={muted}>
          C
        </text>
      </Frame>
    ),
  },
  "diag-conteo": {
    caption: "Atajo: cuenta solo lo que pide (triángulos, líneas, cuadrados). Marca para no repetir.",
    node: (
      <Frame caption="¿Cuántos triángulos?" w={260} h={180}>
        <polygon points="130,20 220,150 40,150" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="130" y1="20" x2="130" y2="150" stroke={stroke} strokeWidth="2" />
        <line x1="85" y1="85" x2="175" y2="85" stroke={stroke} strokeWidth="2" />
        <text x="130" y="170" textAnchor="middle" fontSize="11" fill={muted}>
          grande + mitades + pequeños
        </text>
      </Frame>
    ),
  },
  "diag-borde-anillo": {
    caption: "Atajo: mira figura exterior e interior por separado (forma y relleno).",
    node: (
      <Frame caption="Exterior + interior" w={340} h={140}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${40 + i * 100} 30)`}>
            <rect x="0" y="0" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
            <circle
              cx="35"
              cy="35"
              r={12 + i * 2}
              fill={i === 1 ? "#1e293b" : fill}
              stroke={stroke}
              strokeWidth="2"
            />
          </g>
        ))}
        <text x="320" y="70" fontSize="22" fill={accent}>
          ?
        </text>
      </Frame>
    ),
  },
  "diag-posiciones": {
    caption: "Atajo posición: numera celdas 1–4 o usa reloj; avanza fijo cada paso.",
    node: (
      <Frame caption="Ficha que se mueve" w={300} h={160}>
        {[0, 1, 2].map((step) => (
          <g key={step} transform={`translate(${20 + step * 95} 25)`}>
            <rect x="0" y="0" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
            <line x1="35" y1="0" x2="35" y2="70" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="0" y1="35" x2="70" y2="35" stroke="#e2e8f0" strokeWidth="1" />
            <circle
              cx={step % 2 === 0 ? 17 : 52}
              cy={step < 2 ? 17 : 52}
              r="10"
              fill={accent}
            />
          </g>
        ))}
        <text x="285" y="65" fontSize="22" fill={accent}>
          ?
        </text>
      </Frame>
    ),
  },
  "esp-net-cruz-letras": {
    caption: "Atajo: en línea recta, caras con 1 en medio suelen ser opuestas al plegar.",
    node: (
      <Frame caption="Dado desarmado (cruz)" w={260} h={220}>
        <CubeNet
          ox={70}
          oy={15}
          size={40}
          cells={[
            { c: 1, r: 0, label: "A", fill: "#ede9fe" },
            { c: 0, r: 1, label: "B" },
            { c: 1, r: 1, label: "C" },
            { c: 2, r: 1, label: "D" },
            { c: 1, r: 2, label: "E" },
            { c: 1, r: 3, label: "F" },
          ]}
        />
      </Frame>
    ),
  },
  "esp-net-opuesta-a": {
    caption: "Atajo: A—C—E en columna: A opuesta a E (C en el medio).",
    node: (
      <Frame caption="¿Opuesta a A?" w={240} h={220}>
        <CubeNet
          ox={60}
          oy={15}
          size={40}
          cells={[
            { c: 1, r: 0, label: "A", fill: "#ede9fe", ink: accent },
            { c: 0, r: 1, label: "B" },
            { c: 1, r: 1, label: "C" },
            { c: 2, r: 1, label: "D" },
            { c: 1, r: 2, label: "E" },
            { c: 1, r: 3, label: "F" },
          ]}
        />
      </Frame>
    ),
  },
  "esp-net-invalida-2x2": {
    caption: "Atajo: un bloque 2×2 en el desarrollo NO forma cubo (las caras se solapan).",
    node: (
      <Frame caption="¿Cuál NO forma cubo?" w={320} h={160}>
        <text x="70" y="18" textAnchor="middle" fontSize="11" fill={muted}>
          A (válida)
        </text>
        <CubeNet
          ox={20}
          oy={28}
          size={28}
          cells={[
            { c: 1, r: 0 },
            { c: 0, r: 1 },
            { c: 1, r: 1 },
            { c: 2, r: 1 },
            { c: 1, r: 2 },
            { c: 1, r: 3 },
          ]}
        />
        <text x="220" y="18" textAnchor="middle" fontSize="11" fill={accent}>
          B (inválida)
        </text>
        <CubeNet
          ox={170}
          oy={40}
          size={28}
          cells={[
            { c: 0, r: 0, fill: "#fee2e2" },
            { c: 1, r: 0, fill: "#fee2e2" },
            { c: 0, r: 1, fill: "#fee2e2" },
            { c: 1, r: 1, fill: "#fee2e2" },
            { c: 2, r: 1 },
            { c: 3, r: 1 },
          ]}
        />
      </Frame>
    ),
  },
  "esp-net-zigzag": {
    caption: "Atajo: 6 caras unidas por lados; revisa que no haya solapes al plegar.",
    node: (
      <Frame caption="Desarrollo en Z" w={280} h={180}>
        <CubeNet
          ox={40}
          oy={30}
          size={36}
          cells={[
            { c: 0, r: 0, label: "1" },
            { c: 1, r: 0, label: "2" },
            { c: 1, r: 1, label: "3" },
            { c: 2, r: 1, label: "4" },
            { c: 2, r: 2, label: "5" },
            { c: 3, r: 2, label: "6" },
          ]}
        />
      </Frame>
    ),
  },
  "esp-net-t": {
    caption: "Atajo forma T: opuestos = caras con exactamente una en medio en línea recta.",
    node: (
      <Frame caption="Desarrollo en T" w={260} h={200}>
        <CubeNet
          ox={50}
          oy={20}
          size={38}
          cells={[
            { c: 0, r: 0, label: "P" },
            { c: 1, r: 0, label: "Q", fill: "#ede9fe" },
            { c: 2, r: 0, label: "R" },
            { c: 1, r: 1, label: "S" },
            { c: 1, r: 2, label: "T" },
            { c: 1, r: 3, label: "U" },
          ]}
        />
      </Frame>
    ),
  },
  "esp-net-numeros": {
    caption: "Atajo: en el net, opuestos no se tocan; en dado clásico además suman 7.",
    node: (
      <Frame caption="Net de dado (opuestos = 7)" w={260} h={220}>
        <CubeNet
          ox={70}
          oy={15}
          size={40}
          cells={[
            { c: 1, r: 0, label: "1" },
            { c: 0, r: 1, label: "2" },
            { c: 1, r: 1, label: "3" },
            { c: 2, r: 1, label: "5" },
            { c: 1, r: 2, label: "6", fill: "#ede9fe" },
            { c: 1, r: 3, label: "4" },
          ]}
        />
      </Frame>
    ),
  },
  "esp-dado-abierto": {
    caption: "Atajo: 3 caras visibles se tocan en un vértice; ninguna es opuesta a otra visible.",
    node: (
      <Frame caption="Dado: 3 caras visibles" w={260} h={180}>
        <DiceFace x={90} y={30} n={1} size={70} />
        <DiceFace x={40} y={90} n={2} size={55} />
        <DiceFace x={150} y={90} n={3} size={55} />
        <text x={130} y={170} textAnchor="middle" fontSize="11" fill={muted}>
          1 arriba · 2 y 3 laterales
        </text>
      </Frame>
    ),
  },
  "esp-dado-opuesta-vista": {
    caption: "Atajo: caras visibles nunca son opuestas entre sí; usa suma 7 para las ocultas.",
    node: (
      <Frame caption="Caras visibles 5, 3, 4" w={280} h={170}>
        <DiceFace x={110} y={20} n={5} size={60} />
        <DiceFace x={55} y={85} n={3} size={50} />
        <DiceFace x={165} y={85} n={4} size={50} />
      </Frame>
    ),
  },
  "esp-cubo-pintado-2": {
    caption: "Atajo n×n×n: cubitos con 1 cara = (n−2)² × 6.",
    node: (
      <Frame caption="Cubo 4×4×4 pintado" w={280} h={200}>
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            const edge = r === 0 || r === 3 || c === 0 || c === 3;
            const corner = (r === 0 || r === 3) && (c === 0 || c === 3);
            return (
              <rect
                key={`${r}-${c}`}
                x={70 + c * 32}
                y={30 + r * 32}
                width="28"
                height="28"
                fill={corner ? "#94a3b8" : edge ? "#cbd5e1" : accent}
                stroke={stroke}
                strokeWidth="1.5"
              />
            );
          })
        )}
        <text x={140} y={175} textAnchor="middle" fontSize="11" fill={accent}>
          morado ≈ zona de 1 cara
        </text>
      </Frame>
    ),
  },
  "esp-cubo-pintado-0": {
    caption: "Atajo: 0 caras pintadas = interior = (n−2)³.",
    node: (
      <Frame caption="Núcleo sin pintura" w={240} h={160}>
        <rect x="50" y="30" width="140" height="100" fill="#e2e8f0" stroke={stroke} strokeWidth="2" />
        <rect x="85" y="55" width="70" height="50" fill={accent} stroke={stroke} strokeWidth="2" />
        <text x="120" y={145} textAnchor="middle" fontSize="11" fill={muted}>
          interior
        </text>
      </Frame>
    ),
  },
  "esp-vistas-orto": {
    caption: "Atajo: planta = arriba; alzado = frente; perfil = lado.",
    node: (
      <Frame caption="Vistas" w={320} h={150}>
        <rect x="30" y="40" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="55" y="120" textAnchor="middle" fontSize="11" fill={muted}>
          frente
        </text>
        <ellipse cx="160" cy={65} rx="30" ry="30" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="160" y="120" textAnchor="middle" fontSize="11" fill={muted}>
          arriba
        </text>
        <polygon points="260,35 290,90 230,90" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="260" y="120" textAnchor="middle" fontSize="11" fill={muted}>
          lado
        </text>
      </Frame>
    ),
  },
  "esp-estructura-cubos": {
    caption: "Atajo: cuenta por capas; incluye cubos ocultos detrás.",
    node: (
      <Frame caption="Estructura de cubitos" w={260} h={180}>
        <rect x="80" y="100" width="40" height="40" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="120" y="100" width="40" height="40" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="160" y="100" width="40" height="40" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="120" y="60" width="40" height="40" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <rect x="120" y="20" width="40" height="40" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="130" y="165" textAnchor="middle" fontSize="11" fill={muted}>
          base 3 + torre 2
        </text>
      </Frame>
    ),
  },
  "esp-papel-agujeros": {
    caption: "Atajo: cada doblez puede duplicar el agujero al desplegar.",
    node: (
      <Frame caption="Papel doblado + agujero" w={300} h={160}>
        <rect x="30" y="30" width="90" height="90" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="30" y1="75" x2="120" y2="75" stroke={accent} strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="75" cy="55" r="8" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <text x="75" y="140" textAnchor="middle" fontSize="11" fill={muted}>
          1 doblez
        </text>
        <text x="160" y="80" fontSize="18" fill={accent}>
          →
        </text>
        <rect x="190" y="30" width="90" height="90" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="235" cy="55" r="8" fill="#ede9fe" stroke={accent} strokeWidth="2" />
        <circle cx="235" cy="95" r="8" fill="#ede9fe" stroke={accent} strokeWidth="2" strokeDasharray="3 2" />
        <text x="235" y="140" textAnchor="middle" fontSize="11" fill={muted}>
          al abrir
        </text>
      </Frame>
    ),
  },
  "esp-giro-objeto": {
    caption: "Atajo: gira el objeto el ángulo pedido; no lo confundas con un espejo.",
    node: (
      <Frame caption="Giro 90° horario" w={300} h={150}>
        <polygon points="50,40 90,40 90,100 50,100" fill={fill} stroke={stroke} strokeWidth="2" />
        <polygon points="50,40 70,20 90,40" fill={accent} stroke={stroke} strokeWidth="2" />
        <text x="130" y="75" fontSize="18" fill={accent}>
          ⟳90°
        </text>
        <text x="220" y="80" fontSize="22" fill={accent}>
          ?
        </text>
      </Frame>
    ),
  },
  "esp-sombra": {
    caption: "Atajo: la sombra es la proyección según la dirección de la luz.",
    node: (
      <Frame caption="Luz desde arriba" w={280} h={150}>
        <polygon points="80,30 120,50 120,110 80,90" fill="#cbd5e1" stroke={stroke} strokeWidth="2" />
        <polygon points="80,30 140,30 180,50 120,50" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="200" y="40" fontSize="12" fill={accent}>
          luz ↓
        </text>
        <rect x="90" y="120" width="80" height="18" fill="#ede9fe" stroke={accent} strokeWidth="2" />
      </Frame>
    ),
  },
  "esp-net-letra": {
    caption: "Atajo: al plegar, respeta la orientación de cada letra en su cara.",
    node: (
      <Frame caption="Net F/L/U/R/B/D" w={260} h={200}>
        <CubeNet
          ox={70}
          oy={20}
          size={38}
          cells={[
            { c: 1, r: 0, label: "F" },
            { c: 0, r: 1, label: "L" },
            { c: 1, r: 1, label: "U" },
            { c: 2, r: 1, label: "R" },
            { c: 1, r: 2, label: "B" },
            { c: 1, r: 3, label: "D" },
          ]}
        />
      </Frame>
    ),
  },
  "esp-net-cinco-linea": {
    caption: "Atajo: 5+ cuadrados en una sola fila recta → no forma cubo.",
    node: (
      <Frame caption="Fila demasiado larga" w={320} h={120}>
        <CubeNet
          ox={20}
          oy={35}
          size={32}
          cells={[
            { c: 0, r: 0, fill: "#fee2e2" },
            { c: 1, r: 0, fill: "#fee2e2" },
            { c: 2, r: 0, fill: "#fee2e2" },
            { c: 3, r: 0, fill: "#fee2e2" },
            { c: 4, r: 0, fill: "#fee2e2" },
            { c: 2, r: 1 },
          ]}
        />
      </Frame>
    ),
  },
  "esp-dado-suma7": {
    caption: "Atajo clásico: 1↔6, 2↔5, 3↔4 (suman 7).",
    node: (
      <Frame caption="Pares opuestos del dado" w={300} h={140}>
        <DiceFace x={30} y={40} n={1} size={50} />
        <text x="95" y="75" fontSize="16" fill={accent}>
          ↔
        </text>
        <DiceFace x={120} y={40} n={6} size={50} />
        <DiceFace x={200} y={40} n={3} size={50} />
        <text x="265" y="75" fontSize="16" fill={accent}>
          ↔4
        </text>
      </Frame>
    ),
  },
  "esp-net-opuesta-q": {
    caption: "Atajo T: Q—S—T—U en columna; Q opuesta a T (una en medio: S).",
    node: (
      <Frame caption="Opuesta a Q" w={260} h={200}>
        <CubeNet
          ox={50}
          oy={20}
          size={38}
          cells={[
            { c: 0, r: 0, label: "P" },
            { c: 1, r: 0, label: "Q", fill: "#ede9fe", ink: accent },
            { c: 2, r: 0, label: "R" },
            { c: 1, r: 1, label: "S" },
            { c: 1, r: 2, label: "T" },
            { c: 1, r: 3, label: "U" },
          ]}
        />
      </Frame>
    ),
  },
  "ind-triangulares": {
    caption: "Atajo: triangulares = 1+2+3+…+n = n(n+1)/2.",
    node: (
      <Frame caption="Números triangulares" w={320} h={150}>
        {[1, 2, 3, 4].map((n, i) => (
          <g key={n} transform={`translate(${30 + i * 75} 30)`}>
            {Array.from({ length: n }).map((_, r) =>
              Array.from({ length: r + 1 }).map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={20 + c * 12 - r * 6}
                  cy={20 + r * 14}
                  r="5"
                  fill={accent}
                />
              ))
            )}
            <text x="20" y="100" textAnchor="middle" fontSize="12" fill={muted}>
              {[(n * (n + 1)) / 2]}
            </text>
          </g>
        ))}
      </Frame>
    ),
  },
  "ind-logica-flecha": {
    caption: "Atajo: «si A entonces B» no implica «si B entonces A».",
    node: (
      <Frame caption="Implicación" w={300} h={130}>
        <text x="50" y="50" fontSize="14" fill={stroke}>
          A
        </text>
        <text x="90" y="50" fontSize="18" fill={accent}>
          ⇒
        </text>
        <text x="130" y="50" fontSize="14" fill={stroke}>
          B
        </text>
        <text x="50" y="95" fontSize="12" fill={muted}>
          B cierto
        </text>
        <text x="130" y="95" fontSize="12" fill={accent}>
          ¿A? no seguro
        </text>
      </Frame>
    ),
  },
  "seq-intercalada": {
    caption: "Atajo intercalada: mira posiciones impares y pares por separado.",
    node: (
      <Frame caption="Dos series en una" w={340} h={120}>
        {["1", "2", "3", "4", "5", "6", "?"].map((t, i) => (
          <g key={i}>
            <circle
              cx={30 + i * 45}
              cy={50}
              r="16"
              fill={i % 2 === 0 ? "#ede9fe" : fill}
              stroke={stroke}
              strokeWidth="2"
            />
            <text x={30 + i * 45} y={55} textAnchor="middle" fontSize="13" fill={stroke}>
              {t}
            </text>
          </g>
        ))}
        <text x="170" y="100" textAnchor="middle" fontSize="11" fill={muted}>
          morado = serie A · blanco = serie B
        </text>
      </Frame>
    ),
  },
  "seq-diferencias": {
    caption: "Atajo: anota las diferencias; si crecen, el patrón está ahí.",
    node: (
      <Frame caption="Diferencias crecientes" w={340} h={130}>
        {["3", "4", "6", "9", "13", "?"].map((t, i) => (
          <text key={i} x={30 + i * 55} y={50} textAnchor="middle" fontSize="18" fill={stroke} fontWeight="700">
            {t}
          </text>
        ))}
        {["+1", "+2", "+3", "+4", "+?"].map((t, i) => (
          <text key={t} x={55 + i * 55} y={90} textAnchor="middle" fontSize="12" fill={accent}>
            {t}
          </text>
        ))}
      </Frame>
    ),
  },
  // Figuras SHL/Kenexa: el caption vive dentro del Frame (sin spoiler duplicado aquí).
  ...Object.fromEntries(
    Object.entries(DIAGRAMATICO_FIGURES).map(([id, fig]) => [id, { node: fig.node, caption: undefined as string | undefined }]),
  ),
};

export function AbstractFigure({ id }: { id?: string | null }) {
  if (!id) return null;
  const fig = FIGURES[id];
  if (!fig) return null;
  return (
    <div className="my-2">
      {fig.node}
      {fig.caption ? (
        <p className="text-[12px] text-center leading-snug text-[#6d28d9] font-medium px-1">{fig.caption}</p>
      ) : null}
    </div>
  );
}

export function hasAbstractFigure(id?: string | null): boolean {
  return Boolean(id && FIGURES[id]);
}
