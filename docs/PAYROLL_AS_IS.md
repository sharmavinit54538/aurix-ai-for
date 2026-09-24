# PAYROLL AS-IS AUDIT

Generated: 2026-09-24

---

## 1. Current Payroll Pages

### 1.1 PayrollDashboardPage (`/dashboard/payroll/`)
- **Route**: `/dashboard/payroll/`
- **Purpose**: Primary payroll hub showing period selector, summary metrics, readiness checks, issues, recent runs
- **Current UI**: 
  - Period selector dropdown (loads from `/api/v2/payroll/cycles` or `/payroll/periods`)
  - 5 stat cards: Employees, Gross Payroll, Total Deductions, Net Payroll, Employer Cost
  - Payroll Status card (shows current run status)
  - Payroll Readiness grid (7 areas: Employee Data, Salary Structures, Attendance, Leave Data, Overtime, Loans/Advances, Tax/Statutory)
  - Issues tabs (Errors/Warnings from backend)
  - Recent Payroll Runs table with View action
  - "Run Payroll" button (opens confirmation modal)
- **API Calls**: 
  - `payrollApi.getPeriods()` → `/api/v2/payroll/cycles` (fallback `/payroll/periods`)
  - `payrollApi.getDashboard(periodId)` → `/payroll/dashboard`
  - `payrollApi.runPayroll(periodId)` → `/payroll/run`
- **State**: Local React state (periods, selectedPeriodId, dashboardData, loading flags)
- **Loading**: Skeleton loaders for cards and tables
- **Error**: Shows "Backend payroll service unavailable (404)" banner with Retry button
- **Empty**: "No payroll periods available", "No payroll runs yet"
- **Permissions**: `payroll.view` or `payroll.process` (admin/hr roles)
- **Missing Backend Dependency**: Dashboard endpoint returns 404 in current environment

### 1.2 PayrollPeriodsPage (`/dashboard/payroll/periods`)
- **Route**: `/dashboard/payroll/periods`
- **Purpose**: CRUD for payroll periods/cycles
- **Current UI**:
  - Search, status filter, year filter (dynamic from data)
  - Paginated table: Period Name, Start/End/Pay Dates, Employee Count, Status, Created Date, Actions
  - Create Period modal (month/year selectors, dates, remarks)
  - Lock/Unlock action per period
  - Void action per period
  - View Details modal
- **API Calls**:
  - `payrollApi.getPeriodsList(params)` → `/api/v2/payroll/cycles`
  - `payrollApi.createPeriod(payload)` → `/api/v2/payroll/cycles`
  - `payrollApi.lockPeriod(id)` → `/api/v2/payroll/cycles/{id}/lock`
  - `payrollApi.reopenPeriod(id)` → `/api/v2/payroll/cycles/{id}/reopen`
  - `payrollApi.voidPeriod(id)` → `/api/v2/payroll/cycles/{id}/void`
- **State**: Local React state with pagination, filters, modals
- **Loading**: Table skeletons
- **Error**: 404 banner, 401 auth error
- **Empty**: "No payroll periods found" with Create button
- **Permissions**: `payroll.view` for view, `payroll.process`/`payroll.create` for create/lock/void
- **Missing Backend Dependency**: All period endpoints return 404 currently

### 1.3 PayrollProcessingPage (`/dashboard/payroll/runs/$runId/processing`)
- **Route**: `/dashboard/payroll/runs/$runId/processing`
- **Purpose**: Live monitoring of payroll calculation run
- **Current UI**:
  - 4 metric cards: Period, Status, Employees Processed, Progress %
  - Prominent status area with progress bar (real backend % or indeterminate)
  - 12-step conceptual pipeline display (backend steps if available, else static reference)
  - Validation issues panel (if reported by backend)
  - Next action card when completed (link to Preview)
  - Cancel Run / Retry Calculation modals with confirmation
- **API Calls**:
  - `payrollApi.getPayrollRunStatus(runId)` → `/api/v2/payroll/runs/{runId}/generation-status` (polling every 4s)
  - `payrollApi.cancelPayrollRun(runId)` → `DELETE /api/v2/payroll/runs/{runId}`
  - `payrollApi.retryPayrollRun(runId)` → `POST /api/v2/payroll/runs/{runId}/process`
