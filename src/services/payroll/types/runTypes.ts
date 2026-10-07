export type PayrollStatus =
  | "Draft"
  | "Open"
  | "Processing"
  | "Provision Generated"
  | "Under Review"
  | "Pending Approval"
  | "Approved"
  | "Finalized"
  | "Closed"
  | "Locked"
  | "Void"
  | "Failed"
  | string;

export type ReadinessStatus = "Ready" | "Warning" | "Error";

export type PayrollReadinessArea =
  | "Employee Data"
  | "Salary Structures"
  | "Attendance"
  | "Leave Data"
  | "Overtime"
  | "Loans / Advances"
  | "Tax / Statutory Configuration";

export interface PayrollReadinessItem {
  area: PayrollReadinessArea;
  status: ReadinessStatus;
  details?: string;
}

export interface PayrollReadiness {
  items: PayrollReadinessItem[];
  isReady?: boolean;
}

export interface PayrollIssue {
  id: string;
  type: "error" | "warning";
  category: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
}

export interface PayrollIssues {
  errors: PayrollIssue[];
  warnings: PayrollIssue[];
}

export interface PayrollRun {
  id: string;
  periodId: string;
  periodName: string;
  employeeCount: number | null;
  grossPayroll: number | null;
  netPayroll: number | null;
  status: PayrollStatus;
  runDate: string | null;
}

export interface PayrollRunStep {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed" | string;
  details?: string;
  order?: number;
}

export interface PayrollRunValidationIssue {
  id: string;
  severity: "critical" | "warning" | "info" | string;
  category?: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
  resolved?: boolean;
}

export interface PayrollRunStatus {
  runId: string;
  jobId?: string | null;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  progress?: number | null;
  currentStep?: string | null;
  employees?: {
    total?: number | null;
    processed?: number | null;
    failed?: number | null;
  } | null;
  steps?: PayrollRunStep[] | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
  validationIssues?: PayrollRunValidationIssue[] | null;
  startedAt?: string | null;
  completedAt?: string | null;
  [key: string]: unknown;
}

export interface CancelRunResponse {
  success: boolean;
  message?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RetryRunResponse {
  success: boolean;
  message?: string;
  runId?: string;
  jobId?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RunPayrollResponse {
  success: boolean;
  status?: string;
  message?: string;
  runId?: string;
  [key: string]: unknown;
}