import React, { useState } from "react";
import { BarChart3, Download, FileSpreadsheet, FileText, Filter, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

export function CtoAnalyticsPage() {
  const analyticsData: Array<{
    month: string;
    velocity: number;
    deploys: number;
    leadTime: number;
    bugs: number;
  }> = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <BarChart3 className="h-4 w-4" />
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase">
                Engineering & Product Analytics
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering Velocity & System Analytics Reports
            </h1>
            <p className="text-xs text-emerald-200/70 max-w-2xl">
              Developer productivity, deployment frequency, lead time to production, cycle time, bug trends, and downloadable executive reports (PDF, Excel, CSV).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.info("No analytics data available to export.")} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs cursor-pointer">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.info("No analytics data available to export.")} className="border-border text-foreground text-xs cursor-pointer">
              <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Deployment Frequency", val: "—", sub: "No deployments recorded", color: "text-emerald-400" },
          { label: "Lead Time to PR Merge", val: "—", sub: "VCS integration pending", color: "text-cyan-400" },
          { label: "Cycle Time (Commit→Deploy)", val: "—", sub: "No telemetry recorded", color: "text-indigo-400" },
          { label: "Bug Escape Rate", val: "—", sub: "No incident data recorded", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Sprint Velocity Trend</h3>
          {analyticsData.length === 0 ? (
            <div className="h-56 w-full flex items-center justify-center text-xs text-muted-foreground">
              No velocity history recorded. Sprint tracking integration pending.
            </div>
          ) : (
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="velocity" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Story Points" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Deployment Frequency vs Bug Count</h3>
          {analyticsData.length === 0 ? (
            <div className="h-56 w-full flex items-center justify-center text-xs text-muted-foreground">
              No deployment or bug metrics recorded.
            </div>
          ) : (
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Bar dataKey="deploys" fill="#6366f1" radius={[4, 4, 0, 0]} name="Deploys" />
                  <Bar dataKey="bugs" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Production Bugs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CtoAnalyticsPage;
