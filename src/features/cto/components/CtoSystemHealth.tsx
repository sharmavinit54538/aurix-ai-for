import React from "react";
import { Activity, CheckCircle2, ShieldCheck, Server, Database, Cpu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SystemHealthItem {
  name: string;
  status: string;
  uptime: string;
  latency: string;
  indicator: string;
}

interface CtoSystemHealthProps {
  services: SystemHealthItem[];
}

export function CtoSystemHealth({ services }: CtoSystemHealthProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xl space-y-4 text-left shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
            Live System & Service Operational Health
          </h3>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold">
          100% Operational SLA
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-border/40 bg-accent/10 p-3.5 transition-colors hover:bg-accent/20"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`relative flex h-2.5 w-2.5 shrink-0`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.indicator} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${item.indicator}`} />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{item.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  Uptime: <span className="font-medium text-emerald-400">{item.uptime}</span> • Latency: <span className="font-mono text-cyan-400">{item.latency}</span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 text-emerald-400 shrink-0">
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
