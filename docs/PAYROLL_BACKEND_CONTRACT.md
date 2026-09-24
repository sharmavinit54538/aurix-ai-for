# PAYROLL BACKEND CONTRACT — PAYMENT & DISBURSEMENT

**Specification Version**: `1.0.0-draft`  
**Status**: `PROPOSED` (except marked endpoints `CONFIRMED-IN-CODE`)  
**Base URL**: `${API_BASE_URL}/api/v2/payroll`  
**Authentication**: All endpoints require `Authorization: Bearer <accessToken>` header unless explicitly noted.  
**Idempotency**: All mutation endpoints (`POST`, `PUT`, `DELETE`) require `Idempotency-Key: <UUIDv4>` header.  
**Security Standard**: `Cache-Control: no-store` on all payment and banking endpoints. Masked account numbers by default.  
**Error Standard**: RFC 7807 Problem Details or `{ success: false, error: { code: string, message: string, details?: unknown } }`.

---

## 1. Core Data Models & Zod Schemas

```typescript
import { z } from "zod";

// Payment & disbursement lifecycle statuses
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

// IFSC validation schema: 4 letters + 0 + 6 alphanumeric characters
export const IfscCodeSchema = z
  .string()
  .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format (must be 4 letters, 0, then 6 alphanumeric characters)");

// Company Source Bank Account
export const CompanyBankAccountSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  bankName: z.string().min(2),
  accountHolderName: z.string().min(2),
  accountNumberMasked: z.string(), // e.g. "••••••••1234"
  accountType: z.enum(["current", "salary", "escrow"]),
  ifscCode: IfscCodeSchema,
  branchName: z.string().optional(),
  currency: z.literal("INR").default("INR"),
  isPrimary: z.boolean().default(false),
  isActive: z.boolean().default(true),
  supportedPaymentModes: z.array(PaymentModeSchema),
});
export type CompanyBankAccount = z.infer<typeof CompanyBankAccountSchema>;

// Bank validation issue
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
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
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

// Employee Payment Batch Item
export const PaymentBatchItemSchema = z.object({
  id: z.string().uuid(),
  batchId: z.string().uuid(),
  employeeId: z.string().uuid(),
  employeeCode: z.string(),
  employeeName: z.string(),
  department: z.string().optional(),
  bankName: z.string(),
  accountNumberMasked: z.string(), // e.g. "••••••••5678"
  ifscCode: IfscCodeSchema,
  netAmountPaise: z.number().int().nonnegative(), // Stored in integer paise
  netAmountFormatted: z.string(), // e.g. "₹85,000.00"
  status: PaymentStatusSchema,
  isHeld: z.boolean().default(false),
  holdReason: z.string().nullable().optional(),
  heldBy: z.string().nullable().optional(),
  heldAt: z.string().datetime().nullable().optional(),
  utr: z.string().nullable().optional(), // Unique Transaction Reference from bank
  creditedDate: z.string().nullable().optional(),
  failureReason: z.string().nullable().optional(),
  failureCode: z.string().nullable().optional(),
  paymentReference: z.string(), // Unique internal ref per employee transaction
  retryCount: z.number().int().default(0),
  lastRetryAt: z.string().datetime().nullable().optional(),
});
export type PaymentBatchItem = z.infer<typeof PaymentBatchItemSchema>;

// Payment Batch Model
export const PaymentBatchSchema = z.object({
  id: z.string().uuid(),
  batchNumber: z.string(), // e.g. "PAY-202609-B1"
  runId: z.string().uuid(),
  periodId: z.string().uuid(),
  periodName: z.string(),
  sourceAccountId: z.string().uuid(),
  sourceAccount: CompanyBankAccountSchema.optional(),
  paymentMode: PaymentModeSchema,
  status: PaymentBatchStatusSchema,
  employeeCount: z.number().int().nonnegative(),
  grossAmountPaise: z.number().int().nonnegative(),
  netAmountPaise: z.number().int().nonnegative(),
  heldAmountPaise: z.number().int().nonnegative(),
  payableAmountPaise: z.number().int().nonnegative(),
  // Formatted representations calculated by backend
  grossAmountFormatted: z.string(),
  netAmountFormatted: z.string(),
  heldAmountFormatted: z.string(),
  payableAmountFormatted: z.string(),
  bankSplitSummary: z.array(
    z.object({
      bankName: z.string(),
      count: z.number().int(),
      amountPaise: z.number().int(),
      amountFormatted: z.string(),
    })
  ).optional(),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  createdAt: z.string().datetime(),
  approvedBy: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
  approvedAt: z.string().datetime().nullable().optional(),
  approvalRemarks: z.string().nullable().optional(),
  submittedBy: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
  submittedAt: z.string().datetime().nullable().optional(),
  bankFileId: z.string().uuid().nullable().optional(),
  reconciledAt: z.string().datetime().nullable().optional(),
  reconciledBy: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
});
export type PaymentBatch = z.infer<typeof PaymentBatchSchema>;

// Bank File Download Metadata
export const BankFileMetadataSchema = z.object({
  id: z.string().uuid(),
  batchId: z.string().uuid(),
  fileName: z.string(),
  format: BankFileFormatSchema,
  fileSizeBytes: z.number().int(),
  sha256Checksum: z.string(),
  generatedBy: z.object({
    id: z.string(),
    name: z.string(),
  }),
  generatedAt: z.string().datetime(),
  downloadUrl: z.string().url().optional(),
});
export type BankFileMetadata = z.infer<typeof BankFileMetadataSchema>;

// Reconciliation Summary
export const PaymentReconciliationSchema = z.object({
  batchId: z.string().uuid(),
  runId: z.string().uuid(),
  expectedPaise: z.number().int(),
  paidPaise: z.number().int(),
  failedPaise: z.number().int(),
  heldPaise: z.number().int(),
  processingPaise: z.number().int(),
  unmatchedPaise: z.number().int(),
  isReconciled: z.boolean(),
  mismatchPaise: z.number().int(), // expected - (paid + failed + held + processing)
  summaryText: z.string(),
  reconciledAt: z.string().datetime().nullable(),
  reconciledBy: z.string().nullable(),
});
export type PaymentReconciliation = z.infer<typeof PaymentReconciliationSchema>;
```

