import React from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CeoOrganizationPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Users className="h-4 w-4" />
              </span>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase">
                Global Workforce & Leadership
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Organization Headcount & Executive Leadership
            </h1>
            <p className="text-xs text-blue-200/70 max-w-2xl">
              Department structures, workforce expansion planning, leadership team directory, employee retention rates, and performance analytics.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Global workforce headcount, department organizational charts, and executive retention telemetry are not connected to a backend service."
      />
    </div>
  );
}

export default CeoOrganizationPage;
