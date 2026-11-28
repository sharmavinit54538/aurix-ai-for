/**
 * Variable Payroll Inputs API Service.
 * Handles variable earnings, overtime, bonuses, incentives, commissions, reimbursements, LOP, and adjustments.
 *
 * Strictly integrated with `/openapi.json` endpoints:
 * - GET  /api/v2/payroll/variable-inputs
 * - POST /api/v2/payroll/variable-inputs
 * - POST /api/v2/payroll/variable-inputs/{id}/approve
 * - POST /api/v2/payroll/variable-inputs/{id}/reject
 * - POST /api/v2/payroll/variable-inputs/bulk-preview
 * - POST /api/v2/payroll/variable-inputs/bulk-apply
 * - POST /api/v1/payroll/overtime/calculate
 * - GET  /api/v1/payroll/overtime/settings
 * - GET  /api/v1/employees, GET /api/v2/payroll/pay-components, GET /api/v2/payroll/runs, GET /departments
 *
 * Zero fabricated amounts, timestamps, employee names, or hardcoded APPROVED statuses.
 */

import apiInstance from "@/api/apiInstance";
import { departmentsApi } from "@/services/departmentsApi";
import { formatINR } from "@/lib/format";
import { generateIdempotencyKey } from "../utils/idempotency";
import { formatPaiseToINR, toPaise } from "../utils/money";
import type {
  BulkVariableInputPreviewResult,
  VariableInputActor,
  VariableInputCategory,
  VariableInputStatus,
  VariableInputsListParams,
  VariableInputsListResult,
  VariableInputsSummaryMetrics,
  VariableInputType,
  VariableMasterComponent,
  VariableMasterEmployee,
  VariableMasterRun,
  VariablePayrollInput,
  VariableProcessingStatus,
} from "../types/variableInputs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RawRecord = Record<string, unknown>;

export interface CreateVariableInputPayload {
  employeeId: string;
  periodId: string;
  type: VariableInputType;
  amountPaise: number;
  units?: number;
  unitType?: string;
  ratePerUnitPaise?: number;
  description: string;
  reason?: string;
  salaryComponentId?: string;
  effectiveDate?: string;
  claimReference?: string;
  notes?: string;
  payrollMonth?: number;
  payrollYear?: number;
}

export interface CalculateOvertimeResult {
  amountPaise: number | null;
  ratePerUnitPaise: number | null;
  multiplier?: number | null;
  currency: string;
}

function isObject(val: unknown): val is RawRecord {
  return Boolean(val) && typeof val === "object" && !Array.isArray(val);
}

function isUuidLike(val: unknown): boolean {
  return typeof val === "string" && UUID_REGEX.test(val.trim());
}

function unwrapEnvelope<T = unknown>(raw: unknown): T {
  let curr: unknown = raw;
  for (let i = 0; i < 3; i++) {
    if (!isObject(curr)) break;
    if ("data" in curr && curr.data !== undefined && curr.data !== null) {
      if (isObject(curr.data) || Array.isArray(curr.data)) {
        if (
          isObject(curr.data) &&
          ("items" in curr.data || "entries" in curr.data || "rows" in curr.data)
        ) {
          return curr.data as T;
        }
        curr = curr.data;
        continue;
      }
    }
    break;
  }
  return curr as T;
}

function pickValue(obj: RawRecord | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null) return val;
  }
  return undefined;
}

function pickStr(obj: RawRecord | null | undefined, ...keys: string[]): string | undefined {
  if (!obj) return undefined;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed !== "") return trimmed;
    } else if (typeof val === "number" && Number.isFinite(val)) {
      return String(val);
    }
  }
  return undefined;
}

