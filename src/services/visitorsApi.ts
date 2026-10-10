import apiInstance from "@/api/apiInstance";
import { extractValidationErrors } from "@/api/utils";
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

const VALID_STATUSES: VisitorStatus[] = ["pending", "approved", "checked-in", "checked-out", "rejected"];

function normalizeStatus(raw: string): VisitorStatus {
  const normalized = raw.toLowerCase().replace(/[\s_]+/g, "-");
  if (VALID_STATUSES.includes(normalized as VisitorStatus)) {
    return normalized as VisitorStatus;
  }
  return "pending";
}

export function mapVisitorFromBackend(raw: BackendVisitor | Record<string, unknown>): Visitor {
  const r = raw as Record<string, unknown>;
  return {
    id: String(r.id ?? r._id ?? ""),
    name: typeof r.name === "string" ? r.name : "",
    company: typeof r.company === "string" ? r.company : undefined,
    email: typeof r.email === "string" ? r.email : undefined,
    phone: typeof r.phone === "string" ? r.phone : undefined,
    photoUrl: typeof r.photo_url === "string" ? r.photo_url : (typeof r.photoUrl === "string" ? r.photoUrl : undefined),
    hostEmployee: typeof r.host_employee === "string" ? r.host_employee : (typeof r.host_employee_id === "string" ? r.host_employee_id : ""),
    purpose: typeof r.purpose === "string" ? r.purpose : "",
    expectedDurationMins:
      typeof r.expected_duration_mins === "number"
        ? r.expected_duration_mins
        : typeof r.expectedDurationMins === "number"
        ? r.expectedDurationMins
        : 0,
    checkInAt: typeof r.check_in_at === "string" ? r.check_in_at : (typeof r.checkInAt === "string" ? r.checkInAt : undefined),
    checkOutAt: typeof r.check_out_at === "string" ? r.check_out_at : (typeof r.checkOutAt === "string" ? r.checkOutAt : undefined),
    status: normalizeStatus(typeof r.status === "string" ? r.status : "pending"),
    passCode: typeof r.pass_code === "string" ? r.pass_code : (typeof r.passCode === "string" ? r.passCode : ""),
    createdAt: typeof r.created_at === "string" ? r.created_at : (typeof r.createdAt === "string" ? r.createdAt : ""),
  };
}

function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== "" && value !== null) {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  return result;
}

export const visitorsApi = {
  async getVisitors(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Visitor[]; total: number }> {
    const res = await apiInstance.get("/api/v1/visitors", { params });
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
    hostEmployeeId: string;
    purpose: string;
    expectedDurationMins: number;
  }): Promise<Visitor> {
    const body = stripEmpty({
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      photo_url: payload.photoUrl,
      host_employee_id: payload.hostEmployeeId,
      purpose: payload.purpose,
      expected_duration_mins: payload.expectedDurationMins,
    });
    const res = await apiInstance.post("/api/v1/visitors", body);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async approveVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v1/visitors/${id}/approve`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async rejectVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v1/visitors/${id}/reject`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async checkInVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v1/visitors/${id}/check-in`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async checkOutVisitor(id: string): Promise<Visitor> {
    const res = await apiInstance.post(`/api/v1/visitors/${id}/check-out`);
    const raw = res.data?.data ?? res.data;
    return mapVisitorFromBackend(raw);
  },

  async getVisitorSummary(): Promise<{ today: number; checkedIn: number; pending: number; total: number }> {
    const res = await apiInstance.get("/api/v1/visitors/summary");
    const raw = res.data?.data ?? res.data ?? {};
    return {
      today: Number(raw.today ?? 0),
      checkedIn: Number(raw.checked_in ?? raw.checkedIn ?? 0),
      pending: Number(raw.pending ?? 0),
      total: Number(raw.total ?? 0),
    };
  },

  async exportVisitors(): Promise<Blob> {
    const res = await apiInstance.get("/api/v1/visitors/export", { responseType: "blob" });
    return res.data;
  },
};

export function createVisitorError(error: unknown): { message: string; fieldErrors: Record<string, string> } {
  return {
    message: error instanceof Error ? error.message : "Failed to create visitor",
    fieldErrors: extractValidationErrors(error),
  };
}