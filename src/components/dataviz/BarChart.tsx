interface BarDatum {
  label: string;
  value: number;
  display?: string;
  color?: string;
}

interface BarChartProps {
  data: BarDatum[];
  width?: number;
  barHeight?: number;
  gap?: number;
  color?: string;
  maxValue?: number;
}

export function BarChart({
  data,
  width = 320,
  barHeight = 18,
  gap = 8,
  color = 'var(--deep-teal)',
  maxValue,
}: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value));
  const labelW = 110;
  const numW = 50;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }} aria-label="Bar chart">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div
            key={d.label}
            style={{
              display: 'grid',
              gridTemplateColumns: `${labelW}px 1fr ${numW}px`,
              alignItems: 'center',
              gap: 12,
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--ink)' }}>{d.label}</span>
            <div
              style={{
                position: 'relative',
                height: barHeight,
                background: 'var(--shell-warm)',
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${pct}%`,
                  background: d.color ?? color,
                  borderRadius: 2,
                  transition: 'width 600ms var(--easing)',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--ink-muted)',
                textAlign: 'right',
              }}
            >
              {d.display ?? d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
