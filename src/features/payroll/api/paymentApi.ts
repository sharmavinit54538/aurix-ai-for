/**
 * Payment & Disbursement API Service.
 * Implements contracts defined in docs/PAYROLL_BACKEND_CONTRACT.md.
 *
 * Rules:
 * - Never fake successful responses when backend is unavailable (404/501).
 * - Enforce Idempotency-Key on all mutations.
 * - Set Cache-Control: no-store on sensitive financial endpoints.
 */

import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "../utils/idempotency";
import type {
  PaymentBatch,
  PaymentBatchItem,
  CompanyBankAccount,
  BankFileMetadata,
  PaymentReconciliation,
  BankResponsePreviewResult,
  BankValidationIssue,
  PaymentMode,
  BankFileFormat,
} from "../types/payment";

export interface CreatePaymentBatchPayload {
  sourceAccountId: string;
  paymentMode: PaymentMode;
  heldEmployeeIds?: Array<{ employeeId: string; reason: string }>;
  notes?: string;
}

export interface ApprovePaymentBatchPayload {
  remarks: string;
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

export interface GetPaymentBatchesParams {
  page?: number;
  limit?: number;
  status?: string;
  periodId?: string;
  search?: string;
}

export interface GetPaymentBatchDetailResponse {
  batch: PaymentBatch;
  items: PaymentBatchItem[];
  totalItems: number;
  validationSummary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    blockingCount: number;
  };
}

export interface BankValidationResponse {
  batchId: string;
  status: "validated" | "validation_failed";
  totalChecked: number;
  passedCount: number;
  errorCount: number;
  warningCount: number;
  hasBlockingErrors: boolean;
  issues: BankValidationIssue[];
}

export const paymentApi = {
  /**
   * Create a new payment batch from a finalized payroll run.
   */
  async createPaymentBatch(
    runId: string,
    payload: CreatePaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatch }>(
      `/api/v2/payroll/runs/${runId}/payment-batches`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * List all payment batches associated with a specific run.
   */
  async getPaymentBatchesForRun(runId: string): Promise<PaymentBatch[]> {
    const res = await apiInstance.get<{ success: boolean; data: PaymentBatch[] }>(
      `/api/v2/payroll/runs/${runId}/payment-batches`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data.data || [];
  },

  /**
   * List payment batches globally (for /dashboard/payroll/payments).
   */
  async getPaymentBatches(
    params?: GetPaymentBatchesParams
  ): Promise<{ items: PaymentBatch[]; total: number; page: number; limit: number }> {
    const res = await apiInstance.get<{
      success: boolean;
      data: { items: PaymentBatch[]; total: number; page: number; limit: number };
    }>("/api/v2/payroll/payment-batches", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  /**
   * Retrieve payment batch details and employee payment line items.
   */
  async getPaymentBatch(
    batchId: string,
    params?: { page?: number; limit?: number; status?: string; search?: string }
  ): Promise<GetPaymentBatchDetailResponse> {
    const res = await apiInstance.get<{
      success: boolean;
      data: GetPaymentBatchDetailResponse;
    }>(`/api/v2/payroll/payment-batches/${batchId}`, {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  /**
   * Run bank account and IFSC validation across all employee records in the batch.
   */
  async validatePaymentBatch(
    batchId: string,
    idempotencyKey?: string
  ): Promise<BankValidationResponse> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{
      success: boolean;
      data: BankValidationResponse;
    }>(
      `/api/v2/payroll/payment-batches/${batchId}/validate`,
      {},
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
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
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatch }>(
      `/api/v2/payroll/payment-batches/${batchId}/approve`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * Reject payment batch and return to draft.
   */
  async rejectPaymentBatch(
    batchId: string,
    payload: RejectPaymentBatchPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatch> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatch }>(
      `/api/v2/payroll/payment-batches/${batchId}/reject`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
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
    const res = await apiInstance.post<{ success: boolean; data: BankFileMetadata }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-file`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * Download the generated bank file as a Blob.
   */
  async downloadBankFile(batchId: string): Promise<Blob> {
    const res = await apiInstance.get(
      `/api/v2/payroll/payment-batches/${batchId}/bank-file/download`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data as Blob;
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
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatch }>(
      `/api/v2/payroll/payment-batches/${batchId}/submit`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * Upload bank disbursement response CSV for parsing and validation preview.
   */
  async previewBankResponse(
    batchId: string,
    file: File
  ): Promise<BankResponsePreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post<{
      success: boolean;
      data: BankResponsePreviewResult;
    }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-response/preview`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
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
    const res = await apiInstance.post<{
      success: boolean;
      data: { batchId: string; appliedRows: number; paidCount: number; failedCount: number };
    }>(
      `/api/v2/payroll/payment-batches/${batchId}/bank-response/apply`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * Formally reconcile payment batch using integer paise balance.
   */
  async reconcilePaymentBatch(
    batchId: string,
    idempotencyKey?: string
  ): Promise<PaymentReconciliation> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{
      success: boolean;
      data: PaymentReconciliation;
    }>(
      `/api/v2/payroll/payment-batches/${batchId}/reconcile`,
      {},
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
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
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatchItem }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/hold`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
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
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatchItem }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/release`,
      payload || {},
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * Retry a failed employee payment.
   */
  async retryPaymentItem(
    batchId: string,
    itemId: string,
    payload: RetryPaymentItemPayload,
    idempotencyKey?: string
  ): Promise<PaymentBatchItem> {
    const key = idempotencyKey || generateIdempotencyKey();
    const res = await apiInstance.post<{ success: boolean; data: PaymentBatchItem }>(
      `/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/retry`,
      payload,
      {
        headers: {
          "Idempotency-Key": key,
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  /**
   * Get active company source bank accounts.
   */
  async getCompanyBankAccounts(companyId: string): Promise<CompanyBankAccount[]> {
    const res = await apiInstance.get<{ success: boolean; data: CompanyBankAccount[] }>(
      `/api/v2/payroll/companies/${companyId}/bank-accounts`,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data.data || [];
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
      data: { employeeId: string; accountNumber: string; ifscCode: string; autoHideSeconds: number };
    }>(
      `/api/v2/payroll/employees/${employeeId}/reveal-bank-account`,
      { reason },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data.data;
  },
};