function pickNum(obj: RawRecord | null | undefined, ...keys: string[]): number | null {
  if (!obj) return null;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string" && val.trim() !== "") {
      const cleaned = val.replace(/[₹,\s]/g, "");
      const parsed = Number(cleaned);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function resolveMoneyToPaise(
  sources: Array<RawRecord | null | undefined>,
  paiseKeys: string[],
  rupeeKeys: string[]
): number | null {
  for (const src of sources) {
    const paise = pickNum(src, ...paiseKeys);
    if (paise !== null) return Math.round(paise);
  }
  for (const src of sources) {
    const rupees = pickNum(src, ...rupeeKeys);
    if (rupees !== null) return toPaise(rupees);
  }
  return null;
}

function formatOptionalPaise(paise: number | null | undefined): string {
  if (paise === null || paise === undefined || !Number.isFinite(paise)) return "—";
  return formatPaiseToINR(paise);
}

function normalizeInputType(rawType?: string): { type: VariableInputType; raw: string | null } {
  const raw = rawType?.trim() || null;
  if (!raw) return { type: "other", raw: null };
  const lower = raw.toLowerCase().replace(/[\s-]+/g, "_");
  switch (lower) {
    case "overtime":
    case "ot":
      return { type: "overtime", raw };
    case "bonus":
      return { type: "bonus", raw };
    case "incentive":
    case "incentives":
      return { type: "incentive", raw };
    case "commission":
    case "commissions":
      return { type: "commission", raw };
    case "reimbursement":
    case "reimbursements":
    case "expense_reimbursement":
      return { type: "reimbursement", raw };
    case "arrears":
      return { type: "arrears", raw };
    case "adjustment":
    case "payroll_adjustment":
      return { type: "adjustment", raw };
    case "additional_allowance":
    case "allowance":
      return { type: "additional_allowance", raw };
    case "additional_deduction":
      return { type: "additional_deduction", raw };
    case "deduction":
    case "deductions":
      return { type: "deduction", raw };
    case "advance_recovery":
    case "salary_advance":
    case "loan_recovery":
      return { type: "advance_recovery", raw };
    case "lop":
    case "lwp":
    case "loss_of_pay":
      return { type: "lop", raw };
    default:
      return { type: "other", raw };
  }
}

export function inferInputCategory(type: VariableInputType, rawCategory?: string): VariableInputCategory {
  if (rawCategory) {
    const lower = rawCategory.toLowerCase();
    if (lower === "earning" || lower === "deduction" || lower === "reimbursement") {
      return lower;
    }
  }
  if (type === "reimbursement") return "reimbursement";
  if (type === "deduction" || type === "additional_deduction" || type === "advance_recovery" || type === "lop") {
    return "deduction";
  }
  if (
    type === "overtime" ||
    type === "bonus" ||
    type === "incentive" ||
    type === "commission" ||
    type === "arrears" ||
    type === "additional_allowance"
  ) {
    return "earning";
  }
  return "other";
}

function normalizeStatus(rawStatus?: string): { status: VariableInputStatus; raw: string | null } {
  const raw = rawStatus?.trim() || null;
  if (!raw) return { status: "unknown", raw: null };
  const lower = raw.toLowerCase().replace(/[\s-]+/g, "_");
  switch (lower) {
    case "draft":
      return { status: "draft", raw };
    case "pending_approval":
    case "pending":
    case "submitted":
      return { status: "pending_approval", raw };
    case "approved":
      return { status: "approved", raw };
    case "rejected":
      return { status: "rejected", raw };
    case "processed":
      return { status: "processed", raw };
    case "consumed":
    case "applied":
      return { status: "consumed", raw };
    case "cancelled":
    case "canceled":
    case "voided":
      return { status: "cancelled", raw };
    default:
      return { status: "unknown", raw };
  }
}

function normalizeProcessingStatus(
  rawProcStatus: string | undefined,
  approvalStatus: VariableInputStatus,
  hasRunId: boolean
): { status: VariableProcessingStatus; raw: string | null } {
  const raw = rawProcStatus?.trim() || null;
  if (raw) {
    const lower = raw.toLowerCase().replace(/[\s-]+/g, "_");
    switch (lower) {
      case "processed":
      case "consumed":
        return { status: "processed", raw };
      case "finalized":
      case "locked":
        return { status: "finalized", raw };
      case "queued":
      case "pending":
        return { status: "queued", raw };
      case "excluded":
      case "skipped":
        return { status: "excluded", raw };
      case "not_processed":
      case "unprocessed":
        return { status: "not_processed", raw };
      default:
        return { status: "unknown", raw };
    }
  }
  if (approvalStatus === "processed" || approvalStatus === "consumed") {
    return { status: "processed", raw: approvalStatus };
  }
  if (approvalStatus === "rejected" || approvalStatus === "cancelled") {
    return { status: "excluded", raw: null };
  }
  if (approvalStatus === "approved") {
    return { status: hasRunId ? "processed" : "queued", raw: null };
  }
  if (approvalStatus === "pending_approval" || approvalStatus === "draft") {
    return { status: "not_processed", raw: null };
  }
  return { status: "unknown", raw: null };
}

function normalizeActor(raw: unknown, fallbackName?: string): VariableInputActor | null {
  if (isObject(raw)) {
    const name = pickStr(raw, "name", "fullName", "full_name", "email");
    const id = pickStr(raw, "id", "userId", "user_id") || "";
    if (!name && !id) return null;
    return {
      id,
      name: name || "—",
      email: pickStr(raw, "email"),
    };
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    return { id: "", name: raw.trim() };
  }
  if (fallbackName) {
    return { id: "", name: fallbackName };
  }
  return null;
}

export function normalizeVariableInputRecord(raw: unknown, idx = 0): VariablePayrollInput {
  const r = isObject(raw) ? raw : {};
  const empObj = isObject(r.employee) ? r.employee : null;
  const periodObj = isObject(r.period) ? r.period : isObject(r.payroll_period) ? r.payroll_period : null;
  const compObj = isObject(r.salary_component)
    ? r.salary_component
    : isObject(r.salaryComponent)
      ? r.salaryComponent
      : isObject(r.component)
        ? r.component
        : null;
  const runObj = isObject(r.payroll_run)
    ? r.payroll_run
    : isObject(r.payrollRun)
      ? r.payrollRun
      : null;

  const id = pickStr(r, "id", "inputId", "input_id", "variableInputId", "variable_input_id") || `vi-${idx + 1}`;
  const employeeId =
    pickStr(r, "employeeId", "employee_id") ||
    pickStr(empObj, "id", "employeeId", "employee_id") ||
    "";

  const codeCandidates = [
    pickStr(r, "employeeCode", "employee_code", "empCode", "emp_code"),
    pickStr(empObj, "employeeCode", "employee_code", "code"),
  ];
  const validCode = codeCandidates.find((c) => Boolean(c) && !isUuidLike(c));

  const firstLast = [
    pickStr(r, "firstName", "first_name") ?? pickStr(empObj, "firstName", "first_name"),
    pickStr(r, "lastName", "last_name") ?? pickStr(empObj, "lastName", "last_name"),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const employeeName =
    pickStr(r, "employeeName", "employee_name", "fullName", "full_name") ||
    pickStr(empObj, "fullName", "full_name", "name", "employeeName", "employee_name") ||
    firstLast ||
    "";

  const deptObj = isObject(r.department)
    ? r.department
    : isObject(empObj?.department)
      ? empObj.department
      : null;
  const department =
    pickStr(r, "departmentName", "department_name", "department") ||
    pickStr(deptObj, "name", "departmentName", "department_name") ||
    pickStr(empObj, "departmentName", "department_name", "department") ||
    "";

  const departmentId =
    pickStr(r, "departmentId", "department_id") ||
    pickStr(deptObj, "id") ||
    pickStr(empObj, "departmentId", "department_id");

  const { type, raw: typeRaw } = normalizeInputType(
    pickStr(r, "type", "inputType", "input_type")
  );
  const category = inferInputCategory(type, pickStr(r, "category", "inputCategory", "input_category"));

  const amountPaise = resolveMoneyToPaise(
    [r],
    ["amountPaise", "amount_paise", "totalAmountPaise", "total_amount_paise"],
    ["amount", "totalAmount", "total_amount", "approvedAmount", "approved_amount"]
  );

  const units = pickNum(r, "units", "quantity", "qty", "hours", "overtimeHours", "overtime_hours");
  const ratePerUnitPaise = resolveMoneyToPaise(
    [r],
    ["ratePerUnitPaise", "rate_per_unit_paise", "ratePaise", "rate_paise"],
    ["ratePerUnit", "rate_per_unit", "rate"]
  );

  const unitType = pickStr(r, "unitType", "unit_type", "unit") ?? null;

  const rawApprovalStatus = pickStr(r, "approvalStatus", "approval_status", "status");
  const { status, raw: statusRaw } = normalizeStatus(rawApprovalStatus);

  const payrollRunId =
    pickStr(r, "payrollRunId", "payroll_run_id", "runId", "run_id") ||
    pickStr(runObj, "id", "runId", "run_id") ||
    null;

  const { status: processingStatus, raw: processingStatusRaw } = normalizeProcessingStatus(
    pickStr(r, "processingStatus", "processing_status", "payrollProcessingStatus", "payroll_processing_status"),
    status,
    Boolean(payrollRunId)
  );

  const processedAmountPaise = resolveMoneyToPaise(
    [r],
    ["processedAmountPaise", "processed_amount_paise"],
    ["processedAmount", "processed_amount"]
  );

  const makerActor =
    normalizeActor(
      pickValue(r, "maker", "createdByUser", "created_by_user"),
      pickStr(r, "createdByName", "created_by_name", "createdBy", "created_by")
    ) || { id: "", name: "—" };

  const checkerActor = normalizeActor(
    pickValue(r, "checker", "approvedByUser", "approved_by_user"),
    pickStr(r, "approvedByName", "approved_by_name", "approvedBy", "approved_by")
  );

  const submittedActor = normalizeActor(
    pickValue(r, "submittedByUser", "submitted_by_user"),
    pickStr(r, "submittedByName", "submitted_by_name", "submittedBy", "submitted_by")
  );

  const rejectedActor = normalizeActor(
    pickValue(r, "rejectedByUser", "rejected_by_user"),
    pickStr(r, "rejectedByName", "rejected_by_name", "rejectedBy", "rejected_by")
  );

  const cancelledActor = normalizeActor(
    pickValue(r, "cancelledByUser", "cancelled_by_user"),
    pickStr(r, "cancelledByName", "cancelled_by_name", "cancelledBy", "cancelled_by")
  );

  return {
    id,
    referenceCode: pickStr(r, "referenceCode", "reference_code", "reference", "refCode", "ref_code") ?? null,
    employeeId,
    employeeCode: validCode || "",
    employeeName,
    profileImage:
      pickStr(r, "profileImage", "profile_image", "profilePhotoUrl", "profile_photo_url", "avatarUrl", "avatar_url") ||
      pickStr(empObj, "profileImage", "profile_image", "profilePhotoUrl", "profile_photo_url", "avatarUrl", "avatar_url"),
    department,
    departmentId,
    designation:
      pickStr(r, "designation", "designationName", "designation_name") ||
      pickStr(empObj, "designation", "jobTitle", "job_title"),
    employmentType:
      pickStr(r, "employmentType", "employment_type") ||
      pickStr(empObj, "employmentType", "employment_type"),
    periodId:
      pickStr(r, "periodId", "period_id", "payrollPeriodId", "payroll_period_id", "cycleId", "cycle_id") ||
      pickStr(periodObj, "id") ||
      "",
    periodName:
      pickStr(r, "periodName", "period_name", "payrollPeriodName", "payroll_period_name") ||
      pickStr(periodObj, "name", "periodName", "period_name") ||
      "",
    payrollMonth: pickNum(r, "payrollMonth", "payroll_month", "month") ?? pickNum(periodObj, "month", "period_month"),
    payrollYear: pickNum(r, "payrollYear", "payroll_year", "year") ?? pickNum(periodObj, "year", "period_year"),
    payrollRunId,
    payrollRunReference:
      pickStr(r, "payrollRunReference", "payroll_run_reference", "runNumber", "run_number", "processedPayrollRunReference", "processed_payroll_run_reference") ||
      pickStr(runObj, "runNumber", "run_number", "name") ||
      null,
    type,
    typeRaw,
    category,
    salaryComponentId:
      pickStr(r, "salaryComponentId", "salary_component_id", "componentId", "component_id") ||
      pickStr(compObj, "id") ||
      null,
    salaryComponentName:
      pickStr(r, "salaryComponentName", "salary_component_name", "componentName", "component_name") ||
      pickStr(compObj, "name", "componentName") ||
      null,
    description: pickStr(r, "description", "title", "reason") || "",
    reason: pickStr(r, "reason", "businessReason", "business_reason") ?? null,
    notes: pickStr(r, "notes", "remarks") ?? null,
    units,
    unitType,
    ratePerUnitPaise,
    ratePerUnitFormatted: formatOptionalPaise(ratePerUnitPaise),
    amountPaise,
    amountFormatted: formatOptionalPaise(amountPaise),
    currency: pickStr(r, "currency") || "INR",
    effectiveDate: pickStr(r, "effectiveDate", "effective_date", "effectiveFrom", "effective_from") ?? null,
    claimReference: pickStr(r, "claimReference", "claim_reference") ?? null,
    attachmentUrl: pickStr(r, "attachmentUrl", "attachment_url") ?? null,
    status,
    statusRaw,
    processingStatus,
    processingStatusRaw,
    processedAmountPaise,
    processedAmountFormatted: formatOptionalPaise(processedAmountPaise),
    processedAt: pickStr(r, "processedAt", "processed_at", "processingDate", "processing_date") ?? null,
    isPeriodLocked: Boolean(pickValue(r, "isPeriodLocked", "is_period_locked") ?? false),
    maker: makerActor,
    submittedBy: submittedActor,
    submittedAt: pickStr(r, "submittedAt", "submitted_at") ?? null,
    checker: checkerActor,
    approvedAt: pickStr(r, "approvedAt", "approved_at") ?? null,
    rejectedBy: rejectedActor,
    rejectedAt: pickStr(r, "rejectedAt", "rejected_at") ?? null,
    rejectionReason: pickStr(r, "rejectionReason", "rejection_reason") ?? null,
    cancelledBy: cancelledActor,
    cancelledAt: pickStr(r, "cancelledAt", "cancelled_at") ?? null,
    cancellationReason: pickStr(r, "cancellationReason", "cancellation_reason") ?? null,
    createdAt: pickStr(r, "createdAt", "created_at") || "",
    updatedAt: pickStr(r, "updatedAt", "updated_at") ?? null,
  };
}

function normalizeSummaryMetrics(container: RawRecord): VariableInputsSummaryMetrics | null {
  const s = isObject(container.summary)
    ? container.summary
    : isObject(container.totals)
      ? container.totals
      : null;
  if (!s) return null;

  const totalInputs = pickNum(s, "totalInputs", "total_inputs", "total");
  const totalApprovedAmountPaise = resolveMoneyToPaise(
    [s],
    ["totalApprovedAmountPaise", "total_approved_amount_paise"],
    ["totalApprovedAmount", "total_approved_amount"]
  );
  const pendingApprovalAmountPaise = resolveMoneyToPaise(
    [s],
    ["pendingApprovalAmountPaise", "pending_approval_amount_paise"],
    ["pendingApprovalAmount", "pending_approval_amount"]
  );
  const totalBonusAmountPaise = resolveMoneyToPaise(
    [s],
    ["totalBonusAmountPaise", "total_bonus_amount_paise"],
    ["totalBonusAmount", "total_bonus_amount"]
  );
  const totalIncentiveAmountPaise = resolveMoneyToPaise(
    [s],
    ["totalIncentiveAmountPaise", "total_incentive_amount_paise"],
    ["totalIncentiveAmount", "total_incentive_amount"]
  );
  const totalOvertimeAmountPaise = resolveMoneyToPaise(
    [s],
    ["totalOvertimeAmountPaise", "total_overtime_amount_paise"],
    ["totalOvertimeAmount", "total_overtime_amount"]
  );
  const totalReimbursementAmountPaise = resolveMoneyToPaise(
    [s],
    ["totalReimbursementAmountPaise", "total_reimbursement_amount_paise"],
    ["totalReimbursementAmount", "total_reimbursement_amount"]
  );
  const totalApprovedDeductionsPaise = resolveMoneyToPaise(
    [s],
    ["totalDeductionsAmountPaise", "total_deductions_amount_paise"],
    ["totalDeductionsAmount", "total_deductions_amount"]
  );

  if (
    totalInputs === null &&
    totalApprovedAmountPaise === null &&
    pendingApprovalAmountPaise === null &&
    totalBonusAmountPaise === null &&
    totalOvertimeAmountPaise === null
  ) {
    return null;
  }

  return {
    totalInputs,
    totalApprovedAmountPaise,
    totalApprovedEarningsPaise: resolveMoneyToPaise(
      [s],
      ["totalApprovedEarningsPaise", "total_approved_earnings_paise"],
      ["totalApprovedEarnings", "total_approved_earnings"]
    ),
    totalApprovedDeductionsPaise,
    pendingApprovalAmountPaise,
    totalBonusAmountPaise,
    totalIncentiveAmountPaise,
    totalOvertimeAmountPaise,
    totalReimbursementAmountPaise,
    processedCount: pickNum(s, "processedInputs", "processed_inputs", "processedCount", "processed_count"),
    rejectedCount: pickNum(s, "rejectedInputs", "rejected_inputs", "rejectedCount", "rejected_count"),
    pendingCount: pickNum(s, "pendingInputs", "pending_inputs", "pendingCount", "pending_count"),
    approvedCount: pickNum(s, "approvedInputs", "approved_inputs", "approvedCount", "approved_count"),
    source: "backend_summary",
  };
}

function normalizeEmployeeMaster(raw: unknown): VariableMasterEmployee | null {
  if (!isObject(raw)) return null;
  const id = pickStr(raw, "id", "employee_uuid") || "";
  if (!id) return null;
  const rawCode = pickStr(raw, "employee_code", "employeeCode", "employee_id", "employeeId", "code");
  const first = pickStr(raw, "first_name", "firstName") || "";
  const last = pickStr(raw, "last_name", "lastName") || "";
  const fullName =
    `${first} ${last}`.trim() ||
    pickStr(raw, "full_name", "fullName", "name", "employee_name", "employeeName") ||
    "";
  const deptObj = isObject(raw.department) ? raw.department : null;

  return {
    id,
    employeeCode: rawCode && !isUuidLike(rawCode) ? rawCode : "",
    fullName,
    departmentId: pickStr(raw, "department_id", "departmentId") || pickStr(deptObj, "id"),
    department:
      pickStr(raw, "department_name", "departmentName", "department") ||
      pickStr(deptObj, "name"),
    designation: pickStr(raw, "designation", "designation_name", "title", "job_title"),
    employmentType: pickStr(raw, "employment_type", "employmentType"),
    profileImage: pickStr(raw, "profile_photo_url", "avatar_url", "avatar", "profilePhotoUrl", "avatarUrl"),
  };
}

export function enrichVariableInputWithLookups(
  item: VariablePayrollInput,
  lookups?: {
    employeesById?: Map<string, VariableMasterEmployee>;
    departmentsById?: Map<string, string>;
    componentsById?: Map<string, VariableMasterComponent>;
    runsById?: Map<string, VariableMasterRun>;
    periodsById?: Map<string, { name: string; month?: number; year?: number }>;
  }
): VariablePayrollInput {
  if (!lookups) return item;
  const emp =
    lookups.employeesById?.get(item.employeeId) ||
    (item.employeeCode ? lookups.employeesById?.get(item.employeeCode) : undefined);

  const comp = item.salaryComponentId
    ? lookups.componentsById?.get(item.salaryComponentId)
    : undefined;
  const run = item.payrollRunId ? lookups.runsById?.get(item.payrollRunId) : undefined;
  const period = item.periodId ? lookups.periodsById?.get(item.periodId) : undefined;
  const deptById =
    item.departmentId
      ? lookups.departmentsById?.get(item.departmentId)
      : emp?.departmentId
        ? lookups.departmentsById?.get(emp.departmentId)
        : undefined;

  return {
    ...item,
    employeeName: item.employeeName || emp?.fullName || "",
    employeeCode:
      item.employeeCode || (!isUuidLike(emp?.employeeCode) ? emp?.employeeCode : "") || "",
    department: item.department || emp?.department || deptById || "",
    designation: item.designation || emp?.designation,
    employmentType: item.employmentType || emp?.employmentType,
    profileImage: item.profileImage || emp?.profileImage,
    salaryComponentName: item.salaryComponentName || comp?.name || null,
    payrollRunReference: item.payrollRunReference || run?.label || null,
    periodName: item.periodName || period?.name || "",
    payrollMonth: item.payrollMonth ?? period?.month ?? null,
    payrollYear: item.payrollYear ?? period?.year ?? null,
  };
}

function normalizeBulkPreview(raw: unknown): BulkVariableInputPreviewResult {
  const d = isObject(raw) ? raw : {};
  const totalAmountPaise =
    resolveMoneyToPaise(
      [d],
      ["totalAmountPaise", "total_amount_paise"],
      ["totalAmount", "total_amount"]
    ) ?? 0;
  const rawErrors = pickValue(d, "errors");
  const errors = Array.isArray(rawErrors)
    ? rawErrors.map((err, i) => {
        const e = isObject(err) ? err : {};
        return {
          rowNumber: pickNum(e, "rowNumber", "row_number") ?? i + 1,
          employeeCode: pickStr(e, "employeeCode", "employee_code") || "—",
          inputType: pickStr(e, "inputType", "input_type", "type") || "—",
          errorCode: pickStr(e, "errorCode", "error_code") || "VALIDATION_ERROR",
          errorMessage: pickStr(e, "errorMessage", "error_message", "message") || "Invalid row",
        };
      })
    : [];

  return {
    previewToken: pickStr(d, "previewToken", "preview_token", "token") || "",
    fileName: pickStr(d, "fileName", "file_name") || "bulk-variable-inputs.csv",
    totalRows: pickNum(d, "totalRows", "total_rows") ?? 0,
    validRows: pickNum(d, "validRows", "valid_rows") ?? 0,
    invalidRows: pickNum(d, "invalidRows", "invalid_rows") ?? errors.length,
    duplicateRows: pickNum(d, "duplicateRows", "duplicate_rows") ?? 0,
    totalAmountPaise,
    totalAmountFormatted:
      pickStr(d, "totalAmountFormatted", "total_amount_formatted") || formatINR(totalAmountPaise / 100),
    errors,
  };
}

export const variableInputsApi = {
  async getVariableInputs(params?: VariableInputsListParams): Promise<VariableInputsListResult> {
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
          cleanParams[k] = v;
        }
      }
    }

    const res = await apiInstance.get("/api/v2/payroll/variable-inputs", {
      params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
      headers: NO_STORE_HEADERS,
    });

    const unwrapped = unwrapEnvelope<unknown>(res.data);
    let rawItems: unknown[] = [];
    let container: RawRecord = {};

    if (Array.isArray(unwrapped)) {
      rawItems = unwrapped;
    } else if (isObject(unwrapped)) {
      container = unwrapped;
      const listCandidate =
        unwrapped.items ??
        unwrapped.rows ??
        unwrapped.records ??
        unwrapped.inputs ??
        unwrapped.variableInputs ??
        unwrapped.variable_inputs;
      if (Array.isArray(listCandidate)) {
        rawItems = listCandidate;
      }
    }

    const items = rawItems.map((item, idx) => normalizeVariableInputRecord(item, idx));
    const total =
      pickNum(container, "total", "totalRecords", "total_records", "count") ?? items.length;
    const page = pickNum(container, "page") ?? params?.page ?? 1;
    const limit = pickNum(container, "limit", "page_size") ?? params?.limit ?? 20;
    const summary = normalizeSummaryMetrics(container);

    return {
      items,
      total,
      page,
      limit,
      summary,
    };
  },

  async createVariableInput(payload: CreateVariableInputPayload): Promise<VariablePayrollInput> {
    const res = await apiInstance.post("/api/v2/payroll/variable-inputs", payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        ...NO_STORE_HEADERS,
      },
    });
    return normalizeVariableInputRecord(unwrapEnvelope<unknown>(res.data));
  },

  async approveVariableInput(id: string, remarks?: string): Promise<VariablePayrollInput> {
    const res = await apiInstance.post(
      `/api/v2/payroll/variable-inputs/${id}/approve`,
      { remarks },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    return normalizeVariableInputRecord(unwrapEnvelope<unknown>(res.data));
  },

  async rejectVariableInput(id: string, reason: string): Promise<VariablePayrollInput> {
    const res = await apiInstance.post(
      `/api/v2/payroll/variable-inputs/${id}/reject`,
      { reason },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    return normalizeVariableInputRecord(unwrapEnvelope<unknown>(res.data));
  },

  async calculateOvertime(payload: {
    employeeId: string;
    hours: number;
    periodId?: string;
    date?: string;
  }): Promise<CalculateOvertimeResult> {
    const res = await apiInstance.post(
      "/api/v1/payroll/overtime/calculate",
      {
        employee_id: payload.employeeId,
        employeeId: payload.employeeId,
        hours: payload.hours,
        period_id: payload.periodId,
        date: payload.date,
      },
      { headers: NO_STORE_HEADERS }
    );
    const d = unwrapEnvelope<unknown>(res.data);
    const obj = isObject(d) ? d : {};
    const amountPaise = resolveMoneyToPaise(
      [obj],
      ["amountPaise", "amount_paise", "totalAmountPaise", "total_amount_paise"],
      ["amount", "totalAmount", "total_amount", "overtimeAmount", "overtime_amount"]
    );
    const ratePerUnitPaise = resolveMoneyToPaise(
      [obj],
      ["ratePaise", "rate_paise", "hourlyRatePaise", "hourly_rate_paise"],
      ["rate", "hourlyRate", "hourly_rate"]
    );
    return {
      amountPaise,
      ratePerUnitPaise,
      multiplier: pickNum(obj, "multiplier", "overtimeMultiplier", "overtime_multiplier"),
      currency: pickStr(obj, "currency") || "INR",
    };
  },

  async getMasterMetadata(): Promise<{
    employees: VariableMasterEmployee[];
    employeesById: Map<string, VariableMasterEmployee>;
    departments: string[];
    departmentsById: Map<string, string>;
    components: VariableMasterComponent[];
    componentsById: Map<string, VariableMasterComponent>;
    runs: VariableMasterRun[];
    runsById: Map<string, VariableMasterRun>;
  }> {
    const [empRes, deptRes, compRes, runsRes] = await Promise.allSettled([
      apiInstance.get("/api/v1/employees", {
        params: { page: 1, limit: 500 },
        headers: NO_STORE_HEADERS,
      }),
      departmentsApi.getDepartments({ limit: 200 }),
      apiInstance.get("/api/v2/payroll/pay-components", { headers: NO_STORE_HEADERS }),
      apiInstance.get("/api/v2/payroll/runs", { headers: NO_STORE_HEADERS }),
    ]);

    const employeesById = new Map<string, VariableMasterEmployee>();
    const employees: VariableMasterEmployee[] = [];
    if (empRes.status === "fulfilled") {
      const raw = unwrapEnvelope<unknown>(empRes.value.data);
      const list = Array.isArray(raw)
        ? raw
        : isObject(raw) && Array.isArray(raw.items)
          ? raw.items
          : [];
      for (const item of list) {
        const mapped = normalizeEmployeeMaster(item);
        if (mapped) {
          employees.push(mapped);
          employeesById.set(mapped.id, mapped);
          if (mapped.employeeCode) employeesById.set(mapped.employeeCode, mapped);
        }
      }
    }

    const departmentsById = new Map<string, string>();
    const deptSet = new Set<string>();
    if (deptRes.status === "fulfilled") {
      for (const d of deptRes.value.items) {
        if (d.id && d.name) departmentsById.set(d.id, d.name);
        if (d.name) deptSet.add(d.name);
      }
    }
    for (const e of employees) {
      if (e.department) deptSet.add(e.department);
    }

    const componentsById = new Map<string, VariableMasterComponent>();
    const components: VariableMasterComponent[] = [];
    if (compRes.status === "fulfilled") {
      const raw = unwrapEnvelope<unknown>(compRes.value.data);
      const list = Array.isArray(raw)
        ? raw
        : isObject(raw) && Array.isArray(raw.items)
          ? raw.items
          : [];
      for (const item of list) {
        if (!isObject(item)) continue;
        const id = pickStr(item, "id", "componentId", "component_id") || "";
        const name = pickStr(item, "name", "componentName", "component_name") || "";
        if (!id || !name) continue;
        const typeStr = (pickStr(item, "type") || "earning").toLowerCase();
        const type =
          typeStr === "deduction"
            ? "deduction"
            : typeStr === "employer_contribution"
              ? "employer_contribution"
              : "earning";
        const entry: VariableMasterComponent = {
          id,
          code: pickStr(item, "code") || "COMP",
          name,
          type,
        };
        components.push(entry);
        componentsById.set(id, entry);
      }
    }

    const runsById = new Map<string, VariableMasterRun>();
    const runs: VariableMasterRun[] = [];
    if (runsRes.status === "fulfilled") {
      const raw = unwrapEnvelope<unknown>(runsRes.value.data);
      const list = Array.isArray(raw)
        ? raw
        : isObject(raw) && Array.isArray(raw.items)
          ? raw.items
          : [];
      for (const item of list) {
        if (!isObject(item)) continue;
        const id = pickStr(item, "id", "runId", "run_id") || "";
        if (!id) continue;
        const label =
          pickStr(item, "runNumber", "run_number", "periodName", "period_name", "name") || id;
        const runEntry: VariableMasterRun = {
          id,
          label,
          periodId: pickStr(item, "periodId", "period_id"),
          status: pickStr(item, "status"),
        };
        runs.push(runEntry);
        runsById.set(id, runEntry);
      }
    }

    return {
      employees,
      employeesById,
      departments: Array.from(deptSet).sort((a, b) => a.localeCompare(b)),
      departmentsById,
      components,
      componentsById,
      runs,
      runsById,
    };
  },

  async previewBulkVariableInputs(file: File): Promise<BulkVariableInputPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/api/v2/payroll/variable-inputs/bulk-preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...NO_STORE_HEADERS,
      },
    });
    return normalizeBulkPreview(unwrapEnvelope<unknown>(res.data));
  },

  async applyBulkVariableInputs(
    previewToken: string
  ): Promise<{ appliedCount: number; message: string }> {
    const res = await apiInstance.post(
      "/api/v2/payroll/variable-inputs/bulk-apply",
      { previewToken },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    const d = unwrapEnvelope<unknown>(res.data);
    const obj = isObject(d) ? d : {};
    return {
      appliedCount: pickNum(obj, "appliedCount", "applied_count") ?? 0,
      message: pickStr(obj, "message") || "Bulk variable inputs applied",
    };
  },
};
