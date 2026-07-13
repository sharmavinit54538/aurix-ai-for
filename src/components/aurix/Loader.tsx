import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export interface LoaderProps {
  label?: string;
  variant?: "inline" | "panel" | "overlay";
  size?: keyof typeof iconSizes;
  skeletonRows?: number;
  className?: string;
}

export function Loader({
  label = "Loading...",
  variant = "inline",
  size = "md",
  skeletonRows = 4,
  className,
}: LoaderProps) {
  const iconClass = iconSizes[size];

  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/60 backdrop-blur-sm",
          className,
        )}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-3 shadow-sm">
          <Loader2 className={cn(iconClass, "animate-spin text-primary")} />
          {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
        </div>
      </div>
    );
  }

  if (variant === "panel") {
    return (
      <div className={cn("space-y-4 p-8", className)} role="status" aria-live="polite" aria-busy="true">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className={cn(iconClass, "animate-spin")} />
          {label ? <span className="text-sm">{label}</span> : null}
        </div>
        <div className="space-y-2">
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className={cn(iconClass, "animate-spin")} />
      {label ? <span className="text-sm">{label}</span> : null}
    </span>
  );
}
