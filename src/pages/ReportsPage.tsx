import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchHeadcountMetrics, fetchTurnoverMetrics } from "@/store/analytics/analyticsThunk";
import {
  selectHeadcountMetrics,
  selectTurnoverMetrics,
} from "@/store/analytics/analyticsSelectors";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "oklch(0.6 0.2 285)",
  "oklch(0.7 0.18 320)",
  "oklch(0.65 0.16 200)",
  "oklch(0.75 0.15 90)",
  "oklch(0.55 0.18 25)",
];

export function ReportsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const headcountState = useAppSelector(selectHeadcountMetrics);
  const turnoverState = useAppSelector(selectTurnoverMetrics);

  const fetchReportsData = React.useCallback(() => {
    dispatch(fetchHeadcountMetrics());
    dispatch(fetchTurnoverMetrics());
  }, [dispatch]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/dashboard/analytics" });
    }
  };

  const loading = (headcountState.loading || turnoverState.loading) && !headcountState.data;
  const error = headcountState.error || turnoverState.error;

  const headcountData =
    headcountState.data?.monthlyTrend?.map((t) => ({
      m: t.month,
      n: t.headcount,
    })) ?? [];

  const byDeptData =
    headcountState.data?.byDepartment?.map((d) => ({
      name: d.department,
      value: d.count,
    })) ?? [];

  const turnoverData =
    turnoverState.data?.byDepartment?.map((d) => ({
      range: d.department,
      n: d.turnoverRate,
    })) ?? [];

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 lg:col-span-3 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Button>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            HR Metrics & Reports Visualization
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchReportsData}
          disabled={headcountState.loading || turnoverState.loading}
          className="gap-2 text-xs"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              headcountState.loading || turnoverState.loading ? "animate-spin" : ""
            }`}
          />
          Refresh Metrics
        </Button>
      </div>

      {error ? (
        <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchReportsData}
            className="gap-1.5 text-xs"
          >
            Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Headcount Trends Over Time" className="lg:col-span-2">
          {headcountData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={headcountData} margin={{ top: 10, right: 10, left: -10 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="m"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="n"
                  stroke="oklch(0.6 0.2 285)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </Card>

        <Card title="Headcount By Department">
          {byDeptData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byDeptData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {byDeptData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </Card>

        <Card title="Turnover Rate By Department" className="lg:col-span-3">
          {turnoverData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={turnoverData} margin={{ top: 10, right: 10, left: -20 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="range"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="n" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.18 320)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 font-medium text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">
      No metrics data available yet
    </div>
  );
}

export default ReportsPage;
