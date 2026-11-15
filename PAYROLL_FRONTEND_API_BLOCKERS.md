# Payroll Frontend API Verification & Blockers

Audited against local `/openapi.json` (backend service: `https://api.ofc360.com`).  
No backend source files were modified and no fake endpoints or dummy fallbacks were added.

## 1. OpenAPI Verification Summary

Across `src/services/payrollApi.ts`, `src/features/payroll/api/*`, and `src/features/settings/api.ts`:
- **80 payroll API call sites** match declared paths and HTTP methods in `/openapi.json` (Cycles list/get/reopen/void, Runs create/get/delete/preview/employees/validation/review/approve/reject/finalize/process/revalidate, Payslips get/download/generate/my-payslips/provision-slips, Compensation, Variable Inputs, Statutory Compliance, Reports, F&F, Payment Batches, Bank Accounts, and Payroll Settings).
- **9 payroll endpoint calls** in `src/services/payrollApi.ts` are **not declared** in `/openapi.json` and remain backend-dependent blockers where equivalent endpoints either differ or do not yet exist in the specification:

| Method & Path | Location (`src/services/payrollApi.ts`) | OpenAPI Status | Frontend Handling / Alternative in OpenAPI |
|---|---|---|---|
| `GET /api/v2/payroll/dashboard` | line 209 | Missing | Dashboard falls back to `GET /api/v2/payroll/cycles` + runs queries cleanly with loading/empty/error states |
| `GET /api/v2/payroll/payslips` | line 348 | Missing | Global payslips list not in OpenAPI; ESS uses `GET /api/v2/payroll/my-payslips`, run uses `/runs/{runId}/employees` |
| `POST /api/v2/payroll/cycles` | line 381 | `POST` missing on `/cycles` | OpenAPI only declares `GET /api/v2/payroll/cycles`; UI surfaces API error cleanly without faking creation |
| `POST /api/v2/payroll/cycles/{cycleId}/lock` | line 389 | Missing | OpenAPI declares `POST .../reopen` and `POST .../void`; period lock action surfaces backend response |
| `GET /api/v2/payroll/runs/{runId}/status` | line 442 | Missing | OpenAPI declares `GET /api/v2/payroll/runs/{runId}` and `GET /api/v2/payroll/runs/{runId}/generation-status` |
| `POST /api/v2/payroll/runs/{runId}/cancel` | line 467 | Missing | OpenAPI declares `DELETE /api/v2/payroll/runs/{runId}` |
| `POST /api/v2/payroll/runs/{runId}/retry` | line 475 | Missing | OpenAPI declares `POST /api/v2/payroll/runs/{runId}/process` |
| `POST /api/v2/payroll/runs/{runId}/recalculate` | line 483 | Missing | OpenAPI declares `POST .../revalidate` and `POST .../process` |
| `GET /api/v2/payroll/payslips/{id}` | line 736 | Missing | OpenAPI declares `GET /api/v2/payroll/payslips/{runId}/{employeeId}` |

> Note: `src/features/settings/api.ts` also contains non-payroll settings endpoints (employees, attendance, leaves, documents, assets, company-logo) outside payroll scope.

## 2. Frontend Precision, State & Safety Repairs Completed

- **Monetary Precision & Formatting**: Preserved exact backend rupee/paise figures (e.g. `100000.07` via integer paise arithmetic in `src/lib/format.ts`, `src/lib/salary/salaryCalculator.ts`, `src/features/payroll/utils/money.ts`, `EmployeeDeductionsCard.tsx`, `PayrollMetricsDashboard.tsx`, `FullAndFinalPage.tsx`, `StatutoryCompliancePage.tsx`, `EmployeeSelfServicePayrollPage.tsx`, `PayrollSection.tsx`); replaced `|| 0` / local integer rounding with `formatOptionalINR` / `formatOptionalCount` returning `"—"` when metrics are missing.
- **No Fake Fallbacks or Browser Dialogs**: Removed fake bank account fallbacks in `PayrollRunPaymentPage.tsx`, replaced `window.confirm` in `PayrollPeriodsPage.tsx` with React `<Dialog>`, fixed invalid 2-argument `URL.createObjectURL` calls across download handlers (`PaymentBatchDetailPage.tsx`, `PayrollReportsPage.tsx`, `FullAndFinalPage.tsx`, `EmployeeSelfServicePayrollPage.tsx`), cleared React Query + RTK Query caches in `logout()` (`src/lib/auth-bootstrap.ts`), and synchronized `SalarySlipsTable.tsx` / `ProvisionSlipsTable.tsx` modals with shared INR/date formatters.
