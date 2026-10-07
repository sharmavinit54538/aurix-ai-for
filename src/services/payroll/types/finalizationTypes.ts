import type { PayrollStatus, PayrollPreviewSummary, PayrollReviewData, PayrollApprovalInfo, PayrollAuditRecord } from "./reviewTypes";

export interface PayrollFinalizationInfo {
  isFinalized?: boolean;
  isLocked?: boolean;
  finalizedBy?: string | null;
  finalizedByName?: string | null;
  finalizedAt?: string | null;
  finalizationNotes?: string | null;
  referenceNumber?: string | null;
  canFinalize?: boolean;
  blockingReasons?: string[];
  [key: string]: unknown;
}

export interface FinalizePayrollPayload {
  notes?: string;
  lock?: boolean;
}

export interface FinalizePayrollResponse {
  success: boolean;
  message?: string;
  status?: PayrollStatus;
  isFinalized?: boolean;
  isLocked?: boolean;
  finalizedAt?: string | null;
  finalizedBy?: string | null;
  finalization?: PayrollFinalizationInfo;
  [key: string]: unknown;
}

export interface PayrollFinalizationData {
  runId: string;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  isLocked?: boolean;
  isFinalized?: boolean;
  validationStatus?: string | null;
  approvalStatus?: string | null;
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
  } | null;
  approval: PayrollApprovalInfo | null;
  finalization: PayrollFinalizationInfo | null;
  auditLog?: PayrollAuditRecord[] | null;
  [key: string]: unknown;
}