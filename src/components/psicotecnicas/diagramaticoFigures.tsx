"use client";

import type { ReactNode } from "react";

/**
 * Biblioteca de figuras diagramáticas (estilo SHL / Kenexa) para práctica profesional.
 * Regla de oro: ni el SVG ni los captions revelan la regla ni la respuesta.
 */

export type FigDef = { caption?: string; node: ReactNode };

const stroke = "#1e293b";
const muted = "#64748b";
const fill = "#f8fafc";
const accent = "#6d28d9";
const soft = "#e2e8f0";
const dark = "#1e293b";
const grayFill = "#94a3b8";

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/** 0 = blanco, 1 = negro, 2 = gris */
type F = 0 | 1 | 2;
const fillOf = (f: F) => (f === 1 ? dark : f === 2 ? grayFill : fill);

const rad = (d: number) => (d * Math.PI) / 180;
const f2 = (n: number) => Math.round(n * 100) / 100;

function polyPts(n: number, r: number, rot = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = rad(rot + (360 / n) * i - 90);
    return `${f2(r * Math.cos(a))},${f2(r * Math.sin(a))}`;
  }).join(" ");
}

function starPts(R: number) {
  const ri = R * 0.45;
  return Array.from({ length: 10 }, (_, i) => {
    const rr = i % 2 === 0 ? R : ri;
    const a = rad(i * 36 - 90);
    return `${f2(rr * Math.cos(a))},${f2(rr * Math.sin(a))}`;
  }).join(" ");
}

function headPath(x: number, y: number, aDeg: number, len = 6, sp = 30) {
  const p1x = f2(x - len * Math.cos(rad(aDeg + sp)));
  const p1y = f2(y - len * Math.sin(rad(aDeg + sp)));
  const p2x = f2(x - len * Math.cos(rad(aDeg - sp)));
  const p2y = f2(y - len * Math.sin(rad(aDeg - sp)));
  return `M${p1x},${p1y} L${x},${y} L${p2x},${p2y}`;
}

const CAP_SET = "Conjuntos A y B";
const CAP_OP = "Entrada → operador → ?";
const CAP_FIND_OP = "Entrada → ? → salida";
const CAP_FIND_IN = "? → operador → salida";
const CAP_SER = "Serie → ?";
const CAP_MTX = "Matriz → ?";
const CAP_ANA = "A → B, C → ?";
const CAP_ODD = "Figuras A–E";

/* ------------------------------------------------------------------ */
/* Marco                                                               */
/* ------------------------------------------------------------------ */

