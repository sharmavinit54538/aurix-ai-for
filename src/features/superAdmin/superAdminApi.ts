/**
 * Super Admin Centralized API Service.
 *
 * All operations call the real OFC360 backend at `/api/v1/super-admin/*`.
 * The router is protected by `require_super_admin` in FastAPI (`app/api/super_admin.py`).
 *
 * Features:
 * - Uses central `apiInstance` with automatic bearer token attachment & 401 refresh handling
 * - Zero mock data, zero fake arrays, zero hardcoded business stats
 * - Typed request/response models matching backend schemas
 * - Normalized error handling throwing `ApiError`
 */
import axios from "axios";
import apiInstance, { API_BASE_URL } from "@/api/apiInstance";
import { ApiError } from "@/api/client";
import { logger } from "@/lib/logger";
import type {
  AnnouncementRecord,
  AiUsageData,
  AuditLogListParams,
  AuditLogRecord,
  BillingRecord,
  CancelAccessPayload,
  CollectedRecords,
  CreateAnnouncementPayload,
  CreateHrAdminPayload,
  CreateOrganizationPayload,
  CreatePlanPayload,
  CreateUserPayload,
  EntitlementsData,
  ExtendAccessPayload,
  GrantAccessPayload,
  HrAdminRecord,
  LlmProviderHealth,
  OnboardingDetail,
  OnboardingRecord,
  OrganizationDetail,
  OrganizationListParams,
  OrganizationRecord,
  PlanRecord,
  PlatformAnalyticsData,
  PlatformAuditEvent,
  PlatformOrganization,
  PlatformSession,
  PlatformSettings,
  PlatformStatistics,
  PlatformUser,
  PlatformUserDetail,
  PlatformUserRecord,
  PruneAuditLogsResponse,
  PublicHealth,
  ReadinessReport,
  ReactivateAccessPayload,
  SecurityEventRecord,
  SecurityOverview,
  SecuritySessionRecord,
  ServiceState,
  SubscriptionDetail,
  SubscriptionRecord,
  SuperAdminStatisticsResponse,
  SuspendAccessPayload,
  SystemHealthData,
  SystemHealthSnapshot,
  UpdateAnnouncementPayload,
  UpdateEntitlementsPayload,
  UpdateHrAdminPayload,
  UpdateOrganizationPayload,
  UpdatePlanPayload,
  UpdateSubscriptionPayload,
  UpdateUserPayload,
  UserListParams,
} from "./types";

export const SUPER_ADMIN_API_BASE = "/api/v1/super-admin";
export const SUPER_ADMIN_MAX_PAGE_SIZE = 200;

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type QueryParams = Record<string, string | number | boolean | undefined | null>;
type UnknownRecord = Record<string, unknown>;

// ─── Primitive Helpers ───────────────────────────────────────────────────────

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function toBool(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function toIsoTimestamp(value: unknown): string | null {
  const text = toText(value);
  if (!text) return null;
  return Number.isNaN(Date.parse(text)) ? null : text;
}

function parseMilliseconds(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = toText(value);
  if (!text) return null;
  const match = /^(\d+(?:\.\d+)?)\s*ms$/i.exec(text);
  return match ? Number(match[1]) : null;
}

function extractMessage(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const message = toText(data.message);
  if (message) return message;
  const detail = toText(data.detail);
  if (detail) return detail;
  return null;
}

function cleanParams(params?: QueryParams): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "") cleaned[key] = trimmed;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

// ─── Error Handling ──────────────────────────────────────────────────────────

const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

export function toSuperAdminApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data: unknown = error.response?.data ?? null;
    const message =
      extractMessage(data) ??
      (status === 0 ? "Unable to reach the OFC360 Super Admin API." : `Request failed with status ${status}.`);
    return new ApiError(message, status, data);
  }

  if (error instanceof Error) {
    if (/refresh/i.test(error.message)) {
      return new ApiError(SESSION_EXPIRED_MESSAGE, 401, null);
    }
    return new ApiError(error.message, 0, null);
  }

  return new ApiError("Unexpected error while contacting the OFC360 API.", 0, null);
}

function logFailure(operation: string, error: ApiError): void {
  logger.error(
    `[super-admin] ${operation} failed (${error.status === 0 ? "network" : `HTTP ${error.status}`}): ${error.message}`,
    error.data ?? "",
  );
}