---

## 2. API Endpoints Specification

### 2.1 Create Payment Batch
- **Method**: `POST`
- **Path**: `/api/v2/payroll/runs/{runId}/payment-batches`
- **Status**: `PROPOSED`
- **Purpose**: Creates a payment batch from a finalized payroll run.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse` or `payroll.process` (Maker role).
- **Idempotency**: **Required** via `Idempotency-Key: <UUIDv4>`.
- **Request Headers**:
  - `Authorization: Bearer <token>`
  - `Idempotency-Key: <UUIDv4>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "sourceAccountId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "paymentMode": "NEFT",
    "heldEmployeeIds": [
      {
        "employeeId": "emp-101",
        "reason": "Tax declaration documents pending verification"
      }
    ],
    "notes": "Salary disbursement for Sep 2026 Batch 1"
  }
  ```
- **Zod Request Schema**:
  ```typescript
  export const CreatePaymentBatchRequestSchema = z.object({
    sourceAccountId: z.string().uuid("Invalid source bank account ID"),
    paymentMode: PaymentModeSchema,
    heldEmployeeIds: z.array(
      z.object({
        employeeId: z.string().uuid(),
        reason: z.string().min(5, "Hold reason must be at least 5 characters"),
      })
    ).optional(),
    notes: z.string().max(500).optional(),
  });
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "id": "batch-9988",
      "batchNumber": "PAY-202609-B1",
      "runId": "run-1234",
      "periodId": "period-5678",
      "periodName": "September 2026",
      "status": "draft",
      "employeeCount": 142,
      "grossAmountPaise": 1250000000,
      "netAmountPaise": 1050000000,
      "heldAmountPaise": 15000000,
      "payableAmountPaise": 1035000000,
      "grossAmountFormatted": "₹1,25,00,000.00",
      "netAmountFormatted": "₹1,05,00,000.00",
      "heldAmountFormatted": "₹1,50,000.00",
      "payableAmountFormatted": "₹1,03,50,000.00"
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Validation failure or mandatory hold reason missing.
  - `401 Unauthorized`: Token invalid/expired.
  - `403 Forbidden`: User lacks `payroll.disburse` permission.
  - `404 Not Found`: `runId` or `sourceAccountId` does not exist.
  - `409 Conflict`: Run is not finalized/locked or active batch already exists for this run.
  - `422 Unprocessable Entity`: Financial amount mismatch or zero employees eligible.
  - `500 Internal Server Error`: Server failure.
