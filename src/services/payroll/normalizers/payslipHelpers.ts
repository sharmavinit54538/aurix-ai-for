/**
 * Pure helper functions for normalizing payslip payloads received from
 * OFC360 backend payroll endpoints without synthetic client calculations.
 */

export function pickFirst<T>(...values: Array<T | null | undefined>): T | undefined {
  for (const v of values) {
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

export function toNullableNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  if (typeof val === "string") {
    const cleaned = val.replace(/[₹,\s]/g, "").trim();
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Resolves a monetary field from either rupee fields or `_paise` integer fields,
 * preserving exact backend decimal precision without rounding.
 */
export function resolveMonetaryField(
  rupeeVal: unknown,
  paiseVal?: unknown
): number | null {
  const direct = toNullableNumber(rupeeVal);
  if (direct !== null) return direct;
  const paise = toNullableNumber(paiseVal);
  if (paise !== null) return paise / 100;
  return null;
}

export function toNullableString(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s ? s : null;
}

export function formatPeriodLabel(
  periodName?: unknown,
  month?: unknown,
  year?: unknown
): string {
  const direct = toNullableString(periodName);
  if (direct) return direct;
  const m = toNullableNumber(month);
  const y = toNullableNumber(year);
  if (m && y && m >= 1 && m <= 12) {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
      }).format(new Date(y, m - 1, 1));
    } catch {
      return `${m}/${y}`;
    }
  }
  return "Payroll Cycle";
}

export interface NormalizedAttendance {
  workingDays: number | null;
  paidDays: number | null;
  presentDays: number | null;
  leaveDays: number | null;
  lopDays: number | null;
  holidays: number | null;
  weeklyOffs: number | null;
  overtimeHours: number | null;
}

export function normalizeAttendance(raw: any): NormalizedAttendance {
  const src = raw?.attendance ?? raw?.attendance_summary ?? raw ?? {};
  return {
    workingDays: toNullableNumber(
      pickFirst(src.workingDays, src.working_days, src.totalWorkingDays, src.total_working_days)
    ),
    paidDays: toNullableNumber(
      pickFirst(src.paidDays, src.paid_days, src.payableDays, src.payable_days)
    ),
    presentDays: toNullableNumber(
      pickFirst(src.presentDays, src.present_days)
    ),
    leaveDays: toNullableNumber(
      pickFirst(src.leaveDays, src.leave_days, src.approvedLeaves, src.approved_leaves)
    ),
    lopDays: toNullableNumber(
      pickFirst(src.lopDays, src.lop_days, src.unpaidDays, src.unpaid_days)
    ),
    holidays: toNullableNumber(
      pickFirst(src.holidays, src.holiday_days)
    ),
    weeklyOffs: toNullableNumber(
      pickFirst(src.weeklyOffs, src.weekly_offs, src.weekOffDays, src.week_off_days)
    ),
    overtimeHours: toNullableNumber(
      pickFirst(src.overtimeHours, src.overtime_hours)
    ),
  };
}

export interface NormalizedBankInfo {
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  accountHolderName: string | null;
}

export function normalizeBankInfo(raw: any): NormalizedBankInfo | null {
  const emp = raw?.employee ?? raw ?? {};
  const src = raw?.bankInfo ?? raw?.bank_info ?? emp?.bankInfo ?? emp?.bank_info ?? emp?.bank_details ?? raw?.bankDetails;
  if (!src && !emp?.bank_name && !emp?.bankName && !emp?.bank_account && !emp?.account_number) {
    return null;
  }
  const target = src ?? emp;
  return {
    bankName: toNullableString(pickFirst(target.bankName, target.bank_name)),
    accountNumber: toNullableString(
      pickFirst(
        target.accountNumberMasked,
        target.account_number_masked,
        target.accountNumber,
        target.account_number,
        target.bank_account
      )
    ),
    ifscCode: toNullableString(pickFirst(target.ifscCode, target.ifsc_code, target.ifsc)),
    accountHolderName: toNullableString(
      pickFirst(target.accountHolderName, target.account_holder_name)
    ),
  };
}
