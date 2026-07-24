import type { AIChart, AIFeature, AIKpi } from "@/components/aurix/AIModule";
import type {
  AbsencePatternData,
  AttendanceAnomaliesData,
  AttendanceDashboardKpis,
  AttendanceHealthScoreData,
  AttendanceTrendData,
  AttendanceWatchlistData,
  LateArrivalsData,
  OvertimeData,
  ShiftViolationsData,
} from "@/store/aiAttendance/aiAttendanceTypes";
import {
  AlertTriangle,
  CalendarX,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Timer,
  UserX,
} from "lucide-react";

function displayValue(value: number | null | undefined, fallback: string | number = "—"): string | number {
  return value == null ? fallback : value;
}

function roundMetric(value: number): number {
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
}

export function buildAttendanceKpis(
  dashboard: AttendanceDashboardKpis | null,
  healthScore: AttendanceHealthScoreData | null,
  lateArrivals: LateArrivalsData | null,
  overtime: OvertimeData | null,
  anomalies: AttendanceAnomaliesData,
): AIKpi[] {
  const anomalyTotal =
    dashboard?.anomalies ??
    anomalies.total ??
    (anomalies.items.length > 0 ? anomalies.items.reduce((sum, item) => sum + (item.count || 0), 0) : null);

  const health = healthScore?.score ?? dashboard?.attendanceHealth;
  const late = lateArrivals?.total ?? dashboard?.lateArrivals;
  const ot = overtime?.totalHours ?? overtime?.monthlyHours ?? dashboard?.otHours;

  if (health == null && anomalyTotal == null && late == null && ot == null) return [];

  return [
    {
      label: "Attendance Health",
      value: displayValue(health != null ? roundMetric(health) : null),
      trend: dashboard?.attendanceHealthTrend ?? undefined,
      icon: CheckCircle2,
    },
    {
      label: "Anomalies",
      value: displayValue(anomalyTotal),
      trend: dashboard?.anomaliesTrend ?? undefined,
      icon: AlertTriangle,
      invert: true,
    },
    {
      label: "Late Arrivals",
      value: displayValue(late),
      trend: lateArrivals?.trend ?? dashboard?.lateArrivalsTrend ?? undefined,
      icon: Clock,
      invert: true,
    },
    {
      label: "OT Hours",
      value: displayValue(ot != null ? roundMetric(ot) : null),
      trend: overtime?.trend ?? dashboard?.otHoursTrend ?? undefined,
      icon: Timer,
    },
  ];
}

export function buildAttendanceCharts(
  trend: AttendanceTrendData | null,
  lateArrivals: LateArrivalsData | null,
  overtime: OvertimeData | null,
): AIChart[] {
  const charts: AIChart[] = [];

  const trendSeries =
    trend?.daily?.length
      ? trend.daily
      : trend?.weekly?.length
        ? trend.weekly
        : trend?.monthly?.length
          ? trend.monthly
          : [];

  if (trendSeries.length > 0) {
    charts.push({
      type: "area",
      title: "Attendance Trend",
      description: trend?.period || "Presence rate over the selected period",
      xKey: "label",
      series: [{ key: "present", label: "Present %", color: "oklch(0.7 0.16 200)" }],
      data: trendSeries.map((point) => ({ label: point.label, present: point.present })),
    });
  } else if (trend?.department?.length) {
    charts.push({
      type: "bar",
      title: "Attendance by Department",
      description: trend?.period || "Department-wise presence rate",
      xKey: "label",
      series: [{ key: "present", label: "Present %", color: "oklch(0.68 0.2 290)" }],
      data: trend.department.map((point) => ({ label: point.label, present: point.present })),
    });
  }

  if (lateArrivals?.byDay?.length) {
    charts.push({
      type: "bar",
      title: "Late Arrivals by Day",
      description: lateArrivals.period || lateArrivals.note || "Late arrival detection across the week",
      xKey: "label",
      series: [{ key: "late", label: "Late", color: "oklch(0.78 0.18 70)" }],
      data: lateArrivals.byDay.map((point) => ({ label: point.label, late: point.late })),
    });
  } else if (overtime?.byDepartment?.length) {
    charts.push({
      type: "bar",
      title: "Overtime by Department",
      description: overtime.budgetImpact
        ? `Budget impact ${overtime.budgetImpact}`
        : "Department-wise overtime hours",
      xKey: "dept",
      series: [{ key: "hours", label: "OT Hours", color: "oklch(0.78 0.18 70)" }],
      data: overtime.byDepartment.map((item) => ({ dept: item.dept, hours: item.hours })),
    });
  }

  return charts;
}

