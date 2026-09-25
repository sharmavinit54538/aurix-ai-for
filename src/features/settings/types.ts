import { normalizeRole, type AppRole } from "@/lib/roles";

export type SettingsSectionKey =
  | "company"
  | "profile"
  | "employees"
  | "attendance"
  | "leave"
  | "payroll"
  | "documents"
  | "assets"
  | "notifications";

export type RbacRole = AppRole;

export const RBAC_ROLE_LABELS: Record<AppRole, string> = {
  superadmin: "SUPER ADMIN",
  hr_admin: "HR ADMIN",
  manager: "MANAGER",
  it_admin: "IT ADMIN",
  executive: "EXECUTIVE",
  employee: "EMPLOYEE",
};

export function getRbacRoleLabel(role: AppRole): string {
  return RBAC_ROLE_LABELS[role] ?? "EMPLOYEE";
}

export interface SettingsSectionMetadata {
  id: SettingsSectionKey;
  label: string;
  description: string;
  badge?: string;
}

export const SETTINGS_SECTIONS: SettingsSectionMetadata[] = [
  {
    id: "company",
    label: "Company",
    description:
      "Legal entity information, logo branding, contact coordinates, timezone, and fiscal calendar.",
  },
  {
    id: "profile",
    label: "My Profile",
    description:
      "Your authenticated personal account, contact info, avatar photo, and security credentials.",
  },
  {
    id: "employees",
    label: "Employees",
    description:
      "Employee ID conventions, onboarding date rules, employee status codes, departments, designations, and employment types.",
  },
  {
    id: "attendance",
    label: "Attendance",
    description:
      "Clock-in/out policies, biometric face authentication status, grace periods, late marks, half-day thresholds, and overtime criteria.",
  },
  {
    id: "leave",
    label: "Leave",
    description:
      "Leave entitlements, statutory allocations, carry-forward rollover rules, multi-tier approvals, and absence alerts.",
  },
  {
    id: "payroll",
    label: "Payroll",
    description:
      "Indian payroll structure (Basic, HRA, Allowances), pay frequency, PF, ESI, Professional Tax, TDS tax regimes, and payslip settings.",
  },
  {
    id: "documents",
    label: "Documents",
    description:
      "Document classification categories, compliance verification criteria, expiry alerts, salary slip format, provision slip rules, and templates.",
  },
  {
    id: "assets",
    label: "Assets",
    description:
      "Hardware & equipment categories, allocation agreements, return & exit clearances, and maintenance/warranty reminders.",
  },
  {
    id: "notifications",
    label: "Notifications",
    description:
      "Email delivery preferences, attendance alerts, leave requests, payroll processing notices, and document expiry warnings.",
  },
];

/**
 * Normalizes any role representation from backend/auth tokens into the 6 standard OFC360 roles.
 */
export function resolveRbacRole(roleString?: string | null): AppRole {
  return normalizeRole(roleString) ?? "employee";
}

export type PermissionLevel = "edit" | "view" | "denied";

export const RBAC_PERMISSIONS: Record<AppRole, Record<SettingsSectionKey, PermissionLevel>> = {
  superadmin: {
    company: "edit",
    profile: "edit",
    employees: "edit",
    attendance: "edit",
    leave: "edit",
    payroll: "edit",
    documents: "edit",
    assets: "edit",
    notifications: "edit",
  },
  hr_admin: {
    company: "edit",
    profile: "edit",
    employees: "edit",
    attendance: "edit",
    leave: "edit",
    payroll: "edit",
    documents: "edit",
    assets: "edit",
    notifications: "edit",
  },
  manager: {
    company: "denied",
    profile: "edit",
    employees: "view",
    attendance: "view",
    leave: "view",
    payroll: "denied",
    documents: "view",
    assets: "view",
    notifications: "edit",
  },
  it_admin: {
    company: "denied",
    profile: "edit",
    employees: "denied",
    attendance: "denied",
    leave: "denied",
    payroll: "denied",
    documents: "view",
    assets: "edit",
    notifications: "edit",
  },
  executive: {
    company: "view",
    profile: "edit",
    employees: "view",
    attendance: "view",
    leave: "view",
    payroll: "view",
    documents: "view",
    assets: "view",
    notifications: "edit",
  },
  employee: {
    company: "denied",
    profile: "edit",
    employees: "denied",
    attendance: "denied",
    leave: "denied",
    payroll: "denied",
    documents: "denied",
    assets: "denied",
    notifications: "view",
  },
};

export function getSectionPermission(role: RbacRole, section: SettingsSectionKey): PermissionLevel {
  return RBAC_PERMISSIONS[role]?.[section] ?? "denied";
}

export function canAccessSection(role: RbacRole, section: SettingsSectionKey): boolean {
  return getSectionPermission(role, section) !== "denied";
}

