import { normalizeRole, type AppRole } from "./roles";

/**
 * Platform Owner Permissions — strictly restricted to SUPER_ADMIN.
 * Normal organization roles must never receive these.
 */
export const PLATFORM_PERMISSIONS = {
  PLATFORM_READ: "platform:read",
  PLATFORM_MANAGE: "platform:manage",
  USERS_READ_ALL: "users:read_all",
  USERS_MANAGE: "users:manage",
  ORGANIZATIONS_READ_ALL: "organizations:read_all",
  SYSTEM_MANAGE: "system:manage",
  AUDIT_READ_ALL: "audit:read_all",
} as const;

export type PlatformPermission =
  (typeof PLATFORM_PERMISSIONS)[keyof typeof PLATFORM_PERMISSIONS];

/**
 * Company Organization Permissions — assigned according to normal company roles.
 */
export const COMPANY_PERMISSIONS = {
  // HR Admin permissions
  HR_MANAGE: "hr:manage",
  WORKFORCE_MANAGE: "workforce:manage",
  ATTENDANCE_MANAGE: "attendance:manage",
  LEAVE_MANAGE: "leave:manage",
  PAYROLL_MANAGE: "payroll:manage",
  PAYROLL_VIEW: "payroll:view",
  PAYROLL_PROCESS: "payroll:process",
  PAYROLL_APPROVE: "payroll:approve",
  PAYROLL_FINALIZE: "payroll:finalize",
  PAYROLL_DISBURSE: "payroll:disburse",
  RECRUITMENT_MANAGE: "recruitment:manage",
  DOCUMENTS_MANAGE: "documents:manage",
  COMPANY_SETTINGS_MANAGE: "company_settings:manage",

  // Manager permissions
  TEAM_VIEW: "team:view",
  TEAM_ATTENDANCE: "team:attendance",
  TEAM_LEAVE_APPROVE: "team:leave_approve",
  TEAM_PERFORMANCE: "team:performance",

  // IT Admin permissions
  IT_SYSTEMS_MANAGE: "it:systems_manage",
  IT_ACCESS_MANAGE: "it:access_manage",
  ASSETS_MANAGE: "assets:manage",
  INTEGRATIONS_MANAGE: "integrations:manage",

  // Executive permissions
  BUSINESS_METRICS_VIEW: "executive:metrics_view",
  EXECUTIVE_REPORTS_VIEW: "executive:reports_view",

  // Employee Self-Service permissions
  SELF_PROFILE_READ: "self:profile_read",
  SELF_PROFILE_EDIT: "self:profile_edit",
  SELF_ATTENDANCE_VIEW: "self:attendance_view",
  SELF_ATTENDANCE_CLOCK: "self:attendance_clock",
  SELF_LEAVE_VIEW: "self:leave_view",
  SELF_LEAVE_APPLY: "self:leave_apply",
  SELF_PAYSLIP_VIEW: "self:payslip_view",
  SELF_DOCUMENTS_VIEW: "self:documents_view",
  SELF_ASSETS_VIEW: "self:assets_view",
} as const;

export type CompanyPermission =
  (typeof COMPANY_PERMISSIONS)[keyof typeof COMPANY_PERMISSIONS];

export type AnyPermission = PlatformPermission | CompanyPermission | string;

/**
 * Complete permission mapping by canonical role.
 */
