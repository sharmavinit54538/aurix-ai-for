import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { ApiError } from "@/api/client";
import { collectAllPages, superAdminApi } from "../superAdminApi";

const BASE = "*/api/v1/super-admin";

afterEach(() => {
  vi.restoreAllMocks();
});

/** Backend-shaped payload of GET /super-admin/statistics (see app/api/super_admin.py). */
const statisticsBody = {
  kpis: {
    total_organizations: 3,
    active_organizations: 2,
    total_users: 42,
    total_hr_admins: 4,
    total_employees: 30,
    total_managers: 5,
    total_executives: 2,
    total_it_admins: 1,
    total_super_admins: 1,
    active_users: 40,
    inactive_users: 2,
    paid_organizations: 1,
    complimentary_organizations: 1,
    free_organizations: 1,
    trial_organizations: 1,
    suspended_organizations: 0,
    expired_organizations: 0,
    total_workforce_managed: 57,
    active_security_incidents: 9,
    dau: 28,
    mau: 42,
  },
  financials: { total_revenue: 999, mrr: 100, arr: 1200, revenue_growth: 0 },
  charts: { revenue_trend: [], subscription_distribution: [{ plan: "Starter", count: 3 }] },
};

describe("superAdminApi — endpoints and normalization", () => {
  it("reads platform statistics from /api/v1/super-admin/statistics and maps only measured KPIs", async () => {
    let requestedPath = "";
    server.use(
      http.get(`${BASE}/statistics`, ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(statisticsBody);
      }),
    );

    const stats = await superAdminApi.getStatistics();

    expect(requestedPath).toBe("/api/v1/super-admin/statistics");
    expect(stats.users).toEqual({
      total: 42,
      active: 40,
      inactive: 2,
      hrAdmins: 4,
      managers: 5,
      employees: 30,
      executives: 2,
      itAdmins: 1,
      superAdmins: 1,
    });
    expect(stats.organizations).toEqual({
      total: 3,
      onboarded: 2,
      trial: 1,
      suspended: 0,
      paid: 1,
      complimentary: 1,
      withoutSubscription: 1,
    });
    expect(stats.activeWorkforce).toBe(57);
    // Synthesized backend values must never surface.
    const serialized = JSON.stringify(stats);
    expect(serialized).not.toContain("dau");
    expect(serialized).not.toContain("mau");
    expect(serialized).not.toContain("revenue");
  });

  it("returns null (not zero) for KPIs the API omits", async () => {
    server.use(http.get(`${BASE}/statistics`, () => HttpResponse.json({ kpis: { total_users: 5 } })));

    const stats = await superAdminApi.getStatistics();

    expect(stats.users.total).toBe(5);
    expect(stats.users.active).toBeNull();
    expect(stats.organizations.total).toBeNull();
    expect(stats.activeWorkforce).toBeNull();
  });

  it("unwraps a { success, data } envelope when the API uses one", async () => {
    server.use(
      http.get(`${BASE}/statistics`, () => HttpResponse.json({ success: true, data: { kpis: { total_users: 7 } } })),
    );
    const stats = await superAdminApi.getStatistics();
    expect(stats.users.total).toBe(7);
  });

  it("sends user filters as query parameters and normalizes user records", async () => {
    let query: URLSearchParams | null = null;
    server.use(
      http.get(`${BASE}/users`, ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([
          {
            id: "u-1",
            name: "Account One",
            email: "one@example.test",
            phone: "",
            role: "hr_admin",
            company_id: "c-1",
            company_name: "Tenant One",
            is_active: true,
            is_verified: true,
            created_at: "2026-09-01T10:00:00+00:00",
            last_login: "2026-09-20T08:30:00+00:00",
            lastLogin: "2026-09-20",
          },
          {
            id: "u-2",
            name: "Account Two",
            email: "two@example.test",
            role: "super_admin",
            company_id: null,
            company_name: "Global Platform",
            is_active: false,
            created_at: "2026-08-01T10:00:00+00:00",
            last_login: null,
            lastLogin: "Never",
          },
        ]);
      }),
    );

    const users = await superAdminApi.listUsers({ page: 2, pageSize: 25, search: " ann ", role: "hr_admin", status: "active" });

    expect(query).not.toBeNull();
    const params = query as unknown as URLSearchParams;
    expect(params.get("page")).toBe("2");
    expect(params.get("page_size")).toBe("25");
    expect(params.get("search")).toBe("ann");
    expect(params.get("role")).toBe("hr_admin");
    expect(params.get("status")).toBe("active");

    expect(users).toHaveLength(2);
    expect(users[0]).toMatchObject({
      id: "u-1",
      organizationId: "c-1",
      organizationName: "Tenant One",
      isActive: true,
      phone: null,
      lastLoginAt: "2026-09-20T08:30:00+00:00",
    });
    // "Global Platform" label and "Never" string are backend placeholders, not data.
    expect(users[1].organizationName).toBeNull();
    expect(users[1].lastLoginAt).toBeNull();
    expect(users[1].isActive).toBe(false);
  });

  it("omits empty filters from the query string", async () => {
    let search = "";
    server.use(
      http.get(`${BASE}/users`, ({ request }) => {
        search = new URL(request.url).search;
        return HttpResponse.json([]);
      }),
    );
    await superAdminApi.listUsers({ page: 1, pageSize: 5, search: "   " });
    expect(search).toBe("?page=1&page_size=5");
  });

  it("maps the onboarding filter to the backend status parameter and ignores unmeasured organization fields", async () => {
    let status: string | null = "";
    server.use(
      http.get(`${BASE}/organizations`, ({ request }) => {
        status = new URL(request.url).searchParams.get("status");
        return HttpResponse.json([
          {
            id: "c-1",
            name: "Tenant One",
            domain: null,
            plan: null,
            status: "Trial",
            user_count: 3,
            employee_count: 2,
            storageUsedGb: 0,
            industry: "General",
            location: "Global",
            hr_admin: { id: "u-1", name: "Account One", email: "one@example.test" },
            created_at: "2026-09-01T10:00:00+00:00",
          },
        ]);
      }),
    );

    const orgs = await superAdminApi.listOrganizations({ page: 1, pageSize: 24, onboarding: "pending" });

    expect(status).toBe("trial");
    expect(orgs[0]).toEqual({
      id: "c-1",
      name: "Tenant One",
      domain: null,
      plan: null,
      status: "Trial",
      userCount: 3,
      employeeCount: 2,
      primaryHrAdmin: { name: "Account One", email: "one@example.test" },
      createdAt: "2026-09-01T10:00:00+00:00",
    });
  });

  it("does not surface substituted audit fields (actor placeholder, loopback IP, constant resource)", async () => {
    server.use(
      http.get(`${BASE}/audit-logs`, () =>
        HttpResponse.json([
          {
            id: "a-1",
            timestamp: "2026-09-24T12:00:00+00:00",
            actor: "System",
            actorEmail: "superadmin@ofc360.com",
            action: "SUPER_ADMIN_UPDATE_SETTINGS",
            resource: "PLATFORM_RESOURCE",
            targetCompany: null,
            result: "SUCCESS",
            ip: "127.0.0.1",
            details: "Updated platform configuration: ['maintenanceMode'].",
          },
          {
            id: "a-2",
            timestamp: "2026-09-24T11:00:00+00:00",
            actor: "admin@example.test",
            action: "UPDATED",
            targetCompany: "c-9",
            details: "UPDATED",
          },
        ]),
      ),
    );

    const events = await superAdminApi.listAuditEvents({ page: 1, pageSize: 50 });

    expect(events[0]).toEqual({
      id: "a-1",
      timestamp: "2026-09-24T12:00:00+00:00",
      actorEmail: null,
      action: "SUPER_ADMIN_UPDATE_SETTINGS",
      organizationId: null,
      details: "Updated platform configuration: ['maintenanceMode'].",
    });
    expect(events[1]).toMatchObject({ actorEmail: "admin@example.test", organizationId: "c-9", details: null });
    expect(JSON.stringify(events)).not.toContain("127.0.0.1");
  });

  it("keeps only the measured session fields", async () => {
    server.use(
      http.get(`${BASE}/security/sessions`, () =>
        HttpResponse.json([
          {
            id: "s-1",
            adminName: "Account One",
            adminEmail: "one@example.test",
            ipAddress: "127.0.0.1",
            location: "Production Gateway",
            browser: "Chrome / Desktop",
            os: "Windows / Linux",
            loginTime: "2026-09-24T09:00:00+00:00",
            status: "Active",
          },
        ]),
      ),
    );

    const sessions = await superAdminApi.listActiveSessions();
    expect(sessions).toEqual([
      { id: "s-1", userName: "Account One", userEmail: "one@example.test", startedAt: "2026-09-24T09:00:00+00:00" },
    ]);
  });

  it("reads only the PostgreSQL probe from system health and measures the round trip", async () => {
    server.use(
      http.get(`${BASE}/system-health`, () =>
        HttpResponse.json({
          status: "ONLINE",
          services: [
            { name: "FastAPI Application Server", status: "ONLINE", latency: "14ms" },
            { name: "PostgreSQL Primary Database", status: "ONLINE", latency: "1.8ms" },
            { name: "Storage & Document Engine", status: "ONLINE", latency: "32ms" },
          ],
        }),
      ),
    );

    const health = await superAdminApi.getSystemHealth();
    expect(health.database).toEqual({ status: "online", pingMs: 1.8 });
    expect(health.apiRoundTripMs).toBeGreaterThanOrEqual(0);
    expect(Number.isNaN(Date.parse(health.checkedAt))).toBe(false);
  });

  it("parses the public health probe", async () => {
    server.use(
      http.get("*/health", () =>
        HttpResponse.json({ status: "healthy", database: "connected", app: "OFC HR", version: "1.0.0", environment: "production" }),
      ),
    );
    await expect(superAdminApi.getPublicHealth()).resolves.toEqual({
      status: "healthy",
      database: "connected",
      appName: "OFC HR",
      version: "1.0.0",
      environment: "production",
    });
  });

  it("treats HTTP 503 from the readiness probe as a valid not-ready report", async () => {
    server.use(
      http.get("*/health/ready", () =>
        HttpResponse.json(
          { ready: false, database: "connected", llm: { healthy: false, providers: { ollama: false }, healthy_count: 0, total_count: 1 } },
          { status: 503 },
        ),
      ),
    );

    await expect(superAdminApi.getReadiness()).resolves.toEqual({
      ready: false,
      database: "connected",
      llm: { healthy: false, providers: [{ name: "ollama", healthy: false }], healthyCount: 0, totalCount: 1 },
      httpStatus: 503,
    });
  });

  it("PATCHes only the provided settings and returns the saved values", async () => {
    let body: unknown = null;
    server.use(
      http.patch(`${BASE}/settings`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ success: true, settings: { maintenanceMode: true, sessionTimeoutMinutes: 30 }, message: "Platform settings saved." });
      }),
    );

    const saved = await superAdminApi.updateSettings({ maintenanceMode: true });
    expect(body).toEqual({ maintenanceMode: true });
    expect(saved).toEqual({ maintenanceMode: true, sessionTimeoutMinutes: 30 });
  });

  it("activates and deactivates users through the dedicated endpoints", async () => {
    const calls: string[] = [];
    server.use(
      http.post(`${BASE}/users/:id/:action`, ({ params }) => {
        calls.push(`${String(params.id)}:${String(params.action)}`);
        return HttpResponse.json({ success: true, message: "User 'Account One' activated." });
      }),
    );

    await expect(superAdminApi.setUserActive("u-1", true)).resolves.toBe("User 'Account One' activated.");
    await superAdminApi.setUserActive("u-1", false);
    expect(calls).toEqual(["u-1:activate", "u-1:deactivate"]);
  });
});

