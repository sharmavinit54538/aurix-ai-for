import apiInstance from "@/api/apiInstance";
import type { Visitor, VisitorStatus } from "@/lib/hrms/types";

export type { Visitor, VisitorStatus };

export function mapVisitorFromBackend(raw: Record<string, any>): Visitor {
  const rawStatus = String(raw.status || "pending").toLowerCase();
  const normalizedStatus: VisitorStatus =
    rawStatus === "approved" ||
    rawStatus === "checked-in" ||
    rawStatus === "checked_in" ||
    rawStatus === "checked-out" ||
    rawStatus === "checked_out" ||
    rawStatus === "rejected"
      ? (rawStatus.replace("_", "-") as VisitorStatus)
      : "pending";

  return {
    id: String(raw.id || ""),
    name: String(raw.name || raw.visitor_name || ""),
    company: raw.company || raw.visitor_company || undefined,
    email: raw.email || undefined,
    phone: raw.phone || undefined,
    photoUrl: raw.photo_url || raw.photoUrl || undefined,
    hostEmployee: String(
      raw.host_employee ||
        raw.hostEmployee ||
        raw.host_name ||
        raw.hostName ||
        "",
    ),
    purpose: String(raw.purpose || ""),
    expectedDurationMins: Number(
      raw.expected_duration_mins ?? raw.expectedDurationMins ?? 60,
    ),
    checkInAt: raw.check_in_at || raw.checkInAt || undefined,
    checkOutAt: raw.check_out_at || raw.checkOutAt || undefined,
    status: normalizedStatus,
    passCode: String(raw.pass_code || raw.passCode || ""),
    createdAt: String(
      raw.created_at || raw.createdAt || new Date().toISOString(),
    ),
  };
}

export function createVisitorError(err: any): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  const data = err?.response?.data;
  const fieldErrors: Record<string, string> = {};
  if (data?.errors && typeof data.errors === "object") {
    for (const [k, v] of Object.entries(data.errors)) {
      fieldErrors[k] = Array.isArray(v) ? String(v[0]) : String(v);
    }
  }
  const message =
    data?.message ||
    data?.detail ||
    err?.message ||
    "Failed to register visitor";
  return { message, fieldErrors };
}

export const visitorsApi = {
  getVisitors: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ items: Visitor[]; total: number }> => {
    const res = await apiInstance.get("/visitors", { params });
    const payload = res.data?.data ?? res.data;
    const rawItems: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    const items = rawItems.map(mapVisitorFromBackend);
    return {
      items,
      total: Number(payload?.total ?? items.length),
    };
  },

  createVisitor: async (payload: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    hostEmployeeId?: string;
    hostEmployee?: string;
    purpose: string;
    expectedDurationMins: number;
  }): Promise<Visitor> => {
    const res = await apiInstance.post("/visitors", {
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      photo_url: payload.photoUrl,
      host_employee_id: payload.hostEmployeeId,
      host_employee: payload.hostEmployee,
      purpose: payload.purpose,
      expected_duration_mins: payload.expectedDurationMins,
    });
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  approveVisitor: async (id: string): Promise<Visitor> => {
    const res = await apiInstance.post(`/visitors/${id}/approve`, {});
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  rejectVisitor: async (id: string): Promise<Visitor> => {
    const res = await apiInstance.post(`/visitors/${id}/reject`, {});
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  checkInVisitor: async (id: string): Promise<Visitor> => {
    const res = await apiInstance.post(`/visitors/${id}/check-in`, {});
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  checkOutVisitor: async (id: string): Promise<Visitor> => {
    const res = await apiInstance.post(`/visitors/${id}/check-out`, {});
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  checkIn: async (id: string): Promise<Visitor> => {
    const res = await apiInstance.post(`/visitors/${id}/check-in`, {});
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  checkOut: async (id: string): Promise<Visitor> => {
    const res = await apiInstance.post(`/visitors/${id}/check-out`, {});
    return mapVisitorFromBackend(res.data?.data ?? res.data);
  },

  exportVisitors: async (): Promise<Blob> => {
    const res = await apiInstance.get("/visitors/export", {
      responseType: "blob",
    });
    return res.data instanceof Blob
      ? res.data
      : new Blob([JSON.stringify(res.data ?? "")], { type: "text/csv" });
  },
};
