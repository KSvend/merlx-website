import type { ReactNode } from 'react';
import { SiteFooter } from './SiteFooter';
import { SiteNav } from './SiteNav';

interface PageShellProps {
  locale: string;
  children: ReactNode;
}

export function PageShell({ locale, children }: PageShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteNav locale={locale} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
