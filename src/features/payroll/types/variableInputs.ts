/**
 * Variable Payroll Inputs Types.
 * Backend owns calculation of overtime, incentives, commissions, and adjustments.
 */

export type VariableInputType =
  | "overtime"
  | "bonus"
  | "incentive"
  | "commission"
  | "reimbursement"
  | "deduction"
  | "advance_recovery"
  | "lop"
  | "other";

export type VariableInputStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "consumed"
  | "cancelled";

export interface VariablePayrollInput {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  periodId: string;
  periodName: string;
  type: VariableInputType;
  amountPaise: number;
  amountFormatted: string;
  units?: number | null;
  ratePerUnitPaise?: number | null;
  description: string;
  status: VariableInputStatus;
  isPeriodLocked?: boolean;
  maker: {
    id: string;
    name: string;
  };
  checker?: {
    id: string;
    name: string;
  } | null;
  rejectionReason?: string | null;
  createdAt: string;
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
