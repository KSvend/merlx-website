interface SeriesPoint {
  x: string | number;
  y: number | null;
}

interface Series {
  data: SeriesPoint[];
  color?: string;
  dashed?: boolean;
  dots?: boolean;
  fill?: boolean;
}

interface LineChartProps {
  series: Series[];
  width?: number;
  height?: number;
  padding?: { t: number; r: number; b: number; l: number };
  yMin?: number;
  yMax?: number;
  showAxis?: boolean;
  showGrid?: boolean;
}

export function LineChart({
  series,
  width = 560,
  height = 200,
  padding = { t: 16, r: 16, b: 24, l: 36 },
  yMin,
  yMax,
  showAxis = true,
  showGrid = true,
}: LineChartProps) {
  const w = width;
  const h = height;
  const p = padding;
  const allY = series.flatMap((s) => s.data.map((d) => d.y).filter((v): v is number => v != null));
  const minY = yMin ?? Math.min(...allY);
  const maxY = yMax ?? Math.max(...allY);
  const allX = series[0]?.data.map((d) => d.x) ?? [];
  const xRange = w - p.l - p.r;
  const yRange = h - p.t - p.b;
  const sx = (i: number) => p.l + (allX.length > 1 ? (i / (allX.length - 1)) * xRange : 0);
  const sy = (v: number) => p.t + (1 - (v - minY) / (maxY - minY || 1)) * yRange;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => minY + (i / yTicks) * (maxY - minY));

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Line chart">
      {showGrid &&
        ticks.map((t) => (
          <line
            key={`grid-${t}`}
            x1={p.l}
            x2={w - p.r}
            y1={sy(t)}
            y2={sy(t)}
            stroke="var(--border-light)"
            strokeWidth="1"
          />
        ))}
      {showAxis &&
        ticks.map((t) => (
          <text
            key={`y-${t}`}
            x={p.l - 6}
            y={sy(t)}
            dy="3"
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill="var(--ink-faint)"
          >
            {Math.round(t)}
          </text>
        ))}
      {showAxis &&
        allX.map((x, i) =>
          i % Math.ceil(allX.length / 6) === 0 ? (
            <text
              // biome-ignore lint/suspicious/noArrayIndexKey: x-axis tick index is stable
              key={`x-${x}-${i}`}
              x={sx(i)}
              y={h - 8}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill="var(--ink-faint)"
            >
              {x}
            </text>
          ) : null,
        )}
      {series.map((s, si) => {
        const points = s.data.filter((d): d is { x: string | number; y: number } => d.y != null);
        const path = points
          .map((d, i) => {
            const idx = s.data.indexOf(d);
            return `${i === 0 ? 'M' : 'L'} ${sx(idx)} ${sy(d.y)}`;
          })
          .join(' ');
        const color = s.color ?? 'var(--deep-teal)';
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: series array is the contract
          <g key={`series-${si}`}>
            {s.fill && points.length > 0 && (
              <path
                d={`${path} L ${sx(s.data.indexOf(points[points.length - 1]))} ${h - p.b} L ${p.l} ${
                  h - p.b
                } Z`}
                fill={color}
                fillOpacity="0.08"
              />
            )}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={s.dashed ? 1.25 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? '3 3' : undefined}
            />
            {s.dots &&
              points.map((d) => {
                const idx = s.data.indexOf(d);
                return (
                  <circle
                    key={`dot-${idx}`}
                    cx={sx(idx)}
                    cy={sy(d.y)}
                    r="2"
                    fill="var(--surface)"
                    stroke={color}
                    strokeWidth="1.25"
                  />
                );
              })}
          </g>
        );
      })}
    </svg>
  );
}
