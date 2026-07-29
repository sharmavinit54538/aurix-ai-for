import React from "react";
import { Building, Server, HardDrive, Database, ShieldCheck, Cpu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CioInfrastructurePage() {
  const dataCenters = [
    { name: "US-East (N. Virginia)", nodes: "128 Bare Metal", status: "Healthy", uptime: "100%", load: "68%" },
    { name: "EU-Central (Frankfurt)", nodes: "84 Bare Metal", status: "Healthy", uptime: "99.99%", load: "72%" },
    { name: "AP-South (Mumbai)", nodes: "48 Bare Metal", status: "Healthy", uptime: "99.98%", load: "61%" },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Infrastructure Health", val: "99.98%", sub: "3 Regional Hubs", color: "text-cyan-400" },
          { label: "Compute Utilization", val: "68.4%", sub: "260 Bare-metal nodes", color: "text-indigo-400" },
          { label: "Storage SAN Capacity", val: "420 TB / 600 TB", sub: "70% Storage Used", color: "text-emerald-400" },
          { label: "Backup RPO SLA", val: "< 15 Mins", sub: "Zero Data Loss RTO", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground">Global Data Center Hubs</h3>
        <div className="space-y-2.5">
          {dataCenters.map((dc, idx) => (
            <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-foreground">{dc.name}</h4>
                <div className="text-[11px] text-muted-foreground">Cluster Size: {dc.nodes} • Compute Load: {dc.load}</div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">{dc.uptime} Uptime</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CioInfrastructurePage;
