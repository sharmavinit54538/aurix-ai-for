import apiInstance from "@/api/apiInstance";

export interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  break_duration_minutes?: number;
  working_days?: string[];
  description?: string;
  status?: string;
}

export interface ShiftsListResponse {
  items: Shift[];
  total: number;
  page: number;
  limit: number;
}

function unwrapData<T>(res: any): T {
  const payload = res.data?.data ?? res.data;
  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success === false) {
      throw new Error(payload.message || "API request failed");
    }
    return payload.data as T;
  }
  return payload as T;
}

export const shiftsApi = {
  getShifts: async (params?: { limit?: number; search?: string }): Promise<ShiftsListResponse> => {
    const res = await apiInstance.get("/api/v1/attendance/shifts", { params });
    const payload = unwrapData<{ items: Shift[]; total: number; page: number; limit: number }>(res);
    const items: Shift[] = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
    return {
      items,
      total: Number(payload?.total ?? items.length),
      page: Number(payload?.page ?? 1),
      limit: Number(payload?.limit ?? items.length),
    };
  },

  getShift: async (id: string): Promise<Shift> => {
    const res = await apiInstance.get(`/api/v1/attendance/shifts/${id}`);
    return unwrapData<Shift>(res);
  },
};

export default shiftsApi;