- **State**: Local state + polling interval ref + in-flight guard ref
- **Loading**: Initial skeleton, then live data
- **Error**: 404 "Processing service unavailable", 401/403 auth
- **Empty**: N/A (runId required)
- **Permissions**: `payroll.view` to view, `payroll.process` for cancel/retry
- **Missing Backend Dependency**: Generation status endpoint returns 404

### 1.4 PayrollPreviewPage (`/dashboard/payroll/runs/$runId/preview`)
- **Route**: `/dashboard/payroll/runs/$runId/preview`
- **Purpose**: Review provisional payroll calculations before approval
- **Current UI**:
  - 6 summary stat cards (Employees, Gross, Earnings, Deductions, Net, Employer Cost)
  - Validation findings panel (errors/warnings from preview endpoint)
  - Paginated/filtered employee table (search, dept filter, validation filter, sorting)
  - Employee detail slide-over sheet (earnings, deductions, attendance, statutory, YTD)
  - Recalculate Payroll button (triggers recalculation)
  - Next step: Review & Approval link
- **API Calls**:
  - `payrollApi.getPayrollPreview(runId)` → `/api/v2/payroll/runs/{runId}/preview`
  - `payrollApi.getRunEmployees(runId, params)` → `/api/v2/payroll/runs/{runId}/employees`
  - `payrollApi.getRunEmployeeDetail(runId, empId)` → `/api/v2/payroll/runs/{runId}/employees/{employeeId}`
  - `payrollApi.recalculatePayroll(runId)` → `/api/v2/payroll/runs/{runId}/process`
- **State**: Local state for preview, employees, pagination, filters, detail sheet
- **Loading**: Skeletons for summary and table
- **Error**: 404 preview unavailable banner
- **Empty**: "No payroll results available" or filter empty state
- **Permissions**: `payroll.view`, `payroll.process` for recalculate
- **Missing Backend Dependency**: Preview and employees endpoints return 404

### 1.5 PayrollValidationPage (`/dashboard/payroll/runs/$runId/validation`)
- **Route**: `/dashboard/payroll/runs/$runId/validation`
- **Purpose**: Detailed validation issues and rule violations
- **Current UI**:
  - Summary cards: Total Findings, Errors, Warnings, Affected Employees, Validation Status
  - Advanced filters: Search, Severity, Category, Department, Status, Blocking
  - Paginated issues table with severity badges, employee link, category, component, blocking flag
  - Issue detail slide-over sheet with full attributes
  - Recalculate Run / Revalidate Payroll buttons
- **API Calls**:
  - `payrollApi.getPayrollValidation(runId)` → `/api/v2/payroll/runs/{runId}/validation`
  - `payrollApi.runPayrollValidation(runId)` → `POST /api/v2/payroll/runs/{runId}/validate`
  - `payrollApi.recalculatePayroll(runId)` → `/api/v2/payroll/runs/{runId}/process`
- **State**: Local state with client-side filtering/pagination
- **Loading**: Skeletons
- **Error**: 404 validation unavailable
- **Empty**: "All Payroll Validations Passed" success state
- **Permissions**: `payroll.view`, `payroll.process` for recalculate/revalidate
- **Missing Backend Dependency**: Validation endpoint returns 404

### 1.6 PayrollApprovalPage (`/dashboard/payroll/runs/$runId/approval`)
- **Route**: `/dashboard/payroll/runs/$runId/approval`
- **Purpose**: Formal review and approval sign-off (Step 7)
- **Current UI**:
  - Approved/Rejected banner if already decided
  - 6 summary stat cards (backend totals only)
  - Left column: Validation Readiness (stats, blocking errors alert), Employee Payroll Review, Audit Trail
  - Right column: Review Checklist (5 items), Governance Decision Box (approval eligibility, action buttons)
  - Approve / Send Back modals with comments/reason
- **API Calls**:
  - `payrollApi.getPayrollReview(runId)` → `/api/v2/payroll/runs/{runId}/approval` (fallback aggregates preview+validation+status)
  - `payrollApi.approvePayroll(runId, payload)` → `POST /api/v2/payroll/runs/{runId}/approve`
  - `payrollApi.rejectPayroll(runId, payload)` → `POST /api/v2/payroll/runs/{runId}/reject`
