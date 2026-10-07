export interface PayrollApprovalInfo {
  status?: string | null;
  approvedBy?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  rejectedBy?: string | null;
  rejectedByName?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  comments?: string | null;
  canApprove?: boolean;
  canReject?: boolean;
  blockingReasons?: string[];
  [key: string]: unknown;
}

export interface PayrollAuditRecord {
  action: string;
  user?: string | null;
  userName?: string | null;
  timestamp?: string | null;
  comment?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
  [key: string]: unknown;
}

export interface PayrollReviewData {
  runId: string;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  validationStatus?: string | null;
  runDate?: string | null;
  generatedAt?: string | null;
  lastUpdatedAt?: string | null;
  summary: PayrollPreviewSummary | null;
  validation: {
    status?: string | null;
    totalIssues: number;
    errorsCount: number;
    warningsCount: number;
    affectedEmployeesCount: number;
    blockingCount?: number | null;
    issues?: PayrollValidationIssue[];
  } | null;
  approval: PayrollApprovalInfo | null;
  auditLog?: PayrollAuditRecord[] | null;
  [key: string]: unknown;
}