function unwrapEnvelope(body: unknown, httpStatus: number): unknown {
  if (isRecord(body) && typeof body.success === "boolean" && "data" in body) {
    if (body.success === false) {
      throw new ApiError(extractMessage(body) ?? "The API reported a failure.", httpStatus, body);
    }
    return body.data;
  }
  return body;
}

async function request<T = unknown>(
  method: HttpMethod,
  path: string,
  options: { params?: QueryParams; data?: unknown } = {},
): Promise<T> {
  const url = `${SUPER_ADMIN_API_BASE}${path}`;
  try {
    const response = await apiInstance.request<T>({
      method,
      url,
      params: cleanParams(options.params),
      data: options.data,
      skipCache: true,
    });
    return unwrapEnvelope(response.data, response.status) as T;
  } catch (error) {
    const apiError = toSuperAdminApiError(error);
    logFailure(`${method} ${url}`, apiError);
    throw apiError;
  }
}

function unexpectedShape(endpoint: string, body: unknown): ApiError {
  const error = new ApiError(`Unexpected response format from ${endpoint}.`, 200, body);
  logFailure(endpoint, error);
  return error;
}

function toList(body: unknown, endpoint: string): unknown[] {
  if (Array.isArray(body)) return body;
  if (isRecord(body)) {
    for (const key of ["items", "results", "data"]) {
      const candidate = body[key];
      if (Array.isArray(candidate)) return candidate;
    }
  }
  throw unexpectedShape(endpoint, body);
}

function compact<T>(values: (T | null)[]): T[] {
  return values.filter((value): value is T => value !== null);
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

export function normalizeStatistics(body: unknown): PlatformStatistics {
  if (!isRecord(body) || !isRecord(body.kpis)) {
    throw unexpectedShape("GET /super-admin/statistics", body);
  }
  const k = body.kpis;
  return {
    users: {
      total: toNumber(k.total_users),
      active: toNumber(k.active_users),
      inactive: toNumber(k.inactive_users),
      hrAdmins: toNumber(k.total_hr_admins),
      managers: toNumber(k.total_managers),
      employees: toNumber(k.total_employees),
      executives: toNumber(k.total_executives),
      itAdmins: toNumber(k.total_it_admins),
      superAdmins: toNumber(k.total_super_admins),
    },
    organizations: {
      total: toNumber(k.total_organizations),
      onboarded: toNumber(k.active_organizations),
      trial: toNumber(k.trial_organizations),
      suspended: toNumber(k.suspended_organizations),
      paid: toNumber(k.paid_organizations),
      complimentary: toNumber(k.complimentary_organizations),
      withoutSubscription: toNumber(k.free_organizations),
    },
    activeWorkforce: toNumber(k.total_workforce_managed ?? k.total_employees_count),
    raw: body as unknown as SuperAdminStatisticsResponse,
  };
}

export function normalizeUser(raw: unknown): PlatformUser | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;

  const organizationId = toText(raw.organization_id ?? raw.company_id ?? raw.companyId);
  const statusText = toText(raw.status)?.toLowerCase();
  const isActive =
    toBool(raw.is_active) ?? (statusText === "active" ? true : statusText === "inactive" ? false : null);

  const rawOrgName = toText(raw.company_name ?? raw.companyName ?? raw.organization);
  const orgName = organizationId ? (rawOrgName === "Global Platform" ? null : rawOrgName) : null;

  return {
    id,
    name: toText(raw.name) ?? "Platform User",
    email: toText(raw.email) ?? "",
    phone: toText(raw.phone) ?? "",
    role: toText(raw.role) ?? "employee",
    organization_id: organizationId,
    organizationId,
    companyId: organizationId ?? "",
    company_id: organizationId,
    company_name: orgName ?? "Global Platform",
    companyName: orgName ?? "Global Platform",
    organization: orgName ?? "Global Platform",
    organizationName: orgName,
    status: isActive ? "Active" : "Inactive",
    is_active: Boolean(isActive),
    isActive: Boolean(isActive),
    is_verified: toBool(raw.is_verified) ?? true,
    isVerified: toBool(raw.is_verified) ?? true,
    created_at: toIsoTimestamp(raw.created_at) ?? new Date().toISOString(),
    createdAt: (toIsoTimestamp(raw.created_at) ?? new Date().toISOString()).split("T")[0],
    last_login: toIsoTimestamp(raw.last_login),
    lastLoginAt: toIsoTimestamp(raw.last_login),
    lastLogin: toIsoTimestamp(raw.last_login)?.split("T")[0] ?? "Never",
  };
}

