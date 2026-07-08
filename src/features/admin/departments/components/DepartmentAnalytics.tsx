import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { Department } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChartIcon, LineChartIcon, Activity } from "lucide-react";
import { useMounted } from "@/lib/aurix-store";

interface DepartmentAnalyticsProps {
  departments: Department[];
}

export function DepartmentAnalytics({ departments }: DepartmentAnalyticsProps) {
  const mounted = useMounted();
  // 1. Data mapping for Headcount Distribution (Pie Chart)
  const headcountData = departments.map((d) => ({
    name: d.code,
    value: d.currentEmployeeCount,
    color: d.themeColor,
  }));

  // 2. Data mapping for Budgets (Bar Chart)
  const budgetData = departments.map((d) => ({
    name: d.code,
    budget: d.budget,
    color: d.themeColor,
  }));

  // 3. Data mapping for Hiring Capacity & Positions (Bar Chart)
  const hiringData = departments.map((d) => ({
    name: d.code,
    current: d.currentEmployeeCount,
    capacity: d.employeeCapacity,
    positions: d.openPositions,
  }));

  // 4. Data mapping for Efficiency Indicators (Line Chart)
  const metricsData = departments.map((d) => ({
    name: d.code,
    performance: d.performanceScore,
    attendance: d.attendanceScore,
  }));

  // Custom tooltips styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card/90 p-3 shadow-lg text-xs leading-none backdrop-blur-md">
          <p className="font-bold mb-2 text-foreground">{label || payload[0].payload.name}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="mt-1" style={{ color: p.color || p.fill }}>
              {p.name}: <span className="font-semibold text-foreground">{p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Chart 1: Headcount Distribution */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-brand" /> Headcount Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={headcountData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {headcountData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "10px", marginTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 2: Budget Allocations */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" /> Budget Utilization (Annual USD)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" radius={[6, 6, 0, 0]} name="Annual Budget">
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 3: Hiring Capacities */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-500" /> Department Capacity & Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Current Employees" />
                <Bar dataKey="capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total Capacity Limit" />
                <Bar dataKey="positions" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Open Job Vacancies" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 4: Efficiency Metrics (Attendance & Performance) */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <LineChartIcon className="h-4 w-4 text-rose-500" /> Performance vs Attendance Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                  name="Performance Score (%)"
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                  name="Attendance Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
