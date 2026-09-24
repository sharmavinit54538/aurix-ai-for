# PAYROLL BACKEND TODO & IMPLEMENTATION ROADMAP

Generated: 2026-09-24  
Target Scope: Complete Lifecycle Parts 1 → 5 (Payment, Reports, Compensation, Variable Inputs, Statutory, F&F, ESS, Production Hardening)

---

## 1. Executive Summary

All frontend payroll pages, shared lifecycle steppers, API service abstractions, integer paise calculations, and security guards across Parts 1 through 5 have been fully implemented, strictly typed, and verified (passing 72 unit/integration tests and production build with zero errors).

Because the live backend environment currently returns HTTP `404` / `501` for payroll endpoints, all frontend pages render honest, transparent `Feature unavailable — backend pending` banners and clean empty states rather than using fake/dummy data.

This document lists the exact backend contracts and services required from the backend engineering team to make each module fully operational.

---

## 2. BACKEND IMPLEMENTATION REQUIRED BY MODULE

### 2.1 Part 1: Payment & Disbursement Engine
- [ ] **Payment Batch Lifecycle API**:
  - `POST /api/v2/payroll/runs/{runId}/payment-batches` (Create batch from finalized run)
  - `GET /api/v2/payroll/runs/{runId}/payment-batches` (List batches for a run)
  - `GET /api/v2/payroll/payment-batches` (Paginated list of all payment batches)
  - `GET /api/v2/payroll/payment-batches/{batchId}` (Batch detail + employee line items)
- [ ] **Bank Validation Engine**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/validate`
  - Validation rules: Account format, IFSC format & RBI database validation, name matching, duplicate detection.
- [ ] **Maker-Checker Governance API**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/approve`
  - `POST /api/v2/payroll/payment-batches/{batchId}/reject`
  - **Enforce**: Reject approval with HTTP `403 Forbidden` if `req.user.id === batch.createdBy.id`.
- [ ] **Bank File Generation & Download**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/bank-file`
  - `GET /api/v2/payroll/payment-batches/{batchId}/bank-file/download`
  - Generate HDFC CSV, ICICI Excel/CSV, SBI TXT, Generic NEFT formats with SHA-256 checksums.
- [ ] **Bank Response Import & Reconciliation Engine**:
  - `POST /api/v2/payroll/payment-batches/{batchId}/bank-response/preview`
  - `POST /api/v2/payroll/payment-batches/{batchId}/bank-response/apply`
  - `POST /api/v2/payroll/payment-batches/{batchId}/reconcile` (Strict integer paise reconciliation: `expectedPaise == paid + failed + held + processing`).

---

### 2.2 Part 2: Reports, Exports, Salary Structure & Compensation
- [ ] **Reports Execution Engine**:
  - `GET /api/v2/payroll/reports` (Server-side pagination, sorting, and dynamic column definitions)
  - Implement 9 canonical reports: `payroll_register`, `salary_statement`, `department_payroll`, `cost_center_payroll`, `bank_advice`, `payroll_variance`, `headcount_report`, `ytd_payroll`, `accounting_export`.
- [ ] **Report File Export**:
  - `GET /api/v2/payroll/reports/{key}/export` (Generate CSV/XLSX with sanitized formula prefixes `', =, +, -, @`).
- [ ] **Pay Components Master**:
  - `GET /api/v2/payroll/salary-structures/components`
  - `POST /api/v2/payroll/salary-structures/components`
- [ ] **Salary Structure Templates**:
  - `GET /api/v2/payroll/salary-structures`
  - `POST /api/v2/payroll/salary-structures`
  - `PUT /api/v2/payroll/salary-structures/{id}`
- [ ] **Employee Compensation & Maker-Checker Revisions**:
  - `GET /api/v2/payroll/compensation`
  - `POST /api/v2/payroll/compensation/revisions`
  - `POST /api/v2/payroll/compensation/revisions/{id}/approve`
  - `POST /api/v2/payroll/compensation/revisions/{id}/reject`
- [ ] **Bulk Compensation Import**:
  - `POST /api/v2/payroll/compensation/bulk-preview`
  - `POST /api/v2/payroll/compensation/bulk-apply`

---

### 2.3 Part 3: Variable Payroll Inputs & Statutory Compliance
- [ ] **Variable Inputs Engine**:
  - `GET /api/v2/payroll/variable-inputs`
  - `POST /api/v2/payroll/variable-inputs`
  - `DELETE /api/v2/payroll/variable-inputs/{id}`
  - `POST /api/v2/payroll/variable-inputs/bulk-preview`
  - `POST /api/v2/payroll/variable-inputs/bulk-apply`
  - **Lock Guard**: Reject adjustments with HTTP `403` if target period is closed or finalized.
