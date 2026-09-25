import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix } from "@/lib/aurix-store";
import { SuperAdminSettingsPage } from "../pages/SuperAdminSettingsPage";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ children, to }: { children?: ReactNode; to?: string }) => <a href={to}>{children}</a>,
  };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const logoutMock = vi.hoisted(() => vi.fn());
// auth-bootstrap restores the session at import time; the tests only need its logout action.
vi.mock("@/lib/auth-bootstrap", () => ({ logout: logoutMock }));

const BASE = "*/api/v1/super-admin";

// jsdom does not implement ResizeObserver, which Radix Switch uses to measure its thumb.
class ResizeObserverShim {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverShim);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

/** Shape returned by GET /super-admin/settings in app/api/super_admin.py. */
const settingsBody = {
  maintenanceMode: false,
  sessionTimeoutMinutes: 60,
  emailSenderName: "OFC360 Enterprise",
  emailSenderAddress: "no-reply@example.test",
  securityAlertEmail: "security@example.test",
};

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } } });
  return render(
    <QueryClientProvider client={client}>
      <SuperAdminSettingsPage />
    </QueryClientProvider>,
  );
}

describe("SuperAdminSettingsPage", () => {
  beforeEach(() => {
    aurix.set({
      user: {
        id: "sa-1",
        fullName: "Platform Owner Account",
        email: "owner@example.test",
        phone: "",
        role: "super_admin",
        companyId: "workspace",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: "2026-01-01T00:00:00+00:00",
      },
    });
    server.use(
      http.get(`${BASE}/users`, () =>
        HttpResponse.json([
          { id: "sa-1", name: "Platform Owner Account", email: "owner@example.test", role: "super_admin", is_active: true, created_at: "2026-01-01T00:00:00+00:00", last_login: null },
        ]),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the settings returned by the API without flagging non-email text fields", async () => {
    server.use(http.get(`${BASE}/settings`, () => HttpResponse.json(settingsBody)));

    renderPage();

    expect(await screen.findByDisplayValue("OFC360 Enterprise")).toBeInTheDocument();
    expect(screen.getByDisplayValue("security@example.test")).toBeInTheDocument();
    expect(screen.queryByText("Enter a valid email address.")).not.toBeInTheDocument();
    expect(await screen.findByText("1 Super Admin account in database")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save platform settings/i })).toBeDisabled();
  });

  it("PATCHes only the changed setting and clears the unsaved state", async () => {
    let patchBody: unknown = null;
    server.use(
      http.get(`${BASE}/settings`, () => HttpResponse.json(patchBody ? { ...settingsBody, maintenanceMode: true } : settingsBody)),
      http.patch(`${BASE}/settings`, async ({ request }) => {
        patchBody = await request.json();
        return HttpResponse.json({ success: true, settings: { ...settingsBody, maintenanceMode: true }, message: "Platform settings saved." });
      }),
    );

    renderPage();

    fireEvent.click(await screen.findByRole("switch", { name: "Maintenance mode" }));
    expect(screen.getByText("1 unsaved change")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /save platform settings/i }));

    await waitFor(() => expect(patchBody).toEqual({ maintenanceMode: true }));
    expect(await screen.findByText("No unsaved changes")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Maintenance mode" })).toHaveAttribute("aria-checked", "true");
  });

  it("blocks saving invalid numeric values", async () => {
    server.use(http.get(`${BASE}/settings`, () => HttpResponse.json(settingsBody)));

    renderPage();

    const timeout = await screen.findByLabelText("Session timeout (minutes)");
    fireEvent.change(timeout, { target: { value: "-5" } });

    expect(screen.getByText("Enter a whole number of 0 or more.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save platform settings/i })).toBeDisabled();
  });

  it("shows an error state with retry when settings cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.use(http.get(`${BASE}/settings`, () => HttpResponse.json({ success: false, message: "Upstream failure" }, { status: 502 })));

    renderPage();

    expect(await screen.findByText("Unable to load platform settings. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
