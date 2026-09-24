# PAYROLL BACKEND TODO & IMPLEMENTATION ROADMAP

Generated: 2026-09-24  
Target Scope: Payroll Part 1 (Payment / Disbursement) & Core Lifecycle Integration

---

## 1. Executive Summary

During our repository audit and Part 1 implementation, all frontend payroll pages and API services were verified against the live environment. Currently, payroll endpoints return HTTP `404` or are un-deployed.

To make the Payment / Disbursement flow operational in production, the backend team must implement the contracts specified in `docs/PAYROLL_BACKEND_CONTRACT.md`.

---

## 2. BACKEND IMPLEMENTATION REQUIRED

### 2.1 Payment & Disbursement Engine
- [ ] **Payment Batch Lifecycle API**:
  - `POST /api/v2/payroll/runs/{runId}/payment-batches` (Create batch from finalized run)
  - `GET /api/v2/payroll/runs/{runId}/payment-batches` (List batches for a run)
  - `GET /api/v2/payroll/payment-batches` (Paginated list of all payment batches)
  - `GET /api/v2/payroll/payment-batches/{batchId}` (Batch detail + employee line items)
- [ ] **Bank Validation Engine**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/validate`
  - Validate against:
    - Missing account number
    - Invalid account length / format
    - Invalid IFSC regex (`^[A-Z]{4}0[A-Z0-9]{6}$`)
    - IFSC existence in RBI master database
    - Account holder name vs employee official name similarity
    - Duplicate bank account detection across active employees
    - Zero net pay (warning)
    - Negative net pay (blocking error)
- [ ] **Maker-Checker Governance & Approval API**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/approve`
  - `POST /api/v2/payroll/payment-batches/{batchId}/reject`
  - **Hard backend enforcement**: Reject approval with HTTP `403 Forbidden` if `req.user.id === batch.createdBy.id`.
- [ ] **Server-Side Bank File Generation**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/bank-file`
  - `GET /api/v2/payroll/payment-batches/{batchId}/bank-file/download`
  - Generate bank-specific layouts (HDFC CSV, ICICI Excel/CSV, SBI TXT, Generic NEFT CSV).
  - Compute SHA-256 checksum and file size upon generation for tamper detection.
- [ ] **Submission Tracking**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/submit` (Record bank reference number, submission timestamp).
- [ ] **Bank Response Import Engine**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/bank-response/preview`
  - `POST /api/v2/payroll/payment-batches/{batchId}/bank-response/apply`
  - Parse bank response CSV, validate UTR presence, extract transaction dates, map status (`PAID`, `FAILED`, `REVERSED`).
- [ ] **Reconciliation Engine**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/reconcile`
  - Integer paise reconciliation:
    `expectedPaise == (paidPaise + failedPaise + heldPaise + processingPaise)`
  - Transition payroll run status to `Paid` ONLY when 100% of paise is mathematically reconciled.
