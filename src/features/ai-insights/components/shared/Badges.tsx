import { memo } from "react";
import { Badge } from "@/components/ui/badge";

export const SeverityBadge = memo(function SeverityBadge({ severity }: { severity: string }) {
  if (severity === "Critical") {
    return <Badge className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/20">Critical</Badge>;
  }
  if (severity === "Medium") {
    return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20">Medium</Badge>;
  }
  return <Badge className="bg-sky-500/15 text-sky-500 hover:bg-sky-500/20">Low</Badge>;
});

export const RiskPill = memo(function RiskPill({ score }: { score: number }) {
  const tone =
    score >= 80 ? "bg-rose-500/15 text-rose-500" : score >= 65 ? "bg-amber-500/15 text-amber-500" : "bg-sky-500/15 text-sky-500";
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>{score}</span>;
});

export const ToneDot = memo(function ToneDot({ tone }: { tone: string }) {
  const color = tone === "crit" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-sky-500";
  return <span className={`h-2 w-2 rounded-full ${color}`} />;
});

export const BarMeter = memo(function BarMeter({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "violet";
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: tone === "violet" ? "linear-gradient(90deg,#8b5cf6,#d946ef)" : "var(--gradient-brand)",
          }}
        />
      </div>
      <span className="w-9 text-right text-xs font-medium">{value}%</span>
    </div>
  );
});
