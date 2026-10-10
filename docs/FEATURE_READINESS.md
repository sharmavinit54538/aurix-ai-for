# Feature Readiness Inventory — aurix-ai-for

Generated: 2026-10-10  
Based on: `openapi.json` (1340 backend routes), `docs/API_GAPS.md`, `docs/PAYROLL_BACKEND_TODO.md`, `docs/EXEC_PAGES_STATUS.md`

---

## Status Legend

| Status | Meaning |
|--------|---------|
| **LIVE** | Backend route exists in `openapi.json`; frontend wired with 4 states (loading, error+retry, empty, success) |
| **UNAVAILABLE** | Backend route NOT in `openapi.json`; frontend shows "Feature unavailable — backend pending" banner + Retry, hides nav for roles without access |
| **HIDDEN** | Route intentionally removed from nav; redirects to canonical page (see `docs/EXEC_PAGES_STATUS.md`) |
| **PARTIAL** | Some endpoints exist but key mutations/lists missing; frontend degrades gracefully |

---

## 1. Executive Dashboards (from `docs/EXEC_PAGES_STATUS.md`)

| Page / Route | Status | Missing Endpoint(s) | Notes |
|--------------|--------|---------------------|-------|
| `/dashboard/executive` (Unified) | **LIVE** | — | `GET /api/v2/executive/overview` |
| `/dashboard/executive/ceo` | **LIVE** | — | `GET /api/v2/executive/overview?role=ceo` |
| `/dashboard/executive/cfo` | **LIVE** | — | `GET /api/v2/executive/overview?role=cfo` |
| `/dashboard/executive/coo` | **LIVE** | — | `GET /api/v2/executive/overview?role=coo` |
| `/dashboard/executive/cto` | **LIVE** | — | `GET /api/v2/executive/overview?role=cto` |
| `/dashboard/executive/cio` | **LIVE** | — | `GET /api/v2/executive/overview?role=cio` |
| `/dashboard/executive/cmo` | **LIVE** | — | `GET /api/v2/executive/overview?role=cmo` |

### Former Sub-Routes (now **HIDDEN**, redirect to canonical)

| Former Route | Canonical Target | Reason |
|--------------|------------------|--------|
| `/dashboard/executive/ceo/sales` | `/dashboard/executive/ceo` | No sales pipeline/CRM backend; ARR was fabricated |
| `/dashboard/executive/ceo/finance` | `/dashboard/executive/cfo` | Consolidated into CFO command center |
| `/dashboard/executive/ceo/operations` | `/dashboard/executive/coo` | Consolidated into COO command center |
| `/dashboard/executive/ceo/business` | `/dashboard/executive/ceo` | Consolidated into CEO overview |
| `/dashboard/executive/ceo/reports` | `/dashboard/analytics` | Redirected to analytics |
| `/dashboard/executive/ceo/ai-insights` | `/dashboard/executive/ceo` | Integrated into AI Insight Card |
| `/dashboard/executive/ceo/organization` | `/dashboard/executive/ceo` | Consolidated into CEO overview |
| `/dashboard/executive/ceo/settings` | — | Removed non-persisting stub |
| `/dashboard/executive/cto/ai` | `/dashboard/executive/cto` | Consolidated into AI Hub |
| `/dashboard/executive/cto/analytics` | `/dashboard/executive/cto` | Redirected to real metrics |
| `/dashboard/executive/cto/database` | — | Removed (no DB telemetry API) |
| `/dashboard/executive/cto/developers` | `/dashboard/executive/cto` | Consolidated into engineering metrics |
| `/dashboard/executive/cto/devops` | — | Removed (no CI/CD backend) |
| `/dashboard/executive/cto/engineering` | `/dashboard/executive/cto` | Consolidated |
| `/dashboard/executive/cto/infrastructure` | `/dashboard/executive/cto` | Consolidated |
| `/dashboard/executive/cto/monitoring` | — | Removed (no Prometheus/APM) |
| `/dashboard/executive/cto/projects` | `/dashboard/executive/cto` | Consolidated into Initiatives |
| `/dashboard/executive/cto/security` | `/dashboard/executive/cto` | Consolidated into compliance |
| `/dashboard/executive/cto/settings` | — | Removed non-persisting stub |
| `/dashboard/executive/cio/analytics` | `/dashboard/executive/cio` | Redirected to real metrics |
| `/dashboard/executive/cio/cloud-network` | — | Removed (no VPC telemetry) |
| `/dashboard/executive/cio/cyber-security` | `/dashboard/executive/cio` | Consolidated |
| `/dashboard/executive/cio/digital-transformation` | `/dashboard/executive/cio` | Consolidated |
| `/dashboard/executive/cio/infrastructure` | `/dashboard/resources/assets` | Consolidated into IT Assets |
| `/dashboard/executive/cio/it-governance` | `/dashboard/executive/cio` | Consolidated |
| `/dashboard/executive/cio/it-operations` | `/dashboard/executive/cio` | Consolidated |
| `/dashboard/executive/cio/settings` | — | Removed non-persisting stub |

