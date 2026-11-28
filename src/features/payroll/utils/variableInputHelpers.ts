import type {
  VariableInputCategory,
  VariableInputStatus,
  VariableInputType,
  VariablePayrollInput,
  VariableProcessingStatus,
} from "../types/variableInputs";

export function formatInputTypeLabel(type: VariableInputType, rawType?: string | null): string {
  switch (type) {
    case "overtime":
      return "Overtime";
    case "bonus":
      return "Bonus";
    case "incentive":
      return "Incentive";
    case "commission":
      return "Commission";
    case "reimbursement":
      return "Reimbursement";
    case "arrears":
      return "Arrears";
    case "adjustment":
      return "Adjustment";
    case "additional_allowance":
      return "Additional Allowance";
    case "additional_deduction":
      return "Additional Deduction";
    case "deduction":
      return "Deduction";
    case "advance_recovery":
      return "Advance Recovery";
    case "lop":
      return "Loss of Pay (LOP)";
    case "other":
      return rawType ? rawType.replace(/_/g, " ") : "Other";
  }
}

export function formatCategoryLabel(cat: VariableInputCategory): string {
  switch (cat) {
    case "earning":
      return "Taxable / Payroll Earning";
    case "deduction":
      return "Payroll Deduction";
    case "reimbursement":
      return "Expense Reimbursement";
    case "other":
      return "Adjustment";
  }
}

export function formatVariableStatusLabel(
  status: VariableInputStatus,
  rawStatus?: string | null
): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "pending_approval":
      return "Pending Approval";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "processed":
      return "Processed";
    case "consumed":
      return "Processed";
    case "cancelled":
      return "Cancelled";
    case "unknown":
      return rawStatus ? rawStatus.replace(/_/g, " ") : "Not Available";
  }
}

export function getVariableStatusBadgeClass(status: VariableInputStatus): string {
  switch (status) {
    case "approved":
      return "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
    case "processed":
    case "consumed":
      return "border-blue-500/30 bg-blue-500/12 text-blue-700 dark:text-blue-300";
    case "pending_approval":
      return "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300";
    case "rejected":
      return "border-rose-500/30 bg-rose-500/12 text-rose-700 dark:text-rose-300";
    case "draft":
    case "cancelled":
    case "unknown":
      return "border-border bg-muted text-muted-foreground";
  }
}

export function formatProcessingStatusLabel(
  status: VariableProcessingStatus,
  rawStatus?: string | null
): string {
  switch (status) {
    case "not_processed":
      return "Not Processed";
    case "queued":
      return "Queued for Payroll";
    case "processed":
      return "Processed";
    case "finalized":
      return "Finalized / Locked";
    case "excluded":
      return "Excluded from Payroll";
    case "unknown":
      return rawStatus ? rawStatus.replace(/_/g, " ") : "Not Available";
  }
}

export function formatUnitsWithType(inp: Pick<VariablePayrollInput, "units" | "unitType" | "type">): string {
  if (inp.units === null || inp.units === undefined || !Number.isFinite(inp.units)) {
    return "—";
  }
  if (inp.unitType) {
    return `${inp.units} ${inp.unitType}`;
  }
  switch (inp.type) {
    case "overtime":
      return `${inp.units} hr${inp.units === 1 ? "" : "s"}`;
    case "lop":
      return `${inp.units} day${inp.units === 1 ? "" : "s"}`;
    case "reimbursement":
      return `${inp.units} claim${inp.units === 1 ? "" : "s"}`;
    case "bonus":
    case "incentive":
    case "commission":
      return `${inp.units} unit${inp.units === 1 ? "" : "s"}`;
    default:
      return String(inp.units);
  }
}
