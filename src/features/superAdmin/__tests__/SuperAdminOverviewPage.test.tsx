import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix, type Role } from "@/lib/aurix-store";
import apiInstance from "@/api/apiInstance";
import { SuperAdminOverviewPage } from "../pages/SuperAdminOverviewPage";
import { Route as SuperAdminLayoutRoute } from "@/routes/dashboard.super-admin";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ children, to, className }: { children?: ReactNode; to?: string; className?: string }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
    Outlet: () => <div data-testid="super-admin-outlet" />,
  };
});

const logoutMock = vi.hoisted(() => vi.fn());
// auth-bootstrap restores the session at import time; the tests only need its logout action.
vi.mock("@/lib/auth-bootstrap", () => ({ logout: logoutMock }));

const BASE = "*/api/v1/super-admin";

afterEach(() => {
  vi.restoreAllMocks();
  logoutMock.mockClear();
});

function signInAs(role: Role) {
  aurix.set({
    user: {
      id: "sa-1",
      fullName: "Platform Owner Account",
      email: "owner@example.test",
      phone: "",
      role,
      companyId: "workspace",
      emailVerified: true,
      onboardingComplete: true,
      createdAt: "2026-01-01T00:00:00+00:00",
    },
  });
}

function renderWithQueryClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

function kpis(overrides: Record<string, number>) {
  return {
    kpis: {
      total_organizations: 0,
      active_organizations: 0,
      total_users: 0,
      total_hr_admins: 0,
      total_employees: 0,
      total_managers: 0,
      total_executives: 0,
      total_it_admins: 0,
      total_super_admins: 1,
      active_users: 0,
      inactive_users: 0,
      trial_organizations: 0,
      suspended_organizations: 0,
      total_workforce_managed: 0,
      ...overrides,
    },
  };
}

function useCommonHandlers(options: { lists: "populated" | "empty" }) {
  const populated = options.lists === "populated";
  server.use(
    http.get(`${BASE}/organizations`, () =>
      HttpResponse.json(
        populated
          ? [{ id: "c-1", name: "Tenant One", plan: "Growth", status: "Active", user_count: 12, employee_count: 10, created_at: "2026-09-10T10:00:00+00:00" }]
          : [],
      ),
    ),
    http.get(`${BASE}/users`, () =>
      HttpResponse.json(
        populated
          ? [{ id: "u-1", name: "Account One", email: "one@example.test", role: "hr_admin", company_id: "c-1", company_name: "Tenant One", is_active: true, created_at: "2026-09-20T10:00:00+00:00", last_login: null }]
          : [],
      ),
    ),
    http.get(`${BASE}/audit-logs`, () =>
      HttpResponse.json(
        populated
          ? [{ id: "a-1", timestamp: "2026-09-24T10:00:00+00:00", actor: "owner@example.test", action: "SUPER_ADMIN_UPDATE_SETTINGS", targetCompany: null, details: "Updated platform configuration." }]
          : [],
      ),
    ),
    http.get(`${BASE}/system-health`, () =>
      HttpResponse.json({ status: "ONLINE", services: [{ name: "PostgreSQL Primary Database", status: "ONLINE", latency: "2.5ms" }] }),
    ),
    http.get("*/health", () => HttpResponse.json({ status: "healthy", database: "connected", version: "1.0.0", environment: "production" })),
  );
}

describe("SuperAdminOverviewPage", () => {
  beforeEach(() => {
    signInAs("super_admin");
  });

  it("renders statistics, organizations, users and activity returned by the API", async () => {
    useCommonHandlers({ lists: "populated" });
    server.use(
      http.get(`${BASE}/statistics`, () =>
        HttpResponse.json(kpis({ total_users: 1234, active_users: 1200, inactive_users: 34, total_organizations: 7, total_workforce_managed: 5678 })),
      ),
    );

    renderWithQueryClient(<SuperAdminOverviewPage />);

    expect(await screen.findByText("1,234")).toBeInTheDocument();
    expect(await screen.findByText("5,678")).toBeInTheDocument();
    expect(await screen.findAllByText("Tenant One")).not.toHaveLength(0);
    expect(await screen.findByText("Account One")).toBeInTheDocument();
    expect(await screen.findByText("SUPER_ADMIN_UPDATE_SETTINGS")).toBeInTheDocument();
  });

  it("shows empty states when the platform has no records", async () => {
    useCommonHandlers({ lists: "empty" });
    server.use(http.get(`${BASE}/statistics`, () => HttpResponse.json(kpis({}))));

    renderWithQueryClient(<SuperAdminOverviewPage />);

    expect(await screen.findByText("No organizations found")).toBeInTheDocument();
    expect(await screen.findByText("No activity available")).toBeInTheDocument();
    expect(await screen.findByText("No users found")).toBeInTheDocument();
  });

  it("shows an error state with retry when statistics fail, then loads real data on retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    useCommonHandlers({ lists: "populated" });
    let failing = true;
    server.use(
      http.get(`${BASE}/statistics`, () =>
        failing
          ? HttpResponse.json({ success: false, message: "Failed to fetch platform statistics from database." }, { status: 500 })
          : HttpResponse.json(kpis({ total_users: 4321 })),
      ),
    );

    renderWithQueryClient(<SuperAdminOverviewPage />);

    expect(await screen.findByText("Unable to load Super Admin statistics. Please try again.")).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch platform statistics from database\./)).toBeInTheDocument();
    expect(screen.queryByText("4,321")).not.toBeInTheDocument();

    failing = false;
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByText("4,321")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Unable to load Super Admin statistics. Please try again.")).not.toBeInTheDocument(),
    );
  });

  it("renders access denied when the API rejects the session with 403", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    useCommonHandlers({ lists: "populated" });
    server.use(
      http.get(`${BASE}/statistics`, () =>
        HttpResponse.json({ success: false, message: "Super Admin access required." }, { status: 403 }),
      ),
    );

    renderWithQueryClient(<SuperAdminOverviewPage />);

    expect(await screen.findByText("Access denied")).toBeInTheDocument();
    expect(screen.getByText(/HTTP 403 · Super Admin access required\./)).toBeInTheDocument();
    expect(screen.queryByText("Super Admin Command Center")).not.toBeInTheDocument();

    // A dashboard link would loop back here; the recovery path is signing in with the right account.
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});

describe("Super Admin layout guard", () => {
  it.each<Role>(["hr_admin", "manager", "employee", "it_admin", "executive"])(
    "denies the %s role without calling any Super Admin API",
    (role) => {
      signInAs(role);
      const requestSpy = vi.spyOn(apiInstance, "request");
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const Layout = SuperAdminLayoutRoute.options.component as () => ReactNode;

      renderWithQueryClient(<Layout />);

      expect(screen.getByText("Access denied")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Go to my dashboard" })).toHaveAttribute("href", "/dashboard");
      expect(screen.queryByTestId("super-admin-outlet")).not.toBeInTheDocument();
      expect(requestSpy).not.toHaveBeenCalled();
      expect(fetchSpy).not.toHaveBeenCalled();
    },
  );

  it("renders the Super Admin pages for the super_admin role", () => {
    signInAs("super_admin");
    const Layout = SuperAdminLayoutRoute.options.component as () => ReactNode;

    renderWithQueryClient(<Layout />);

    expect(screen.getByTestId("super-admin-outlet")).toBeInTheDocument();
    expect(screen.queryByText("Access denied")).not.toBeInTheDocument();
  });
});