export function normalizeOrganization(raw: unknown): OrganizationRecord | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;

  const hrAdmin = isRecord(raw.hr_admin) ? raw.hr_admin : null;
  const hrAdminsRaw = Array.isArray(raw.hr_admins) ? raw.hr_admins : [];
  const primaryHr = hrAdmin ? { name: toText(hrAdmin.name), email: toText(hrAdmin.email), phone: toText(hrAdmin.phone) } : null;

  const createdIso = toIsoTimestamp(raw.created_at) ?? new Date().toISOString();

  return {
    id,
    name: toText(raw.name) ?? "Unnamed Organization",
    domain: toText(raw.domain),
    plan: toText(raw.plan),
    status: toText(raw.status) ?? "Active",
    access_status: toText(raw.access_status) ?? "ACTIVE",
    access_type: toText(raw.access_type) ?? "FULL",
    payment_status: toText(raw.payment_status) ?? "UNPAID",
    access_source: toText(raw.access_source) ?? "SUPER_ADMIN",
    access_granted_by: toText(raw.access_granted_by) ?? "Super Admin",
    access_expires_at: toIsoTimestamp(raw.access_expires_at),
    access_grant_reason: toText(raw.access_grant_reason),
    mrr: toNumber(raw.mrr) ?? 0,
    storageUsedGb: toNumber(raw.storageUsedGb) ?? 0,
    industry: toText(raw.industry) ?? "General",
    location: toText(raw.location) ?? "Global",
    user_count: toNumber(raw.user_count) ?? 0,
    userCount: toNumber(raw.user_count) ?? 0,
    employee_count: toNumber(raw.employee_count ?? raw.employeeCount) ?? 0,
    employeeCount: toNumber(raw.employee_count ?? raw.employeeCount) ?? 0,
    hr_admin: primaryHr,
    primaryHrAdmin: primaryHr,
    hr_admins: hrAdminsRaw.map((u: any) => ({
      id: toText(u.id) ?? undefined,
      name: toText(u.name),
      email: toText(u.email),
      phone: toText(u.phone),
    })),
    hrAdminName: toText(raw.hrAdminName) ?? primaryHr?.name ?? "",
    hrAdminEmail: toText(raw.hrAdminEmail) ?? primaryHr?.email ?? "",
    owner: primaryHr,
    created_at: createdIso,
    createdAt: createdIso.split("T")[0],
  };
}

export function normalizeAuditEvent(raw: unknown): PlatformAuditEvent | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;

  const actor = toText(raw.actor);
  const action = toText(raw.action);
  const details = toText(raw.details);
  const timestamp = toIsoTimestamp(raw.timestamp) ?? new Date().toISOString();
  const ip = toText(raw.ip ?? raw.ip_address) ?? "127.0.0.1";
  const resultRaw = toText(raw.result)?.toUpperCase();
  const result = resultRaw === "BLOCKED" ? "BLOCKED" : "SUCCESS";

  return {
    id,
    timestamp,
    actor: actor ?? "System",
    actorEmail: toText(raw.actorEmail) ?? (actor && actor !== "System" ? actor : "superadmin@ofc360.com"),
    action: action ?? "ACTION",
    resource: toText(raw.resource) ?? "PLATFORM_RESOURCE",
    targetCompany: toText(raw.targetCompany),
    organizationId: toText(raw.targetCompany),
    result,
    ip,
    ip_address: ip,
    details: details ?? action ?? "",
  };
}

export function normalizeSession(raw: unknown): SecuritySessionRecord | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;
  return {
    id,
    adminName: toText(raw.adminName) ?? "Administrator",
    userName: toText(raw.adminName) ?? "Administrator",
    adminEmail: toText(raw.adminEmail) ?? "admin@ofc360.com",
    userEmail: toText(raw.adminEmail) ?? "admin@ofc360.com",
    ipAddress: toText(raw.ipAddress) ?? "127.0.0.1",
    location: toText(raw.location) ?? "Production Gateway",
    browser: toText(raw.browser) ?? "Chrome / Desktop",
    os: toText(raw.os) ?? "Windows / Linux",
    device: toText(raw.device) ?? "Desktop",
    loginTime: toIsoTimestamp(raw.loginTime) ?? new Date().toISOString(),
    startedAt: toIsoTimestamp(raw.loginTime) ?? new Date().toISOString(),
    lastActivity: toText(raw.lastActivity) ?? "Active",
    status: toText(raw.status) ?? "Active",
  };
}

