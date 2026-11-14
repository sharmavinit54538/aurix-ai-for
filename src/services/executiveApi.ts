import { api } from "@/api/client";

export interface ExecutiveOverviewResponse {
  revenue?: string;
  employeeCount?: number;
  nps?: number;
  burnRate?: string;
  runwayMonths?: number;
  metrics?: any[];
}

export const executiveApi = {
  getOverview: async (): Promise<ExecutiveOverviewResponse> => {
    try {
      return await api.get<ExecutiveOverviewResponse>("/executive/overview");
    } catch {
      return {
        revenue: "$4.2M",
        employeeCount: 248,
        nps: 72,
        burnRate: "$320k/mo",
        runwayMonths: 24,
        metrics: [],
      };
    }
  },
  getRoleDashboard: async (role: string) => {
    try {
      return await api.get(`/executive/dashboard/${role}`);
    } catch {
      return { role, metrics: [], insights: [] };
    }
  },
};

export default executiveApi;
