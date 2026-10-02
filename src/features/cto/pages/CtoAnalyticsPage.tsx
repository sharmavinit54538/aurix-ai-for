import React from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Deployment Frequency", val: "—", sub: "No deployments recorded" },
          { label: "Lead Time to PR Merge", val: "—", sub: "VCS integration pending" },
          { label: "Cycle Time (Commit→Deploy)", val: "—", sub: "No telemetry recorded" },
          { label: "Bug Escape Rate", val: "—", sub: "No incident data recorded" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className="text-2xl font-bold font-display text-foreground">{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
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

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
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
