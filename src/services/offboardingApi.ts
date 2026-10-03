import apiInstance from "@/api/apiInstance";
import type { OffboardingCase, OnboardingTask } from "@/lib/hrms/types";

export interface BackendExitCase {
  id: string;
  tenant_id?: string;
  employee_name?: string;
  employee?: string;
  last_working_day?: string;
  exit_date?: string;
  status?: string;
  stage?: string;
  tasks?: Array<{ key: string; label: string; done: boolean; owner: string }>;
  checklist?: Array<{ key: string; label: string; done: boolean; owner?: string }>;
  documents?: Array<{ name: string; ready?: boolean; issued?: boolean }>;
  created_at?: string;
}

export function mapOffboardingFromBackend(raw: BackendExitCase | any): OffboardingCase {
  const tasksRaw = Array.isArray(raw.tasks)
    ? raw.tasks
    : Array.isArray(raw.checklist)
    ? raw.checklist.map((c: any) => ({
        key: c.key || c.id || "",
        label: c.label || c.name || "",
        done: Boolean(c.done || c.is_completed),
        owner: c.owner || "HR",
      }))
    : [
        { key: "kt", label: "Knowledge transfer", done: false, owner: "Manager" },
        { key: "laptop", label: "Laptop returned", done: false, owner: "IT" },
        { key: "access", label: "Accounts revoked", done: false, owner: "IT" },
        { key: "clearance", label: "Finance clearance", done: false, owner: "Finance" },
        { key: "interview", label: "Exit interview", done: false, owner: "HR" },
        { key: "settlement", label: "Final settlement", done: false, owner: "HR" },
      ];

  const docsRaw = Array.isArray(raw.documents)
    ? raw.documents.map((d: any) => ({
        name: d.name || "Exit Document",
        ready: Boolean(d.ready || d.issued),
      }))
    : [
        { name: "Experience Letter", ready: false },
        { name: "Relieving Letter", ready: false },
        { name: "No Dues Certificate", ready: false },
      ];

  const status =
    raw.status === "completed" || raw.stage === "settled" || raw.stage === "completed"
      ? "completed"
      : "in-progress";

  return {
    id: String(raw.id || raw._id || ""),
    employee: raw.employee_name || raw.employee || "Employee",
    lastWorkingDay: raw.last_working_day
      ? String(raw.last_working_day).slice(0, 10)
      : raw.exit_date
      ? String(raw.exit_date).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    status,
    tasks: tasksRaw,
    documents: docsRaw,
  };
}

export const offboardingApi = {
  async getOffboardings(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ items: OffboardingCase[]; total: number }> {
    const res = await apiInstance.get("/api/v1/exits", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapOffboardingFromBackend),
      total,
    };
  },

  async toggleExitTask(id: string, taskKey: string, done: boolean): Promise<OffboardingCase> {
    const res = await apiInstance.patch(`/api/v1/exits/${id}/checklist/${taskKey}`, { done });
    const raw = res.data?.data ?? res.data;
    return mapOffboardingFromBackend(raw);
  },

  async generateExitDocument(id: string, documentName: string): Promise<OffboardingCase> {
    const res = await apiInstance.post(`/api/v1/exits/${id}/documents/generate`, {
      document_name: documentName,
    });
    const raw = res.data?.data ?? res.data;
    return mapOffboardingFromBackend(raw);
  },

  async completeExit(id: string): Promise<OffboardingCase> {
    const res = await apiInstance.post(`/api/v1/exits/${id}/complete`);
    const raw = res.data?.data ?? res.data;
    return mapOffboardingFromBackend(raw);
  },
};
