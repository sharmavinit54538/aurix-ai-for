# Routes (`src/routes/`)

TanStack Router uses **file-based routing**. Each route file maps to a URL.
Do **not** create `src/pages/` — that is a Next.js convention.

## Two folders, two jobs

| Folder | Purpose |
|--------|---------|
| **`src/routes/`** | URL wiring only — `createFileRoute`, page title/meta, lazy import |
| **`src/features/`** | UI, Redux, business logic — pages, components, thunks, slices |

**Rule:** Route files should stay thin (~15 lines). Put screens in `features/{area}/{module}/pages/`.

## Feature folder layout

| Folder | Purpose |
|--------|---------|
| `features/admin/` | HR/Admin management (employees, managers, departments, performance, payroll) |
| `features/auth/` | Login, register, password reset, email verification |
| `features/portal/` | Role-based user dashboards (employee self-service, manager team lead) |
| `features/dashboard/` | Executive overview |
| `features/attendance/` | Attendance module |

## File naming → URL

Dots in filenames become path segments:

| Route file | URL |
|------------|-----|
| `_auth/login.tsx` | `/login` |
| `_auth/register.tsx` | `/register` |
| `_auth/forgot-password.tsx` | `/forgot-password` |
| `_auth/reset-password.tsx` | `/reset-password` |
| `_auth/verify-email.tsx` | `/verify-email` |
| `_auth/verify-reset-otp.tsx` | `/verify-reset-otp` |
| `dashboard.tsx` | `/dashboard` (layout shell) |
| `dashboard.index.tsx` | `/dashboard/` |
| `dashboard.employees.tsx` | `/dashboard/employees` |
| `dashboard.recruitment.jobs.$jobId.tsx` | `/dashboard/recruitment/jobs/:jobId` |
| `dashboard.attendance.holidays.tsx` | `/dashboard/attendance/holidays` |
| `ai.brain.tsx` | `/ai/brain` |
| `api/ai-brain.ts` | Server API route |

`routeTree.gen.ts` is auto-generated — do not edit it.

## Standard route pattern

Use `lazyFeaturePage` from `./_lib/lazyFeaturePage`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const EmployeesPage = lazyFeaturePage(
  () => import("@/features/admin/employees/pages/EmployeesPage"),
  "EmployeesPage",
);

export const Route = createFileRoute("/dashboard/employees")({
  head: () => ({ meta: [{ title: "Employees — Aurix" }] }),
  component: EmployeesPage,
});
```

For default exports (e.g. attendance pages):

```tsx
const HolidaysPage = lazyFeaturePage(() => import("@/features/attendance/pages/HolidaysPage"));
```

## Feature modules with proper structure

These routes are thin and load from `features/`:

| Route file | Feature page |
|------------|--------------|
| `dashboard.index.tsx` | `features/dashboard/pages/ExecutiveDashboardPage.tsx` |
| `dashboard.employees.tsx` | `features/admin/employees/pages/EmployeesPage.tsx` |
| `dashboard.departments.tsx` | `features/admin/departments/pages/DepartmentsPage.tsx` |
| `dashboard.managers.tsx` | `features/admin/managers/pages/ManagersPage.tsx` |
| `dashboard.performance.tsx` | `features/admin/performance/pages/PerformancePage.tsx` |
| `dashboard.payroll.index.tsx` | `features/admin/payroll/pages/PayrollDashboardPage.tsx` |
| `dashboard.payroll.$section.tsx` | `features/admin/payroll/payrollRoutes.ts` → `pages/Payroll*Page.tsx` |
| `dashboard.employee.tsx` | `features/portal/employee/pages/EmployeePage.tsx` (self-service) |
| `dashboard.manager.tsx` | `features/portal/manager/pages/ManagerPage.tsx` (team lead) |
| `dashboard.attendance.holidays.tsx` | `features/attendance/pages/HolidaysPage.tsx` |
| `dashboard.attendance.rosters.tsx` | `features/attendance/pages/RostersPage.tsx` |

## Routes that still contain UI inline

Many older routes (recruitment, assets, documents, etc.) still have UI directly in `src/routes/`. When refactoring those, move UI to `features/{module}/pages/` and keep the route file thin.

## Folder layout

```
src/routes/
├── __root.tsx              # App shell, providers
├── index.tsx               # Marketing home (/)
├── _auth/                  # Auth routes (pathless group — URLs stay /login, /register, etc.)
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── verify-email.tsx
│   └── verify-reset-otp.tsx
├── dashboard.tsx           # Dashboard layout
├── dashboard.*.tsx         # Dashboard child routes
├── ai.*.tsx                # AI module routes
├── api/                    # Server handlers
└── _lib/
    └── lazyFeaturePage.ts  # Shared lazy-load helper
```

`_lib/` is ignored by the router (underscore prefix) — helpers only, not routes.
