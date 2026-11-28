/**
 * Payroll Payment & Disbursement Types.
 * Aligned with live backend Payroll v2 API contracts and enterprise disbursement workflows.
 */

import { z } from "zod";

export const PaymentStatusSchema = z.enum([
  "pending",
  "processing",
  "paid",
  "failed",
  "held",
  "released",
  "retried",
  "reversed",
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const PaymentBatchStatusSchema = z.enum([
  "draft",
  "validating",
  "validation_failed",
  "validated",
  "pending_approval",
  "approved",
  "rejected",
  "file_generated",
  "submitted",
  "processing",
  "partial",
  "paid",
  "failed",
  "reconciled",
  "cancelled",
  "closed",
]);
export type PaymentBatchStatus = z.infer<typeof PaymentBatchStatusSchema>;

export const PaymentModeSchema = z.enum(["NEFT", "RTGS", "IMPS", "UPI"]);
export type PaymentMode = z.infer<typeof PaymentModeSchema>;

export const BankFileFormatSchema = z.enum([
  "ICICI_CORPORATE",
  "HDFC_ENET_CSV",
  "SBI_CMP_TXT",
  "GENERIC_NEFT_RTGS_CSV",
  "HDFC_CSV",
  "ICICI_EXCEL",
  "SBI_TXT",
  "GENERIC_NEFT_CSV",
]);
export type BankFileFormat = z.infer<typeof BankFileFormatSchema>;

export const IfscCodeSchema = z
  .string()
  .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format");

export const CompanyBankAccountSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  bankName: z.string(),
  accountHolderName: z.string(),
  accountNumberMasked: z.string(),
  accountType: z.enum(["current", "salary", "escrow"]),
  ifscCode: z.string(),
  branchName: z.string().optional(),
  currency: z.string().default("INR"),
  isPrimary: z.boolean().default(false),
  isActive: z.boolean().default(true),
  supportedPaymentModes: z.array(PaymentModeSchema),
});
export type CompanyBankAccount = z.infer<typeof CompanyBankAccountSchema>;

export const BankValidationIssueCodeSchema = z.enum([
  "MISSING_ACCOUNT",
  "INVALID_ACCOUNT_FORMAT",
  "INVALID_IFSC_FORMAT",
  "IFSC_NOT_FOUND",
  "INVALID_SOURCE_ACCOUNT",
  "NAME_MISMATCH",
  "DUPLICATE_ACCOUNT",
  "ZERO_NET_PAY",
  "NEGATIVE_NET_PAY",
]);
export type BankValidationIssueCode = z.infer<typeof BankValidationIssueCodeSchema>;

export const BankValidationIssueSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employeeCode: z.string(),
  employeeName: z.string(),
  department: z.string().nullable().optional(),
  field: z.enum([
    "accountNumber",
    "ifsc",
    "accountHolderName",
    "netAmount",
    "duplicateAccount",
  ]),
  code: BankValidationIssueCodeSchema,
  severity: z.enum(["error", "warning"]),
  blocking: z.boolean(),
  message: z.string(),
  suggestedAction: z.string().nullable().optional(),
});
export type BankValidationIssue = z.infer<typeof BankValidationIssueSchema>;