export function buildAttendanceFeatures(
  anomalies: AttendanceAnomaliesData,
  absencePattern: AbsencePatternData | null,
  overtime: OvertimeData | null,
  shiftViolations: ShiftViolationsData | null,
  healthScore: AttendanceHealthScoreData | null,
  watchlist: AttendanceWatchlistData | null,
  lateArrivals: LateArrivalsData | null,
): AIFeature[] {
  const anomalyMetric = anomalies.total ?? (anomalies.items.length > 0 ? anomalies.items.length : 0);
  const absenceMetric = absencePattern?.patternsDetected ?? absencePattern?.items.length ?? null;
  const fridayMonday = (absencePattern?.fridayCount ?? 0) + (absencePattern?.mondayCount ?? 0);

  return [
    {
      title: "Attendance Anomalies",
      description: "Detect unusual punches, missed swipes and outliers.",
      icon: AlertTriangle,
      metric: String(anomalyMetric),
      tone: anomalyMetric > 0 ? "warn" : "ok",
    },
    {
      title: "Late Arrival Detection",
      description: lateArrivals?.period
        ? `Late arrivals tracked for ${lateArrivals.period.toLowerCase()}.`
        : "Spot recurring late arrivals by employee and team.",
      icon: Clock,
      metric: lateArrivals?.total != null ? String(lateArrivals.total) : undefined,
      tone: (lateArrivals?.total ?? 0) > 0 ? "warn" : "ok",
    },
    {
      title: "Absence Pattern Analysis",
      description:
        fridayMonday > 0
          ? `${absencePattern?.fridayCount ?? 0} Friday / ${absencePattern?.mondayCount ?? 0} Monday patterns flagged.`
          : "Find suspicious Friday/Monday absence patterns.",
      icon: CalendarX,
      metric: absenceMetric != null ? String(absenceMetric) : undefined,
      tone: (absenceMetric ?? 0) > 0 ? "info" : "ok",
    },
    {
      title: "Overtime Tracking",
      description: overtime?.budgetImpact
        ? `Budget impact: ${overtime.budgetImpact}`
        : "Monitor OT trends and budget impact.",
      icon: Timer,
      metric:
        overtime?.monthlyHours != null
          ? `${roundMetric(overtime.monthlyHours)}h`
          : overtime?.weeklyHours != null
            ? `${roundMetric(overtime.weeklyHours)}h`
            : undefined,
      tone: "info",
    },
    {
      title: "Shift Violations",
      description: "Detect missed shifts and policy breaches.",
      icon: ShieldAlert,
      metric: shiftViolations?.total != null ? String(shiftViolations.total) : undefined,
      tone: (shiftViolations?.total ?? 0) > 0 ? "crit" : "ok",
    },
    {
      title: "Attendance Health Score",
      description: "Composite score across punctuality and presence.",
      icon: CheckCircle2,
      metric: healthScore?.score != null ? String(roundMetric(healthScore.score)) : undefined,
      progress: healthScore?.score ?? undefined,
      tone: (healthScore?.score ?? 0) >= 70 ? "ok" : (healthScore?.score ?? 0) >= 40 ? "warn" : "crit",
    },
    {
      title: "Absentee Watchlist",
      description: "Employees trending toward chronic absence.",
      icon: UserX,
      metric: watchlist?.count != null ? String(watchlist.count) : undefined,
      tone: (watchlist?.count ?? 0) > 0 ? "warn" : "ok",
    },
  ];
}

export function formatLastAnalysis(isoDate: string | null): string | undefined {
  if (!isoDate) return undefined;

  const updatedAt = new Date(isoDate);
  if (Number.isNaN(updatedAt.getTime())) return undefined;

  const diffMinutes = Math.max(0, Math.round((Date.now() - updatedAt.getTime()) / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  return updatedAt.toLocaleDateString();
}