- **State**: Local state with modals
- **Loading**: Skeletons
- **Error**: 404 review unavailable
- **Empty**: N/A (runId required)
- **Permissions**: `payroll.view` for view, `payroll.approve` for approve/reject (only admin in current DEFAULT_ROLE_PERMISSIONS)
- **Missing Backend Dependency**: Approval endpoint returns 404; maker-checker not enforced by backend yet

### 1.7 PayrollFinalizationPage (`/dashboard/payroll/runs/$runId/finalize`)
- **Route**: `/dashboard/payroll/runs/$runId/finalize`
- **Purpose**: Finalize and lock payroll run (Step 8)
- **Current UI**:
  - Finalized & Locked banner if already finalized
  - 6 summary stat cards
  - Left: Finalization Readiness Check (3 prerequisites), Lock Specifications (4 policy cards)
  - Right: Finalization Execution panel with eligibility, Finalize modal with notes, audit warning
- **API Calls**:
  - `payrollApi.getPayrollFinalization(runId)` → `/api/v2/payroll/runs/{runId}/finalization`
  - `payrollApi.finalizePayroll(runId, payload)` → `POST /api/v2/payroll/runs/{runId}/finalize`
- **State**: Local state with modal
- **Loading**: Skeletons
- **Error**: 404 finalization unavailable
- **Empty**: N/A
- **Permissions**: `payroll.view` for view, `payroll.finalize` for finalize (only admin in current DEFAULT_ROLE_PERMISSIONS)
- **Missing Backend Dependency**: Finalization endpoint returns 404; payment step not implemented

### 1.8 PayrollPayslipsHubPage (`/dashboard/payroll/payslips`)
- **Route**: `/dashboard/payroll/payslips`
- **Purpose**: Self-service payslip history (employee) or all payslips (HR/admin)
- **Current UI**:
  - Search filter
  - List of payslip cards: period, ref number, finalized date, payment date, net pay, View/Download actions
  - Download uses blob URL with revoke
- **API Calls**:
  - `payrollApi.getMyPayslips()` → `/api/v2/payroll/my-payslips` (HR/admin)
  - `payrollApi.getEmployeePayslipHistory(empId)` → `/api/v2/payroll/employees/{employeeId}/payslips` (employee)
  - `payrollApi.downloadPayslip(runId, empId)` → `/api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download`
- **State**: Local state
- **Loading**: Skeletons
- **Error**: 404 handled gracefully
- **Empty**: "No Final Payslips Available"
- **Permissions**: `payroll.view` (HR/admin see all, employee sees own)
- **Missing Backend Dependency**: Payslip endpoints return 404

### 1.9 PayrollPayslipPage (`/dashboard/payroll/runs/$runId/employees/$employeeId/payslip`)
- **Route**: `/dashboard/payroll/runs/$runId/employees/$employeeId/payslip`
- **Purpose**: Individual final payslip view/print/download
- **Current UI**:
  - Print-optimized layout with embedded @media print styles
  - Company header, employee info (with masked PAN/UAN/bank account)
  - Attendance grid (8 metrics)
  - Side-by-side Earnings/Deductions tables with totals
  - Net Pay prominent callout with payment date
  - Employer statutory contributions section
  - YTD summary (if provided)
  - Print / Download PDF buttons
- **API Calls**:
  - `payrollApi.getPayslip(runId, empId)` → `/api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip`
  - `payrollApi.downloadPayslip(runId, empId)` → download endpoint
- **State**: Local state
- **Loading**: Skeletons
- **Error**: 404 not found, 403 unauthorized
- **Empty**: "Final Payslip Not Available (Payroll Unfinalized)" banner
- **Permissions**: HR/admin or self-only (employeeId match)
- **Missing Backend Dependency**: Payslip endpoint returns 404

### 1.10 EmployeePayrollDetailPage (`/dashboard/payroll/runs/$runId/employees/$employeeId`)
- **Route**: `/dashboard/payroll/runs/$runId/employees/$employeeId`
- **Purpose**: Detailed employee payroll calculation breakdown (Step 5)
- **Current UI**: (Referenced in routes, implementation in pages)
- **API Calls**: `payrollApi.getRunEmployeeDetail(runId, employeeId)`
- **Missing Backend Dependency**: Returns 404

---

