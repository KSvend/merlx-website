type Status = 'on-track' | 'at-risk' | 'off-track' | 'review';

interface StatusPillProps {
  status: Status;
}

const MAP: Record<Status, { label: string; bg: string; color: string }> = {
  'on-track': { label: 'On track', bg: 'var(--deep-teal-dim)', color: 'var(--deep-teal)' },
  'at-risk': { label: 'At risk', bg: 'var(--ember-dim)', color: 'var(--ember)' },
  'off-track': { label: 'Off track', bg: 'var(--error-dim)', color: 'var(--error)' },
  review: { label: 'In review', bg: 'var(--iris-dim)', color: 'var(--iris)' },
};

export function StatusPill({ status }: StatusPillProps) {
  const m = MAP[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 'var(--radius-pill)',
        background: m.bg,
        color: m.color,
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 100, background: 'currentColor' }} />
      {m.label}
    </span>
  );
}
