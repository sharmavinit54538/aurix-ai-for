/**
 * Super Admin platform API client.
 *
 * All functions call the real OFC360 backend:
 *   - `/api/v1/super-admin/*` — FastAPI router `app/api/super_admin.py`, protected server-side by
 *     `require_super_admin` (role claim + designated account + active status re-checked in the DB).
 *   - `/health`, `/health/ready` — public liveness/readiness probes.
 *
 * There are no local datasets, no browser-storage persistence and no catch-and-substitute paths.
 * Failures are logged and re-thrown as `ApiError` so every screen can render an error state with
 * retry. Responses are normalized defensively: a missing field becomes `null`, never a made-up value.
 *
 * Some backend fields are synthesized rather than measured; they are intentionally NOT consumed here
 * (see docs/SUPER_ADMIN_BACKEND_TODO.md for the full list and the recommended backend fixes).
 */
import axios from "axios";
import apiInstance, { API_BASE_URL } from "@/api/apiInstance";
import { ApiError } from "@/api/client";
import { logger } from "@/lib/logger";
import type {
  AuditLogListParams,
  CollectedRecords,
  LlmProviderHealth,
  OrganizationListParams,
  PlatformAuditEvent,
  PlatformOrganization,
  PlatformSession,
  PlatformSettings,
  PlatformStatistics,
  PlatformUser,
  PublicHealth,
  ReadinessReport,
  ServiceState,
  SystemHealthSnapshot,
  UserListParams,
} from "./types";

export const SUPER_ADMIN_API_BASE = "/api/v1/super-admin";

/** Upper bound enforced by the backend (`page_size: Query(le=200)`). */
export const SUPER_ADMIN_MAX_PAGE_SIZE = 200;

type HttpMethod = "GET" | "POST" | "PATCH";
type QueryParams = Record<string, string | number | undefined>;
type UnknownRecord = Record<string, unknown>;

// ─── Primitive helpers ──────────────────────────────────────────────────────

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

/** Parses latency strings such as "1.2ms"; returns null for "ERR" or unknown formats. */
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

function cleanParams(params?: QueryParams): Record<string, string | number> | undefined {
  if (!params) return undefined;
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "") cleaned[key] = trimmed;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

// ─── Error handling ─────────────────────────────────────────────────────────

const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

