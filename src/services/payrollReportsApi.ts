import { api } from "@/api";

export interface ReportsDashboardKPIs {
  total_payroll_cost: number;
  net_salary_paid: number;
  gross_salary: number;
  total_deductions: number;
  employer_contributions: number;
  bonuses_paid: number;
  overtime_paid: number;
  tax_deducted: number;
  pf_contributions: number;
  esi_contributions: number;
  pending_payroll: number;
  accuracy_percentage: number;
}

export interface ReportsCostTrendPoint {
  month: string;
  gross: number;
  net: number;
  tax: number;
  pf: number;
}

export interface DepartmentCostBreakdownItem {
  name: string;
  cost: number;
  headcount: number;
}

export interface ComponentDistributionItem {
  name: string;
  value: number;
}

export interface ReportsDashboardData {
  kpis: ReportsDashboardKPIs;
  cost_trend: ReportsCostTrendPoint[];
  department_breakdown: DepartmentCostBreakdownItem[];
  component_distribution: ComponentDistributionItem[];
}

export interface ReportTemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface ReportAuditLogItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

export const payrollReportsApi = {
  getDashboardData: async (): Promise<ReportsDashboardData> => {
    const res: any = await api.get("payroll/reports/dashboard");
    return res.data?.data || res.data;
  },

  getTemplates: async (): Promise<ReportTemplateItem[]> => {
    const res: any = await api.get("payroll/reports");
    return res.data?.data?.items || res.data?.items || [];
  },

  generateReport: async (reportId: string) => {
    const res: any = await api.post("payroll/reports/generate", { report_id: reportId });
    return res.data?.data || res.data;
  },

  generateCustomReport: async (queryConfig: any) => {
    const res: any = await api.post("payroll/reports/custom", queryConfig);
    return res.data?.data || res.data;
  },

  scheduleReport: async (scheduleConfig: any) => {
    const res: any = await api.post("payroll/reports/schedule", scheduleConfig);
    return res.data?.data || res.data;
  },

  getHistory: async () => {
    const res: any = await api.get("payroll/reports/history");
    return res.data?.data?.items || res.data?.items || [];
  },

  exportReport: async () => {
    const res: any = await api.get("payroll/reports/export");
    return res.data?.data || res.data;
  },

  getAuditLogs: async (): Promise<ReportAuditLogItem[]> => {
    const res: any = await api.get("payroll/reports/audit");
    return res.data?.data?.items || res.data?.items || [];
  },
};
