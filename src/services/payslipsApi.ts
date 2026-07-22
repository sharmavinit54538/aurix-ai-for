import { api, apiRequest } from "@/api";

export interface PayslipSummary {
  total_payslips: number;
  generated: number;
  pending_generation: number;
  sent: number;
  downloaded: number;
  failed: number;
  total_payroll_amount: number;
  average_net_salary: number;
}

export interface AdminPayslipItem {
  id: string;
  payslip_number: string;
  employee_id: string;
  employee_code: string;
  employee_name: string;
  department: string;
  designation: string;
  location: string;
  email: string;
  company_id: string | null;
  payroll_run_id: string;
  period_month: number;
  period_year: number;
  total_days_in_month: number;
  paid_days: number;
  lop_days: number;
  earnings: {
    basic: number;
    hra: number;
    conveyance: number;
    special_allowance: number;
    other_allowances_total: number;
    arrears: number;
    bonus: number;
    lop_deduction: number;
    gross_earnings: number;
  };
  deductions: {
    employee_pf: number;
    employer_pf: number;
    employee_esi: number;
    employer_esi: number;
    professional_tax: number;
    tds: number;
    other_deductions: number;
    total_deductions: number;
  };
  net_pay: number;
  net_pay_words: string | null;
  status: "GENERATED" | "PENDING" | "SENT" | "FAILED";
  payment_status: "PENDING" | "PAID" | "HOLD" | "FAILED";
  payment_date: string | null;
  payment_reference: string | null;
  email_status: "NOT_SENT" | "SENT" | "DELIVERED" | "OPENED" | "FAILED";
  email_sent_at: string | null;
  download_count: number;
  view_count: number;
  generated_at: string | null;
  created_at: string | null;
}

export interface AdminPayslipsFilterParams {
  search?: string;
  department?: string;
  designation?: string;
  location?: string;
  month?: number;
  year?: number;
  status?: string;
  payment_status?: string;
  employment_type?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

export interface AdminPayslipsResponseData {
  summary: PayslipSummary;
  items: AdminPayslipItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PayslipPreviewPayload {
  company: {
    name: string;
    logo: string;
    address: string;
    tax_id: string;
    email: string;
    phone: string;
  };
  period: string;
  payslip_number: string;
  generated_at: string;
  employee: {
    id: string;
    code: string;
    name: string;
    photo_url: string;
    department: string;
    designation: string;
    location: string;
    joining_date: string;
    bank_name: string;
    bank_account: string;
    pan: string;
    pf_number: string;
    esi_number: string;
  };
  attendance: {
    total_days: number;
    paid_days: number;
    lop_days: number;
  };
  earnings: Array<{ label: string; amount: number }>;
  deductions: Array<{ label: string; amount: number }>;
  employer_contributions: Array<{ label: string; amount: number }>;
  totals: {
    gross_salary: number;
    total_deductions: number;
    employer_contributions: number;
    net_salary: number;
    net_pay_words: string;
  };
  security: {
    qr_code_token: string;
    digital_signature_id: string;
    issued_by: string;
  };
}

export interface AuditLogItem {
  id: string;
  activity: string;
  performed_by: string;
  role: string;
  timestamp: string;
  ip_address: string;
  details: string;
}

export const payslipsApi = {
  /** Fetch paginated admin payslips with summary statistics */
  getAdminPayslips: async (params: AdminPayslipsFilterParams = {}): Promise<AdminPayslipsResponseData> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.department && params.department !== "all") query.set("department", params.department);
    if (params.designation && params.designation !== "all") query.set("designation", params.designation);
    if (params.location && params.location !== "all") query.set("location", params.location);
    if (params.month && params.month > 0) query.set("month", String(params.month));
    if (params.year && params.year > 0) query.set("year", String(params.year));
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.payment_status && params.payment_status !== "all") query.set("payment_status", params.payment_status);
    if (params.employment_type && params.employment_type !== "all") query.set("employment_type", params.employment_type);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sort_by) query.set("sort_by", params.sort_by);
    if (params.sort_dir) query.set("sort_dir", params.sort_dir);

    const queryString = query.toString();
    const endpoint = `payroll/admin/payslips${queryString ? `?${queryString}` : ""}`;
    const res = await api.get<{ success: boolean; data: AdminPayslipsResponseData }>(endpoint);
    return res.data;
  },

  /** Fetch preview drawer payload for a single payslip */
  getPayslipPreview: async (payslipId: string): Promise<PayslipPreviewPayload> => {
    const res = await api.get<{ success: boolean; data: PayslipPreviewPayload }>(`payroll/payslips/${payslipId}/preview`);
    return res.data;
  },

  /** Bulk generate payslips */
  bulkGeneratePayslips: async (payload: {
    month?: number;
    year?: number;
    department?: string;
    employee_ids?: string[];
  }): Promise<{ generated_count: number; payslip_ids: string[] }> => {
    const res = await api.post<{ success: boolean; data: { generated_count: number; payslip_ids: string[] } }>(
      "payroll/payslips/bulk-generate",
      payload
    );
    return res.data;
  },

  /** Bulk email payslips */
  bulkEmailPayslips: async (payslipIds: string[], customNote?: string): Promise<{ sent_count: number; failed_count: number }> => {
    const res = await api.post<{ success: boolean; data: { sent_count: number; failed_count: number } }>(
      "payroll/payslips/bulk-email",
      { payslip_ids: payslipIds, custom_note: customNote }
    );
    return res.data;
  },

  /** Bulk download ZIP blob */
  bulkDownloadPayslips: async (payslipIds: string[]): Promise<Blob> => {
    return await apiRequest<Blob>("payroll/payslips/bulk-download", {
      method: "POST",
      data: { payslip_ids: payslipIds },
    });
  },

  /** Download single PDF */
  downloadPayslipPdf: async (payslipId: string): Promise<Blob> => {
    return await apiRequest<Blob>(`payroll/payslips/${payslipId}/pdf`, {
      method: "GET",
    });
  },

  /** Single email payslip */
  emailPayslip: async (payslipId: string): Promise<boolean> => {
    const res = await api.post<{ success: boolean }>(`payroll/payslips/${payslipId}/email`);
    return res.success;
  },

  /** Single regenerate payslip */
  regeneratePayslip: async (payslipId: string): Promise<AdminPayslipItem> => {
    const res = await api.post<{ success: boolean; data: AdminPayslipItem }>(`payroll/payslips/${payslipId}/regenerate`);
    return res.data;
  },

  /** Delete payslip */
  deletePayslip: async (payslipId: string): Promise<boolean> => {
    const res = await api.delete<{ success: boolean }>(`payroll/payslips/${payslipId}`);
    return res.success;
  },

  /** Fetch audit logs for a payslip */
  getPayslipAuditLogs: async (payslipId: string): Promise<AuditLogItem[]> => {
    const res = await api.get<{ success: boolean; data: { items: AuditLogItem[] } }>(`payroll/payslips/${payslipId}/audit-logs`);
    return res.data.items;
  },
};
