/**
 * Super Admin domain types and API contracts.
 *
 * Every type is based directly on the FastAPI backend schemas in `app/api/super_admin.py`
 * mounted at `/api/v1/super-admin`.
 */

// ─── 1. Platform Statistics & Dashboard ──────────────────────────────────────

export interface SuperAdminKpis {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
  total_hr_admins: number;
  total_employees: number;
  total_managers: number;
  total_executives: number;
  total_it_admins: number;
  total_super_admins: number;
  active_users: number;
  inactive_users: number;
  paid_organizations: number;
  complimentary_organizations: number;
  free_organizations: number;
  trial_organizations: number;
  suspended_organizations: number;
  expired_organizations: number;
  total_employees_count: number;
  total_workforce_managed: number;
  active_security_incidents: number;
  dau: number;
  mau: number;
}

export interface SuperAdminFinancials {
  total_revenue: number;
  mrr: number;
  arr: number;
  monthly_recurring_revenue: number;
  annual_recurring_revenue: number;
  revenue_growth: number;
  pending_payments: number;
  failed_payments: number;
}

export interface SuperAdminRevenueTrendPoint {
  month: string;
  revenue: number;
  mrr: number;
}

export interface SuperAdminPlanCount {
  plan: string;
  count: number;
}

export interface SuperAdminStatusDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface SuperAdminCharts {
  revenue_trend: SuperAdminRevenueTrendPoint[];
  subscription_distribution: SuperAdminPlanCount[];
  status_distribution: SuperAdminStatusDistributionPoint[];
}

export interface SuperAdminStatisticsResponse {
  kpis: SuperAdminKpis;
  financials: SuperAdminFinancials;
  charts: SuperAdminCharts;
  unpaid_active_customers: unknown[];
}

/** Legacy UI adapters for statistics */
export interface PlatformUserCounts {
  total: number | null;
  active: number | null;
  inactive: number | null;
  hrAdmins: number | null;
  managers: number | null;
  employees: number | null;
  executives: number | null;
  itAdmins: number | null;
  superAdmins: number | null;
}

export interface PlatformOrganizationCounts {
  total: number | null;
  onboarded: number | null;
  trial: number | null;
  suspended: number | null;
  paid: number | null;
  complimentary: number | null;
  withoutSubscription: number | null;
}

export interface PlatformStatistics {
  users: PlatformUserCounts;
  organizations: PlatformOrganizationCounts;
  activeWorkforce: number | null;
  raw?: SuperAdminStatisticsResponse;
}

// ─── 2. Organizations ────────────────────────────────────────────────────────

export interface PlatformHrAdminRef {
  id?: string;
  name: string | null;
  email: string | null;
  phone?: string | null;
}

export interface OrganizationRecord {
  id: string;
  name: string | null;
  domain?: string | null;
  plan?: string | null;
  status: string | null;
  access_status?: string | null;
  access_type?: string | null;
  payment_status?: string | null;
  access_source?: string | null;
  access_granted_by?: string | null;
  access_expires_at?: string | null;
  access_grant_reason?: string | null;
  mrr?: number | null;
  storageUsedGb?: number | null;
  industry?: string | null;
  location?: string | null;
  user_count?: number | null;
  userCount: number | null;
  employee_count?: number | null;
  employeeCount: number | null;
  hr_admin?: PlatformHrAdminRef | null;
  primaryHrAdmin: PlatformHrAdminRef | null;
  hr_admins?: PlatformHrAdminRef[];
  hrAdminName?: string | null;
  hrAdminEmail?: string | null;
  owner?: PlatformHrAdminRef | null;
  created_at?: string | null;
  createdAt: string | null;
}

export interface OrganizationDetail {
  id: string;
  name: string;
  domain: string | null;
  hr_admin: PlatformHrAdminRef | null;
  primaryHrAdmin?: PlatformHrAdminRef | null;
  hr_admins: PlatformHrAdminRef[];
  owner: PlatformHrAdminRef | null;
  subscription: {
    plan: string | null;
    access_status: string;
    access_type: string;
    payment_status: string;
    access_source: string;
    access_granted_by: string;
    access_granted_at: string | null;
    access_expires_at: string | null;
    access_grant_reason: string | null;
    mrr: number;
  };
  stats: {
    user_count: number;
    employee_count: number;
    employeeCount: number;
    total_spent: number;
  };
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string | null;
  }>;
  audit_logs: Array<{
    id: string;
    action: string;
    email: string;
    details: string;
    created_at: string | null;
  }>;
}

