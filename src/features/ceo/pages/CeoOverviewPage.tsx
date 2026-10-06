import React from "react";
import { Crown, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CeoOverviewPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Crown className="h-4 w-4" />
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
                CEO Executive Control Hub
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Chief Executive Officer Strategy & Growth Portal
            </h1>
            <p className="text-xs text-amber-200/70 max-w-2xl">
              Real-time enterprise revenue, net profit, market expansion, department performance, cash flow trends, and executive decision-making.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              title="Coming soon"
              className="bg-muted text-muted-foreground text-xs opacity-70 cursor-not-allowed"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh Data
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled
              title="Coming soon"
              className="border-border text-muted-foreground text-xs opacity-70 cursor-not-allowed"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <EmptyState
        title="Data not available yet"
        description="CEO executive metrics, financial telemetry, and strategic decision feeds are currently not connected to a backend service."
      />
    </div>
  );
}

export default CeoOverviewPage;
