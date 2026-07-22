import { api } from "@/api";

export interface BankTransferItem {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  designation: string;
  bank_name: string;
  account_holder: string;
  masked_account_number: string;
  ifsc: string;
  net_salary: number;
  batch_code: string;
  transfer_date: string;
  reference_number: string;
  payment_status: "COMPLETED" | "PROCESSING" | "PENDING" | "FAILED" | "REJECTED";
  bank_status: string;
  last_updated: string;
}

export interface BankTransferFilterParams {
  month?: number;
  year?: number;
  department?: string;
  bank?: string;
  payment_status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BankTransferDashboardMetrics {
  total_employees: number;
  ready_for_payment: number;
  pending_verification: number;
  transfer_processing: number;
  successful_transfers: number;
  failed_transfers: number;
  total_salary_amount: number;
  transferred_amount: number;
  pending_amount: number;
  rejected_amount: number;
}

export interface BankTransferDetailPayload extends BankTransferItem {
  branch?: string;
  transfer_mode?: string;
  settlement_date?: string;
  timeline?: { title: string; timestamp: string; actor: string }[];
}

export interface BankTransferAuditLogItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

export const bankTransfersApi = {
  getTransfers: async (params?: BankTransferFilterParams) => {
    const query = new URLSearchParams();
    if (params?.month) query.set("month", params.month.toString());
    if (params?.year) query.set("year", params.year.toString());
    if (params?.department) query.set("department", params.department);
    if (params?.bank) query.set("bank", params.bank);
    if (params?.payment_status) query.set("payment_status", params.payment_status);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString();
    const res: any = await api.get(`payroll/bank-transfers${qs ? `?${qs}` : ""}`);
    return res.data?.data || res.data;
  },

  getDashboardMetrics: async (): Promise<BankTransferDashboardMetrics> => {
    const res: any = await api.get("payroll/bank-transfers/dashboard");
    return res.data?.data || res.data;
  },

  getTransferDetail: async (id: string): Promise<BankTransferDetailPayload> => {
    const res: any = await api.get(`payroll/bank-transfers/${id}`);
    return res.data?.data || res.data;
  },

  createTransferBatch: async (payload: { employee_count?: number; total_amount?: number }) => {
    const res: any = await api.post("payroll/bank-transfers/batch", payload);
    return res.data?.data || res.data;
  },

  generateBankFile: async (fileFormat: string = "NEFT") => {
    const res: any = await api.post("payroll/bank-transfers/generate-file", { format: fileFormat });
    return res.data?.data || res.data;
  },

  initiatePayments: async () => {
    const res: any = await api.post("payroll/bank-transfers/initiate", {});
    return res.data?.data || res.data;
  },

  reconcilePayments: async () => {
    const res: any = await api.post("payroll/bank-transfers/reconcile", {});
    return res.data?.data || res.data;
  },

  retryTransfer: async (id: string) => {
    const res: any = await api.post(`payroll/bank-transfers/${id}/retry`, {});
    return res.data?.data || res.data;
  },

  markAsPaid: async (id: string) => {
    const res: any = await api.post(`payroll/bank-transfers/${id}/mark-paid`, {});
    return res.data?.data || res.data;
  },

  getAuditLogs: async (): Promise<BankTransferAuditLogItem[]> => {
    const res: any = await api.get("payroll/bank-transfers/audit");
    return res.data?.data?.items || res.data?.items || [];
  },
};