- **Backend Responsibility**:
  - Verify run is in `finalized` / `locked` status.
  - Calculate all totals authoritatively from finalized pay records (never trust frontend math).
  - Enforce atomic creation with idempotency key cache.
- **Frontend Responsibility**:
  - Disable submit button during in-flight call.
  - Pass unique idempotency key.
  - Prevent user submission if hold reason is missing for held employees.

---

### 2.2 List Payment Batches for Run
- **Method**: `GET`
- **Path**: `/api/v2/payroll/runs/{runId}/payment-batches`
- **Status**: `PROPOSED`
- **Purpose**: Retrieves all payment batches created for a specific payroll run.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.view`
- **Idempotency**: Not required (`GET`).
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "batch-9988",
        "batchNumber": "PAY-202609-B1",
        "status": "validated",
        "paymentMode": "NEFT",
        "employeeCount": 142,
        "payableAmountFormatted": "₹1,03,50,000.00",
        "createdAt": "2026-09-24T10:00:00Z"
      }
    ]
  }
  ```
- **Errors**: `401`, `403`, `404`.

---

### 2.3 List All Payment Batches
- **Method**: `GET`
- **Path**: `/api/v2/payroll/payment-batches`
- **Status**: `PROPOSED`
- **Purpose**: Global list of payment batches for the Payment Hub `/dashboard/payroll/payments`.
- **Query Parameters**:
  - `page`: number (default 1)
  - `limit`: number (default 20)
  - `status`: PaymentBatchStatus (optional)
  - `periodId`: UUID (optional)
  - `search`: string (optional)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "items": [ /* PaymentBatch array */ ],
      "total": 42,
      "page": 1,
      "limit": 20
    }
  }
  ```
- **Errors**: `401`, `403`.

---

### 2.4 Get Payment Batch Details & Items
- **Method**: `GET`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}`
- **Status**: `PROPOSED`
- **Purpose**: Retrieves complete details, summary, audit log, and paginated employee items for a payment batch.
- **Query Parameters**:
  - `page`: number (default 1)
  - `limit`: number (default 50)
  - `status`: PaymentStatus (optional)
  - `search`: string (optional)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batch": { /* PaymentBatch */ },
      "items": [ /* PaymentBatchItem array */ ],
      "totalItems": 142,
      "validationSummary": {
        "totalIssues": 0,
        "errors": 0,
        "warnings": 0,
        "blockingCount": 0
      }
    }
  }
  ```
- **Errors**: `401`, `403`, `404`.
- **Security**: Account numbers must be returned masked (`••••••••1234`). Full account numbers are never returned in batch lists or batch item endpoints.

---

### 2.5 Validate Payment Batch Bank Details
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/validate`
- **Status**: `PROPOSED`
- **Purpose**: Validates all employee bank details in the batch against format and sanity rules.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.process` or `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**: `{}`
- **Validation Checks Performed**:
  1. `MISSING_ACCOUNT`: Employee has no active bank account record. (Severity: ERROR, Blocking: true)
  2. `INVALID_ACCOUNT_FORMAT`: Account number contains non-numeric or invalid length (<9 or >18 digits). (Severity: ERROR, Blocking: true)
  3. `INVALID_IFSC_FORMAT`: IFSC fails `^[A-Z]{4}0[A-Z0-9]{6}$`. (Severity: ERROR, Blocking: true)
  4. `IFSC_NOT_FOUND`: IFSC code does not match RBI master list. (Severity: ERROR, Blocking: true)
  5. `NAME_MISMATCH`: Bank account holder name differs substantially from official employee name. (Severity: WARNING, Blocking: false)
  6. `DUPLICATE_ACCOUNT`: Two different employees share the same bank account number. (Severity: ERROR, Blocking: true)
  7. `ZERO_NET_PAY`: Net pay is ₹0.00. (Severity: WARNING, Blocking: false)
  8. `NEGATIVE_NET_PAY`: Net pay is negative. (Severity: ERROR, Blocking: true)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "status": "validated", // or "validation_failed" if blocking errors exist
      "totalChecked": 142,
      "passedCount": 140,
      "errorCount": 1,
      "warningCount": 1,
      "hasBlockingErrors": true,
      "issues": [
        {
          "id": "iss-1",
          "employeeId": "emp-204",
          "employeeCode": "EMP204",
          "employeeName": "Rohit Verma",
          "field": "ifsc",
          "code": "INVALID_IFSC_FORMAT",
          "severity": "error",
          "blocking": true,
          "message": "IFSC code HDFC000000 is invalid",
          "suggestedAction": "Update employee bank details in employee profile"
        }
      ]
    }
  }
  ```
- **Errors**: `400`, `401`, `403`, `404`, `409` (if batch is already submitted/paid).
- **Backend Responsibility**: Run authoritative validation across all records; update batch status to `validated` or `validation_failed`.
- **Frontend Responsibility**: Display clear table with filter by severity; block progression to approval if `hasBlockingErrors` is true.

---

### 2.6 Approve Payment Batch (Maker-Checker Sign-off)
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/approve`
- **Status**: `PROPOSED`
- **Purpose**: Formal sign-off and approval of the payment batch by a checker (governance).
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.approve`
- **Maker-Checker Rule**: The user calling this endpoint **MUST NOT** be the `createdBy.id` of the batch.
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "remarks": "Reviewed and verified bank split. Approved for disbursement."
  }
  ```
