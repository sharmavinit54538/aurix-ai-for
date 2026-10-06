import React from "react";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CioCyberSecurityPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold uppercase">
                Security Operations Center (SOC)
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Cyber Security Operations & Threat Monitoring
            </h1>
            <p className="text-xs text-rose-200/70 max-w-2xl">
              Real-time threat detection, zero-trust vulnerability management, IAM access control, endpoint protection, and Next-Gen Firewall rule enforcement.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Security operations center metrics, vulnerability scans, WAF telemetry, and zero-trust policy audits are not connected to a backend service."
      />
    </div>
  );
}

export default CioCyberSecurityPage;
