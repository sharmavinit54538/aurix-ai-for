import { api } from "@/api/client";

export function mapOnboardingFromBackend(raw: any) {
  return {
    id: raw.id,
    employeeName: raw.employeeName || raw.name || "New Hire",
    role: raw.role || "Team Member",
    startDate: raw.startDate || new Date().toISOString(),
    progressPercentage: raw.progressPercentage || 0,
    status: raw.status || "in-progress",
  };
}

export const onboardingChecklistApi = {
  getChecklists: async () => {
    try {
      const data = await api.get<any[]>("/onboarding-checklist");
      return (data || []).map(mapOnboardingFromBackend);
    } catch {
      return [];
    }
  },
  updateItem: async (id: string, completed: boolean) => {
    return api.patch(`/onboarding-checklist/${id}`, { completed });
  },
};

export default onboardingChecklistApi;
