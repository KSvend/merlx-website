import Link from 'next/link';

interface BrandMarkProps {
  /** Tenant context drives the wordmark suffix. */
  tenant?: 'group' | 'studio' | 'network' | 'node' | 'learn';
  /** For node tenants, the node display name (e.g. "NileX"). */
  nodeName?: string;
  /** Render as link (true) or static (false). */
  asLink?: boolean;
  /** Hide the wordmark and show only the icon. */
  iconOnly?: boolean;
  /** Pixel height of the icon — wordmark scales relative. */
  size?: number;
  /** Locale used for the home link. */
  locale?: string;
  /** Footer mark — collapses the icon's tricolour to a single shell tone. */
  variant?: 'default' | 'inverse';
}

/**
 * BrandMark — inline SVG icon (sand drop / iris teardrop / teal pillar)
 * + "MERL" in Inter Bold + italic serif "x" in iris (or shell on
 * dark backgrounds). Optional tenant suffix to the right.
 */
export function BrandMark({
  tenant = 'group',
  nodeName,
  asLink = true,
  iconOnly = false,
  size = 22,
  locale = 'en',
  variant = 'default',
}: BrandMarkProps) {
  const suffix =
    tenant === 'studio'
      ? 'Studio'
      : tenant === 'network'
        ? 'Network'
        : tenant === 'learn'
          ? 'Learn'
          : tenant === 'node' && nodeName
            ? nodeName
            : null;

  const inner = (
    <>
      <BrandIcon size={size} />
      {!iconOnly ? (
        <span className="mx-brand-name">
          <span
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '-0.3px' }}
          >
            MERL
          </span>
          <span className="mx-brand-x">x</span>
          {suffix ? <span className="mx-tenant-suffix">{suffix}</span> : null}
        </span>
      ) : null}
    </>
  );

  const className = variant === 'inverse' ? 'mx-brand mx-footer-brand' : 'mx-brand';

  if (asLink) {
    return (
      <Link href={`/${locale}`} aria-label="MERLx home" className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <span aria-label="MERLx" className={className}>
      {inner}
    </span>
  );
}

function BrandIcon({ size }: { size: number }) {
  const ratio = 270.24 / 236.75;
  return (
    <svg
      className="mx-mark"
      role="img"
      aria-hidden="true"
      focusable="false"
      width={size * ratio}
      height={size}
      viewBox="0 0 270.24 236.75"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="mx-mark-spike" x="190.24" y="0" width="80" height="227.61" />
      <rect className="mx-mark-square" x="0" y="137.61" width="90" height="90" rx="45" ry="45" />
      <path
        className="mx-mark-rect"
        d="M131.19,236.75h0l-42.58-102.77c-9.65-24.57,10.73-56.34,40.97-57.21.54-.02,1.08-.02,1.62-.02h0c.54,0,1.08,0,1.62.02,30.24.88,50.62,32.64,40.97,57.21l-42.58,102.77Z"
      />
    </svg>
  );
}
