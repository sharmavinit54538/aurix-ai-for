/**
 * Full & Final (F&F) Settlement Types.
 * Backend owns all calculations: unpaid salary, leave encashment, notice recovery, gratuity, and net settlement.
 */

export type FnfStatus =
  | "draft"
  | "validating"
  | "calculated"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "finalized"
  | "settled";

export interface FnfExitDetails {
  resignationDate?: string | null;
  lastWorkingDate: string;
  exitType: "resignation" | "termination" | "retirement" | "layoff" | "contract_end";
  reason: string;
  noticePeriodDaysRequired: number;
  noticePeriodDaysServed: number;
  shortfallDays: number;
}

export interface FnfEarningsBreakdown {
  unpaidSalaryDays: number;
  unpaidSalaryPaise: number;
  leaveEncashmentDays: number;
  leaveEncashmentPaise: number;
  gratuityPaise: number;
  statutoryBonusPaise: number;
  reimbursementsPaise: number;
  otherEarningsPaise: number;
  totalEarningsPaise: number;
  totalEarningsFormatted: string;
}

export interface FnfDeductionsBreakdown {
  noticeShortfallRecoveryPaise: number;
  loanAdvanceRecoveryPaise: number;
  assetDamageRecoveryPaise: number;
  pfDeductionPaise: number;
  ptDeductionPaise: number;
  tdsDeductionPaise: number;
  otherDeductionsPaise: number;
  totalDeductionsPaise: number;
  totalDeductionsFormatted: string;
}

export interface FnfRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  joiningDate: string;
  exitDetails: FnfExitDetails;
  earnings: FnfEarningsBreakdown;
  deductions: FnfDeductionsBreakdown;
  netSettlementPaise: number;
  netSettlementFormatted: string;
  status: FnfStatus;
  maker: {
    id: string;
    name: string;
  };
  checker?: {
    id: string;
    name: string;
  } | null;
  approvalRemarks?: string | null;
  rejectionReason?: string | null;
  finalizedAt?: string | null;
  settledAt?: string | null;
  createdAt: string;
}
