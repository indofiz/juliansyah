import { theme } from "@/lib/theme";

/** Deterministic pseudo-random series so server and client render the same chart. */
export function series(seed: number, n = 24, trend = 0.6, noise = 0.5) {
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out: number[] = [];
  let v = 0.3;
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.5) * noise * 0.4 + (trend * 0.6) / n;
    v = Math.min(0.95, Math.max(0.05, v));
    out.push(v);
  }
  return out;
}

export function Sparkline({
  values,
  width = 160,
  height = 48,
  color = theme.accent,
  fill = true,
  strokeWidth = 1.6,
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  className?: string;
}) {
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => [i * step, height - v * height] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const id = `sl-${Math.round(values[0] * 1e6)}-${values.length}-${width}`;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ height: `${height / 16}rem` }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {fill && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: color }} stopOpacity="0.35" />
            <stop offset="1" style={{ stopColor: color }} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" style={{ stroke: color }} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
