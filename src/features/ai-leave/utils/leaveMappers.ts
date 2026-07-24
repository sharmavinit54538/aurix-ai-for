import type { AIChart, AIFeature, AIKpi } from "@/components/aurix/AIModule";
import type {
  LeaveApprovalSuggestionsData,
  LeaveConflictsData,
  LeaveDashboardKpis,
  LeaveDistributionData,
  LeaveForecastData,
  LeaveTeamAvailabilityData,
  LeaveTrendsData,
} from "@/store/aiLeave/aiLeaveTypes";
import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

function displayValue(value: number | null | undefined, fallback: string | number = "—"): string | number {
  return value == null ? fallback : value;
}

function roundMetric(value: number): number {
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
}

function formatAvailability(value: number | null | undefined): string | number {
  if (value == null) return "—";
  return `${roundMetric(value)}%`;
}

function shortenLabel(label: string): string {
  // "Week 1 (Jul 27 - Aug 02)" -> "Week 1"
  const match = label.match(/^Week\s+\d+/i);
  return match ? match[0] : label;
}

export function buildLeaveKpis(
  dashboard: LeaveDashboardKpis | null,
  approvalSuggestions: LeaveApprovalSuggestionsData,
  conflicts: LeaveConflictsData,
  teamAvailability: LeaveTeamAvailabilityData | null,
): AIKpi[] {
  const pending = dashboard?.pending;
  const suggestions = dashboard?.approvalSuggestions ?? approvalSuggestions.total ?? approvalSuggestions.items.length;
  const conflictCount = dashboard?.conflicts ?? conflicts.total ?? conflicts.items.length;
  const availability = teamAvailability?.overall ?? dashboard?.teamAvailability;

  if (
    pending == null &&
    suggestions == null &&
    conflictCount == null &&
    availability == null &&
    dashboard?.approved == null &&
    dashboard?.rejected == null &&
    dashboard?.employeesOnLeave == null
  ) {
    return [];
  }

  return [
    {
      label: "Pending Requests",
      value: displayValue(pending),
      trend: dashboard?.pendingTrend ?? undefined,
      icon: FileText,
      invert: true,
    },
    {
      label: "Approval Suggestions",
      value: displayValue(suggestions),
      trend: dashboard?.approvedTrend ?? undefined,
      icon: CheckCircle2,
    },
    {
      label: "Conflicts Detected",
      value: displayValue(conflictCount),
      icon: AlertTriangle,
      invert: true,
    },
    {
      label: "Team Availability",
      value: formatAvailability(availability),
      trend: dashboard?.availabilityTrend ?? undefined,
      icon: Users,
    },
  ];
}

export function buildLeaveCharts(
  forecast: LeaveForecastData | null,
  distribution: LeaveDistributionData | null,
  trends: LeaveTrendsData | null,
): AIChart[] {
  const charts: AIChart[] = [];

  if (forecast?.points?.length) {
    charts.push({
      type: "area",
      title: "Leave Forecast",
      description: forecast.peakRisk
        ? `Peak risk: ${forecast.peakRisk}${forecast.period ? ` · ${forecast.period}` : ""}`
        : forecast.period || "Forecasted leave demand",
      xKey: "label",
      series: [{ key: "value", label: "Expected leave days", color: "oklch(0.7 0.16 200)" }],
      data: forecast.points.map((point) => ({
        label: shortenLabel(point.label),
        value: point.value,
      })),
    });
  } else if (trends?.points?.length) {
    charts.push({
      type: "area",
      title: "Leave Trends",
      description: trends.period || "Historic leave volume",
      xKey: "label",
      series: [{ key: "value", label: "Leave count", color: "oklch(0.7 0.16 200)" }],
      data: trends.points.map((point) => ({ label: point.label, value: point.value })),
    });
  }

  if (distribution?.items?.length) {
    charts.push({
      type: "bar",
      title: "Leave Type Distribution",
      description:
        distribution.totalLeaves != null
          ? `${distribution.totalLeaves} total leave requests`
          : "Days by leave type",
      xKey: "label",
      series: [{ key: "value", label: "Days taken", color: "oklch(0.68 0.2 290)" }],
      data: distribution.items.map((item) => ({ label: item.label, value: item.value })),
    });
  }

  return charts;
}

export function buildLeaveFeatures(
  approvalSuggestions: LeaveApprovalSuggestionsData,
  conflicts: LeaveConflictsData,
  teamAvailability: LeaveTeamAvailabilityData | null,
  forecast: LeaveForecastData | null,
  trends: LeaveTrendsData | null,
  dashboard: LeaveDashboardKpis | null,
): AIFeature[] {
  const suggestionCount = approvalSuggestions.total ?? approvalSuggestions.items.length;
  const conflictCount = conflicts.total ?? conflicts.items.length;
  const availability = teamAvailability?.overall ?? dashboard?.teamAvailability;
  const onLeave = teamAvailability?.onLeaveCount ?? dashboard?.employeesOnLeave;
  const topConflict = conflicts.items[0];

  return [
    {
      title: "Leave Approval Suggestions",
      description:
        approvalSuggestions.items[0]?.reason ||
        "AI recommends approve / discuss / decline with rationale.",
      icon: CheckCircle2,
      metric: String(suggestionCount),
      tone: suggestionCount > 0 ? "ok" : "info",
    },
    {
      title: "Leave Conflict Detection",
      description:
        topConflict?.note ||
        topConflict?.resolution ||
        "Flag overlaps in critical roles and small teams.",
      icon: AlertTriangle,
      metric: String(conflictCount),
      tone: conflictCount > 0 ? "warn" : "ok",
    },
    {
      title: "Team Availability Analysis",
      description:
        onLeave != null
          ? `${onLeave} employees currently on leave${
              teamAvailability?.availableCount != null ? ` · ${teamAvailability.availableCount} available` : ""
            }.`
          : "See real-time team capacity by week.",
      icon: Users,
      metric: availability != null ? `${roundMetric(availability)}%` : undefined,
      progress: availability ?? undefined,
      tone: "info",
    },
    {
      title: "Leave Forecasting",
      description: forecast?.peakRisk
        ? `Peak risk: ${forecast.peakRisk}${forecast.period ? ` · ${forecast.period}` : ""}`
        : "Predict leave volume across quarters.",
      icon: TrendingUp,
      metric: forecast?.points?.length ? `${forecast.points.length} wks` : undefined,
      tone: forecast?.peakRisk === "HIGH" || forecast?.peakRisk === "CRITICAL" ? "warn" : "info",
    },
    {
      title: "Leave Trends",
      description: trends?.period ? `${trends.period} leave patterns` : "Historic patterns by team, season and type.",
      icon: CalendarRange,
      metric: trends?.points?.length ? `${trends.points.length} mo` : undefined,
      tone: "info",
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