/** Converts any thrown value into an `ApiError` (status 0 = the API could not be reached). */
export function toSuperAdminApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data: unknown = error.response?.data ?? null;
    const message =
      extractMessage(data) ??
      (status === 0 ? "Unable to reach the OFC360 API." : `Request failed with status ${status}.`);
    return new ApiError(message, status, data);
  }

  if (error instanceof Error) {
    // Thrown by refreshAccessToken() when the refresh cookie is missing or rejected.
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

/** Unwraps a `{ success, data }` envelope when present; plain JSON bodies pass through unchanged. */
function unwrapEnvelope(body: unknown, httpStatus: number): unknown {
  if (isRecord(body) && typeof body.success === "boolean" && "data" in body) {
    if (body.success === false) {
      throw new ApiError(extractMessage(body) ?? "The API reported a failure.", httpStatus, body);
    }
    return body.data;
  }
  return body;
}

async function request(
  method: HttpMethod,
  path: string,
  options: { params?: QueryParams; data?: unknown } = {},
): Promise<unknown> {
  const url = `${SUPER_ADMIN_API_BASE}${path}`;
  try {
    const response = await apiInstance.request<unknown>({
      method,
      url,
      params: cleanParams(options.params),
      data: options.data,
      // Always go to the network: dashboard data must never come from the client-side GET cache.
      skipCache: true,
    });
    return unwrapEnvelope(response.data, response.status);
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

// ─── Normalizers ────────────────────────────────────────────────────────────

export function normalizeStatistics(body: unknown): PlatformStatistics {
  if (!isRecord(body) || !isRecord(body.kpis)) {
    throw unexpectedShape("GET /super-admin/statistics", body);
  }
  const k = body.kpis;
  // Not consumed on purpose: kpis.dau / kpis.mau (estimated from active/total users, not login
  // telemetry), kpis.expired_organizations (constant), kpis.active_security_incidents (keyword match
  // that includes routine events), the `financials` block (projection without a currency) and the
  // `charts` block (plan chart assigns "Starter" to tenants without a plan).
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

  return {
    id,
    name: toText(raw.name),
    email: toText(raw.email),
    phone: toText(raw.phone),
    role: toText(raw.role),
    organizationId,
    // The backend labels users without a tenant "Global Platform"; only trust the name for real tenants.
    organizationName: organizationId ? toText(raw.company_name ?? raw.companyName ?? raw.organization) : null,
    isActive,
    isVerified: toBool(raw.is_verified),
    createdAt: toIsoTimestamp(raw.created_at),
    // `lastLogin` (camelCase) contains the literal "Never" for missing values, so use `last_login`.
    lastLoginAt: toIsoTimestamp(raw.last_login),
  };
}

export function normalizeOrganization(raw: unknown): PlatformOrganization | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;

  const hrAdmin = isRecord(raw.hr_admin) ? raw.hr_admin : null;
  // Not consumed on purpose: storageUsedGb (never measured, always 0), industry/location (generic
  // defaults when unset), mrr (no currency), payment/access fields (defaults when no subscription).
  return {
    id,
    name: toText(raw.name),
    domain: toText(raw.domain),
    plan: toText(raw.plan),
    status: toText(raw.status),
    userCount: toNumber(raw.user_count),
    employeeCount: toNumber(raw.employee_count ?? raw.employeeCount),
    primaryHrAdmin: hrAdmin ? { name: toText(hrAdmin.name), email: toText(hrAdmin.email) } : null,
    createdAt: toIsoTimestamp(raw.created_at),
  };
}

export function normalizeAuditEvent(raw: unknown): PlatformAuditEvent | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;

  const actor = toText(raw.actor);
  const action = toText(raw.action);
  const details = toText(raw.details);
  // Not consumed on purpose: `actorEmail` (substitutes the Super Admin address when no actor was
  // recorded), `ip`/`ip_address` (substitute 127.0.0.1 when unknown), `resource` (constant) and
  // `result` (keyword heuristic on the action name).
  return {
    id,
    timestamp: toIsoTimestamp(raw.timestamp),
    actorEmail: actor && actor !== "System" ? actor : null,
    action,
    organizationId: toText(raw.targetCompany),
    // The backend repeats the action name when no details were recorded.
    details: details && details !== action ? details : null,
  };
}

export function normalizeSession(raw: unknown): PlatformSession | null {
  if (!isRecord(raw)) return null;
  const id = toText(raw.id);
  if (!id) return null;
  // Not consumed on purpose: ipAddress/device (defaults when unknown) and location/browser/os/
  // lastActivity/status (constant strings in the backend response).
  return {
    id,
    userName: toText(raw.adminName),
    userEmail: toText(raw.adminEmail),
    startedAt: toIsoTimestamp(raw.loginTime),
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

// ─── Public health probes (unauthenticated, outside /api/v1) ────────────────

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

// ─── API surface ────────────────────────────────────────────────────────────

export const superAdminApi = {
  /** GET /super-admin/statistics — platform-wide counts computed in PostgreSQL. */
  async getStatistics(): Promise<PlatformStatistics> {
    return normalizeStatistics(await request("GET", "/statistics"));
  },

  /** GET /super-admin/users — newest first; server-side search/role/status/org filters. */
  async listUsers(params: UserListParams): Promise<PlatformUser[]> {
    const body = await request("GET", "/users", {
      params: {
        page: params.page,
        page_size: params.pageSize,
        search: params.search,
        role: params.role,
        status: params.status,
        organization_id: params.organizationId,
      },
    });
    return compact(toList(body, "GET /super-admin/users").map(normalizeUser));
  },

  /** GET /super-admin/organizations — newest first; server-side search and onboarding filter. */
  async listOrganizations(params: OrganizationListParams): Promise<PlatformOrganization[]> {
    const body = await request("GET", "/organizations", {
      params: {
        page: params.page,
        page_size: params.pageSize,
        search: params.search,
        // Backend: "active" → onboarding completed, "trial" → onboarding not completed.
        status:
          params.onboarding === "complete" ? "active" : params.onboarding === "pending" ? "trial" : undefined,
      },
    });
    return compact(toList(body, "GET /super-admin/organizations").map(normalizeOrganization));
  },

  /** GET /super-admin/audit-logs — newest first; search matches action, email and details. */
  async listAuditEvents(params: AuditLogListParams): Promise<PlatformAuditEvent[]> {
    const body = await request("GET", "/audit-logs", {
      params: { page: params.page, page_size: params.pageSize, search: params.search },
    });
    return compact(toList(body, "GET /super-admin/audit-logs").map(normalizeAuditEvent));
  },

  /** GET /super-admin/security/sessions — up to 50 newest non-revoked, non-expired refresh tokens. */
  async listActiveSessions(): Promise<PlatformSession[]> {
    const body = await request("GET", "/security/sessions");
    return compact(toList(body, "GET /super-admin/security/sessions").map(normalizeSession));
  },

  /**
   * GET /super-admin/system-health — only the PostgreSQL probe is measured by the backend, so only
   * that entry is read. The round-trip time is measured here, in the browser.
   */
  async getSystemHealth(): Promise<SystemHealthSnapshot> {
    const startedAt = performance.now();
    const body = await request("GET", "/system-health");
    const apiRoundTripMs = Math.max(0, Math.round(performance.now() - startedAt));
    if (!isRecord(body)) throw unexpectedShape("GET /super-admin/system-health", body);

    const services = Array.isArray(body.services) ? body.services : [];
    const database = services.find(
      (service): service is UnknownRecord =>
        isRecord(service) && typeof service.name === "string" && /postgres/i.test(service.name),
    );
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

  /** GET /health — public liveness probe (status, database connectivity, version, environment). */
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

  /** GET /health/ready — public readiness probe; HTTP 503 is a valid "not ready" answer. */
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

  /** GET /super-admin/settings */
  async getSettings(): Promise<PlatformSettings> {
    return normalizeSettings(await request("GET", "/settings"));
  },

  /** PATCH /super-admin/settings — sends only the changed keys; returns the saved settings. */
  async updateSettings(changes: PlatformSettings): Promise<PlatformSettings> {
    const body = await request("PATCH", "/settings", { data: changes });
    if (isRecord(body) && isRecord(body.settings)) {
      return normalizeSettings(body.settings, "PATCH /super-admin/settings");
    }
    throw unexpectedShape("PATCH /super-admin/settings", body);
  },

  /** POST /super-admin/users/{id}/activate | /deactivate — returns the backend confirmation message. */
  async setUserActive(userId: string, active: boolean): Promise<string | null> {
    const body = await request(
      "POST",
      `/users/${encodeURIComponent(userId)}/${active ? "activate" : "deactivate"}`,
    );
    return isRecord(body) ? toText(body.message) : null;
  },
};

/**
 * Walks a paginated list endpoint until it is exhausted or `maxRecords` is reached. When the cap
 * is hit, a single-record probe determines whether more data exists, so `truncated` is exact.
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

  // With page_size=1, page N maps to offset N-1: probe the first record after the collected ones.
  const probe = await fetchPage(maxPages * pageSize + 1, 1);
  return { items, truncated: probe.length > 0 };
}

export type SuperAdminApi = typeof superAdminApi;
