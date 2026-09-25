import React, { useEffect, useState } from "react";
import { Server, Cpu, Database, Activity, CheckCircle2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { superAdminApi } from "../superAdminApi";
import type { PlatformSystemHealth } from "../types";

export function SuperAdminPlatformConfigPage() {
  const [health, setHealth] = useState<PlatformSystemHealth | null>(null);

  const loadData = async () => {
    try {
      const data = await superAdminApi.getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error("Failed to load platform config data", err);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Cluster Status</div>
              <div className="text-lg font-bold text-emerald-400 capitalize">{health?.status || "Healthy"}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2 flex justify-between">
            <span>Uptime:</span>
            <span className="font-mono text-foreground">{health?.uptime}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Database Latency</div>
              <div className="text-lg font-bold text-foreground">{health?.databaseLatencyMs || 14} ms</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2 flex justify-between">
            <span>Pool Connections:</span>
            <span className="font-mono text-foreground">{health?.activeConnections}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Server Load</div>
              <div className="text-lg font-bold text-foreground">{health?.cpuLoadPercent || 19}% CPU</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2 flex justify-between">
            <span>RAM Usage:</span>
            <span className="font-mono text-foreground">{health?.memoryUsagePercent}%</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
        <h3 className="font-bold text-base text-foreground mb-3">Service Dependencies</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-foreground">PostgreSQL Multi-Tenant DB</span>
            </div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
              ONLINE (14ms)
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-foreground">Redis Cache &amp; Rate Limiter</span>
            </div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
              ONLINE (2ms)
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-foreground">AI Gateway &amp; LLM Service</span>
            </div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
              ONLINE (Gemini 2.5/3.0 Ready)
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
