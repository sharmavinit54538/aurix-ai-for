# Executive Dashboards Status & Canonical Routing (`docs/EXEC_PAGES_STATUS.md`)

This document records the disposition of executive dashboard routes and pages under `src/features/{ceo,cto,cio,executive}` following the F-08 work package.

## 1. Overview
In accordance with Ground Rule 4 ("No fake data in production UI") and Contract Convention F-08, executive views must display **only verified operational metrics** retrieved from `GET /api/v2/executive/overview?role={role}`. 
Synthetic numbers (fabricated ARR, mock sales pipelines, fake cloud compute telemetry, or simulated devops sprint velocities) have been removed. Any metric with no real backend source or flagged with `available: false` is omitted rather than rendered with `"—"` or `"Live data pending"`.

---

## 2. Canonical Executive Command Centers (Kept & Wired)

All executive roles are consolidated onto real, high-performance command centers powered by `executiveApi.getOverview(role)`:

| Route | Canonical View | Source Endpoint | Status | Notes |
|---|---|---|---|---|
| `/dashboard/executive` | `ExecutiveHubPage.tsx` | `GET /api/v2/executive/overview` | **KEPT** | Unified executive landing overview across all executive functions |
| `/dashboard/executive/ceo` | `CeoDashboardPage.tsx` | `GET /api/v2/executive/overview?role=ceo` | **KEPT** | Real org headcount, retention, hiring funnel, and executive initiatives |
| `/dashboard/executive/cfo` | `CfoDashboardPage.tsx` | `GET /api/v2/executive/overview?role=cfo` | **KEPT** | Real payroll expense, department budgets, and capital expenditures |
| `/dashboard/executive/coo` | `CooDashboardPage.tsx` | `GET /api/v2/executive/overview?role=coo` | **KEPT** | Real workforce attendance rate, leave utilisation, and team efficiency |
| `/dashboard/executive/cto` | `CtoDashboardPage.tsx` | `GET /api/v2/executive/overview?role=cto` | **KEPT** | Real engineering headcount, asset allocation, and infrastructure delivery |
| `/dashboard/executive/cio` | `CioDashboardPage.tsx` | `GET /api/v2/executive/overview?role=cio` | **KEPT** | Real enterprise IT asset tracking, ticket turnaround, and equipment lifecycle |
| `/dashboard/executive/cmo` | `CmoDashboardPage.tsx` | `GET /api/v2/executive/overview?role=cmo` | **KEPT** | Real marketing personnel, recruitment pipeline, and strategic growth campaigns |

---

## 3. Sub-Routes Consolidated via Redirects

The following sub-routes formerly contained mock arrays (`any[] = []`), placeholder cards, or non-functional settings stubs. They now redirect to their canonical role command center:

### CEO Sub-Routes (Redirect to `/dashboard/executive/ceo`)
- `/dashboard/executive/ceo/sales`: Removed (no sales pipeline/CRM backend; ARR was fabricated).
- `/dashboard/executive/ceo/finance`: Consolidated into CFO finance command center (`/dashboard/executive/cfo`).
- `/dashboard/executive/ceo/operations`: Consolidated into COO operations command center (`/dashboard/executive/coo`).
- `/dashboard/executive/ceo/business`: Consolidated into CEO command center overview.
- `/dashboard/executive/ceo/reports`: Redirected to canonical `/dashboard/analytics`.
- `/dashboard/executive/ceo/ai-insights`: Integrated directly into `ExecutiveAiInsightCard` on command center.
- `/dashboard/executive/ceo/organization`: Consolidated into CEO command center overview.
- `/dashboard/executive/ceo/settings`: Removed repeated non-persisting stub page per F-08.3.

### CTO Sub-Routes (Redirect to `/dashboard/executive/cto`)
- `/dashboard/executive/cto/ai`: Consolidated into AI Hub and CTO command center.
- `/dashboard/executive/cto/analytics`: Redirected to CTO command center real metrics.
- `/dashboard/executive/cto/database`: Removed (no real DB telemetry API; avoided fake metrics).
- `/dashboard/executive/cto/developers`: Consolidated into engineering team metrics.
- `/dashboard/executive/cto/devops`: Removed (no CI/CD backend integration; avoided fake pipeline metrics).
- `/dashboard/executive/cto/engineering`: Consolidated into CTO command center.
- `/dashboard/executive/cto/infrastructure`: Consolidated into IT Asset / CTO command center.
- `/dashboard/executive/cto/monitoring`: Removed (no Prometheus/APM telemetry backend).
- `/dashboard/executive/cto/projects`: Consolidated into Executive Initiatives data table.
- `/dashboard/executive/cto/security`: Consolidated into compliance and RBAC governance.
- `/dashboard/executive/cto/settings`: Removed repeated non-persisting stub page per F-08.3.

### CIO Sub-Routes (Redirect to `/dashboard/executive/cio`)
- `/dashboard/executive/cio/analytics`: Redirected to CIO command center real metrics.
- `/dashboard/executive/cio/cloud-network`: Removed (no VPC/cloud provider telemetry API).
- `/dashboard/executive/cio/cyber-security`: Consolidated into CIO command center.
- `/dashboard/executive/cio/digital-transformation`: Consolidated into CIO command center.
- `/dashboard/executive/cio/infrastructure`: Consolidated into IT Assets view (`/dashboard/resources/assets`).
- `/dashboard/executive/cio/it-governance`: Consolidated into CIO command center initiatives.
- `/dashboard/executive/cio/it-operations`: Consolidated into CIO command center.
- `/dashboard/executive/cio/settings`: Removed repeated non-persisting stub page per F-08.3.

---

## 4. Sidebar Navigation Update
`EXECUTIVE_NAV_SECTIONS` in `src/components/aurix/DashboardShell.tsx` has been updated to list only canonical, verified routes:
1. **Executive Overview** (`/dashboard/executive`)
2. **CEO Portal** (`/dashboard/executive/ceo`)
3. **CFO Finance** (`/dashboard/executive/cfo`)
4. **COO Operations** (`/dashboard/executive/coo`)
5. **CTO Technology** (`/dashboard/executive/cto`)
6. **CIO IT Systems** (`/dashboard/executive/cio`)
7. **CMO Marketing** (`/dashboard/executive/cmo`)
8. **Analytics & Reports** (`/dashboard/analytics`)
