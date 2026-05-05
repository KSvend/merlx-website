import type { ReactNode } from 'react';

interface PageShellProps {
  locale: string;
  children: ReactNode;
}

/**
 * Placeholder PageShell — visual rebuild pending.
 * Wraps page bodies in <main> so routing + locale + tenant gating
 * keep working without a styled chrome.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main>{children}</main>
    </div>
  );
}
