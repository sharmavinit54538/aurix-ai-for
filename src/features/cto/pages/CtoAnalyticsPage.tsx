import React from "react";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoAnalyticsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <BarChart3 className="h-4 w-4" />
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase">
                Engineering Velocity & Metrics
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering Velocity & Deployment Metrics
            </h1>
            <p className="text-xs text-emerald-200/70 max-w-2xl">
              Deployment frequency, lead time for PR review, cycle time, sprint velocity, and bug escape rates.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Engineering sprint velocity, VCS pull request lead time, and production release telemetry are not connected to a backend service."
      />
    </div>
  );
}

export default CtoAnalyticsPage;
