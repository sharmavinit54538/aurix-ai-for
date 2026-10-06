import React from "react";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoSettingsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                <Settings className="h-4 w-4" />
              </span>
              <Badge className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold uppercase">
                CTO Organization & Platform Settings
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering Platform & Integration Settings
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Git VCS integrations, cloud providers credentials (AWS, Azure, GCP), automated backup schedules, security policies, and billing overview.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Engineering platform configuration, VCS integrations, cloud provider credentials, and automated backup endpoints are not connected to a backend service."
      />
    </div>
  );
}

export default CtoSettingsPage;
