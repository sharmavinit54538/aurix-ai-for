import React from "react";
import { Lock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoSecurityPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Lock className="h-4 w-4" />
              </span>
              <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold uppercase">
                Security Operations & Monitoring
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Enterprise Security Operations & Audit Logs
            </h1>
            <p className="text-xs text-rose-200/70 max-w-2xl">
              Security Operations Center (SOC), threat detection alerts, application audit logs, system health checks, API keys manager, and secrets vault.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              title="Coming soon"
              className="bg-rose-600/50 text-white/70 text-xs cursor-not-allowed opacity-70"
            >
              <FileCheck className="mr-1.5 h-3.5 w-3.5" />
              Export Audit Logs
            </Button>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Enterprise security operations center, threat detection alerts, and system audit logs are not connected to a backend service."
      />
    </div>
  );
}

export default CtoSecurityPage;
