import React from "react";
import { ShieldCheck, Lock, AlertTriangle, Key, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CioCyberSecurityPage() {
  const threatLog: Array<{
    id: string;
    event: string;
    risk: string;
    time: string;
  }> = [];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "SOC Security Score", val: "—", sub: "Scan pending", color: "text-emerald-400" },
          { label: "Critical Vulnerabilities", val: "—", sub: "Vulnerability scan pending", color: "text-emerald-400" },
          { label: "Blocked Threat Attacks", val: "—", sub: "WAF telemetry pending", color: "text-rose-400" },
          { label: "Zero Trust IAM Policy", val: "—", sub: "IAM baseline pending", color: "text-indigo-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground">Threat Monitoring & Mitigations</h3>
        {threatLog.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No active threat alerts, intrusion attempts, or mitigation logs recorded.
          </div>
        ) : (
          <div className="space-y-2.5">
            {threatLog.map((t) => (
              <div key={t.id} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-bold text-xs">{t.id}</span>
                    <h4 className="font-bold text-xs text-foreground">{t.event}</h4>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Logged: {t.time}</div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{t.risk}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CioCyberSecurityPage;
