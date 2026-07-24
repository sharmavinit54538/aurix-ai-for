import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, HeartPulse, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { KpiItem } from "@/store/aiInsights/aiInsightsTypes";
import { getAIInsightsIcon } from "../../utils/iconMap";

export const KpiCard = memo(function KpiCard({ kpi, delay = 0 }: { kpi: KpiItem; delay?: number }) {
  const Icon = getAIInsightsIcon(kpi.icon, HeartPulse);
  const up = kpi.trend >= 0;
  const positive = kpi.invert ? !up : up;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="font-display text-3xl font-semibold tracking-tight">
          {kpi.score}
          {kpi.label?.toLowerCase().includes("risk") ? "%" : ""}
        </div>
        <div className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(kpi.trend)}%
        </div>
      </div>
      <Progress value={Math.min(100, Math.max(0, kpi.score))} className="mt-3 h-1.5" />
      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
        <span>{kpi.hint}</span>
      </div>
    </motion.div>
  );
});