function Frame({
  children,
  caption,
  w = 400,
  h = 260,
}: {
  children: ReactNode;
  caption?: string;
  w?: number;
  h?: number;
}) {
  return (
    <figure className="mx-auto my-2 w-full max-w-[460px] overflow-visible rounded-lg border border-black/10 bg-white p-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mx-auto block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={caption ?? "Figura"}
      >
        {children}
      </svg>
      {caption ? (
        <figcaption className="mt-1.5 text-center text-[11px] leading-snug text-slate-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Formas básicas                                                      */
/* ------------------------------------------------------------------ */

type K = "c" | "s" | "t" | "d" | "h" | "p" | "st" | "e";

function Sh({
  k,
  f = 0,
  r = 9,
  rot = 0,
  x = 0,
  y = 0,
}: {
  k: K;
  f?: F;
  r?: number;
  rot?: number;
  x?: number;
  y?: number;
}) {
  const p = { fill: fillOf(f), stroke, strokeWidth: 2, strokeLinejoin: "round" as const };
  let body: ReactNode;
  if (k === "c") body = <circle r={r} {...p} />;
  else if (k === "e") body = <ellipse rx={r * 1.35} ry={r * 0.7} {...p} />;
  else if (k === "s") body = <rect x={-r * 0.9} y={-r * 0.9} width={r * 1.8} height={r * 1.8} {...p} />;
  else if (k === "t") body = <polygon points={polyPts(3, r * 1.15)} {...p} />;
  else if (k === "d") body = <polygon points={polyPts(4, r * 1.2)} {...p} />;
  else if (k === "h") body = <polygon points={polyPts(6, r)} {...p} />;
  else if (k === "p") body = <polygon points={polyPts(5, r)} {...p} />;
  else body = <polygon points={starPts(r * 1.2)} {...p} />;
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>{body}</g>;
}

type It = { k: K; f?: F; r?: number; rot?: number };
const I = (k: K, f: F = 0, r?: number): It => ({ k, f, r });

/** Fila horizontal de formas centrada en el origen. */
function Row({ items, gap = 22, r = 8 }: { items: It[]; gap?: number; r?: number }) {
  return (
    <g>
      {items.map((it, i) => (
        <Sh
          key={i}
          k={it.k}
          f={it.f ?? 0}
          r={it.r ?? r}
          rot={it.rot ?? 0}
          x={(i - (items.length - 1) / 2) * gap}
        />
      ))}
    </g>
  );
}

/** Grupo de formas en posiciones libres. */
function Cluster({
  pts,
  kinds,
  fills,
  r = 8,
}: {
  pts: [number, number][];
  kinds: K[];
  fills: F[];
  r?: number;
}) {
  return (
    <g>
      {pts.map(([x, y], i) => (
        <Sh key={i} k={kinds[i % kinds.length]} f={fills[i % fills.length]} r={r} x={x} y={y} />
      ))}
    </g>
  );
}

/* Glifos asimétricos (cajas de ±16) */
const GLYPH = {
  wedge: "M-14,-14 L14,-14 L-14,14 Z",
  hook: "M-12,-14 L2,-14 Q14,-14 14,-2 L14,14 L4,14 L4,-2 L-12,-2 Z",
  pee: "M-10,14 L-10,-14 L4,-14 Q14,-14 14,-5 Q14,4 4,4 L-2,4 L-2,14 Z",
  arrow: "M0,-16 L11,-3 L4,-3 L4,15 L-4,15 L-4,-3 L-11,-3 Z",
  tri: "M0,-15 L13,12 L-13,12 Z",
} as const;
type GName = keyof typeof GLYPH;

function Gl({
  g,
  f = 0,
  s = 1,
  rot = 0,
  sx = 1,
  sy = 1,
  x = 0,
  y = 0,
}: {
  g: GName;
  f?: F;
  s?: number;
  rot?: number;
  sx?: number;
  sy?: number;
  x?: number;
  y?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx * s} ${sy * s})`}>
      <path d={GLYPH[g]} fill={fillOf(f)} stroke={stroke} strokeWidth={2 / s} strokeLinejoin="round" />
    </g>
  );
}

type GI = { g: GName; f?: F; sx?: number; sy?: number; rot?: number };
function GRow({ items, gap = 30, s = 0.8 }: { items: GI[]; gap?: number; s?: number }) {
  return (
    <g>
      {items.map((it, i) => (
        <Gl
          key={i}
          g={it.g}
          f={it.f ?? 0}
          s={s}
          sx={it.sx}
          sy={it.sy}
          rot={it.rot}
          x={(i - (items.length - 1) / 2) * gap}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Reloj                                                               */
/* ------------------------------------------------------------------ */

function Clock({ hs, hl, r = 31 }: { hs: number; hl: number; r?: number }) {
  const pt = (n: number, rr: number): [number, number] => {
    const a = rad(n * 30 - 90);
    return [f2(rr * Math.cos(a)), f2(rr * Math.sin(a))];
  };
  const [sx, sy] = pt(hs, r - 20);
  const [lx, ly] = pt(hl, r - 11);
  return (
    <g>
      <circle r={r} fill="#fff" stroke={stroke} strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const [x, y] = pt(n, r - 6);
        return (
          <text
            key={n}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={7.5}
            fill={muted}
          >
            {n}
          </text>
        );
      })}
      <line x1={0} y1={0} x2={sx} y2={sy} stroke={dark} strokeWidth={3.6} strokeLinecap="round" />
      <line x1={0} y1={0} x2={lx} y2={ly} stroke={dark} strokeWidth={1.6} strokeLinecap="round" />
      <circle r={2.2} fill={dark} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Conjuntos A / B                                                     */
/* ------------------------------------------------------------------ */

const SET_H = 262;

function SetBlock({ a, b, test }: { a: ReactNode[]; b: ReactNode[]; test: ReactNode }) {
  const xs = [124, 232, 340];
  const rows = [
    { y: 46, label: "Set A", items: a },
    { y: 128, label: "Set B", items: b },
  ];
  return (
    <g>
      {rows.map((r) => (
        <g key={r.label}>
          <text x={10} y={r.y} fontSize={13} fontWeight={600} fill={dark} dominantBaseline="central">
            {r.label}
          </text>
          <rect x={72} y={r.y - 38} width={322} height={76} rx={10} fill="#fff" stroke={soft} strokeWidth={1.5} />
          {r.items.map((it, i) => (
            <g key={i} transform={`translate(${xs[i]} ${r.y})`}>
              {it}
            </g>
          ))}
        </g>
      ))}
      <line x1={10} x2={394} y1={170} y2={170} stroke={soft} strokeWidth={1.2} strokeDasharray="3 4" />
      <text x={10} y={212} fontSize={22} fontWeight={700} fill={accent} dominantBaseline="central">
        ?
      </text>
      <rect
        x={178}
        y={174}
        width={108}
        height={76}
        rx={10}
        fill="#fff"
        stroke={accent}
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      <g transform="translate(232 212)">{test}</g>
    </g>
  );
}

function SetFig({ a, b, test }: { a: ReactNode[]; b: ReactNode[]; test: ReactNode }) {
  return (
    <Frame caption={CAP_SET} h={SET_H}>
      <SetBlock a={a} b={b} test={test} />
    </Frame>
  );
}

/* --- Ítems de conjuntos --- */

function MirrorPair({
  g,
  mode,
  fl,
  fr,
}: {
  g: GName;
  mode: "m" | "c" | "r" | "v";
  fl: F;
  fr: F;
}) {
  return (
    <g>
      <Gl g={g} f={fl} s={0.85} x={-19} />
      <Gl
        g={g}
        f={fr}
        s={0.85}
        x={19}
        sx={mode === "m" ? -1 : 1}
        sy={mode === "v" ? -1 : 1}
        rot={mode === "r" ? 180 : 0}
      />
    </g>
  );
}

function SemiPair() {
  const d = "M6,-16 A16,16 0 0 0 6,16 Z";
  return (
    <g>
      <g transform="translate(-19 0)">
        <path d={d} fill={dark} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      </g>
      <g transform="translate(19 0) scale(-1 1)">
        <path d={d} fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      </g>
    </g>
  );
}

function Flower({ on }: { on: number[] }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = i * 45;
        return on.includes(i) ? (
          <ellipse
            key={i}
            cx={0}
            cy={-19}
            rx={6}
            ry={11}
            transform={`rotate(${a})`}
            fill={dark}
            stroke={stroke}
            strokeWidth={1.5}
          />
        ) : (
          <circle
            key={i}
            cx={f2(19 * Math.sin(rad(a)))}
            cy={f2(-19 * Math.cos(rad(a)))}
            r={1.8}
            fill={soft}
          />
        );
      })}
      <circle r={5} fill={fill} stroke={stroke} strokeWidth={2} />
    </g>
  );
}

function PolyBox({ pts, dots }: { pts: [number, number][]; dots: [number, number][] }) {
  return (
    <g>
      <rect x={-20} y={-20} width={40} height={40} fill="none" stroke={stroke} strokeWidth={2} />
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={muted}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.8} fill={dark} stroke="#fff" strokeWidth={1} />
      ))}
    </g>
  );
}

function Grid2({ g, bar, dots }: { g: F[]; bar: number; dots: number }) {
  const cells: [number, number][] = [
    [-18, -30],
    [0, -30],
    [-18, -12],
    [0, -12],
  ];
  return (
    <g>
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={18} height={18} fill={fillOf(g[i])} stroke={stroke} strokeWidth={2} />
      ))}
      <rect x={-bar / 2} y={14} width={bar} height={6} fill={muted} />
      {Array.from({ length: dots }, (_, i) => (
        <circle key={i} cx={(i - (dots - 1) / 2) * 10} cy={30} r={3} fill={dark} />
      ))}
    </g>
  );
}

function StarsArc({ g }: { g: F[] }) {
  const angs = [-66, -22, 22, 66];
  return (
    <g transform="translate(0 6)">
      <path d="M-27,7 A28,28 0 0 1 27,7" fill="none" stroke={soft} strokeWidth={2} />
      <path d="M-19,9 A20,20 0 0 1 19,9" fill="none" stroke={soft} strokeWidth={2} />
      {angs.map((a, i) => (
        <Sh
          key={i}
          k="st"
          f={g[i]}
          r={6}
          x={f2(28 * Math.sin(rad(a)))}
          y={f2(14 - 28 * Math.cos(rad(a)))}
        />
      ))}
    </g>
  );
}

const sw = { stroke, strokeWidth: 2.5, strokeLinejoin: "round" as const };

function NestItem({ v }: { v: string }) {
  switch (v) {
    case "A1":
      return (
        <g>
          <circle r={26} fill="#fff" {...sw} />
          <Sh k="s" f={1} r={8} />
        </g>
      );
    case "A2":
      return (
        <g>
          <polygon points={polyPts(3, 29)} fill="#fff" {...sw} />
          <Sh k="c" f={1} r={7} />
        </g>
      );
    case "A3":
      return (
        <g>
          <rect x={-26} y={-26} width={52} height={52} fill="#fff" {...sw} />
          <Sh k="t" f={2} r={8} />
        </g>
      );
    case "B1":
      return (
        <g transform="translate(0 -4)">
          <path d="M-24,24 V-4 A24,24 0 0 1 24,-4 V24" fill="none" {...sw} />
          <circle cx={0} cy={15} r={9} fill={dark} stroke={stroke} strokeWidth={2} />
        </g>
      );
    case "B2":
      return (
        <g transform="translate(0 -4)">
          <path d="M-26,24 L0,-26 L26,24" fill="none" {...sw} />
          <rect x={-8} y={9} width={16} height={15} fill={grayFill} stroke={stroke} strokeWidth={2} />
        </g>
      );
    case "B3":
      return (
        <g transform="translate(0 -8)">
          <path d="M-26,24 A26,26 0 0 1 26,24" fill="none" {...sw} />
          <polygon points="-10,24 10,24 0,6" fill={dark} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
        </g>
      );
    default:
      return (
        <g transform="translate(0 -4)">
          <path d="M-22,24 V-4 L0,-26 L22,-4 V24" fill="none" {...sw} />
          <polygon
            points="0,24 9,14 0,4 -9,14"
            fill={grayFill}
            stroke={stroke}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

const CLUSTER6: [number, number][] = [
  [-20, -16],
  [0, -18],
  [20, -14],
  [-18, 14],
  [2, 16],
  [20, 12],
];
const KINDS6: K[] = ["c", "s", "t", "d", "h", "p"];
function Blacks({ mask, shift }: { mask: F[]; shift: number }) {
  return (
    <Cluster
      pts={CLUSTER6}
      kinds={KINDS6.map((_, i) => KINDS6[(i + shift) % 6])}
      fills={mask}
      r={7.5}
    />
  );
}

function Arrows3({ a }: { a: number[] }) {
  return <GRow items={a.map((d) => ({ g: "arrow" as GName, f: 1 as F, rot: d }))} gap={27} s={0.7} />;
}

function Corners({ c, mid }: { c: number[]; mid: "c" | "s" | null }) {
  const P: [number, number][] = [
    [-20, -20],
    [20, -20],
    [20, 20],
    [-20, 20],
  ];
  return (
    <g>
      <rect x={-20} y={-20} width={40} height={40} fill="#fff" stroke={stroke} strokeWidth={2} />
      {mid ? <Sh k={mid} f={0} r={6} /> : null}
      {P.map(([x, y], i) => (c[i] ? <circle key={i} cx={x} cy={y} r={6} fill={dark} stroke="#fff" strokeWidth={1.5} /> : null))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Operadores                                                          */
/* ------------------------------------------------------------------ */

type Op =
  | "swap"
  | "reflectH"
  | "reflectV"
  | "rotCcw"
  | "rotCw"
  | "shade"
  | "size"
  | "sun"
  | "gear"
  | "tri"
  | "shift"
  | "shadeTri";

function QMark({ size }: { size: number }) {
  return (
    <g>
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        rx={8}
        fill="#fff"
        stroke={accent}
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.42}
        fontWeight={700}
        fill={accent}
      >
        ?
      </text>
    </g>
  );
}

function OpIcon({ kind, s = 40 }: { kind: Op | "?"; s?: number }) {
  if (kind === "?") return <QMark size={s} />;
  const k = s / 40;
  const line = {
    fill: "none",
    stroke: accent,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const reflectH = (
    <g {...line}>
      <line x1={0} y1={-14} x2={0} y2={14} strokeDasharray="3 3" />
      <polygon points="-3,-9 -3,9 -14,9" />
      <polygon points="3,-9 3,9 14,9" fill={accent} />
    </g>
  );
  const rotCcw = (
    <g {...line}>
      <path d="M9,-6.3 A11,11 0 1 0 5.5,9.5" />
      <path d={headPath(5.5, 9.5, -30, 6.5)} />
    </g>
  );
  let icon: ReactNode;
  switch (kind) {
    case "swap":
      icon = (
        <g {...line}>
          <path d="M-12,-5 H11 M5,-11 L11,-5 L5,1" />
          <path d="M12,6 H-11 M-5,0 L-11,6 L-5,12" />
        </g>
      );
      break;
    case "reflectH":
      icon = reflectH;
      break;
    case "reflectV":
      icon = <g transform="rotate(90)">{reflectH}</g>;
      break;
    case "rotCcw":
      icon = rotCcw;
      break;
    case "rotCw":
      icon = <g transform="scale(-1 1)">{rotCcw}</g>;
      break;
    case "shade":
      icon = (
        <g {...line}>
          <rect x={-11} y={-11} width={22} height={22} rx={2} />
          <polygon points="-11,-11 11,-11 -11,11" fill={accent} />
        </g>
      );
      break;
    case "size":
      icon = (
        <g {...line}>
          <circle r={12} />
          <circle r={4.5} fill={accent} />
        </g>
      );
      break;
    case "sun":
      icon = (
        <g {...line}>
          <circle r={5} fill={accent} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = rad(i * 45);
            return (
              <line
                key={i}
                x1={f2(8 * Math.cos(a))}
                y1={f2(8 * Math.sin(a))}
                x2={f2(13 * Math.cos(a))}
                y2={f2(13 * Math.sin(a))}
              />
            );
          })}
        </g>
      );
      break;
    case "gear":
      icon = (
        <g {...line}>
          <polygon points={polyPts(8, 12, 22.5)} />
          <circle r={4} />
        </g>
      );
      break;
    case "tri":
      icon = (
        <g {...line}>
          <polygon points={polyPts(3, 13)} />
        </g>
      );
      break;
    case "shift":
      icon = (
        <g {...line}>
          <path d="M3,-9 L-5,0 L3,9" />
          <path d="M12,-9 L4,0 L12,9" />
        </g>
      );
      break;
    default:
      icon = (
        <g {...line}>
          <polygon points={polyPts(3, 13)} />
          <polygon points="0,-13 0,6.5 -11.26,6.5" fill={accent} />
        </g>
      );
  }
  return (
    <g transform={`scale(${k})`}>
      <rect x={-20} y={-20} width={40} height={40} rx={9} fill="#fff" stroke={accent} strokeWidth={2} />
      {icon}
    </g>
  );
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  if (x2 - x1 < 6) return null;
  return (
    <g stroke={muted} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={f2(x1)} y1={y} x2={f2(x2)} y2={y} />
      <path d={`M${f2(x2 - 6)},${y - 4} L${f2(x2)},${y} L${f2(x2 - 6)},${y + 4}`} />
    </g>
  );
}

function Card({
  x,
  y,
  s = 1,
  q = false,
  children,
}: {
  x: number;
  y: number;
  s?: number;
  q?: boolean;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${f2(x)} ${y})`}>
      {q ? (
        <QMark size={72 * s} />
      ) : (
        <>
          <rect
            x={-36 * s}
            y={-36 * s}
            width={72 * s}
            height={72 * s}
            rx={8}
            fill="#fff"
            stroke={soft}
            strokeWidth={1.5}
          />
          <g transform={`scale(${s})`}>{children}</g>
        </>
      )}
    </g>
  );
}

/** Entrada → operadores → salida (cualquiera puede ser "?"). */
function Flow({
  y,
  wd = 400,
  x0 = 0,
  s = 1,
  inp,
  ops,
  out,
}: {
  y: number;
  wd?: number;
  x0?: number;
  s?: number;
  inp: ReactNode;
  ops: (Op | "?")[];
  out: ReactNode;
}) {
  const n = ops.length + 2;
  const cx = (i: number) => x0 + (wd * (i + 0.5)) / n;
  const half = (i: number) => (i === 0 || i === n - 1 ? 36 * s : 20 * s);
  return (
    <g>
      {Array.from({ length: n - 1 }, (_, i) => (
        <Arrow key={i} x1={cx(i) + half(i) + 4} x2={cx(i + 1) - half(i + 1) - 4} y={y} />
      ))}
      <Card x={cx(0)} y={y} s={s} q={inp === "?"}>
        {inp}
      </Card>
      {ops.map((o, i) => (
        <g key={i} transform={`translate(${f2(cx(i + 1))} ${y})`}>
          <OpIcon kind={o} s={40 * s} />
        </g>
      ))}
      <Card x={cx(n - 1)} y={y} s={s} q={out === "?"}>
        {out}
      </Card>
    </g>
  );
}

function Opts({ items, y, w = 400 }: { items: ReactNode[]; y: number; w?: number }) {
  const n = items.length;
  const pitch = w / n;
  const card = Math.min(84, pitch - 12);
  const s = Math.min(1, (card - 6) / 72);
  return (
    <g>
      {items.map((it, i) => (
        <g key={i} transform={`translate(${f2(pitch * (i + 0.5))} ${y})`}>
          <rect
            x={-card / 2}
            y={-card / 2}
            width={card}
            height={card}
            rx={8}
            fill="#fff"
            stroke={soft}
            strokeWidth={1.5}
          />
          <g transform={`scale(${f2(s)})`}>{it}</g>
          <text y={card / 2 + 14} textAnchor="middle" fontSize={13} fontWeight={600} fill={dark}>
            {"ABCDE"[i]}
          </text>
        </g>
      ))}
    </g>
  );
}

function Divider({ y, w = 400 }: { y: number; w?: number }) {
  return <line x1={10} x2={w - 10} y1={y} y2={y} stroke={soft} strokeWidth={1.2} strokeDasharray="3 4" />;
}

/** Plantilla: filas de flujo (ejemplo + pregunta) y opciones A–D. */
function Task({
  caption = CAP_OP,
  rows,
  opts,
}: {
  caption?: string;
  rows: { inp: ReactNode; ops: (Op | "?")[]; out: ReactNode }[];
  opts: ReactNode[];
}) {
  return (
    <Frame caption={caption} h={304}>
      {rows.map((r, i) => (
        <Flow key={i} y={46 + 82 * i} inp={r.inp} ops={r.ops} out={r.out} />
      ))}
      {rows.length > 1 ? <Divider y={87} /> : null}
      <Opts items={opts} y={236} />
    </Frame>
  );
}

/* --- Ítems de operadores --- */

function Bars({ b }: { b: [number, F][] }) {
  return (
    <g>
      <line x1={-34} x2={34} y1={26} y2={26} stroke={soft} strokeWidth={1.5} />
      {b.map(([h, f], i) => (
        <rect
          key={i}
          x={(i - 1) * 22 - 7}
          y={26 - h}
          width={14}
          height={h}
          fill={fillOf(f)}
          stroke={stroke}
          strokeWidth={2}
        />
      ))}
    </g>
  );
}

function Split({ m }: { m: F[] }) {
  const P = ["-22,-22 22,-22 0,0", "22,-22 22,22 0,0", "22,22 -22,22 0,0", "-22,22 -22,-22 0,0"];
  return (
    <g>
      {P.map((p, i) => (
        <polygon key={i} points={p} fill={fillOf(m[i])} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      ))}
    </g>
  );
}

/** Tres círculos en fila; el central cambia de tamaño. */
function Mid3({ f = [0, 1, 0], r = [9, 5, 4] }: { f?: F[]; r?: number[] }) {
  return (
    <g>
      {[-25, 0, 25].map((x, i) => (
        <circle key={i} cx={x} cy={0} r={r[i]} fill={fillOf(f[i])} stroke={stroke} strokeWidth={2} />
      ))}
    </g>
  );
}

function Ls({ a }: { a: number[] }) {
  return (
    <g>
      {a.map((d, i) => (
        <path
          key={i}
          transform={`translate(${(i - 1) * 25} 0) rotate(${d})`}
          d="M-8,-10 V9 H9"
          fill="none"
          stroke={stroke}
          strokeWidth={4.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
      ))}
    </g>
  );
}

function ArcRow({ a }: { a: (number | null)[] }) {
  return (
    <g>
      {a.map((d, i) =>
        d === null ? null : (
          <g
            key={i}
            transform={`translate(${(i - 1.5) * 18} 0) rotate(${d})`}
            fill="none"
            stroke={stroke}
            strokeWidth={2.4}
            strokeLinecap="round"
          >
            <path d="M-7,3.5 A7,7 0 0 1 7,3.5" />
            <path d="M-3.5,3.5 A3.5,3.5 0 0 1 3.5,3.5" />
          </g>
        ),
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Series / matrices                                                   */
/* ------------------------------------------------------------------ */

function Series({ items, y, w = 400 }: { items: ReactNode[]; y: number; w?: number }) {
  const n = items.length;
  const pitch = w / n;
  const card = Math.min(72, pitch - 8);
  const s = Math.min(1, card / 72);
  return (
    <g>
      {items.map((it, i) => (
        <g key={i} transform={`translate(${f2(pitch * (i + 0.5))} ${y})`}>
          {it === "?" ? (
            <QMark size={card} />
          ) : (
            <>
              <rect
                x={-card / 2}
                y={-card / 2}
                width={card}
                height={card}
                rx={8}
                fill="#fff"
                stroke={soft}
                strokeWidth={1.5}
              />
              <g transform={`scale(${f2(s)})`}>{it}</g>
            </>
          )}
        </g>
      ))}
    </g>
  );
}

/** Serie arriba + opciones A–D abajo. */
function SeriesFig({
  items,
  opts,
  w = 400,
  caption = CAP_SER,
}: {
  items: ReactNode[];
  opts: ReactNode[];
  w?: number;
  caption?: string;
}) {
  return (
    <Frame caption={caption} w={w} h={222}>
      <Series items={items} y={46} w={w} />
      <Opts items={opts} y={150} w={w} />
    </Frame>
  );
}

function Matrix({ cells, y0 = 34, scale = 0.75 }: { cells: ReactNode[][]; y0?: number; scale?: number }) {
  const xs = [142, 200, 258];
  return (
    <g>
      {cells.map((row, r) =>
        row.map((c, k) => (
          <g key={`${r}-${k}`} transform={`translate(${xs[k]} ${y0 + r * 58})`}>
            {c === "?" ? (
              <QMark size={54} />
            ) : (
              <>
                <rect x={-27} y={-27} width={54} height={54} rx={6} fill="#fff" stroke={soft} strokeWidth={1.5} />
                <g transform={`scale(${scale})`}>{c}</g>
              </>
            )}
          </g>
        )),
      )}
    </g>
  );
}

function MatrixFig({ cells, opts }: { cells: ReactNode[][]; opts: ReactNode[] }) {
  return (
    <Frame caption={CAP_MTX} h={312}>
      <Matrix cells={cells} />
      <Opts items={opts} y={240} />
    </Frame>
  );
}

function Marks({ m }: { m: string }) {
  return (
    <g>
      {m.includes("c") ? <Sh k="c" f={1} r={10} x={-14} y={-12} /> : null}
      {m.includes("s") ? <Sh k="s" f={0} r={10} x={14} y={-12} /> : null}
      {m.includes("t") ? <Sh k="t" f={2} r={10} x={0} y={14} /> : null}
    </g>
  );
}

function Sides({ s }: { s: string }) {
  const h = 17;
  const common = { stroke, strokeWidth: 5, strokeLinecap: "square" as const };
  return (
    <g>
      <rect
        x={-h}
        y={-h}
        width={2 * h}
        height={2 * h}
        fill="none"
        stroke={soft}
        strokeWidth={1.5}
        strokeDasharray="2 3"
      />
      {s.includes("T") ? <line x1={-h} y1={-h} x2={h} y2={-h} {...common} /> : null}
      {s.includes("R") ? <line x1={h} y1={-h} x2={h} y2={h} {...common} /> : null}
      {s.includes("B") ? <line x1={-h} y1={h} x2={h} y2={h} {...common} /> : null}
      {s.includes("L") ? <line x1={-h} y1={-h} x2={-h} y2={h} {...common} /> : null}
    </g>
  );
}

function SqDot({ pos, f }: { pos: number; f: F }) {
  const P: [number, number][] = [
    [-13, -13],
    [13, -13],
    [13, 13],
    [-13, 13],
  ];
  return (
    <g>
      <rect x={-22} y={-22} width={44} height={44} rx={3} fill="#fff" stroke={stroke} strokeWidth={2} />
      <circle cx={P[pos][0]} cy={P[pos][1]} r={6} fill={fillOf(f)} stroke={stroke} strokeWidth={2} />
    </g>
  );
}

function NestPoly({ n, f }: { n: number; f: F }) {
  return (
    <g>
      <polygon points={polyPts(n, 27)} fill="#fff" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />
      <circle r={8} fill={fillOf(f)} stroke={stroke} strokeWidth={2} />
    </g>
  );
}

function Bin({ v }: { v: number }) {
  return (
    <g>
      <line x1={-30} x2={30} y1={30} y2={30} stroke={soft} strokeWidth={1.5} />
      {[4, 2, 1].map((w, i) => {
        const on = (v & w) !== 0;
        return (
          <rect
            key={i}
            x={(i - 1) * 18 - 6}
            y={on ? -26 : 18}
            width={12}
            height={on ? 52 : 8}
            rx={2}
            fill={on ? dark : soft}
            stroke={on ? stroke : muted}
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  );
}

function Layered({ dash, mid, dot }: { dash: boolean; mid: K; dot: number }) {
  const P: [number, number][] = [
    [-15, -15],
    [15, -15],
    [15, 15],
    [-15, 15],
  ];
  return (
    <g>
      <rect
        x={-24}
        y={-24}
        width={48}
        height={48}
        rx={3}
        fill="#fff"
        stroke={stroke}
        strokeWidth={2.2}
        strokeDasharray={dash ? "6 4" : undefined}
      />
      <Sh k={mid} f={2} r={9} />
      <circle cx={P[dot][0]} cy={P[dot][1]} r={3.6} fill={dark} />
    </g>
  );
}

function Dots({ n }: { n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={(i - (n - 1) / 2) * 10} cy={22} r={3.2} fill={dark} />
      ))}
    </g>
  );
}

/* Analogías */
function SqDiag() {
  return (
    <g>
      <rect x={-18} y={-18} width={36} height={36} fill="#fff" {...sw} />
      <line x1={-18} y1={-18} x2={18} y2={18} stroke={stroke} strokeWidth={2.5} />
    </g>
  );
}
function TwoTris() {
  return (
    <g>
      <polygon points="-18,-18 18,-18 18,18" transform="translate(3 -3)" fill="#fff" {...sw} />
      <polygon points="-18,-18 -18,18 18,18" transform="translate(-3 3)" fill="#fff" {...sw} />
    </g>
  );
}
function CircDiam() {
  return (
    <g>
      <circle r={18} fill="#fff" {...sw} />
      <line x1={-18} y1={0} x2={18} y2={0} stroke={stroke} strokeWidth={2.5} />
    </g>
  );
}
function TwoSemis() {
  return (
    <g>
      <path d="M-18,0 A18,18 0 0 1 18,0 Z" transform="translate(0 -3)" fill="#fff" {...sw} />
      <path d="M-18,0 A18,18 0 0 0 18,0 Z" transform="translate(0 3)" fill="#fff" {...sw} />
    </g>
  );
}
function OneSemi() {
  return <path d="M-18,6 A18,18 0 0 1 18,6 Z" fill="#fff" {...sw} />;
}
function Unequal() {
  return (
    <g>
      <path d="M-16.12,-8 A18,18 0 0 1 16.12,-8 Z" transform="translate(0 -3)" fill="#fff" {...sw} />
      <path d="M-16.12,-8 A18,18 0 1 0 16.12,-8 Z" transform="translate(0 3)" fill="#fff" {...sw} />
    </g>
  );
}

/** A → B   C → ? */
function AnaFig({
  a,
  b,
  c,
  opts,
}: {
  a: ReactNode;
  b: ReactNode;
  c: ReactNode;
  opts: ReactNode[];
}) {
  const y = 46;
  const s = 0.8;
  return (
    <Frame caption={CAP_ANA} h={222}>
      <Card x={50} y={y} s={s}>
        {a}
      </Card>
      <Arrow x1={50 + 29 + 4} x2={130 - 29 - 4} y={y} />
      <Card x={130} y={y} s={s}>
        {b}
      </Card>
      {[-6, 6].map((dy) =>
        [-3, 3].map((dx) => <circle key={`${dx}-${dy}`} cx={200 + dx} cy={y + dy} r={1.6} fill={muted} />),
      )}
      <Card x={270} y={y} s={s}>
        {c}
      </Card>
      <Arrow x1={270 + 29 + 4} x2={350 - 29 - 4} y={y} />
      <Card x={350} y={y} s={s} q />
      <Opts items={opts} y={150} />
    </Frame>
  );
}

/* Impares */
const ODD_H = 116;
function OddFig({ items }: { items: ReactNode[] }) {
  return (
    <Frame caption={CAP_ODD} h={ODD_H}>
      <Opts items={items} y={52} />
    </Frame>
  );
}

const CNT: Record<number, [number, number][]> = {
  2: [
    [-13, -6],
    [13, 8],
  ],
  3: [
    [-14, -12],
    [14, -8],
    [0, 15],
  ],
  4: [
    [-15, -13],
    [15, -17],
    [-9, 15],
    [17, 11],
  ],
  5: [
    [-18, -16],
    [18, -16],
    [0, 0],
    [-18, 16],
    [18, 16],
  ],
};
function CountFig({ n, shift }: { n: number; shift: number }) {
  const kinds: K[] = ["c", "s", "t", "d", "h"];
  return (
    <Cluster
      pts={CNT[n]}
      kinds={kinds.map((_, i) => kinds[(i + shift) % 5])}
      fills={[0, 1, 0, 1, 1]}
      r={7.5}
    />
  );
}

const SYM: Record<string, string> = {
  kite: "M0,-26 L17,-2 L0,26 L-17,-2 Z",
  house: "M-18,24 V-2 L0,-24 L18,-2 V24 Z",
  crown: "M-22,20 V-6 L-11,6 L0,-16 L11,6 L22,-6 V20 Z",
  cross: "M-6,-24 H6 V-6 H26 V6 H6 V24 H-6 V6 H-14 V-6 H-6 Z",
  chevron: "M-22,12 L0,-14 L22,12 L13,16 L0,2 L-13,16 Z",
};
function SymShape({ d, f }: { d: string; f: F }) {
  return <path d={SYM[d]} fill={fillOf(f)} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />;
}

/* ------------------------------------------------------------------ */
/* Figuras                                                             */
/* ------------------------------------------------------------------ */

const clk = (hs: number, hl: number) => <Clock hs={hs} hl={hl} />;

export const DIAGRAMATICO_FIGURES: Record<string, FigDef> = {
  /* ===================== CONJUNTOS ===================== */

  "dpro-set-clock-parity": {
    caption: CAP_SET,
    node: <SetFig a={[clk(3, 8), clk(7, 12), clk(4, 9)]} b={[clk(2, 4), clk(8, 6), clk(10, 12)]} test={clk(6, 9)} />,
  },

  "dpro-set-clock-sum": {
    caption: CAP_SET,
    node: <SetFig a={[clk(3, 4), clk(8, 5), clk(2, 9)]} b={[clk(4, 6), clk(7, 5), clk(9, 3)]} test={clk(10, 5)} />,
  },

  "dpro-set-mirror": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <MirrorPair key="a1" g="hook" mode="m" fl={1} fr={0} />,
          <MirrorPair key="a2" g="wedge" mode="m" fl={0} fr={1} />,
          <MirrorPair key="a3" g="pee" mode="m" fl={1} fr={0} />,
        ]}
        b={[
          <MirrorPair key="b1" g="hook" mode="c" fl={1} fr={0} />,
          <MirrorPair key="b2" g="wedge" mode="r" fl={0} fr={1} />,
          <MirrorPair key="b3" g="pee" mode="v" fl={1} fr={0} />,
        ]}
        test={<SemiPair />}
      />
    ),
  },

  "dpro-set-petal": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[<Flower key="a1" on={[0, 2, 3, 6]} />, <Flower key="a2" on={[0, 1, 4, 5, 7]} />, <Flower key="a3" on={[0, 3, 5]} />]}
        b={[<Flower key="b1" on={[1, 2, 5, 7]} />, <Flower key="b2" on={[2, 3, 4, 6]} />, <Flower key="b3" on={[1, 4, 6]} />]}
        test={<Flower on={[0, 1, 3, 4, 6]} />}
      />
    ),
  },

  "dpro-set-polyline": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <PolyBox
            key="a1"
            pts={[[-30, -24], [-8, 10], [10, -12], [30, 20]]}
            dots={[[-14, -8], [26, -28]]}
          />,
          <PolyBox
            key="a2"
            pts={[[-30, 10], [-10, -18], [14, 16], [30, -10]]}
            dots={[[0, 0], [-26, 26]]}
          />,
          <PolyBox
            key="a3"
            pts={[[-28, -8], [-4, 20], [12, -6], [30, 14]]}
            dots={[[6, 10], [28, -26]]}
          />,
        ]}
        b={[
          <PolyBox
            key="b1"
            pts={[[-30, -10], [-12, 16], [4, -16], [18, 12], [30, -12]]}
            dots={[[-8, 2], [10, -4]]}
          />,
          <PolyBox
            key="b2"
            pts={[[-30, 16], [-14, -14], [2, 14], [16, -12], [30, 18]]}
            dots={[[-4, -6], [8, 8]]}
          />,
          <PolyBox
            key="b3"
            pts={[[-30, 0], [-10, -20], [8, 20], [20, -18], [30, 6]]}
            dots={[[-12, 10], [14, 0]]}
          />,
        ]}
        test={
          <PolyBox
            pts={[[-30, -20], [-14, 14], [0, -14], [12, 16], [22, -10], [30, 16]]}
            dots={[[-4, 2], [-28, 26]]}
          />
        }
      />
    ),
  },

  "dpro-set-grid": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <Grid2 key="a1" g={[2, 0, 0, 0]} bar={30} dots={2} />,
          <Grid2 key="a2" g={[0, 0, 0, 2]} bar={18} dots={1} />,
          <Grid2 key="a3" g={[0, 2, 0, 0]} bar={36} dots={3} />,
        ]}
        b={[
          <Grid2 key="b1" g={[2, 2, 2, 2]} bar={20} dots={3} />,
          <Grid2 key="b2" g={[2, 0, 2, 2]} bar={30} dots={2} />,
          <Grid2 key="b3" g={[2, 2, 2, 2]} bar={36} dots={1} />,
        ]}
        test={<Grid2 g={[2, 0, 2, 0]} bar={24} dots={2} />}
      />
    ),
  },

  "dpro-set-colinear": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <Cluster key="a1" pts={[[-24, -22], [0, 0], [24, 22]]} kinds={["c", "s", "t"]} fills={[1, 0, 2]} r={7} />,
          <Cluster key="a2" pts={[[-10, -26], [0, 0], [10, 26]]} kinds={["t", "d", "c"]} fills={[0, 1, 0]} r={7} />,
          <Cluster key="a3" pts={[[-26, 16], [-2, 0], [22, -16]]} kinds={["s", "c", "d"]} fills={[2, 0, 1]} r={7} />,
        ]}
        b={[
          <Cluster key="b1" pts={[[-24, -10], [0, 14], [24, -6]]} kinds={["c", "s", "t"]} fills={[1, 0, 2]} r={7} />,
          <Cluster key="b2" pts={[[-22, 20], [-4, -14], [18, 10]]} kinds={["t", "d", "c"]} fills={[0, 1, 0]} r={7} />,
          <Cluster key="b3" pts={[[-24, 0], [2, -20], [24, 10]]} kinds={["s", "c", "d"]} fills={[2, 0, 1]} r={7} />,
        ]}
        test={<Cluster pts={[[-26, 0], [0, 0], [26, 0]]} kinds={["d", "c", "s"]} fills={[1, 0, 2]} r={7} />}
      />
    ),
  },

  "dpro-set-stars": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <StarsArc key="a1" g={[2, 2, 2, 0]} />,
          <StarsArc key="a2" g={[0, 0, 0, 0]} />,
          <StarsArc key="a3" g={[0, 2, 2, 2]} />,
        ]}
        b={[
          <StarsArc key="b1" g={[0, 2, 0, 0]} />,
          <StarsArc key="b2" g={[0, 0, 0, 2]} />,
          <StarsArc key="b3" g={[2, 0, 0, 0]} />,
        ]}
        test={<StarsArc g={[0, 0, 2, 0]} />}
      />
    ),
  },

  "dpro-set-nest": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[<NestItem key="a1" v="A1" />, <NestItem key="a2" v="A2" />, <NestItem key="a3" v="A3" />]}
        b={[<NestItem key="b1" v="B1" />, <NestItem key="b2" v="B2" />, <NestItem key="b3" v="B3" />]}
        test={<NestItem v="T" />}
      />
    ),
  },

  "dpro-set-blackcount": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <Blacks key="a1" mask={[1, 0, 1, 0, 1, 0]} shift={0} />,
          <Blacks key="a2" mask={[0, 0, 1, 0, 0, 0]} shift={2} />,
          <Blacks key="a3" mask={[1, 1, 0, 1, 1, 1]} shift={4} />,
        ]}
        b={[
          <Blacks key="b1" mask={[0, 1, 0, 0, 1, 0]} shift={1} />,
          <Blacks key="b2" mask={[1, 0, 1, 1, 0, 1]} shift={3} />,
          <Blacks key="b3" mask={[1, 1, 0, 0, 0, 0]} shift={5} />,
        ]}
        test={<Blacks mask={[0, 1, 1, 0, 1, 0]} shift={2} />}
      />
    ),
  },

  "dpro-set-arrow-dir": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[<Arrows3 key="a1" a={[0, 60, 120]} />, <Arrows3 key="a2" a={[90, 180, 270]} />, <Arrows3 key="a3" a={[200, 245, 290]} />]}
        b={[<Arrows3 key="b1" a={[120, 60, 0]} />, <Arrows3 key="b2" a={[270, 180, 90]} />, <Arrows3 key="b3" a={[300, 255, 210]} />]}
        test={<Arrows3 a={[330, 30, 90]} />}
      />
    ),
  },

  "dpro-set-dot-parity": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <Corners key="a1" c={[1, 1, 0, 0]} mid="c" />,
          <Corners key="a2" c={[1, 0, 1, 0]} mid={null} />,
          <Corners key="a3" c={[1, 1, 1, 1]} mid="s" />,
        ]}
        b={[
          <Corners key="b1" c={[1, 0, 0, 0]} mid="s" />,
          <Corners key="b2" c={[1, 1, 1, 0]} mid="c" />,
          <Corners key="b3" c={[0, 1, 0, 0]} mid={null} />,
        ]}
        test={<Corners c={[0, 1, 1, 1]} mid={null} />}
      />
    ),
  },

  /* ===================== OPERADORES ===================== */

  "dpro-op-swap-ends": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          { inp: <Bars b={[[34, 1], [20, 0], [28, 2]]} />, ops: ["swap"], out: <Bars b={[[28, 2], [20, 0], [34, 1]]} /> },
          { inp: <Bars b={[[26, 0], [38, 1], [18, 2]]} />, ops: ["swap"], out: "?" },
        ]}
        opts={[
          <Bars key="a" b={[[38, 1], [26, 0], [18, 2]]} />,
          <Bars key="b" b={[[18, 2], [38, 1], [26, 0]]} />,
          <Bars key="c" b={[[26, 0], [38, 1], [18, 2]]} />,
          <Bars key="d" b={[[26, 0], [18, 2], [38, 1]]} />,
        ]}
      />
    ),
  },

  "dpro-op-shade-all": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          { inp: <Split m={[1, 0, 0, 0]} />, ops: ["shade"], out: <Split m={[0, 1, 1, 1]} /> },
          { inp: <Split m={[1, 1, 0, 1]} />, ops: ["shade"], out: "?" },
        ]}
        opts={[
          <Split key="a" m={[1, 1, 0, 1]} />,
          <Split key="b" m={[0, 1, 1, 0]} />,
          <Split key="c" m={[0, 0, 1, 0]} />,
          <Split key="d" m={[1, 0, 1, 0]} />,
        ]}
      />
    ),
  },

  "dpro-op-resize-mid": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          { inp: <Mid3 r={[9, 5, 4]} />, ops: ["size"], out: <Mid3 r={[9, 12, 4]} /> },
          { inp: <Mid3 r={[9, 12, 4]} />, ops: ["size"], out: "?" },
        ]}
        opts={[
          <Mid3 key="a" r={[9, 5, 4]} />,
          <Mid3 key="b" r={[9, 12, 4]} />,
          <Mid3 key="c" r={[9, 5, 9]} />,
          <Mid3 key="d" r={[4, 12, 4]} />,
        ]}
      />
    ),
  },

  "dpro-op-tri-to-circ": {
    caption: CAP_OP,
    node: (
      <Frame caption={CAP_OP} h={300}>
        <Flow
          y={44}
          x0={0}
          wd={200}
          s={0.8}
          inp={<Row items={[I("t", 0), I("s", 1), I("t", 1)]} />}
          ops={["shade"]}
          out={<Row items={[I("t", 1), I("s", 0), I("t", 0)]} />}
        />
        <Flow
          y={44}
          x0={200}
          wd={200}
          s={0.8}
          inp={<Row items={[I("t", 0), I("s", 1), I("t", 1)]} />}
          ops={["sun"]}
          out={<Row items={[I("c", 0), I("s", 1), I("c", 1)]} />}
        />
        <Divider y={86} />
        <Flow
          y={132}
          inp={<Row items={[I("s", 1), I("t", 0), I("t", 1)]} />}
          ops={["shade", "sun"]}
          out="?"
        />
        <Opts
          y={232}
          items={[
            <Row key="a" items={[I("s", 0), I("t", 1), I("t", 0)]} />,
            <Row key="b" items={[I("s", 1), I("c", 0), I("c", 1)]} />,
            <Row key="c" items={[I("s", 0), I("c", 0), I("c", 1)]} />,
            <Row key="d" items={[I("s", 0), I("c", 1), I("c", 0)]} />,
          ]}
        />
      </Frame>
    ),
  },

  "dpro-op-rotate-ccw": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          { inp: <Ls a={[0, 90, 180]} />, ops: ["rotCcw"], out: <Ls a={[270, 0, 90]} /> },
          { inp: <Ls a={[180, 0, 270]} />, ops: ["rotCcw"], out: "?" },
        ]}
        opts={[
          <Ls key="a" a={[270, 90, 0]} />,
          <Ls key="b" a={[0, 180, 90]} />,
          <Ls key="c" a={[90, 270, 180]} />,
          <Ls key="d" a={[90, 270, 270]} />,
        ]}
      />
    ),
  },

  "dpro-op-shift-left": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          { inp: <ArcRow a={[0, 90, 180, 270]} />, ops: ["shift"], out: <ArcRow a={[90, 180, 270, 0]} /> },
          { inp: <ArcRow a={[180, 0, 270, 90]} />, ops: ["shift"], out: "?" },
        ]}
        opts={[
          <ArcRow key="a" a={[0, 270, 90, 180]} />,
          <ArcRow key="b" a={[90, 180, 0, 270]} />,
          <ArcRow key="c" a={[0, 270, 90, null]} />,
          <ArcRow key="d" a={[90, 270, 0, 180]} />,
        ]}
      />
    ),
  },

  "dpro-op-find-op-swap": {
    caption: CAP_FIND_OP,
    node: (
      <Task
        caption={CAP_FIND_OP}
        rows={[
          { inp: <Bars b={[[34, 1], [20, 0], [28, 2]]} />, ops: ["?"], out: <Bars b={[[28, 2], [20, 0], [34, 1]]} /> },
          { inp: <Bars b={[[24, 2], [38, 0], [16, 1]]} />, ops: ["?"], out: <Bars b={[[16, 1], [38, 0], [24, 2]]} /> },
        ]}
        opts={[
          <OpIcon key="a" kind="rotCw" s={48} />,
          <OpIcon key="b" kind="shade" s={48} />,
          <OpIcon key="c" kind="swap" s={48} />,
          <OpIcon key="d" kind="size" s={48} />,
        ]}
      />
    ),
  },

  "dpro-op-find-op-reflect": {
    caption: CAP_FIND_OP,
    node: (
      <Task
        caption={CAP_FIND_OP}
        rows={[
          {
            inp: <GRow gap={36} items={[{ g: "pee", f: 1 }, { g: "wedge", f: 0 }]} />,
            ops: ["?"],
            out: <GRow gap={36} items={[{ g: "wedge", f: 0, sx: -1 }, { g: "pee", f: 1, sx: -1 }]} />,
          },
          {
            inp: <GRow gap={36} items={[{ g: "hook", f: 0 }, { g: "pee", f: 1 }]} />,
            ops: ["?"],
            out: <GRow gap={36} items={[{ g: "pee", f: 1, sx: -1 }, { g: "hook", f: 0, sx: -1 }]} />,
          },
        ]}
        opts={[
          <OpIcon key="a" kind="reflectV" s={48} />,
          <OpIcon key="b" kind="swap" s={48} />,
          <OpIcon key="c" kind="rotCw" s={48} />,
          <OpIcon key="d" kind="reflectH" s={48} />,
        ]}
      />
    ),
  },

  "dpro-op-find-input": {
    caption: CAP_FIND_IN,
    node: (
      <Task
        caption={CAP_FIND_IN}
        rows={[
          { inp: <Mid3 f={[0, 0, 1]} r={[9, 5, 9]} />, ops: ["size"], out: <Mid3 f={[0, 0, 1]} r={[9, 12, 9]} /> },
          { inp: "?", ops: ["size"], out: <Mid3 f={[0, 0, 1]} r={[9, 5, 9]} /> },
        ]}
        opts={[
          <Mid3 key="a" f={[0, 0, 1]} r={[9, 5, 9]} />,
          <Mid3 key="b" f={[0, 1, 1]} r={[9, 12, 9]} />,
          <Mid3 key="c" f={[0, 0, 1]} r={[9, 12, 9]} />,
          <Mid3 key="d" f={[0, 0, 1]} r={[9, 5, 4]} />,
        ]}
      />
    ),
  },

  "dpro-op-double-chain": {
    caption: CAP_OP,
    node: (
      <Frame caption={CAP_OP} h={300}>
        <Flow
          y={44}
          x0={0}
          wd={200}
          s={0.8}
          inp={<Mid3 f={[1, 0, 0]} r={[9, 5, 9]} />}
          ops={["shade"]}
          out={<Mid3 f={[0, 1, 1]} r={[9, 5, 9]} />}
        />
        <Flow
          y={44}
          x0={200}
          wd={200}
          s={0.8}
          inp={<Mid3 f={[0, 0, 1]} r={[9, 5, 9]} />}
          ops={["size"]}
          out={<Mid3 f={[0, 0, 1]} r={[9, 12, 9]} />}
        />
        <Divider y={86} />
        <Flow
          y={132}
          inp={<Mid3 f={[1, 0, 1]} r={[9, 12, 9]} />}
          ops={["shade", "size"]}
          out="?"
        />
        <Opts
          y={232}
          items={[
            <Mid3 key="a" f={[0, 1, 0]} r={[9, 12, 9]} />,
            <Mid3 key="b" f={[0, 1, 0]} r={[9, 5, 9]} />,
            <Mid3 key="c" f={[1, 0, 1]} r={[9, 5, 9]} />,
            <Mid3 key="d" f={[0, 1, 1]} r={[9, 5, 9]} />,
          ]}
        />
      </Frame>
    ),
  },

  "dpro-op-replace-star": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          {
            inp: <Row items={[I("st", 1), I("t", 0), I("st", 0)]} />,
            ops: ["gear"],
            out: <Row items={[I("s", 1), I("t", 0), I("s", 0)]} />,
          },
          { inp: <Row items={[I("c", 0), I("st", 1), I("st", 0)]} />, ops: ["gear"], out: "?" },
        ]}
        opts={[
          <Row key="a" items={[I("s", 0), I("st", 1), I("st", 0)]} />,
          <Row key="b" items={[I("c", 0), I("s", 1), I("st", 0)]} />,
          <Row key="c" items={[I("c", 0), I("s", 1), I("s", 0)]} />,
          <Row key="d" items={[I("c", 0), I("s", 0), I("s", 1)]} />,
        ]}
      />
    ),
  },

  "dpro-op-shade-straight": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          {
            inp: <Row items={[I("s", 0), I("c", 0), I("t", 0)]} />,
            ops: ["shadeTri"],
            out: <Row items={[I("s", 1), I("c", 0), I("t", 1)]} />,
          },
          { inp: <Row items={[I("c", 1), I("d", 0), I("c", 0)]} />, ops: ["shadeTri"], out: "?" },
        ]}
        opts={[
          <Row key="a" items={[I("c", 1), I("d", 1), I("c", 1)]} />,
          <Row key="b" items={[I("c", 1), I("d", 1), I("c", 0)]} />,
          <Row key="c" items={[I("c", 1), I("d", 0), I("c", 0)]} />,
          <Row key="d" items={[I("c", 0), I("d", 1), I("c", 0)]} />,
        ]}
      />
    ),
  },

  "dpro-op-swap-23": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          {
            inp: <Row items={[I("s", 1), I("c", 0), I("t", 0)]} />,
            ops: ["tri"],
            out: <Row items={[I("s", 1), I("t", 0), I("c", 0)]} />,
          },
          { inp: <Row items={[I("d", 1), I("c", 0), I("st", 1)]} />, ops: ["tri"], out: "?" },
        ]}
        opts={[
          <Row key="a" items={[I("d", 1), I("st", 1), I("c", 0)]} />,
          <Row key="b" items={[I("c", 0), I("d", 1), I("st", 1)]} />,
          <Row key="c" items={[I("st", 1), I("c", 0), I("d", 1)]} />,
          <Row key="d" items={[I("st", 1), I("d", 1), I("c", 0)]} />,
        ]}
      />
    ),
  },

  "dpro-op-mirror-v": {
    caption: CAP_OP,
    node: (
      <Task
        rows={[
          {
            inp: <GRow gap={32} s={0.8} items={[{ g: "wedge", f: 1 }, { g: "pee", f: 0 }]} />,
            ops: ["reflectV"],
            out: <GRow gap={32} s={0.8} items={[{ g: "wedge", f: 1, sy: -1 }, { g: "pee", f: 0, sy: -1 }]} />,
          },
          {
            inp: <GRow gap={26} s={0.62} items={[{ g: "hook", f: 1 }, { g: "wedge", f: 0 }, { g: "pee", f: 1 }]} />,
            ops: ["reflectV"],
            out: "?",
          },
        ]}
        opts={[
          <GRow key="a" gap={26} s={0.62} items={[{ g: "hook", f: 1, sx: -1 }, { g: "wedge", f: 0, sx: -1 }, { g: "pee", f: 1, sx: -1 }]} />,
          <GRow key="b" gap={26} s={0.62} items={[{ g: "hook", f: 1, rot: 180 }, { g: "wedge", f: 0, rot: 180 }, { g: "pee", f: 1, rot: 180 }]} />,
          <GRow key="c" gap={26} s={0.62} items={[{ g: "hook", f: 1, sy: -1 }, { g: "wedge", f: 0, sy: -1 }, { g: "pee", f: 1, sy: -1 }]} />,
          <GRow key="d" gap={26} s={0.62} items={[{ g: "pee", f: 1, sy: -1 }, { g: "wedge", f: 0, sy: -1 }, { g: "hook", f: 1, sy: -1 }]} />,
        ]}
      />
    ),
  },

  /* ===================== SERIES / MATRICES / ANALOGÍAS / IMPARES ===================== */

  "dpro-ser-dual": {
    caption: CAP_SER,
    node: (
      <SeriesFig
        items={[
          <Gl key="1" g="arrow" f={1} rot={0} s={1.3} />,
          <Gl key="2" g="arrow" f={0} rot={45} s={1.3} />,
          <Gl key="3" g="arrow" f={1} rot={90} s={1.3} />,
          <Gl key="4" g="arrow" f={0} rot={135} s={1.3} />,
          "?",
        ]}
        opts={[
          <Gl key="a" g="arrow" f={0} rot={180} s={1.3} />,
          <Gl key="b" g="arrow" f={1} rot={225} s={1.3} />,
          <Gl key="c" g="arrow" f={1} rot={180} s={1.3} />,
          <Gl key="d" g="arrow" f={1} rot={135} s={1.3} />,
        ]}
      />
    ),
  },

  "dpro-ser-dotwalk": {
    caption: CAP_SER,
    node: (
      <SeriesFig
        w={420}
        items={[
          <SqDot key="1" pos={0} f={1} />,
          <SqDot key="2" pos={1} f={1} />,
          <SqDot key="3" pos={2} f={0} />,
          <SqDot key="4" pos={3} f={0} />,
          <SqDot key="5" pos={0} f={1} />,
          "?",
        ]}
        opts={[
          <SqDot key="a" pos={1} f={0} />,
          <SqDot key="b" pos={1} f={1} />,
          <SqDot key="c" pos={2} f={1} />,
          <SqDot key="d" pos={0} f={1} />,
        ]}
      />
    ),
  },

  "dpro-ser-nested": {
    caption: CAP_SER,
    node: (
      <SeriesFig
        items={[<NestPoly key="1" n={3} f={0} />, <NestPoly key="2" n={4} f={1} />, <NestPoly key="3" n={5} f={0} />, "?"]}
        opts={[
          <NestPoly key="a" n={6} f={0} />,
          <NestPoly key="b" n={5} f={1} />,
          <NestPoly key="c" n={6} f={1} />,
          <NestPoly key="d" n={7} f={1} />,
        ]}
      />
    ),
  },

  "dpro-mtx-xor": {
    caption: CAP_MTX,
    node: (
      <MatrixFig
        cells={[
          [<Marks key="11" m="cs" />, <Marks key="12" m="st" />, <Marks key="13" m="ct" />],
          [<Marks key="21" m="c" />, <Marks key="22" m="ct" />, <Marks key="23" m="t" />],
          [<Marks key="31" m="cst" />, <Marks key="32" m="ct" />, "?"],
        ]}
        opts={[<Marks key="a" m="cst" />, <Marks key="b" m="ct" />, <Marks key="c" m="s" />, <Marks key="d" m="cs" />]}
      />
    ),
  },

  "dpro-mtx-add": {
    caption: CAP_MTX,
    node: (
      <MatrixFig
        cells={[
          [<Sides key="11" s="TL" />, <Sides key="12" s="LB" />, <Sides key="13" s="TB" />],
          [<Sides key="21" s="TRB" />, <Sides key="22" s="T" />, <Sides key="23" s="RB" />],
          [<Sides key="31" s="LRT" />, <Sides key="32" s="RB" />, "?"],
        ]}
        opts={[
          <Sides key="a" s="TLB" />,
          <Sides key="b" s="LRTB" />,
          <Sides key="c" s="R" />,
          <Sides key="d" s="LT" />,
        ]}
      />
    ),
  },

  "dpro-mtx-rowcol": {
    caption: CAP_MTX,
    node: (
      <MatrixFig
        cells={[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) =>
            r === 2 && c === 2 ? "?" : <Gl key={`${r}${c}`} g="arrow" f={c as F} rot={r * 90} s={1.3} />,
          ),
        )}
        opts={[
          <Gl key="a" g="arrow" f={1} rot={180} s={1.3} />,
          <Gl key="b" g="arrow" f={2} rot={180} s={1.3} />,
          <Gl key="c" g="arrow" f={2} rot={90} s={1.3} />,
          <Gl key="d" g="arrow" f={2} rot={270} s={1.3} />,
        ]}
      />
    ),
  },

  "dpro-ana-transform": {
    caption: CAP_ANA,
    node: (
      <AnaFig
        a={<Gl g="wedge" f={0} s={1.3} />}
        b={<Gl g="wedge" f={1} s={1.3} rot={180} />}
        c={<Gl g="pee" f={1} s={1.3} />}
        opts={[
          <Gl key="a" g="pee" f={1} s={1.3} rot={180} />,
          <Gl key="b" g="pee" f={0} s={1.3} sx={-1} />,
          <Gl key="c" g="pee" f={0} s={1.3} />,
          <Gl key="d" g="pee" f={0} s={1.3} rot={180} />,
        ]}
      />
    ),
  },

  "dpro-odd-orient": {
    caption: CAP_ODD,
    node: (
      <OddFig
        items={[
          <Gl key="a" g="arrow" f={1} rot={0} s={1.3} />,
          <Gl key="b" g="arrow" f={0} rot={270} s={1.3} />,
          <Gl key="c" g="arrow" f={1} rot={90} s={1.3} />,
          <Gl key="d" g="arrow" f={1} rot={180} s={1.3} />,
          <Gl key="e" g="arrow" f={0} rot={90} s={1.3} />,
        ]}
      />
    ),
  },

  "dpro-odd-count": {
    caption: CAP_ODD,
    node: (
      <OddFig
        items={[
          <CountFig key="a" n={5} shift={0} />,
          <CountFig key="b" n={2} shift={1} />,
          <CountFig key="c" n={3} shift={2} />,
          <CountFig key="d" n={4} shift={3} />,
          <CountFig key="e" n={3} shift={4} />,
        ]}
      />
    ),
  },

  "dpro-ser-binary": {
    caption: CAP_SER,
    node: (
      <SeriesFig
        items={[<Bin key="1" v={1} />, <Bin key="2" v={2} />, <Bin key="3" v={3} />, <Bin key="4" v={4} />, "?"]}
        opts={[<Bin key="a" v={6} />, <Bin key="b" v={5} />, <Bin key="c" v={7} />, <Bin key="d" v={3} />]}
      />
    ),
  },

  "dpro-ana-parts": {
    caption: CAP_ANA,
    node: (
      <AnaFig
        a={<SqDiag />}
        b={<TwoTris />}
        c={<CircDiam />}
        opts={[<CircDiam key="a" />, <OneSemi key="b" />, <TwoSemis key="c" />, <Unequal key="d" />]}
      />
    ),
  },

  "dpro-ser-layer": {
    caption: CAP_SER,
    node: (
      <SeriesFig
        w={420}
        items={[
          <Layered key="1" dash={false} mid="c" dot={0} />,
          <Layered key="2" dash mid="s" dot={1} />,
          <Layered key="3" dash={false} mid="t" dot={2} />,
          <Layered key="4" dash mid="c" dot={3} />,
          <Layered key="5" dash={false} mid="s" dot={0} />,
          "?",
        ]}
        opts={[
          <Layered key="a" dash={false} mid="t" dot={1} />,
          <Layered key="b" dash mid="c" dot={1} />,
          <Layered key="c" dash mid="t" dot={2} />,
          <Layered key="d" dash mid="t" dot={1} />,
        ]}
      />
    ),
  },

  "dpro-odd-symmetry": {
    caption: CAP_ODD,
    node: (
      <OddFig
        items={[
          <SymShape key="a" d="kite" f={2} />,
          <SymShape key="b" d="house" f={0} />,
          <SymShape key="c" d="crown" f={1} />,
          <SymShape key="d" d="cross" f={2} />,
          <SymShape key="e" d="chevron" f={0} />,
        ]}
      />
    ),
  },

  "dpro-mtx-prog": {
    caption: CAP_MTX,
    node: (
      <MatrixFig
        cells={[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) =>
            r === 2 && c === 2 ? (
              "?"
            ) : (
              <g key={`${r}${c}`}>
                <Gl g="tri" f={1} rot={c * 90} s={1.15} y={-8} />
                <Dots n={r + 1} />
              </g>
            ),
          ),
        )}
        opts={[
          <g key="a">
            <Gl g="tri" f={1} rot={180} s={1.15} y={-8} />
            <Dots n={2} />
          </g>,
          <g key="b">
            <Gl g="tri" f={1} rot={90} s={1.15} y={-8} />
            <Dots n={3} />
          </g>,
          <g key="c">
            <Gl g="tri" f={1} rot={180} s={1.15} y={-8} />
            <Dots n={4} />
          </g>,
          <g key="d">
            <Gl g="tri" f={1} rot={180} s={1.15} y={-8} />
            <Dots n={3} />
          </g>,
        ]}
      />
    ),
  },

  "dpro-set-cond": {
    caption: CAP_SET,
    node: (
      <SetFig
        a={[
          <Row key="a1" gap={26} r={9} items={[I("t", 1), I("c", 0)]} />,
          <Row key="a2" gap={26} r={9} items={[I("s", 0), I("t", 1), I("d", 0)]} />,
          <Row key="a3" gap={26} r={9} items={[I("h", 0), I("t", 1)]} />,
        ]}
        b={[
          <Row key="b1" gap={26} r={9} items={[I("t", 0), I("c", 1)]} />,
          <Row key="b2" gap={26} r={9} items={[I("s", 1), I("t", 0), I("d", 1)]} />,
          <Row key="b3" gap={26} r={9} items={[I("h", 1), I("t", 0)]} />,
        ]}
        test={<Row gap={26} r={9} items={[I("t", 0), I("h", 1)]} />}
      />
    ),
  },

  "dpro-op-triple-chain": {
    caption: CAP_OP,
    node: (
      <Frame caption={CAP_OP} w={420} h={292}>
        <Flow
          y={38}
          x0={0}
          wd={140}
          s={0.62}
          inp={<Row items={[I("t", 0), I("s", 1), I("d", 0)]} />}
          ops={["shade"]}
          out={<Row items={[I("t", 1), I("s", 0), I("d", 1)]} />}
        />
        <Flow
          y={38}
          x0={140}
          wd={140}
          s={0.62}
          inp={<Row items={[I("s", 1), I("c", 0), I("t", 1)]} />}
          ops={["swap"]}
          out={<Row items={[I("t", 1), I("c", 0), I("s", 1)]} />}
        />
        <Flow
          y={38}
          x0={280}
          wd={140}
          s={0.62}
          inp={<Row items={[I("t", 1), I("s", 0), I("d", 1)]} />}
          ops={["sun"]}
          out={<Row items={[I("c", 1), I("s", 0), I("d", 1)]} />}
        />
        <Divider y={74} w={420} />
        <Flow
          y={120}
          wd={420}
          s={0.85}
          inp={<Row items={[I("t", 1), I("d", 0), I("s", 1)]} />}
          ops={["shade", "swap", "sun"]}
          out="?"
        />
        <Opts
          y={222}
          w={420}
          items={[
            <Row key="a" items={[I("s", 1), I("d", 0), I("c", 1)]} />,
            <Row key="b" items={[I("s", 0), I("d", 1), I("c", 0)]} />,
            <Row key="c" items={[I("c", 0), I("d", 1), I("s", 0)]} />,
            <Row key="d" items={[I("s", 0), I("d", 1), I("t", 0)]} />,
          ]}
        />
      </Frame>
    ),
  },
};
