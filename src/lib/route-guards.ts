/**
 * Central Role-Based Access Control (RBAC) Route Guard Map & Checker.
 *
 * Source of truth: DEFAULT_ROLE_PERMISSIONS in src/services/sidebarApi.ts
 */

import { hasValidAccessToken } from "@/api";
import { aurix } from "@/lib/aurix-store";

export const ROUTE_ROLE_ACCESS: Record<string, string[]> = {
  // ── Executive Command Centers ──────────────────────────────
  "/dashboard/executive/ceo": ["ceo", "admin", "super_admin"],
  "/dashboard/executive/cto": ["cto", "admin", "super_admin"],
  "/dashboard/executive/cio": ["cio", "admin", "super_admin"],
  "/dashboard/executive/cfo": ["cfo", "admin", "super_admin"],
  "/dashboard/executive/coo": ["coo", "admin", "super_admin"],
  "/dashboard/executive": ["ceo", "cto", "cio", "cfo", "coo", "admin", "super_admin"],

  // ── Payroll & Financial Compensation ────────────────────────
  "/dashboard/payroll/payments": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/payroll/full-and-final": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/payroll": ["admin", "super_admin", "hr", "hr_admin"],

  // ── HR Administration & Offboarding ─────────────────────────
  "/dashboard/hr": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/hr-ops": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/hr-operations": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/exit": ["admin", "super_admin", "hr", "hr_admin", "manager"],
  "/dashboard/exit-management": ["admin", "super_admin", "hr", "hr_admin", "manager"],
  "/dashboard/onboarding-checklist": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/offboarding": ["admin", "super_admin", "hr", "hr_admin"],
  "/dashboard/employees": ["admin", "super_admin", "hr", "hr_admin", "manager"],
  "/dashboard/managers": ["admin", "super_admin", "hr", "hr_admin"],

  // ── Governance, System Roles & Billing Settings ─────────────
  "/dashboard/admin": ["admin", "super_admin"],
  "/dashboard/settings/roles-permissions": ["admin", "super_admin"],
  "/dashboard/settings/billing": ["admin", "super_admin", "ceo"],
  "/dashboard/settings/audit-logs": ["admin", "super_admin", "ceo", "cio"],
  "/dashboard/roles": ["admin", "super_admin"],

  // ── Manager Portal ──────────────────────────────────────────
  "/dashboard/manager": ["manager", "admin", "super_admin", "hr", "hr_admin"],

  // ── Employee Self-Service Portal ────────────────────────────
  "/dashboard/employee": ["employee", "admin", "super_admin", "hr", "hr_admin", "manager"],
};

export function getRoleDefaultHome(role?: string): string {
  const norm = (role || "").toLowerCase();
  switch (norm) {
    case "ceo":
      return "/dashboard/executive/ceo";
    case "cto":
      return "/dashboard/executive/cto";
    case "cio":
      return "/dashboard/executive/cio";
    case "cfo":
      return "/dashboard/executive/cfo";
    case "coo":
      return "/dashboard/executive/coo";
    case "manager":
      return "/dashboard/manager";
    case "employee":
      return "/dashboard/employee";
    default:
      return "/dashboard";
  }
}

/**
 * Checks whether the current user is authenticated.
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return true; // Skip SSR redirects until cookie verification is established
  }
  const ws = aurix.get();
  return Boolean(ws.user) || hasValidAccessToken();
}

export interface RouteAccessResult {
  allowed: boolean;
  redirectPath?: string;
  reason?: string;
}

/**
 * Evaluates whether a role is authorized to access a given URL pathname.
 */
export function checkRouteAccess(pathname: string, userRole?: string): RouteAccessResult {
  const normRole = (userRole || "").toLowerCase();

  // Super Admin / Admin has access to all routes
  if (normRole === "admin" || normRole === "super_admin" || normRole === "superadmin") {
    return { allowed: true };
  }

  // Allow the forbidden page itself to avoid redirect loops
  if (pathname === "/dashboard/forbidden") {
    return { allowed: true };
  }

  // Sorted prefixes from most specific to least specific
  const matchingPrefixes = Object.keys(ROUTE_ROLE_ACCESS)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length);

  if (matchingPrefixes.length === 0) {
    // If route has no specific role restriction, permit access
    return { allowed: true };
  }

  const matchedPrefix = matchingPrefixes[0];
  const allowedRoles = ROUTE_ROLE_ACCESS[matchedPrefix];

  if (!allowedRoles.includes(normRole)) {
    // Determine the most intuitive redirect: if executive trying to open employee portal, route home
    const isExecutive =
      normRole === "ceo" ||
      normRole === "cto" ||
      normRole === "cio" ||
      normRole === "cfo" ||
      normRole === "coo";

    if (isExecutive && pathname.startsWith("/dashboard/employee")) {
      return {
        allowed: false,
        redirectPath: getRoleDefaultHome(normRole),
        reason: "Executives are redirected to their Command Center",
      };
    }

    return {
      allowed: false,
      redirectPath: "/dashboard/forbidden",
      reason: `Role '${normRole || "unknown"}' lacks permission to access '${matchedPrefix}'.`,
    };
  }

  return { allowed: true };
}
