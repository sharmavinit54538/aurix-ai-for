import React from "react";

export interface OneHRIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  gradient?: boolean;
}

export function OneHRIcon({
  className = "h-5 w-5",
  gradient = true,
  ...props
}: OneHRIconProps) {
  const rawId = React.useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const primaryGradId = `onehr-primary-grad-${safeId}`;
  const accentGradId = `onehr-accent-grad-${safeId}`;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {gradient && (
        <defs>
          <linearGradient id={primaryGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id={accentGradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      )}

      {/* Outer unified "One" orbit ring */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke={gradient ? `url(#${primaryGradId})` : "currentColor"}
        strokeWidth="1.8"
        strokeDasharray="48 10"
        strokeLinecap="round"
        className={gradient ? "opacity-90" : "opacity-80"}
      />

      {/* Central Sharp Numeral "1" (The Singularity / One) */}
      <path
        d="M8.5 8.75L12 6.5V17.5H14.5V4.75H11.25L8 7.25V8.75H8.5Z"
        fill={gradient ? `url(#${primaryGradId})` : "currentColor"}
      />

      {/* Dynamic "H" Crossbar & "R" Loop / Workforce Wave */}
      <path
        d="M5.5 13H11M14.5 10H16.8C18 10 19 11 19 12.2C19 13.4 18 14.4 16.8 14.4H14.5M16.5 14.4L19 18"
        stroke={gradient ? `url(#${accentGradId})` : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Autonomous Node / People Spark */}
      <circle
        cx="17.75"
        cy="6.75"
        r="1.75"
        fill={gradient ? `url(#${accentGradId})` : "currentColor"}
      />
    </svg>
  );
}

export default OneHRIcon;
