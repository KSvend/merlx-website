interface DonutProps {
  value: number;
  total?: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}

export function Donut({
  value,
  total = 100,
  size = 80,
  stroke = 8,
  color = 'var(--deep-teal)',
  label,
}: DonutProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / total);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--shell-warm)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${c * pct} ${c}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2}
          dy="4"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="13"
          fontWeight="500"
          fill="var(--ink)"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label ? <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{label}</span> : null}
    </div>
  );
}
