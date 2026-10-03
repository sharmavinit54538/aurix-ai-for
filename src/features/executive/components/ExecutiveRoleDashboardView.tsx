import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ExecutiveRole, DateRangeType, KpiMetric, ExecutiveDashboardData } from "../types/executiveTypes";
import { ExecutiveHeader } from "./ExecutiveHeader";
import { ExecutiveKpiCard } from "./ExecutiveKpiCard";
import { ExecutiveAiInsightCard } from "./ExecutiveAiInsightCard";
import { ExecutiveDataTable } from "./ExecutiveDataTable";
import { executiveApi, type ExecutiveOverviewResponse } from "@/services/executiveApi";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ROLE_META: Record<ExecutiveRole, { title: string; subtitle: string; tableTitle: string; tableDesc: string }> = {
  ceo: { title: "Chief Executive Officer Command Center", subtitle: "Enterprise Business Health, Headcount, Org Velocity & Strategic Health", tableTitle: "Strategic Corporate Projects & Initiatives", tableDesc: "High-priority enterprise initiatives monitored by executive committee" },
  cto: { title: "Chief Technology Officer Command Center", subtitle: "Engineering Headcount, IT Asset Allocation, Technical Operations & Service Delivery", tableTitle: "Engineering Milestones & Critical Infrastructure Deliverables", tableDesc: "Strategic engineering initiatives and core platform roadmap deliverables" },
  cfo: { title: "Chief Financial Officer Command Center", subtitle: "Corporate Payroll Cost, Run Expenses, Asset Values & Department Budget Allocations", tableTitle: "Capital Expenditures & Department Budget Allocations", tableDesc: "Enterprise financial outlays, capital expenditures and department burn monitoring" },
  cio: { title: "Chief Information Officer Command Center", subtitle: "Enterprise IT Assets, Operational Support Tickets & Hardware Life Cycle", tableTitle: "IT Projects, System Migrations & Compliance Audits", tableDesc: "Enterprise technology deployments, security assessments and infrastructure lifecycle" },
  coo: { title: "Chief Operating Officer Command Center", subtitle: "Workforce Attendance, Leave Utilisation, Attrition Rate & Team Efficiency", tableTitle: "Operational Efficiency & Process Optimization Initiatives", tableDesc: "Enterprise operations, SLA compliance and business continuity programs" },
  cmo: { title: "Chief Marketing Officer Command Center", subtitle: "Brand Team Headcount, Growth Initiatives & Go-To-Market Pipeline", tableTitle: "Strategic Marketing Campaigns & Brand Growth Initiatives", tableDesc: "Global customer acquisition campaigns, brand equity and go-to-market initiatives" },
};

export interface ExecutiveRoleDashboardViewProps {
  role: ExecutiveRole;
}

export function ExecutiveRoleDashboardView({ role }: ExecutiveRoleDashboardViewProps) {
  const [dateRange, setDateRange] = useState<DateRangeType>("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExecutiveOverviewResponse | null>(null);

  const meta = ROLE_META[role] ?? ROLE_META.ceo;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await executiveApi.getOverview(role);
      setData(res);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load executive overview";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadData();
  }, [loadData, dateRange]);

  const handleRefresh = () => {
    loadData().then(() => {
      toast.success(`Refreshed ${role.toUpperCase()} Executive Analytics.`);
    });
  };

  // Convert real metrics into KPI cards
  const kpis: KpiMetric[] = useMemo(() => {
    if (!data?.metrics || data.metrics.length === 0) return [];

    return data.metrics
      .filter((m) => m.available && m.value !== "—" && m.value !== "Live data pending")
      .map((m, idx) => ({
        id: m.key || `kpi-${idx}`,
        title: m.label,
        value: typeof m.value === "number" ? m.value.toLocaleString() : String(m.value),
        change: m.change || "Real Time",
        isPositive: m.trend !== "down",
        subtext: m.hint || "Verified Org Data",
        iconName: m.key.toLowerCase().includes("cost") || m.key.toLowerCase().includes("payroll")
          ? "DollarSign"
          : m.key.toLowerCase().includes("asset")
          ? "Laptop"
          : m.key.toLowerCase().includes("attendance")
          ? "UserCheck"
          : m.key.toLowerCase().includes("leave")
          ? "Palmtree"
          : "Users",
        color: "text-brand",
      }));
  }, [data]);

  // Construct charts from real time series
  const timeSeriesData = useMemo(() => {
    return data?.timeSeries && data.timeSeries.length > 0 ? data.timeSeries : [];
  }, [data]);

  const initiatives = useMemo(() => {
    return (data?.initiatives && data.initiatives.length > 0)
      ? data.initiatives.map((init, i) => ({
          id: `init-${i}`,
          name: init.name,
          category: init.category,
          owner: init.owner,
          value: init.impact || "Strategic Priority",
          status: init.status,
          progress: init.progress,
        }))
      : [];
  }, [data]);

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load {role.toUpperCase()} Analytics</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner & Switcher */}
      <ExecutiveHeader
        role={role}
        title={data?.title || meta.title}
        subtitle={data?.subtitle || meta.subtitle}
        healthScore={data?.healthScore ?? 0}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onRefresh={handleRefresh}
      />

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ExecutiveKpiCard key={i} kpi={{} as any} loading={true} />
          ))}
        </div>
      ) : kpis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <ExecutiveKpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-md">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold text-foreground">No executive KPI metrics available</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Operational telemetry for {role.toUpperCase()} will appear as organizational activities and payroll cycles close.
          </p>
        </div>
      )}

      {/* 12-Month Real Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3 text-left shadow-md">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">12-Month Headcount & Retention Trend</h3>
              <p className="text-xs text-muted-foreground">Historical personnel strength and retention metrics</p>
            </div>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-headcount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  <Area
                    type="monotone"
                    dataKey="headcount"
                    name="Active Headcount"
                    stroke="#06b6d4"
                    fill="url(#grad-headcount)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3 text-left shadow-md">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Operational Utilization & Attendance</h3>
              <p className="text-xs text-muted-foreground">Monthly organizational attendance rate</p>
            </div>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="attendanceRate" name="Attendance Rate (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Initiatives / Strategic Objectives Data Table */}
      {initiatives.length > 0 && (
        <ExecutiveDataTable
          title={meta.tableTitle}
          description={meta.tableDesc}
          headers={[
            { key: "name", label: "Initiative / Project" },
            { key: "category", label: "Business Unit" },
            { key: "owner", label: "Executive Sponsor" },
            { key: "value", label: "Impact" },
            { key: "status", label: "Status" },
            { key: "progress", label: "Completion" },
          ]}
          rows={initiatives}
        />
      )}
    </div>
  );
}

export default ExecutiveRoleDashboardView;
