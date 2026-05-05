import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}

/**
 * EmptyState — design-system "no data" pattern. Heading is in the
 * editorial DM Serif Display italic; body explains the next action.
 * No exclamation marks, no apologies.
 */
export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--space-5)',
        padding: 'var(--space-16) 0',
        maxWidth: '52ch',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(20px, 2vw, 24px)',
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </p>
      {body ? (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
            fontSize: 'var(--text-base)',
            color: 'var(--ink-muted)',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {body}
        </p>
      ) : null}
      {action}
    </div>
  );
}
