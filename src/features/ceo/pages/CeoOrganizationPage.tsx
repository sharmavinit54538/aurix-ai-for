import React from "react";
import { Users, Building, Award, UserCheck, Heart, UserPlus, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CeoOrganizationPage() {
  const headcountData: any[] = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Users className="h-4 w-4" />
              </span>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase">
                Global Workforce & Leadership
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Organization Headcount & Executive Leadership
            </h1>
            <p className="text-xs text-blue-200/70 max-w-2xl">
              Department structures, workforce expansion planning, leadership team directory, employee retention rates, and performance analytics.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Headcount", val: "—", sub: "Live data pending", color: "text-blue-400" },
          { label: "Retention SLA Rate", val: "—", sub: "Live data pending", color: "text-emerald-400" },
          { label: "Active Open Roles", val: "—", sub: "Live data pending", color: "text-purple-400" },
          { label: "Employee eNPS Score", val: "—", sub: "Live data pending", color: "text-cyan-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground">Total Headcount Growth Trajectory</h3>
        <div className="h-56 w-full pt-2 flex items-center justify-center">
          {headcountData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="quarter" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Total Headcount" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground">No headcount trajectory data available. Backend API integration pending.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CeoOrganizationPage;