- **Zod Request Schema**:
  ```typescript
  export const ApprovePaymentBatchRequestSchema = z.object({
    remarks: z.string().min(5, "Approval remarks must be at least 5 characters").max(500),
  });
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "status": "approved",
      "approvedBy": {
        "id": "user-checker-1",
        "name": "Priya Sharma",
        "email": "priya.sharma@aurix.example"
      },
      "approvedAt": "2026-09-24T10:30:00Z",
      "approvalRemarks": "Reviewed and verified bank split. Approved for disbursement."
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Remarks missing or too short.
  - `403 Forbidden`:
    - User lacks `payroll.approve` permission, OR
    - **Maker-Checker Violation**: User is the creator of the batch (`"The batch creator cannot approve this batch"`).
  - `409 Conflict`: Batch has unresolved blocking validation errors or is not in `validated` status.
- **Backend Responsibility**: Authoritatively verify `req.user.id !== batch.createdBy.id` and reject with `403` if matched.
- **Frontend Responsibility**: Disable Approve button for creator; show tooltip "The batch creator cannot approve this batch."

---

### 2.7 Reject Payment Batch (Send Back)
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/reject`
- **Status**: `PROPOSED`
- **Purpose**: Checker rejects batch and sends it back to Draft with required comments.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.approve`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "reason": "Please hold employee EMP204 due to bank mismatch before disbursement."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "status": "rejected",
      "remarks": "Please hold employee EMP204..."
    }
  }
  ```
- **Errors**: `400`, `401`, `403`, `404`, `409`.

---

### 2.8 Generate Bank Payment File
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/bank-file`
- **Status**: `PROPOSED`
- **Purpose**: Triggers server-side generation of the formatted bank payment file (HDFC, ICICI, SBI, or generic NEFT CSV).
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "format": "HDFC_CSV"
  }
  ```
