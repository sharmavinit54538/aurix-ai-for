import React from "react";
import { Wrench, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoEngineeringPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Wrench className="h-4 w-4" />
              </span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase">
                Engineering Management Hub
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Software Engineering & Development Management
            </h1>
            <p className="text-xs text-indigo-200/70 max-w-2xl">
              Sprint boards, code reviews, PR analytics, story point velocity tracking, technical debt backlog, architecture, and release planning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              title="Coming soon"
              className="bg-muted text-muted-foreground text-xs opacity-70 cursor-not-allowed"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Task
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              title="Coming soon"
              className="border-border text-muted-foreground text-xs opacity-70 cursor-not-allowed"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Sprint boards, code review tracking, pull request analytics, and release planning telemetry are not connected to a backend service."
      />
    </div>
  );
}

export default CtoEngineeringPage;
