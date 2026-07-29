import React from "react";
import { ClipboardCheck, Activity, CheckCircle2, Clock, ShieldCheck, Zap, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CeoOperationsPage() {
  const approvals = [
    { id: "APP-401", title: "AWS Cloud Infrastructure Reserved Instance Commitment ($420k)", requester: "Vinit Sharma (CTO)", amount: "$420,000", status: "Pending CEO Signoff" },
    { id: "APP-402", title: "APAC Regional Sales Office Lease Contract", requester: "Neha Gupta (Ops)", amount: "$180,000", status: "Pending CEO Signoff" },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Operational Health", val: "98.4%", sub: "Zero business bottlenecks", color: "text-sky-400" },
          { label: "Pending Signoffs", val: "2 Contracts", sub: "Requires CEO approval", color: "text-amber-400" },
          { label: "Resource Utilization", val: "91.2%", sub: "Optimal efficiency", color: "text-emerald-400" },
          { label: "SOC2 Compliance", val: "Verified", sub: "ISO27001 Certified", color: "text-indigo-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground">Pending Executive Approvals</h3>
        <div className="space-y-2.5">
          {approvals.map((app) => (
            <div key={app.id} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sky-400 font-bold text-xs">{app.id}</span>
                  <h4 className="font-bold text-xs text-foreground">{app.title}</h4>
                </div>
                <div className="text-[11px] text-muted-foreground">Requester: {app.requester} • Amount: {app.amount}</div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">{app.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CeoOperationsPage;
