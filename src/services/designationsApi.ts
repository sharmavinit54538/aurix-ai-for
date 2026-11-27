import apiInstance from "@/api/apiInstance";

export interface Designation {
  id: string;
  name: string;
  department_id?: string;
  department_name?: string;
  level?: number;
  description?: string;
  status?: string;
}

export interface DesignationsListResponse {
  items: Designation[];
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

export const designationsApi = {
  getDesignations: async (params?: { department_id?: string; limit?: number; search?: string }): Promise<DesignationsListResponse> => {
    const res = await apiInstance.get("/api/v1/settings/designations", { params });
    const payload = unwrapData<{ items: Designation[]; total: number; page: number; limit: number }>(res);
    const items: Designation[] = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
    return {
      items,
      total: Number(payload?.total ?? items.length),
      page: Number(payload?.page ?? 1),
      limit: Number(payload?.limit ?? items.length),
    };
  },

  getDesignation: async (id: string): Promise<Designation> => {
    const res = await apiInstance.get(`/api/v1/settings/designations/${id}`);
    return unwrapData<Designation>(res);
  },
};

export default designationsApi;