- [ ] **Item-Level Operations**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/items/{itemId}/hold` (Mandatory hold reason).
  - `POST /api/v2/payroll/payment-batches/{batchId}/items/{itemId}/release`
  - `POST /api/v2/payroll/payment-batches/{batchId}/items/{itemId}/retry` (Queue failed disbursement for re-run).

### 2.2 Security, Auditing & Idempotency
- [ ] **Backend Idempotency Enforcement**:
  - Implement Redis or Postgres-backed idempotency filter reading `Idempotency-Key` header on all mutation endpoints (`POST`, `PUT`, `DELETE`).
  - Cache responses for 24 hours to prevent duplicate disbursement batches or duplicate bank submissions.
- [ ] **Sensitive Data Masking**:
  - Account numbers masked by default in all API JSON outputs (`••••••••1234`).
  - Strict exclusion of bank accounts, PAN, and salary amounts from application logs and tracing.
- [ ] **Audited Bank Reveal Endpoint**:
  - `POST /api/v2/payroll/employees/{employeeId}/reveal-bank-account`
  - Require justification reason; log user ID, timestamp, IP address, and employee ID to an append-only security audit log.
- [ ] **Re-authentication / Step-Up Auth**:
  - Endpoint for re-verifying user password or 2FA OTP prior to authorizing batch payment approval or file generation.
- [ ] **HTTP Headers**:
  - Set `Cache-Control: no-store, no-cache, must-revalidate` and `Pragma: no-cache` on all financial and banking responses.

### 2.3 Bank & Company Master Data
- [ ] **Source Bank Account API**:
  - `GET /api/v2/payroll/companies/{companyId}/bank-accounts`
  - Support configuring multiple company disbursement accounts with payment mode restrictions.
- [ ] **Master Bank Format Support**:
  - Implement export formatters for:
    - Generic NEFT/RTGS CSV
    - HDFC Corporate NetBanking CMS format
    - ICICI Corporate CIB file format
    - SBI Corporate Payment format

### 2.4 Notifications (Post-Disbursement)
- [ ] **Payment Advice Notification Pipeline**:
  - Email notification with attached password-protected payslip PDF upon successful payment confirmation.
  - SMS notification with credited amount, bank name, and UTR number.

---

## 3. FRONTEND IMPLEMENTATION REQUIRED (Part 1 Scope)

- [x] Comprehensive AS-IS payroll audit (`docs/PAYROLL_AS_IS.md`).
- [x] Part 1 architecture & completion plan (`docs/PAYROLL_COMPLETION_PLAN.md`).
- [x] Proposed Payment & Disbursement backend contract (`docs/PAYROLL_BACKEND_CONTRACT.md`).
- [x] Backend TODO tracking documentation (`docs/PAYROLL_BACKEND_TODO.md`).
- [ ] Shared 9-step `PayrollStepper` component (`src/features/payroll/components/PayrollStepper.tsx`).
- [ ] Payment types, status enums, and Zod schemas (`src/features/payroll/types/payment.ts`).
- [ ] Payment API module (`src/features/payroll/api/paymentApi.ts`).
- [ ] Idempotency, money, and CSV injection utilities (`src/features/payroll/utils/`).
- [ ] Payment batch wizard, validation table, maker-checker approval, and reconciliation UI.
- [ ] Route definitions for:
  - `/dashboard/payroll/runs/$runId/payment` (Create batch)
  - `/dashboard/payroll/payments` (Payment list)
  - `/dashboard/payroll/payments/$batchId` (Batch detail & reconciliation)
- [ ] Permission updates in `src/services/sidebarApi.ts` and `src/lib/route-guards.ts`.
- [ ] Unit & integration tests for payment flows, maker-checker, money calculations, and error resilience.

---

## 4. USER DECISION REQUIRED

The following questions require business or architectural decisions from project stakeholders:

1. **Bank File Formats**:
   - Which corporate banking partners are prioritized for launch? (e.g., HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, or Generic RBI NEFT CSV format only for V1?)
2. **Direct Banking API vs File-Based**:
   - Does Aurix plan to integrate direct Open Banking APIs (e.g., RazorpayX, Cashfree, ICICI Eazypay, HDFC Corporate API) for automated straight-through processing (STP), or will V1 exclusively rely on corporate bank file download + manual upload?
3. **Maker-Checker Roles**:
   - Is maker-checker strictly required to be two different individuals with the `payroll.approve` role, or should specific hierarchical roles be enforced (e.g., HR creates batch, Finance Manager / CFO approves)?
4. **Employee Bank Account Reveal Policy**:
   - Should viewing unmasked employee bank details require 2FA re-authentication or is role check (`payroll.compensation.view` / `admin`) + reason audit sufficient?
5. **Partial Disbursement vs All-or-Nothing**:
   - If 2 out of 100 employees fail disbursement in the bank response, should the batch allow marking 98 employees as Paid while isolating the 2 failed for a supplementary batch, or should the entire batch remain in Processing until all are resolved?
