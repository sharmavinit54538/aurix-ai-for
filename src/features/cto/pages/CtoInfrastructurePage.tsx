import React from "react";
import { Globe, Building, Cpu, Folder, Workflow, ShieldCheck, Scale, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CtoInfrastructurePage() {
  const servers: Array<{
    name: string;
    type: string;
    ip: string;
    cpu: string;
    ram: string;
    status: string;
  }> = [];

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

      <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
            <tr>
              <th className="p-3">Server Instance</th>
              <th className="p-3">Instance Type</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">CPU Usage</th>
              <th className="p-3">RAM Usage</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {servers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                  No cloud or compute infrastructure connected.
                </td>
              </tr>
            ) : (
              servers.map((s, idx) => (
                <tr key={idx} className="hover:bg-accent/20 transition-colors">
                  <td className="p-3 font-bold text-foreground">{s.name}</td>
                  <td className="p-3 text-muted-foreground">{s.type}</td>
                  <td className="p-3 font-mono text-sky-400">{s.ip}</td>
                  <td className="p-3 font-mono text-emerald-400">{s.cpu}</td>
                  <td className="p-3 font-mono text-indigo-400">{s.ram}</td>
                  <td className="p-3">
                    <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{s.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CtoInfrastructurePage;
