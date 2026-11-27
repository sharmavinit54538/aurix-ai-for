import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix } from "@/lib/aurix-store";
import superAdminReducer from "../redux/superAdminSlice";
import { SuperAdminUsersPage } from "../pages/SuperAdminUsersPage";
import { SuperAdminSecurityPage } from "../pages/SuperAdminSecurityPage";

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
const logoutMock = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("@/lib/auth-bootstrap", () => ({
  logout: logoutMock,
  forceLocalLogout: forceLocalLogoutMock,
  isLogoutInProgress: () => false,
}));

const BASE = "*/api/v1/super-admin";

function createTestStore() {
  return configureStore({
    reducer: {
      superAdmin: superAdminReducer,
    },
  });
}

function renderWithStore(ui: ReactNode) {
  const store = createTestStore();
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("Super Admin Password Reset & Session Management (APIs 5–7)", () => {
  beforeEach(() => {
    forceLocalLogoutMock.mockClear();
    logoutMock.mockClear();
    aurix.set({
      user: {
        id: "sa-1",
        fullName: "Platform Owner",
        email: "owner@ofc360.com",
        phone: "",
        role: "super_admin",
        companyId: "platform",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: "2026-01-01T00:00:00Z",
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("supports resetting user password from User Details dialog and calls POST /users/{id}/reset-password", async () => {
    let resetUserId = "";
    server.use(
      http.get(`${BASE}/statistics`, () =>
        HttpResponse.json({
          kpis: { total_users: 2, active_users: 2, inactive_users: 0 },
        }),
      ),
      http.get(`${BASE}/users`, () =>
        HttpResponse.json([
          {
            id: "u-99",
            name: "Priya Sharma",
            email: "priya@acme.test",
            role: "hr_admin",
            company_id: "c-1",
            company_name: "Acme Corp",
            is_active: true,
            created_at: "2026-09-01T09:00:00Z",
            last_login: null,
          },
          {
            id: "sa-1",
            name: "Platform Owner",
            email: "owner@ofc360.com",
            role: "super_admin",
            company_id: null,
            company_name: "Global Platform",
            is_active: true,
            created_at: "2026-01-01T09:00:00Z",
            last_login: null,
          },
        ]),
      ),
      http.get(`${BASE}/users/u-99`, () =>
        HttpResponse.json({
          id: "u-99",
          name: "Priya Sharma",
          email: "priya@acme.test",
          phone: "+91 99999 00000",
          role: "hr_admin",
          companyId: "c-1",
          is_active: true,
          status: "Active",
          created_at: "2026-09-01T09:00:00Z",
        }),
      ),
      http.post(`${BASE}/users/:userId/reset-password`, ({ params }) => {
        resetUserId = String(params.userId);
        return HttpResponse.json({
          success: true,
          message: "Password reset instructions sent for 'priya@acme.test'.",
        });
      }),
      http.get(`${BASE}/audit-logs`, () => HttpResponse.json([])),
    );

    renderWithStore(<SuperAdminUsersPage />);

    // Open User Details for Priya Sharma
    const userButton = await screen.findByRole("button", { name: "Priya Sharma" });
    fireEvent.click(userButton);

    const detailsDialog = await screen.findByRole("dialog");
    expect(await within(detailsDialog).findByText("User Account Details")).toBeInTheDocument();
    fireEvent.click(within(detailsDialog).getByRole("button", { name: /reset password/i }));

    // Confirm Reset Password dialog opens cleanly without extra unrequired password inputs
    const confirmDialog = await screen.findByRole("dialog", { name: /reset user password/i });
    expect(within(confirmDialog).getByText("priya@acme.test")).toBeInTheDocument();
    fireEvent.click(within(confirmDialog).getByRole("button", { name: /confirm reset password/i }));

    await waitFor(() => {
      expect(resetUserId).toBe("u-99");
    });
  });

  it("terminates an individual session via POST /security/sessions/{id}/terminate and refreshes list", async () => {
    let sessionsList = [
      {
        id: "sess-1",
        adminName: "HR Lead",
        adminEmail: "hr@acme.test",
        role: "hr_admin",
        ipAddress: "203.0.113.20",
        device: "MacBook Pro",
        browser: "Chrome 130",
        os: "macOS",
        loginTime: "2026-10-10T08:00:00Z",
      },
      {
        id: "sess-2",
        adminName: "Finance Lead",
        adminEmail: "fin@acme.test",
        ipAddress: "203.0.113.45",
        loginTime: "2026-10-10T09:00:00Z",
      },
    ];
    let terminatedId = "";

    server.use(
      http.get(`${BASE}/security/sessions`, () => HttpResponse.json(sessionsList)),
      http.post(`${BASE}/security/sessions/:sessionId/terminate`, ({ params }) => {
        terminatedId = String(params.sessionId);
        sessionsList = sessionsList.filter((s) => s.id !== terminatedId);
        return HttpResponse.json({ success: true, message: "Session terminated successfully." });
      }),
      http.get(`${BASE}/audit-logs`, () => HttpResponse.json([])),
    );

    renderWithStore(<SuperAdminSecurityPage />);

    expect(await screen.findAllByText("hr@acme.test")).not.toHaveLength(0);
    expect(screen.getAllByText("fin@acme.test")).not.toHaveLength(0);

    const terminateButtons = screen.getAllByRole("button", { name: /terminate session/i });
    fireEvent.click(terminateButtons[0]);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("hr@acme.test")).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /confirm terminate/i }));

    await waitFor(() => expect(terminatedId).toBe("sess-1"));
    await waitFor(() => expect(screen.queryByText("hr@acme.test")).not.toBeInTheDocument());
    expect(forceLocalLogoutMock).not.toHaveBeenCalled();
  });

  it("calls POST /security/sessions/terminate-all and forces local logout when current session is revoked", async () => {
    let sessionsList = [
      {
        id: "sess-owner",
        adminName: "Platform Owner",
        adminEmail: "owner@ofc360.com",
        loginTime: "2026-10-10T08:00:00Z",
      },
    ];

    server.use(
      http.get(`${BASE}/security/sessions`, () => HttpResponse.json(sessionsList)),
      http.post(`${BASE}/security/sessions/terminate-all`, () => {
        sessionsList = [];
        return HttpResponse.json({ success: true, message: "All sessions terminated." });
      }),
    );

    renderWithStore(<SuperAdminSecurityPage />);

    expect(await screen.findAllByText("owner@ofc360.com")).not.toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: /terminate all sessions/i }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: /confirm terminate all sessions/i }),
    );

    await waitFor(() => expect(forceLocalLogoutMock).toHaveBeenCalledTimes(1));
  });
});
