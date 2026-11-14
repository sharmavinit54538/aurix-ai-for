import { api } from "@/api/client";

export interface ExecutiveMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
}

export interface ExecutiveOverviewResponse {
  metrics: ExecutiveMetric[];
  summary: string;
  headcount?: number;
  activeEmployees?: number;
  attritionRate?: number;
  departmentBreakdown?: Array<{ name: string; count: number; budget?: number }>;
  StrategicInsights?: Array<{ id: string; title: string; summary: string; impact?: string }>;
  [key: string]: unknown;
}

export const executiveApi = {
  getOverview: async (role?: string): Promise<ExecutiveOverviewResponse> => {
    const query = role ? `?role=${encodeURIComponent(role)}` : "";
    const res = await api.get<any>(`/executive/overview${query}`);
    const payload = res?.data ?? res ?? {};
    return {
      metrics: Array.isArray(payload.metrics) ? payload.metrics : [],
      summary: String(payload.summary || ""),
      ...payload,
    };
  },
};
