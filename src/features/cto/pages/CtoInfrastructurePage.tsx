import React from "react";
import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoInfrastructurePage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Globe className="h-4 w-4" />
              </span>
              <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold uppercase">
                Cloud & Servers Infrastructure
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Cloud Resources & Server Infrastructure
            </h1>
            <p className="text-xs text-sky-200/70 max-w-2xl">
              Virtual machines, EC2 instances, load balancers, CDN edge nodes, SSL certificates, storage buckets, and global networking setup.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Cloud compute instances, storage clusters, CDN distributions, and network gateways are not connected to a backend service."
      />
    </div>
  );
}

export default CtoInfrastructurePage;
