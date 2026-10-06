import React from "react";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CeoOperationsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <ClipboardCheck className="h-4 w-4" />
              </span>
              <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold uppercase">
                Business Operations & Approvals
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Business Operations Health & Executive Signoffs
            </h1>
            <p className="text-xs text-sky-200/70 max-w-2xl">
              Operational productivity, resource allocation, pending high-value executive approvals, procurement contracts, and business process compliance.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Business operations health metrics, resource allocation, and executive approval workflows are not connected to a backend service."
      />
    </div>
  );
}

export default CeoOperationsPage;
