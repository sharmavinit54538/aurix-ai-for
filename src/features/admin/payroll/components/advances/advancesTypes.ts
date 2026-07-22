export type AdvanceType =
  | "Emergency"
  | "Medical"
  | "Festival"
  | "Travel"
  | "Education"
  | "Custom";

export type ApprovalStatus =
  | "PENDING_MANAGER"
  | "PENDING_HR"
  | "PENDING_FINANCE"
  | "APPROVED"
  | "REJECTED";

export type PaymentStatus = "UNPAID" | "DISBURSED" | "FAILED";

export type RecoveryStatus = "NOT_STARTED" | "RECOVERING" | "PAUSED" | "RECOVERED";

export type RecoveryMethod = "MONTHLY_PAYROLL" | "BI_WEEKLY" | "ONE_TIME" | "MANUAL";

export interface Installment {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: "PAID" | "PENDING" | "SKIPPED";
  payrollCycle?: string;
}

export interface ApprovalStep {
  role: "Employee Request" | "Reporting Manager" | "HR Review" | "Finance Approval" | "Bank Disbursement" | "Payroll Recovery";
  name: string;
  avatar?: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  timestamp?: string;
  comment?: string;
}

export interface SalaryAdvanceRequest {
  id: string;
  advanceCode: string; // e.g. "ADV-2026-801"
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  avatar?: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  advanceType: AdvanceType;
  reason: string;
  requestedAmount: number;
  approvedAmount: number;
  outstandingBalance: number;
  recoveredAmount: number;
  interestRate: number; // e.g. 0%
  recoveryMethod: RecoveryMethod;
  totalInstallments: number;
  installmentAmount: number;
  startRecoveryDate: string;
  endRecoveryDate: string;
  nextRecoveryDate: string;
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  recoveryStatus: RecoveryStatus;
  approvalStage: "EMPLOYEE" | "MANAGER" | "HR" | "FINANCE" | "DISBURSEMENT" | "RECOVERY" | "COMPLETED";
  approvalWorkflow: ApprovalStep[];
  installments: Installment[];
  bankAccount?: string;
  bankName?: string;
  transactionRef?: string;
  settlementDate?: string;
  createdOn: string;
  updatedOn: string;
  createdBy: string;
}

export interface AdvancesSummaryKPIs {
  totalRequests: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  disbursed: number;
  recovered: number;
  outstandingBalance: number;
  monthlyRecovery: number;
  averageAdvance: number;
  recoveryRate: number; // e.g. 84.5%
}

export interface AdvancesFilters {
  search: string;
  employee: string;
  employeeId: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  advanceType: string;
  approvalStatus: string;
  recoveryStatus: string;
  financialYear: string;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface AdvanceAuditLog {
  id: string;
  advanceId: string;
  advanceCode: string;
  action: "CREATE" | "APPROVE" | "REJECT" | "DISBURSE" | "ADJUST_INSTALLMENTS" | "PAUSE_RECOVERY" | "CLOSE";
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface AdvanceAIInsight {
  id: string;
  title: string;
  type: "ELIGIBILITY_SCORE" | "RECOVERY_RISK" | "PAYMENT_DELAY" | "NEGATIVE_SALARY" | "BUDGET_UTILIZATION";
  severity: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  employeeName?: string;
  description: string;
  impactMetric: string;
  recommendation: string;
}
