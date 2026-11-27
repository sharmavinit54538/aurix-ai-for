import { api } from "@/api/client";
import type { Expense } from "@/lib/hrms/types";
import {
  filterExpensesByEmployeeId,
  filterExpensesForEmployee,
  mapExpenseFromBackend,
} from "@/lib/hrms/expense-helpers";

export {
  filterExpensesByEmployeeId,
  filterExpensesForEmployee,
  mapExpenseFromBackend,
};

function extractItems(resp: any): any[] {
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.items)) return resp.items;
  if (Array.isArray(resp?.data?.items)) return resp.data.items;
  if (Array.isArray(resp?.data)) return resp.data;
  return [];
}

function extractSingle(resp: any): any {
  if (resp?.data && typeof resp.data === "object" && !Array.isArray(resp.data)) {
    return resp.data;
  }
  return resp;
}

export const expensesApi = {
  getExpenses: async (): Promise<{ items: Expense[]; total: number }> => {
    const resp = await api.get<any>("/expenses");
    const items = extractItems(resp).map(mapExpenseFromBackend);
    const total =
      typeof resp?.total === "number"
        ? resp.total
        : typeof resp?.data?.total === "number"
          ? resp.data.total
          : items.length;
    return { items, total };
  },
  getEmployeeExpenses: async (
    employeeId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{ items: Expense[]; total: number; page: number; limit: number; hasNext: boolean }> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 30;
    const resp = await api.get<any>("/api/v1/expenses", {
      params: {
        employee_id: employeeId,
        page,
        limit,
      },
    });
    const mapped = extractItems(resp).map(mapExpenseFromBackend);
    const items = filterExpensesByEmployeeId(mapped, employeeId);
    const total =
      typeof resp?.data?.total === "number"
        ? resp.data.total
        : typeof resp?.total === "number"
          ? resp.total
          : items.length;
    const respPage =
      typeof resp?.data?.page === "number"
        ? resp.data.page
        : typeof resp?.page === "number"
          ? resp.page
          : page;
    const respLimit =
      typeof resp?.data?.limit === "number"
        ? resp.data.limit
        : typeof resp?.limit === "number"
          ? resp.limit
          : limit;
    const hasNext = Boolean(resp?.data?.has_next ?? resp?.has_next ?? false);
    return { items, total, page: respPage, limit: respLimit, hasNext };
  },
  getMyExpenses: async (employeeName?: string | null): Promise<{ items: Expense[]; total: number }> => {
    const resp = await api.get<any>("/expenses");
    const allItems = extractItems(resp).map(mapExpenseFromBackend);
    const items = employeeName ? filterExpensesForEmployee(allItems, employeeName) : allItems;
    return { items, total: items.length };
  },
  createExpense: async (data: Partial<Expense>): Promise<Expense> => {
    const resp = await api.post<any>("/expenses", data);
    return mapExpenseFromBackend(extractSingle(resp));
  },
  submitExpense: async (data: Partial<Expense>): Promise<Expense> => {
    const resp = await api.post<any>("/expenses", data);
    return mapExpenseFromBackend(extractSingle(resp));
  },
  resubmitExpense: async (id: string, data: Partial<Expense>): Promise<Expense> => {
    const resp = await api.patch<any>(`/expenses/${id}`, data);
    return mapExpenseFromBackend(extractSingle(resp));
  },
  withdrawExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
  approveExpense: async (id: string): Promise<Expense> => {
    const resp = await api.post<any>(`/expenses/${id}/approve`);
    return mapExpenseFromBackend(extractSingle(resp));
  },
  rejectExpense: async (id: string): Promise<Expense> => {
    const resp = await api.post<any>(`/expenses/${id}/reject`);
    return mapExpenseFromBackend(extractSingle(resp));
  },
  requestExpenseChanges: async (id: string, note: string): Promise<Expense> => {
    const resp = await api.post<any>(`/expenses/${id}/request-changes`, { note });
    return mapExpenseFromBackend(extractSingle(resp));
  },
  markExpensePaid: async (id: string): Promise<Expense> => {
    const resp = await api.post<any>(`/expenses/${id}/mark-paid`);
    return mapExpenseFromBackend(extractSingle(resp));
  },
  updateStatus: async (id: string, status: string): Promise<Expense> => {
    const resp = await api.patch<any>(`/expenses/${id}/status`, { status });
    return mapExpenseFromBackend(extractSingle(resp));
  },
};

export default expensesApi;
