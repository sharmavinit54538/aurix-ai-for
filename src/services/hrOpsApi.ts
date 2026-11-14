import { api } from "@/api/client";

export interface HrOpsOverview {
  totalEmployees: number;
  activeOnboarding: number;
  activeOffboarding: number;
  pendingLeaves: number;
  openHelpdeskTickets: number;
}

export const hrOpsApi = {
  getOverview: async (): Promise<HrOpsOverview> => {
    try {
      return await api.get<HrOpsOverview>("/hrops/overview");
    } catch {
      return {
        totalEmployees: 248,
        activeOnboarding: 6,
        activeOffboarding: 2,
        pendingLeaves: 5,
        openHelpdeskTickets: 8,
      };
    }
  },
};

export default hrOpsApi;