export const PaymentBatchItemSchema = z.object({
  id: z.string(),
  batchId: z.string(),
  employeeId: z.string(),
  employeeCode: z.string(),
  employeeName: z.string(),
  department: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  bankName: z.string(),
  paymentMode: PaymentModeSchema.optional(),
  accountNumberMasked: z.string(),
  ifscCode: z.string(),
  accountHolderName: z.string().nullable().optional(),
  netAmountPaise: z.number().int().nonnegative(),
  netAmountFormatted: z.string(),
  netSalaryPaise: z.number().int().nonnegative().optional(),
  netSalaryFormatted: z.string().optional(),
  payableAmountPaise: z.number().int().nonnegative().optional(),
  payableAmountFormatted: z.string().optional(),
  paidAmountPaise: z.number().int().nonnegative().optional(),
  paidAmountFormatted: z.string().optional(),
  status: PaymentStatusSchema,
  isHeld: z.boolean().default(false),
  holdReason: z.string().nullable().optional(),
  heldBy: z.string().nullable().optional(),
  heldAt: z.string().nullable().optional(),
  utr: z.string().nullable().optional(),
  creditedDate: z.string().nullable().optional(),
  paymentDate: z.string().nullable().optional(),
  reconciledAt: z.string().nullable().optional(),
  reconciliationStatus: z.string().optional(),
  failureReason: z.string().nullable().optional(),
  failureCode: z.string().nullable().optional(),
  paymentReference: z.string(),
  transactionRef: z.string().nullable().optional(),
  repayoutBatchId: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
  retryCount: z.number().int().default(0),
  retryReason: z.string().nullable().optional(),
  lastRetryAt: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});
export type PaymentBatchItem = z.infer<typeof PaymentBatchItemSchema>;

export const PaymentUserRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});
export type PaymentUserRef = z.infer<typeof PaymentUserRefSchema>;

export const BankFileMetadataSchema = z.object({
  id: z.string(),
  batchId: z.string(),
  fileName: z.string(),
  format: z.string(),
  fileSizeBytes: z.number().int(),
  sha256Checksum: z.string(),
  generatedBy: z.object({
    id: z.string(),
    name: z.string(),
  }),
  generatedAt: z.string().nullable().optional(),
  status: z.string().optional(),
  downloadUrl: z.string().optional(),
});
export type BankFileMetadata = z.infer<typeof BankFileMetadataSchema>;

export const PaymentBatchSchema = z.object({
  id: z.string(),
  companyId: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  timezone: z.string().optional(),
  batchNumber: z.string(),
  runId: z.string(),
  runNumber: z.string().nullable().optional(),
  periodId: z.string(),
  periodName: z.string(),
  periodMonth: z.number().int().nullable().optional(),
  periodYear: z.number().int().nullable().optional(),
  sourceAccountId: z.string(),
  sourceAccount: CompanyBankAccountSchema.optional(),
  paymentMode: PaymentModeSchema,
  currency: z.string().default("INR"),
  status: PaymentBatchStatusSchema,
  employeeCount: z.number().int().nonnegative().nullable(),
  totalItemsCount: z.number().int().nonnegative().optional(),
  heldCount: z.number().int().nonnegative().optional(),
  paidCount: z.number().int().nonnegative().optional(),
  failedCount: z.number().int().nonnegative().optional(),
  pendingCount: z.number().int().nonnegative().optional(),
  grossAmountPaise: z.number().int().nonnegative(),
  netAmountPaise: z.number().int().nonnegative(),
  heldAmountPaise: z.number().int().nonnegative(),
  payableAmountPaise: z.number().int().nonnegative(),
  paidAmountPaise: z.number().int().nonnegative().optional(),
  failedAmountPaise: z.number().int().nonnegative().optional(),
  pendingAmountPaise: z.number().int().nonnegative().optional(),
  outstandingAmountPaise: z.number().int().nonnegative().optional(),
  grossAmountFormatted: z.string(),
  netAmountFormatted: z.string(),
  heldAmountFormatted: z.string(),
  payableAmountFormatted: z.string(),
  paidAmountFormatted: z.string().optional(),
  failedAmountFormatted: z.string().optional(),
  pendingAmountFormatted: z.string().optional(),
  outstandingAmountFormatted: z.string().optional(),
  bankSplitSummary: z
    .array(
      z.object({
        bankName: z.string(),
        count: z.number().int(),
        amountPaise: z.number().int(),
        amountFormatted: z.string(),
      })
    )
    .optional(),
  bankReferenceNumber: z.string().nullable().optional(),
  submissionDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdBy: PaymentUserRefSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  approvedBy: PaymentUserRefSchema.nullable().optional(),
  approvedAt: z.string().nullable().optional(),
  approvalRemarks: z.string().nullable().optional(),
  submittedBy: PaymentUserRefSchema.nullable().optional(),
  submittedAt: z.string().nullable().optional(),
  rejectedBy: PaymentUserRefSchema.nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  bankFileId: z.string().nullable().optional(),
  latestBankFile: BankFileMetadataSchema.nullable().optional(),
  retryOfBatchId: z.string().nullable().optional(),
  reconciledAt: z.string().nullable().optional(),
  reconciledBy: PaymentUserRefSchema.nullable().optional(),
});
export type PaymentBatch = z.infer<typeof PaymentBatchSchema>;

