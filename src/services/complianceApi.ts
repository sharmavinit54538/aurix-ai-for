import { api } from "@/api";

export interface ComplianceObligationItem {
  id: string;
  type: "PF" | "ESI" | "PT" | "TDS" | "LWF" | "GRATUITY";
  period: string;
  due_date: string;
  amount: number;
  status: "FILED" | "PENDING" | "OVERDUE" | "WAIVED";
  challan_number?: string | null;
  filed_at?: string | null;
}

export interface ComplianceAlertItem {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  category: string;
  message: string;
  due_date: string;
}

export interface ComplianceDashboardData {
  overall_score: number;
  employees_covered: number;
  pending_filings: number;
  upcoming_due_dates: number;
  late_filings: number;
  compliance_alerts: number;
  total_pf_amount: number;
  total_esi_amount: number;
  total_pt_amount: number;
  total_tds_amount: number;
  government_contributions: number;
  monthly_status: string;
  obligations: ComplianceObligationItem[];
  alerts: ComplianceAlertItem[];
}

export interface ComplianceAuditLogItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

export interface ComplianceCalendarItem {
  id: string;
  title: string;
  date: string;
  category: string;
  status: "DUE_SOON" | "UPCOMING" | "SCHEDULED" | "OVERDUE";
}

export interface ComplianceReportItem {
  id: string;
  name: string;
  type: string;
  format: string;
}

export const complianceApi = {
  getDashboard: async (): Promise<ComplianceDashboardData> => {
    const res: any = await api.get("payroll/compliance/dashboard");
    return res.data?.data || res.data;
  },

  getPFDetails: async () => {
    const res: any = await api.get("payroll/compliance/pf");
    return res.data?.data || res.data;
  },

  getESIDetails: async () => {
    const res: any = await api.get("payroll/compliance/esi");
    return res.data?.data || res.data;
  },

  getTDSDetails: async () => {
    const res: any = await api.get("payroll/compliance/tds");
    return res.data?.data || res.data;
  },

  getCalendar: async (): Promise<ComplianceCalendarItem[]> => {
    const res: any = await api.get("payroll/compliance/calendar");
    return res.data?.data?.items || res.data?.items || [];
  },

  getReports: async (): Promise<ComplianceReportItem[]> => {
    const res: any = await api.get("payroll/compliance/reports");
    return res.data?.data?.items || res.data?.items || [];
  },

  runComplianceCheck: async () => {
    const res: any = await api.post("payroll/compliance/run-check", {});
    return res.data?.data || res.data;
  },

  generateReport: async (reportType: string) => {
    const res: any = await api.post("payroll/compliance/generate-report", { report_type: reportType });
    return res.data?.data || res.data;
  },

  getAuditLogs: async (): Promise<ComplianceAuditLogItem[]> => {
    const res: any = await api.get("payroll/compliance/audit");
    return res.data?.data?.items || res.data?.items || [];
  },
};
