import apiInstance from "@/api/apiInstance";
import type { OffboardingCase, OnboardingTask } from "@/lib/hrms/types";

export type { OffboardingCase };

export function mapOffboardingFromBackend(
  raw: Record<string, any>,
): OffboardingCase {
  const rawStageOrStatus = String(
    raw.status || raw.stage || "in-progress",
  ).toLowerCase();
  const status: "in-progress" | "completed" =
    rawStageOrStatus === "completed" || rawStageOrStatus === "settled"
      ? "completed"
      : "in-progress";

  const rawTasks: any[] = Array.isArray(raw.tasks)
    ? raw.tasks
    : Array.isArray(raw.checklist)
      ? raw.checklist
      : [];

  const tasks: OnboardingTask[] = rawTasks.map((t, index) => ({
    key: String(t.key || t.id || `task-${index}`),
    label: String(t.label || t.title || ""),
    done: Boolean(t.done ?? t.is_completed ?? t.completed ?? false),
    owner: String(t.owner || t.department || "HR"),
  }));

  const rawDocs: any[] = Array.isArray(raw.documents) ? raw.documents : [];
  const documents = rawDocs.map((d) => ({
    name: String(d.name || d.title || "Exit Document"),
    ready: Boolean(d.ready ?? d.issued ?? false),
  }));

  return {
    id: String(raw.id || ""),
    employee: String(raw.employee || raw.employee_name || raw.employeeName || ""),
    lastWorkingDay: String(
      raw.last_working_day || raw.lastWorkingDay || "",
    ),
    status,
    tasks,
    documents,
  };
}

export const offboardingApi = {
  getOffboardings: async (): Promise<{
    items: OffboardingCase[];
    total: number;
  }> => {
    const res = await apiInstance.get("/offboarding");
    const payload = res.data?.data ?? res.data;
    const rawItems: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    const items = rawItems.map(mapOffboardingFromBackend);
    return {
      items,
      total: Number(payload?.total ?? items.length),
    };
  },

  toggleExitTask: async (
    caseId: string,
    taskKey: string,
    done: boolean,
  ): Promise<OffboardingCase> => {
    const res = await apiInstance.patch(
      `/offboarding/${caseId}/tasks/${taskKey}`,
      { done },
    );
    return mapOffboardingFromBackend(res.data?.data ?? res.data);
  },

  generateExitDocument: async (
    caseId: string,
    docName: string,
  ): Promise<OffboardingCase> => {
    const res = await apiInstance.post(`/offboarding/${caseId}/documents`, {
      name: docName,
    });
    return mapOffboardingFromBackend(res.data?.data ?? res.data);
  },

  completeExit: async (caseId: string): Promise<OffboardingCase> => {
    const res = await apiInstance.post(`/offboarding/${caseId}/complete`, {});
    return mapOffboardingFromBackend(res.data?.data ?? res.data);
  },

  getOffboardingCases: async (): Promise<OffboardingCase[]> => {
    const res = await offboardingApi.getOffboardings();
    return res.items;
  },

  initiateOffboarding: async (
    payload: Partial<OffboardingCase>,
  ): Promise<OffboardingCase> => {
    const res = await apiInstance.post("/offboarding", payload);
    return mapOffboardingFromBackend(res.data?.data ?? res.data);
  },
};
