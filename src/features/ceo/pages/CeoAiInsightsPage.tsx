import React from "react";
import { Bot, Sparkles, TrendingUp, Zap, AlertCircle, CheckCircle2, MessageSquare, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CeoAiInsightsPage() {
  const forecastData = [
    { month: "Jul", current: 2.1, predicted: 2.15 },
    { month: "Aug", current: null, predicted: 2.4 },
    { month: "Sep", current: null, predicted: 2.7 },
    { month: "Oct", current: null, predicted: 3.1 },
    { month: "Nov", current: null, predicted: 3.5 },
    { month: "Dec", current: null, predicted: 4.0 },
  ];

  const recommendations = [
    { title: "Expand APAC Enterprise Sales Reps by 4 Headcount", impact: "+$1.8M ARR Increase", confidence: "94%" },
    { title: "Migrate Cloud Storage to Cold Tier", impact: "-$42,000 Annual Savings", confidence: "98%" },
    { title: "Adjust Q4 Enterprise Tier Pricing +8%", impact: "+$420,000 Net Profit", confidence: "91%" },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-violet-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Bot className="h-4 w-4" />
              </span>
              <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-bold uppercase">
                Executive AI Intelligence Center
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Business Forecasting & Decision Support
            </h1>
            <p className="text-xs text-violet-200/70 max-w-2xl">
              Predictive revenue modeling, AI smart recommendations, competitive intelligence, risk forecasting, and automated executive summaries.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-violet-400" />
          AI Revenue Forecast ($M) — 6-Month Trajectory
        </h3>
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#888888" fontSize={10} />
              <YAxis stroke="#888888" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Predicted Revenue ($M)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          Smart Strategic AI Recommendations
        </h3>
        <div className="space-y-2.5">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-foreground">{rec.title}</h4>
                <div className="text-[11px] text-emerald-400 font-mono">Predicted Impact: {rec.impact}</div>
              </div>
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs font-mono">{rec.confidence} Confidence</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CeoAiInsightsPage;
