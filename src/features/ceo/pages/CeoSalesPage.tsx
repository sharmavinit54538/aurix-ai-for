import React from "react";
import { BarChart3, TrendingUp, Users, Target, CheckCircle2, DollarSign, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CeoSalesPage() {
  const salesData: any[] = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <BarChart3 className="h-4 w-4" />
              </span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase">
                Enterprise Sales & Revenue Engine
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sales Pipeline, Deals & Lead Conversion Engine
            </h1>
            <p className="text-xs text-indigo-200/70 max-w-2xl">
              Sales funnel pipeline, enterprise opportunity deals, conversion rates, sales team quotas, and revenue forecasting.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Sales Pipeline", val: "—", sub: "Live data pending", color: "text-indigo-400" },
          { label: "Closed Revenue", val: "—", sub: "Live data pending", color: "text-emerald-400" },
          { label: "Lead Conversion Rate", val: "—", sub: "Live data pending", color: "text-cyan-400" },
          { label: "Avg Enterprise Deal", val: "—", sub: "Live data pending", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground">Monthly Closed Revenue ($M) & Deals Count</h3>
        <div className="h-56 w-full pt-2 flex items-center justify-center">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Closed Revenue ($M)" />
                <Bar dataKey="deals" fill="#10b981" radius={[4, 4, 0, 0]} name="Deals Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground">No sales pipeline data available. Backend API integration pending.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CeoSalesPage;
