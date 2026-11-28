/**
 * Payment & Disbursement API Service.
 * Normalizes authoritative backend FastAPI snake_case/camelCase responses into strict typed domain objects.
 *
 * Rules:
 * - Never fabricate payment batches, balances, statuses, or fake successful responses.
 * - Enforce Idempotency-Key on mutations and Cache-Control: no-store on financial endpoints.
 * - Reject masked ciphertext strings or missing fields cleanly with explicit "—" placeholders in UI.
 */

import apiInstance from "@/api/apiInstance";
import { formatPaise as formatInrPaise } from "@/lib/format";
import { getDownloadFilename, parseContentType } from "@/services/payroll/utils";

function formatPaise(paise: number, opts?: { currency?: string } | string): string {
  const currency = typeof opts === "string" ? opts : opts?.currency || "INR";
  if (!currency || currency.toUpperCase() === "INR") {
    return formatInrPaise(paise);
  }
  return `${currency.toUpperCase()} ${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
import { generateIdempotencyKey } from "../utils/idempotency";
import type {
  BankFileFormat,
  BankFileMetadata,
  BankResponsePreviewResult,
  BankValidationIssue,
  CompanyBankAccount,
  EligiblePayrollRun,
  PaymentAuditLogEntry,
  PaymentBatch,
  PaymentBatchItem,
  PaymentBatchStatus,
  PaymentDashboardSummary,
  PaymentMode,
  PaymentReconciliation,
  PaymentStatus,
  PaymentUserRef,
  SupportedPaymentMode,
} from "../types/payment";

export interface CreatePaymentBatchPayload {
  runId?: string;
  sourceAccountId: string;
  paymentMode: PaymentMode;
  heldEmployeeIds?: Array<{ employeeId: string; reason: string }>;
  paymentDate?: string;
  notes?: string;
}

export interface UpdatePaymentBatchPayload {
  sourceAccountId?: string;
  paymentMode?: PaymentMode;
  paymentDate?: string;
  notes?: string;
}

export interface ApprovePaymentBatchPayload {
  remarks?: string;
}

export interface RejectPaymentBatchPayload {
  reason: string;
}

export interface GenerateBankFilePayload {
  format: BankFileFormat;
}

export interface SubmitPaymentBatchPayload {
  bankReferenceNumber: string;
  submissionDate: string;
  notes?: string;
}

export interface ApplyBankResponsePayload {
  previewToken: string;
  allowPartial?: boolean;
}

export interface RecordPaymentResultRow {
  itemId?: string;
  employeeId?: string;
  status: "PAID" | "FAILED";
  transactionRef?: string;
  utrNumber?: string;
  paymentDate?: string;
  failureCode?: string;
  errorMessage?: string;
  remarks?: string;
}

export interface RecordPaymentResultsPayload {
  results: RecordPaymentResultRow[];
  allowPartial?: boolean;
}

export interface RecordPaymentResultsResponse {
  batchId: string;
  status: PaymentBatchStatus;
  message: string;
  updatedCount: number;
  paidCount: number;
  failedCount: number;
  pendingCount: number;
  paidAmountPaise: number;
  failedAmountPaise: number;
  outstandingAmountPaise: number;
}

export interface HoldPaymentItemPayload {
  reason: string;
}

export interface ReleasePaymentItemPayload {
  remarks?: string;
}

export interface RetryPaymentItemPayload {
  updatedBankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  reason: string;
}

export interface RetryFailedBatchPayload {
  reason: string;
  paymentMode?: PaymentMode;
  sourceAccountId?: string;
}

export interface GetPaymentBatchesParams {
  page?: number;
  limit?: number;
  status?: string;
  periodId?: string;
  paymentMode?: string;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface GetPaymentBatchDetailResponse {
  batch: PaymentBatch;
  items: PaymentBatchItem[];
  totalItems: number;
  page: number;
  limit: number;
  validationSummary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    blockingCount: number;
  };
}

export interface BankValidationResponse {
  batchId: string;
  batchStatus?: PaymentBatchStatus;
  status: "validated" | "validation_failed";
  totalItems?: number;
  totalChecked: number;
  passedCount: number;
  errorCount: number;
  warningCount: number;
  blockingCount?: number;
  hasBlockingErrors: boolean;
  issues: BankValidationIssue[];
}

// ---------------------------------------------------------------------------
// Response Normalizers
// ---------------------------------------------------------------------------

type RawRecord = Record<string, unknown>;

function pick<T = unknown>(obj: RawRecord | undefined | null, ...keys: string[]): T | undefined {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key] as T;
    }
  }
  return undefined;
}

function asStr(val: unknown, fallback = ""): string {
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  return fallback;
}

function asNullableStr(val: unknown): string | null {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed ? trimmed : null;
  }
  return null;
}

function asInt(val: unknown, fallback = 0): number {
  if (typeof val === "number" && Number.isFinite(val)) return Math.round(val);
  if (typeof val === "string" && val.trim() !== "") {
    const parsed = Number(val);
    if (Number.isFinite(parsed)) return Math.round(parsed);
  }
  return fallback;
}

function asOptionalInt(val: unknown): number | null {
  if (typeof val === "number" && Number.isFinite(val)) return Math.round(val);
  if (typeof val === "string" && val.trim() !== "") {
    const parsed = Number(val);
    if (Number.isFinite(parsed)) return Math.round(parsed);
  }
  return null;
}

function asNum(val: unknown, fallback = 0): number {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string" && val.trim() !== "") {
    const parsed = Number(val);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function normalizeBatchStatus(raw: unknown): PaymentBatchStatus {
  const clean = asStr(raw, "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const known: Record<string, PaymentBatchStatus> = {
    draft: "draft",
    validating: "validating",
    validation_failed: "validation_failed",
    validated: "validated",
    pending_approval: "pending_approval",
    approved: "approved",
    rejected: "rejected",
    file_generated: "file_generated",
    submitted: "submitted",
    processing: "processing",
    partial: "partial",
    partially_paid: "partial",
    paid: "paid",
    failed: "failed",
    reconciled: "reconciled",
    cancelled: "cancelled",
    canceled: "cancelled",
    closed: "closed",
  };
  return known[clean] ?? "draft";
}

export function normalizeItemStatus(raw: unknown): PaymentStatus {
  const clean = asStr(raw, "pending").trim().toLowerCase();
  const known: Record<string, PaymentStatus> = {
    pending: "pending",
    processing: "processing",
    paid: "paid",
    success: "paid",
    completed: "paid",
    failed: "failed",
    failure: "failed",
    rejected: "failed",
    returned: "failed",
    held: "held",
    released: "released",
    retried: "retried",
    reversed: "reversed",
  };
  return known[clean] ?? "pending";
}

function normalizePaymentMode(raw: unknown): PaymentMode {
  const clean = asStr(raw, "NEFT").trim().toUpperCase();
  if (clean === "RTGS" || clean === "IMPS" || clean === "UPI") return clean;
  return "NEFT";
}

function normalizeUserRef(
  raw: unknown,
  fallbackName?: unknown,
  fallbackEmail?: unknown
): PaymentUserRef | null {
  if (!raw && !fallbackName) return null;
  if (typeof raw === "object" && raw !== null) {
    const r = raw as RawRecord;
    const id = asStr(pick(r, "id"));
    const name = asStr(pick(r, "name", "full_name", "fullName"), asStr(fallbackName, "Payroll User"));
    const email = asStr(pick(r, "email"), asStr(fallbackEmail, ""));
    if (!id && !name) return null;
    return { id, name, email };
  }
  const idStr = asNullableStr(raw);
  const nameStr = asNullableStr(fallbackName);
  if (!idStr && !nameStr) return null;
  return {
    id: idStr || "",
    name: nameStr || "Payroll User",
    email: asStr(fallbackEmail, ""),
  };
}

export function normalizeCompanyBankAccount(raw: unknown): CompanyBankAccount {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const rawType = asStr(pick(r, "accountType", "account_type"), "current").toLowerCase();
  const accountType: CompanyBankAccount["accountType"] =
    rawType === "salary" || rawType === "escrow" ? rawType : "current";
  const modesRaw = pick<unknown[]>(r, "supportedPaymentModes", "supported_payment_modes");
  const supportedPaymentModes: PaymentMode[] = Array.isArray(modesRaw) && modesRaw.length > 0
    ? modesRaw.map(normalizePaymentMode)
    : ["NEFT", "RTGS", "IMPS"];
  return {
    id: asStr(pick(r, "id")),
    companyId: asStr(pick(r, "companyId", "company_id")),
    bankName: asStr(pick(r, "bankName", "bank_name"), "—"),
    accountHolderName: asStr(pick(r, "accountHolderName", "account_holder_name"), "—"),
    accountNumberMasked: asStr(pick(r, "accountNumberMasked", "account_number_masked"), "••••"),
    accountType,
    ifscCode: asStr(pick(r, "ifscCode", "ifsc_code"), "—"),
    branchName: asNullableStr(pick(r, "branchName", "branch_name")) || undefined,
    currency: asStr(pick(r, "currency"), "INR"),
    isPrimary: Boolean(pick(r, "isPrimary", "is_primary")),
    isActive: pick(r, "isActive", "is_active") !== false,
    supportedPaymentModes,
  };
}

export function normalizeBankFileMetadata(raw: unknown): BankFileMetadata {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const genBy = normalizeUserRef(pick(r, "generatedBy", "generated_by"));
  return {
    id: asStr(pick(r, "id")),
    batchId: asStr(pick(r, "batchId", "batch_id")),
    fileName: asStr(pick(r, "fileName", "file_name"), "bank-payment-file.csv"),
    format: asStr(pick(r, "format", "fileFormat", "file_format"), "GENERIC_NEFT_RTGS_CSV"),
    fileSizeBytes: asInt(pick(r, "fileSizeBytes", "file_size_bytes"), 0),
    sha256Checksum: asStr(pick(r, "sha256Checksum", "sha256_checksum")),
    generatedBy: {
      id: genBy?.id || "",
      name: genBy?.name || "System",
    },
    generatedAt: asNullableStr(pick(r, "generatedAt", "generated_at")),
    status: asNullableStr(pick(r, "status")) || undefined,
    downloadUrl: asNullableStr(pick(r, "downloadUrl", "download_url")) || undefined,
  };
}

export function normalizePaymentBatchItem(raw: unknown): PaymentBatchItem {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const currency = asStr(pick(r, "currency"), "INR");
  const amtPaise = asInt(pick(r, "netAmountPaise", "net_amount_paise", "amountPaise", "amount_paise"), 0);
  const netSalaryPaise = asOptionalInt(pick(r, "netSalaryPaise", "net_salary_paise"));
  const payablePaise = asOptionalInt(pick(r, "payableAmountPaise", "payable_amount_paise"));
  const paidPaise = asOptionalInt(pick(r, "paidAmountPaise", "paid_amount_paise"));
  const status = normalizeItemStatus(pick(r, "status"));
  const isHeld = pick(r, "isHeld", "is_held") !== undefined ? Boolean(pick(r, "isHeld", "is_held")) : status === "held";
  const rawMode = asNullableStr(pick(r, "paymentMode", "payment_mode"));
  const maskedAcc = asNullableStr(pick(r, "accountNumberMasked", "account_number_masked"));

  return {
    id: asStr(pick(r, "id")),
    batchId: asStr(pick(r, "batchId", "batch_id")),
    employeeId: asStr(pick(r, "employeeId", "employee_id")),
    employeeCode: asStr(pick(r, "employeeCode", "employee_code"), "—"),
    employeeName: asStr(pick(r, "employeeName", "employee_name", "accountHolderName", "account_holder_name"), "—"),
    department: asNullableStr(pick(r, "department")),
    designation: asNullableStr(pick(r, "designation")),
    bankName: asStr(pick(r, "bankName", "bank_name"), "—"),
    paymentMode: rawMode ? normalizePaymentMode(rawMode) : undefined,
    accountNumberMasked: maskedAcc && !maskedAcc.startsWith("ofc360:v1:") ? maskedAcc : "—",
    ifscCode: asStr(pick(r, "ifscCode", "ifsc_code"), "—"),
    accountHolderName: asNullableStr(pick(r, "accountHolderName", "account_holder_name")),
    netAmountPaise: amtPaise,
    netAmountFormatted: asStr(
      pick(r, "netAmountFormatted", "net_amount_formatted"),
      formatPaise(amtPaise, { currency })
    ),
    netSalaryPaise: netSalaryPaise ?? undefined,
    netSalaryFormatted:
      asNullableStr(pick(r, "netSalaryFormatted", "net_salary_formatted")) ||
      (netSalaryPaise !== null ? formatPaise(netSalaryPaise, { currency }) : undefined),
    payableAmountPaise: payablePaise ?? undefined,
    payableAmountFormatted:
      asNullableStr(pick(r, "payableAmountFormatted", "payable_amount_formatted")) ||
      (payablePaise !== null ? formatPaise(payablePaise, { currency }) : undefined),
    paidAmountPaise: paidPaise ?? undefined,
    paidAmountFormatted:
      asNullableStr(pick(r, "paidAmountFormatted", "paid_amount_formatted")) ||
      (paidPaise !== null ? formatPaise(paidPaise, { currency }) : undefined),
    status,
    isHeld,
    holdReason: asNullableStr(pick(r, "holdReason", "hold_reason")),
    heldBy: asNullableStr(pick(r, "heldBy", "held_by")),
    heldAt: asNullableStr(pick(r, "heldAt", "held_at")),
    utr: asNullableStr(pick(r, "utr", "utrNumber", "utr_number")),
    creditedDate: asNullableStr(pick(r, "creditedDate", "credited_date", "paymentDate", "payment_date")),
    paymentDate: asNullableStr(pick(r, "paymentDate", "payment_date")),
    reconciledAt: asNullableStr(pick(r, "reconciledAt", "reconciled_at")),
    reconciliationStatus: asNullableStr(pick(r, "reconciliationStatus", "reconciliation_status")) || undefined,
    failureReason: asNullableStr(pick(r, "failureReason", "failure_reason", "errorMessage", "error_message")),
    failureCode: asNullableStr(pick(r, "failureCode", "failure_code")),
    paymentReference: asStr(
      pick(r, "paymentReference", "payment_reference", "transactionRef", "transaction_ref", "utrNumber", "utr_number"),
      ""
    ),
    transactionRef: asNullableStr(pick(r, "transactionRef", "transaction_ref")),
    repayoutBatchId: asNullableStr(pick(r, "repayoutBatchId", "repayout_batch_id")),
    remarks: asNullableStr(pick(r, "remarks")),
    retryCount: asInt(pick(r, "retryCount", "retry_count"), 0),
    retryReason: asNullableStr(pick(r, "retryReason", "retry_reason")),
    lastRetryAt: asNullableStr(pick(r, "lastRetryAt", "last_retry_at")),
    createdAt: asNullableStr(pick(r, "createdAt", "created_at")),
    updatedAt: asNullableStr(pick(r, "updatedAt", "updated_at")),
  };
}

export function normalizePaymentBatch(raw: unknown): PaymentBatch {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const currency = asStr(pick(r, "currency"), "INR");
  const payablePaise = asInt(
    pick(r, "payableAmountPaise", "payable_amount_paise", "netAmountPaise", "net_amount_paise", "totalAmountPaise", "total_amount_paise"),
    0
  );
  const grossPaise = asInt(pick(r, "grossAmountPaise", "gross_amount_paise"), payablePaise);
  const heldPaise = asInt(pick(r, "heldAmountPaise", "held_amount_paise"), 0);
  const paidPaise = asOptionalInt(pick(r, "paidAmountPaise", "paid_amount_paise"));
  const failedPaise = asOptionalInt(pick(r, "failedAmountPaise", "failed_amount_paise"));
  const pendingPaise = asOptionalInt(pick(r, "pendingAmountPaise", "pending_amount_paise"));
  const outstandingPaise = asOptionalInt(pick(r, "outstandingAmountPaise", "outstanding_amount_paise"));
  const netPaise = asInt(pick(r, "netAmountPaise", "net_amount_paise"), payablePaise);

  const rawEmpCount = pick(r, "employeeCount", "employee_count", "totalEmployees", "total_employees", "totalRecords", "total_records");
  const employeeCount = asOptionalInt(rawEmpCount);

  const periodDetails = pick<RawRecord>(r, "payrollPeriodDetails", "payroll_period_details");
  const periodName = asStr(
    pick(r, "periodName", "period_name", "payrollPeriod", "payroll_period") ?? pick(periodDetails, "label"),
    "—"
  );

  const srcAccRaw = pick(r, "sourceAccount", "source_account");
  const latestBfRaw = pick(r, "latestBankFile", "latest_bank_file");
  const bankSplitRaw = pick<unknown[]>(r, "bankSplitSummary", "bank_split_summary");
  const bankSplitSummary = Array.isArray(bankSplitRaw)
    ? bankSplitRaw.map((entry) => {
        const sp = (entry && typeof entry === "object" ? entry : {}) as RawRecord;
        const amt = asInt(pick(sp, "amountPaise", "amount_paise"), 0);
        return {
          bankName: asStr(pick(sp, "bankName", "bank_name"), "Other"),
          count: asInt(pick(sp, "count"), 0),
          amountPaise: amt,
          amountFormatted: asStr(pick(sp, "amountFormatted", "amount_formatted"), formatPaise(amt, { currency })),
        };
      })
    : undefined;

  return {
    id: asStr(pick(r, "id")),
    companyId: asNullableStr(pick(r, "companyId", "company_id")),
    companyName: asNullableStr(pick(r, "companyName", "company_name")),
    timezone: asNullableStr(pick(r, "timezone")) || undefined,
    batchNumber: asStr(pick(r, "batchNumber", "batch_number"), "—"),
    runId: asStr(pick(r, "runId", "run_id"), ""),
    runNumber: asNullableStr(pick(r, "runNumber", "run_number", "payrollRunNumber", "payroll_run_number")),
    periodId: asStr(pick(r, "periodId", "period_id"), ""),
    periodName,
    periodMonth: asOptionalInt(pick(r, "periodMonth", "period_month") ?? pick(periodDetails, "month")),
    periodYear: asOptionalInt(pick(r, "periodYear", "period_year") ?? pick(periodDetails, "year")),
    sourceAccountId: asStr(pick(r, "sourceAccountId", "source_account_id"), ""),
    sourceAccount: srcAccRaw ? normalizeCompanyBankAccount(srcAccRaw) : undefined,
    paymentMode: normalizePaymentMode(pick(r, "paymentMode", "payment_mode")),
    currency,
    status: normalizeBatchStatus(pick(r, "status")),
    employeeCount,
    totalItemsCount: asOptionalInt(pick(r, "totalItemsCount", "total_items_count")) ?? undefined,
    heldCount: asOptionalInt(pick(r, "heldCount", "held_count")) ?? undefined,
    paidCount: asOptionalInt(pick(r, "paidCount", "paid_count")) ?? undefined,
    failedCount: asOptionalInt(pick(r, "failedCount", "failed_count")) ?? undefined,
    pendingCount: asOptionalInt(pick(r, "pendingCount", "pending_count")) ?? undefined,
    grossAmountPaise: grossPaise,
    netAmountPaise: netPaise,
    heldAmountPaise: heldPaise,
    payableAmountPaise: payablePaise,
    paidAmountPaise: paidPaise ?? undefined,
    failedAmountPaise: failedPaise ?? undefined,
    pendingAmountPaise: pendingPaise ?? undefined,
    outstandingAmountPaise: outstandingPaise ?? undefined,
    grossAmountFormatted: asStr(
      pick(r, "grossAmountFormatted", "gross_amount_formatted"),
      formatPaise(grossPaise, { currency })
    ),
    netAmountFormatted: asStr(
      pick(r, "netAmountFormatted", "net_amount_formatted"),
      formatPaise(netPaise, { currency })
    ),
    heldAmountFormatted: asStr(
      pick(r, "heldAmountFormatted", "held_amount_formatted"),
      formatPaise(heldPaise, { currency })
    ),
    payableAmountFormatted: asStr(
      pick(r, "payableAmountFormatted", "payable_amount_formatted"),
      formatPaise(payablePaise, { currency })
    ),
    paidAmountFormatted:
      asNullableStr(pick(r, "paidAmountFormatted", "paid_amount_formatted")) ||
      (paidPaise !== null ? formatPaise(paidPaise, { currency }) : undefined),
    failedAmountFormatted:
      asNullableStr(pick(r, "failedAmountFormatted", "failed_amount_formatted")) ||
      (failedPaise !== null ? formatPaise(failedPaise, { currency }) : undefined),
    pendingAmountFormatted:
      asNullableStr(pick(r, "pendingAmountFormatted", "pending_amount_formatted")) ||
      (pendingPaise !== null ? formatPaise(pendingPaise, { currency }) : undefined),
    outstandingAmountFormatted:
      asNullableStr(pick(r, "outstandingAmountFormatted", "outstanding_amount_formatted")) ||
      (outstandingPaise !== null ? formatPaise(outstandingPaise, { currency }) : undefined),
    bankSplitSummary,
    bankReferenceNumber: asNullableStr(pick(r, "bankReferenceNumber", "bank_reference_number")),
    submissionDate: asNullableStr(pick(r, "submissionDate", "submission_date")),
    notes: asNullableStr(pick(r, "notes")),
    createdBy: normalizeUserRef(pick(r, "createdBy", "created_by")),
    createdAt: asStr(pick(r, "createdAt", "created_at"), ""),
    updatedAt: asNullableStr(pick(r, "updatedAt", "updated_at")),
    approvedBy: normalizeUserRef(
      pick(r, "approvedByUser", "approved_by_user", "approvedBy", "approved_by"),
      pick(r, "approvedByName", "approved_by_name")
    ),
    approvedAt: asNullableStr(pick(r, "approvedAt", "approved_at")),
    approvalRemarks: asNullableStr(pick(r, "approvalRemarks", "approval_remarks", "remarks")),
    submittedBy: normalizeUserRef(
      pick(r, "submittedByUser", "submitted_by_user", "submittedBy", "submitted_by"),
      pick(r, "submittedByName", "submitted_by_name")
    ),
    submittedAt: asNullableStr(pick(r, "submittedAt", "submitted_at")),
    rejectedBy: normalizeUserRef(
      pick(r, "rejectedByUser", "rejected_by_user", "rejectedBy", "rejected_by"),
      pick(r, "rejectedByName", "rejected_by_name")
    ),
    rejectedAt: asNullableStr(pick(r, "rejectedAt", "rejected_at")),
    rejectionReason: asNullableStr(pick(r, "rejectionReason", "rejection_reason")),
    bankFileId: asNullableStr(pick(r, "bankFileId", "bank_file_id")),
    latestBankFile: latestBfRaw ? normalizeBankFileMetadata(latestBfRaw) : null,
    retryOfBatchId: asNullableStr(pick(r, "retryOfBatchId", "retry_of_batch_id")),
    reconciledAt: asNullableStr(pick(r, "reconciledAt", "reconciled_at")),
    reconciledBy: normalizeUserRef(
      pick(r, "reconciledByUser", "reconciled_by_user", "reconciledBy", "reconciled_by"),
      pick(r, "reconciledByName", "reconciled_by_name")
    ),
  };
}

export function normalizeDashboardSummary(raw: unknown): PaymentDashboardSummary {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const currency = asStr(pick(r, "currency"), "INR");
  const totalPayable = asInt(pick(r, "totalPayableAmountPaise", "total_payable_amount_paise"), 0);
  const totalPaid = asInt(pick(r, "totalPaidAmountPaise", "total_paid_amount_paise"), 0);
  const totalHeld = asInt(pick(r, "totalHeldAmountPaise", "total_held_amount_paise"), 0);
  const totalFailed = asInt(pick(r, "totalFailedAmountPaise", "total_failed_amount_paise"), 0);
  const outstanding = asInt(pick(r, "outstandingPaymentAmountPaise", "outstanding_payment_amount_paise"), 0);
  const pendingApproval = asInt(pick(r, "pendingApprovalBatches", "pending_approval_batches"), 0);
  const submitted = asInt(pick(r, "submittedToBankBatches", "submitted_to_bank_batches"), 0);
  const processing = asInt(pick(r, "processingBatches", "processing_batches"), 0);

  return {
    totalBatches: asInt(pick(r, "totalBatches", "total_batches"), 0),
    draftBatches: asInt(pick(r, "draftBatches", "draft_batches"), 0),
    validatingBatches: asInt(pick(r, "validatingBatches", "validating_batches"), 0),
    validationFailedBatches: asInt(pick(r, "validationFailedBatches", "validation_failed_batches"), 0),
    validatedBatches: asInt(pick(r, "validatedBatches", "validated_batches"), 0),
    pendingApprovalBatches: pendingApproval,
    awaitingApprovalBatches: asInt(pick(r, "awaitingApprovalBatches", "awaiting_approval_batches"), pendingApproval),
    approvedBatches: asInt(pick(r, "approvedBatches", "approved_batches"), 0),
    rejectedBatches: asInt(pick(r, "rejectedBatches", "rejected_batches"), 0),
    fileGeneratedBatches: asInt(pick(r, "fileGeneratedBatches", "file_generated_batches"), 0),
    submittedToBankBatches: submitted,
    processingBatches: processing,
    inBankingProcessingBatches: asInt(
      pick(r, "inBankingProcessingBatches", "in_banking_processing_batches"),
      submitted + processing
    ),
    partiallyPaidBatches: asInt(pick(r, "partiallyPaidBatches", "partially_paid_batches"), 0),
    paidBatches: asInt(pick(r, "paidBatches", "paid_batches"), 0),
    failedBatches: asInt(pick(r, "failedBatches", "failed_batches"), 0),
    cancelledBatches: asInt(pick(r, "cancelledBatches", "cancelled_batches"), 0),
    reconciledBatches: asInt(pick(r, "reconciledBatches", "reconciled_batches"), 0),
    totalPayableAmountPaise: totalPayable,
    totalPayableAmountFormatted: asStr(
      pick(r, "totalPayableAmountFormatted", "total_payable_amount_formatted"),
      formatPaise(totalPayable, { currency })
    ),
    totalPaidAmountPaise: totalPaid,
    totalPaidAmountFormatted: asStr(
      pick(r, "totalPaidAmountFormatted", "total_paid_amount_formatted"),
      formatPaise(totalPaid, { currency })
    ),
    totalHeldAmountPaise: totalHeld,
    totalHeldAmountFormatted: asStr(
      pick(r, "totalHeldAmountFormatted", "total_held_amount_formatted"),
      formatPaise(totalHeld, { currency })
    ),
    totalFailedAmountPaise: totalFailed,
    totalFailedAmountFormatted: asStr(
      pick(r, "totalFailedAmountFormatted", "total_failed_amount_formatted"),
      formatPaise(totalFailed, { currency })
    ),
    outstandingPaymentAmountPaise: outstanding,
    outstandingPaymentAmountFormatted: asStr(
      pick(r, "outstandingPaymentAmountFormatted", "outstanding_payment_amount_formatted"),
      formatPaise(outstanding, { currency })
    ),
    reconciliationPercentage: asNum(pick(r, "reconciliationPercentage", "reconciliation_percentage"), 0),
    currency,
    timezone: asStr(pick(r, "timezone"), "Asia/Kolkata"),
  };
}

export function normalizeReconciliation(raw: unknown): PaymentReconciliation {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const expectedPaise = asInt(pick(r, "expectedPaise", "expected_paise", "grossAmountPaise", "gross_amount_paise"), 0);
  const paidPaise = asInt(pick(r, "paidPaise", "paid_paise", "totalPaidPaise", "total_paid_paise"), 0);
  const failedPaise = asInt(pick(r, "failedPaise", "failed_paise", "totalFailedPaise", "total_failed_paise"), 0);
  const heldPaise = asInt(pick(r, "heldPaise", "held_paise", "heldAmountPaise", "held_amount_paise"), 0);
  const processingPaise = asInt(
    pick(r, "processingPaise", "processing_paise", "totalPendingPaise", "total_pending_paise"),
    0
  );
  const unmatchedPaise = asInt(pick(r, "unmatchedPaise", "unmatched_paise"), 0);
  const computedMismatch =
    expectedPaise - (paidPaise + failedPaise + heldPaise + processingPaise + unmatchedPaise);
  const mismatchPaise = asInt(pick(r, "mismatchPaise", "mismatch_paise"), computedMismatch);
  const rawBatchStatus = asNullableStr(pick(r, "batchStatus", "batch_status"));

  return {
    batchId: asStr(pick(r, "batchId", "batch_id")),
    runId: asStr(pick(r, "runId", "run_id"), ""),
    batchStatus: rawBatchStatus ? normalizeBatchStatus(rawBatchStatus) : undefined,
    currency: asStr(pick(r, "currency"), "INR"),
    totalEmployees: asOptionalInt(pick(r, "totalEmployees", "total_employees")) ?? undefined,
    totalItems: asOptionalInt(pick(r, "totalItems", "total_items")) ?? undefined,
    paidCount: asOptionalInt(pick(r, "paidCount", "paid_count")) ?? undefined,
    failedCount: asOptionalInt(pick(r, "failedCount", "failed_count")) ?? undefined,
    pendingCount: asOptionalInt(pick(r, "pendingCount", "pending_count")) ?? undefined,
    heldCount: asOptionalInt(pick(r, "heldCount", "held_count")) ?? undefined,
    expectedPaise,
    paidPaise,
    failedPaise,
    heldPaise,
    processingPaise,
    unmatchedPaise,
    reconciliationPercentage: asNum(pick(r, "reconciliationPercentage", "reconciliation_percentage"), 0),
    canReconcile: Boolean(pick(r, "canReconcile", "can_reconcile")),
    isReconciled:
      pick(r, "isReconciled", "is_reconciled") !== undefined
        ? Boolean(pick(r, "isReconciled", "is_reconciled"))
        : rawBatchStatus?.toUpperCase() === "RECONCILED",
    mismatchPaise,
    summaryText: asStr(pick(r, "summaryText", "summary_text"), ""),
    reconciledAt: asNullableStr(pick(r, "reconciledAt", "reconciled_at")),
    reconciledBy: asNullableStr(pick(r, "reconciledBy", "reconciled_by")),
  };
}

function normalizeValidationIssue(raw: unknown): BankValidationIssue {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const sevRaw = asStr(pick(r, "severity"), "error").toLowerCase();
  const severity: BankValidationIssue["severity"] = sevRaw === "warning" ? "warning" : "error";
  const rawField = asStr(pick(r, "field"), "accountNumber");
  const field: BankValidationIssue["field"] =
    rawField === "ifsc" || rawField === "ifscCode"
      ? "ifsc"
      : rawField === "accountHolderName"
      ? "accountHolderName"
      : rawField === "netAmount" || rawField === "amountPaise"
      ? "netAmount"
      : rawField === "duplicateAccount"
      ? "duplicateAccount"
      : "accountNumber";

  const codeRaw = asStr(pick(r, "code"), "MISSING_ACCOUNT");
  const codeAliases: Record<string, BankValidationIssue["code"]> = {
    MISSING_ACCOUNT: "MISSING_ACCOUNT",
    MISSING_BANK_ACCOUNT: "MISSING_ACCOUNT",
    INVALID_ACCOUNT_FORMAT: "INVALID_ACCOUNT_FORMAT",
    INVALID_IFSC_FORMAT: "INVALID_IFSC_FORMAT",
    INVALID_IFSC: "INVALID_IFSC_FORMAT",
    IFSC_NOT_FOUND: "IFSC_NOT_FOUND",
    INVALID_SOURCE_ACCOUNT: "INVALID_SOURCE_ACCOUNT",
    NAME_MISMATCH: "NAME_MISMATCH",
    MISSING_ACCOUNT_HOLDER: "NAME_MISMATCH",
    DUPLICATE_ACCOUNT: "DUPLICATE_ACCOUNT",
    ZERO_NET_PAY: "ZERO_NET_PAY",
    NEGATIVE_NET_PAY: "NEGATIVE_NET_PAY",
    INVALID_AMOUNT: "ZERO_NET_PAY",
  };
  return {
    id: asStr(pick(r, "id")),
    employeeId: asStr(pick(r, "employeeId", "employee_id")),
    employeeCode: asStr(pick(r, "employeeCode", "employee_code"), "—"),
    employeeName: asStr(pick(r, "employeeName", "employee_name"), "—"),
    department: asNullableStr(pick(r, "department")),
    field,
    code: codeAliases[codeRaw] ?? "MISSING_ACCOUNT",
    severity,
    blocking: pick(r, "blocking") !== undefined ? Boolean(pick(r, "blocking")) : severity === "error",
    message: asStr(pick(r, "message", "issue"), ""),
    suggestedAction: asNullableStr(pick(r, "suggestedAction", "suggested_action")),
  };
}

export function normalizeValidationResponse(raw: unknown): BankValidationResponse {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const issuesRaw = pick<unknown[]>(r, "issues");
  const issues = Array.isArray(issuesRaw) ? issuesRaw.map(normalizeValidationIssue) : [];
  const hasBlocking = Boolean(pick(r, "hasBlockingErrors", "has_blocking_errors")) || issues.some((i) => i.blocking);
  const batchSt = asNullableStr(pick(r, "batchStatus", "batch_status"));
  const stRaw = asStr(pick(r, "status"), hasBlocking ? "validation_failed" : "validated").toLowerCase();
  return {
    batchId: asStr(pick(r, "batchId", "batch_id")),
    batchStatus: batchSt ? normalizeBatchStatus(batchSt) : undefined,
    status: stRaw === "validation_failed" || stRaw === "error" || hasBlocking ? "validation_failed" : "validated",
    totalItems: asOptionalInt(pick(r, "totalItems", "total_items")) ?? undefined,
    totalChecked: asInt(pick(r, "totalChecked", "total_checked"), issues.length),
    passedCount: asInt(pick(r, "passedCount", "passed_count"), 0),
    errorCount: asInt(pick(r, "errorCount", "error_count"), issues.filter((i) => i.severity === "error").length),
    warningCount: asInt(
      pick(r, "warningCount", "warning_count"),
      issues.filter((i) => i.severity === "warning").length
    ),
    blockingCount: asInt(
      pick(r, "blockingCount", "blocking_count"),
      issues.filter((i) => i.blocking).length
    ),
    hasBlockingErrors: hasBlocking,
    issues,
  };
}

export function normalizeBankResponsePreview(raw: unknown): BankResponsePreviewResult {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const summaryRaw = (pick<RawRecord>(r, "summary") || {}) as RawRecord;
  const errorsRaw = pick<unknown[]>(r, "errors");
  return {
    batchId: asStr(pick(r, "batchId", "batch_id")),
    fileName: asStr(pick(r, "fileName", "file_name"), "bank-response.csv"),
    totalRows: asInt(pick(r, "totalRows", "total_rows"), 0),
    validRows: asInt(pick(r, "validRows", "valid_rows", "matchedRecords", "matched_records"), 0),
    invalidRows: asInt(pick(r, "invalidRows", "invalid_rows"), 0),
    duplicateRows: asInt(pick(r, "duplicateRows", "duplicate_rows"), 0),
    unmatchedRefs: asInt(pick(r, "unmatchedRefs", "unmatched_refs", "unmatchedRecords", "unmatched_records"), 0),
    matchedRecords: asInt(pick(r, "matchedRecords", "matched_records", "validRows", "valid_rows"), 0),
    summary: {
      paidCount: asInt(pick(summaryRaw, "paidCount", "paid_count") ?? pick(r, "paidRecords", "paid_records"), 0),
      failedCount: asInt(
        pick(summaryRaw, "failedCount", "failed_count") ?? pick(r, "failedRecords", "failed_records"),
        0
      ),
      totalPaidPaise: asInt(pick(summaryRaw, "totalPaidPaise", "total_paid_paise"), 0),
      totalFailedPaise: asInt(pick(summaryRaw, "totalFailedPaise", "total_failed_paise"), 0),
    },
    errors: Array.isArray(errorsRaw)
      ? errorsRaw.map((e, idx) => {
          const er = (e && typeof e === "object" ? e : {}) as RawRecord;
          return {
            rowNumber: asInt(pick(er, "rowNumber", "row_number"), idx + 1),
            paymentReference: asStr(pick(er, "paymentReference", "payment_reference"), "—"),
            errorCode: asStr(pick(er, "errorCode", "error_code"), "INVALID_ROW"),
            errorMessage: asStr(pick(er, "errorMessage", "error_message"), "Invalid bank response row"),
          };
        })
      : [],
    previewToken: asStr(pick(r, "previewToken", "preview_token")),
  };
}

export function normalizeAuditLogEntry(raw: unknown): PaymentAuditLogEntry {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  return {
    id: asStr(pick(r, "id")),
    action: asStr(pick(r, "action"), "EVENT"),
    actorId: asNullableStr(pick(r, "actorId", "actor_id")),
    actorName: asNullableStr(pick(r, "actorName", "actor_name")),
    actorEmail: asNullableStr(pick(r, "actorEmail", "actor_email")),
    actorRole: asNullableStr(pick(r, "actorRole", "actor_role")),
    oldStatus: asNullableStr(pick(r, "oldStatus", "old_status")),
    newStatus: asNullableStr(pick(r, "newStatus", "new_status")),
    reason: asNullableStr(pick(r, "reason")),
    createdAt: asNullableStr(pick(r, "createdAt", "created_at")),
  };
}

function normalizeEligibleRun(raw: unknown): EligiblePayrollRun {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const currency = asStr(pick(r, "currency"), "INR");
  const netPaise = asInt(pick(r, "totalNetPaise", "total_net_paise"), 0);
  return {
    id: asStr(pick(r, "id", "runId", "run_id")),
    runId: asStr(pick(r, "runId", "run_id", "id")),
    runNumber: asStr(pick(r, "runNumber", "run_number"), "—"),
    periodId: asNullableStr(pick(r, "periodId", "period_id")),
    periodName: asStr(pick(r, "periodName", "period_name"), "—"),
    periodMonth: asInt(pick(r, "periodMonth", "period_month"), 0),
    periodYear: asInt(pick(r, "periodYear", "period_year"), 0),
    status: asStr(pick(r, "status"), "LOCKED"),
    employeeCount: asInt(pick(r, "employeeCount", "employee_count"), 0),
    totalNetPaise: netPaise,
    totalNetFormatted: asStr(pick(r, "totalNetFormatted", "total_net_formatted"), formatPaise(netPaise, { currency })),
    currency,
    finalizedAt: asNullableStr(pick(r, "finalizedAt", "finalized_at")),
  };
}

function normalizeSupportedPaymentModeEntry(raw: unknown): SupportedPaymentMode {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const maxVal = pick(r, "maxAmountPaise", "max_amount_paise");
  return {
    code: normalizePaymentMode(pick(r, "code")),
    label: asStr(pick(r, "label")),
    description: asStr(pick(r, "description")),
    minAmountPaise: asInt(pick(r, "minAmountPaise", "min_amount_paise"), 100),
    maxAmountPaise: maxVal !== null && maxVal !== undefined ? asInt(maxVal, 0) : null,
    settlementWindow: asStr(pick(r, "settlementWindow", "settlement_window"), ""),
    enabled: pick(r, "enabled") !== false,
  };
}

// ---------------------------------------------------------------------------
// API Client Methods
// ---------------------------------------------------------------------------

export const paymentApi = {
  /**
   * Fetch backend-calculated dashboard summary across all company payment batches.
   */
  async getDashboardSummary(signal?: AbortSignal): Promise<PaymentDashboardSummary> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      "/api/v2/payroll/payment-batches/summary",
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return normalizeDashboardSummary(res.data.data);
  },

  /**
   * List locked/finalized payroll runs eligible for a new payment batch.
   */
  async getEligibleRuns(signal?: AbortSignal): Promise<EligiblePayrollRun[]> {
    const res = await apiInstance.get<{ success: boolean; data: unknown[] }>(
      "/api/v2/payroll/payment-batches/eligible-runs",
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return Array.isArray(res.data.data) ? res.data.data.map(normalizeEligibleRun) : [];
  },

  /**
   * Get tenant-supported payment disbursement modes.
   */
  async getSupportedPaymentModes(signal?: AbortSignal): Promise<SupportedPaymentMode[]> {
    const res = await apiInstance.get<{ success: boolean; data: unknown[] }>(
      "/api/v2/payroll/payment-modes",
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return Array.isArray(res.data.data) ? res.data.data.map(normalizeSupportedPaymentModeEntry) : [];
  },

  /**
   * Create a new payment batch from a finalized payroll run.
   */
  async createPaymentBatch(
    runId: string,
    payload: CreatePaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/runs/${runId}/payment-batches`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Create a new payment batch directly via POST /api/v2/payroll/payment-batches.
   */
  async createPaymentBatchDirect(
    payload: CreatePaymentBatchPayload & { runId: string },
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      "/api/v2/payroll/payment-batches",
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Update an editable pre-approval payment batch.
   */
  async updatePaymentBatch(
    batchId: string,
    payload: UpdatePaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.patch<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Delete an eligible draft, validation-failed, or rejected payment batch.
   */
  async deletePaymentBatch(batchId: string): Promise<{ id: string; batchNumber: string; deleted: boolean }> {
    const res = await apiInstance.delete<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    return {
      id: asStr(pick(d, "id"), batchId),
      batchNumber: asStr(pick(d, "batchNumber", "batch_number")),
      deleted: Boolean(pick(d, "deleted")),
    };
  },

  /**
   * Cancel a pre-submission payment batch while retaining audit history.
   */
  async cancelPaymentBatch(batchId: string, reason?: string, idempotencyKey?: string): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/cancel`,
      { reason },
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * List all payment batches associated with a specific run.
   */
  async getPaymentBatchesForRun(runId: string, signal?: AbortSignal): Promise<PaymentBatch[]> {
    const res = await apiInstance.get<{ success: boolean; data: unknown[] }>(
      `/api/v2/payroll/runs/${runId}/payment-batches`,
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return Array.isArray(res.data.data) ? res.data.data.map(normalizePaymentBatch) : [];
  },

  /**
   * List payment batches with server-side search, filtering, sorting, and pagination.
   */
  async getPaymentBatches(
    params?: GetPaymentBatchesParams,
    signal?: AbortSignal
  ): Promise<{ items: PaymentBatch[]; total: number; page: number; limit: number; totalPages: number }> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      "/api/v2/payroll/payment-batches",
      {
        params,
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    const rawItems = Array.isArray(d.items) ? d.items : [];
    const total = asInt(pick(d, "total"), rawItems.length);
    const limit = asInt(pick(d, "limit", "page_size"), params?.limit || 20);
    const page = asInt(pick(d, "page"), params?.page || 1);
    const totalPages = asInt(pick(d, "totalPages", "total_pages"), Math.max(1, Math.ceil(total / Math.max(1, limit))));
    return {
      items: rawItems.map(normalizePaymentBatch),
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Retrieve payment batch details and paginated employee payment line items.
   */
  async getPaymentBatch(
    batchId: string,
    params?: { page?: number; limit?: number; status?: string; search?: string },
    signal?: AbortSignal
  ): Promise<GetPaymentBatchDetailResponse> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}`,
      {
        params,
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    const batch = normalizePaymentBatch(d.batch);
    const itemsWrapper = d.items;
    let rawItemsList: unknown[] = [];
    let totalItems = 0;
    let page = params?.page || 1;
    let limit = params?.limit || 50;

    if (Array.isArray(itemsWrapper)) {
      rawItemsList = itemsWrapper;
      totalItems = asInt(pick(d, "totalItems", "total_items"), rawItemsList.length);
    } else if (itemsWrapper && typeof itemsWrapper === "object") {
      const iw = itemsWrapper as RawRecord;
      rawItemsList = Array.isArray(iw.items) ? iw.items : [];
      totalItems = asInt(pick(iw, "total"), rawItemsList.length);
      page = asInt(pick(iw, "page"), page);
      limit = asInt(pick(iw, "limit"), limit);
    }

    const vs = (d.validationSummary || {}) as RawRecord;
    return {
      batch,
      items: rawItemsList.map(normalizePaymentBatchItem),
      totalItems,
      page,
      limit,
      validationSummary: {
        totalIssues: asInt(pick(vs, "totalIssues", "total_issues"), 0),
        errors: asInt(pick(vs, "errors", "errorCount", "error_count"), 0),
        warnings: asInt(pick(vs, "warnings", "warningCount", "warning_count"), 0),
        blockingCount: asInt(pick(vs, "blockingCount", "blocking_count"), 0),
      },
    };
  },

  /**
   * Read-only validation check for a payment batch (does not mutate status).
   */
  async getBatchValidation(batchId: string, signal?: AbortSignal): Promise<BankValidationResponse> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/validation`,
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return normalizeValidationResponse(res.data.data);
  },

  /**
   * Run bank account and IFSC validation across all employee records in the batch (persists validation status).
   */
  async validatePaymentBatch(batchId: string, idempotencyKey?: string): Promise<BankValidationResponse> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/validate`,
      {},
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizeValidationResponse(res.data.data);
  },

  /**
   * Submit a validated payment batch for maker-checker approval.
   */
  async submitForApproval(
    batchId: string,
    remarks?: string,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/submit-for-approval`,
      { remarks },
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Approve payment batch (Maker-checker enforcement).
   */
  async approvePaymentBatch(
    batchId: string,
    payload: ApprovePaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/approve`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Reject payment batch.
   */
  async rejectPaymentBatch(
    batchId: string,
    payload: RejectPaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/reject`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Get generated bank file metadata for a batch.
   */
  async getBankFileMetadata(
    batchId: string,
    signal?: AbortSignal
  ): Promise<{ latest: BankFileMetadata | null; files: BankFileMetadata[] }> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-file`,
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    const filesRaw = Array.isArray(d.files) ? d.files : [];
    const files = filesRaw.map(normalizeBankFileMetadata);
    const latest = d.latest ? normalizeBankFileMetadata(d.latest) : files[0] || null;
    return { latest, files };
  },

  /**
   * Generate server-side bank payment file.
   */
  async generateBankFile(
    batchId: string,
    payload: GenerateBankFilePayload,
    idempotencyKey?: string
  ): Promise<BankFileMetadata> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-file`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizeBankFileMetadata(res.data.data);
  },

  /**
   * Download the generated bank file as a Blob with filename.
   */
  async downloadBankFile(batchId: string): Promise<{ blob: Blob; filename: string; mimeType: string }> {
    const res = await apiInstance.get(
      `/api/v2/payroll/payment-batches/${batchId}/bank-file/download`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(contentDisposition, contentType, `bank-file-${batchId}`);
    const mimeType = parseContentType(contentType)?.mimeType || "application/octet-stream";
    return { blob: res.data as Blob, filename, mimeType };
  },

  /**
   * Mark batch as submitted to bank portal.
   */
  async submitPaymentBatch(
    batchId: string,
    payload: SubmitPaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/submit`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * List paginated employee payment items for a batch.
   */
  async getPaymentBatchItems(
    batchId: string,
    params?: { page?: number; limit?: number; status?: string; search?: string },
    signal?: AbortSignal
  ): Promise<{ items: PaymentBatchItem[]; total: number; page: number; limit: number }> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/items`,
      {
        params,
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    const rawItems = Array.isArray(d.items) ? d.items : [];
    return {
      items: rawItems.map(normalizePaymentBatchItem),
      total: asInt(pick(d, "total"), rawItems.length),
      page: asInt(pick(d, "page"), params?.page || 1),
      limit: asInt(pick(d, "limit"), params?.limit || 50),
    };
  },

  /**
   * Get single employee payment transaction detail.
   */
  async getPaymentBatchItemDetail(batchId: string, itemId: string): Promise<PaymentBatchItem> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    return normalizePaymentBatchItem(res.data.data);
  },

  /**
   * List failed employee payment items for a batch.
   */
  async getFailedPaymentItems(
    batchId: string,
    params?: { page?: number; limit?: number },
    signal?: AbortSignal
  ): Promise<{ items: PaymentBatchItem[]; total: number; page: number; limit: number }> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/failed-items`,
      {
        params,
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    const rawItems = Array.isArray(d.items) ? d.items : [];
    return {
      items: rawItems.map(normalizePaymentBatchItem),
      total: asInt(pick(d, "total"), rawItems.length),
      page: asInt(pick(d, "page"), params?.page || 1),
      limit: asInt(pick(d, "limit"), params?.limit || 50),
    };
  },

  /**
   * Upload bank disbursement response CSV for parsing and validation preview.
   */
  async previewBankResponse(batchId: string, file: File): Promise<BankResponsePreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-response/preview`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizeBankResponsePreview(res.data.data);
  },

  /**
   * Apply validated bank response to update employee payment statuses.
   */
  async applyBankResponse(
    batchId: string,
    payload: ApplyBankResponsePayload,
    idempotencyKey?: string
  ): Promise<{ batchId: string; appliedRows: number; paidCount: number; failedCount: number }> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-response/apply`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    const d = res.data.data || {};
    return {
      batchId: asStr(pick(d, "batchId", "batch_id"), batchId),
      appliedRows: asInt(pick(d, "appliedRows", "applied_rows", "updatedCount", "updated_count"), 0),
      paidCount: asInt(pick(d, "paidCount", "paid_count"), 0),
      failedCount: asInt(pick(d, "failedCount", "failed_count"), 0),
    };
  },

  /**
   * Record per-employee settlement outcomes (PAID + UTR or FAILED + reason) directly.
   */
  async recordPaymentResults(
    batchId: string,
    payload: RecordPaymentResultsPayload,
    idempotencyKey?: string
  ): Promise<RecordPaymentResultsResponse> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/record-results`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    const d = res.data.data || {};
    return {
      batchId: asStr(pick(d, "batchId", "batch_id"), batchId),
      status: normalizeBatchStatus(pick(d, "status")),
      message: asStr(pick(d, "message"), "Payment results recorded"),
      updatedCount: asInt(pick(d, "updatedCount", "updated_count"), 0),
      paidCount: asInt(pick(d, "paidCount", "paid_count"), 0),
      failedCount: asInt(pick(d, "failedCount", "failed_count"), 0),
      pendingCount: asInt(pick(d, "pendingCount", "pending_count"), 0),
      paidAmountPaise: asInt(pick(d, "paidAmountPaise", "paid_amount_paise"), 0),
      failedAmountPaise: asInt(pick(d, "failedAmountPaise", "failed_amount_paise"), 0),
      outstandingAmountPaise: asInt(pick(d, "outstandingAmountPaise", "outstanding_amount_paise"), 0),
    };
  },

  /**
   * Get authoritative backend payment reconciliation breakdown for a batch.
   */
  async getReconciliation(batchId: string, signal?: AbortSignal): Promise<PaymentReconciliation> {
    const res = await apiInstance.get<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/reconciliation`,
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return normalizeReconciliation(res.data.data);
  },

  /**
   * Formally reconcile payment batch using integer paise balance.
   */
  async reconcilePaymentBatch(
    batchId: string,
    notes?: string,
    idempotencyKey?: string
  ): Promise<PaymentReconciliation> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/reconcile`,
      notes ? { notes } : {},
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizeReconciliation(res.data.data);
  },

  /**
   * Hold an individual employee payment with mandatory reason.
   */
  async holdPaymentItem(
    batchId: string,
    itemId: string,
    payload: HoldPaymentItemPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatchItem> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/hold`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatchItem(res.data.data);
  },

  /**
   * Release a previously held employee payment.
   */
  async releasePaymentItem(
    batchId: string,
    itemId: string,
    payload?: ReleasePaymentItemPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatchItem> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/release`,
      payload || {},
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatchItem(res.data.data);
  },

  /**
   * Queue an individual failed employee payment for retry (with optional updated bank details).
   */
  async retryPaymentItem(
    batchId: string,
    itemId: string,
    payload: RetryPaymentItemPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatchItem> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/retry`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatchItem(res.data.data);
  },

  /**
   * Create a linked DRAFT re-payout batch for all eligible failed/retried items (prevents double-paying PAID items).
   */
  async retryFailedBatch(
    batchId: string,
    payload: RetryFailedBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: RawRecord }>(
      `/api/v2/payroll/payment-batches/${batchId}/retry-failed`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return normalizePaymentBatch(res.data.data);
  },

  /**
   * Fetch chronological payment workflow status & audit logs for a batch.
   */
  async getBatchAuditLogs(batchId: string, signal?: AbortSignal): Promise<PaymentAuditLogEntry[]> {
    const res = await apiInstance.get<{ success: boolean; data: unknown[] }>(
      `/api/v2/payroll/payment-batches/${batchId}/audit-logs`,
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return Array.isArray(res.data.data) ? res.data.data.map(normalizeAuditLogEntry) : [];
  },

  /**
   * Export full disbursement and reconciliation CSV report for a batch.
   */
  async exportBatchReport(batchId: string): Promise<{ blob: Blob; filename: string; mimeType: string }> {
    const res = await apiInstance.get(
      `/api/v2/payroll/payment-batches/${batchId}/export`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(contentDisposition, contentType, `payment-batch-${batchId}.csv`);
    const mimeType = parseContentType(contentType)?.mimeType || "text/csv";
    return { blob: res.data as Blob, filename, mimeType };
  },

  /**
   * Export formal reconciliation summary and UTR verification CSV report for a batch.
   */
  async exportReconciliationReport(batchId: string): Promise<{ blob: Blob; filename: string; mimeType: string }> {
    const res = await apiInstance.get(
      `/api/v2/payroll/payment-batches/${batchId}/reconciliation/export`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(contentDisposition, contentType, `reconciliation-report-${batchId}.csv`);
    const mimeType = parseContentType(contentType)?.mimeType || "text/csv";
    return { blob: res.data as Blob, filename, mimeType };
  },

  /**
   * Get active company source bank accounts for the authenticated tenant.
   */
  async getTenantBankAccounts(signal?: AbortSignal): Promise<CompanyBankAccount[]> {
    const res = await apiInstance.get<{ success: boolean; data: unknown[] }>(
      "/api/v2/payroll/company-bank-accounts",
      {
        signal,
        headers: { "Cache-Control": "no-store" },
      }
    );
    return Array.isArray(res.data.data) ? res.data.data.map(normalizeCompanyBankAccount) : [];
  },

  /**
   * Get active company source bank accounts by explicit companyId (must match authenticated tenant).
   */
  async getCompanyBankAccounts(companyId: string): Promise<CompanyBankAccount[]> {
    const res = await apiInstance.get<{ success: boolean; data: unknown[] }>(
      `/api/v2/payroll/companies/${companyId}/bank-accounts`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    return Array.isArray(res.data.data) ? res.data.data.map(normalizeCompanyBankAccount) : [];
  },

  /**
   * Audited reveal of full employee bank account number.
   */
  async revealEmployeeBankAccount(
    employeeId: string,
    reason: string
  ): Promise<{ employeeId: string; accountNumber: string; ifscCode: string; autoHideSeconds: number }> {
    const res = await apiInstance.post<{
      success: boolean;
      data: RawRecord;
    }>(
      `/api/v2/payroll/employees/${employeeId}/reveal-bank-account`,
      { reason },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    const d = res.data.data || {};
    return {
      employeeId: asStr(pick(d, "employeeId", "employee_id"), employeeId),
      accountNumber: asStr(pick(d, "accountNumber", "account_number")),
      ifscCode: asStr(pick(d, "ifscCode", "ifsc_code")),
      autoHideSeconds: asInt(pick(d, "autoHideSeconds", "auto_hide_seconds"), 30),
    };
  },
};