---

## 2. Payroll Module (from `docs/PAYROLL_BACKEND_TODO.md`)

| Page / Route | Status | Missing Endpoint(s) | Notes |
|--------------|--------|---------------------|-------|
| `/dashboard/payroll` (Index) | **LIVE** | — | Wired to real APIs |
| `/dashboard/payroll/runs/:runId` | **LIVE** | — | Real run detail |
| `/dashboard/payroll/runs/:runId/preview` | **LIVE** | — | Real preview |
| `/dashboard/payroll/runs/:runId/processing` | **LIVE** | — | Real processing |
| `/dashboard/payroll/runs/:runId/validation` | **LIVE** | — | Real validation |
| `/dashboard/payroll/runs/:runId/review` | **LIVE** | — | Real review |
| `/dashboard/payroll/runs/:runId/approval` | **LIVE** | — | Real approval |
| `/dashboard/payroll/runs/:runId/finalize` | **LIVE** | — | Real finalize |
| `/dashboard/payroll/runs/:runId/payment` | **UNAVAILABLE** | `POST/GET /api/v2/payroll/payment-batches` | Shows backend pending banner |
| `/dashboard/payroll/payments` | **UNAVAILABLE** | `GET/POST /api/v2/payroll/payment-batches` | Shows backend pending banner |
| `/dashboard/payroll/payments/:batchId` | **UNAVAILABLE** | `GET/POST /api/v2/payroll/payment-batches/:id` | Shows backend pending banner |
| `/dashboard/payroll/periods` | **LIVE** | — | Real periods |
| `/dashboard/payroll/payslips` | **LIVE** | — | Real payslips |
| `/dashboard/payroll/reports` | **UNAVAILABLE** | `GET /api/v2/payroll/reports` | Shows backend pending banner |
| `/dashboard/payroll/compensation` | **UNAVAILABLE** | `GET/POST /api/v2/payroll/compensation` | Shows backend pending banner |
| `/dashboard/payroll/salary-structure` | **UNAVAILABLE** | `GET/POST /api/v2/payroll/salary-structures` | Shows backend pending banner |
| `/dashboard/payroll/variable-inputs` | **UNAVAILABLE** | `GET/POST /api/v2/payroll/variable-inputs` | Shows backend pending banner |
| `/dashboard/payroll/statutory` | **UNAVAILABLE** | `GET /api/v2/payroll/statutory/config` | Shows backend pending banner |
| `/dashboard/payroll/full-and-final` | **UNAVAILABLE** | `GET/POST /api/v2/payroll/full-and-final` | Shows backend pending banner |
| `/dashboard/payroll/employee` (ESS) | **UNAVAILABLE** | `GET /api/v2/payroll/employee/dashboard` | Shows backend pending banner |

---

## 3. Settings Sections (from `src/features/settings/components/sections/`)

| Section | Page / Route | Status | Missing Endpoint(s) | Notes |
|---------|--------------|--------|---------------------|-------|
| Company | `/dashboard/settings/company` | **PARTIAL** | `GET/PUT /settings/company`, `POST /settings/company/logo` | CompanySection loads but some mutations unavailable |
| Employees | `/dashboard/settings/employees` | **UNAVAILABLE** | `GET/PUT /settings/employees`, `GET/POST/DELETE /employees` | EmployeesSection shows error + Retry |
| Attendance | `/dashboard/settings/attendance` | **UNAVAILABLE** | `GET/PUT /attendance/settings` | AttendanceSection shows error + Retry |
| Leave | `/dashboard/settings/leave` | **UNAVAILABLE** | `GET/PUT /settings/leaves` | LeaveSection shows error + Retry |
| Documents | `/dashboard/settings/documents` | **UNAVAILABLE** | `GET/PUT /settings/documents`, `GET /documents/categories` | DocumentsSection shows error + Retry |
| Assets | `/dashboard/settings/assets` | **UNAVAILABLE** | `GET/PUT /settings/assets`, `GET/POST/DELETE /assets` | AssetsSection shows error + Retry |
| Payroll | `/dashboard/settings/payroll` | **PARTIAL** | `GET/PUT /api/v1/payroll/settings` (partial) | PayrollSection works for PF/ESI from statutory config; some mutations unavailable |

