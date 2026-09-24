/** Central route authorization for the six canonical frontend roles. */
import { hasValidAccessToken } from "@/api";
import { aurix } from "@/lib/aurix-store";
import { normalizeRole, type Role } from "@/lib/rbac";

const HR_OPERATIONS_ROLES: Role[] = ["super_admin", "hr_admin"];
const TEAM_MANAGEMENT_ROLES: Role[] = ["super_admin", "hr_admin", "manager"];
const SYSTEM_ADMIN_ROLES: Role[] = ["super_admin", "it_admin"];
const EXECUTIVE_ROLES: Role[] = ["super_admin", "executive"];

export const ROUTE_ROLE_ACCESS: Record<string, Role[]> = {
  "/dashboard/executive": EXECUTIVE_ROLES,
  "/dashboard/payroll/payments": HR_OPERATIONS_ROLES,
  "/dashboard/payroll/full-and-final": HR_OPERATIONS_ROLES,
  "/dashboard/payroll": HR_OPERATIONS_ROLES,
  "/dashboard/hr": HR_OPERATIONS_ROLES,
  "/dashboard/hr-ops": HR_OPERATIONS_ROLES,
  "/dashboard/hr-operations": HR_OPERATIONS_ROLES,
  "/dashboard/exit": TEAM_MANAGEMENT_ROLES,
  "/dashboard/exit-management": TEAM_MANAGEMENT_ROLES,
  "/dashboard/onboarding-checklist": HR_OPERATIONS_ROLES,
  "/dashboard/offboarding": HR_OPERATIONS_ROLES,
  "/dashboard/employees": TEAM_MANAGEMENT_ROLES,
  "/dashboard/managers": HR_OPERATIONS_ROLES,
  "/dashboard/admin": SYSTEM_ADMIN_ROLES,
  "/dashboard/settings/roles-permissions": ["super_admin"],
  "/dashboard/settings/billing": ["super_admin"],
  "/dashboard/settings/audit-logs": SYSTEM_ADMIN_ROLES,
  "/dashboard/roles": ["super_admin"],
  "/dashboard/manager": TEAM_MANAGEMENT_ROLES,
  "/dashboard/employee": ["employee"],
};

export function getRoleDefaultHome(role?: string | null): string {
  switch (normalizeRole(role)) {
    case "executive": return "/dashboard/executive";
    case "manager": return "/dashboard/manager";
    case "employee": return "/dashboard/employee";
    default: return "/dashboard";
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
  if (pathname === "/dashboard/forbidden" || role === "super_admin") return { allowed: true };

  const matchedPrefix = Object.keys(ROUTE_ROLE_ACCESS)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchedPrefix || ROUTE_ROLE_ACCESS[matchedPrefix].includes(role)) return { allowed: true };

  return {
    allowed: false,
    redirectPath: role === "executive" ? getRoleDefaultHome(role) : "/dashboard/forbidden",
    reason: `Role '${role}' lacks permission to access '${matchedPrefix}'.`,
  };
}
