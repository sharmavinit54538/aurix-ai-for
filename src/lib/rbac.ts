/** Canonical frontend authorization model. */
export type Role =
  | "super_admin"
  | "hr_admin"
  | "employee"
  | "manager"
  | "it_admin"
  | "executive";

export const MANAGEMENT_ROLES = ["super_admin", "hr_admin", "manager"] as const;
export const ADMIN_ROLES = ["super_admin", "hr_admin"] as const;
export const SYSTEM_ADMIN_ROLES = ["super_admin", "it_admin"] as const;
export const EXECUTIVE_ROLES = ["super_admin", "executive"] as const;

/** Converts backend-era labels at the auth boundary to a canonical role. */
export function normalizeRole(role?: string | null): Role {
  const normalized = (role || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  switch (normalized) {
    case "super_admin":
    case "superadmin":
    case "admin": return "super_admin";
    case "hr_admin":
    case "hradmin":
    case "hr": return "hr_admin";
    case "manager":
    case "manager_admin":
    case "hiring_manager": return "manager";
    case "it_admin":
    case "itadmin":
    case "sysadmin": return "it_admin";
    case "executive":
    case "ceo":
    case "cto":
    case "cio":
    case "cfo":
    case "coo": return "executive";
    case "employee":
    case "staff":
    case "user":
    default: return "employee";
  }
}

export const isSuperAdmin = (role?: string | null) => normalizeRole(role) === "super_admin";
export const isHrAdmin = (role?: string | null) => normalizeRole(role) === "hr_admin";
export const isEmployee = (role?: string | null) => normalizeRole(role) === "employee";
export const isManager = (role?: string | null) => normalizeRole(role) === "manager";
export const isItAdmin = (role?: string | null) => normalizeRole(role) === "it_admin";
export const isExecutive = (role?: string | null) => normalizeRole(role) === "executive";

export function canReviewLeaves(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "super_admin" || normalized === "hr_admin" || normalized === "manager";
}

export function canManageEmployees(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "super_admin" || normalized === "hr_admin" || normalized === "manager";
}

export function canManagePayroll(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "super_admin" || normalized === "hr_admin";
}

export const canManageCompany = isSuperAdmin;
