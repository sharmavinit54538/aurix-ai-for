import apiInstance from "@/api/apiInstance";
import type { OnboardingCase, OnboardingTask } from "@/lib/hrms/types";

export interface BackendOnboardingProgressItem {
  employee_id: string;
  employee_code?: string;
  name: string;
  department: string;
  designation: string;
  joining_date?: string;
  work_location?: string;
  status: string;
  current_step: string;
  completion_percentage: number;
  missing_documents: string[];
}

export function mapOnboardingFromBackend(raw: BackendOnboardingProgressItem | Record<string, unknown> | any): OnboardingCase {
  const record = raw as Record<string, unknown>;
  const tasksRaw = Array.isArray(record.tasks) ? record.tasks : [];
  const hasRealTasks = tasksRaw.length > 0;

  // Support both old format (employee_name, role) and new format (name, designation)
  const employeeName = (typeof record.name === "string" ? record.name : undefined) ?? (typeof record.employee_name === "string" ? record.employee_name : undefined);
  const roleValue = (typeof record.designation === "string" ? record.designation : undefined) ?? (typeof record.role === "string" ? record.role : undefined);
  const joinDateValue = (typeof record.joining_date === "string" ? record.joining_date : undefined) ?? (typeof record.joinDate === "string" ? record.joinDate : undefined) ?? (typeof record.join_date === "string" ? record.join_date : undefined);
  const managerValue = (typeof record.manager_name === "string" ? record.manager_name : undefined) ?? (typeof record.manager === "string" ? record.manager : undefined);

  return {
    id: String(record.employee_id ?? record.id ?? record._id ?? ""),
    employee: employeeName ?? "Employee",
    role: roleValue ?? "Team Member",
    joinDate: joinDateValue ? String(joinDateValue).slice(0, 10) : "",
    manager: managerValue ?? "",
    tasks: hasRealTasks ? tasksRaw.map((t: any) => ({
      key: t.key || t.id || "",
      label: t.label || t.name || "",
      done: Boolean(t.done || t.is_completed || t.completed),
      owner: t.owner || "HR",
    })) : [],
    completionPercentage: typeof record.completion_percentage === "number" ? record.completion_percentage : (typeof record.completionPercentage === "number" ? record.completionPercentage : undefined),
    currentStep: typeof record.current_step === "string" ? record.current_step : (typeof record.currentStep === "string" ? record.currentStep : undefined),
    department: typeof record.department === "string" ? record.department : undefined,
    missingDocuments: Array.isArray(record.missing_documents) ? record.missing_documents.map(String) : (Array.isArray(record.missingDocuments) ? record.missingDocuments.map(String) : undefined),
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