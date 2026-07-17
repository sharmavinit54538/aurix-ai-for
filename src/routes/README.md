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
| `features/admin/` | HR/Admin management (employees, managers, departments, performance, **recruitment**) |
| `features/auth/` | Login, register, password reset, email verification |
| `features/portal/` | Role-based user dashboards (employee self-service, manager team lead) |
| `features/dashboard/` | Executive overview |
| `features/attendance/` | Attendance module |

### Admin module structure (same pattern for every module)

```
features/admin/{module}/
├── components/       # UI pieces (tables, dialogs, cards)
├── constants/        # Options, defaults, seed data
├── hooks/            # React hooks (data + page logic)
├── pages/            # Route-facing page components
├── types/            # Domain TypeScript types
├── utils/            # Helpers, formatters, validators
├── {module}Slice.ts  # Redux slice (when using Redux)
├── {module}Thunk.ts  # API thunks (when using Redux)
└── store.ts          # recruitment only — local store (not Redux yet)
```

| Module | Path |
|--------|------|
| Employees | `features/admin/employees/` |
| Managers | `features/admin/managers/` |
| Departments | `features/admin/departments/` |
| Performance | `features/admin/performance/` |
| Recruitment | `features/admin/recruitment/` |

## File naming → URL

| Route file | URL |
|------------|-----|
| `dashboard.employees.tsx` | `/dashboard/employees` |
| `dashboard/recruitment/talent-pool.tsx` | `/dashboard/recruitment/talent-pool` |
| `dashboard/recruitment/jobs/$jobId.tsx` | `/dashboard/recruitment/jobs/:jobId` |

`routeTree.gen.ts` is auto-generated — do not edit it.

## Standard route pattern

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const TalentPoolPage = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/TalentPoolPage"),
  "TalentPoolPage",
);

export const Route = createFileRoute("/dashboard/recruitment/talent-pool")({
  head: () => ({ meta: [{ title: "Talent Pool — Recruitment" }] }),
  component: TalentPoolPage,
});
```

## Thin routes + feature pages

| Route file | Feature page |
|------------|--------------|
| `dashboard.employees.tsx` | `features/admin/employees/pages/EmployeesPage.tsx` |
| `dashboard.managers.tsx` | `features/admin/managers/pages/ManagersPage.tsx` |
| `dashboard/recruitment/*` | `features/admin/recruitment/pages/*Page.tsx` |

Recruitment route files live under `routes/dashboard/recruitment/` (grouped, not flat in `routes/` root).

## Routes that still contain UI inline

Payroll, assets, documents, etc. still have UI in `src/routes/`. Refactor those into `features/` the same way.

## Folder layout

```
src/routes/
├── __root.tsx
├── dashboard.tsx
├── dashboard.employees.tsx
├── dashboard/
│   └── recruitment/          # recruitment URL wiring (thin files only)
│       ├── index.tsx
│       ├── talent-pool.tsx
│       ├── candidates/
│       └── jobs/
└── _lib/
    └── lazyFeaturePage.ts
```