---

## 4. Recruitment Module

| Page / Route | Status | Missing Endpoint(s) | Notes |
|--------------|--------|---------------------|-------|
| `/dashboard/recruitment` (Dashboard) | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/jobs` | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/jobs/:id` | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/jobs/new` | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/candidates` | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/candidates/:id` | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/ai-screening` | **LIVE** | — | Real APIs (F-03) |
| `/dashboard/recruitment/interviews` | **LIVE** | — | Real APIs (F-04) |
| `/dashboard/recruitment/ai-interview` | **LIVE** | — | Real APIs (F-05) |
| `/dashboard/recruitment/calendar` | **LIVE** | — | Real APIs |
| `/dashboard/recruitment/vendors` | **UNAVAILABLE** | `GET/POST/PUT/DELETE /vendors` | Shows backend pending banner |
| `/dashboard/recruitment/referrals` | **UNAVAILABLE** | `GET/PUT/POST /referrals` | Shows backend pending banner |
| `/dashboard/recruitment/talent-pool` | **UNAVAILABLE** | `GET /candidates/export/csv`, `POST /candidates/import` | Shows backend pending banner |
| `/dashboard/recruitment/workforce-planning` | **UNAVAILABLE** | `GET /departments` | Shows backend pending banner |
| `/dashboard/recruitment/automation` | **UNAVAILABLE** | No matching backend | Shows backend pending banner |
| `/dashboard/recruitment/crm` | **UNAVAILABLE** | `POST /crm/notes` | Shows backend pending banner |
| `/dashboard/recruitment/templates` | **UNAVAILABLE** | No matching backend | Shows backend pending banner |
| `/dashboard/recruitment/compliance` | **UNAVAILABLE** | No matching backend | Shows backend pending banner |
| `/dashboard/recruitment/reports` | **UNAVAILABLE** | No matching backend | Shows backend pending banner |
| `/dashboard/recruitment/import-export` | **UNAVAILABLE** | No matching backend | Shows backend pending banner |

### Candidate Public Pages (No Auth Required)

| Page / Route | Status | Missing Endpoint(s) | Notes |
|--------------|--------|---------------------|-------|
| `/interview/book/$token` | **LIVE** | — | Real APIs (F-05.1) |
| `/ai-interview/$token` | **LIVE** | — | Real APIs (F-05.2, gated by `VITE_AI_INTERVIEW_ENABLED`) |

---

## 5. Autopilot Module (from tracker A-01..A-08)

| Page / Route | Status | Missing Endpoint(s) | Notes |
|--------------|--------|---------------------|-------|
| `/dashboard/autopilot` (Overview) | **LIVE** | — | Real APIs (A-01) |
| `/dashboard/autopilot/settings` (Autonomy) | **LIVE** | — | Real APIs (A-02) |
| `/dashboard/autopilot/exceptions` | **LIVE** | — | Real APIs (A-03) |
| `/dashboard/autopilot/audit` | **LIVE** | — | Real APIs (A-04) |
| `/dashboard/autopilot/rules` (Policy Builder) | **LIVE** | — | Real APIs (A-05) |
| `/dashboard/autopilot/agent` (HR Agent Chat) | **LIVE** | — | Real APIs (A-06) |
| `/dashboard/autopilot/alert-bell` | **HIDDEN** | Component not found | File does not exist in repo |

---

## 6. HRMS Modules (from tracker F-07)

| Module | Page / Route | Status | Missing Endpoint(s) | Notes |
|--------|--------------|--------|---------------------|-------|
| Expenses | `/dashboard/expenses` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Visitors | `/dashboard/visitors` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Travel | `/dashboard/travel` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Onboarding Checklist | `/dashboard/onboarding-checklist` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Offboarding | `/dashboard/offboarding` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Assets | `/dashboard/assets` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Asset Management | `/dashboard/asset-management` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| HR-Ops Command Center | `/dashboard/hr-ops` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Timeline | `/dashboard/timeline` | **LIVE** | — | Real APIs (F-07.1/07.2) |
| Exit Management | `/dashboard/exit-management` | **LIVE** | — | Real APIs (F-07.1/07.2) |

