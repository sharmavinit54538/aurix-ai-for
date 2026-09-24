/**
 * Payroll Payment & Disbursement Types.
 * Matches backend contracts in docs/PAYROLL_BACKEND_CONTRACT.md.
 */

import { z } from "zod";

export const PaymentStatusSchema = z.enum([
  "pending",
  "processing",
  "paid",
  "failed",
  "held",
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
  "reconciled",
  "closed",
]);
export type PaymentBatchStatus = z.infer<typeof PaymentBatchStatusSchema>;

export const PaymentModeSchema = z.enum(["NEFT", "RTGS", "IMPS", "UPI"]);
export type PaymentMode = z.infer<typeof PaymentModeSchema>;

export const BankFileFormatSchema = z.enum([
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
  ifscCode: IfscCodeSchema,
  branchName: z.string().optional(),
  currency: z.literal("INR").default("INR"),
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
  department: z.string().optional(),
  field: z.enum(["accountNumber", "ifsc", "accountHolderName", "netAmount", "duplicateAccount"]),
  code: BankValidationIssueCodeSchema,
  severity: z.enum(["error", "warning"]),
  blocking: z.boolean(),
  message: z.string(),
  suggestedAction: z.string().optional(),
});
export type BankValidationIssue = z.infer<typeof BankValidationIssueSchema>;

export const PaymentBatchItemSchema = z.object({
  id: z.string(),
  batchId: z.string(),
  employeeId: z.string(),
  employeeCode: z.string(),
  employeeName: z.string(),
  department: z.string().optional(),
  bankName: z.string(),
  accountNumberMasked: z.string(),
  ifscCode: z.string(),
  netAmountPaise: z.number().int().nonnegative(),
  netAmountFormatted: z.string(),
  status: PaymentStatusSchema,
  isHeld: z.boolean().default(false),
  holdReason: z.string().nullable().optional(),
  heldBy: z.string().nullable().optional(),
  heldAt: z.string().nullable().optional(),
  utr: z.string().nullable().optional(),
  creditedDate: z.string().nullable().optional(),
  failureReason: z.string().nullable().optional(),
  failureCode: z.string().nullable().optional(),
  paymentReference: z.string(),
  retryCount: z.number().int().default(0),
  lastRetryAt: z.string().nullable().optional(),
});
export type PaymentBatchItem = z.infer<typeof PaymentBatchItemSchema>;

export const PaymentBatchSchema = z.object({
  id: z.string(),
  batchNumber: z.string(),
  runId: z.string(),
  periodId: z.string(),
  periodName: z.string(),
  sourceAccountId: z.string(),
  sourceAccount: CompanyBankAccountSchema.optional(),
  paymentMode: PaymentModeSchema,
  status: PaymentBatchStatusSchema,
  employeeCount: z.number().int().nonnegative(),
  grossAmountPaise: z.number().int().nonnegative(),
  netAmountPaise: z.number().int().nonnegative(),
  heldAmountPaise: z.number().int().nonnegative(),
  payableAmountPaise: z.number().int().nonnegative(),
  grossAmountFormatted: z.string(),
  netAmountFormatted: z.string(),
  heldAmountFormatted: z.string(),
  payableAmountFormatted: z.string(),
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
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  createdAt: z.string(),
  approvedBy: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .nullable()
    .optional(),
  approvedAt: z.string().nullable().optional(),
  approvalRemarks: z.string().nullable().optional(),
  submittedBy: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .nullable()
    .optional(),
  submittedAt: z.string().nullable().optional(),
  bankFileId: z.string().nullable().optional(),
  reconciledAt: z.string().nullable().optional(),
  reconciledBy: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .nullable()
    .optional(),
});
export type PaymentBatch = z.infer<typeof PaymentBatchSchema>;

export const BankFileMetadataSchema = z.object({
  id: z.string(),
  batchId: z.string(),
  fileName: z.string(),
  format: BankFileFormatSchema,
  fileSizeBytes: z.number().int(),
  sha256Checksum: z.string(),
  generatedBy: z.object({
    id: z.string(),
    name: z.string(),
  }),
  generatedAt: z.string(),
  downloadUrl: z.string().optional(),
});
export type BankFileMetadata = z.infer<typeof BankFileMetadataSchema>;

export const PaymentReconciliationSchema = z.object({
  batchId: z.string(),
  runId: z.string(),
  expectedPaise: z.number().int(),
  paidPaise: z.number().int(),
  failedPaise: z.number().int(),
  heldPaise: z.number().int(),
  processingPaise: z.number().int(),
  unmatchedPaise: z.number().int(),
  isReconciled: z.boolean(),
  mismatchPaise: z.number().int(),
  summaryText: z.string(),
  reconciledAt: z.string().nullable(),
  reconciledBy: z.string().nullable(),
});
export type PaymentReconciliation = z.infer<typeof PaymentReconciliationSchema>;

export interface BankResponsePreviewResult {
  batchId: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  unmatchedRefs: number;
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
