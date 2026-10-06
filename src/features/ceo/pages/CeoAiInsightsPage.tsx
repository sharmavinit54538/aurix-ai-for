import React from "react";
import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CeoAiInsightsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-violet-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Bot className="h-4 w-4" />
              </span>
              <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-bold uppercase">
                Executive AI Intelligence Center
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Business Forecasting & Decision Support
            </h1>
            <p className="text-xs text-violet-200/70 max-w-2xl">
              Predictive revenue modeling, AI smart recommendations, competitive intelligence, risk forecasting, and automated executive summaries.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Predictive forecasting models and strategic recommendation services are not connected yet."
      />
    </div>
  );
}

export default CeoAiInsightsPage;
