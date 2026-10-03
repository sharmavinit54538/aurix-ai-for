import apiInstance from "@/api/apiInstance";

export interface ExecutiveMetric {
  key: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  available: boolean;
  hint?: string;
}

export interface ExecutiveTimeSeriesPoint {
  month: string;
  headcount?: number;
  payrollCost?: number;
  attendanceRate?: number;
  leaveUtilisation?: number;
  attritionRate?: number;
  openPositions?: number;
  assetsValue?: number;
  [key: string]: any;
}

export interface ExecutiveInitiative {
  name: string;
  category: string;
  owner: string;
  status: string;
  progress: number;
  impact?: string;
}

export interface ExecutiveOverviewResponse {
  role: string;
  title?: string;
  subtitle?: string;
  health_score?: number;
  healthScore?: number;
  metrics: Array<{
    key: string;
    label: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "neutral";
    available?: boolean;
    hint?: string;
  }>;
  time_series?: ExecutiveTimeSeriesPoint[];
  timeSeries?: ExecutiveTimeSeriesPoint[];
  initiatives?: ExecutiveInitiative[];
}

export const executiveApi = {
  async getOverview(role: string): Promise<ExecutiveOverviewResponse> {
    const res = await apiInstance.get("/api/v2/executive/overview", {
      params: { role: role.toLowerCase() },
    });
    const raw = res.data?.data ?? res.data ?? {};
    
    // Normalize raw response
    const metricsRaw = Array.isArray(raw.metrics) ? raw.metrics : [];
    const timeSeriesRaw = Array.isArray(raw.time_series)
      ? raw.time_series
      : Array.isArray(raw.timeSeries)
      ? raw.timeSeries
      : [];
    const initiativesRaw = Array.isArray(raw.initiatives) ? raw.initiatives : [];

    return {
      role: raw.role || role,
      title: raw.title,
      subtitle: raw.subtitle,
      healthScore: Number(raw.health_score ?? raw.healthScore ?? 0),
      // Filter out any unsourced metrics where available is explicitly false
      metrics: metricsRaw
        .filter((m: any) => m.available !== false && m.value !== "—" && m.value !== "Live data pending")
        .map((m: any) => ({
          key: m.key,
          label: m.label,
          value: m.value,
          change: m.change,
          trend: m.trend || "neutral",
          available: m.available !== false,
          hint: m.hint,
        })),
      timeSeries: timeSeriesRaw,
      initiatives: initiativesRaw,
    };
  },
};