export const ROLE_PERMISSION_MAP: Record<AppRole, readonly string[]> = {
  super_admin: [
    PLATFORM_PERMISSIONS.PLATFORM_READ,
    PLATFORM_PERMISSIONS.PLATFORM_MANAGE,
    PLATFORM_PERMISSIONS.USERS_READ_ALL,
    PLATFORM_PERMISSIONS.USERS_MANAGE,
    PLATFORM_PERMISSIONS.ORGANIZATIONS_READ_ALL,
    PLATFORM_PERMISSIONS.SYSTEM_MANAGE,
    PLATFORM_PERMISSIONS.AUDIT_READ_ALL,
  ],
  superadmin: [
    PLATFORM_PERMISSIONS.PLATFORM_READ,
    PLATFORM_PERMISSIONS.PLATFORM_MANAGE,
    PLATFORM_PERMISSIONS.USERS_READ_ALL,
    PLATFORM_PERMISSIONS.USERS_MANAGE,
    PLATFORM_PERMISSIONS.ORGANIZATIONS_READ_ALL,
    PLATFORM_PERMISSIONS.SYSTEM_MANAGE,
    PLATFORM_PERMISSIONS.AUDIT_READ_ALL,
  ],
  hr_admin: [
    COMPANY_PERMISSIONS.HR_MANAGE,
    COMPANY_PERMISSIONS.WORKFORCE_MANAGE,
    COMPANY_PERMISSIONS.ATTENDANCE_MANAGE,
    COMPANY_PERMISSIONS.LEAVE_MANAGE,
    COMPANY_PERMISSIONS.PAYROLL_MANAGE,
    COMPANY_PERMISSIONS.PAYROLL_VIEW,
    COMPANY_PERMISSIONS.PAYROLL_PROCESS,
    COMPANY_PERMISSIONS.PAYROLL_APPROVE,
    COMPANY_PERMISSIONS.PAYROLL_FINALIZE,
    COMPANY_PERMISSIONS.PAYROLL_DISBURSE,
    COMPANY_PERMISSIONS.RECRUITMENT_MANAGE,
    COMPANY_PERMISSIONS.DOCUMENTS_MANAGE,
    COMPANY_PERMISSIONS.COMPANY_SETTINGS_MANAGE,
    COMPANY_PERMISSIONS.SELF_PROFILE_READ,
    COMPANY_PERMISSIONS.SELF_PROFILE_EDIT,
    COMPANY_PERMISSIONS.SELF_ATTENDANCE_VIEW,
    COMPANY_PERMISSIONS.SELF_LEAVE_VIEW,
    COMPANY_PERMISSIONS.SELF_PAYSLIP_VIEW,
  ],
  manager: [
    COMPANY_PERMISSIONS.TEAM_VIEW,
    COMPANY_PERMISSIONS.TEAM_ATTENDANCE,
    COMPANY_PERMISSIONS.TEAM_LEAVE_APPROVE,
    COMPANY_PERMISSIONS.TEAM_PERFORMANCE,
    COMPANY_PERMISSIONS.SELF_PROFILE_READ,
    COMPANY_PERMISSIONS.SELF_PROFILE_EDIT,
    COMPANY_PERMISSIONS.SELF_ATTENDANCE_VIEW,
    COMPANY_PERMISSIONS.SELF_ATTENDANCE_CLOCK,
    COMPANY_PERMISSIONS.SELF_LEAVE_VIEW,
    COMPANY_PERMISSIONS.SELF_LEAVE_APPLY,
    COMPANY_PERMISSIONS.SELF_PAYSLIP_VIEW,
  ],
  employee: [
    COMPANY_PERMISSIONS.SELF_PROFILE_READ,
    COMPANY_PERMISSIONS.SELF_PROFILE_EDIT,
    COMPANY_PERMISSIONS.SELF_ATTENDANCE_VIEW,
    COMPANY_PERMISSIONS.SELF_ATTENDANCE_CLOCK,
    COMPANY_PERMISSIONS.SELF_LEAVE_VIEW,
    COMPANY_PERMISSIONS.SELF_LEAVE_APPLY,
    COMPANY_PERMISSIONS.SELF_PAYSLIP_VIEW,
    COMPANY_PERMISSIONS.SELF_DOCUMENTS_VIEW,
    COMPANY_PERMISSIONS.SELF_ASSETS_VIEW,
  ],
  it_admin: [
    COMPANY_PERMISSIONS.IT_SYSTEMS_MANAGE,
    COMPANY_PERMISSIONS.IT_ACCESS_MANAGE,
    COMPANY_PERMISSIONS.ASSETS_MANAGE,
    COMPANY_PERMISSIONS.INTEGRATIONS_MANAGE,
    COMPANY_PERMISSIONS.SELF_PROFILE_READ,
    COMPANY_PERMISSIONS.SELF_PROFILE_EDIT,
  ],
  executive: [
    COMPANY_PERMISSIONS.BUSINESS_METRICS_VIEW,
    COMPANY_PERMISSIONS.EXECUTIVE_REPORTS_VIEW,
    COMPANY_PERMISSIONS.SELF_PROFILE_READ,
    COMPANY_PERMISSIONS.SELF_PROFILE_EDIT,
  ],
};

/**
 * Validates whether a specific role possesses the requested permission.
 * Platform permissions are granted EXCLUSIVELY to super_admin.
 * Normal roles never inherit platform permissions.
 */
export function hasPermission(
  role: string | null | undefined,
  permission: AnyPermission,
): boolean {
  const norm = normalizeRole(role);
  if (!norm) return false;

  const permissions = ROLE_PERMISSION_MAP[norm] ?? [];
  return permissions.includes(permission);
}