export interface CreateOrganizationPayload {
  name: string;
  domain?: string;
  plan?: string;
  status?: string;
  hrAdminName?: string;
  hrAdminEmail?: string;
  phone?: string;
  industry?: string;
  location?: string;
  mrr?: number;
  employeeCount?: number;
}

export interface UpdateOrganizationPayload {
  name?: string;
  domain?: string;
  plan?: string;
  status?: string;
  industry?: string;
  location?: string;
  employeeCount?: number;
  mrr?: number;
  hrAdminName?: string;
  hrAdminEmail?: string;
  phone?: string;
}

export interface GrantAccessPayload {
  plan?: string;
}

export interface ExtendAccessPayload {
  days?: number;
}

export interface SuspendAccessPayload {
  reason?: string;
}

export interface CancelAccessPayload {
  reason?: string;
}

export interface ReactivateAccessPayload {
  reason?: string;
}

export type PlatformOrganization = OrganizationRecord;

// ─── 3. Platform Users ───────────────────────────────────────────────────────

export interface PlatformUserRecord {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  organization_id?: string | null;
  organizationId: string | null;
  companyId?: string | null;
  company_id?: string | null;
  company_name?: string | null;
  companyName?: string | null;
  organization?: string | null;
  organizationName: string | null;
  status?: string | null;
  is_active?: boolean | null;
  isActive: boolean | null;
  is_verified?: boolean | null;
  isVerified: boolean | null;
  created_at?: string | null;
  createdAt: string | null;
  last_login?: string | null;
  lastLoginAt: string | null;
  lastLogin?: string | null;
}

export interface PlatformUserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  companyId: string;
  is_active: boolean;
  status: string;
  created_at: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  companyId?: string;
  organization_id?: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  role?: string;
  status?: string;
  companyId?: string;
}

export type PlatformUser = PlatformUserRecord;

// ─── 4. HR Admins ────────────────────────────────────────────────────────────

export type HrAdminRecord = PlatformUserRecord;

export interface CreateHrAdminPayload {
  name: string;
  email: string;
  phone?: string;
  companyId?: string;
}

export interface UpdateHrAdminPayload {
  name?: string;
  phone?: string;
  companyId?: string;
  status?: string;
}

export interface AssignHrAdminPayload {
  companyId: string;
}

// ─── 5. Subscriptions ────────────────────────────────────────────────────────

export interface SubscriptionRecord {
  id: string;
  companyId: string;
  companyName: string;
  plan: string;
  billingCycle: string;
  amount: number;
  nextBillingDate: string;
  status: string;
  activeLicenses: number;
  maxLicenses: number;
  autoRenew: boolean;
}

export interface SubscriptionDetail {
  id: string;
  companyId: string;
  plan: string;
  access_status: string;
  payment_status: string;
  mrr: number;
  created_at: string | null;
}

export interface UpdateSubscriptionPayload {
  plan?: string;
  amount?: number;
  status?: string;
}

// ─── 6. Plans ────────────────────────────────────────────────────────────────

export interface PlanRecord {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  max_employees: number;
  is_active: boolean;
}

export interface CreatePlanPayload {
  id?: string;
  name: string;
  price: number;
  billing_cycle?: string;
  max_employees?: number;
  is_active?: boolean;
}

export interface UpdatePlanPayload {
  name?: string;
  price?: number;
  billing_cycle?: string;
  max_employees?: number;
  is_active?: boolean;
}

// ─── 7. Entitlements ─────────────────────────────────────────────────────────

export interface EntitlementsData {
  payroll_enabled: boolean;
  ai_copilot_enabled: boolean;
  face_attendance_enabled: boolean;
  advanced_analytics_enabled: boolean;
  multi_org_enabled: boolean;
  [key: string]: boolean;
}

export type UpdateEntitlementsPayload = Partial<Record<string, boolean>>;

// ─── 8. Billing & Payments ───────────────────────────────────────────────────

export interface BillingRecord {
  id: string;
  amount: number;
  currency: string;
  gateway: string;
  invoice_number: string;
  status: string;
  organization_name: string;
  companyName: string;
  payment_date: string;
}

// ─── 9. Security ─────────────────────────────────────────────────────────────

export interface SecurityOverview {
  security_score: number;
  active_sessions_count: number;
  jwt_algorithm: string;
  mfa_enforced: boolean;
  failed_logins_24h: number;
}