export const PaymentReconciliationSchema = z.object({
  batchId: z.string(),
  runId: z.string(),
  batchStatus: PaymentBatchStatusSchema.optional(),
  currency: z.string().default("INR"),
  totalEmployees: z.number().int().nonnegative().optional(),
  totalItems: z.number().int().nonnegative().optional(),
  paidCount: z.number().int().nonnegative().optional(),
  failedCount: z.number().int().nonnegative().optional(),
  pendingCount: z.number().int().nonnegative().optional(),
  heldCount: z.number().int().nonnegative().optional(),
  expectedPaise: z.number().int(),
  paidPaise: z.number().int(),
  failedPaise: z.number().int(),
  heldPaise: z.number().int(),
  processingPaise: z.number().int(),
  unmatchedPaise: z.number().int(),
  reconciliationPercentage: z.number().optional(),
  canReconcile: z.boolean().optional(),
  isReconciled: z.boolean(),
  mismatchPaise: z.number().int(),
  summaryText: z.string(),
  reconciledAt: z.string().nullable(),
  reconciledBy: z.string().nullable(),
});
export type PaymentReconciliation = z.infer<typeof PaymentReconciliationSchema>;

export interface PaymentDashboardSummary {
  totalBatches: number;
  draftBatches: number;
  validatingBatches: number;
  validationFailedBatches: number;
  validatedBatches: number;
  pendingApprovalBatches: number;
  awaitingApprovalBatches: number;
  approvedBatches: number;
  rejectedBatches: number;
  fileGeneratedBatches: number;
  submittedToBankBatches: number;
  processingBatches: number;
  inBankingProcessingBatches: number;
  partiallyPaidBatches: number;
  paidBatches: number;
  failedBatches: number;
  cancelledBatches: number;
  reconciledBatches: number;
  totalPayableAmountPaise: number;
  totalPayableAmountFormatted: string;
  totalPaidAmountPaise: number;
  totalPaidAmountFormatted: string;
  totalHeldAmountPaise: number;
  totalHeldAmountFormatted: string;
  totalFailedAmountPaise: number;
  totalFailedAmountFormatted: string;
  outstandingPaymentAmountPaise: number;
  outstandingPaymentAmountFormatted: string;
  reconciliationPercentage: number;
  currency: string;
  timezone: string;
}

export interface PaymentAuditLogEntry {
  id: string;
  action: string;
  actorId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  actorRole: string | null;
  oldStatus: string | null;
  newStatus: string | null;
  reason: string | null;
  createdAt: string | null;
}

export interface EligiblePayrollRun {
  id: string;
  runId: string;
  runNumber: string;
  periodId: string | null;
  periodName: string;
  periodMonth: number;
  periodYear: number;
  status: string;
  employeeCount: number;
  totalNetPaise: number;
  totalNetFormatted: string;
  currency: string;
  finalizedAt: string | null;
}

export interface SupportedPaymentMode {
  code: PaymentMode;
  label: string;
  description: string;
  minAmountPaise: number;
  maxAmountPaise: number | null;
  settlementWindow: string;
  enabled: boolean;
}

export interface BankResponsePreviewResult {
  batchId: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  unmatchedRefs: number;
  matchedRecords: number;
  summary: {
    paidCount: number;
    failedCount: number;
    totalPaidPaise: number;
    totalFailedPaise: number;
  };
  errors: Array<{
    rowNumber: number;
    paymentReference: string;
    errorCode: string;
    errorMessage: string;
  }>;
  previewToken: string;
}
