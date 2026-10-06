import React from "react";
import { Laptop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CioItOperationsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Laptop className="h-4 w-4" />
              </span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase">
                Service Desk & ITSM Operations
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              IT Service Desk & Incident Management Operations
            </h1>
            <p className="text-xs text-indigo-200/70 max-w-2xl">
              ITSM incident resolution, change request workflows, software asset inventory, automated patch management, and SLA compliance.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="IT service desk tickets, ITSM incident resolution metrics, and automated patch management telemetry are not connected to a backend service."
      />
    </div>
  );
}

export default CioItOperationsPage;
