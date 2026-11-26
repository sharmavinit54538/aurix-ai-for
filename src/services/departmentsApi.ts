import apiInstance from "@/api/apiInstance";

export interface Department {
  id: string;
  name: string;
  code?: string;
  description?: string;
  head_name?: string;
  head_id?: string;
  employee_count?: number;
  status?: string;
}

export interface DepartmentsListResponse {
  items: Department[];
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

export const departmentsApi = {
  getDepartments: async (params?: { limit?: number; search?: string }): Promise<DepartmentsListResponse> => {
    const res = await apiInstance.get("/departments", { params });
    const payload = unwrapData<{ items: Department[]; total: number; page: number; limit: number }>(res);
    const items: Department[] = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
    return {
      items,
      total: Number(payload?.total ?? items.length),
      page: Number(payload?.page ?? 1),
      limit: Number(payload?.limit ?? items.length),
    };
  },

  getDepartment: async (id: string): Promise<Department> => {
    const res = await apiInstance.get(`/departments/${id}`);
    return unwrapData<Department>(res);
  },
};

export default departmentsApi;