- **Zod Request Schema**:
  ```typescript
  export const GenerateBankFileRequestSchema = z.object({
    format: BankFileFormatSchema,
  });
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "file-101",
      "batchId": "batch-9988",
      "fileName": "HDFC_SALARY_20260924_B1.csv",
      "format": "HDFC_CSV",
      "fileSizeBytes": 45120,
      "sha256Checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "generatedBy": { "id": "user-1", "name": "Vinit Sharma" },
      "generatedAt": "2026-09-24T10:45:00Z"
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Unsupported format.
  - `403 Forbidden`: Missing `payroll.disburse` permission.
  - `409 Conflict`: Batch is not in `approved` status.
- **Strict Rule**: **The frontend MUST NOT generate payment files.** All file layouts, header encodings, and checksums are strictly computed on the backend.

---

### 2.9 Download Bank Payment File
- **Method**: `GET`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/bank-file/download`
- **Status**: `PROPOSED`
- **Purpose**: Downloads the generated bank file.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse`
- **Response Headers**:
  - `Content-Type: text/csv` or `application/octet-stream`
  - `Content-Disposition: attachment; filename="HDFC_SALARY_20260924_B1.csv"`
  - `Cache-Control: no-store`
- **Response**: Binary / text file payload.
- **Frontend Responsibility**: Create object URL, trigger browser download, and **immediately invoke `URL.revokeObjectURL()`** to prevent memory leaks or security exposure.

---

### 2.10 Mark Batch as Submitted to Bank
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/submit`
- **Status**: `PROPOSED`
- **Purpose**: Updates batch status to `submitted` once file has been uploaded to corporate banking portal.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "bankReferenceNumber": "HDFC-CORP-99210",
    "submissionDate": "2026-09-24T11:00:00Z",
    "notes": "Uploaded via NetBanking Corporate portal"
  }
  ```
- **Zod Request Schema**:
  ```typescript
  export const SubmitPaymentBatchRequestSchema = z.object({
    bankReferenceNumber: z.string().min(3, "Bank reference number is required"),
    submissionDate: z.string().datetime(),
    notes: z.string().max(500).optional(),
  });
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "status": "submitted",
      "submittedAt": "2026-09-24T11:00:00Z"
    }
  }
  ```
- **Errors**: `400`, `401`, `403`, `409` (if file not generated or batch not approved).

---

### 2.11 Bank Response CSV Validation Preview
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/bank-response/preview`
- **Status**: `PROPOSED`
- **Purpose**: Uploads and parses the bank disbursement response CSV file, validating every row against the batch without modifying state.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse`
- **Request**: `multipart/form-data` with `file: File`.
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "fileName": "HDFC_DISBURSEMENT_REPORT.csv",
      "totalRows": 140,
      "validRows": 139,
      "invalidRows": 1,
      "duplicateRows": 0,
      "unmatchedRefs": 0,
      "summary": {
        "paidCount": 138,
        "failedCount": 1,
        "totalPaidPaise": 1025000000,
        "totalFailedPaise": 10000000
      },
      "errors": [
        {
          "rowNumber": 45,
          "paymentReference": "REF-EMP-88",
          "errorCode": "INVALID_STATUS",
          "errorMessage": "Status 'PARTIAL' not recognized; must be PAID or FAILED"
        }
      ],
      "previewToken": "prev-tok-abc123xyz"
    }
  }
  ```
- **Errors**: `400 Bad Request` (invalid CSV structure, missing columns), `403`, `404`, `422`.

---

### 2.12 Apply Bank Response (Disbursement Confirmation)
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/bank-response/apply`
- **Status**: `PROPOSED`
- **Purpose**: Confirms and applies the validated bank response. Updates employee payment items with UTR, credited date, and failure reasons.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "previewToken": "prev-tok-abc123xyz",
    "allowPartial": false
  }
  ```
- **Zod Request Schema**:
  ```typescript
  export const ApplyBankResponseRequestSchema = z.object({
    previewToken: z.string().min(1, "Preview token is required"),
    allowPartial: z.boolean().default(false),
  });
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "status": "processing",
      "appliedRows": 139,
      "paidCount": 138,
      "failedCount": 1,
      "updatedAt": "2026-09-24T12:00:00Z"
    }
  }
  ```
- **Errors**: `400`, `401`, `403`, `409` (token expired or batch already reconciled).

---

### 2.13 Reconcile Payment Batch
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/reconcile`
- **Status**: `PROPOSED`
- **Purpose**: Performs formal mathematical reconciliation of batch disbursement using integer paise.
- **Formula**: `expectedPaise == (paidPaise + failedPaise + heldPaise + processingPaise)`
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**: `{}`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "batch-9988",
      "runId": "run-1234",
      "expectedPaise": 1050000000,
      "paidPaise": 1025000000,
      "failedPaise": 10000000,
      "heldPaise": 15000000,
      "processingPaise": 0,
      "unmatchedPaise": 0,
      "isReconciled": true,
      "mismatchPaise": 0,
      "summaryText": "All 142 employee records fully accounted for.",
      "reconciledAt": "2026-09-24T12:30:00Z",
      "reconciledBy": "Priya Sharma"
    }
  }
  ```
- **Errors**:
  - `409 Conflict`: Paise mismatch detected. Run cannot be marked completed.
  - `422 Unprocessable Entity`: Unresolved records exist.
- **Authoritative Rule**: **The frontend NEVER marks a payroll run as Paid locally.** The payroll run becomes `Paid` ONLY when the backend confirms reconciliation and sets run status to `Paid`.

---

