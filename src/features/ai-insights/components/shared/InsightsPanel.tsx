import { memo } from "react";
import type { LucideIcon } from "lucide-react";

export const InsightsPanel = memo(function InsightsPanel({
  title,
  icon: Icon,
  accent,
  children,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  accent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl ${className}`}>
      {accent ? (
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent} opacity-60`} />
      ) : null}
      <div className="relative flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Icon className="h-4 w-4 text-foreground/70" />
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="relative p-4">{children}</div>
    </div>
  );
});
