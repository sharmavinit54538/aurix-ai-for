import React from "react";
import { Globe, Cloud, Cpu, Server, Network, Lock, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CioCloudNetworkPage() {
  const trafficData: Array<{
    time: string;
    bandwidth: number;
    cloudCost: number;
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
                Multi-Cloud & Global Network Hub
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AWS, Azure, GCP & SD-WAN Network Management
            </h1>
            <p className="text-xs text-sky-200/70 max-w-2xl">
              Kubernetes cluster nodes, Docker container registries, enterprise VPN tunnels, BGP load balancers, DNS routing, and wildcard SSL certificates.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Cloud Clusters", val: "—", sub: "No clusters connected", color: "text-sky-400" },
          { label: "Network Bandwidth", val: "—", sub: "SD-WAN telemetry pending", color: "text-indigo-400" },
          { label: "VPN Tunnel Uptime", val: "—", sub: "No active tunnels", color: "text-emerald-400" },
          { label: "SSL Certificate SLA", val: "—", sub: "No certificates tracked", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground">Global Network Traffic Bandwidth (Gbps)</h3>
        <div className="h-56 w-full pt-2">
          {trafficData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
              No network bandwidth telemetry recorded.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="bandwidth" stroke="#0284c7" fill="#0284c7" fillOpacity={0.2} name="Bandwidth (Gbps)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default CioCloudNetworkPage;
