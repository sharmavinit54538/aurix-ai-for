import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown, TrendingUp, HandCoins, BarChart3, Users, ClipboardCheck, LineChart as LineChartIcon,
  Bot, Settings, ShieldCheck, Download, RefreshCw, Calendar, Sparkles, CheckCircle2,
  AlertCircle, ArrowUpRight, ArrowDownRight, DollarSign, Building2, Zap, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { toast } from "sonner";

export function CeoOverviewPage() {
  const financialData: any[] = [];
  const deptPerformance: any[] = [];
  const recentActivities: any[] = [];
  const upcomingDecisions: any[] = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Crown className="h-4 w-4" />
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
                CEO Executive Control Hub
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                Healthy Enterprise Growth
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Chief Executive Officer Strategy & Growth Portal
            </h1>
            <p className="text-xs text-amber-200/70 max-w-2xl">
              Real-time enterprise revenue, net profit, market expansion, department performance, cash flow trends, and executive decision-making.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.success("Refreshed CEO Executive Metrics")} className="bg-amber-600 hover:bg-amber-500 text-white text-xs cursor-pointer">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh Data
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Exported CEO Executive Report")} className="border-border text-foreground text-xs cursor-pointer">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Summary
            </Button>
          </div>
        </div>
      </div>

      {/* 8 Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Company Revenue (YTD)", val: "—", change: "Telemetry integration pending", color: "text-emerald-400" },
          { label: "Net Profit Margin", val: "—", change: "Telemetry integration pending", color: "text-amber-400" },
          { label: "Active Employees", val: "—", change: "Telemetry integration pending", color: "text-indigo-400" },
          { label: "Total Enterprise Clients", val: "—", change: "Telemetry integration pending", color: "text-cyan-400" },
          { label: "Active Strategic Projects", val: "—", change: "Telemetry integration pending", color: "text-purple-400" },
          { label: "Monthly Revenue Growth", val: "—", change: "Telemetry integration pending", color: "text-emerald-400" },
          { label: "Customer Satisfaction", val: "—", change: "Telemetry integration pending", color: "text-blue-400" },
          { label: "Company Health Score", val: "—", change: "Telemetry integration pending", color: "text-amber-400" },
        ].map((w, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1 backdrop-blur-xl">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{w.label}</div>
            <div className={`text-2xl font-bold font-display ${w.color}`}>{w.val}</div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span>{w.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Revenue & Profit Growth */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Revenue Growth vs Net Profit ($M)</h3>
              <p className="text-xs text-muted-foreground">Monthly revenue trajectory and profit margin</p>
            </div>
          </div>
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {financialData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="#10b981" name="Revenue ($M)" />
                  <Area type="monotone" dataKey="profit" stroke="#f59e0b" fillOpacity={0.1} fill="#f59e0b" name="Net Profit ($M)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No financial telemetry data available. Backend API integration pending.</p>
            )}
          </div>
        </div>

        {/* Chart 2: Cash Flow & Sales Analytics */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Operating Cash Flow & Sales Volume ($M)</h3>
              <p className="text-xs text-muted-foreground">Liquidity reserve & sales deal acceleration</p>
            </div>
          </div>
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {financialData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} name="Sales Deals ($M)" />
                  <Bar dataKey="cashFlow" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Cash Flow ($M)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No cash flow data available. Backend API integration pending.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3 Executive Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Section 1: Recent Activities */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" />
            Recent Executive Activities
          </h3>
          <div className="space-y-2.5">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, idx) => (
                <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400">{act.tag}</Badge>
                    <span className="text-muted-foreground">{act.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">{act.text}</p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                No recent executive activities recorded.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Department Performance */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-400" />
            Department Health & Growth
          </h3>
          <div className="space-y-2.5">
            {deptPerformance.length > 0 ? (
              deptPerformance.map((d, idx) => (
                <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-foreground">{d.dept}</h4>
                    <div className="text-[11px] text-muted-foreground">{d.headcount} Employees • {d.growth}</div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{d.score}</Badge>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                No department performance data available.
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Upcoming Decisions */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            Upcoming Executive Decisions
          </h3>
          <div className="space-y-2.5">
            {upcomingDecisions.length > 0 ? (
              upcomingDecisions.map((dec, idx) => (
                <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">{dec.priority} Priority</Badge>
                    <span className="text-muted-foreground font-mono">{dec.deadline}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">{dec.title}</p>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Opened decision review for ${dec.title}`)} className="w-full h-7 text-[10px] cursor-pointer">
                    Review & Sign
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                No pending executive decisions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CeoOverviewPage;
