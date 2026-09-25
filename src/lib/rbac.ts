/**
 * Role-Based Access Control (RBAC) Module for OFC360.
 * Re-exports role helpers from `roles.ts` and defines RBAC groups.
 */
export * from "./roles";
export type { AppRole as Role } from "./roles";

// Company organization role groups
export const MANAGEMENT_ROLES = ["hr_admin", "manager"] as const;
export const HR_ADMIN_ROLES = ["hr_admin"] as const;
export const SYSTEM_ADMIN_ROLES = ["it_admin"] as const;
export const EXECUTIVE_ROLES = ["executive"] as const;
export const EMPLOYEE_ROLES = ["employee"] as const;

// Platform role group (sole platform owner)
export const PLATFORM_OWNER_ROLES = ["super_admin"] as const;

export function canManageEmployees(role?: string | null): boolean {
  const norm = role?.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return norm === "hr_admin" || norm === "manager";
}
