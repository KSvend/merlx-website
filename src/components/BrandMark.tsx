interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 303.02 236.75"
      width={size}
      height={(size * 236.75) / 303.02}
      className={className}
      role="img"
      aria-label="MERLx"
    >
      <rect fill="#1a3a34" x="223.02" width="80" height="227.61" />
      <rect fill="#ca5d0f" x="0" y="137.61" width="90" height="90" rx="45" ry="45" />
      <path
        fill="#4a3f6b"
        d="M148.08,236.75h0l-42.58-102.77c-9.65-24.57,10.73-56.34,40.97-57.21.54-.02,1.08-.02,1.62-.02h0c.54,0,1.08,0,1.62.02,30.24.88,50.62,32.64,40.97,57.21l-42.58,102.77Z"
      />
    </svg>
  );
}
