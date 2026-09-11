import React from "react";

export interface GeminiIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  gradient?: boolean;
}

export function GeminiIcon({ className = "h-5 w-5", gradient = false, ...props }: GeminiIconProps) {
  const gradientId = React.useId();

  return (
    <svg
      viewBox="0 0 296 298"
      className={className}
      fill={gradient ? `url(#${gradientId})` : "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E82EE" />
            <stop offset="35%" stopColor="#9B72CF" />
            <stop offset="70%" stopColor="#D96570" />
            <stop offset="100%" stopColor="#F4A261" />
          </linearGradient>
        </defs>
      )}
      <path d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z" />
    </svg>
  );
}

export default GeminiIcon;