## 2. Existing API (payrollApi.ts)

### 2.1 Periods/Cycles
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/api/v2/payroll/cycles` | `GetPeriodsParams` | `GetPeriodsResponse` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/cycles/{id}` | - | `PayrollPeriod` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/cycles` | `CreatePeriodPayload` | `PayrollPeriod` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/cycles/{id}/lock` | `{reason?}` | `{success, message?}` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/cycles/{id}/reopen` | `{reason}` | `{success, message?}` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/cycles/{id}/void` | `{reason?}` | `{success, message?}` | CONFIRMED-IN-CODE |

### 2.2 Dashboard
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/payroll/dashboard` | `{periodId?}` | `PayrollDashboardData` | CONFIRMED-IN-CODE |

### 2.3 Payroll Run Execution
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| POST | `/payroll/run` | `{periodId}` | `RunPayrollResponse` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/runs/{runId}/generation-status` | `{job_id?}` | `PayrollRunStatus` | CONFIRMED-IN-CODE |
| DELETE | `/api/v2/payroll/runs/{runId}` | - | `CancelRunResponse` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/process` | - | `RetryRunResponse` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/runs/{runId}/validation-issues` | - | `PayrollRunValidationIssue[]` | CONFIRMED-IN-CODE |

### 2.4 Preview & Employees
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/api/v2/payroll/runs/{runId}/preview` | - | `PayrollPreviewData` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/runs/{runId}/employees` | `GetRunEmployeesParams` | `GetRunEmployeesResponse` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/runs/{runId}/employees/{employeeId}` | - | `PayrollPreviewEmployee` | CONFIRMED-IN-CODE |

### 2.5 Validation
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/api/v2/payroll/runs/{runId}/validation` | - | `PayrollValidationSummary` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/validate` | `{}` | `{success, message?, status?}` | CONFIRMED-IN-CODE |

### 2.6 Review & Approval
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/api/v2/payroll/runs/{runId}/approval` | - | `PayrollReviewData` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/approve` | `ApprovePayrollPayload` | `ApprovePayrollResponse` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/reject` | `RejectPayrollPayload` | `RejectPayrollResponse` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/send-back` | `RejectPayrollPayload` | `RejectPayrollResponse` | CONFIRMED-IN-CODE |

### 2.7 Finalization
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/api/v2/payroll/runs/{runId}/finalization` | - | `PayrollFinalizationData` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/finalize` | `FinalizePayrollPayload` | `FinalizePayrollResponse` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/lock` | `FinalizePayrollPayload` | `FinalizePayrollResponse` | CONFIRMED-IN-CODE |

