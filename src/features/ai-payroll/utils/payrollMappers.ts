import type { AIChart, AIFeature, AIKpi } from "@/components/aurix/AIModule";
import type {
  PayrollAnomaliesData,
  PayrollCostAnalysisData,
  PayrollCostByDepartmentData,
  PayrollDashboardKpis,
  PayrollForecastData,
  PayrollFraudData,
  PayrollHealthScoreData,
  SalaryBenchmarkingData,
} from "@/store/aiPayroll/aiPayrollTypes";
import {
  AlertTriangle,
  Banknote,
  Calculator,
  HeartPulse,
  Scale,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

function displayValue(value: number | string | null | undefined, fallback: string | number = "—"): string | number {
  return value == null || value === "" ? fallback : value;
}

function roundMetric(value: number): number {
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
}

function formatMoney(value: number | null | undefined, currency = "₹"): string | number {
  if (value == null) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${currency}${roundMetric(value / 1_000_000)}M`;
  if (abs >= 1_000) return `${currency}${roundMetric(value / 1_000)}k`;
  return `${currency}${roundMetric(value)}`;
}

function toProgress(score: number | null | undefined): number | undefined {
  if (score == null) return undefined;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function shortDept(name: string): string {
  if (name.length <= 12) return name;
  return name.slice(0, 10) + "…";
}

export function buildPayrollKpis(
  dashboard: PayrollDashboardKpis | null,
  forecast: PayrollForecastData | null,
  healthScore: PayrollHealthScoreData | null,
  anomalies: PayrollAnomaliesData,
): AIKpi[] {
  const currency = dashboard?.currency || "₹";
  const monthly = dashboard?.monthlyPayroll;
  const next =
    dashboard?.forecastNext ??
    forecast?.nextMonth ??
    forecast?.forecastPayroll ??
    (forecast?.points?.length
      ? (forecast.points[forecast.points.length - 1].secondary ??
        forecast.points[forecast.points.length - 1].value)
      : null);
  const anomaliesCount = dashboard?.anomalies ?? anomalies.total ?? anomalies.items.length;
  const health = dashboard?.healthScore ?? healthScore?.score;

  if (monthly == null && next == null && anomaliesCount == null && health == null) return [];

  return [
    {
      label: "Monthly Payroll",
      value: displayValue(formatMoney(monthly, currency)),
      trend: dashboard?.monthlyPayrollTrend ?? undefined,
      icon: Banknote,
    },
    {
      label: "Forecast Next Mo.",
      value: displayValue(formatMoney(next, currency)),
      trend: dashboard?.forecastTrend ?? forecast?.growthPct ?? undefined,
      icon: TrendingUp,
    },
    {
      label: "Anomalies",
      value: displayValue(anomaliesCount),
      trend: dashboard?.anomaliesTrend ?? undefined,
      icon: AlertTriangle,
      invert: true,
    },
    {
      label: "Payroll Health",
      value: displayValue(health != null ? roundMetric(health) : null),
      trend: dashboard?.healthScoreTrend ?? undefined,
      icon: HeartPulse,
    },
  ];
}

export function buildPayrollCharts(
  forecast: PayrollForecastData | null,
  costByDepartment: PayrollCostByDepartmentData | null,
  costAnalysis: PayrollCostAnalysisData | null,
): AIChart[] {
  const charts: AIChart[] = [];

  if (forecast?.points?.length) {
    const hasForecast = forecast.points.some((point) => point.secondary != null);
    const growth =
      forecast.growthPct != null ? ` · +${roundMetric(forecast.growthPct)}%` : "";
    charts.push({
      type: "area",
      title: "Payroll Forecast",
      description: `${forecast.period || "Actual vs AI projected payroll"}${growth}`,
      xKey: "label",
      series: hasForecast
        ? [
            { key: "value", label: "Actual", color: "oklch(0.7 0.16 200)" },
            { key: "secondary", label: "Forecast", color: "oklch(0.68 0.2 290)" },
          ]
        : [{ key: "value", label: "Payroll", color: "oklch(0.7 0.16 200)" }],
      data: forecast.points.map((point) => ({
        label: point.label,
        value: point.value,
        ...(point.secondary != null ? { secondary: point.secondary } : {}),
      })),
    });
  }

  if (costByDepartment?.items?.length) {
    charts.push({
      type: "bar",
      title: "Cost by Department",
      description:
        costByDepartment.total != null
          ? `Total ${formatMoney(costByDepartment.total)}`
          : costByDepartment.period || "Department-wise payroll cost",
      xKey: "label",
      series: [{ key: "cost", label: "Cost (₹k)", color: "oklch(0.78 0.18 70)" }],
      data: costByDepartment.items.map((item) => ({
        label: shortDept(item.department),
        cost: item.cost >= 1000 ? roundMetric(item.cost / 1000) : item.cost,
      })),
    });
  } else if (costAnalysis?.items?.length) {
    charts.push({
      type: "bar",
      title: "Payroll Cost Analysis",
      description:
        costAnalysis.summary ||
        (costAnalysis.totalCost != null
          ? `Total ${formatMoney(costAnalysis.totalCost)}`
          : costAnalysis.period || "Cost drivers"),
      xKey: "label",
      series: [{ key: "value", label: "Cost", color: "oklch(0.78 0.18 70)" }],
      data: costAnalysis.items.map((item) => ({
        label: shortDept(item.label),
        value: item.value >= 1000 ? roundMetric(item.value / 1000) : item.value,
      })),
    });
  }

  return charts;
}

export function buildPayrollFeatures(
  forecast: PayrollForecastData | null,
  benchmarking: SalaryBenchmarkingData,
  anomalies: PayrollAnomaliesData,
  costAnalysis: PayrollCostAnalysisData | null,
  fraud: PayrollFraudData,
  healthScore: PayrollHealthScoreData | null,
  dashboard: PayrollDashboardKpis | null,
): AIFeature[] {
  const anomalyCount = anomalies.total ?? anomalies.items.length;
  const fraudCount = fraud.total ?? fraud.items.length;
  const health = dashboard?.healthScore ?? healthScore?.score;
  const benchCount = benchmarking.total ?? benchmarking.items.length;
  const topFraud = fraud.items[0];
  const topDriver = costAnalysis?.costDrivers?.[0];

  return [
    {
      title: "Payroll Forecasting",
      description: forecast?.period
        ? `${forecast.period}${
            forecast.forecastPayroll != null ? ` · ${formatMoney(forecast.forecastPayroll)}` : ""
          }${forecast.confidenceScore != null ? ` · ${roundMetric(forecast.confidenceScore)}% conf` : ""}`
        : "Predict payroll cost up to 12 months ahead.",
      icon: TrendingUp,
      metric:
        forecast?.growthPct != null
          ? `+${roundMetric(forecast.growthPct)}%`
          : forecast?.points?.length
            ? `${forecast.points.length} pts`
            : undefined,
      tone: "info",
    },
    {
      title: "Salary Benchmarking",
      description:
        benchmarking.items[0]
          ? `${benchmarking.items[0].role}${
              benchmarking.items[0].deltaPct != null ? ` · ${benchmarking.items[0].deltaPct}% vs market` : ""
            }`
          : benchmarking.summary ||
            (benchCount === 0
              ? "No salary benchmarks analyzed yet."
              : "Compare bands to market & internal equity."),
      icon: Scale,
      metric: String(benchCount),
      tone: "info",
    },
    {
      title: "Payroll Anomaly Detection",
      description:
        anomalies.items[0]?.title ||
        anomalies.items[0]?.note ||
        (anomalyCount === 0 ? "No payroll anomalies detected." : "Flag unusual variances per cycle."),
      icon: AlertTriangle,
      metric: String(anomalyCount),
      tone: anomalyCount > 0 ? "warn" : "ok",
    },
    {
      title: "Cost Analysis",
      description:
        topDriver ||
        costAnalysis?.summary ||
        (costAnalysis?.totalCost != null
          ? `Total cost ${formatMoney(costAnalysis.totalCost)}`
          : "Drill into cost drivers by team and role."),
      icon: Calculator,
      metric:
        costAnalysis?.totalCost != null
          ? String(formatMoney(costAnalysis.totalCost))
          : costAnalysis?.items?.length
            ? `${costAnalysis.items.length}`
            : undefined,
      tone: "info",
    },
    {
      title: "Fraud Detection",
      description: topFraud
        ? `${topFraud.title}${topFraud.employeeName ? ` · ${topFraud.employeeName}` : ""}${
            topFraud.recommendation ? ` — ${topFraud.recommendation}` : topFraud.note ? ` — ${topFraud.note}` : ""
          }`
        : "Ghost employees, duplicate accounts and outliers.",
      icon: ShieldAlert,
      metric: String(fraudCount),
      tone: fraudCount > 0 ? "warn" : "ok",
    },
    {
      title: "Payroll Health Score",
      description:
        healthScore?.insights?.[0] ||
        healthScore?.summary ||
        (healthScore?.accuracy != null
          ? `Accuracy ${roundMetric(healthScore.accuracy)}% · Processing ${roundMetric(healthScore.onTime ?? 0)}%`
          : "Composite reliability + accuracy + on-time."),
      icon: HeartPulse,
      metric: health != null ? String(roundMetric(health)) : undefined,
      progress: toProgress(health),
      tone: (health ?? 0) >= 80 ? "ok" : (health ?? 0) >= 60 ? "info" : "warn",
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
