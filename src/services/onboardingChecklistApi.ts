import apiInstance from "@/api/apiInstance";
import type { OnboardingCase, OnboardingTask } from "@/lib/hrms/types";

export interface BackendOnboardingCase {
  id: string;
  tenant_id?: string;
  employee_name?: string;
  employee?: string;
  role?: string;
  join_date?: string;
  manager_name?: string;
  manager?: string;
  tasks?: Array<{ key: string; label: string; done: boolean; owner: string }>;
  created_at?: string;
}

export function mapOnboardingFromBackend(raw: BackendOnboardingCase | any): OnboardingCase {
  const tasksRaw = Array.isArray(raw.tasks) ? raw.tasks : [];
  return {
    id: String(raw.id || raw._id || ""),
    employee: raw.employee_name || raw.employee || "Employee",
    role: raw.role || "Team Member",
    joinDate: raw.join_date ? String(raw.join_date).slice(0, 10) : (raw.joinDate ? String(raw.joinDate).slice(0, 10) : new Date().toISOString().slice(0, 10)),
    manager: raw.manager_name || raw.manager || "HR Manager",
    tasks: tasksRaw.map((t: any) => ({
      key: t.key || t.id || "",
      label: t.label || t.name || "",
      done: Boolean(t.done || t.is_completed || t.completed),
      owner: t.owner || "HR",
    })),
  };
}

export const onboardingChecklistApi = {
  async getOnboardings(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ items: OnboardingCase[]; total: number }> {
    const res = await apiInstance.get("/api/v1/admin/employee-onboarding", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    if (itemsRaw.length > 0) {
      console.log("[DEBUG getOnboardings raw item]:", JSON.stringify(itemsRaw[0]));
    }
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapOnboardingFromBackend),
      total,
    };
  },

  async createOnboarding(payload: {
    employee: string;
    role: string;
    manager: string;
    joinDate: string;
    tasks: OnboardingTask[];
  }): Promise<OnboardingCase> {
    const body = {
      employee_name: payload.employee,
      role: payload.role,
      manager_name: payload.manager,
      join_date: payload.joinDate,
      tasks: payload.tasks,
    };
    const res = await apiInstance.post("/api/v1/admin/employee-onboarding", body);
    const raw = res.data?.data ?? res.data;
    return mapOnboardingFromBackend(raw);
  },

  async toggleOnboardingTask(id: string, taskKey: string, done: boolean): Promise<OnboardingCase> {
    const res = await apiInstance.patch(`/api/v1/admin/employee-onboarding/${id}/tasks/${taskKey}`, {
      done,
    });
    const raw = res.data?.data ?? res.data;
    return mapOnboardingFromBackend(raw);
  },
};
