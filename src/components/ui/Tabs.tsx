import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

interface Tab {
  href: string;
  label: ReactNode;
  active?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  ariaLabel?: string;
}

/**
 * Tabs — bottom border + 2px deep-teal underline on the active tab.
 * Used as in-page section navigation. No animated underline.
 */
export function Tabs({ tabs, ariaLabel = 'Page sections' }: TabsProps) {
  const stripStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-2)',
    borderBottom: '1px solid var(--border-light)',
    overflowX: 'auto',
  };

  return (
    <nav aria-label={ariaLabel} style={stripStyle}>
      {tabs.map((tab) => {
        const tabStyle: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          fontSize: 'var(--text-sm)',
          color: tab.active ? 'var(--ink)' : 'var(--ink-muted)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: `2px solid ${tab.active ? 'var(--deep-teal)' : 'transparent'}`,
          marginBottom: '-1px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'color var(--motion-default) var(--motion-easing)',
        };
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={tabStyle}
            aria-current={tab.active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
