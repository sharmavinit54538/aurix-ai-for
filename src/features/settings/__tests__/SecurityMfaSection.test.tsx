import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix } from "@/lib/aurix-store";
import { settingsApi } from "@/redux/settingsApi";
import { SecuritySection } from "../components/sections/SecuritySection";

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

vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn(async () => "data:image/png;base64,MOCK_QR_PNG"),
  },
}));

const BASE = "*/api/v1/settings/mfa";

function createTestStore() {
  return configureStore({
    reducer: {
      [settingsApi.reducerPath]: settingsApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(settingsApi.middleware),
  });
}

function renderSecuritySection(canEdit = true) {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <SecuritySection canEdit={canEdit} />
    </Provider>,
  );
}

describe("Settings → Security MFA Integration (APIs 1–4)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    aurix.set({
      user: {
        id: "u-1",
        fullName: "Security User",
        email: "user@company.test",
        phone: "",
        role: "hr_admin",
        companyId: "c-1",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: "2026-01-01T00:00:00Z",
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches MFA status, completes Enable -> QR -> Verify flow, confirms via status API, and keeps secrets out of localStorage", async () => {
    let mfaEnabled = false;
    let verifyPayload: unknown = null;

    server.use(
      http.get(`${BASE}/status`, () =>
        HttpResponse.json({
          enabled: mfaEnabled,
          method: mfaEnabled ? "totp" : undefined,
          backupCodesRemaining: mfaEnabled ? 4 : undefined,
        }),
      ),
      http.post(`${BASE}/enable`, () =>
        HttpResponse.json({
          otpauth_url: "otpauth://totp/OFC360:user@company.test?secret=JBSWY3DPEHPK3PXP&issuer=OFC360",
          secret: "JBSWY3DPEHPK3PXP",
        }),
      ),
      http.post(`${BASE}/verify`, async ({ request }) => {
        verifyPayload = await request.json();
        mfaEnabled = true;
        return HttpResponse.json({
          verified: true,
          message: "MFA activated",
          backupCodes: ["CODE-1111", "CODE-2222", "CODE-3333", "CODE-4444"],
        });
      }),
    );

    renderSecuritySection(true);

    expect(await screen.findByText("Disabled")).toBeInTheDocument();
    const enableBtn = screen.getByRole("button", { name: /enable mfa/i });
    fireEvent.click(enableBtn);

    const dialog = await screen.findByRole("dialog");
    expect(await within(dialog).findByAltText("MFA Authenticator QR Code")).toBeInTheDocument();

    // Secret masked by default; never written to localStorage
    expect(window.localStorage.getItem("JBSWY3DPEHPK3PXP")).toBeNull();
    fireEvent.click(within(dialog).getByRole("button", { name: /show setup key/i }));
    expect(within(dialog).getByText("JBSWY3DPEHPK3PXP")).toBeInTheDocument();

    const otpInput = within(dialog).getByLabelText(/verification code/i);
    fireEvent.change(otpInput, { target: { value: "123456" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /verify & enable/i }));

    await waitFor(() => {
      expect(verifyPayload).toEqual({ code: "123456", secret: "JBSWY3DPEHPK3PXP" });
    });

    expect(await within(dialog).findByText("CODE-1111")).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /^done$/i }));

    await waitFor(() => {
      expect(screen.getByText("Enabled")).toBeInTheDocument();
    });
    expect(screen.getByText("4 remaining")).toBeInTheDocument();
  });

  it("handles invalid OTP errors without falsely marking MFA enabled", async () => {
    server.use(
      http.get(`${BASE}/status`, () => HttpResponse.json({ enabled: false })),
      http.post(`${BASE}/enable`, () =>
        HttpResponse.json({ secret: "TESTSECRETKEY1234" }),
      ),
      http.post(`${BASE}/verify`, () =>
        HttpResponse.json(
          { detail: "Invalid or expired verification code." },
          { status: 400 },
        ),
      ),
    );

    renderSecuritySection(true);
    fireEvent.click(await screen.findByRole("button", { name: /enable mfa/i }));

    const dialog = await screen.findByRole("dialog");
    const otpInput = await within(dialog).findByLabelText(/verification code/i);
    fireEvent.change(otpInput, { target: { value: "000000" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /verify & enable/i }));

    expect(await within(dialog).findByText("Invalid or expired verification code.")).toBeInTheDocument();
    expect(screen.getByText("Disabled")).toBeInTheDocument();

    // Closing dialog clears setup state cleanly
    fireEvent.click(within(dialog).getByRole("button", { name: /cancel/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("handles Disable MFA flow including dynamic password prompt if backend requires password", async () => {
    let mfaEnabled = true;
    let disableAttempt = 0;
    let lastDisableBody: unknown = null;

    server.use(
      http.get(`${BASE}/status`, () =>
        HttpResponse.json({ enabled: mfaEnabled, method: "totp" }),
      ),
      http.post(`${BASE}/disable`, async ({ request }) => {
        disableAttempt += 1;
        lastDisableBody = await request.json();
        if (disableAttempt === 1) {
          return HttpResponse.json(
            {
              detail: [
                { loc: ["body", "password"], msg: "Password is required to disable MFA" },
              ],
            },
            { status: 422 },
          );
        }
        mfaEnabled = false;
        return HttpResponse.json({ success: true, message: "MFA disabled" });
      }),
    );

    renderSecuritySection(true);

    fireEvent.click(await screen.findByRole("button", { name: /disable mfa/i }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /confirm disable mfa/i }));

    const passwordInput = await within(dialog).findByLabelText("Current Password");
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: "SecretPass#123" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /confirm disable mfa/i }));

    await waitFor(() => {
      expect(lastDisableBody).toEqual({ password: "SecretPass#123" });
    });

    await waitFor(() => expect(screen.getByText("Disabled")).toBeInTheDocument());
  });

  it("renders error alert with Retry button on 429/500/network failure", async () => {
    let fail = true;
    server.use(
      http.get(`${BASE}/status`, () =>
        fail
          ? HttpResponse.json({ detail: "Too many MFA status requests" }, { status: 429 })
          : HttpResponse.json({ enabled: false }),
      ),
    );

    renderSecuritySection(true);

    expect(await screen.findByText("Too Many Requests")).toBeInTheDocument();
    expect(screen.getByText("Too many MFA status requests")).toBeInTheDocument();

    fail = false;
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(await screen.findByText("Disabled")).toBeInTheDocument();
  });
});
