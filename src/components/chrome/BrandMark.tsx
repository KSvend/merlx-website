import Link from 'next/link';
import type { CSSProperties } from 'react';

interface BrandMarkProps {
  /** Tenant context — drives the wordmark suffix. */
  tenant?: 'group' | 'studio' | 'network' | 'node';
  /** For node tenants, the node display name (e.g. "NileX"). */
  nodeName?: string;
  /** Render as link (true) or static (false). */
  asLink?: boolean;
  /** Hide the wordmark and show only the icon. */
  iconOnly?: boolean;
  /** Pixel height of the icon — wordmark scales relative. */
  size?: number;
  /** Locale for the link href. */
  locale?: string;
}

/**
 * BrandMark — inline SVG icon (the canonical MERLx mark) plus the
 * "MERLx" wordmark in Inter, with the trailing x in iris. Optional
 * tenant suffix on the right separated by a thin rule.
 */
export function BrandMark({
  tenant = 'group',
  nodeName,
  asLink = true,
  iconOnly = false,
  size = 26,
  locale = 'en',
}: BrandMarkProps) {
  const suffix =
    tenant === 'studio'
      ? 'Studio'
      : tenant === 'network'
        ? 'Network'
        : tenant === 'node' && nodeName
          ? nodeName
          : null;

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-4)',
    color: 'var(--ink)',
    textDecoration: 'none',
  };

  const wordmarkStyle: CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: 'var(--text-xl)',
    letterSpacing: '-0.4px',
    lineHeight: 1,
    color: 'var(--ink)',
  };

  const xStyle: CSSProperties = { color: 'var(--iris)' };

  const suffixStyle: CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-muted)',
    paddingInlineStart: 'var(--space-4)',
    borderInlineStart: '1px solid var(--border)',
    lineHeight: 1.2,
  };

  const inner = (
    <>
      <BrandIcon size={size} />
      {!iconOnly ? (
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
          <span style={wordmarkStyle}>
            MERL<span style={xStyle}>x</span>
          </span>
          {suffix ? <span style={suffixStyle}>{suffix}</span> : null}
        </span>
      ) : null}
    </>
  );

  if (asLink) {
    return (
      <Link href={`/${locale}`} aria-label="MERLx home" style={containerStyle}>
        {inner}
      </Link>
    );
  }

  return (
    <span aria-label="MERLx" style={containerStyle}>
      {inner}
    </span>
  );
}

/**
 * Inline SVG mark — sand drop (round), light-teal pillar (right),
 * iris teardrop (centre). Colours match the canonical MERLx palette
 * via design-system tokens.
 */
function BrandIcon({ size }: { size: number }) {
  // 270.24 × 236.75 — preserve aspect ratio
  const ratio = 270.24 / 236.75;
  return (
    <svg
      role="img"
      aria-hidden="true"
      focusable="false"
      width={size * ratio}
      height={size}
      viewBox="0 0 270.24 236.75"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="190.24" y="0" width="80" height="227.61" fill="#b8d9d3" />
      <rect x="0" y="137.61" width="90" height="90" rx="45" ry="45" fill="var(--sand)" />
      <path
        d="M131.19,236.75h0l-42.58-102.77c-9.65-24.57,10.73-56.34,40.97-57.21.54-.02,1.08-.02,1.62-.02h0c.54,0,1.08,0,1.62.02,30.24.88,50.62,32.64,40.97,57.21l-42.58,102.77Z"
        fill="var(--iris)"
      />
    </svg>
  );
}
