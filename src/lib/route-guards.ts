/**
 * Central route authorization for OFC360 RBAC architecture.
 * Enforces clean separation between platform owner (SUPER_ADMIN)
 * and normal organization roles (HR_ADMIN, MANAGER, EMPLOYEE, IT_ADMIN, EXECUTIVE).
 */
import { hasValidAccessToken } from "@/api";
import { aurix } from "@/lib/aurix-store";
import { normalizeRole, isSuperAdmin, type AppRole } from "@/lib/roles";

export const PLATFORM_ROLES: AppRole[] = ["super_admin"];
export const HR_OPERATIONS_ROLES: AppRole[] = ["hr_admin"];
export const TEAM_MANAGEMENT_ROLES: AppRole[] = ["hr_admin", "manager"];
export const SYSTEM_ADMIN_ROLES: AppRole[] = ["it_admin"];
export const EXECUTIVE_ROLES: AppRole[] = ["executive"];
export const ALL_COMPANY_ROLES: AppRole[] = [
  "hr_admin",
  "executive",
  "manager",
  "employee",
  "it_admin",
];

export const ROUTE_ROLE_ACCESS: Record<string, AppRole[]> = {
  // ── Platform Owner Routes (STRICTLY SUPER_ADMIN ONLY) ───────────
  "/dashboard/super-admin": PLATFORM_ROLES,
  "/dashboard/super-admin/users": PLATFORM_ROLES,
  "/dashboard/super-admin/organizations": PLATFORM_ROLES,
  "/dashboard/super-admin/analytics": PLATFORM_ROLES,
  "/dashboard/super-admin/activity": PLATFORM_ROLES,
  "/dashboard/super-admin/audit-logs": PLATFORM_ROLES,
  "/dashboard/super-admin/settings": PLATFORM_ROLES,
  "/dashboard/super-admin/platform-config": PLATFORM_ROLES,

  // ── Executive Intelligence Routes ───────────────────────────────
  "/dashboard/executive/cio": ["executive", "it_admin"],
  "/dashboard/executive": EXECUTIVE_ROLES,

  // ── HR Operations & Payroll (HR_ADMIN) ──────────────────────────
  "/dashboard/payroll/payslips": ["hr_admin", "employee", "manager"],
  "/dashboard/payroll/payments": HR_OPERATIONS_ROLES,
  "/dashboard/payroll/full-and-final": HR_OPERATIONS_ROLES,
  "/dashboard/payroll": HR_OPERATIONS_ROLES,
  "/dashboard/hr": HR_OPERATIONS_ROLES,
  "/dashboard/hr-ops": HR_OPERATIONS_ROLES,
  "/dashboard/hr-operations": HR_OPERATIONS_ROLES,
  "/dashboard/onboarding-checklist": HR_OPERATIONS_ROLES,
  "/dashboard/offboarding": HR_OPERATIONS_ROLES,
  "/dashboard/managers": HR_OPERATIONS_ROLES,

  // ── Team Management Routes (HR_ADMIN, MANAGER) ──────────────────
  "/dashboard/exit": TEAM_MANAGEMENT_ROLES,
  "/dashboard/exit-management": TEAM_MANAGEMENT_ROLES,
  "/dashboard/employees": TEAM_MANAGEMENT_ROLES,
  "/dashboard/manager": ["manager"],

  // ── IT Admin Routes ─────────────────────────────────────────────
  "/dashboard/admin": SYSTEM_ADMIN_ROLES,
  "/dashboard/settings/audit-logs": SYSTEM_ADMIN_ROLES,

  // ── Employee Self-Service ───────────────────────────────────────
  "/dashboard/employee": ["employee"],

  // ── Settings Sections ───────────────────────────────────────────
  "/dashboard/settings/company": HR_OPERATIONS_ROLES,
  "/dashboard/settings/employees": HR_OPERATIONS_ROLES,
  "/dashboard/settings/payroll": HR_OPERATIONS_ROLES,
  "/dashboard/settings/roles-permissions": HR_OPERATIONS_ROLES,
  "/dashboard/roles": HR_OPERATIONS_ROLES,
};

export function getRoleDefaultHome(role?: string | null): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case "super_admin":
      return "/dashboard/super-admin";
    case "executive":
      return "/dashboard/executive";
    case "manager":
      return "/dashboard/manager";
    case "employee":
      return "/dashboard/employee";
    case "it_admin":
      return "/dashboard/admin";
    case "hr_admin":
    default:
      return "/dashboard";
  }
}

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return true;
  return Boolean(aurix.get().user) || hasValidAccessToken();
}

export interface RouteAccessResult {
  allowed: boolean;
  redirectPath?: string;
  reason?: string;
}

export function checkRouteAccess(pathname: string, userRole?: string | null): RouteAccessResult {
  const role = normalizeRole(userRole);

  if (pathname === "/dashboard/forbidden") {
    return { allowed: true };
  }

  // 1. Super Admin (Platform Owner) Boundary Checks
  if (isSuperAdmin(role)) {
    // Super Admin has full access to the dedicated platform dashboard
    if (pathname.startsWith("/dashboard/super-admin")) {
      return { allowed: true };
    }
    // If Super Admin visits the generic root /dashboard, redirect to platform dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return { allowed: false, redirectPath: "/dashboard/super-admin" };
    }
    // Super Admin is separate from company employee and payroll operations
    if (
      pathname.startsWith("/dashboard/payroll") ||
      pathname.startsWith("/dashboard/employee") ||
      pathname.startsWith("/dashboard/manager")
    ) {
      return {
        allowed: false,
        redirectPath: "/dashboard/super-admin",
        reason: "Super Admin is the platform owner and does not belong to company employee or payroll workflows.",
      };
    }
    return { allowed: true };
  }

  // 2. Normal Company Roles attempting to access Super Admin Platform pages: STRICTLY BLOCKED
  if (pathname.startsWith("/dashboard/super-admin")) {
    return {
      allowed: false,
      redirectPath: "/dashboard/forbidden",
      reason: "Forbidden: Super Admin platform area requires platform owner privilege.",
    };
  }

  // 3. Match against configured route role map
  const matchedPrefix = Object.keys(ROUTE_ROLE_ACCESS)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchedPrefix) {
    return { allowed: true };
  }

  const allowedRoles = ROUTE_ROLE_ACCESS[matchedPrefix];
  if (role && allowedRoles.includes(role)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    redirectPath: role === "executive" ? getRoleDefaultHome(role) : "/dashboard/forbidden",
    reason: `Role '${role ?? "unrecognized"}' lacks permission to access '${matchedPrefix}'.`,
  };
}
