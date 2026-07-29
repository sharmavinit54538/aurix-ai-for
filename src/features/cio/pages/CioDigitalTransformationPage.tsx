import React from "react";
import { Sparkles, Bot, Cpu, Zap, Layers, RefreshCw, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CioDigitalTransformationPage() {
  const savingsData = [
    { month: "Jan", savings: 18, automationPct: "42%" },
    { month: "Feb", savings: 24, automationPct: "48%" },
    { month: "Mar", savings: 31, automationPct: "55%" },
    { month: "Apr", savings: 40, automationPct: "64%" },
    { month: "May", savings: 52, automationPct: "72%" },
    { month: "Jun", savings: 68, automationPct: "84%" },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="h-4 w-4" />
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase">
                Digital Innovation & AI Automation
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Enterprise AI Integration & ERP/CRM Digital Pipeline
            </h1>
            <p className="text-xs text-emerald-200/70 max-w-2xl">
              AI agent automation, ERP/CRM integration pipelines, API gateway management, operational cost savings, and modern cloud migration.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Automation Index", val: "84.2%", sub: "+18% YoY growth", color: "text-emerald-400" },
          { label: "Annual Cost Savings", val: "$680,000", sub: "RPA & AI bots", color: "text-cyan-400" },
          { label: "API Gateway Volume", val: "4.2M Calls/Mo", sub: "99.99% Reliability", color: "text-indigo-400" },
          { label: "AI Integration Status", val: "100% Deployed", sub: "Enterprise AI LLMs", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground">Monthly Automation Cost Savings ($k)</h3>
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#888888" fontSize={10} />
              <YAxis stroke="#888888" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="savings" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Cost Savings ($k)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CioDigitalTransformationPage;
