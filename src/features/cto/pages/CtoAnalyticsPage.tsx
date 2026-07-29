import React, { useState } from "react";
import { BarChart3, Download, FileSpreadsheet, FileText, Filter, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

export function CtoAnalyticsPage() {
  const analyticsData = [
    { month: "Jan", velocity: 380, deploys: 120, leadTime: 4.2, bugs: 28 },
    { month: "Feb", velocity: 410, deploys: 145, leadTime: 3.8, bugs: 22 },
    { month: "Mar", velocity: 435, deploys: 160, leadTime: 3.5, bugs: 18 },
    { month: "Apr", velocity: 460, deploys: 185, leadTime: 3.1, bugs: 15 },
    { month: "May", velocity: 495, deploys: 210, leadTime: 2.8, bugs: 12 },
    { month: "Jun", velocity: 520, deploys: 242, leadTime: 2.4, bugs: 8 },
  ];

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
            <Button size="sm" onClick={() => toast.success("Exported Executive PDF Report")} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs cursor-pointer">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Exported Excel Data Sheet")} className="border-border text-foreground text-xs cursor-pointer">
              <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Deployment Frequency", val: "242 / mo", sub: "Daily automated deploys", color: "text-emerald-400" },
          { label: "Lead Time to PR Merge", val: "2.4 Hours", sub: "-42% reduction", color: "text-cyan-400" },
          { label: "Cycle Time (Commit→Deploy)", val: "18 mins", sub: "Fastest CI pipeline", color: "text-indigo-400" },
          { label: "Bug Escape Rate", val: "0.02%", sub: "Production stability", color: "text-purple-400" },
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
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Deployment Frequency vs Bug Count</h3>
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
        </div>
      </div>
    </div>
  );
}

export default CtoAnalyticsPage;
