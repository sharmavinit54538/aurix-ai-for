import React, { useState } from "react";
import { TrendingUp, Target, Map, Globe, ShieldAlert, Handshake, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CeoBusinessPage() {
  const businessGrowthData = [
    { quarter: "Q1 2025", revenue: 8.2, marketShare: "12%", expansion: 2 },
    { quarter: "Q2 2025", revenue: 9.8, marketShare: "14%", expansion: 3 },
    { quarter: "Q3 2025", revenue: 11.4, marketShare: "16%", expansion: 4 },
    { quarter: "Q4 2025", revenue: 12.8, marketShare: "18%", expansion: 5 },
    { quarter: "Q1 2026", revenue: 14.2, marketShare: "21%", expansion: 7 },
  ];

  const goals = [
    { title: "Expand Enterprise Market Share to 25%", progress: 84, target: "Q4 2026", owner: "CEO Office" },
    { title: "Launch APAC AI Data Residency Hub", progress: 62, target: "Q3 2026", owner: "Strategy Unit" },
    { title: "Achieve $20M ARR Milestone", progress: 78, target: "Q4 2026", owner: "Revenue Unit" },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <TrendingUp className="h-4 w-4" />
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase">
                Business Strategy & Expansion
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Strategic Goals & Corporate Growth Roadmap
            </h1>
            <p className="text-xs text-emerald-200/70 max-w-2xl">
              Strategic goals tracking, regional expansion plans, market share analysis, competitor intelligence, strategic partnerships, and corporate investments.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Market Share & Revenue Growth ($M)</h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={businessGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="quarter" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="ARR ($M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Global Expansion Units Opened</h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="quarter" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Bar dataKey="expansion" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Regional Hubs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="goals" className="text-xs font-semibold">Strategic Goals</TabsTrigger>
          <TabsTrigger value="roadmap" className="text-xs font-semibold">Company Roadmap</TabsTrigger>
          <TabsTrigger value="expansion" className="text-xs font-semibold">Expansion Plans</TabsTrigger>
          <TabsTrigger value="partnerships" className="text-xs font-semibold">Partnerships</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs font-semibold">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <div className="space-y-3">
            {goals.map((g, idx) => (
              <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{g.title}</h4>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{g.target}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-border/60">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{g.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CeoBusinessPage;
