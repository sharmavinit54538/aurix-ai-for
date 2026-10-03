import apiInstance from "@/api/apiInstance";
import type { Visitor, VisitorStatus } from "@/lib/hrms/types";

export interface BackendVisitor {
  id: string;
  tenant_id?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  host_employee_id?: string;
  host_employee?: string;
  purpose: string;
  expected_duration_mins?: number;
  check_in_at?: string;
  check_out_at?: string;
  status: string;
  pass_code: string;
  created_at: string;
}

export function mapVisitorFromBackend(raw: BackendVisitor | any): Visitor {
  return {
    id: String(raw.id || raw._id || ""),
    name: raw.name || "Anonymous Visitor",
    company: raw.company || undefined,
    email: raw.email || undefined,
    phone: raw.phone || undefined,
    photoUrl: raw.photo_url || raw.photoUrl || undefined,
    hostEmployee: raw.host_employee || raw.host_employee_id || raw.hostEmployee || "Unassigned",
    purpose: raw.purpose || "",
    expectedDurationMins: raw.expected_duration_mins != null ? Number(raw.expected_duration_mins) : (raw.expectedDurationMins != null ? Number(raw.expectedDurationMins) : 0),
    checkInAt: raw.check_in_at || raw.checkInAt || undefined,
    checkOutAt: raw.check_out_at || raw.checkOutAt || undefined,
    status: (raw.status || "pending").toLowerCase() as VisitorStatus,
    passCode: raw.pass_code || raw.passCode || `VIS-${String(raw.id || "").slice(-4)}`,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
  };
}

export const visitorsApi = {
  async getVisitors(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Visitor[]; total: number }> {
    const res = await apiInstance.get("/api/v2/visitors", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapVisitorFromBackend),
      total,
    };
  },

  async createVisitor(payload: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    hostEmployee: string;
    purpose: string;
    expectedDurationMins: number;
  }): Promise<Visitor> {
    const body = {
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      photo_url: payload.photoUrl,
      host_employee: payload.hostEmployee,
      purpose: payload.purpose,
      expected_duration_mins: payload.expectedDurationMins,
    };
    const res = await apiInstance.post("/api/v2/visitors", body);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async approveVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v2/visitors/${id}/approve`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async rejectVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v2/visitors/${id}/reject`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async checkInVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v2/visitors/${id}/check-in`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async checkOutVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v2/visitors/${id}/check-out`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async getVisitorSummary(): Promise<{ today: number; checkedIn: number; pending: number; total: number }> {
    const res = await apiInstance.get("/api/v2/visitors/summary");
    const raw = res.data?.data ?? res.data ?? {};
    return {
      today: Number(raw.today ?? 0),
      checkedIn: Number(raw.checked_in ?? raw.checkedIn ?? 0),
      pending: Number(raw.pending ?? 0),
      total: Number(raw.total ?? 0),
    };
  },

  async exportVisitors(): Promise<Blob> {
    const res = await apiInstance.get("/api/v2/visitors/export", { responseType: "blob" });
    return res.data;
  },
};
