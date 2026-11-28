/**
 * Variable Payroll Inputs Types.
 * Backend owns calculation of overtime, incentives, commissions, and adjustments.
 * Preserves null/missing financial and timestamp values rather than fabricating zeros or dates.
 */

export type VariableInputType =
  | "overtime"
  | "bonus"
  | "incentive"
  | "commission"
  | "reimbursement"
  | "arrears"
  | "adjustment"
  | "additional_allowance"
  | "additional_deduction"
  | "deduction"
  | "advance_recovery"
  | "lop"
  | "other";

export type VariableInputCategory = "earning" | "deduction" | "reimbursement" | "other";

export type VariableInputStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "processed"
  | "consumed"
  | "cancelled"
  | "unknown";

export type VariableProcessingStatus =
  | "not_processed"
  | "queued"
  | "processed"
  | "finalized"
  | "excluded"
  | "unknown";

export interface VariableInputActor {
  id: string;
  name: string;
  email?: string;
}

export interface VariablePayrollInput {
  id: string;
  referenceCode?: string | null;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  profileImage?: string;
  department: string;
  departmentId?: string;
  designation?: string;
  employmentType?: string;
  periodId: string;
  periodName: string;
  payrollMonth?: number | null;
  payrollYear?: number | null;
  payrollRunId?: string | null;
  payrollRunReference?: string | null;
  type: VariableInputType;
  typeRaw?: string | null;
  category: VariableInputCategory;
  salaryComponentId?: string | null;
  salaryComponentName?: string | null;
  description: string;
  reason?: string | null;
  notes?: string | null;
  units: number | null;
  unitType?: string | null;
  ratePerUnitPaise: number | null;
  ratePerUnitFormatted: string;
  amountPaise: number | null;
  amountFormatted: string;
  currency: string;
  effectiveDate?: string | null;
  claimReference?: string | null;
  attachmentUrl?: string | null;
  status: VariableInputStatus;
  statusRaw?: string | null;
  processingStatus: VariableProcessingStatus;
  processingStatusRaw?: string | null;
  processedAmountPaise?: number | null;
  processedAmountFormatted?: string;
  processedAt?: string | null;
  isPeriodLocked?: boolean;
  maker: VariableInputActor;
  submittedBy?: VariableInputActor | null;
  submittedAt?: string | null;
  checker?: VariableInputActor | null;
  approvedAt?: string | null;
  rejectedBy?: VariableInputActor | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  cancelledBy?: VariableInputActor | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface VariableInputsSummaryMetrics {
  totalInputs: number | null;
  totalApprovedAmountPaise: number | null;
  totalApprovedEarningsPaise: number | null;
  totalApprovedDeductionsPaise: number | null;
  pendingApprovalAmountPaise: number | null;
  totalBonusAmountPaise: number | null;
  totalIncentiveAmountPaise: number | null;
  totalOvertimeAmountPaise: number | null;
  totalReimbursementAmountPaise: number | null;
  processedCount: number | null;
  rejectedCount: number | null;
  pendingCount: number | null;
  approvedCount: number | null;
  source: "backend_summary" | "dataset_computed" | "unavailable";
}

export interface VariableInputsListParams {
  periodId?: string;
  payrollMonth?: number;
  payrollYear?: number;
  employeeId?: string;
  department?: string;
  type?: string;
  status?: string;
  processingStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  page?: number;
  limit?: number;
}

export interface VariableInputsListResult {
  items: VariablePayrollInput[];
  total: number;
  page: number;
  limit: number;
  summary: VariableInputsSummaryMetrics | null;
}

export interface VariableMasterEmployee {
  id: string;
  employeeCode: string;
  fullName: string;
  department?: string;
  departmentId?: string;
  designation?: string;
  employmentType?: string;
  profileImage?: string;
}

export interface VariableMasterComponent {
  id: string;
  code: string;
  name: string;
  type: "earning" | "deduction" | "employer_contribution";
}

export interface VariableMasterRun {
  id: string;
  label: string;
  periodId?: string;
  status?: string;
}

export interface BulkVariableInputPreviewResult {
  previewToken: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  totalAmountPaise: number;
  totalAmountFormatted: string;
  errors: Array<{
    rowNumber: number;
    employeeCode: string;
    inputType: string;
    errorCode: string;
    errorMessage: string;
  }>;
}