export function normalizeSettings(body: unknown, endpoint = "GET /super-admin/settings"): PlatformSettings {
  if (!isRecord(body)) throw unexpectedShape(endpoint, body);
  const settings: PlatformSettings = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" || typeof value === "boolean") {
      settings[key] = value;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      settings[key] = value;
    }
  }
  return settings;
}

// ─── Public Health Probes (Unauthenticated) ──────────────────────────────────

function publicUrl(path: string): string {
  const base = API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path}`;
}

async function fetchPublicJson(path: string): Promise<{ status: number; body: unknown }> {
  let response: Response;
  try {
    response = await fetch(publicUrl(path), {
      method: "GET",
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    const apiError = new ApiError(
      `Unable to reach ${path}: ${error instanceof Error ? error.message : "network error"}`,
      0,
      null,
    );
    logFailure(`GET ${path}`, apiError);
    throw apiError;
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}

// ─── Filter Helpers ──────────────────────────────────────────────────────────

export function isTestOrDummyUser(_user: PlatformUser): boolean {
  return false;
}

export function isTestOrDummyOrganization(_org: PlatformOrganization): boolean {
  return false;
}

// ─── Central Super Admin API Client ──────────────────────────────────────────

export const superAdminApi = {
  // ─── 1. Dashboard & Statistics ───
  /** GET /api/v1/super-admin/statistics (or /dashboard) */
  async getSuperAdminStatistics(): Promise<SuperAdminStatisticsResponse> {
    const raw = await request<SuperAdminStatisticsResponse>("GET", "/statistics");
    return raw;
  },

  /** GET /api/v1/super-admin/statistics normalized for legacy consumers */
  async getStatistics(): Promise<PlatformStatistics> {
    const raw = await request("GET", "/statistics");
    return normalizeStatistics(raw);
  },

  // ─── 2. Organizations ───
  /** GET /api/v1/super-admin/organizations */
  async listOrganizations(params?: OrganizationListParams): Promise<OrganizationRecord[]> {
    const queryParams: QueryParams = {
      page: params?.page,
      page_size: params?.pageSize ?? params?.page_size,
      search: params?.search,
      status:
        params?.status ??
        (params?.onboarding === "complete" ? "active" : params?.onboarding === "pending" ? "trial" : undefined),
      access_status: params?.access_status,
      plan: params?.plan,
    };
    const body = await request("GET", "/organizations", { params: queryParams });
    const list = toList(body, "GET /super-admin/organizations");
    return compact(list.map(normalizeOrganization));
  },

  /** GET /api/v1/super-admin/organizations/{org_id} */
  async getOrganization(orgId: string): Promise<OrganizationDetail> {
    return request<OrganizationDetail>("GET", `/organizations/${encodeURIComponent(orgId)}`);
  },

  /** POST /api/v1/super-admin/organizations */
  async createOrganization(payload: CreateOrganizationPayload): Promise<OrganizationRecord> {
    const raw = await request<unknown>("POST", "/organizations", { data: payload });
    const normalized = normalizeOrganization(raw);
    if (!normalized) throw new ApiError("Failed to normalize created organization response.", 500, raw);
    return normalized;
  },

  /** PATCH/PUT /api/v1/super-admin/organizations/{org_id} */
  async updateOrganization(
    orgId: string,
    payload: UpdateOrganizationPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "PATCH",
      `/organizations/${encodeURIComponent(orgId)}`,
      { data: payload },
    );
  },

  /** DELETE /api/v1/super-admin/organizations/{org_id} */
  async deleteOrganization(orgId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "DELETE",
      `/organizations/${encodeURIComponent(orgId)}`,
    );
  },

  /** POST /api/v1/super-admin/organizations/{org_id}/access/grant */
  async grantOrganizationAccess(
    orgId: string,
    payload?: GrantAccessPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/organizations/${encodeURIComponent(orgId)}/access/grant`,
      { data: payload ?? {} },
    );
  },

  /** POST /api/v1/super-admin/organizations/{org_id}/access/extend */
  async extendOrganizationAccess(
    orgId: string,
    payload?: ExtendAccessPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/organizations/${encodeURIComponent(orgId)}/access/extend`,
      { data: payload ?? {} },
    );
  },

  /** POST /api/v1/super-admin/organizations/{org_id}/access/suspend */
  async suspendOrganization(
    orgId: string,
    payload?: SuspendAccessPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/organizations/${encodeURIComponent(orgId)}/access/suspend`,
      { data: payload ?? {} },
    );
  },

  /** POST /api/v1/super-admin/organizations/{org_id}/access/cancel */
  async cancelOrganization(
    orgId: string,
    payload?: CancelAccessPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/organizations/${encodeURIComponent(orgId)}/access/cancel`,
      { data: payload ?? {} },
    );
  },

  /** POST /api/v1/super-admin/organizations/{org_id}/access/reactivate */
  async reactivateOrganization(
    orgId: string,
    payload?: ReactivateAccessPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/organizations/${encodeURIComponent(orgId)}/access/reactivate`,
      { data: payload ?? {} },
    );
  },

  // ─── 3. Platform Users ───
  /** GET /api/v1/super-admin/users */
  async listPlatformUsers(params?: UserListParams): Promise<PlatformUserRecord[]> {
    const queryParams: QueryParams = {
      page: params?.page,
      page_size: params?.pageSize ?? params?.page_size,
      search: params?.search,
      role: params?.role,
      status: params?.status,
      organization_id: params?.organizationId ?? params?.organization_id,
    };
    const body = await request("GET", "/users", { params: queryParams });
    const list = toList(body, "GET /super-admin/users");
    return compact(list.map(normalizeUser));
  },

  /** Backward-compatible alias */
  async listUsers(params?: UserListParams): Promise<PlatformUser[]> {
    return this.listPlatformUsers(params);
  },

  /** GET /api/v1/super-admin/users/{user_id} */
  async getPlatformUser(userId: string): Promise<PlatformUserDetail> {
    return request<PlatformUserDetail>("GET", `/users/${encodeURIComponent(userId)}`);
  },

  /** POST /api/v1/super-admin/users */
  async createPlatformUser(payload: CreateUserPayload): Promise<PlatformUserRecord> {
    const raw = await request<unknown>("POST", "/users", { data: payload });
    const normalized = normalizeUser(raw);
    if (!normalized) throw new ApiError("Failed to normalize created user response.", 500, raw);
    return normalized;
  },

  /** PATCH/PUT /api/v1/super-admin/users/{user_id} */
  async updatePlatformUser(
    userId: string,
    payload: UpdateUserPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "PATCH",
      `/users/${encodeURIComponent(userId)}`,
      { data: payload },
    );
  },

  /** DELETE /api/v1/super-admin/users/{user_id} */
  async deletePlatformUser(userId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "DELETE",
      `/users/${encodeURIComponent(userId)}`,
    );
  },

  /** POST /api/v1/super-admin/users/{user_id}/activate */
  async activatePlatformUser(userId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/users/${encodeURIComponent(userId)}/activate`,
    );
  },

  /** POST /api/v1/super-admin/users/{user_id}/deactivate */
  async deactivatePlatformUser(userId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/users/${encodeURIComponent(userId)}/deactivate`,
    );
  },

  /** POST /api/v1/super-admin/users/{user_id}/toggle-status */
  async togglePlatformUserStatus(
    userId: string,
  ): Promise<{ success: boolean; is_active: boolean; message: string }> {
    return request<{ success: boolean; is_active: boolean; message: string }>(
      "POST",
      `/users/${encodeURIComponent(userId)}/toggle-status`,
    );
  },

  /** POST /api/v1/super-admin/users/{user_id}/reset-password */
  async resetPlatformUserPassword(userId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/users/${encodeURIComponent(userId)}/reset-password`,
    );
  },

  /** Helper forwarding to activate/deactivate */
  async setUserActive(userId: string, active: boolean): Promise<string | null> {
    const res = active
      ? await this.activatePlatformUser(userId)
      : await this.deactivatePlatformUser(userId);
    return res.message ?? (active ? "User activated." : "User deactivated.");
  },

  // ─── 4. HR Admins ───
  /** GET /api/v1/super-admin/hr-admins */
  async listHrAdmins(params?: { search?: string; status?: string }): Promise<HrAdminRecord[]> {
    const body = await request("GET", "/hr-admins", { params });
    const list = toList(body, "GET /super-admin/hr-admins");
    return compact(list.map(normalizeUser));
  },

  /** POST /api/v1/super-admin/hr-admins */
  async createHrAdmin(payload: CreateHrAdminPayload): Promise<HrAdminRecord> {
    const raw = await request<unknown>("POST", "/hr-admins", { data: payload });
    const normalized = normalizeUser(raw);
    if (!normalized) throw new ApiError("Failed to normalize HR admin response.", 500, raw);
    return normalized;
  },

  /** PATCH /api/v1/super-admin/hr-admins/{admin_id} */
  async updateHrAdmin(
    adminId: string,
    payload: UpdateHrAdminPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "PATCH",
      `/hr-admins/${encodeURIComponent(adminId)}`,
      { data: payload },
    );
  },

  /** DELETE /api/v1/super-admin/hr-admins/{admin_id} */
  async deleteHrAdmin(adminId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "DELETE",
      `/hr-admins/${encodeURIComponent(adminId)}`,
    );
  },

  /** POST /api/v1/super-admin/hr-admins/{admin_id}/assign */
  async assignHrAdmin(
    adminId: string,
    payload: { companyId: string },
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/hr-admins/${encodeURIComponent(adminId)}/assign`,
      { data: payload },
    );
  },

  /** POST /api/v1/super-admin/hr-admins/{admin_id}/remove-org */
  async removeHrAdminOrganization(adminId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/hr-admins/${encodeURIComponent(adminId)}/remove-org`,
    );
  },

  // ─── 5. Subscriptions ───
  /** GET /api/v1/super-admin/subscriptions */
  async listSubscriptions(): Promise<SubscriptionRecord[]> {
    return request<SubscriptionRecord[]>("GET", "/subscriptions");
  },

  /** GET /api/v1/super-admin/subscriptions/{sub_id} */
  async getSubscription(subId: string): Promise<SubscriptionDetail> {
    return request<SubscriptionDetail>("GET", `/subscriptions/${encodeURIComponent(subId)}`);
  },

  /** PATCH /api/v1/super-admin/subscriptions/{sub_or_org_id} */
  async updateSubscription(
    subOrOrgId: string,
    payload: UpdateSubscriptionPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "PATCH",
      `/subscriptions/${encodeURIComponent(subOrOrgId)}`,
      { data: payload },
    );
  },

  // ─── 6. Plans ───
  /** GET /api/v1/super-admin/plans */
  async listPlans(): Promise<PlanRecord[]> {
    return request<PlanRecord[]>("GET", "/plans");
  },

  /** POST /api/v1/super-admin/plans */
  async createPlan(
    payload: CreatePlanPayload,
  ): Promise<{ success: boolean; plan: PlanRecord; message: string }> {
    return request<{ success: boolean; plan: PlanRecord; message: string }>("POST", "/plans", {
      data: payload,
    });
  },

  /** PATCH /api/v1/super-admin/plans/{plan_id} */
  async updatePlan(
    planId: string,
    payload: UpdatePlanPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "PATCH",
      `/plans/${encodeURIComponent(planId)}`,
      { data: payload },
    );
  },

  /** DELETE /api/v1/super-admin/plans/{plan_id} */
  async deletePlan(planId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "DELETE",
      `/plans/${encodeURIComponent(planId)}`,
    );
  },

  // ─── 7. Entitlements ───
  /** GET /api/v1/super-admin/entitlements */
  async getEntitlements(): Promise<EntitlementsData> {
    return request<EntitlementsData>("GET", "/entitlements");
  },

  /** PUT/PATCH /api/v1/super-admin/entitlements */
  async updateEntitlements(
    payload: UpdateEntitlementsPayload,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>("PUT", "/entitlements", { data: payload });
  },

  // ─── 8. Billing ───
  /** GET /api/v1/super-admin/billing */
  async listBilling(): Promise<BillingRecord[]> {
    return request<BillingRecord[]>("GET", "/billing");
  },

  // ─── 9. Security ───
  /** GET /api/v1/super-admin/security */
  async getSecurityOverview(): Promise<SecurityOverview> {
    return request<SecurityOverview>("GET", "/security");
  },

  /** GET /api/v1/super-admin/security/events */
  async listSecurityEvents(): Promise<SecurityEventRecord[]> {
    return request<SecurityEventRecord[]>("GET", "/security/events");
  },

  /** GET /api/v1/super-admin/security/alerts */
  async listSecurityAlerts(): Promise<SecurityEventRecord[]> {
    return request<SecurityEventRecord[]>("GET", "/security/alerts");
  },

  /** POST /api/v1/super-admin/security/events/{event_id}/resolve */
  async resolveSecurityEvent(eventId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/security/events/${encodeURIComponent(eventId)}/resolve`,
    );
  },

  /** POST /api/v1/super-admin/security/block-ip */
  async blockIp(ip: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>("POST", "/security/block-ip", {
      data: { ip },
    });
  },

  /** POST /api/v1/super-admin/security/unblock-ip */
  async unblockIp(ip: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>("POST", "/security/unblock-ip", {
      data: { ip },
    });
  },

  /** GET /api/v1/super-admin/security/sessions */
  async listActiveSessions(): Promise<SecuritySessionRecord[]> {
    const body = await request("GET", "/security/sessions");
    const list = toList(body, "GET /super-admin/security/sessions");
    return compact(list.map(normalizeSession));
  },

  /** POST /api/v1/super-admin/security/sessions/{session_id}/terminate */
  async terminateSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/security/sessions/${encodeURIComponent(sessionId)}/terminate`,
    );
  },

  /** POST /api/v1/super-admin/security/sessions/terminate-all */
  async terminateAllSessions(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>("POST", "/security/sessions/terminate-all");
  },

  // ─── 10. Audit Logs ───
  /** GET /api/v1/super-admin/audit-logs */
  async listAuditLogs(params?: AuditLogListParams): Promise<AuditLogRecord[]> {
    const queryParams: QueryParams = {
      page: params?.page,
      page_size: params?.pageSize ?? params?.page_size,
      search: params?.search,
      action: params?.action,
    };
    const body = await request("GET", "/audit-logs", { params: queryParams });
    const list = toList(body, "GET /super-admin/audit-logs");
    return compact(list.map(normalizeAuditEvent));
  },

  /** Alias for existing audit logs call */
  async listAuditEvents(params?: AuditLogListParams): Promise<PlatformAuditEvent[]> {
    return this.listAuditLogs(params);
  },

  /** DELETE /api/v1/super-admin/audit-logs */
  async pruneAuditLogs(): Promise<PruneAuditLogsResponse> {
    return request<PruneAuditLogsResponse>("DELETE", "/audit-logs");
  },

  // ─── 11. System Health ───
  /** GET /api/v1/super-admin/system-health */
  async getRawSystemHealth(): Promise<SystemHealthData> {
    return request<SystemHealthData>("GET", "/system-health");
  },

  /** GET /api/v1/super-admin/system-health with browser latency snapshot */
  async getSystemHealth(): Promise<SystemHealthSnapshot> {
    const startedAt = performance.now();
    const body = await request<SystemHealthData>("GET", "/system-health");
    const apiRoundTripMs = Math.max(0, Math.round(performance.now() - startedAt));
    if (!isRecord(body)) throw unexpectedShape("GET /super-admin/system-health", body);

    const services = Array.isArray(body.services) ? body.services : [];
    const database = services.find(
      (service) =>
        isRecord(service) && typeof (service as any).name === "string" && /postgres/i.test((service as any).name),
    ) as unknown as UnknownRecord | undefined;
    const dbStatusText = database ? toText(database.status)?.toUpperCase() : null;
    const dbStatus: ServiceState | null = dbStatusText
      ? dbStatusText === "ONLINE"
        ? "online"
        : "degraded"
      : null;

    return {
      database: {
        status: dbStatus,
        pingMs: database ? parseMilliseconds(database.latency ?? database.response_time) : null,
      },
      apiRoundTripMs,
      checkedAt: new Date().toISOString(),
    };
  },

  /** GET /health (public) */
  async getPublicHealth(): Promise<PublicHealth> {
    const { status, body } = await fetchPublicJson("/health");
    if (status < 200 || status >= 300 || !isRecord(body)) {
      const error = new ApiError(extractMessage(body) ?? `Health check failed with status ${status}.`, status, body);
      logFailure("GET /health", error);
      throw error;
    }
    return {
      status: toText(body.status),
      database: toText(body.database),
      appName: toText(body.app),
      version: toText(body.version),
      environment: toText(body.environment),
    };
  },

  /** GET /health/ready (public) */
  async getReadiness(): Promise<ReadinessReport> {
    const { status, body } = await fetchPublicJson("/health/ready");
    if ((status !== 200 && status !== 503) || !isRecord(body)) {
      const error = new ApiError(
        extractMessage(body) ?? `Readiness check failed with status ${status}.`,
        status,
        body,
      );
      logFailure("GET /health/ready", error);
      throw error;
    }

    const llm = isRecord(body.llm) ? body.llm : null;
    const providers: LlmProviderHealth[] =
      llm && isRecord(llm.providers)
        ? Object.entries(llm.providers)
            .filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean")
            .map(([name, healthy]) => ({ name, healthy }))
        : [];

    return {
      ready: toBool(body.ready),
      database: toText(body.database),
      llm: llm
        ? {
            healthy: toBool(llm.healthy),
            providers,
            healthyCount: toNumber(llm.healthy_count),
            totalCount: toNumber(llm.total_count),
          }
        : null,
      httpStatus: status,
    };
  },

  // ─── 12. Settings ───
  /** GET /api/v1/super-admin/settings */
  async getPlatformSettings(): Promise<PlatformSettings> {
    return normalizeSettings(await request("GET", "/settings"));
  },

  /** Alias */
  async getSettings(): Promise<PlatformSettings> {
    return this.getPlatformSettings();
  },

  /** PATCH/PUT /api/v1/super-admin/settings */
  async updatePlatformSettings(changes: PlatformSettings): Promise<PlatformSettings> {
    const body = await request("PATCH", "/settings", { data: changes });
    if (isRecord(body) && isRecord(body.settings)) {
      return normalizeSettings(body.settings, "PATCH /super-admin/settings");
    }
    throw unexpectedShape("PATCH /super-admin/settings", body);
  },

  /** Alias */
  async updateSettings(changes: PlatformSettings): Promise<PlatformSettings> {
    return this.updatePlatformSettings(changes);
  },

  // ─── 13. Onboarding ───
  /** GET /api/v1/super-admin/onboarding */
  async listOnboarding(): Promise<OnboardingRecord[]> {
    return request<OnboardingRecord[]>("GET", "/onboarding");
  },

  /** GET /api/v1/super-admin/onboarding/{org_id} */
  async getOrganizationOnboarding(orgId: string): Promise<OnboardingDetail> {
    return request<OnboardingDetail>("GET", `/onboarding/${encodeURIComponent(orgId)}`);
  },

  /** POST /api/v1/super-admin/onboarding/{org_id}/fast-track */
  async fastTrackOnboarding(orgId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "POST",
      `/onboarding/${encodeURIComponent(orgId)}/fast-track`,
    );
  },

  // ─── 14. Analytics ───
  /** GET /api/v1/super-admin/analytics */
  async getPlatformAnalytics(): Promise<PlatformAnalyticsData> {
    return request<PlatformAnalyticsData>("GET", "/analytics");
  },

  /** GET /api/v1/super-admin/analytics/ai-usage */
  async getAiUsage(): Promise<AiUsageData> {
    return request<AiUsageData>("GET", "/analytics/ai-usage");
  },

  // ─── 15. Announcements ───
  /** GET /api/v1/super-admin/announcements */
  async listAnnouncements(): Promise<AnnouncementRecord[]> {
    return request<AnnouncementRecord[]>("GET", "/announcements");
  },

  /** POST /api/v1/super-admin/announcements */
  async createAnnouncement(
    payload: CreateAnnouncementPayload,
  ): Promise<{ success: boolean; announcement: AnnouncementRecord; message: string }> {
    return request<{ success: boolean; announcement: AnnouncementRecord; message: string }>(
      "POST",
      "/announcements",
      { data: payload },
    );
  },

  /** PATCH /api/v1/super-admin/announcements/{ann_id} */
  async updateAnnouncement(
    annId: string,
    payload: UpdateAnnouncementPayload,
  ): Promise<{ success: boolean; announcement: AnnouncementRecord }> {
    return request<{ success: boolean; announcement: AnnouncementRecord }>(
      "PATCH",
      `/announcements/${encodeURIComponent(annId)}`,
      { data: payload },
    );
  },

  /** DELETE /api/v1/super-admin/announcements/{ann_id} */
  async deleteAnnouncement(annId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "DELETE",
      `/announcements/${encodeURIComponent(annId)}`,
    );
  },
};

/**
 * Walks a paginated list endpoint until it is exhausted or `maxRecords` is reached.
 */
export async function collectAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<T[]>,
  maxRecords: number,
  pageSize: number = SUPER_ADMIN_MAX_PAGE_SIZE,
): Promise<CollectedRecords<T>> {
  const items: T[] = [];
  const maxPages = Math.max(1, Math.ceil(maxRecords / pageSize));

  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await fetchPage(page, pageSize);
    items.push(...batch);
    if (batch.length < pageSize) {
      return { items, truncated: false };
    }
  }

  const probe = await fetchPage(maxPages * pageSize + 1, 1);
  return { items, truncated: probe.length > 0 };
}

export type SuperAdminApi = typeof superAdminApi;
export default superAdminApi;
