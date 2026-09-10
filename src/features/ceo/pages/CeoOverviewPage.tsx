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
  const financialData = [
    { month: "Jan", revenue: 1.1, profit: 0.28, sales: 0.9, cashFlow: 1.4 },
    { month: "Feb", revenue: 1.25, profit: 0.32, sales: 1.05, cashFlow: 1.5 },
    { month: "Mar", revenue: 1.4, profit: 0.38, sales: 1.2, cashFlow: 1.7 },
    { month: "Apr", revenue: 1.6, profit: 0.44, sales: 1.35, cashFlow: 1.9 },
    { month: "May", revenue: 1.85, profit: 0.52, sales: 1.5, cashFlow: 2.2 },
    { month: "Jun", revenue: 2.1, profit: 0.61, sales: 1.8, cashFlow: 2.5 },
  ];

  const deptPerformance = [
    { dept: "Engineering & AI", score: "98%", growth: "+24%", headcount: 84 },
    { dept: "Sales & Revenue", score: "94%", growth: "+18%", headcount: 48 },
    { dept: "Operations & HR", score: "96%", growth: "+12%", headcount: 52 },
    { dept: "Customer Success", score: "99%", growth: "+15%", headcount: 36 },
  ];

  const recentActivities = [
    { text: "Acquired Series B funding commitment ($15M)", time: "2 hours ago", tag: "Finance" },
    { text: "Approved APAC Region Market Expansion Plan", time: "5 hours ago", tag: "Strategy" },
    { text: "Signed Enterprise Master Contract with Equinox", time: "Yesterday", tag: "Sales" },
    { text: "SOC2 Type II Audit Certification Awarded", time: "2 days ago", tag: "Compliance" },
  ];

  const upcomingDecisions = [
    { title: "Q4 Engineering R&D Budget Approval ($2.4M)", priority: "High", deadline: "Jul 30, 2026" },
    { title: "EU Data Center Expansion Partnership", priority: "Medium", deadline: "Aug 05, 2026" },
    { title: "Executive Compensation & Equity Restructure", priority: "High", deadline: "Aug 12, 2026" },
  ];

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

      {/* 8 Required Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Company Revenue (YTD)", val: "$14.2M", change: "+24.8% vs LY", color: "text-emerald-400" },
          { label: "Net Profit Margin", val: "$3.8M (26.7%)", change: "+4.2% QoQ", color: "text-amber-400" },
          { label: "Active Employees", val: "248 Team", change: "98% Retained", color: "text-indigo-400" },
          { label: "Total Enterprise Clients", val: "1,420 Clients", change: "+182 New Q3", color: "text-cyan-400" },
          { label: "Active Strategic Projects", val: "34 Projects", change: "92% On Track", color: "text-purple-400" },
          { label: "Monthly Revenue Growth", val: "+18.4%", change: "Accelerating", color: "text-emerald-400" },
          { label: "Customer Satisfaction", val: "98.2%", change: "NPS +74 Score", color: "text-blue-400" },
          { label: "Company Health Score", val: "96 / 100", change: "AAA Grade", color: "text-amber-400" },
        ].map((w, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1 backdrop-blur-xl">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{w.label}</div>
            <div className={`text-2xl font-bold font-display ${w.color}`}>{w.val}</div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
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
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">+24.8% YoY</Badge>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" name="Revenue ($M)" />
                <Area type="monotone" dataKey="profit" stroke="#f59e0b" fillOpacity={0.1} fill="#f59e0b" name="Net Profit ($M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cash Flow & Sales Analytics */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Operating Cash Flow & Sales Volume ($M)</h3>
              <p className="text-xs text-muted-foreground">Liquidity reserve & sales deal acceleration</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">$2.5M Reserve</Badge>
          </div>
          <div className="h-56 w-full pt-2">
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
            {recentActivities.map((act, idx) => (
              <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400">{act.tag}</Badge>
                  <span className="text-muted-foreground">{act.time}</span>
                </div>
                <p className="text-xs font-semibold text-foreground">{act.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Department Performance */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-400" />
            Department Health & Growth
          </h3>
          <div className="space-y-2.5">
            {deptPerformance.map((d, idx) => (
              <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-foreground">{d.dept}</h4>
                  <div className="text-[11px] text-muted-foreground">{d.headcount} Employees • {d.growth}</div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{d.score}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Upcoming Decisions */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            Upcoming Executive Decisions
          </h3>
          <div className="space-y-2.5">
            {upcomingDecisions.map((dec, idx) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CeoOverviewPage;
