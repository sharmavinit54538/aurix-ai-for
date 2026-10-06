import React from "react";
import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusBadgeClass } from "@/lib/status-styles";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoProjectsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Folder className="h-4 w-4" />
              </span>
              <Badge variant="outline" className={`text-[11px] font-bold uppercase ${statusBadgeClass("info")}`}>
                Project Portfolio Management
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineering Project Portfolio & Details
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Project list, timeline, Kanban board, Gantt chart view, milestones, risk matrix, budget tracking, team allocation, and detailed project drawers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" disabled title="Coming soon" className="text-xs opacity-70 cursor-not-allowed">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Engineering project portfolios, timelines, Kanban boards, and milestone tracking are not connected to a backend service."
      />
    </div>
  );
}

export default CtoProjectsPage;
