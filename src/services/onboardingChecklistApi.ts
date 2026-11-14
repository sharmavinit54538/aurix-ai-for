import apiInstance from "@/api/apiInstance";
import type { OnboardingCase, OnboardingTask } from "@/lib/hrms/types";

export type { OnboardingCase, OnboardingTask };

export function mapOnboardingFromBackend(
  raw: Record<string, any>,
): OnboardingCase {
  const rawTasks: any[] = Array.isArray(raw.tasks)
    ? raw.tasks
    : Array.isArray(raw.items)
      ? raw.items
      : [];

  const tasks: OnboardingTask[] = rawTasks.map((t, index) => ({
    key: String(t.key || t.id || `task-${index}`),
    label: String(t.label || t.title || ""),
    done: Boolean(t.done ?? t.is_completed ?? t.completed ?? false),
    owner: String(t.owner || t.assigned_to || "HR"),
  }));

  return {
    id: String(raw.id || ""),
    employee: String(raw.employee || raw.employee_name || raw.employeeName || ""),
    role: String(raw.role || raw.designation || ""),
    joinDate: String(raw.join_date || raw.joinDate || raw.joining_date || ""),
    manager: String(raw.manager || raw.manager_name || ""),
    tasks,
    completionPercentage:
      typeof raw.completion_percentage === "number"
        ? raw.completion_percentage
        : typeof raw.completionPercentage === "number"
          ? raw.completionPercentage
          : undefined,
    currentStep: raw.current_step || raw.currentStep || undefined,
    department: raw.department || raw.department_name || undefined,
    missingDocuments: Array.isArray(raw.missing_documents)
      ? raw.missing_documents
      : Array.isArray(raw.missingDocuments)
        ? raw.missingDocuments
        : undefined,
  };
}

export const onboardingChecklistApi = {
  getOnboardings: async (): Promise<{
    items: OnboardingCase[];
    total: number;
  }> => {
    const res = await apiInstance.get("/onboarding-checklist");
    const payload = res.data?.data ?? res.data;
    const rawItems: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    const items = rawItems.map(mapOnboardingFromBackend);
    return {
      items,
      total: Number(payload?.total ?? items.length),
    };
  },

  createOnboarding: async (
    payload: Partial<OnboardingCase>,
  ): Promise<OnboardingCase> => {
    const res = await apiInstance.post("/onboarding-checklist", {
      employee_name: payload.employee,
      employee: payload.employee,
      role: payload.role,
      manager: payload.manager,
      join_date: payload.joinDate,
      tasks: payload.tasks,
    });
    return mapOnboardingFromBackend(res.data?.data ?? res.data);
  },

  toggleOnboardingTask: async (
    caseId: string,
    taskKey: string,
    done: boolean,
  ): Promise<OnboardingCase> => {
    const res = await apiInstance.patch(
      `/onboarding-checklist/${caseId}/tasks/${taskKey}`,
      { done, is_completed: done },
    );
    return mapOnboardingFromBackend(res.data?.data ?? res.data);
  },

  getChecklists: async (): Promise<OnboardingCase[]> => {
    const res = await onboardingChecklistApi.getOnboardings();
    return res.items;
  },

  updateItem: async (
    checklistId: string,
    itemId: string,
    completed: boolean,
  ): Promise<OnboardingCase> => {
    return onboardingChecklistApi.toggleOnboardingTask(
      checklistId,
      itemId,
      completed,
    );
  },
};
