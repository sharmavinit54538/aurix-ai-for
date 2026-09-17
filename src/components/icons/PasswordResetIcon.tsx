import React from "react";

export interface PasswordResetIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  size?: number | string;
}

export function PasswordResetIcon({
  className = "h-4 w-4",
  size,
  ...props
}: PasswordResetIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Outer circular arc with opening at bottom-right */}
      <path d="M20.8 12.5A9.5 9.5 0 1 0 14.2 20.8" />

      {/* Four password dots */}
      <circle cx="6.8" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.2" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="11.5" r="1.1" fill="currentColor" stroke="none" />

      {/* Bottom-right reload arrow */}
      <path d="M21.5 17.5a3 3 0 1 1-2.4-2.9" />
      <polyline points="21.5 14 21.5 17.5 18 17.5" />
    </svg>
  );
}

export default PasswordResetIcon;
