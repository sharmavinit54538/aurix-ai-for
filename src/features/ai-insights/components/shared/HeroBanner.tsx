import { memo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, CheckCircle2, TrendingUp, type LucideIcon } from "lucide-react";
import type { SummaryData } from "@/store/aiInsights/aiInsightsTypes";

function Pill({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{children}</span>
    </div>
  );
}

export const HeroBanner = memo(function HeroBanner({ summary }: { summary: SummaryData | null }) {
  const total = summary?.totalInsights ?? 0;
  const actioned = summary?.actionedCount ?? 0;
  const critical = summary?.criticalAlertsCount ?? 0;
  const delta = summary?.healthScoreDelta ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 10% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 60%), radial-gradient(50% 80% at 90% 100%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aurix Intelligence</div>
            <div className="font-display text-lg font-semibold">{total} new insights generated</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill icon={CheckCircle2}>{actioned} actioned</Pill>
          <Pill icon={AlertTriangle}>{critical} critical alerts</Pill>
          <Pill icon={TrendingUp}>{delta >= 0 ? `+${delta}` : delta} health score</Pill>
        </div>
      </div>
    </motion.div>
  );
});
