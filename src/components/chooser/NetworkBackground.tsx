/**
 * Network side background: stylised world dot-map + node pins.
 * Teal register (federation, growth).
 * Active node (NileX/Sudan) has an outer pulse ring.
 *
 * v1.0: static. Animation (link-draw-in, node pulse) deferred to v1.1.
 */
export function NetworkBackground() {
  // Dot positions for continents (approximate equirectangular projection).
  const continentDots = [
    // North America
    [80, 100],
    [100, 100],
    [120, 100],
    [140, 100],
    [60, 120],
    [80, 120],
    [100, 120],
    [120, 120],
    [140, 120],
    [160, 120],
    [80, 140],
    [100, 140],
    [120, 140],
    [140, 140],
    [160, 140],
    [100, 160],
    [120, 160],
    [140, 160],
    // Central + South America
    [140, 180],
    [160, 200],
    [160, 220],
    [180, 220],
    [160, 240],
    [180, 240],
    [200, 240],
    [180, 260],
    [200, 260],
    [180, 280],
    [200, 280],
    [180, 300],
    // Europe
    [280, 100],
    [300, 100],
    [320, 100],
    [280, 120],
    [300, 120],
    [320, 120],
    [340, 120],
    [300, 140],
    [320, 140],
    [340, 140],
    // Africa
    [280, 160],
    [300, 160],
    [320, 160],
    [340, 160],
    [280, 180],
    [300, 180],
    [320, 180],
    [340, 180],
    [300, 200],
    [320, 200],
    [340, 200],
    [300, 220],
    [320, 220],
    [320, 240],
    [320, 260],
    // Asia
    [360, 100],
    [380, 100],
    [400, 100],
    [420, 100],
    [440, 100],
    [460, 100],
    [480, 100],
    [500, 100],
    [360, 120],
    [380, 120],
    [400, 120],
    [420, 120],
    [440, 120],
    [460, 120],
    [480, 120],
    [500, 120],
    [380, 140],
    [400, 140],
    [420, 140],
    [440, 140],
    [460, 140],
    [480, 140],
    [400, 160],
    [420, 160],
    [440, 160],
    [460, 160],
    [420, 180],
    [440, 180],
    // Australia
    [500, 240],
    [520, 240],
    [500, 260],
    [520, 260],
    [540, 260],
  ];

  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>
        {continentDots.map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="2"
            fill="var(--color-teal)"
            opacity="0.15"
          />
        ))}

        {/* Network links (dashed) */}
        <line
          x1="320"
          y1="180"
          x2="180"
          y2="240"
          stroke="var(--color-teal)"
          strokeWidth="0.7"
          opacity="0.4"
          strokeDasharray="2 3"
        />
        <line
          x1="320"
          y1="180"
          x2="335"
          y2="195"
          stroke="var(--color-teal)"
          strokeWidth="0.7"
          opacity="0.4"
          strokeDasharray="2 3"
        />
        <line
          x1="335"
          y1="195"
          x2="180"
          y2="240"
          stroke="var(--color-teal)"
          strokeWidth="0.7"
          opacity="0.4"
          strokeDasharray="2 3"
        />

        {/* NileX (Sudan) — active node */}
        <circle
          cx="320"
          cy="180"
          r="14"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="0.6"
          opacity="0.25"
        />
        <circle
          cx="320"
          cy="180"
          r="9"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <circle cx="320" cy="180" r="4" fill="var(--color-teal)" />
        <text
          x="328"
          y="174"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          fill="var(--color-ink)"
          letterSpacing="0.06em"
          fontWeight="500"
        >
          NILEX · SUDAN
        </text>

        {/* Horn of Africa */}
        <circle
          cx="335"
          cy="195"
          r="7"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <circle cx="335" cy="195" r="3" fill="var(--color-teal)" />
        <text
          x="343"
          y="200"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          fill="var(--color-ink)"
          letterSpacing="0.06em"
          fontWeight="500"
        >
          HORN OF AFRICA
        </text>

        {/* Colombia */}
        <circle
          cx="180"
          cy="240"
          r="7"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <circle cx="180" cy="240" r="3" fill="var(--color-teal)" />
        <text
          x="142"
          y="258"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          fill="var(--color-ink)"
          letterSpacing="0.06em"
          fontWeight="500"
        >
          COLOMBIA
        </text>
      </g>
    </svg>
  );
}
