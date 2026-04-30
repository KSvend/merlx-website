/**
 * Studio side background: PRISM-style hex grid.
 * Orange register (warmth, compound risk).
 * Hot-zone cells use the maroon orange-hot variant.
 *
 * v1.0: static. Animation (slow pulse on hot cells) deferred to v1.1.
 */
export function StudioBackground() {
  return (
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>
        {/* Row 1 */}
        <polygon
          points="60,40 100,20 140,40 140,80 100,100 60,80"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="140,40 180,20 220,40 220,80 180,100 140,80"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="220,40 260,20 300,40 300,80 260,100 220,80"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="300,40 340,20 380,40 380,80 340,100 300,80"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="380,40 420,20 460,40 460,80 420,100 380,80"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="460,40 500,20 540,40 540,80 500,100 460,80"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        {/* Row 2 (with hot cell at 4) */}
        <polygon
          points="20,100 60,80 100,100 100,140 60,160 20,140"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="100,100 140,80 180,100 180,140 140,160 100,140"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="180,100 220,80 260,100 260,140 220,160 180,140"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="260,100 300,80 340,100 340,140 300,160 260,140"
          fill="var(--color-orange)"
          opacity="0.22"
        />
        <polygon
          points="340,100 380,80 420,100 420,140 380,160 340,140"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="420,100 460,80 500,100 500,140 460,160 420,140"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="500,100 540,80 580,100 580,140 540,160 500,140"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        {/* Row 3 — peak hot zones */}
        <polygon
          points="60,160 100,140 140,160 140,200 100,220 60,200"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="140,160 180,140 220,160 220,200 180,220 140,200"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="220,160 260,140 300,160 300,200 260,220 220,200"
          fill="var(--color-orange)"
          opacity="0.22"
        />
        <polygon
          points="300,160 340,140 380,160 380,200 340,220 300,200"
          fill="var(--color-orange-hot)"
          opacity="0.30"
        />
        <polygon
          points="380,160 420,140 460,160 460,200 420,220 380,200"
          fill="var(--color-orange)"
          opacity="0.22"
        />
        <polygon
          points="460,160 500,140 540,160 540,200 500,220 460,200"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        {/* Row 4 */}
        <polygon
          points="20,220 60,200 100,220 100,260 60,280 20,260"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="100,220 140,200 180,220 180,260 140,280 100,260"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="180,220 220,200 260,220 260,260 220,280 180,260"
          fill="var(--color-orange)"
          opacity="0.22"
        />
        <polygon
          points="260,220 300,200 340,220 340,260 300,280 260,260"
          fill="var(--color-orange-hot)"
          opacity="0.30"
        />
        <polygon
          points="340,220 380,200 420,220 420,260 380,280 340,260"
          fill="var(--color-orange)"
          opacity="0.22"
        />
        <polygon
          points="420,220 460,200 500,220 500,260 460,280 420,260"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="500,220 540,200 580,220 580,260 540,280 500,260"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        {/* Row 5 */}
        <polygon
          points="60,280 100,260 140,280 140,320 100,340 60,320"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="140,280 180,260 220,280 220,320 180,340 140,320"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="220,280 260,260 300,280 300,320 260,340 220,320"
          fill="var(--color-orange)"
          opacity="0.22"
        />
        <polygon
          points="300,280 340,260 380,280 380,320 340,340 300,320"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="380,280 420,260 460,280 460,320 420,340 380,320"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="460,280 500,260 540,280 540,320 500,340 460,320"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        {/* Sparser bottom rows */}
        <polygon
          points="20,340 60,320 100,340 100,380 60,400 20,380"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
        <polygon
          points="100,340 140,320 180,340 180,380 140,400 100,380"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="180,340 220,320 260,340 260,380 220,400 180,380"
          fill="var(--color-orange)"
          opacity="0.12"
        />
        <polygon
          points="260,340 300,320 340,340 340,380 300,400 260,380"
          fill="var(--color-orange)"
          opacity="0.05"
        />
        <polygon
          points="340,340 380,320 420,340 420,380 380,400 340,380"
          stroke="var(--color-orange)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.20"
        />
      </g>
    </svg>
  );
}
