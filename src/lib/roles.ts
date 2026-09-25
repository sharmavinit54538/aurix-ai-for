import { useAurix } from "./aurix-store";

/**
 * Exactly 6 canonical roles supported by OFC360:
 * - SUPER_ADMIN: Sole platform owner, separated from company hierarchy
 * - HR_ADMIN: Organization HR & operational administration
 * - MANAGER: Department / Team management & approvals
 * - EMPLOYEE: Self-service portal & personal records
 * - IT_ADMIN: Technical infrastructure, systems & assets
 * - EXECUTIVE: High-level business dashboards & strategic intelligence
 */
export type AppRole =
  | "super_admin"
  | "hr_admin"
  | "executive"
  | "manager"
  | "employee"
  | "it_admin";

export type CanonicalRole =
  | "SUPER_ADMIN"
  | "HR_ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "IT_ADMIN"
  | "EXECUTIVE";

export const ALL_APP_ROLES: readonly AppRole[] = [
  "super_admin",
  "hr_admin",
  "executive",
  "manager",
  "employee",
  "it_admin",
] as const;

/** Organization / Company-level roles. SUPER_ADMIN is NEVER part of this list. */
export const COMPANY_ROLES: readonly AppRole[] = [
  "hr_admin",
  "manager",
  "employee",
  "it_admin",
  "executive",
] as const;

/** Platform owner role. Single instance in the application. */
export const PLATFORM_ROLES: readonly AppRole[] = [
  "super_admin",
] as const;

/**
 * Maps every legacy/synonym string to exactly one canonical AppRole.
 * Case-insensitive, trims whitespace.
 * Returns null if unrecognized — never silently defaults to a privileged role.
 */
export function normalizeRole(raw?: string | null): AppRole | null {
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const cleaned = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (cleaned) {
    // 1. Super Admin (Platform Owner)
    case "super_admin":
    case "superadmin":
    case "platform_admin":
    case "owner":
      return "super_admin";

    // 2. HR Admin (Company Operations)
    case "hr_admin":
    case "hradmin":
    case "hr":
    case "hr_manager":
    case "hrmanager":
    case "hr_executive":
    case "hrexecutive":
    case "human_resources":
      return "hr_admin";

    // 3. Executive (CEO/CTO/CIO/CFO/COO/CMO)
    case "executive":
    case "ceo":
    case "cto":
    case "cio":
    case "cfo":
    case "coo":
    case "cmo":
      return "executive";

    // 4. Manager (Team lead / Department)
    case "manager":
    case "manager_admin":
    case "hiring_manager":
    case "hiringmanager":
      return "manager";

    // 5. Employee (Self-Service)
    case "employee":
    case "staff":
    case "user":
    case "member":
      return "employee";

    // 6. IT Admin (Technical operations)
    case "it_admin":
    case "itadmin":
    case "sysadmin":
    case "sys_admin":
    case "system_admin":
    case "it":
      return "it_admin";

    default:
      return null;
  }
}

/**
 * Reads the role ONLY from the authenticated user state (aurix store: ws.user.role).
 * NEVER reads from localStorage.getItem("user_role") or any client-writable source.
 */
export function useCurrentRole(): AppRole | null {
  const ws = useAurix();
  return normalizeRole(ws.user?.role);
}

// ── Role Check Helpers ────────────────────────────────────────────────────────

/** Returns true if the role is the sole platform owner (SUPER_ADMIN). */
export function isSuperAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "super_admin";
}

export const isPlatformOwner = isSuperAdmin;

/** Returns true if the role is an HR Administrator for a company. */
export function isHrAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "hr_admin";
}

/** Returns true if the role is a Team / Department Manager. */
export function isManager(role?: string | null): boolean {
  return normalizeRole(role) === "manager";
}

/** Returns true if the role is an individual Employee. */
export function isEmployee(role?: string | null): boolean {
  return normalizeRole(role) === "employee";
}

/** Returns true if the role is an IT Administrator. */
export function isItAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "it_admin";
}

/** Returns true if the role is an Executive. */
export function isExecutive(role?: string | null): boolean {
  return normalizeRole(role) === "executive";
}

/** Returns true if the role is a normal company organization role (NOT platform owner). */
export function isCompanyRole(role?: string | null): boolean {
  const norm = normalizeRole(role);
  return norm !== null && COMPANY_ROLES.includes(norm);
}

// ── Operational Permission Boundary Helpers ────────────────────────────────────

/**
 * Checks if the role has team management / approval privileges in a company (Manager, HR Admin).
 * Super Admin is NOT part of daily company team approvals.
 */
export function isAtLeastManager(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "hr_admin" || normalized === "manager";
}

export const canApprove = isAtLeastManager;
export const canReviewLeaves = isAtLeastManager;
export const canManageEmployees = isAtLeastManager;

/**
 * Checks if the role has payroll management privileges (HR Admin).
 * Super Admin does not manage company payroll runs.
 */
export function canManagePayroll(role?: string | null): boolean {
  return normalizeRole(role) === "hr_admin";
}

export const canViewAllBalances = (role?: string | null) => {
  const norm = normalizeRole(role);
  return norm === "hr_admin" || norm === "manager";
};

/** Checks if the role has platform-level owner permissions (SUPER_ADMIN ONLY). */
export function canManagePlatform(role?: string | null): boolean {
  return isSuperAdmin(role);
}

/** Checks if the role can manage company-level HR settings (HR_ADMIN). */
export function canManageCompanySettings(role?: string | null): boolean {
  return isHrAdmin(role);
}
