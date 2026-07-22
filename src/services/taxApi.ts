import { api, apiRequest } from "@/api";

export interface TaxSummaryMetrics {
  total_employees: number;
  tax_filed: number;
  pending_declaration: number;
  total_tds: number;
  tax_collected: number;
  tax_refund: number;
  average_tax: number;
  compliance_score: number;
}

export interface AdminTaxItem {
  employee_id: string;
  employee_code: string;
  employee_name: string;
  avatar?: string | null;
  email: string;
  department: string;
  designation: string;
  location: string;
  financial_year: string;
  tax_regime: "OLD" | "NEW";
  gross_salary: number;
  taxable_income: number;
  exemptions: number;
  deductions: number;
  tds: number;
  net_tax: number;
  refund: number;
  declaration_status: "PENDING" | "APPROVED" | "REJECTED";
  declaration_id?: string | null;
  rejection_reason?: string | null;
  verified_by_hr: boolean;
  last_updated: string;
}

export interface AdminTaxFilterParams {
  search?: string;
  department?: string;
  designation?: string;
  location?: string;
  financial_year?: string;
  tax_regime?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

export interface AdminTaxDashboardResponse {
  summary: TaxSummaryMetrics;
  items: AdminTaxItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TaxComputationDetails {
  regime: "OLD" | "NEW";
  gross_annual: number;
  standard_deduction: number;
  other_deductions: number;
  taxable_income: number;
  gross_tax: number;
  rebate_87a: number;
  cess: number;
  net_tax: number;
  monthly_tds: number;
}

export interface ProofDocumentItem {
  id: string;
  section: string;
  document_name: string;
  document_url: string;
  amount_claimed: number;
  verified_by_hr: boolean;
  uploaded_at: string;
}

export interface EmployeeTaxProfileResponse {
  employee: {
    id: string;
    employee_code: string;
    name: string;
    email: string;
    department: string;
    designation: string;
    location: string;
    pan_number: string;
    pf_number: string;
    joining_date: string;
    avatar?: string | null;
  };
  financial_year: string;
  selected_regime: "OLD" | "NEW";
  declaration_status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string | null;
  salary_summary: {
    annual_ctc: number;
    gross_salary: number;
    taxable_salary: number;
    basic: number;
    hra: number;
    special_allowance: number;
  };
  deductions: {
    section_80c: number;
    section_80d: number;
    section_80ccd1b_nps: number;
    home_loan_24b: number;
    section_80g: number;
    hra_claimed: number;
    lta_claimed: number;
    professional_tax: number;
    other_deductions: number;
    total_deductions: number;
  };
  employer_contributions: {
    employer_pf: number;
    employer_esi: number;
  };
  tax_computation: TaxComputationDetails;
  regime_comparison: {
    old_regime: TaxComputationDetails;
    new_regime: TaxComputationDetails;
    recommended_regime: "OLD" | "NEW";
    estimated_savings: number;
  };
  proof_documents: ProofDocumentItem[];
}

export interface TaxAuditLogItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

export const taxApi = {
  // Fetch Tax Management Dashboard
  getAdminTaxDashboard: async (
    params: AdminTaxFilterParams = {}
  ): Promise<AdminTaxDashboardResponse> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append("search", params.search);
    if (params.department && params.department !== "all") searchParams.append("department", params.department);
    if (params.designation && params.designation !== "all") searchParams.append("designation", params.designation);
    if (params.location && params.location !== "all") searchParams.append("location", params.location);
    if (params.financial_year) searchParams.append("financial_year", params.financial_year);
    if (params.tax_regime && params.tax_regime !== "all") searchParams.append("tax_regime", params.tax_regime);
    if (params.status && params.status !== "all") searchParams.append("status", params.status);
    if (params.page) searchParams.append("page", String(params.page));
    if (params.limit) searchParams.append("limit", String(params.limit));
    if (params.sort_by) searchParams.append("sort_by", params.sort_by);
    if (params.sort_dir) searchParams.append("sort_dir", params.sort_dir);

    const queryString = searchParams.toString();
    const url = `payroll/admin/tax${queryString ? `?${queryString}` : ""}`;
    const res: any = await api.get(url);
    return res.data?.data || res.data;
  },

  // Get full Tax Profile for an employee
  getEmployeeTaxProfile: async (
    employeeId: string,
    financialYear: string = "2026-2027"
  ): Promise<EmployeeTaxProfileResponse> => {
    const res: any = await api.get(`tax/profile/${employeeId}?financial_year=${financialYear}`);
    return res.data?.data || res.data;
  },

  // Run TDS calculation
  runTaxCalculation: async (payload: { financial_year: string; employee_ids?: string[] }) => {
    const res: any = await api.post("tax/calculate", payload);
    return res.data?.data || res.data;
  },

  // Approve declaration
  approveDeclaration: async (declarationId: string) => {
    const res: any = await api.post(`tax/declarations/${declarationId}/approve`, {});
    return res.data?.data || res.data;
  },

  // Reject declaration
  rejectDeclaration: async (declarationId: string, reason: string) => {
    const res: any = await api.post(`tax/declarations/${declarationId}/reject`, { reason });
    return res.data?.data || res.data;
  },

  // Verify proof document
  verifyProofDoc: async (proofId: string, approvedAmount?: number) => {
    const res: any = await api.post(`tax/proofs/${proofId}/verify`, { approved_amount: approvedAmount });
    return res.data?.data || res.data;
  },

  // Run Year-End processing
  runYearEndProcess: async (financialYear: string) => {
    const res: any = await api.post("tax/year-end-process", { financial_year: financialYear });
    return res.data?.data || res.data;
  },

  // Fetch tax audit logs
  getTaxAuditLogs: async (employeeId: string): Promise<TaxAuditLogItem[]> => {
    const res: any = await api.get(`tax/audit-logs/${employeeId}`);
    return res.data?.data?.items || res.data?.items || [];
  },
};
