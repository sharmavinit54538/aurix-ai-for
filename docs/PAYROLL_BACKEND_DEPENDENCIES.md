# Payroll Backend Dependencies

> Document summarizing backend endpoints that are required but not yet implemented or have known issues.

## Phase 1: Critical Dependencies

### 1. Variable Inputs API
- **GET /api/v2/payroll/variable-inputs** - List variable inputs with filters (periodId, type, status, search)
- **POST /api/v2/payroll/variable-inputs** - Create variable input (requires periodId, employeeId, type, amountPaise, description)
- **POST /api/v2/payroll/variable-inputs/{id}/approve** - Approve variable input
- **POST /api/v2/payroll/variable-inputs/{id}/reject** - Reject variable input
- **POST /api/v2/payroll/variable-inputs/bulk-preview** - Preview bulk CSV upload
- **POST /api/v2/payroll/variable-inputs/bulk-apply** - Apply bulk preview

### 2. Payroll Dashboard API
- **GET /payroll/dashboard** - Dashboard data (accepts `month` and `year` query params instead of `periodId`)
  - Required response: `{ period, summary, status, readiness, issues, recentRuns }`

### 3. Payroll Run API
- **POST /payroll/run** - Trigger provisional payroll run
  - Request: `{ periodId }`
  - Response: `{ runId, jobId, status, message, success: true }`
  - Must return 409 with message if duplicate run exists for period
- **GET /api/v2/payroll/runs/{runId}/generation-status** - Polling endpoint for run status
  - Accepts optional `job_id` query param
  - Response: `{ runId, jobId, periodId, periodName, status, progress, currentStep, employees, steps, error, validationIssues, startedAt, completedAt }`
- **POST /api/v2/payroll/runs/{runId}/cancel** - Cancel draft/queued run (replaces DELETE)
- **POST /api/v2/payroll/runs/{runId}/process** - Retry failed run
- **GET /api/v2/payroll/runs/{runId}/validation-issues** - Get validation issues for a run

### 4. Payroll Periods API
- **POST /api/v1/payroll/cycles** - Create period
  - Required fields: `start_date`, `end_date`, `pay_date`, `processing_date`, `payment_date`
  - Derived: `period_month`, `period_year` from startDate if not provided
  - Must return 422 with `detail` array for validation errors (FastAPI format)
- **GET /api/v2/payroll/cycles** - List periods (pagination, filters: status, year, month, search)
  - Response: `{ items: PayrollPeriod[], total, page, limit, totalPages }`
- **DELETE /api/v2/payroll/cycles/{id}** - Void period
- **POST /api/v2/payroll/cycles/{id}/lock** - Lock period
- **POST /api/v2/payroll/cycles/{id}/reopen** - Reopen period

### 5. File Download APIs (All must return Content-Disposition and Content-Type headers)
- **GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download** - Payslip download
- **GET /api/v2/payroll/my-payslips/{runId}/download** - ESS payslip download
- **GET /api/v2/payroll/full-and-final/{fnfId}/statement/download** - F&F statement download
- **GET /api/v2/payroll/payment-batches/{batchId}/bank-file/download** - Bank file download
- **GET /api/v2/payroll/reports/exports/{exportId}/download** - Report export download

## Phase 2: Periods Source of Truth
- **Single endpoint**: `/api/v2/payroll/cycles` for all period operations
- **Legacy `/payroll/periods` endpoints removed** - frontend no longer falls back to v1

## Phase 3: Data Normalization

### Validation Issues
- Backend returns per-employee array: `[{employee_id, name, issues: ["msg1", "msg2"]}, ...]`
- Frontend flattens to one issue per string with employee context
- New canonical shape supported: `{id, employee_id, employee_name, department, severity, blocking, code, message}`

### Employee Normalization
- Missing `employee_name` shows "[Name missing from API]" in dev, falls back to employee_code in prod
- Never silently prints "Unnamed Employee"

### Processing Page
- Polls with exponential backoff (3s → 30s)
- Stops on terminal statuses: COMPLETED, PROVISION_GENERATED, FAILED, APPROVED, FINALIZED, PAID
- Retry button only for FAILED/DRAFT runs

### Payments
- Batch statuses: DRAFT, VALIDATED, APPROVED, SUBMITTED, PARTIAL, RECONCILED
- Maker-checker: creator cannot approve
- Reconciliation uses integer paise arithmetic

### ESS (Employee Self-Service)
- 404 on payslips = "No payslips yet" (not error)
- Only show payslips with real status from backend

### Salary Structure
- POST /api/v1/payroll/salary-structures returns created structure
- Frontend re-fetches list and verifies new item appears

## Phase 4: Wired UI Actions

### F&F Detail Drawer
- Uses `getFnfDetail(fnfId)` - implemented

### Reject F&F
- Reject button with reason dialog - implemented
- Uses `rejectFnf(fnfId, reason)` - implemented

### Compensation Revision Approve/Reject
- Approve/Reject buttons on pending revisions in history modal - implemented
- Uses `approveCompensationRevision` / `rejectCompensationRevision` - implemented

### Payment Batch Actions
- Hold/Release/Retry buttons on items - API methods exist, UI wiring needed
- Reconcile button on batch detail - API method exists, UI wiring needed

### Settings
- Payroll settings API endpoints exist but unused in PayrollSection.tsx

## Phase 5: Safety & UX

### Idempotency
- All mutations send `Idempotency-Key` header
- 409 responses show server message (e.g., "duplicate run for this month")

### No Fake Defaults
- No hardcoded "current-active-period" or default amounts
- Period selector required before create actions

### Bank Details Masking
- Account numbers masked everywhere except audited reveal dialog
- CSV protection for exports

### Page States
- All payroll pages have: loading, empty, error (with status code), permission-denied (401/403)
- No infinite spinners

### Permissions on Buttons
- payroll.view, payroll.process, payroll.approve, payroll.finalize, payroll.disburse, payroll.reports
- payroll.compensation.*, payroll.statutory - enforced on action buttons

## Known Issues / Future Backend Work

1. **Preview/Review endpoints**: Currently fallback to aggregation; need dedicated `/api/v2/payroll/runs/{runId}/preview` and `/approval` endpoints
2. **Validation re-run**: `/api/v2/payroll/runs/{runId}/validate` needs implementation
3. **Finalization**: `/api/v2/payroll/runs/{runId}/finalize` needs implementation
4. **Payment batch hold/release/retry**: Individual item actions need backend endpoints
5. **Bank response import**: CSV preview and apply endpoints needed
6. **Compensation revision history**: Per-employee revision list endpoint
7. **Salary structure CRUD**: Full CRUD for structure templates
8. **Statutory returns**: ECR/TDS/ESI/PT return generation endpoints

---

**Last Updated**: Phase 5 completion
**Status**: Frontend robust against missing backend; shows real errors instead of fake data