import React from "react";
import { Activity, Cpu, Folder, Zap, Clock, FileText, AlertCircle, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CtoMonitoringPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Activity className="h-4 w-4" />
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase">
                Monitoring & Observability
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Live System Metrics & Application Logs
            </h1>
            <p className="text-xs text-emerald-200/70 max-w-2xl">
              Real-time CPU, RAM, Disk, GPU metrics, latency tracking, API error rate monitoring, and live application logs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "CPU Utilization", val: "34%", status: "Normal", color: "text-emerald-400" },
          { name: "RAM Memory Load", val: "58%", status: "Optimal", color: "text-indigo-400" },
          { name: "GPU Cluster Load", val: "74%", status: "Inference Active", color: "text-purple-400" },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{m.name}</div>
            <div className={`text-3xl font-bold font-display ${m.color}`}>{m.val}</div>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">{m.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CtoMonitoringPage;
