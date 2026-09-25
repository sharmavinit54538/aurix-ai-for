/**
 * Super Admin domain types.
 *
 * Every value originates from the OFC360 backend (`/api/v1/super-admin/*`, `/health`,
 * `/health/ready`). A `null` value means "the API did not provide this value" — the UI
 * renders it as unavailable instead of substituting a number or label.
 */

/** User counts from `GET /super-admin/statistics` → `kpis`. */
export interface PlatformUserCounts {
  total: number | null;
  active: number | null;
  inactive: number | null;
  /** Roles hr_admin, admin, hr_manager, company_admin. */
  hrAdmins: number | null;
  managers: number | null;
  /** Roles employee, intern. */
  employees: number | null;
  /** Roles executive, ceo, cto, cfo, coo, cmo, clo, ciso, cio. */
  executives: number | null;
  /** Roles it_admin, ciso, cio, cto (C-level technology roles also count as executives). */
  itAdmins: number | null;
  superAdmins: number | null;
}

/** Organization counts from `GET /super-admin/statistics` → `kpis`. */
export interface PlatformOrganizationCounts {
  total: number | null;
  /** Companies with onboarding completed (`kpis.active_organizations`). */
  onboarded: number | null;
  trial: number | null;
  suspended: number | null;
  paid: number | null;
  complimentary: number | null;
  /** Companies with no subscription record (`kpis.free_organizations`). */
  withoutSubscription: number | null;
}

export interface PlatformStatistics {
  users: PlatformUserCounts;
  organizations: PlatformOrganizationCounts;
  /** Active, non-deleted employee records across every tenant (`kpis.total_workforce_managed`). */
  activeWorkforce: number | null;
}

export interface PlatformUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  /** Raw role value stored in the database, e.g. `hr_admin`, `cto`, `intern`. */
  role: string | null;
  organizationId: string | null;
  organizationName: string | null;
  isActive: boolean | null;
  isVerified: boolean | null;
  /** ISO-8601 timestamp. */
  createdAt: string | null;
  /** ISO-8601 timestamp of the last successful sign-in; `null` when the user never signed in. */
  lastLoginAt: string | null;
}

export interface PlatformHrAdminRef {
  name: string | null;
  email: string | null;
}

export interface PlatformOrganization {
  id: string;
  name: string | null;
  domain: string | null;
  plan: string | null;
  /** Backend-derived tenant status: "Active" | "Trial" | "Suspended". */
  status: string | null;
  userCount: number | null;
  /** Active employee records in this tenant. */
  employeeCount: number | null;
  primaryHrAdmin: PlatformHrAdminRef | null;
  createdAt: string | null;
}

export interface PlatformAuditEvent {
  id: string;
  timestamp: string | null;
  /** Email recorded on the audit row; `null` when no actor was recorded. */
  actorEmail: string | null;
  action: string | null;
  /** Tenant the event belongs to; `null` for platform-level events. */
  organizationId: string | null;
  details: string | null;
}

export interface PlatformSession {
  id: string;
  userName: string | null;
  userEmail: string | null;
  /** When the refresh token (sign-in session) was issued. */
  startedAt: string | null;
}

export type ServiceState = "online" | "degraded";

export interface SystemHealthSnapshot {
  database: {
    status: ServiceState | null;
    /** Server-side measured `SELECT 1` latency in milliseconds. */
    pingMs: number | null;
  };
  /** Round-trip time of the authenticated health request, measured in this browser. */
  apiRoundTripMs: number;
  /** ISO-8601 time the check completed. */
  checkedAt: string;
}

/** Public liveness probe `GET /health`. */
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

/** Public readiness probe `GET /health/ready` (HTTP 503 when not ready). */
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

export type PlatformSettingValue = string | number | boolean;

/** Key/value settings exactly as returned by `GET /super-admin/settings`. */
export type PlatformSettings = Record<string, PlatformSettingValue>;

export type UserStatusFilter = "active" | "inactive";

export interface UserListParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: UserStatusFilter;
  organizationId?: string;
}

export type OrganizationOnboardingFilter = "complete" | "pending";

export interface OrganizationListParams {
  page: number;
  pageSize: number;
  search?: string;
  onboarding?: OrganizationOnboardingFilter;
}

export interface AuditLogListParams {
  page: number;
  pageSize: number;
  search?: string;
}

/** Result of walking every page of a list endpoint (bounded by a record cap). */
export interface CollectedRecords<T> {
  items: T[];
  /** `true` when more records exist beyond the collection cap. */
  truncated: boolean;
}

export interface AnalyticsDataset {
  users: CollectedRecords<PlatformUser>;
  organizations: CollectedRecords<PlatformOrganization>;
  /** ISO-8601 time the dataset was collected. */
  collectedAt: string;
}
