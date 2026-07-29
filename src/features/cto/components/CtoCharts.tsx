import React from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface CtoChartsProps {
  velocityTrend: any[];
  deploymentTrend: any[];
}

export function CtoCharts({ velocityTrend, deploymentTrend }: CtoChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* Engineering Velocity Chart */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-sm">
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">Engineering Velocity & Tech Debt Reduction</h3>
          <p className="text-xs text-muted-foreground">Sprint story points planned vs completed & technical debt backlog</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={velocityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="planned" name="Planned Points" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed Points" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="techDebt" name="Tech Debt Solved" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deployment History Chart */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-sm">
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">CI/CD Deployment History</h3>
          <p className="text-xs text-muted-foreground">Daily production vs staging deployments & zero-rollback status</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={deploymentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-prod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="grad-stag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area type="monotone" dataKey="production" name="Production Deploys" stroke="#38bdf8" fill="url(#grad-prod)" strokeWidth={2} />
              <Area type="monotone" dataKey="staging" name="Staging Deploys" stroke="#a855f7" fill="url(#grad-stag)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
