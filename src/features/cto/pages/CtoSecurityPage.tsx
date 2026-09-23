import React, { useState } from "react";
import { Lock, ShieldCheck, ShieldAlert, Key, FileCheck, Activity, HeartPulse, FileText, Sliders, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CtoSecurityPage() {
  const auditLogs: Array<{
    time: string;
    actor: string;
    action: string;
    ip: string;
    status: string;
  }> = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Lock className="h-4 w-4" />
              </span>
              <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold uppercase">
                Security Operations & Monitoring
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Enterprise Security Operations & Audit Logs
            </h1>
            <p className="text-xs text-rose-200/70 max-w-2xl">
              Security Operations Center (SOC), threat detection alerts, application audit logs, system health checks, API keys manager, and secrets vault.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.info("No audit logs available to export.")} className="bg-rose-600 hover:bg-rose-500 text-white text-xs cursor-pointer">
              <FileCheck className="mr-1.5 h-3.5 w-3.5" />
              Export Audit Logs
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Security Health Score", val: "—", sub: "Compliance scan pending", color: "text-emerald-400" },
          { label: "Threat Detection Alerts", val: "—", sub: "IDS/IPS sensor offline", color: "text-rose-400" },
          { label: "MFA Enrollment", val: "—", sub: "Directory auth telemetry pending", color: "text-indigo-400" },
          { label: "System Health SLA", val: "—", sub: "Awaiting probe telemetry", color: "text-cyan-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="audit" className="text-xs font-semibold">Audit Logs</TabsTrigger>
          <TabsTrigger value="threats" className="text-xs font-semibold">Threat Detection</TabsTrigger>
          <TabsTrigger value="monitoring" className="text-xs font-semibold">System Monitoring & Logs</TabsTrigger>
          <TabsTrigger value="apikeys" className="text-xs font-semibold">API Keys & Secrets</TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User / Actor</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                      No security audit events or access logs recorded.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-accent/20 transition-colors">
                      <td className="p-3 font-mono text-muted-foreground">{log.time}</td>
                      <td className="p-3 font-semibold text-foreground">{log.actor}</td>
                      <td className="p-3 text-foreground">{log.action}</td>
                      <td className="p-3 font-mono text-indigo-400">{log.ip}</td>
                      <td className="p-3">
                        <Badge className={`text-[10px] ${log.status === "Blocked" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="threats">
          <div className="rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            No active threat alerts or intrusion detection incidents reported.
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            System logs and daemon telemetry stream unconfigured.
          </div>
        </TabsContent>

        <TabsContent value="apikeys">
          <div className="rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            No API keys or integration credentials registered.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CtoSecurityPage;
