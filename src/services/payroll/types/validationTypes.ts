export interface PayrollValidationIssue {
  id: string;
  severity: "critical" | "error" | "warning" | "info" | string;
  category?: string;
  code?: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  component?: string;
  blocking?: boolean;
  status?: string;
  detectedAt?: string;
  resolved?: boolean;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  source?: string;
  [key: string]: unknown;
}

export interface PayrollValidationSummary {
  runId: string;
  status: string;
  periodName?: string | null;
  periodId?: string | null;
  runStatus?: string | null;
  totalIssues: number;
  errorsCount: number;
  warningsCount: number;
  affectedEmployeesCount: number;
  blockingCount?: number | null;
  lastValidatedAt?: string | null;
  issues: PayrollValidationIssue[];
  [key: string]: unknown;
}