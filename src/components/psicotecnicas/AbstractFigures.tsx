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

function Gear({ x, y, r, label }: { x: number; y: number; r: number; label: string }) {
  const teeth = 10;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.35) / teeth) * Math.PI * 2;
    const a2 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.85) / teeth) * Math.PI * 2;
    pts.push(`${x + Math.cos(a0) * r},${y + Math.sin(a0) * r}`);
    pts.push(`${x + Math.cos(a1) * (r + 6)},${y + Math.sin(a1) * (r + 6)}`);
    pts.push(`${x + Math.cos(a2) * (r + 6)},${y + Math.sin(a2) * (r + 6)}`);
    pts.push(`${x + Math.cos(a3) * r},${y + Math.sin(a3) * r}`);
  }
  return (
    <g>
      <polygon points={pts.join(" ")} fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx={x} cy={y} r={r * 0.35} fill="white" stroke={stroke} strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fill={stroke} fontWeight="700">
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
        <Gear x={110} y={90} r={40} label="A" />
        <Gear x={210} y={90} r={40} label="B" />
        <path d="M70,50 A40,40 0 0,1 110,50" fill="none" stroke={accent} strokeWidth="2" markerEnd="url(#arrow)" />
        <text x={70} y={40} fontSize="11" fill={accent}>
          ↻
        </text>
        <text x={230} y={40} fontSize="11" fill={accent}>
          ↺
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
  "orden-alturas": {
    caption: "Dibuja flechas «más alto que» y cuenta quién queda arriba.",
    node: (
      <Frame caption="Mapa de alturas" h={160} w={320}>
        <text x="40" y="80" fontSize="13" fill={stroke}>
          María
        </text>
        <text x="100" y="50" fontSize="18" fill={accent}>
          ↑
        </text>
        <text x="130" y="80" fontSize="13" fill={stroke}>
          Pedro = Bea
        </text>
        <text x="230" y="50" fontSize="18" fill={accent}>
          ↑
        </text>
        <text x="260" y="80" fontSize="13" fill={stroke}>
          Juan
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
  "familia-arbol": {
    caption: "Empieza por el final de la frase y sube el árbol.",
    node: (
      <Frame caption="Árbol familiar simplificado" h={180} w={280}>
        <text x="140" y="40" textAnchor="middle" fontSize="12" fill={stroke}>
          padre
        </text>
        <line x1="140" y1="48" x2="140" y2="70" stroke={muted} />
        <text x="140" y="90" textAnchor="middle" fontSize="12" fill={accent}>
          yo
        </text>
        <line x1="140" y1="98" x2="90" y2="120" stroke={muted} />
        <line x1="140" y1="98" x2="190" y2="120" stroke={muted} />
        <text x="90" y="140" textAnchor="middle" fontSize="11" fill={stroke}>
          hermana
        </text>
        <text x="190" y="140" textAnchor="middle" fontSize="11" fill={stroke}>
          hijo
        </text>
      </Frame>
    ),
  },
  "plantilla-hueco": {
    caption: "Busca el hueco más raro y descarta piezas que no lo tapan.",
    node: (
      <Frame caption="Plantilla y piezas" h={160} w={320}>
        <rect x="30" y="40" width="100" height="80" fill={fill} stroke={stroke} strokeWidth="2" />
        <rect x="55" y="55" width="25" height="25" fill="white" stroke={accent} strokeWidth="2" />
        <circle cx="105" cy="80" r="12" fill="white" stroke={stroke} strokeWidth="2" />
        <rect x="160" y="50" width="40" height="40" fill="#ede9fe" stroke={stroke} />
        <circle cx="230" cy="70" r="20" fill="#e2e8f0" stroke={stroke} />
        <rect x="270" y="55" width="25" height="25" fill="#c4b5fd" stroke={accent} strokeWidth="2" />
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
};

export function AbstractFigure({ id }: { id?: string | null }) {
  if (!id) return null;
  const fig = FIGURES[id];
  if (!fig) return null;
  return <>{fig.node}</>;
}

export function hasAbstractFigure(id?: string | null): boolean {
  return Boolean(id && FIGURES[id]);
}
