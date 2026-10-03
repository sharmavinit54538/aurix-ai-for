import apiInstance from "@/api/apiInstance";
import type { ExitCase } from "@/lib/hrms/types";

export interface BackendExitRecord {
  id: string;
  tenant_id?: string;
  employee_name?: string;
  employee?: string;
  role?: string;
  designation?: string;
  resigned_at?: string;
  resignedAt?: string;
  notice_days?: number;
  noticeDays?: number;
  last_working_day?: string;
  lastWorkingDay?: string;
  reason?: string;
  stage?: string;
  checklist?: any[];
  documents?: any[];
  department?: string;
  joining_date?: string;
  manager_name?: string;
  manager_approval_status?: string;
  hr_approval_status?: string;
  manager_comments?: string;
  hr_comments?: string;
  rejection_reason?: string;
  assigned_assets?: any[];
  clearance_workflow?: any[];
  settlement_details?: any;
  interview_details?: any;
  timeline?: any[];
  created_at?: string;
}

export function mapExitFromBackend(raw: BackendExitRecord | any): ExitCase {
  return {
    id: String(raw.id || raw._id || ""),
    employee: raw.employee_name || raw.employee || "Employee",
    role: raw.designation || raw.role || "Team Member",
    resignedAt: raw.resigned_at ? String(raw.resigned_at).slice(0, 10) : (raw.resignedAt ? String(raw.resignedAt).slice(0, 10) : new Date().toISOString().slice(0, 10)),
    noticeDays: raw.notice_days != null ? Number(raw.notice_days) : (raw.noticeDays != null ? Number(raw.noticeDays) : 0),
    lastWorkingDay: raw.last_working_day ? String(raw.last_working_day).slice(0, 10) : (raw.lastWorkingDay ? String(raw.lastWorkingDay).slice(0, 10) : new Date().toISOString().slice(0, 10)),
    reason: raw.reason || "",
    stage: raw.stage || "requested",
    checklist: Array.isArray(raw.checklist) ? raw.checklist : [
      { key: "assets", label: "Asset return checklist", done: false },
      { key: "kt", label: "Knowledge transfer", done: false },
      { key: "manager", label: "Manager approval", done: false },
      { key: "hr", label: "HR approval", done: false },
      { key: "it", label: "IT clearance", done: false },
      { key: "finance", label: "Finance clearance", done: false },
    ],
    documents: Array.isArray(raw.documents) ? raw.documents : [
      { name: "Experience Letter", issued: false },
      { name: "Relieving Letter", issued: false },
      { name: "Final Settlement Letter", issued: false },
      { name: "No Dues Certificate", issued: false },
    ],
    department: raw.department || "Operations",
    designation: raw.designation || raw.role || "Team Member",
    joiningDate: raw.joining_date ? String(raw.joining_date).slice(0, 10) : undefined,
    managerName: raw.manager_name || raw.managerName || "",
    remainingDays: raw.remaining_days != null ? Number(raw.remaining_days) : (raw.remainingDays != null ? Number(raw.remainingDays) : (raw.notice_days != null ? Number(raw.notice_days) : undefined)),
    managerApprovalStatus: raw.manager_approval_status || raw.managerApprovalStatus || "pending",
    hrApprovalStatus: raw.hr_approval_status || raw.hrApprovalStatus || "pending",
    managerComments: raw.manager_comments || raw.managerComments,
    hrComments: raw.hr_comments || raw.hrComments,
    rejectionReason: raw.rejection_reason || raw.rejectionReason,
    assignedAssets: raw.assigned_assets || raw.assignedAssets || [],
    clearanceWorkflow: raw.clearance_workflow || raw.clearanceWorkflow || [
      { department: "HR", status: "pending" },
      { department: "IT", status: "pending" },
      { department: "Finance", status: "pending" },
      { department: "Admin", status: "pending" },
      { department: "Manager", status: "pending" },
    ],
    settlementDetails: raw.settlement_details || raw.settlementDetails || {
      pendingSalary: 0,
      leaveEncashment: 0,
      bonus: 0,
      incentives: 0,
      deductions: 0,
      assetRecovery: 0,
      totalAmount: 0,
      status: "pending",
    },
    interviewDetails: raw.interview_details || raw.interviewDetails,
    timeline: raw.timeline || [],
  };
}

export const exitsApi = {
  async getExits(params?: {
    search?: string;
    stage?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: ExitCase[]; total: number }> {
    const res = await apiInstance.get("/api/v1/exits", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapExitFromBackend),
      total,
    };
  },

  async createExit(payload: Partial<BackendExitRecord>): Promise<ExitCase> {
    const res = await apiInstance.post("/api/v1/exits", payload);
    const raw = res.data?.data ?? res.data;
    return mapExitFromBackend(raw);
  },

  async updateExit(id: string, payload: Partial<BackendExitRecord>): Promise<ExitCase> {
    const res = await apiInstance.put(`/api/v1/exits/${id}`, payload);
    const raw = res.data?.data ?? res.data;
    return mapExitFromBackend(raw);
  },

  async completeExit(id: string): Promise<ExitCase> {
    const res = await apiInstance.post(`/api/v1/exits/${id}/complete`);
    const raw = res.data?.data ?? res.data;
    return mapExitFromBackend(raw);
  },
};