describe("superAdminApi — failures propagate (no substitute data)", () => {
  it("throws an ApiError with the backend message on 403", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.use(
      http.get(`${BASE}/statistics`, () =>
        HttpResponse.json({ success: false, message: "Super Admin access required.", data: null }, { status: 403 }),
      ),
    );

    const error = await superAdminApi.getStatistics().catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(403);
    expect((error as ApiError).message).toBe("Super Admin access required.");
  });

  it("throws on server errors and logs the real failure", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.use(
      http.get(`${BASE}/users`, () =>
        HttpResponse.json({ success: false, message: "Failed to fetch platform statistics from database." }, { status: 500 }),
      ),
    );

    await expect(superAdminApi.listUsers({ page: 1, pageSize: 25 })).rejects.toMatchObject({ status: 500 });
    expect(consoleError).toHaveBeenCalled();
    expect(String(consoleError.mock.calls[0][0])).toContain("GET /api/v1/super-admin/users failed (HTTP 500)");
  });

  it("reports network failures with status 0", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.use(http.get(`${BASE}/audit-logs`, () => HttpResponse.error()));

    await expect(superAdminApi.listAuditEvents({ page: 1, pageSize: 10 })).rejects.toMatchObject({ status: 0 });
  });

  it("rejects unexpected response shapes instead of rendering an empty list", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.use(http.get(`${BASE}/organizations`, () => HttpResponse.json({ unexpected: true })));

    await expect(superAdminApi.listOrganizations({ page: 1, pageSize: 10 })).rejects.toBeInstanceOf(ApiError);
  });
});

describe("collectAllPages", () => {
  it("stops when a page is shorter than the page size", async () => {
    const fetchPage = vi.fn(async (page: number) => (page === 1 ? [1, 2] : [3]));
    await expect(collectAllPages(fetchPage, 100, 2)).resolves.toEqual({ items: [1, 2, 3], truncated: false });
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("probes one record past the cap to report truncation exactly", async () => {
    const records = [1, 2, 3, 4, 5];
    const fetchPage = vi.fn(async (page: number, size: number) => records.slice((page - 1) * size, page * size));

    await expect(collectAllPages(fetchPage, 4, 2)).resolves.toEqual({ items: [1, 2, 3, 4], truncated: true });
    expect(fetchPage).toHaveBeenLastCalledWith(5, 1);

    const exact = vi.fn(async (page: number, size: number) => records.slice(0, 4).slice((page - 1) * size, page * size));
    await expect(collectAllPages(exact, 4, 2)).resolves.toEqual({ items: [1, 2, 3, 4], truncated: false });
  });
});
