import { useAurix } from "./aurix-store";

/**
 * Exactly 6 canonical roles supported by the application.
 */
export type AppRole =
  | "superadmin"
  | "hr_admin"
  | "executive"
  | "manager"
  | "employee"
  | "it_admin";

export const ALL_APP_ROLES: readonly AppRole[] = [
  "superadmin",
  "hr_admin",
  "executive",
  "manager",
  "employee",
  "it_admin",
] as const;

/**
 * Maps every legacy/synonym string to exactly one of the 6 canonical AppRole values.
 * Case-insensitive, trims whitespace.
 * Returns null if unrecognized — never silently defaults to a privileged role.
 */
export function normalizeRole(raw?: string | null): AppRole | null {
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const cleaned = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (cleaned) {
    // 1. Super Admin
    case "superadmin":
    case "super_admin":
    case "admin":
    case "platform_admin":
    case "owner":
      return "superadmin";

    // 2. HR Admin
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

    // 4. Manager
    case "manager":
    case "manager_admin":
    case "hiring_manager":
    case "hiringmanager":
      return "manager";

    // 5. Employee
    case "employee":
    case "staff":
    case "user":
    case "member":
      return "employee";

    // 6. IT Admin
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

// ── Small Role Helpers ────────────────────────────────────────────────────────

export function isSuperAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "superadmin";
}

export function isHrAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "hr_admin";
}

export function isExecutive(role?: string | null): boolean {
  return normalizeRole(role) === "executive";
}

export function isManager(role?: string | null): boolean {
  return normalizeRole(role) === "manager";
}

export function isEmployee(role?: string | null): boolean {
  return normalizeRole(role) === "employee";
}

export function isItAdmin(role?: string | null): boolean {
  return normalizeRole(role) === "it_admin";
}

/**
 * Checks if the role has team management / approval privileges (Manager, HR Admin, Superadmin).
 */
export function isAtLeastManager(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return (
    normalized === "superadmin" ||
    normalized === "hr_admin" ||
    normalized === "manager"
  );
}

export const canApprove = isAtLeastManager;
export const canReviewLeaves = isAtLeastManager;

/**
 * Checks if the role has payroll management privileges (HR Admin, Superadmin).
 */
export function canManagePayroll(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "superadmin" || normalized === "hr_admin";
}

export const canViewAllBalances = canManagePayroll;
export const canManageCompany = isSuperAdmin;