### 2.8 Payslips
| Method | Endpoint | Request | Response | Verified |
|--------|----------|---------|----------|----------|
| GET | `/api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip` | - | `PayrollPayslipData` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/payslips/{payslipId}` | - | `PayrollPayslipData` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download` | - | `Blob` | CONFIRMED-IN-CODE |
| POST | `/api/v2/payroll/runs/{runId}/payslips/generate` | `GeneratePayslipsPayload` | `GeneratePayslipsResponse` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/employees/{employeeId}/payslips` | `{page?, limit?}` | `{items: PayslipHistoryItem[], total}` | CONFIRMED-IN-CODE |
| GET | `/api/v2/payroll/my-payslips` | `{page?, limit?}` | `{items: PayslipHistoryItem[], total}` | CONFIRMED-IN-CODE |

### 2.9 Type Definitions (Key)
- `PayrollStatus`: Draft | Open | Processing | Provision Generated | Under Review | Pending Approval | Approved | Finalized | Closed | Locked | Void | Failed
- `PayrollPeriod`: id, name, startDate, endDate, payDate, status, employeeCount, periodMonth, periodYear, isCurrent, isLocked, createdAt, updatedAt, remarks
- `PayrollRunStatus`: runId, jobId, periodId, periodName, status, progress, currentStep, employees{total,processed,failed}, steps[], error, validationIssues[]
- `PayrollPreviewData`: runId, periodId, periodName, status, runDate, generatedAt, summary, validation{errors[],warnings[]}
- `PayrollValidationIssue`: id, severity, category, code, message, employeeId, employeeName, department, component, blocking, status, detectedAt, resolved, resolution, resolvedAt, resolvedBy, source
- `PayrollReviewData`: runId, periodId, periodName, status, validationStatus, runDate, generatedAt, lastUpdatedAt, summary, validation, approval, auditLog[]
- `PayrollFinalizationData`: runId, periodId, periodName, status, isLocked, isFinalized, validationStatus, approvalStatus, summary, validation, approval, finalization, auditLog[]
- `PayrollPayslipData`: Full payslip with employee, attendance, earnings, deductions, statutory, employerContributions, netPay, netPayInWords, document, ytd

### 2.10 Normalization Functions
- `normalizePayrollPeriod()`, `normalizePayrollRunStatus()`, `normalizePayrollEmployee()`, `normalizePayrollPreviewData()`, `normalizePayrollValidationSummary()`, `normalizePayrollReviewData()`, `normalizePayrollFinalizationData()`, `normalizePayrollPayslipData()`

---

## 3. Existing Payroll State

### 3.1 Redux Store
- **sidebar/sidebarSlice**: User permissions from `sidebarApi.getPermissions()` cached in Redux
- **aurix-store** (Zustand): User session, role, employees list (used for RBAC checks in pages)

### 3.2 TanStack Query
- **Not used** in payroll pages currently. All API calls are direct `payrollApi` calls with local React state caching.

### 3.3 Local State (per page)
- Each page manages its own `useState` for data, loading, error, pagination, filters, modals
- No shared payroll state across pages (runId passed via URL params)

### 3.4 URL State
- `runId` from route params (`/dashboard/payroll/runs/$runId/...`)
- `periodId` from dashboard period selector (local state, not URL)

### 3.5 localStorage
- Used for `user_role` fallback in RBAC checks
- No payroll data cached in localStorage

### 3.6 Mock/Hardcoded Data
- **ZERO MOCK DATA** in payroll pages — all pages show authentic backend states or proper unavailable/error states
- `DEFAULT_COMPONENTS` in PayrollSection.tsx is default form state, not mock API data
- ExitManagementPage uses `hrms` Zustand store with `newId()` generating `Math.random()` IDs — **this is mock data but for exit management, not payroll**

---

## 4. Current Gaps for Payment/Disbursement

### 4.1 Missing Pages/Routes
- ❌ Payment Batch Creation wizard
- ❌ Bank Detail Validation page
- ❌ Payment Batch Approval (maker-checker)
- ❌ Bank File Generation/Download
- ❌ Mark as Submitted to Bank
- ❌ Bank Response Import (CSV upload)
- ❌ Payment Reconciliation
- ❌ Payment Status Tracking (UTR, credited date, failure reason)
- ❌ Hold/Release Payment
- ❌ Retry Failed Payment
- ❌ Payment Dashboard/List (`/dashboard/payroll/payments`)

### 4.2 Missing API Endpoints (Backend)
- ❌ Create Payment Batch
- ❌ Get Payment Batch / List
- ❌ Validate Bank Details
- ❌ Approve Payment Batch
- ❌ Generate Bank File
- ❌ Submit to Bank
- ❌ Import Bank Response
- ❌ Reconcile Payment Batch
- ❌ Retry Failed Payment
- ❌ Mark Payment Status (paid/failed/held/reversed)
- ❌ Employee Payment Details (UTR, credited date)
- ❌ Source Company Bank Account API
- ❌ Bank Account Validation (IFSC, duplicate detection, name mismatch)

### 4.3 Missing Types/Schemas
- ❌ `PaymentBatch`, `PaymentBatchItem`, `BankAccount`, `BankFile`, `BankResponse`, `PaymentReconciliation`
- ❌ Zod schemas for payment endpoints

### 4.4 Missing Permissions (in DEFAULT_ROLE_PERMISSIONS)
- ❌ `payroll.approve` — only admin has it
- ❌ `payroll.finalize` — only admin has it
- ❌ `payroll.disburse` — not defined
- ❌ `payroll.reports` — not defined
- ❌ `payroll.compensation.view` — not defined
- ❌ `payroll.compensation.edit` — not defined
- ❌ `payroll.statutory` — not defined

### 4.5 Missing Security Features
- ❌ Bank account masking in payment tables (PayslipPage has masking but not in payment context)
- ❌ Reveal with audit + auto-hide
- ❌ Idempotency keys for state-changing operations
- ❌ In-flight guards for payment actions
- ❌ Confirmation dialogs with employee count + total amount for irreversible actions
- ❌ CSV injection protection for payment exports
- ❌ Cache-Control: no-store for payment API responses
- ❌ Blob URL revocation after download

### 4.6 Missing Route Guards
- ❌ `/dashboard/payroll/payments` routes not in `ROUTE_ROLE_ACCESS`
- ❌ `/dashboard/payroll/runs/$runId/payment` not in route guards

### 4.7 Missing Shared Components
- ❌ PayrollStepper (9 lifecycle steps)
- ❌ Payment batch wizard components
- ❌ Bank validation table component
- ❌ Reconciliation summary component

---

## 5. Related Existing Code (Non-Payroll)

### 5.1 Settings > PayrollSection
- **File**: `src/features/settings/components/sections/PayrollSection.tsx`
- **API**: `fetchPayrollSettings`, `updatePayrollSettings` from `../../api`
- **Configures**: Pay frequency, salary components, PF/ESI/PT/TDS settings, payslip generation
- **Status**: Loads from backend, shows "API not implemented" toast on 404

### 5.2 Employee Onboarding > TaxPayrollStep
- **File**: `src/features/employee-onboarding/components/steps/TaxPayrollStep.tsx`
- **Collects**: Tax regime (OLD/NEW), UAN, PF Number, ESIC Number, Professional Tax, Nominee details
- **API**: `employeeOnboardingApi.saveStep7(data)`

### 5.3 Exit Management
- **Files**: `ExitManagementPage.tsx`, `OffboardingPage.tsx`
- **Settlement**: Calculates pending salary, leave encashment, bonus, deductions, asset recovery
- **Pay Final Settlement**: Marks status "paid" (local state only, no backend)
- **Uses**: Local Zustand store (`hrms`) with mock data — NOT connected to payroll backend

### 5.4 Sidebar/Permissions
- **File**: `src/services/sidebarApi.ts`
- **DEFAULT_ROLE_PERMISSIONS**: Only `payroll.view` and `payroll.process` defined for admin/hr
- **Missing**: `payroll.approve`, `payroll.finalize`, `payroll.disburse`, `payroll.reports`, `payroll.compensation.view`, `payroll.compensation.edit`, `payroll.statutory`

### 5.5 Route Guards
- **File**: `src/lib/route-guards.ts`
- **ROUTE_ROLE_ACCESS**: Only `/dashboard/payroll` defined (admin/hr)
- **Missing**: Payment routes, individual run sub-routes

---

## 6. Formatting Utilities

### 6.1 Currency Formatting
- **No central `src/lib/format.ts` found**
- Each page defines local `formatINR()` using `Intl.NumberFormat("en-IN", {style: "currency", currency: "INR", maximumFractionDigits: 0})`
- `formatCount()` for employee counts using `Intl.NumberFormat("en-IN")`

### 6.2 Date Formatting
- Local `formatDate()` / `formatDateTime()` in each page using `toLocaleDateString("en-IN")`

### 6.3 Masking
- `PayrollPayslipPage.tsx` has `maskAccountNumber()` (shows last 4: `••••••••1234`)
- `maskIdentifier()` for PAN/UAN (shows first 2 + last 2: `AB••••••12`)

---

## 7. Summary: What Exists vs What's Needed

| Category | Exists | Missing for Payment/Disbursement |
|----------|--------|----------------------------------|
| Pages (Steps 1-9) | Steps 1-8 complete (Periods → Finalization) | Step 9: Payment/Disbursement |
| API Endpoints | All Steps 1-8 endpoints defined in code | All Payment endpoints |
| Types | Complete for Steps 1-8 | Payment types, Zod schemas |
| Permissions | `payroll.view`, `payroll.process` | `payroll.approve`, `payroll.finalize`, `payroll.disburse`, `payroll.reports`, `payroll.compensation.*`, `payroll.statutory` |
| Route Guards | `/dashboard/payroll` only | Payment routes |
| State Management | Local React state per page | Shared payment state (TanStack Query recommended) |
| Security | Basic RBAC, masking in payslip | Idempotency, maker-checker UI, bank masking, audit, CSV protection |
| Backend | All return 404 currently | All payment endpoints need implementation |

---