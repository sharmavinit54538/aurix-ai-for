import { api } from "@/api/client";

export function mapOffboardingFromBackend(raw: any) {
  return {
    id: raw.id,
    employeeName: raw.employeeName || raw.name || "Employee",
    department: raw.department || "General",
    lastWorkingDay: raw.lastWorkingDay || new Date().toISOString(),
    status: raw.status || "in-progress",
    clearanceStatus: raw.clearanceStatus || "pending",
  };
}

export const offboardingApi = {
  getOffboardingCases: async () => {
    try {
      const data = await api.get<any[]>("/offboarding");
      return (data || []).map(mapOffboardingFromBackend);
    } catch {
      return [];
    }
  },
  initiateOffboarding: async (payload: any) => {
    return api.post("/offboarding", payload);
  },
};

export default offboardingApi;
