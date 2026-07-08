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
import type { PerformanceReview, Goal } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChartIcon, LineChartIcon, Activity, Trophy } from "lucide-react";
import { useMounted } from "@/lib/aurix-store";

interface PerformanceChartsProps {
  reviews: PerformanceReview[];
  goals: Goal[];
}

export function PerformanceCharts({ reviews, goals }: PerformanceChartsProps) {
  const mounted = useMounted();
  // 1. Department-wise Performance (average score per dept)
  const departmentAverages = React.useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    reviews.forEach((r) => {
      if (!map[r.department]) map[r.department] = { total: 0, count: 0 };
      map[r.department].total += r.overallRating;
      map[r.department].count += 1;
    });
    return Object.entries(map).map(([name, val]) => ({
      name,
      rating: parseFloat((val.total / val.count).toFixed(1)),
    }));
  }, [reviews]);

  // 2. Goal completion distribution (Not started, In progress, Completed, Delayed)
  const goalsDistribution = React.useMemo(() => {
    const counts = { not_started: 0, in_progress: 0, completed: 0, delayed: 0 };
    goals.forEach((g) => {
      if (counts[g.status] !== undefined) counts[g.status] += 1;
    });
    return [
      { name: "Not Started", value: counts.not_started, fill: "#64748b" },
      { name: "In Progress", value: counts.in_progress, fill: "#3b82f6" },
      { name: "Completed", value: counts.completed, fill: "#10b981" },
      { name: "Delayed", value: counts.delayed, fill: "#ec4899" },
    ];
  }, [goals]);

  // 3. Attendance vs Performance (Line chart comparing overallRating*20 to attendance*20 for baseline consistency)
  const attendanceVsPerf = React.useMemo(() => {
    return reviews.map((r) => ({
      name: r.employeeName,
      performance: r.overallRating * 20,
      attendance: r.attendance * 20,
    }));
  }, [reviews]);

  // 4. Employee Rankings by KPI Score (horizontal bar chart)
  const employeeRankings = React.useMemo(() => {
    return [...reviews]
      .sort((a, b) => b.kpiScore - a.kpiScore)
      .slice(0, 6)
      .map((r) => ({
        name: r.employeeName,
        kpi: r.kpiScore,
        rating: r.overallRating * 20,
      }));
  }, [reviews]);

  // 5. Promotion Eligibility candidates (Eligible vs Not Recommended)
  const promotionAnalytics = React.useMemo(() => {
    const eligibleCount = reviews.filter((r) => r.promotionEligible).length;
    const remainingCount = reviews.length - eligibleCount;
    return [
      { name: "Promotion Candidates", value: eligibleCount, fill: "#8b5cf6" },
      { name: "Regular Pipeline", value: remainingCount, fill: "#cbd5e1" },
    ];
  }, [reviews]);

  // Custom tooltips styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card/90 p-3 shadow-lg text-xs leading-none backdrop-blur-md">
          <p className="font-bold mb-2 text-foreground">{label || payload[0].payload.name}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="mt-1" style={{ color: p.color || p.fill }}>
              {p.name}: <span className="font-semibold text-foreground">{p.value.toLocaleString()}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Chart 1: Department Averages */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-brand" /> Average Performance Ratings by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAverages} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rating" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Avg Rating Score" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 2: Employee rankings */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" /> Employee Performance Rankings (KPIs Index)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeRankings} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" horizontal={false} />
                <XAxis type="number" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="kpi" fill="#10b981" radius={[0, 4, 4, 0]} name="KPI Completion" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 3: Goals progress distribution */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-purple-500" /> OKR Target Goals Status Share
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalsDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {goalsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 4: Attendance vs Performance Line comparison */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <LineChartIcon className="h-4 w-4 text-rose-500" /> Attendance vs overall Ratings Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceVsPerf} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" dataKey="performance" stroke="#ec4899" strokeWidth={2.5} name="Overall Rating Index" />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2.5} name="Attendance Index" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* Chart 5: Promotion Eligibility candidates */}
      <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl md:col-span-2">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-500" /> Promotion Eligibility Pool Share
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <div className="w-1/2 h-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={promotionAnalytics}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {promotionAnalytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
            )}
          </div>
          <div className="w-1/2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="h-3.5 w-3.5 rounded-full bg-purple-500" />
              <span>Recommended Promotion Candidates ({reviews.filter((r) => r.promotionEligible).length})</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
              <span>Regular Review Pipeline ({reviews.length - reviews.filter((r) => r.promotionEligible).length})</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Based on rating scores &gt;= 4.0 ★ and positive manager comments flags.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
