import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FlagImageProps {
  code?: string;
  alt?: string;
  className?: string;
}

export function FlagImage({ code = "", alt, className }: FlagImageProps) {
  const [error, setError] = useState(false);
  const normalizedCode = code.trim().toLowerCase();

  // If code is missing or UN/Global or image fails
  if (error || !normalizedCode || normalizedCode === "un" || normalizedCode === "global" || normalizedCode === "utc") {
    return (
      <span
        className={cn(
          "inline-flex h-[18px] w-[28px] shrink-0 items-center justify-center rounded-[2px] bg-muted/80 font-mono text-[10px] font-bold uppercase text-muted-foreground border border-border/70 select-none",
          className
        )}
      >
        {code && code.length >= 2 ? code.slice(0, 2).toUpperCase() : "INT"}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${normalizedCode}.png`}
      alt={alt || code}
      loading="lazy"
      onError={() => setError(true)}
      className={cn(
        "h-[18px] w-[28px] rounded-[2px] object-cover shadow-xs border border-white/20 dark:border-white/10 shrink-0 select-none",
        className
      )}
    />
  );
}
