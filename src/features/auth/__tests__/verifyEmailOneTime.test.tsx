import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";
import { authService, hasValidAccessToken } from "@/api";
import { aurix } from "@/lib/aurix-store";
import {
  buildOtpTimerKey,
  saveOtpTimerState,
  loadOtpTimerState,
} from "../utils/otpTimerStorage";
import {
  guardGuestAuthRoute,
  guardOnboardingRoute,
  guardDashboardRoute,
} from "@/lib/auth-route-guards";
import { isUserAuthenticated } from "@/lib/route-guards";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  redirect: vi.fn((opts: any) => {
    const err = new Error(`REDIRECT:${opts?.to}`);
    (err as any).redirect = opts;
    return err;
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api")>();
  return {
    ...actual,
    authService: {
      ...actual.authService,
      verifyEmail: vi.fn(),
      verifyLoginOtp: vi.fn(),
      resendOtp: vi.fn(),
      resendLoginOtp: vi.fn(),
      getMe: vi.fn(),
    },
    hasValidAccessToken: vi.fn(() => false),
  };
});

vi.mock("@/lib/route-guards", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/route-guards")>();
  return {
    ...actual,
    isUserAuthenticated: vi.fn(() => false),
  };
});

describe("One-Time Email OTP Verification & Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    aurix.set({ user: null, company: null, isRestoring: false });
    if (typeof window !== "undefined") {
      window.sessionStorage.clear();
      window.localStorage.clear();
      window.history.pushState({}, "Verify", "/verify-email?email=alex%40acme.com");
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("removes 'Already verified? Continue to onboarding' button and disables submit until 6 digits entered", () => {
    render(<VerifyEmailPage />);

    expect(screen.queryByText(/already verified\?/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/continue to onboarding/i)).not.toBeInTheDocument();
    expect(screen.getByText(/alex@acme\.com/i)).toBeInTheDocument();

    const verifyBtn = screen.getByRole("button", { name: /verify and continue/i });
    expect(verifyBtn).toBeDisabled();

    const otpInput = screen.getByLabelText(/six-digit verification code/i);
    expect(otpInput).toHaveAttribute("inputmode", "numeric");

    fireEvent.change(otpInput, { target: { value: "12345" } });
    expect(verifyBtn).toBeDisabled();

    fireEvent.change(otpInput, { target: { value: "123456" } });
    expect(verifyBtn).not.toBeDisabled();
  });

  it("ignores localStorage/sessionStorage ofc360_email_verified bypass flags", () => {
    window.localStorage.setItem("ofc360_email_verified", "alex@acme.com");
    window.sessionStorage.setItem("ofc360_email_verified", "alex@acme.com");

    render(<VerifyEmailPage />);

    // Must NOT navigate away or auto-verify from browser storage flags
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /verify and continue/i })).toBeInTheDocument();
  });

  it("automatically redirects already-verified backend users visiting /verify-email", async () => {
    aurix.set({
      user: {
        id: "u-verified",
        fullName: "Verified HR",
        email: "alex@acme.com",
        phone: "9876543210",
        role: "hr_admin",
        companyId: "c-1",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      },
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard", replace: true });
    });
  });

  it("persists OTP expiry and resend cooldown timestamps across component reload without resetting to 10:00", () => {
    const scopeKey = buildOtpTimerKey("alex@acme.com", null);
    const futureExpiry = new Date(Date.now() + 300_000).toISOString();
    const futureResend = new Date(Date.now() + 15_000).toISOString();

    saveOtpTimerState(scopeKey, {
      otp_expires_at: futureExpiry,
      resend_available_at: futureResend,
    });

    const { unmount } = render(<VerifyEmailPage />);
    expect(screen.queryByText(/Code expires in 10:00/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Code expires in 0[45]:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend in 1[45]s/i })).toBeDisabled();

    unmount();
    render(<VerifyEmailPage />);

    // Must resume from persisted backend timestamps rather than resetting to 10:00 / 30s
    expect(loadOtpTimerState(scopeKey)?.otpExpiresAt).toBe(futureExpiry);
    expect(screen.queryByText(/Code expires in 10:00/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Code expires in 0[45]:/i)).toBeInTheDocument();
  });

  it("submits verification_id to verifyLoginOtp and routes to onboarding/dashboard based on backend response", async () => {
    window.history.pushState(
      {},
      "Verify",
      "/verify-email?email=pending%40acme.com&mode=login&verification_id=vid-123",
    );

    vi.mocked(authService.verifyLoginOtp).mockResolvedValueOnce({
      success: true,
      message: "Email verified and login successful.",
      data: {
        access_token: "jwt-access-verified",
        token_type: "Bearer",
        expires_in: 900,
        user: {
          id: "u-9",
          name: "Pending Owner",
          email: "pending@acme.com",
          role: "hr_admin",
          is_verified: true,
          is_email_verified: true,
          onboarding_completed: false,
        },
      },
    } as any);

    render(<VerifyEmailPage />);

    const otpInput = screen.getByLabelText(/six-digit verification code/i);
    fireEvent.change(otpInput, { target: { value: "654321" } });
    fireEvent.click(screen.getByRole("button", { name: /verify and continue/i }));

    await waitFor(() => {
      expect(authService.verifyLoginOtp).toHaveBeenCalledWith({
        verification_id: "vid-123",
        otp: "654321",
      });
      expect(aurix.get().user?.emailVerified).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/onboarding" });
    });
  });

  it("enforces centralized route guards for unverified, unauthenticated, incomplete-onboarding, and verified-onboarded users", async () => {
    vi.mocked(hasValidAccessToken).mockReturnValue(true);
    vi.mocked(isUserAuthenticated).mockReturnValue(true);

    // 1. Authenticated but unverified user cannot enter onboarding or dashboard
    aurix.set({
      user: {
        id: "u-1",
        fullName: "Unverified",
        email: "u1@acme.com",
        phone: "",
        role: "hr_admin",
        companyId: "c-1",
        emailVerified: false,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      },
    });
    await expect(guardOnboardingRoute({})).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/verify-email" }),
    });
    await expect(guardDashboardRoute("/dashboard")).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/verify-email" }),
    });

    // 2. Verified user with incomplete onboarding opening /verify-email or /dashboard -> redirected to /onboarding
    aurix.set({
      user: {
        id: "u-1",
        fullName: "Verified Pending Onboarding",
        email: "u1@acme.com",
        phone: "",
        role: "hr_admin",
        companyId: "c-1",
        emailVerified: true,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      },
    });
    await expect(guardGuestAuthRoute("verify_email")).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/onboarding" }),
    });
    await expect(guardDashboardRoute("/dashboard")).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/onboarding" }),
    });

    // 3. Verified user with completed onboarding opening /verify-email or /onboarding -> redirected to /dashboard
    aurix.set({
      user: {
        id: "u-1",
        fullName: "Verified Onboarded",
        email: "u1@acme.com",
        phone: "",
        role: "hr_admin",
        companyId: "c-1",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      },
    });
    await expect(guardGuestAuthRoute("verify_email")).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/dashboard" }),
    });
    await expect(guardOnboardingRoute({})).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/dashboard" }),
    });

    // 4. Unauthenticated user -> redirected to /login
    vi.mocked(isUserAuthenticated).mockReturnValue(false);
    aurix.set({ user: null });
    await expect(guardDashboardRoute("/dashboard")).rejects.toMatchObject({
      redirect: expect.objectContaining({ to: "/login" }),
    });
  });
});
