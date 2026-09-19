import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  AlertTriangle,
  UserX,
  Timer,
  ShieldAlert,
  CheckCircle2,
  CalendarX,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, AIChart, AIKpi, AIFeature } from "@/components/aurix/AIModule";
import { attendanceApi, AttendanceAnalyticsSummary, AttendanceHistoryItem } from "@/services/attendanceApi";

export const Route = createFileRoute("/ai/attendance-monitor")({
  head: () => ({ meta: [{ title: "AI Attendance Monitor — OFC360" }] }),
  component: Page,
});

function Page() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AttendanceAnalyticsSummary | null>(null);
  const [history, setHistory] = useState<AttendanceHistoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [analyticsRes, historyRes] = await Promise.allSettled([
          attendanceApi.getAttendanceAnalytics(),
          attendanceApi.getMyAttendanceHistory(1, 30),
        ]);

        if (mounted) {
          if (analyticsRes.status === "fulfilled") {
            setAnalytics(analyticsRes.value);
          }
          if (historyRes.status === "fulfilled" && historyRes.value?.items) {
            setHistory(historyRes.value.items);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch attendance monitor metrics:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute real KPIs from backend
  const totalEmployees = analytics?.totalEmployees ?? 0;
  const presentCount = analytics?.present ?? 0;
  const lateCount = analytics?.late ?? 0;
  const absentCount = analytics?.absent ?? 0;

  // Real Attendance Health % (present vs total)
  const attendanceHealth =
    analytics?.onTimeRate != null
      ? Math.round(analytics.onTimeRate)
      : totalEmployees > 0
      ? Math.round((presentCount / totalEmployees) * 100)
      : presentCount > 0
      ? 100
      : 0;

  // Real Overtime from history records
  const totalOtHours = history.reduce((acc, h) => {
    if (h.workingHours && h.workingHours > 8) {
      return acc + (h.workingHours - 8);
    }
    return acc;
  }, 0);

  // Group real history by day of week for the past 7 days
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayPresenceMap: Record<string, { present: number; late: number; count: number }> = {
    Mon: { present: 0, late: 0, count: 0 },
    Tue: { present: 0, late: 0, count: 0 },
    Wed: { present: 0, late: 0, count: 0 },
    Thu: { present: 0, late: 0, count: 0 },
    Fri: { present: 0, late: 0, count: 0 },
    Sat: { present: 0, late: 0, count: 0 },
    Sun: { present: 0, late: 0, count: 0 },
  };

  history.forEach((item) => {
    if (item.date) {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        if (dayPresenceMap[dayName]) {
          dayPresenceMap[dayName].count += 1;
          if (item.status === "Present") {
            dayPresenceMap[dayName].present += 1;
          } else if (item.status === "Late") {
            dayPresenceMap[dayName].late += 1;
          }
        }
      }
    }
  });

  const trendChartData = daysOfWeek.map((d) => ({
    d,
    present:
      dayPresenceMap[d].count > 0
        ? Math.round(((dayPresenceMap[d].present + dayPresenceMap[d].late) / dayPresenceMap[d].count) * 100)
        : 0,
  }));

  const lateChartData = daysOfWeek.slice(0, 5).map((d) => ({
    d,
    late: dayPresenceMap[d].late,
  }));

  const kpis: AIKpi[] = [
    {
      label: "Attendance Health",
      value: `${attendanceHealth}%`,
      icon: CheckCircle2,
    },
    {
      label: "Anomalies",
      value: lateCount + absentCount,
      icon: AlertTriangle,
      invert: true,
    },
    {
      label: "Late Arrivals",
      value: lateCount,
      icon: Clock,
      invert: true,
    },
    {
      label: "OT Hours",
      value: `${Math.round(totalOtHours * 10) / 10}h`,
      icon: Timer,
    },
  ];

  const charts: AIChart[] = [
    {
      type: "area",
      title: "Attendance Trend",
      xKey: "d",
      series: [{ key: "present", label: "Present %" }],
      data: trendChartData,
    },
    {
      type: "bar",
      title: "Late Arrivals by Day",
      xKey: "d",
      series: [{ key: "late", label: "Late Count" }],
      data: lateChartData,
    },
  ];

  const features: AIFeature[] = [
    {
      title: "Attendance Anomalies",
      description: "Detect unusual punches, missed swipes, and outliers from database records.",
      icon: AlertTriangle,
      metric: String(lateCount + absentCount),
      tone: lateCount + absentCount > 0 ? "warn" : "ok",
    },
    {
      title: "Late Arrival Detection",
      description: "Spot recurring late arrivals recorded beyond grace windows.",
      icon: Clock,
      metric: String(lateCount),
      tone: lateCount > 0 ? "warn" : "ok",
    },
    {
      title: "Absence Pattern Analysis",
      description: "Monitor unexplained absences across working schedules.",
      icon: CalendarX,
      metric: String(absentCount),
      tone: absentCount > 0 ? "crit" : "ok",
    },
    {
      title: "Overtime Tracking",
      description: "Monitor OT trends based on authenticated daily punch timestamps.",
      icon: Timer,
      metric: `${Math.round(totalOtHours * 10) / 10}h`,
      tone: "info",
    },
    {
      title: "Shift Violations",
      description: "Detect missed shifts and policy breaches logged by the biometric engine.",
      icon: ShieldAlert,
      metric: String(absentCount),
      tone: absentCount > 0 ? "crit" : "ok",
    },
    {
      title: "Attendance Health Score",
      description: "Composite metric across verified punctuality and presence.",
      icon: CheckCircle2,
      metric: `${attendanceHealth}%`,
      progress: attendanceHealth,
      tone: attendanceHealth >= 80 ? "ok" : "warn",
    },
    {
      title: "Absentee Watchlist",
      description: "Employees with frequent absences or missed attendance records.",
      icon: UserX,
      metric: String(absentCount),
      tone: absentCount > 0 ? "warn" : "ok",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading attendance analytics from backend...</p>
      </div>
    );
  }

  return (
    <AIModulePage
      icon={Clock}
      eyebrow="AI Attendance Monitor"
      title="Anomalies detected before they become problems"
      description="Real-time attendance anomalies, late arrivals, and absence patterns from backend database logs."
      lastAnalysis="Live sync with backend"
      kpis={kpis}
      charts={charts}
      features={features}
    />
  );
}
