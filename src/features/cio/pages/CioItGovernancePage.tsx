import React from "react";
import { FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CioItGovernancePage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <FileCheck className="h-4 w-4" />
              </span>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase">
                IT Governance & Regulatory Compliance
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              IT Policies, Audit Logs & Technology Roadmap
            </h1>
            <p className="text-xs text-purple-200/70 max-w-2xl">
              ISO27001 & SOC2 Type II compliance audit trails, SaaS vendor license management, risk assessment matrix, and IT capital budget allocation.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="IT governance policies, compliance audit trails, and vendor license management records are not connected to a backend service."
      />
    </div>
  );
}

export default CioItGovernancePage;
