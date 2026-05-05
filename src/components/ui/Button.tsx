import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & {
    href: string;
  };

type Props = ButtonProps | LinkButtonProps;

const heightBySize: Record<Size, string> = { md: '32px', sm: '28px' };

function buildStyle(variant: Variant, size: Size, fullWidth: boolean): CSSProperties {
  const palette: Record<Variant, { bg: string; color: string; border: string; hoverBg: string }> = {
    primary: {
      bg: 'var(--deep-teal)',
      color: 'var(--surface)',
      border: 'transparent',
      hoverBg: 'var(--deep-teal-light)',
    },
    secondary: {
      bg: 'transparent',
      color: 'var(--ink)',
      border: 'var(--border)',
      hoverBg: 'var(--shell-warm)',
    },
    ghost: {
      bg: 'transparent',
      color: 'var(--ink-muted)',
      border: 'transparent',
      hoverBg: 'var(--shell-warm)',
    },
    danger: {
      bg: 'var(--error)',
      color: 'var(--surface)',
      border: 'transparent',
      hoverBg: 'var(--error-light)',
    },
  };

  const tone = palette[variant];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-3)',
    height: heightBySize[size],
    padding: '0 var(--space-4)',
    background: tone.bg,
    color: tone.color,
    border: `1px solid ${tone.border}`,
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition:
      'background var(--motion-default) var(--motion-easing), border-color var(--motion-default) var(--motion-easing), color var(--motion-default) var(--motion-easing)',
    width: fullWidth ? '100%' : undefined,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    // CSS custom prop the data-attribute hover rule below reads
    ['--btn-hover-bg' as string]: tone.hoverBg,
  };
}

export function Button(props: Props) {
  const {
    variant = 'secondary',
    size = 'md',
    iconLeft,
    iconRight,
    children,
    fullWidth = false,
    ...rest
  } = props;

  const style = buildStyle(variant, size, fullWidth);

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as LinkButtonProps;
    return (
      <Link
        href={href}
        style={style}
        data-variant={variant}
        data-merlx-button
        {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonRest.type ?? 'button'}
      style={style}
      data-variant={variant}
      data-merlx-button
      {...buttonRest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
