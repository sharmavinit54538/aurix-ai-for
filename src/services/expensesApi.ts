import apiInstance from "@/api/apiInstance";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/lib/hrms/types";

export interface BackendExpense {
  id: string;
  tenant_id?: string;
  employee_id?: string;
  employee_name?: string;
  employee?: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  receipt_file_id?: string;
  receipt_name?: string;
  status: string;
  manager_note?: string;
  paid_at?: string;
  submitted_at?: string;
  created_at?: string;
}

export interface ExpenseSummary {
  pending: number;
  approved: number;
  rejected: number;
  paid: number;
  paidAmount: number;
}

export function mapExpenseFromBackend(raw: BackendExpense | any): Expense {
  return {
    id: String(raw.id || raw._id || ""),
    employee: raw.employee_name || raw.employee || raw.employee_id || "Unknown",
    category: (raw.category || "other").toLowerCase() as ExpenseCategory,
    amount: Number(raw.amount || 0),
    currency: raw.currency || "INR",
    date: raw.date ? String(raw.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    description: raw.description || "",
    receiptName: raw.receipt_name || raw.receiptName || (raw.receipt_file_id ? `receipt_${raw.receipt_file_id}` : undefined),
    status: (raw.status || "pending").toLowerCase() as ExpenseStatus,
    managerNote: raw.manager_note || raw.managerNote || undefined,
    paidAt: raw.paid_at || raw.paidAt || undefined,
    submittedAt: raw.submitted_at || raw.submittedAt || raw.created_at || new Date().toISOString(),
  };
}

export const expensesApi = {
  async getExpenses(params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ items: Expense[]; total: number }> {
    const res = await apiInstance.get("/api/v2/expenses", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapExpenseFromBackend),
      total,
    };
  },

  async getExpense(id: string): Promise<Expense> {
    const res = await apiInstance.get(`/api/v2/expenses/${id}`);
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async createExpense(payload: {
    employee?: string;
    category: ExpenseCategory;
    amount: number;
    currency?: string;
    date: string;
    description: string;
    receiptName?: string;
  }): Promise<Expense> {
    const body = {
      employee_name: payload.employee,
      category: payload.category,
      amount: payload.amount,
      currency: payload.currency || "INR",
      date: payload.date,
      description: payload.description,
      receipt_name: payload.receiptName,
    };
    const res = await apiInstance.post("/api/v2/expenses", body);
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async patchExpense(id: string, payload: Partial<{
    category: ExpenseCategory;
    amount: number;
    currency: string;
    date: string;
    description: string;
  }>): Promise<Expense> {
    const res = await apiInstance.patch(`/api/v2/expenses/${id}`, payload);
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async approveExpense(id: string): Promise<Expense> {
    const res = await apiInstance.post(`/api/v2/expenses/${id}/approve`);
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async rejectExpense(id: string, reason?: string): Promise<Expense> {
    const res = await apiInstance.post(`/api/v2/expenses/${id}/reject`, { reason });
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async requestExpenseChanges(id: string, note: string): Promise<Expense> {
    const res = await apiInstance.post(`/api/v2/expenses/${id}/request-changes`, { note });
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async markExpensePaid(id: string): Promise<Expense> {
    const res = await apiInstance.post(`/api/v2/expenses/${id}/mark-paid`);
    const raw = res.data?.data ?? res.data;
    return mapExpenseFromBackend(raw);
  },

  async getExpenseSummary(): Promise<ExpenseSummary> {
    const res = await apiInstance.get("/api/v2/expenses/summary");
    const raw = res.data?.data ?? res.data ?? {};
    return {
      pending: Number(raw.pending ?? 0),
      approved: Number(raw.approved ?? 0),
      rejected: Number(raw.rejected ?? 0),
      paid: Number(raw.paid ?? 0),
      paidAmount: Number(raw.paid_amount ?? raw.paidAmount ?? 0),
    };
  },

  async uploadReceipt(file: File): Promise<{ fileId: string; fileName: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/api/v2/expenses/receipt", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const raw = res.data?.data ?? res.data ?? {};
    return {
      fileId: raw.file_id || raw.id || "",
      fileName: raw.file_name || file.name,
    };
  },
};