export function canEditSection(role: RbacRole, section: SettingsSectionKey): boolean {
  return getSectionPermission(role, section) === "edit";
}

// ─────────────────────────────────────────────────────────────
// Section Data Interfaces
// ─────────────────────────────────────────────────────────────

export interface CompanySettingsForm {
  name: string;
  logoUrl?: string;
  logoDataUrl?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  timezone: string;
  currency: string;
  financialYearStart: string; // e.g. "April"
  financialYearEnd: string; // e.g. "March"
}

export interface MyProfileForm {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  designation?: string;
  department?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  managerName?: string;
  employeeCount?: number;
}

export interface DesignationItem {
  id: string;
  name: string;
  department?: string;
  level?: string;
}

export interface EmployeeSettingsForm {
  idPrefix: string;
  idNumberLength: number;
  idSuffix: string;
  probationDays: number;
  noticePeriodDays: number;
  allowPastJoiningDate: boolean;
  maxPastJoiningDays: number;
  statuses: string[];
  employmentTypes: string[];
}

export interface AttendanceSettingsForm {
  attendanceMethod: "web" | "mobile_geofence" | "face_biometric" | "hybrid";
  faceVerificationEnabled: boolean;
  faceConfidenceThreshold: number;
  workStartTime: string;
  workEndTime: string;
  fullDayMinHours: number;
  halfDayMinHours: number;
  gracePeriodMinutes: number;
  maxLateMarksPerMonth: number;
  lateMarkPenaltyType: "half_day" | "lop" | "warning";
  earlyLeaveThresholdMinutes: number;
  overtimeEligible: boolean;
  minOvertimeMinutes: number;
  overtimeRateMultiplier: number;
  notifyOnLateCheckIn: boolean;
  notifyOnMissedCheckOut: boolean;
}

export interface LeaveTypeItem {
  id: string;
  name: string;
  annualQuota: number;
  carryForwardAllowed: boolean;
  maxCarryForwardDays: number;
  requiresAttachment: boolean;
  paid: boolean;
}

export interface LeaveSettingsForm {
  leaveTypes: LeaveTypeItem[];
  approvalWorkflow: "single_manager" | "manager_then_hr" | "hr_only";
  autoApproveDaysAfterPending: number;
  allowNegativeBalance: boolean;
  notifyOnLeaveRequest: boolean;
  notifyOnApprovalDecision: boolean;
}

export interface SalaryComponentItem {
  name: string;
  percentageOfCtc?: number;
  fixedMonthly?: number;
  taxExempt: boolean;
  type: "earning" | "deduction";
}

export interface PayrollSettingsForm {
  payFrequency: "monthly" | "biweekly";
  currency: string;
  salaryStructureName: string;
  components: SalaryComponentItem[];
  // Statutory Indian Payroll
  pfEnabled: boolean;
  pfEmployeePercent: number; // 12%
  pfEmployerPercent: number; // 12%
  pfWageCeiling: number; // 15000
  esiEnabled: boolean;
  esiEmployeePercent: number; // 0.75%
  esiEmployerPercent: number; // 3.25%
  esiWageCeiling: number; // 21000
  ptEnabled: boolean;
  ptState: string;
  tdsWindowOpen: boolean;
  tdsDefaultRegime: "new" | "old";
  payslipGenerationDay: number;
  passwordProtectedPayslips: boolean;
  showLeaveBalanceOnPayslip: boolean;
}

export interface DocumentTypeItem {
  id: string;
  name: string;
  mandatory: boolean;
  allowedFormats: string[];
  maxSizeMb: number;
  requiresHrVerification: boolean;
  hasExpiry: boolean;
}

export interface DocumentSettingsForm {
  documentTypes: DocumentTypeItem[];
  expiryReminderDays: number[]; // e.g. [30, 15, 7]
  salarySlipWatermark: boolean;
  salarySlipVisibleToEmployee: boolean;
  provisionSlipLockedRequired: boolean;
  provisionSlipVisibleToEmployee: boolean;
  templatesCount: number;
}

export interface AssetCategoryItem {
  id: string;
  name: string;
  description?: string;
  requiresSerialNumber: boolean;
  requiresWarrantyTracking: boolean;
}

export interface AssetSettingsForm {
  categories: AssetCategoryItem[];
  requireEmployeeAcknowledgment: boolean;
  mandatoryClearanceOnExit: boolean;
  notifyWarrantyExpiryDays: number;
  notifyAssetReturnDays: number;
}

export interface NotificationSettingsForm {
  emailNotifications: boolean;
  attendanceAlerts: boolean;
  leaveAlerts: boolean;
  payrollAlerts: boolean;
  documentExpiryAlerts: boolean;
  weeklyDigest: boolean;
}
