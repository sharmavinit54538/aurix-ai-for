import { api } from "@/api/client";
import { filterExitsForEmployee } from "@/lib/hrms/exit-helpers";
import type { ExitCase } from "@/lib/hrms/types";

function extractItems(res: any): ExitCase[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

export const exitsApi = {
  getExits: async (): Promise<{ items: ExitCase[]; total: number }> => {
    try {
      const res = await api.get<any>("/exits");
      const items = extractItems(res);
      return { items, total: items.length };
    } catch {
      return { items: [], total: 0 };
    }
  },
  getMyExits: async (
    employeeName?: string | null,
    employeeId?: string | null,
  ): Promise<{ items: ExitCase[]; total: number }> => {
    const res = await exitsApi.getExits();
    const scoped = filterExitsForEmployee(res.items, employeeName, employeeId);
    return { items: scoped, total: scoped.length };
  },
  createExitCase: async (payload: Partial<ExitCase> & Record<string, any>) => {
    return api.post<ExitCase>("/exits", payload);
  },
  createExit: async (payload: Partial<ExitCase> & Record<string, any>) => {
    return api.post<ExitCase>("/exits", payload);
  },
  updateExit: async (id: string, payload: Partial<ExitCase> & Record<string, any>) => {
    return api.patch<ExitCase>(`/exits/${id}`, payload);
  },
  withdrawExit: async (id: string) => {
    return api.delete<{ success: boolean }>(`/exits/${id}`);
  },
};

export default exitsApi;
