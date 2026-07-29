import React from "react";
import { FileCheck, Shield, FileText, CheckCircle2, DollarSign, Award, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CioItGovernancePage() {
  const policies = [
    { name: "Enterprise Information Security Policy (EISP v4.2)", status: "Active & Approved", review: "Dec 2026" },
    { name: "GDPR & Data Residency Compliance Framework", status: "Active & Approved", review: "Nov 2026" },
    { name: "SaaS Vendor Risk & Third-Party License Policy", status: "Active & Approved", review: "Oct 2026" },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Compliance Score", val: "99.4%", sub: "SOC2 & GDPR Compliant", color: "text-purple-400" },
          { label: "Vendor Risk Audits", val: "42 Vendors", sub: "100% Risk Assessed", color: "text-indigo-400" },
          { label: "Software Licenses", val: "1,840 Active", sub: "$1.2M Annual License", color: "text-emerald-400" },
          { label: "Audit Logs Retention", val: "7 Years", sub: "Immutable Encrypted S3", color: "text-cyan-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground">Approved IT Enterprise Governance Policies</h3>
        <div className="space-y-2.5">
          {policies.map((p, idx) => (
            <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-foreground">{p.name}</h4>
                <div className="text-[11px] text-muted-foreground">Next Review Window: {p.review}</div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{p.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CioItGovernancePage;
