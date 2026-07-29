import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface CtoKpiItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  color?: string;
}

interface CtoKpiGridProps {
  kpis: CtoKpiItem[];
  loading?: boolean;
}

export function CtoKpiGrid({ kpis, loading }: CtoKpiGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-xl border border-border/60 bg-card/40 p-4 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, index) => {
        const isUp = kpi.trend === "up";
        const isDown = kpi.trend === "down";

        return (
          <motion.div
            key={kpi.id || index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.02 }}
            className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-xl transition-all duration-200 hover:border-accent hover:shadow-lg hover:shadow-accent/5 text-left"
          >
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {kpi.title}
              </div>
              <div className={`mt-1.5 text-2xl font-bold font-display tracking-tight ${kpi.color || "text-foreground"}`}>
                {kpi.value}
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
              <span className="truncate text-muted-foreground">{kpi.change}</span>
              <span
                className={`flex items-center gap-0.5 font-medium shrink-0 ${
                  isUp
                    ? "text-emerald-400"
                    : isDown
                    ? "text-rose-400"
                    : "text-muted-foreground"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : isDown ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
