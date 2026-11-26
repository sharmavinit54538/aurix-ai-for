import apiInstance from "@/api/apiInstance";

export interface Branch {
  id: string | number;
  name: string;
}

export interface BranchesListResult {
  items: Branch[];
  total: number;
  page?: number;
  limit?: number;
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

export const branchesApi = {
  getBranches: async (params?: Record<string, unknown>): Promise<BranchesListResult> => {
    try {
      const res = await apiInstance.get("/branches", { params });
      const payload = unwrapData<{ items: Branch[]; total: number; page: number; limit: number }>(res);
      const items: Branch[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : [];
      return {
        items,
        total: Number(payload?.total ?? items.length),
        page: payload?.page,
        limit: payload?.limit,
      };
    } catch {
      // Branches endpoint may not exist, return empty
      return { items: [], total: 0 };
    }
  },

  getBranch: async (id: string): Promise<Branch> => {
    const res = await apiInstance.get(`/branches/${id}`);
    return unwrapData<Branch>(res);
  },
};

export default branchesApi;