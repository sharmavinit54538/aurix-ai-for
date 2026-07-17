import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, className = "" }: ChartCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`}>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="font-display text-sm font-semibold">{title}</div>
          {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
        </div>
      </div>
      {children}
    </div>
  );
}
