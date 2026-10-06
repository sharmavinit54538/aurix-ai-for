import React from "react";
import { Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CioInfrastructurePage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Building className="h-4 w-4" />
              </span>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold uppercase">
                Global Infrastructure & Data Centers
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Data Centers, Bare-Metal Servers & Disaster Recovery
            </h1>
            <p className="text-xs text-cyan-200/70 max-w-2xl">
              Worldwide data center clusters, hypervisor virtual machines, SAN storage capacity, automated backup snapshots, and RTO/RPO disaster recovery.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Global data center infrastructure, hypervisor compute loads, and disaster recovery telemetry are not connected to a backend service."
      />
    </div>
  );
}

export default CioInfrastructurePage;