export interface SecurityEventRecord {
  id: string;
  timestamp: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceIp: string;
  userAgent: string;
  details: string;
  status: "Resolved" | "Investigating";
}

export interface SecuritySessionRecord {
  id: string;
  adminName?: string | null;
  userName: string | null;
  adminEmail?: string | null;
  userEmail: string | null;
  ipAddress?: string | null;
  location?: string | null;
  browser?: string | null;
  os?: string | null;
  device?: string | null;
  loginTime?: string | null;
  startedAt: string | null;
  lastActivity?: string | null;
  status?: string | null;
}

export type PlatformSession = SecuritySessionRecord;

export interface BlockIpPayload {
  ip: string;
}

// ─── 10. Audit Logs ──────────────────────────────────────────────────────────

export interface AuditLogRecord {
  id: string;
  timestamp: string | null;
  actor?: string | null;
  actorEmail: string | null;
  action: string | null;
  resource?: string | null;
  targetCompany?: string | null;
  organizationId: string | null;
  result?: "SUCCESS" | "BLOCKED" | string | null;
  ip?: string | null;
  ip_address?: string | null;
  details: string | null;
}

export type PlatformAuditEvent = AuditLogRecord;

export interface PruneAuditLogsResponse {
  success: boolean;
  message: string;
}

// ─── 11. System Health Telemetry ─────────────────────────────────────────────

export interface SystemHealthService {
  name: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  response_time: string;
  is_healthy: boolean;
  latency: string;
}

export interface SystemHealthData {
  services: SystemHealthService[];
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
}

export type ServiceState = "online" | "degraded";

export interface SystemHealthSnapshot {
  database: {
    status: ServiceState | null;
    pingMs: number | null;
  };
  apiRoundTripMs: number;
  checkedAt: string;
}

export interface PublicHealth {
  status: string | null;
  database: string | null;
  appName: string | null;
  version: string | null;
  environment: string | null;
}

export interface LlmProviderHealth {
  name: string;
  healthy: boolean;
}

export interface ReadinessReport {
  ready: boolean | null;
  database: string | null;
  llm: {
    healthy: boolean | null;
    providers: LlmProviderHealth[];
    healthyCount: number | null;
    totalCount: number | null;
  } | null;
  httpStatus: number;
}

// ─── 12. Platform Settings ───────────────────────────────────────────────────

export type PlatformSettingValue = string | number | boolean;

export type PlatformSettings = Record<string, PlatformSettingValue>;

// ─── 13. Onboarding ──────────────────────────────────────────────────────────

export interface OnboardingRecord {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  tier: string;
  progressPercentage: number;
  currentStep: string;
  status: string;
  submittedAt: string;
  notes: string;
}

export interface OnboardingDetail {
  id: string;
  companyName: string;
  onboarding_completed: boolean;
  onboarding_step: number;
}

// ─── 14. Analytics ───────────────────────────────────────────────────────────

export interface PlatformAnalyticsModuleUsage {
  name: string;
  usage: number;
}

export interface PlatformAnalyticsStorage {
  total_used_gb: number;
  total_allocated_gb: number;
  documents_count: number;
}

export interface PlatformAnalyticsData {
  module_usage: PlatformAnalyticsModuleUsage[];
  storage: PlatformAnalyticsStorage;
}

export interface AiUsageData {
  tokens_consumed_24h: number;
  total_prompts: number;
  active_ai_users: number;
  quota_remaining: number;
}

// ─── 15. Announcements ───────────────────────────────────────────────────────

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  created_at: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  content: string;
  target_audience?: string;
}

export interface UpdateAnnouncementPayload {
  title?: string;
  content?: string;
  target_audience?: string;
}

// ─── 16. Parameter Types & Queries ───────────────────────────────────────────

export type UserStatusFilter = "active" | "inactive";

export interface UserListParams {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  role?: string;
  status?: string;
  organizationId?: string;
  organization_id?: string;
}

export type OrganizationOnboardingFilter = "complete" | "pending";

export interface OrganizationListParams {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  status?: string;
  access_status?: string;
  plan?: string;
  onboarding?: OrganizationOnboardingFilter;
}

export interface AuditLogListParams {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  action?: string;
}

export interface CollectedRecords<T> {
  items: T[];
  truncated: boolean;
}

export interface AnalyticsDataset {
  users: CollectedRecords<PlatformUser>;
  organizations: CollectedRecords<PlatformOrganization>;
  collectedAt: string;
}
