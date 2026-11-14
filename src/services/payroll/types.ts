export type PayrollStatus = "draft" | "processing" | "validated" | "approved" | "finalized";

export interface PayrollPeriod {
  id: string;
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  status: PayrollStatus;
  totalEmployees?: number;
  totalGrossPay?: number;
  totalNetPay?: number;
}

export interface PayrollPreviewEmployee {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: string;
}

export interface PayrollPreviewData {
  period: PayrollPeriod;
  employees: PayrollPreviewEmployee[];
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
}

export interface PayrollValidationIssue {
  id: string;
  employeeId: string;
  employeeName: string;
  severity: "critical" | "warning" | "info";
  description: string;
  category: string;
  resolved: boolean;
}

export interface PayrollValidationSummary {
  periodId: string;
  totalIssues: number;
  criticalIssues: number;
  warnings: number;
  resolvedIssues: number;
  issues: PayrollValidationIssue[];
}

export interface PayrollDashboardData {
  currentPeriod: PayrollPeriod;
  recentPeriods: PayrollPeriod[];
  totalPayrollCost: number;
  pendingApprovals: number;
}

export interface PayslipHistoryItem {
  id: string;
  periodName: string;
  month: string;
  year: number;
  netPay: number;
  downloadUrl?: string;
}

export interface PayrollFinalizationData {
  periodId: string;
  finalizedAt: string;
  finalizedBy: string;
  batchReference: string;
}
