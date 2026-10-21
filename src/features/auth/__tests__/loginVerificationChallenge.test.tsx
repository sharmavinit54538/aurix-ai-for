import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage } from "../pages/LoginPage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";
import { authService } from "@/api";
import { toast } from "sonner";
import { aurix } from "@/lib/aurix-store";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
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
      login: vi.fn(),
      verifyEmail: vi.fn(),
      resendOtp: vi.fn(),
      getMe: vi.fn().mockResolvedValue({
        success: true,
        data: {
          id: "u-99",
          email: "unverified@ofc360.com",
          name: "Verified User",
          role: "hr_admin",
          onboarding_completed: false,
        },
      }),
    },
    hasValidAccessToken: vi.fn(() => false),
  };
});

describe("Login and Email Verification Challenge Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    aurix.set({ user: null, company: null, isRestoring: false });
    if (typeof window !== "undefined") {
      window.sessionStorage.clear();
      window.history.pushState({}, "Login", "/login");
    }
  });

  it("handles standard login returning access_token: persists session and navigates to dashboard", async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      data: {
        access_token: "mock-valid-access-token",
        refresh_token: "mock-valid-refresh-token",
        user: {
          id: "u-1",
          email: "admin@ofc360.com",
          name: "John Doe",
          role: "hr_admin",
          is_verified: true,
          onboarding_completed: true,
        },
      },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: "admin@ofc360.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "SecurePass123!" },
    });

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome back, John Doe!");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("handles login returning 200 OK with email verification challenge: displays friendly toast, saves email in sessionStorage, and redirects to /verify-email", async () => {
    // Simulating FastAPI backend behavior when login requires email verification
    vi.mocked(authService.login).mockResolvedValueOnce({
      requires_verification: true,
      message: "Login requires email verification",
      data: {
        email: "unverified@ofc360.com",
        user_id: "u-99",
      },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: "unverified@ofc360.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "SecurePass123!" },
    });

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // 1. Must NOT show error toast
      expect(toast.error).not.toHaveBeenCalled();

      // 2. Must show friendly notification toast
      expect(toast.info).toHaveBeenCalledWith("Login requires email verification");

      // 3. Must save email to sessionStorage
      expect(window.sessionStorage.getItem("ofc360_pending_verification_email")).toBe("unverified@ofc360.com");

      // 4. Must redirect to /verify-email with email and mode=login
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: expect.stringContaining("/verify-email"),
          search: expect.objectContaining({
            email: "unverified@ofc360.com",
            mode: "login",
          }),
        }),
      );
    });
  });

  it("VerifyEmailPage routes user to /onboarding when onboarding is pending, then to dashboard once complete", async () => {
    window.history.pushState({}, "Verify", "/verify-email?email=unverified%40ofc360.com&mode=login");
    window.sessionStorage.setItem("ofc360_pending_verification_email", "unverified@ofc360.com");

    vi.mocked(authService.verifyEmail).mockResolvedValueOnce({
      success: true,
      message: "Email verified successfully!",
      data: {
        access_token: "new-access-token-post-verify",
        refresh_token: "new-refresh-token",
        user: {
          id: "u-99",
          email: "unverified@ofc360.com",
          name: "Verified User",
          role: "hr_admin",
          onboarding_completed: false,
        },
      },
    });

    render(<VerifyEmailPage />);

    // Subtitle displays the target email
    expect(screen.getByText(/unverified@ofc360\.com/i)).toBeInTheDocument();

    // Timer displays 10 minutes (10:00) expiration
    expect(screen.getByText(/Code expires in 10:00/i)).toBeInTheDocument();

    // Fill 6-digit OTP
    const otpInput = screen.getByRole("textbox");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyBtn = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyBtn);

    await waitFor(
      () => {
        expect(authService.verifyEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            email: "unverified@ofc360.com",
            otp: "123456",
            code: "123456",
          }),
        );
        expect(toast.success).toHaveBeenCalledWith("Email verified successfully!");
        // Since onboarding_completed is false, destination must be /onboarding
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/onboarding" });
      },
      { timeout: 3000 },
    );
  });

  it("VerifyEmailPage routes user directly to dashboard when onboarding is already completed", async () => {
    window.history.pushState({}, "Verify", "/verify-email?email=onboarded%40ofc360.com&mode=login");
    window.sessionStorage.setItem("ofc360_pending_verification_email", "onboarded@ofc360.com");

    vi.mocked(authService.verifyEmail).mockResolvedValueOnce({
      success: true,
      message: "Email verified successfully!",
      data: {
        access_token: "token-abc",
        refresh_token: "token-refresh",
        user: {
          id: "u-101",
          email: "onboarded@ofc360.com",
          name: "Onboarded Admin",
          role: "hr_admin",
          is_verified: true,
          onboarding_completed: true,
        },
      },
    });

    render(<VerifyEmailPage />);

    const otpInput = screen.getByRole("textbox");
    fireEvent.change(otpInput, { target: { value: "654321" } });

    const verifyBtn = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyBtn);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith("Email verified successfully!");
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
      },
      { timeout: 3000 },
    );
  });

  it("VerifyEmailPage routes user to /onboarding when verify-email succeeds without tokens (standard registration flow)", async () => {
    window.history.pushState({}, "Verify", "/verify-email?email=newuser%40ofc360.com");
    window.sessionStorage.setItem("ofc360_pending_verification_email", "newuser@ofc360.com");

    aurix.set({
      user: {
        id: "u-new",
        fullName: "New Admin",
        email: "newuser@ofc360.com",
        phone: "",
        role: "hr_admin",
        companyId: "workspace",
        emailVerified: false,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      },
    });

    vi.mocked(authService.verifyEmail).mockResolvedValueOnce({
      success: true,
      message: "Email verified successfully.",
      data: null,
    });

    render(<VerifyEmailPage />);

    const otpInput = screen.getByRole("textbox");
    fireEvent.change(otpInput, { target: { value: "112233" } });

    const verifyBtn = screen.getByRole("button", { name: /verify/i });
    fireEvent.click(verifyBtn);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith("Email verified successfully.");
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/onboarding" });
        expect(aurix.get().user?.emailVerified).toBe(true);
      },
      { timeout: 3000 },
    );
  });
});
