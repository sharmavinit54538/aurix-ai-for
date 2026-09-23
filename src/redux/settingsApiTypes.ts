/**
 * Common and specific TypeScript types for the Settings RTK Query APIs.
 */

// ── Generic Response Envelope ───────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// ── General Settings Types ───────────────────────────────────────────
export interface GeneralSettings {
  appName?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  currency?: string;
  fiscalYearStart?: string;
  workDaysPerWeek?: number;
  [key: string]: unknown;
}

export interface SettingsSummary {
  general?: GeneralSettings;
  company?: CompanySettings;
  rolesCount?: number;
  security?: Partial<SecuritySettings>;
  notifications?: Partial<NotificationSettings>;
  mfaEnabled?: boolean;
  activeSessionsCount?: number;
  [key: string]: unknown;
}

export interface CompanySettings {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  registrationNumber?: string;
  logoUrl?: string;
  faviconUrl?: string;
  [key: string]: unknown;
}

export interface Role {
  id: string | number;
  name: string;
  description?: string;
  userCount?: number;
  permissions: string[];
  isSystem?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface UpdateRolePayload {
  id: string | number;
  data: Partial<CreateRolePayload>;
}

export interface PermissionItem {
  id: string | number;
  name: string;
  description?: string;
  category: string;
  code?: string;
  [key: string]: unknown;
}

export interface AuditLog {
  id: string | number;
  timestamp: string;
  user?: string;
  userId?: string | number;
  role?: string;
  action: string;
  module: string;
  ip?: string;
  status: string;
  details?: string | Record<string, unknown>;
  [key: string]: unknown;
}

export interface AuditLogResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface InvoiceItem {
  id: string | number;
  date: string;
  amount: string | number;
  status: string;
  pdfUrl?: string;
  billingCycle?: string;
  [key: string]: unknown;
}

export interface BillingData {
  currentPlan?: string;
  billingCycle?: string;
  amount?: string | number;
  nextBillingDate?: string;
  seats?: number;
  usedSeats?: number;
  paymentMethod?: string;
  invoices?: InvoiceItem[];
  [key: string]: unknown;
}

export interface ActiveSession {
  id: string | number;
  device?: string;
  ip?: string;
  lastActive?: string;
  current?: boolean;
  location?: string;
  browser?: string;
  os?: string;
  [key: string]: unknown;
}

export interface PasswordPolicy {
  minLength: number;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  requireUppercase: boolean;
  expirationDays?: number;
  [key: string]: unknown;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  passwordExpirationDays?: number;
  activeSessions?: ActiveSession[];
  ipWhitelisting?: string[];
  passwordPolicy?: PasswordPolicy;
  [key: string]: unknown;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  inAppAlerts: boolean;
  slackAlerts?: boolean;
  weeklyDigest?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
  payrollAlerts?: boolean;
  [key: string]: unknown;
}

export interface IntegrationItem {
  id: string | number;
  name: string;
  category?: string;
  connected: boolean;
  icon?: string;
  config?: Record<string, unknown>;
  lastSync?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ProfileSettings {
  fullName: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  bio?: string;
  role?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface ProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
  [key: string]: unknown;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  bio?: string;
}

export interface HrSettings {
  defaultProbationMonths?: number;
  noticePeriodDays?: number;
  leaveApprovalWorkflow?: string;
  autoApproveAttendance?: boolean;
  fiscalYearStartMonth?: number;
  standardWorkHoursPerDay?: number;
  [key: string]: unknown;
}

export interface MfaStatusResponse {
  enabled: boolean;
  method?: "totp" | "sms" | "email";
  phoneMasked?: string;
  backupCodesRemaining?: number;
  [key: string]: unknown;
}

export interface MfaEnablePayload {
  phone?: string;
  method?: "totp" | "sms" | "email";
  [key: string]: unknown;
}

export interface MfaEnableResponse {
  qrCodeUrl?: string;
  secret?: string;
  backupCodes?: string[];
  [key: string]: unknown;
}

export interface MfaVerifyPayload {
  code: string;
  secret?: string;
}

export interface MfaVerifyResponse {
  verified: boolean;
  message?: string;
  backupCodes?: string[];
}

export interface MfaDisablePayload {
  code?: string;
  password?: string;
}

// ── Payroll Settings Types ───────────────────────────────────────────
export interface PayrollSettings {
  id?: string | number;
  payFrequency?: "weekly" | "biweekly" | "semimonthly" | "monthly";
  payCycleDay?: number;
  cutoffDay?: number;
  currency?: string;
  taxDeductionEnabled?: boolean;
  autoDirectDeposit?: boolean;
  statutoryContributions?: Record<string, unknown>;
  complianceRules?: Record<string, unknown>;
  overtimeMultiplier?: number;
  bonusTaxRate?: number;
  [key: string]: unknown;
}

export interface PayrollHistoryItem {
  id: string | number;
  version?: number;
  changedAt: string;
  changedBy?: string;
  diff?: Record<string, { old: unknown; new: unknown }>;
  summary?: string;
  [key: string]: unknown;
}

export interface PayrollAuditItem {
  id: string | number;
  action: string;
  timestamp: string;
  actor: string;
  status: string;
  details?: Record<string, unknown> | string;
  [key: string]: unknown;
}

export interface PayrollResetPayload {
  reason?: string;
  [key: string]: unknown;
}

export interface PayrollResetResponse {
  reset: boolean;
  restoredDefaults: PayrollSettings;
  message?: string;
}

export interface PayrollTestPayload {
  grossSalary?: number;
  employeeId?: string | number;
  customDeductions?: Record<string, number>;
  [key: string]: unknown;
}

export interface PayrollTestResponse {
  calculatedNet: number;
  grossSalary: number;
  totalDeductions: number;
  taxes: Record<string, number>;
  statutory: Record<string, number>;
  [key: string]: unknown;
}

export interface PayrollExportParams {
  format?: "csv" | "json" | "xlsx" | "pdf";
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface PayrollExportResponse {
  downloadUrl?: string;
  content?: string;
  filename?: string;
  [key: string]: unknown;
}

// ── Overtime Settings Types ──────────────────────────────────────────
export interface OvertimeSettings {
  id?: string | number;
  enabled: boolean;
  standardHoursPerDay?: number;
  standardHoursPerWeek?: number;
  weekdayRateMultiplier?: number;
  weekendRateMultiplier?: number;
  holidayRateMultiplier?: number;
  requiresPreApproval?: boolean;
  maxOvertimeHoursPerWeek?: number;
  autoCalculation?: boolean;
  [key: string]: unknown;
}

export interface OvertimeCalculationRequest {
  employeeId?: string | number;
  hoursWorked: number;
  regularHours?: number;
  overtimeType: "weekday" | "weekend" | "holiday";
  hourlyRate?: number;
  [key: string]: unknown;
}

export interface OvertimeCalculationResult {
  overtimeHours: number;
  rateMultiplier: number;
  calculatedAmount: number;
  totalCompensation: number;
  breakdown?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface OvertimeRequestPayload {
  employeeId?: string | number;
  date: string;
  hours: number;
  overtimeType?: "weekday" | "weekend" | "holiday";
  reason: string;
  [key: string]: unknown;
}

export interface OvertimeRequestResult {
  id: string | number;
  status: "pending" | "approved" | "rejected";
  hours: number;
  message?: string;
  [key: string]: unknown;
}

export interface OvertimeHistoryItem {
  id: string | number;
  employeeName?: string;
  employeeId?: string | number;
  date: string;
  hours: number;
  type: string;
  amount?: number;
  status: string;
  approver?: string;
  [key: string]: unknown;
}

export interface OvertimeAuditItem {
  id: string | number;
  action: string;
  timestamp: string;
  actor: string;
  details?: Record<string, unknown> | string;
  [key: string]: unknown;
}

// ── Tax Settings Types ───────────────────────────────────────────────
export interface TaxBracket {
  fromAmount: number;
  toAmount?: number | null;
  ratePercent: number;
  fixedAmount?: number;
  [key: string]: unknown;
}

export interface TaxItem {
  id: string | number;
  name: string;
  code: string;
  type: "flat" | "bracket" | "percentage" | "progressive";
  rate?: number;
  brackets?: TaxBracket[];
  isActive: boolean;
  description?: string;
  applicableTo?: "all" | "local" | "foreign" | "contractor";
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CreateTaxPayload {
  name: string;
  code: string;
  type: "flat" | "bracket" | "percentage" | "progressive";
  rate?: number;
  brackets?: TaxBracket[];
  isActive?: boolean;
  description?: string;
  applicableTo?: "all" | "local" | "foreign" | "contractor";
  effectiveFrom?: string;
  effectiveTo?: string;
  [key: string]: unknown;
}

export interface UpdateTaxPayload {
  id: string | number;
  data: Partial<CreateTaxPayload>;
}

export interface TaxAuditItem {
  id: string | number;
  taxId?: string | number;
  taxName?: string;
  action: string;
  timestamp: string;
  actor: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  [key: string]: unknown;
}

export interface TaxHistoryItem {
  id: string | number;
  taxId: string | number;
  version: number;
  rate?: number;
  changedAt: string;
  changedBy?: string;
  reason?: string;
  [key: string]: unknown;
}

export interface TaxRecalculatePayload {
  taxId?: string | number;
  period?: string;
  employeeIds?: (string | number)[];
  [key: string]: unknown;
}

export interface TaxRecalculateResponse {
  recalculated: boolean;
  affectedEmployeesCount: number;
  totalTaxAdjusted: number;
  message?: string;
  [key: string]: unknown;
}

export interface TaxImportResponse {
  importedCount: number;
  skippedCount?: number;
  errors?: string[];
  message?: string;
}

export interface TaxExportParams {
  format?: "csv" | "json" | "xlsx";
  activeOnly?: boolean;
  [key: string]: unknown;
}

export interface TaxExportResponse {
  downloadUrl?: string;
  content?: string;
  filename?: string;
  [key: string]: unknown;
}

// ── Security Settings (Payroll/Security) Types ─────────────────────────
export interface PayrollSecurityRole {
  id: string | number;
  name: string;
  description?: string;
  scope: "payroll_admin" | "payroll_viewer" | "payroll_approver" | "auditor";
  permissions: string[];
  usersCount?: number;
  [key: string]: unknown;
}

export interface PayrollSecurityPolicy {
  id: string | number;
  name: string;
  code: string;
  enabled: boolean;
  strictMode?: boolean;
  maxFailedAttempts?: number;
  lockoutDurationMinutes?: number;
  mfaRequiredForPayrollApproval?: boolean;
  dualApprovalRequired?: boolean;
  minimumApprovalThreshold?: number;
  [key: string]: unknown;
}

export interface PayrollSecuritySession {
  id: string | number;
  userId: string | number;
  userName?: string;
  userEmail?: string;
  ipAddress: string;
  device?: string;
  browser?: string;
  loginAt: string;
  lastActivityAt: string;
  isCurrentSession?: boolean;
  [key: string]: unknown;
}

export interface IpWhitelistItem {
  id: string | number;
  ipAddress: string;
  description?: string;
  addedBy?: string;
  addedAt: string;
  isActive: boolean;
  [key: string]: unknown;
}

export interface AddIpWhitelistPayload {
  ipAddress: string;
  description?: string;
  [key: string]: unknown;
}

export interface PayrollSecurityAuditItem {
  id: string | number;
  event: string;
  timestamp: string;
  actor: string;
  ipAddress?: string;
  status: "success" | "failure" | "blocked";
  details?: Record<string, unknown> | string;
  [key: string]: unknown;
}
