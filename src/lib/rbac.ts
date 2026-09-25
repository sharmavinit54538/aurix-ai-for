/**
 * @deprecated Use `@/lib/roles` instead.
 * This file is retained as an alias to `roles.ts` to prevent broken imports.
 */
export * from "./roles";
export type { AppRole as Role } from "./roles";

export const MANAGEMENT_ROLES = ["superadmin", "hr_admin", "manager"] as const;
export const ADMIN_ROLES = ["superadmin", "hr_admin"] as const;
export const SYSTEM_ADMIN_ROLES = ["superadmin", "it_admin"] as const;
export const EXECUTIVE_ROLES = ["superadmin", "executive"] as const;

export function canManageEmployees(role?: string | null): boolean {
  const norm = role?.trim().toLowerCase();
  return norm === "superadmin" || norm === "hr_admin" || norm === "manager" || norm === "admin" || norm === "super_admin";
}
