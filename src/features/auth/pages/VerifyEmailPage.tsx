import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { aurix, useAurix } from "@/lib/aurix-store";
import { authService } from "@/api";
import { persistAuthSession } from "@/lib/auth-bootstrap";
import { getSafeRedirectUrl } from "@/lib/role-routing";
import { parseLoginResponse } from "@/features/auth/utils/parseLoginResponse";
import { toast } from "sonner";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve effective email from URL search params, sessionStorage, or active user state
  const searchParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const queryEmail = searchParams.get("email");
  const sessionEmail =
    typeof window !== "undefined" && window.sessionStorage
      ? window.sessionStorage.getItem("ofc360_pending_verification_email")
      : null;
  const effectiveEmail = (queryEmail || sessionEmail || ws.user?.email || "").trim();

  const queryMode = searchParams.get("mode");
  const sessionMode =
    typeof window !== "undefined" && window.sessionStorage
      ? window.sessionStorage.getItem("ofc360_pending_verification_mode")
      : null;
  const isLoginMode = queryMode === "login" || sessionMode === "login";

  useEffect(() => {
    if (ws.isRestoring) return;

    // If an email exists to verify, allow the user to remain on this page
    if (effectiveEmail) return;

    // Only redirect if there's no email to verify
    if (!ws.user) {
      navigate({ to: "/login" });
    } else if (ws.user.emailVerified) {
      navigate({ to: "/onboarding" });
    }
  }, [ws.user, ws.isRestoring, effectiveEmail, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  if (ws.isRestoring) {
    return <AuthLoadingScreen />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return setError("Enter the 6-digit code");
    setError(null);
    setLoading(true);

    try {
      const response = (await authService.verifyEmail({
        email: effectiveEmail,
        otp: code,
        code: code,
      })) as any;

      const isSuccess = Boolean(
        response?.data?.success ??
          response?.success ??
          response?.access_token ??
          response?.data?.access_token ??
          (response && !response?.error && response?.status !== "error"),
      );
      const message = response?.data?.message || response?.message;

      if (isSuccess) {
        // 1. Check if the backend verification endpoint returned tokens + user
        const loginResult = parseLoginResponse(response, effectiveEmail);
        if (loginResult?.status === "authenticated") {
          persistAuthSession(loginResult.user, {
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken,
          });
          setSuccess(true);
          toast.success(message || "Email verified successfully!");

          try {
            sessionStorage.removeItem("ofc360_pending_verification_email");
            sessionStorage.removeItem("ofc360_pending_verification_user_id");
            sessionStorage.removeItem("ofc360_pending_verification_temp_token");
            sessionStorage.removeItem("ofc360_pending_verification_mode");
          } catch {
            /* ignore */
          }

          const params = new URLSearchParams(window.location.search);
          const redirectParam = params.get("redirect") || params.get("callbackUrl");
          const destination = getSafeRedirectUrl(redirectParam, loginResult.user);
          setTimeout(() => navigate({ to: destination as any }), 1000);
          return;
        }

        // 2. If no tokens returned directly, update verified flag and route based on mode
        setSuccess(true);
        toast.success(message || "Email verified successfully!");

        if (ws.user) {
          aurix.set({ user: { ...ws.user, emailVerified: true } });
        }

        try {
          sessionStorage.removeItem("ofc360_pending_verification_email");
          sessionStorage.removeItem("ofc360_pending_verification_user_id");
          sessionStorage.removeItem("ofc360_pending_verification_temp_token");
          sessionStorage.removeItem("ofc360_pending_verification_mode");
        } catch {
          /* ignore */
        }

        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect") || params.get("callbackUrl");

        if (isLoginMode) {
          setTimeout(() => {
            navigate({
              to: "/login" as any,
              search: {
                email: effectiveEmail,
                ...(redirectParam ? { redirect: redirectParam } : {}),
              } as any,
            });
          }, 1100);
        } else {
          setTimeout(() => navigate({ to: "/onboarding" as any }), 1100);
        }
      } else {
        setError(message || "Verification failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Incorrect or expired code";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!effectiveEmail) {
      toast.error("Email address missing. Please return to login.");
      return;
    }
    setResending(true);
    try {
      const response = (await authService.resendOtp({ email: effectiveEmail })) as any;
      const isSuccess = Boolean(response?.data?.success ?? response?.success ?? true);
      const message = response?.data?.message || response?.message;
      if (isSuccess) {
        setSecondsLeft(30);
        toast.success(message || "OTP sent successfully.");
      } else {
        toast.error(message || "Failed to resend code");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Too many attempts, please try again later.";
      toast.error(message);
    } finally {
      setResending(false);
    }
  }

  if (success) {
    return (
      <AuthShell title="Email verified" subtitle="Redirecting…">
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted-foreground">
            All set{effectiveEmail ? ` for ${effectiveEmail}` : ""}.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={isLoginMode ? "Verify your login" : "Verify your email"}
      subtitle={
        effectiveEmail ? `We sent a 6-digit code to ${effectiveEmail}` : "We sent you a 6-digit code"
      }
      footer={
        <div className="text-center text-sm">
          Want to use a different account?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Verify and continue
        </Button>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {secondsLeft > 0 ? `Code expires in ${secondsLeft}s` : "Code expired"}
          </span>
          <button
            type="button"
            onClick={resend}
            disabled={secondsLeft > 0 || resending}
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {resending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Resend code
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