### 2.14 Hold / Release Employee Payment
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/items/{itemId}/hold`
- **Status**: `PROPOSED`
- **Purpose**: Places an individual employee payment on hold prior to bank submission.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "reason": "Suspected banking details change; verifying with HR."
  }
  ```
- **Zod Request Schema**:
  ```typescript
  export const HoldPaymentItemRequestSchema = z.object({
    reason: z.string().min(5, "Mandatory hold reason of at least 5 characters is required"),
  });
  ```
- **Response**: `200 OK` with updated `PaymentBatchItem`.

---

### 2.15 Release Held Employee Payment
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/items/{itemId}/release`
- **Status**: `PROPOSED`
- **Purpose**: Releases a previously held employee payment.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "remarks": "Bank details verified by HR department."
  }
  ```
- **Response**: `200 OK` with updated `PaymentBatchItem`.

---

### 2.16 Retry Failed Employee Payment
- **Method**: `POST`
- **Path**: `/api/v2/payroll/payment-batches/{batchId}/items/{itemId}/retry`
- **Status**: `PROPOSED`
- **Purpose**: Queues a failed employee payment for retry in a new supplementary batch.
- **Permission**: `payroll.disburse`
- **Idempotency**: **Required** via `Idempotency-Key`.
- **Request Body**:
  ```json
  {
    "updatedBankDetails": {
      "accountNumber": "9876543210123",
      "ifscCode": "HDFC0001234",
      "accountHolderName": "Rohit Verma"
    },
    "reason": "Corrected account number"
  }
  ```
- **Response**: `200 OK` with retry acknowledgement and new tracking reference.

---

### 2.17 List Company Source Bank Accounts
- **Method**: `GET`
- **Path**: `/api/v2/payroll/companies/{companyId}/bank-accounts`
- **Status**: `PROPOSED`
- **Purpose**: Retrieves active company bank accounts configured for salary disbursement.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.view` or `payroll.disburse`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "acc-hdfc-01",
        "companyId": "comp-1",
        "bankName": "HDFC Bank",
        "accountHolderName": "Aurix Technologies India Pvt Ltd",
        "accountNumberMasked": "••••••••4431",
        "accountType": "current",
        "ifscCode": "HDFC0000060",
        "branchName": "Koramangala, Bangalore",
        "currency": "INR",
        "isPrimary": true,
        "isActive": true,
        "supportedPaymentModes": ["NEFT", "RTGS", "IMPS"]
      }
    ]
  }
  ```
- **Security**: Must never return full unmasked account numbers.

---

### 2.18 Reveal Employee Bank Account (Audited Access)
- **Method**: `POST`
- **Path**: `/api/v2/payroll/employees/{employeeId}/reveal-bank-account`
- **Status**: `PROPOSED`
- **Purpose**: Temporarily returns unmasked bank account details for verification, generating an unalterable audit log entry.
- **Authentication**: Bearer Token required.
- **Permission**: `payroll.compensation.view` (or admin only)
- **Request Body**:
  ```json
  {
    "reason": "Validating failed disbursement for UTR reconciliation"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "employeeId": "emp-204",
      "accountNumber": "50100234567891",
      "ifscCode": "HDFC0001234",
      "revealedAt": "2026-09-24T12:45:00Z",
      "autoHideSeconds": 15
    }
  }
  ```
- **Frontend Responsibility**: Auto-hide after 15 seconds; never cache unmasked number in persistent state or localStorage.

---

## 3. Existing Endpoints Verification Matrix

| Endpoint | Method | Status | Backend Verification Status |
|----------|--------|--------|------------------------------|
| `/api/v2/payroll/cycles` | GET, POST | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/payroll/dashboard` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/payroll/run` | POST | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/generation-status` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/preview` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/validation` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/approval` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/approve` | POST | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/finalization` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/finalize` | POST | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/my-payslips` | GET | CONFIRMED-IN-CODE | Returns 404 in current environment |
| `/api/v2/payroll/runs/{id}/payment-batches` | POST, GET | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/validate` | POST | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/approve` | POST | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/bank-file` | POST, GET | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/submit` | POST | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/bank-response/preview` | POST | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/bank-response/apply` | POST | PROPOSED | New Part 1 Payment contract |
| `/api/v2/payroll/payment-batches/{id}/reconcile` | POST | PROPOSED | New Part 1 Payment contract |
