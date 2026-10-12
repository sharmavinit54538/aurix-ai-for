"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AttendanceTrendDataPoint,
  AttendanceDistributionResponse,
  WeeklyAttendanceDataPoint,
  AttendanceRateKPIResponse,
} from "@/services/attendance/types";

interface DailyAttendanceTrendProps {
  data: AttendanceTrendDataPoint[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function DailyAttendanceTrend({
  data,
  loading,
  error,
  onRetry,
}: DailyAttendanceTrendProps) {
  const COLORS = {
    present: "#10b981",
    late: "#f59e0b",
    absent: "#ef4444",
    onLeave: "#3b82f6",
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string; payload: AttendanceTrendDataPoint }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg text-xs leading-none backdrop-blur-md min-w-[200px]">
          <p className="font-bold mb-2 text-foreground">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="mt-1" style={{ color: p.color }}>
              {p.name}: <span className="font-semibold text-foreground">{p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" /> Daily Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-full w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" /> Daily Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Failed to load attendance trends</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-primary hover:underline text-sm"
              >
                Retry
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" /> Daily Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            No attendance trend data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl lg:col-span-2">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" /> Daily Attendance Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "10px" }} />
            <Line
              type="monotone"
              dataKey="present"
              stroke={COLORS.present}
              strokeWidth={2.5}
              name="Present"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="late"
              stroke={COLORS.late}
              strokeWidth={2.5}
              name="Late"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke={COLORS.absent}
              strokeWidth={2.5}
              name="Absent"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="onLeave"
              stroke={COLORS.onLeave}
              strokeWidth={2.5}
              name="On Leave"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface AttendanceDistributionProps {
  data: AttendanceDistributionResponse | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function AttendanceDistribution({
  data,
  loading,
  error,
  onRetry,
}: AttendanceDistributionProps) {
  const COLORS = {
    present: "#10b981",
    late: "#f59e0b",
    absent: "#ef4444",
    onLeave: "#3b82f6",
  };

  const distributionData = data
    ? [
        { name: "Present", value: data.present, fill: COLORS.present },
        { name: "Late", value: data.late, fill: COLORS.late },
        { name: "Absent", value: data.absent, fill: COLORS.absent },
        { name: "On Leave", value: data.onLeave, fill: COLORS.onLeave },
      ]
    : [];

  const total = data?.total || 0;

  if (loading) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" /> Attendance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" /> Attendance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Failed to load attendance distribution</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-primary hover:underline text-sm"
              >
                Retry
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || total === 0) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" /> Attendance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            No attendance distribution data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" /> Attendance Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
                formatter={(value: number) => [value.toLocaleString(), ""]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display text-3xl font-bold text-foreground">{total.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Total Employees</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WeeklyAttendanceProps {
  data: WeeklyAttendanceDataPoint[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  viewMode?: "week" | "month";
}

export function WeeklyAttendance({
  data,
  loading,
  error,
  onRetry,
  viewMode = "week",
}: WeeklyAttendanceProps) {
  const COLORS = {
    present: "#10b981",
    late: "#f59e0b",
    absent: "#ef4444",
    onLeave: "#3b82f6",
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string; payload: WeeklyAttendanceDataPoint }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg text-xs leading-none backdrop-blur-md min-w-[200px]">
          <p className="font-bold mb-2 text-foreground">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="mt-1" style={{ color: p.color }}>
              {p.name}: <span className="font-semibold text-foreground">{p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-500" />
            {viewMode === "week" ? "Weekly Attendance" : "Monthly Attendance"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-full w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-500" />
            {viewMode === "week" ? "Weekly Attendance" : "Monthly Attendance"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Failed to load attendance data</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-primary hover:underline text-sm"
              >
                Retry
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-500" />
            {viewMode === "week" ? "Weekly Attendance" : "Monthly Attendance"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            No attendance data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-500" />
          {viewMode === "week" ? "Weekly Attendance" : "Monthly Attendance"}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "10px" }} />
            <Bar dataKey="present" fill={COLORS.present} radius={[6, 6, 0, 0]} name="Present" />
            <Bar dataKey="late" fill={COLORS.late} radius={[6, 6, 0, 0]} name="Late" />
            <Bar dataKey="absent" fill={COLORS.absent} radius={[6, 6, 0, 0]} name="Absent" />
            <Bar dataKey="onLeave" fill={COLORS.onLeave} radius={[6, 6, 0, 0]} name="On Leave" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface AttendanceRateKPIProps {
  data: AttendanceRateKPIResponse | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function AttendanceRateKPI({
  data,
  loading,
  error,
  onRetry,
}: AttendanceRateKPIProps) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-emerald-500";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-500" /> Attendance Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <Skeleton className="h-12 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-500" /> Attendance Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Failed to load attendance rate</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-primary hover:underline text-sm"
              >
                Retry
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-500" /> Attendance Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            No attendance rate data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const changeText = data.changePercentagePoints !== null
    ? `${data.changePercentagePoints > 0 ? "+" : ""}${data.changePercentagePoints.toFixed(1)}pp`
    : "—";

  const prevPeriodText = data.previousPeriod
    ? `vs ${new Date(data.previousPeriod.start).toLocaleDateString()}–${new Date(data.previousPeriod.end).toLocaleDateString()}`
    : "No previous period data";

  return (
    <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-rose-500" /> Attendance Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] flex flex-col items-center justify-center text-center space-y-3">
        <div className="space-y-1">
          <span className="font-display text-5xl font-bold text-foreground">
            {data.currentRate.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">
            Current Period ({new Date(data.period.start).toLocaleDateString()}–{new Date(data.period.end).toLocaleDateString()})
          </span>
        </div>
        <div className={`flex items-center justify-center gap-1.5 text-sm font-medium ${getTrendColor(data.trend)}`}>
          {getTrendIcon(data.trend)}
          <span>{changeText}</span>
          {data.previousRate !== null && (
            <>
              <span className="text-muted-foreground">({data.previousRate.toFixed(1)}%)</span>
            </>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">{prevPeriodText}</p>
      </CardContent>
    </Card>
  );
}