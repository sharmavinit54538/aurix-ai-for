import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ExecutiveRole, DateRangeType } from "../types/executiveTypes";
import { EXECUTIVE_DATASETS } from "../data/executiveData";
import { ExecutiveHeader } from "./ExecutiveHeader";
import { ExecutiveKpiCard } from "./ExecutiveKpiCard";
import { ExecutiveAiInsightCard } from "./ExecutiveAiInsightCard";
import { ExecutiveDataTable } from "./ExecutiveDataTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export interface ExecutiveRoleDashboardViewProps {
  role: ExecutiveRole;
}

export function ExecutiveRoleDashboardView({ role }: ExecutiveRoleDashboardViewProps) {
  const [dateRange, setDateRange] = useState<DateRangeType>("month");
  const [isLoading, setIsLoading] = useState(false);

  const dataset = EXECUTIVE_DATASETS[role] || EXECUTIVE_DATASETS.ceo;

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Refreshed ${role.toUpperCase()} Executive Analytics.`);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Switcher */}
      <ExecutiveHeader
        role={role}
        title={dataset.title}
        subtitle={dataset.subtitle}
        healthScore={dataset.healthScore}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onRefresh={handleRefresh}
      />

      {/* KPI Cards Grid (6 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {dataset.kpis.map((kpi) => (
          <ExecutiveKpiCard key={kpi.id} kpi={kpi} loading={isLoading} />
        ))}
      </div>

      {/* AI Intelligence Suggestions Panel */}
      <ExecutiveAiInsightCard insights={dataset.aiInsights} roleTitle={role.toUpperCase()} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataset.charts.map((chart, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3 text-left shadow-md"
          >
            <div>
              <h3 className="font-display text-base font-bold text-foreground">{chart.title}</h3>
              <p className="text-xs text-muted-foreground">{chart.description}</p>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chart.type === "area" ? (
                  <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {chart.dataKeys.map((dk) => (
                        <linearGradient key={dk.key} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={dk.color} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={dk.color} stopOpacity={0.0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    {chart.dataKeys.map((dk) => (
                      <Area
                        key={dk.key}
                        type="monotone"
                        dataKey={dk.key}
                        name={dk.label}
                        stroke={dk.color}
                        fill={`url(#grad-${dk.key})`}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                ) : chart.type === "pie" ? (
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Pie
                      data={chart.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      innerRadius={50}
                      paddingAngle={4}
                    >
                      {chart.data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#10b981", "#6366f1", "#38bdf8", "#f59e0b", "#ec4899"][index % 5]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                ) : chart.type === "line" ? (
                  <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    {chart.dataKeys.map((dk) => (
                      <Line
                        key={dk.key}
                        type="monotone"
                        dataKey={dk.key}
                        name={dk.label}
                        stroke={dk.color}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    {chart.dataKeys.map((dk) => (
                      <Bar key={dk.key} dataKey={dk.key} name={dk.label} fill={dk.color} radius={[6, 6, 0, 0]} />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Corporate OKRs section if available */}
      {dataset.okrs && dataset.okrs.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3 text-left shadow-md">
          <div className="flex items-center gap-2 text-sm font-bold font-display text-foreground">
            <Target className="h-4 w-4 text-indigo-400" />
            <span>Corporate Key Results & Executive OKRs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataset.okrs.map((okr, idx) => (
              <div key={idx} className="rounded-xl border border-border/50 bg-accent/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">{okr.title}</span>
                  <span className="font-mono text-indigo-400">{okr.target}</span>
                </div>
                <Progress value={okr.current} className="h-2" />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Sponsor: {okr.owner}</span>
                  <span className="font-semibold text-foreground">{okr.current}% Achieved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Executive Interactive Data Table */}
      <ExecutiveDataTable
        title={dataset.tableData.title}
        description={dataset.tableData.description}
        headers={dataset.tableData.headers}
        rows={dataset.tableData.rows}
      />
    </div>
  );
}
