import type { AuthUserPayload } from "@/api/types";
import { normalizeRole, type AppRole } from "./roles";
import type { AurixUser } from "./aurix-store";

export type RoleOrUser =
  | AuthUserPayload
  | AurixUser
  | AppRole
  | string
  | null
  | undefined;

/**
 * Returns the canonical default dashboard landing page for a given user or role.
 *
 * - Super Admin  -> /dashboard/super-admin
 * - HR Admin     -> /dashboard (or /onboarding if setup incomplete)
 * - Recruiter    -> /dashboard/recruitment
 * - Manager      -> /dashboard/manager
 * - Employee     -> /dashboard/employee
 * - IT Admin     -> /dashboard/admin
 * - Executive    -> /dashboard/executive
 * - Unverified   -> /verify-email
 * - Fallback     -> /dashboard
 */
export function getDefaultDashboardPath(target?: RoleOrUser): string {
  if (!target) {
    return "/dashboard";
  }

  if (typeof target === "object") {
    // 1. Email verification prerequisite
    const isVerified =
      "is_verified" in target
        ? target.is_verified
        : "emailVerified" in target
          ? target.emailVerified
          : true;

    if (!isVerified) {
      return "/verify-email";
    }

    const role = normalizeRole(target.role);

    // 2. HR Admin onboarding prerequisite
    const onboardingCompleted =
      "onboarding_completed" in target
        ? target.onboarding_completed
        : "onboardingComplete" in target
          ? target.onboardingComplete
          : true;

    if (role === "hr_admin" && !onboardingCompleted) {
      return "/onboarding";
    }

    return getRoleDashboard(role);
  }

  const role = normalizeRole(target);
  return getRoleDashboard(role);
}

function getRoleDashboard(role: AppRole | null): string {
  switch (role) {
    case "super_admin":
      return "/dashboard/super-admin";
    case "recruiter":
      return "/dashboard/recruitment";
    case "manager":
      return "/dashboard/manager";
    case "employee":
      return "/dashboard/employee";
    case "it_admin":
      return "/dashboard/admin";
    case "executive":
      return "/dashboard/executive";
    case "hr_admin":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}
