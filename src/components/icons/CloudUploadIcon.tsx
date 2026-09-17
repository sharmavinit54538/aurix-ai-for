import React from "react";

export interface CloudUploadIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  size?: number | string;
}

export function CloudUploadIcon({
  className = "h-4 w-4",
  size,
  ...props
}: CloudUploadIconProps) {
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
      {/* Cloud outline with open bottom */}
      <path d="M9 19H7a3 3 0 0 1-3-2.8A4.5 4.5 0 0 1 6.3 8.8 6 6 0 0 1 17.7 8.8 4.5 4.5 0 0 1 20 16.2 3 3 0 0 1 17 19h-2" />
      {/* Upward upload arrow */}
      <path d="M12 21V11m-3.5 3.5L12 11l3.5 3.5" />
    </svg>
  );
}

export default CloudUploadIcon;