---

## 7. Other Modules

| Module | Page / Route | Status | Missing Endpoint(s) | Notes |
|--------|--------------|--------|---------------------|-------|
| Leaves | `/dashboard/leaves` | **LIVE** | — | Real APIs |
| Attendance | `/dashboard/attendance` | **LIVE** | — | Real APIs (face, check-in, shifts) |
| Employee Onboarding | `/dashboard/employee-onboarding` | **LIVE** | — | Real APIs (F-07.5) |
| Exit Management | `/dashboard/exit-management` | **LIVE** | — | Real APIs (F-07.6) |
| Announcements | `/dashboard/announcements` | **PARTIAL** | `GET /announcements` | Some endpoints BACKEND_ADD |
| Helpdesk | `/dashboard/helpdesk` | **PARTIAL** | `GET /helpdesk` | Some endpoints BACKEND_ADD |
| Timesheets | `/dashboard/timesheets` | **PARTIAL** | `GET /timesheets` | Some endpoints BACKEND_ADD |
| Chat Assistant | `/dashboard/chat-assistant` | **LIVE** | — | Real APIs (AI Hub) |
| AI Hub Modules | Various | **UNAVAILABLE** | Most AI Hub endpoints | Many endpoints BACKEND_ADD in allowlist |

---

## 8. Summary Statistics

| Category | LIVE | PARTIAL | UNAVAILABLE | HIDDEN | Total |
|----------|------|---------|-------------|--------|-------|
| Executive Dashboards | 7 | 0 | 0 | 27 | 34 |
| Payroll | 8 | 0 | 14 | 0 | 22 |
| Settings Sections | 1 | 2 | 5 | 0 | 8 |
| Recruitment (Admin) | 7 | 0 | 14 | 0 | 21 |
| Recruitment (Public) | 2 | 0 | 0 | 0 | 2 |
| Autopilot | 6 | 0 | 0 | 1 | 7 |
| HRMS | 10 | 0 | 0 | 0 | 10 |
| Other Core (Leaves, Attendance, etc.) | 3 | 3 | 0 | 0 | 6 |
| **Total** | **44** | **5** | **33** | **28** | **110** |

---

## 9. Key Missing Backend Routes (from `scripts/backend-add-allowlist.json`)

The 124 allow-listed endpoints group into these modules:

| Module | Count | Key Missing Routes |
|--------|-------|-------------------|
| Autopilot | 12 | `/autopilot/rules`, `/autopilot/exceptions`, `/autopilot/audit` |
| Interviews & Interview-Bot | 15 | `/interviews/*`, `/interview-bot/*` |
| Analytics / AI Insights | 28 | `/analytics/*`, `/ai-insights/*`, `/ai-hub/*` |
| Settings (Config) | 24 | `/settings/*`, `/departments/*`, `/designations/*` |
| Documents | 18 | `/documents/*`, `/document-templates/*` |
| Departments/Managers Bulk | 10 | `/departments/bulk-*`, `/managers/bulk-*` |
| Expenses | 6 | `/api/v2/expenses/*` |
| Visitors | 4 | `/api/v2/visitors/*` |
| Travel | 4 | `/api/v2/travel/*` |
| Assets | 6 | `/api/v1/assets/*` |
| Exits | 4 | `/api/v1/exits/*` |
| Executive Overview | 8 | `/departments`, `/hierarchy`, `/jobs`, `/assets`, `/exits`, `/payroll/*` |
| Users/Me / Employees/Me | 8 | `/api/v1/profile/*`, `/api/v1/users/me`, `/employees/me` |

---

## 10. Recommendations

1. **Priority 1 (Payroll Completion)**: Implement the 14 UNAVAILABLE payroll endpoints per `docs/PAYROLL_BACKEND_TODO.md` Parts 1–5. These block the entire disbursement lifecycle.

2. **Priority 2 (Settings Completion)**: Implement the 5 UNAVAILABLE settings sections endpoints (Employees, Attendance, Leave, Documents, Assets). These are core configuration surfaces.

3. **Priority 3 (Recruitment Gaps)**: Implement vendors, referrals, talent-pool import/export, workforce-planning. These are high-value HR operations.

4. **Priority 4 (AI Hub / Analytics)**: The 28 allow-listed analytics/AI endpoints are speculative features; defer until backend team scopes them.

5. **Cleanup**: The 28 HIDDEN executive sub-routes are already redirected; no further action needed.