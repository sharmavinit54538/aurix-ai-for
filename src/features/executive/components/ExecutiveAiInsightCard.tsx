import React from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, CheckCircle2, Info, ArrowUpRight } from "lucide-react";
import type { AiInsightItem } from "../types/executiveTypes";

export interface ExecutiveAiInsightCardProps {
  insights: AiInsightItem[];
  roleTitle: string;
}

export function ExecutiveAiInsightCard({ insights, roleTitle }: ExecutiveAiInsightCardProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 backdrop-blur-xl text-left space-y-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-sm font-bold text-indigo-400">
          <Sparkles className="h-4 w-4 text-brand animate-pulse" />
          <span>{roleTitle} AI Intelligence Recommendations</span>
        </div>
        <span className="text-[10px] font-mono font-semibold bg-brand/10 text-brand px-2.5 py-0.5 rounded-full border border-brand/30">
          Autonomous Copilot
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((item, idx) => {
          const isHigh = item.severity === "high";
          const isSuccess = item.severity === "success";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`rounded-xl border p-3.5 space-y-1.5 bg-card/60 backdrop-blur-md transition-all duration-200 hover:border-brand/40 ${
                isHigh
                  ? "border-amber-500/30 bg-amber-500/5"
                  : isSuccess
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[10px] text-muted-foreground/80">{item.timestamp}</span>
              </div>

              <h4 className="font-display text-xs font-bold text-foreground flex items-center justify-between gap-1">
                <span>{item.title}</span>
                {isSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                )}
              </h4>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {item.actionText && (
                <button
                  type="button"
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer"
                >
                  <span>{item.actionText}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
