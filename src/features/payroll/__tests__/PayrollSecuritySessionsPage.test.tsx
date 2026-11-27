import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix, type Role } from "@/lib/aurix-store";
import { settingsApi } from "@/redux/settingsApi";
import sidebarReducer from "@/store/sidebar/sidebarSlice";
import { PayrollSecuritySessionsPage } from "../pages/PayrollSecuritySessionsPage";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ children, to }: { children?: ReactNode; to?: string }) => <a href={to}>{children}</a>,
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const forceLocalLogoutMock = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("@/lib/auth-bootstrap", () => ({
  logout: vi.fn(async () => undefined),
  forceLocalLogout: forceLocalLogoutMock,
  isLogoutInProgress: () => false,
}));

const BASE = "*/api/v1/payroll/security";

function createTestStore(permissions: string[] = ["payroll.view", "payroll.security"]) {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
    },
    preloadedState: {
      sidebar: {
        userPermissions: permissions,
        userRole: "hr_admin",
        sidebarOpen: true,
        expandedSections: {},
        loading: false,
        error: null,
      },
    },
    middleware: (getDefault) => getDefault().concat(settingsApi.middleware),
  });
}

function signIn(role: Role) {
  aurix.set({
    user: {
      id: "hr-1",
      fullName: "Payroll Admin",
      email: "payroll@acme.test",
      phone: "",
      role,
      companyId: "c-1",
      emailVerified: true,
      onboardingComplete: true,
      createdAt: "2026-01-01T00:00:00Z",
    },
  });
}

describe("Payroll → Security Active Sessions (APIs 8–10)", () => {
  beforeEach(() => {
    forceLocalLogoutMock.mockClear();
    signIn("hr_admin");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads active sessions, supports search filtering, revokes remote session via DELETE, and handles current session revocation", async () => {
    let sessionsData = [
      {
        id: "ps-1",
        user_id: "hr-1",
        user_name: "Payroll Admin",
        user_email: "payroll@acme.test",
        ip_address: "198.51.100.1",
        device: "Work Laptop",
        browser: "Chrome 131",
        os: "Windows 11",
        login_at: "2026-10-12T08:00:00Z",
        last_activity_at: "2026-10-12T10:15:00Z",
        is_current_session: true,
        status: "Active",
      },
      {
        id: "ps-2",
        user_id: "hr-2",
        user_name: "Finance Reviewer",
        user_email: "reviewer@acme.test",
        ip_address: "198.51.100.99",
        device: "iPhone 16",
        browser: "Safari Mobile",
        is_current_session: false,
        login_at: "2026-10-11T16:00:00Z",
        last_activity_at: "2026-10-12T09:00:00Z",
        status: "Active",
      },
    ];

    const deletedIds: string[] = [];
    server.use(
      http.get(`${BASE}/sessions`, () => HttpResponse.json({ success: true, data: sessionsData })),
      http.delete(`${BASE}/sessions/:sessionId`, ({ params }) => {
        const sid = String(params.sessionId);
        deletedIds.push(sid);
        sessionsData = sessionsData.filter((s) => s.id !== sid);
        return HttpResponse.json({ success: true, message: "Session revoked." });
      }),
    );

    const store = createTestStore();
    render(
      <Provider store={store}>
        <PayrollSecuritySessionsPage />
      </Provider>,
    );

    expect(await screen.findAllByText("Work Laptop")).not.toHaveLength(0);
    expect(screen.getAllByText("iPhone 16")).not.toHaveLength(0);

    // Search filter isolates Finance Reviewer inside the sessions table
    fireEvent.change(screen.getByLabelText("Search payroll sessions"), {
      target: { value: "reviewer" },
    });
    const table = screen.getByRole("table");
    expect(within(table).queryByText("Work Laptop")).not.toBeInTheDocument();
    expect(within(table).getByText("iPhone 16")).toBeInTheDocument();

    // Revoke remote device
    fireEvent.click(screen.getAllByRole("button", { name: /revoke session/i })[0]);
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /confirm revoke session/i }));

    await waitFor(() => expect(deletedIds).toEqual(["ps-2"]));
    expect(forceLocalLogoutMock).not.toHaveBeenCalled();

    // Clear search and revoke current session -> redirects via forceLocalLogout
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(await screen.findAllByText("Work Laptop")).not.toHaveLength(0);

    fireEvent.click(screen.getAllByRole("button", { name: /revoke session/i })[0]);
    const currentDialog = await screen.findByRole("dialog");
    expect(within(currentDialog).getByText(/current active device/i)).toBeInTheDocument();
    fireEvent.click(within(currentDialog).getByRole("button", { name: /confirm revoke session/i }));

    await waitFor(() => expect(forceLocalLogoutMock).toHaveBeenCalledTimes(1));
  });

  it("handles POST /payroll/security/logout-all and logs out locally when backend revokes all sessions", async () => {
    let sessionsData = [
      {
        id: "ps-1",
        userName: "Payroll Admin",
        userEmail: "payroll@acme.test",
        ipAddress: "198.51.100.1",
        device: "Desktop",
        isCurrentSession: true,
        loginAt: "2026-10-12T08:00:00Z",
        lastActivityAt: "2026-10-12T10:15:00Z",
      },
    ];

    let calledLogoutAll = false;
    server.use(
      http.get(`${BASE}/sessions`, () => HttpResponse.json(sessionsData)),
      http.post(`${BASE}/logout-all`, () => {
        calledLogoutAll = true;
        sessionsData = [];
        return HttpResponse.json({
          success: true,
          message: "All payroll sessions terminated.",
        });
      }),
    );

    const store = createTestStore();
    render(
      <Provider store={store}>
        <PayrollSecuritySessionsPage />
      </Provider>,
    );

    expect(await screen.findAllByText("Desktop")).not.toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: /logout all devices/i }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /confirm logout all devices/i }));

    await waitFor(() => expect(calledLogoutAll).toBe(true));
    await waitFor(() => expect(forceLocalLogoutMock).toHaveBeenCalledTimes(1));
  });

  it("denies access cleanly to unauthorized roles without calling payroll session APIs", () => {
    signIn("employee");
    const fetchSpy = vi.fn();
    server.use(
      http.get(`${BASE}/sessions`, () => {
        fetchSpy();
        return HttpResponse.json([]);
      }),
    );

    const store = createTestStore([]);
    render(
      <Provider store={store}>
        <PayrollSecuritySessionsPage />
      </Provider>,
    );

    expect(screen.getByText("Access Restricted")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows empty state cleanly when session list is empty and retries cleanly on error", async () => {
    let failFirst = true;
    server.use(
      http.get(`${BASE}/sessions`, () =>
        failFirst
          ? HttpResponse.json({ detail: "Service temporarily unavailable" }, { status: 503 })
          : HttpResponse.json([]),
      ),
    );

    const store = createTestStore();
    render(
      <Provider store={store}>
        <PayrollSecuritySessionsPage />
      </Provider>,
    );

    expect(await screen.findByText("Service Unavailable")).toBeInTheDocument();
    failFirst = false;
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("No active payroll sessions")).toBeInTheDocument();
  });
});
