"use client";

import type { ReactNode } from "react";

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
    caption: "Sigue la panza de la R: espejo ≠ giro 180°.",
    node: (
      <Frame caption="Misma letra R, tres transformaciones" w={360} h={220}>
        <text x={60} y={28} textAnchor="middle" fontSize="12" fill={muted}>
          Original
        </text>
        <LetterR x={60} y={110} />
        <text x={180} y={28} textAnchor="middle" fontSize="12" fill={muted}>
          Espejo vertical
        </text>
        <LetterR x={180} y={110} mirror />
        <text x={300} y={28} textAnchor="middle" fontSize="12" fill={muted}>
          Giro 180°
        </text>
        <LetterR x={300} y={110} rot={180} />
        <text x={180} y={200} textAnchor="middle" fontSize="11" fill={accent}>
          No son la misma figura
        </text>
      </Frame>
    ),
  },
  "matriz-puntos": {
    caption: "Regla A (número): fila × columna. Regla B (relleno): columnas blanco → gris → negro. Falta 3×3 negro = 9.",
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
    caption: "En un dado estándar, caras opuestas suman 7 (1-6, 2-5, 3-4).",
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
    caption: "Atajo horario: arriba → derecha → abajo → izquierda → arriba.",
    node: (
      <Frame caption="Giro 90° horario" w={340} h={200}>
        <ArrowUp x={50} y={90} rot={0} />
        <text x={50} y={155} textAnchor="middle" fontSize="11" fill={muted}>
          ahora ↑
        </text>
        <text x={110} y={95} fill={accent} fontSize="22">
          →
        </text>
        <ArrowUp x={170} y={90} rot={90} />
        <text x={170} y={155} textAnchor="middle" fontSize="11" fill={accent}>
          siguiente →
        </text>
        <text x={250} y={50} fontSize="11" fill={muted}>
          ciclo:
        </text>
        <text x={250} y={75} fontSize="12" fill={stroke}>
          ↑ → ↓ ←
        </text>
      </Frame>
    ),
  },
  "diag-puntos": {
    caption: "Atajo: mira cuánto crece de un número al siguiente (+1,+2,+3…).",
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
                +{i + 1}
              </text>
            ) : (
              <text x={85 + i * 80} y={76} textAnchor="middle" fontSize="14" fill={accent}>
                +? →
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
    caption: "Atajo: posiciones impares = un color; pares = el otro.",
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
          1B 2N 3B 4N 5B 6N…
        </text>
      </Frame>
    ),
  },
  "diag-tamanos": {
    caption: "Atajo ciclo de 3: posición 4 = misma que 1; 5 = misma que 2…",
    node: (
      <Frame caption="Grande → mediana → pequeña" w={340} h={160}>
        <rect x="30" y="40" width="70" height="70" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="130" y="55" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="220" y="70" width="30" height="30" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="280" y={90} fontSize="22" fill={accent}>
          ?
        </text>
        <text x="65" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          1ª G
        </text>
        <text x="155" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          2ª M
        </text>
        <text x="235" y="135" textAnchor="middle" fontSize="11" fill={muted}>
          3ª P
        </text>
      </Frame>
    ),
  },
  "diag-mas-menos": {
    caption: "Atajo: impar ⊕, par ⊖ (o al revés si el enunciado lo dice).",
    node: (
      <Frame caption="Alterna ⊕ ⊖" w={320} h={130}>
        {["⊕", "⊖", "⊕", "⊖", "⊕", "?"].map((t, i) => (
          <g key={i}>
            <circle cx={35 + i * 50} cy={55} r={18} fill={i === 5 ? "#ede9fe" : fill} stroke={i === 5 ? accent : stroke} strokeWidth="2" />
            <text x={35 + i * 50} y={62} textAnchor="middle" fontSize="16" fill={stroke}>
              {t}
            </text>
          </g>
        ))}
      </Frame>
    ),
  },
  "espacial-cubo-pintado": {
    caption: "Atajo 3×3×3: 1 cara = centro de cada cara grande → 6.",
    node: (
      <Frame caption="Cubo 3×3×3 pintado por fuera" w={300} h={230}>
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
        <text x="150" y="175" textAnchor="middle" fontSize="12" fill={accent} fontWeight="700">
          centro = 1 cara pintada
        </text>
        <text x="150" y="198" textAnchor="middle" fontSize="11" fill={muted}>
          6 caras del cubo → 6 cubitos
        </text>
        <text x="150" y="218" textAnchor="middle" fontSize="11" fill={muted}>
          esquinas=3 · aristas=2 · centro cara=1
        </text>
      </Frame>
    ),
  },
  "espacial-brujula": {
    caption: "Atajo: la dirección final es el último tramo del camino.",
    node: (
      <Frame caption="Camino N → E → S" w={280} h={200}>
        <line x1="140" y1="160" x2="140" y2="90" stroke={stroke} strokeWidth="3" />
        <polygon points="140,70 132,90 148,90" fill={stroke} />
        <line x1="140" y1="80" x2="190" y2="80" stroke={accent} strokeWidth="3" />
        <line x1="200" y1="80" x2="200" y2="130" stroke={accent} strokeWidth="3" />
        <polygon points="200,145 192,125 208,125" fill={accent} />
        <text x="125" y="120" fontSize="11" fill={muted}>
          N
        </text>
        <text x="160" y="70" fontSize="11" fill={muted}>
          E
        </text>
        <text x="210" y="120" fontSize="11" fill={accent}>
          S ← miras aquí
        </text>
        <circle cx="140" cy="160" r="5" fill={stroke} />
      </Frame>
    ),
  },
  "espacial-espejo": {
    caption: "Espejo vertical: izquierda↔derecha; arriba/abajo igual.",
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
    caption: "Vista desde arriba circular → cuerpo redondo (cilindro/cono).",
    node: (
      <Frame caption="Vista superior" w={280} h={180}>
        <ellipse cx="90" cy="90" rx="45" ry="45" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="90" y="95" textAnchor="middle" fontSize="12" fill={muted}>
          arriba
        </text>
        <text x="170" y="70" fontSize="18" fill={accent}>
          →
        </text>
        <ellipse cx="230" cy="50" rx="35" ry="12" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="195" y1="50" x2="195" y2="130" stroke={stroke} strokeWidth="2" />
        <line x1="265" y1="50" x2="265" y2="130" stroke={stroke} strokeWidth="2" />
        <ellipse cx="230" cy="130" rx="35" ry="12" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="230" y="165" textAnchor="middle" fontSize="11" fill={muted}>
          cilindro
        </text>
      </Frame>
    ),
  },
  "espacial-reloj": {
    caption: "Girar el reloj 90° antihorario: la manecilla «salta» una hora atrás en apariencia.",
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
          apunta a las 3
        </text>
      </Frame>
    ),
  },
  "espacial-net-cruz": {
    caption: "En cruz: la cara del extremo opuesto al brazo largo suele ser la opuesta al centro.",
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
    caption: "Atajo: al doblar, la punta se acerca al pliegue (no gira sola).",
    node: (
      <Frame caption="Doblez horizontal" w={300} h={180}>
        <rect x="40" y="30" width="90" height="120" fill={fill} stroke={stroke} strokeWidth="2" />
        <ArrowUp x={85} y={90} rot={0} />
        <text x="85" y="165" textAnchor="middle" fontSize="11" fill={muted}>
          antes ↑
        </text>
        <text x="145" y="95" fontSize="18" fill={accent}>
          →
        </text>
        <rect x="170" y="50" width="90" height="60" fill={fill} stroke={stroke} strokeWidth="2" />
        <line x1="170" y1="80" x2="260" y2="80" stroke={accent} strokeWidth="2" strokeDasharray="4 3" />
        <text x="215" y="70" textAnchor="middle" fontSize="11" fill={accent}>
          punta → pliegue
        </text>
        <text x="215" y="130" textAnchor="middle" fontSize="11" fill={muted}>
          después
        </text>
      </Frame>
    ),
  },
  "espacial-cono-lado": {
    caption: "Atajo: cono de lado = triángulo; desde arriba = círculo.",
    node: (
      <Frame caption="Vistas del cono" w={300} h={170}>
        <polygon points="70,40 30,130 110,130" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="70" y="155" textAnchor="middle" fontSize="11" fill={muted}>
          lateral
        </text>
        <ellipse cx="220" cy="90" rx="45" ry="45" fill={fill} stroke={stroke} strokeWidth="2" />
        <text x="220" y="155" textAnchor="middle" fontSize="11" fill={muted}>
          desde arriba
        </text>
      </Frame>
    ),
  },
  "espacial-escalera": {
    caption: "Atajo: de frente los peldaños = franjas horizontales.",
    node: (
      <Frame caption="Escalera de frente" w={260} h={180}>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={40}
            y={30 + i * 30}
            width={180 - i * 10}
            height="22"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        ))}
        <text x="130" y="165" textAnchor="middle" fontSize="11" fill={muted}>
          rectángulos / líneas
        </text>
      </Frame>
    ),
  },
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