- [ ] **Dynamic Statutory Configuration (India Context)**:
  - `GET /api/v2/payroll/statutory/config`
  - Return dynamic PF rates/caps, ESI rates/caps, State PT slabs (e.g. Karnataka, Maharashtra), and Tax Regimes (New vs Old).
- [ ] **Statutory Summary & Returns Export**:
  - `GET /api/v2/payroll/statutory/summary`
  - `GET /api/v2/payroll/statutory/export/{type}` (`pf-ecr`, `esi-return`, `pt-form5`, `tds-24q`).

---

### 2.4 Part 4: Full & Final (F&F) Settlement & Employee Self-Service (ESS)
- [ ] **F&F Exit Settlement Engine**:
  - `GET /api/v2/payroll/full-and-final`
  - `POST /api/v2/payroll/full-and-final` (Initiate exit settlement calculation)
  - `POST /api/v2/payroll/full-and-final/{id}/approve` (Checker approval)
  - `POST /api/v2/payroll/full-and-final/{id}/reject` (Rejection with mandatory reason)
  - `POST /api/v2/payroll/full-and-final/{id}/finalize` (Lock settlement; prevents duplicate finalization)
  - `GET /api/v2/payroll/full-and-final/{id}/statement/download` (Download backend-generated settlement statement PDF)
- [ ] **Employee Self-Service (ESS) Endpoints**:
  - `GET /api/v2/payroll/employee/dashboard` (Strict token-scoped personal summary: YTD gross/net, tax regime, masked bank details)
  - `GET /api/v2/payroll/my-payslips` (Paginated personal payslip history)
  - `GET /api/v2/payroll/my-payslips/{runId}/download` (Download employee's own signed payslip PDF)
  - `GET /api/v2/payroll/employee/provision-slips` (Provisional salary slips prior to finalization)

---

### 2.5 Security, Auditing & Idempotency Infrastructure
- [ ] **Idempotency Filter**:
  - Read `Idempotency-Key` header on all `POST`/`PUT`/`DELETE` endpoints with 24-hour cache.
- [ ] **Data Masking in Output**:
  - Bank accounts masked by default (`••••••••1234`).
  - Zero sensitive account/PAN data in backend application logs.
- [ ] **HTTP Headers**:
  - Return `Cache-Control: no-store, no-cache, must-revalidate` and `Pragma: no-cache` on all payroll and banking API responses.

---

## 3. FRONTEND STATUS SUMMARY (Parts 1 → 5 Complete)

- [x] AS-IS Architecture Audit (`docs/PAYROLL_AS_IS.md`)
- [x] Completion Plan & Lifecycle State Machine (`docs/PAYROLL_COMPLETION_PLAN.md`)
- [x] Exhaustive Backend Contracts (`docs/PAYROLL_BACKEND_CONTRACT.md`)
- [x] Backend TODO & Readiness Tracker (`docs/PAYROLL_BACKEND_TODO.md`)
- [x] Shared 9-step `PayrollStepper` component with full keyboard navigation and strict transition guards
- [x] Part 1: Payment & Disbursement (`PayrollRunPaymentPage`, `PaymentBatchListPage`, `PaymentBatchDetailPage`)
- [x] Part 2: Reports & Exports (`PayrollReportsPage`, `9` canonical report definitions, safe CSV export)
- [x] Part 2: Salary Structure & Compensation (`SalaryStructurePage`, `EmployeeCompensationPage`, bulk CSV preview)
- [x] Part 3: Variable Payroll Inputs (`VariableInputsPage`, bulk adjustment wizard, closed period guards)
- [x] Part 3: Dynamic Statutory Compliance (`StatutoryCompliancePage`, zero hardcoded tax rates/slabs)
- [x] Part 4: Full & Final Settlement (`FullAndFinalPage`, maker-checker approval, exit statement download)
- [x] Part 4: Employee Self-Service (`EmployeeSelfServicePayrollPage`, strict self-isolation, masked bank account)
- [x] Part 5: Production Hardening (Strict TypeScript, zero production mock data, safe CSV exports, default-deny RBAC)
- [x] Test Suite: 10 test suites, 72 tests passing cleanly in Vitest
- [x] Build: Vite production bundle builds in 4.13s with exit code 0

---

## 4. USER DECISIONS REQUIRED

1. **Prioritized Corporate Bank Formats**: Which bank format should be prioritized for V1 bank file validation (HDFC CMS, ICICI CIB, SBI Corporate, or Generic RBI NEFT CSV)?
2. **Direct Banking STP API**: Will V1 support Open Banking APIs (e.g. Cashfree/RazorpayX/ICICI Eazypay) or exclusively manual file upload?
3. **Provisional Slips Timeline**: When will the backend team deploy the `/api/v2/payroll/employee/provision-slips` endpoint?
