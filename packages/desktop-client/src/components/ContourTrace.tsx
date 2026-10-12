import type { CSSProperties } from 'react';

type ContourTraceProps = {
  className?: string;
  style?: CSSProperties;
};

export function ContourTrace({ className, style }: ContourTraceProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 100 40"
      style={style}
    >
      <path
        d="M-5 29C8 29 7 14 22 14s12 12 25 12 14-18 29-18 13 9 29 7"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M-5 35c17 0 17-15 30-15s12 12 25 12 14-18 29-18 13 9 29 7"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M-5 23C8 23 7 8 22 8s12 12 25 12S61 2 76 2s13 9 29 7"
        stroke="currentColor"
        strokeWidth="1.15"
      />
    </svg>
  );
}
