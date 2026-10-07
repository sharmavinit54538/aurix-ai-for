import type { PayrollStatus } from "./runTypes";

export interface ApprovePayrollPayload {
  comments?: string;
  notes?: string;
}

export interface ApprovePayrollResponse {
  success: boolean;
  message?: string;
  status?: PayrollStatus;
  approval?: PayrollApprovalInfo;
  [key: string]: unknown;
}

export interface RejectPayrollPayload {
  reason: string;
  comments?: string;
}

export interface RejectPayrollResponse {
  success: boolean;
  message?: string;
  status?: PayrollStatus;
  [key: string]: unknown;
}