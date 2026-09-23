import React from "react";
import {
  Laptop, Server, ShieldCheck, Globe, FileCheck, Sparkles, BarChart3, Settings,
  AlertTriangle, CheckCircle2, Clock, RefreshCw, Download, Activity, Cpu, HardDrive, Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { toast } from "sonner";

export function CioOverviewPage() {
  const infraData: Array<{
    month: string;
    cpu: number;
    memory: number;
    cloudCost: number;
    availability: number;
  }> = [];

  const recentActivities: Array<{
    text: string;
    time: string;
    tag: string;
  }> = [];

  const upcomingMaintenance: Array<{
    window: string;
    service: string;
    impact: string;
  }> = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                <Laptop className="h-4 w-4" />
              </span>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold uppercase tracking-wider">
                CIO Enterprise IT Control Center
              </Badge>
              <Badge className="bg-muted text-muted-foreground border border-border text-[11px] font-bold">
                IT Systems Offline / Unconfigured
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Chief Information Officer Technology & Infrastructure Hub
            </h1>
            <p className="text-xs text-blue-200/70 max-w-2xl">
              Enterprise IT operations, global infrastructure health, SOC2 security score, cloud utilization, digital transformation, and IT governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.info("IT telemetry sync pending backend integration.")} className="bg-blue-600 hover:bg-blue-500 text-white text-xs cursor-pointer">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh Telemetry
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.info("No audit reports available to export.")} className="border-border text-foreground text-xs cursor-pointer">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* 8 Required Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total IT Managed Assets", val: "—", sub: "No assets cataloged", color: "text-blue-400" },
          { label: "Active Enterprise Users", val: "—", sub: "Directory sync pending", color: "text-indigo-400" },
          { label: "Critical Incidents", val: "—", sub: "Incident tracker offline", color: "text-emerald-400" },
          { label: "Infrastructure Health", val: "—", sub: "Probes pending", color: "text-cyan-400" },
          { label: "Cloud Resource Usage", val: "—", sub: "Cloud telemetry unlinked", color: "text-purple-400" },
          { label: "Cyber Security Score", val: "—", sub: "Audit pending", color: "text-emerald-400" },
          { label: "Annual IT Budget", val: "—", sub: "Budget unconfigured", color: "text-amber-400" },
          { label: "System Availability", val: "—", sub: "No SLA metrics recorded", color: "text-blue-400" },
        ].map((w, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1 backdrop-blur-xl">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{w.label}</div>
            <div className={`text-2xl font-bold font-display ${w.color}`}>{w.val}</div>
            <div className="text-[11px] text-muted-foreground">{w.sub}</div>
          </div>
        ))}
      </div>

      {/* 6 Required Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Infrastructure Utilization */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Infrastructure CPU & Memory Load (%)</h3>
              <p className="text-xs text-muted-foreground">Cluster compute utilization across data centers</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">—</Badge>
          </div>
          <div className="h-56 w-full pt-2">
            {infraData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                No infrastructure compute telemetry recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={infraData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU Load (%)" />
                  <Line type="monotone" dataKey="memory" stroke="#818cf8" strokeWidth={2} name="RAM Load (%)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Cloud Cost Trajectory */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Cloud Cost Trajectory ($k / Month)</h3>
              <p className="text-xs text-muted-foreground">AWS, Azure & GCP multi-cloud expenditure</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">—</Badge>
          </div>
          <div className="h-56 w-full pt-2">
            {infraData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                No cloud spend telemetry recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={infraData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="cloudCost" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Cloud Spend ($k)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Section 1: Recent IT Activities */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Recent Enterprise IT Activities
          </h3>
          <div className="space-y-2.5">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No recent IT activities recorded.
              </div>
            ) : (
              recentActivities.map((act, idx) => (
                <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">{act.tag}</Badge>
                    <span className="text-muted-foreground">{act.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">{act.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Upcoming Maintenance */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            Upcoming Scheduled IT Maintenance
          </h3>
          <div className="space-y-2.5">
            {upcomingMaintenance.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No upcoming maintenance windows scheduled.
              </div>
            ) : (
              upcomingMaintenance.map((m, idx) => (
                <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-foreground">{m.service}</h4>
                    <div className="text-[11px] text-muted-foreground">{m.window}</div>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">{m.impact}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CioOverviewPage;
