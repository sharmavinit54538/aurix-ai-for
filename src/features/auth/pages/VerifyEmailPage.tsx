import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { aurix, useAurix } from "@/lib/aurix-store";
import { authService, hasValidAccessToken } from "@/api";
import { bootstrapAuth, persistAuthSession, useAuthReady } from "@/lib/auth-bootstrap";
import { getDefaultDashboardPath, getSafeRedirectUrl } from "@/lib/role-routing";
import { normalizeRole } from "@/lib/roles";
import { parseLoginResponse } from "@/features/auth/utils/parseLoginResponse";
import {
  buildOtpTimerKey,
  clearOtpTimerState,
  computeSecondsRemaining,
  extractOtpMeta,
  loadOtpTimerState,
  saveOtpTimerState,
} from "@/features/auth/utils/otpTimerStorage";
import { toast } from "sonner";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const authReady = useAuthReady();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearVerificationStorage = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage?.removeItem("ofc360_pending_verification_email");
        window.sessionStorage?.removeItem("ofc360_pending_verification_password");
        window.sessionStorage?.removeItem("ofc360_pending_verification_user_id");
        window.sessionStorage?.removeItem("ofc360_pending_verification_temp_token");
        window.sessionStorage?.removeItem("ofc360_pending_verification_id");
        window.sessionStorage?.removeItem("ofc360_pending_verification_mode");
        window.sessionStorage?.removeItem("aurix_pending_auth");
        window.sessionStorage?.removeItem("ofc360_email_verified");
        window.localStorage?.removeItem("ofc360_email_verified");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const resolveTargetRoute = useCallback(
    (user: any, redirectParam?: string | null): string => {
      const isOnboardingComplete = Boolean(
        user?.onboarding_completed ??
          user?.onboardingCompleted ??
          user?.onboardingComplete ??
          user?.is_onboarded ??
          ws.user?.onboardingComplete,
      );
      const role = normalizeRole(user?.role);
      if (!isOnboardingComplete) {
        if (role === "employee" || role === "manager") {
          return "/employee-onboarding";
        }
        return "/onboarding";
      }
      return getSafeRedirectUrl(redirectParam, user);
    },
    [ws.user?.onboardingComplete],
  );

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

  const queryVerificationId =
    searchParams.get("verification_id") || searchParams.get("verificationId");
  const sessionVerificationId =
    typeof window !== "undefined" && window.sessionStorage
      ? window.sessionStorage.getItem("ofc360_pending_verification_id") ||
        window.sessionStorage.getItem("ofc360_pending_verification_temp_token")
      : null;
  const [verificationId, setVerificationId] = useState<string | null>(
    queryVerificationId || sessionVerificationId || null,
  );

  const timerKey = buildOtpTimerKey(effectiveEmail, verificationId);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(() => {
    const existing = loadOtpTimerState(timerKey);
    if (existing) return existing.otpExpiresAt;
    saveOtpTimerState(timerKey, null, { expirySeconds: 600, cooldownSeconds: 30 });
    return loadOtpTimerState(timerKey)?.otpExpiresAt ?? null;
  });
  const [resendAvailableAt, setResendAvailableAt] = useState<string | null>(() => {
    const existing = loadOtpTimerState(timerKey);
    return existing?.resendAvailableAt ?? null;
  });
  const [expiryTime, setExpiryTime] = useState<number>(() =>
    computeSecondsRemaining(loadOtpTimerState(timerKey)?.otpExpiresAt, 600),
  );
  const [resendCooldown, setResendCooldown] = useState<number>(() =>
    computeSecondsRemaining(loadOtpTimerState(timerKey)?.resendAvailableAt, 30),
  );

  useEffect(() => {
    const vid =
      searchParams.get("verification_id") ||
      searchParams.get("verificationId") ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("ofc360_pending_verification_id") ||
          window.sessionStorage?.getItem("ofc360_pending_verification_temp_token")
        : null);
    if (vid && vid !== verificationId) {
      setVerificationId(vid);
    }
  }, [searchParams, verificationId]);

  useEffect(() => {
    const saved = loadOtpTimerState(timerKey);
    if (saved) {
      setOtpExpiresAt(saved.otpExpiresAt);
      setResendAvailableAt(saved.resendAvailableAt);
      setExpiryTime(saved.expirySeconds);
      setResendCooldown(saved.resendSeconds);
    } else {
      saveOtpTimerState(timerKey, null, { expirySeconds: 600, cooldownSeconds: 30 });
      const created = loadOtpTimerState(timerKey);
      if (created) {
        setOtpExpiresAt(created.otpExpiresAt);
        setResendAvailableAt(created.resendAvailableAt);
        setExpiryTime(created.expirySeconds);
        setResendCooldown(created.resendSeconds);
      }
    }
  }, [timerKey]);

  // Automatic backend-authoritative redirection for already verified users or missing context
  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (ws.user?.emailVerified) {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect") || params.get("callbackUrl");
      const dest = redirectParam ? getSafeRedirectUrl(redirectParam, ws.user) : getDefaultDashboardPath(ws.user);
      navigate({ to: dest as any, replace: true });
      return;
    }

    if (!effectiveEmail && !verificationId && !ws.user) {
      navigate({ to: "/login", replace: true });
    }
  }, [authReady, ws.isRestoring, ws.user, effectiveEmail, verificationId, navigate]);

  // Wall-clock synchronized OTP expiry & resend cooldown tick (survives browser refresh accurately)
  useEffect(() => {
    if (!otpExpiresAt && !resendAvailableAt) return;

    const tick = () => {
      if (otpExpiresAt) {
        setExpiryTime(computeSecondsRemaining(otpExpiresAt, 0));
      }
      if (resendAvailableAt) {
        setResendCooldown(computeSecondsRemaining(resendAvailableAt, 0));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt, resendAvailableAt]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (ws.isRestoring || !authReady) {
    return <AuthLoadingScreen />;
  }

  if (ws.user?.emailVerified) {
    return <AuthLoadingScreen />;
  }

  const normalizedDigits = code.replace(/\D/g, "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || resending) return;

    if (normalizedDigits.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const vid =
        verificationId ||
        (typeof window !== "undefined"
          ? window.sessionStorage?.getItem("ofc360_pending_verification_id") ||
            window.sessionStorage?.getItem("ofc360_pending_verification_temp_token")
          : null);

      let response: any;

      if (vid) {
        response = await authService.verifyLoginOtp({
          verification_id: vid,
          otp: normalizedDigits,
        });
      } else {
        if (!effectiveEmail) {
          setError("Verification session expired. Please sign in again.");
          setLoading(false);
          return;
        }
        response = await authService.verifyEmail({
          email: effectiveEmail,
          otp: normalizedDigits,
        });
      }

      const isSuccess = Boolean(
        response?.data?.success ??
          response?.success ??
          response?.access_token ??
          response?.data?.access_token ??
          (response && !response?.error && response?.status !== "error"),
      );
      const message = response?.data?.message || response?.message;

      if (!isSuccess) {
        setError(message || "Verification failed");
        return;
      }

      clearOtpTimerState(timerKey);
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect") || params.get("callbackUrl");

      const loginResult = parseLoginResponse(response, effectiveEmail);
      if (loginResult?.status === "authenticated") {
        persistAuthSession(loginResult.user, { accessToken: loginResult.accessToken });
        setSuccess(true);
        toast.success(message || "Email verified successfully!");
        clearVerificationStorage();

        const currentUser = aurix.get().user || loginResult.user;
        const destination = resolveTargetRoute(currentUser, redirectParam);
        navigate({ to: destination as any });
        return;
      }

      // If client already holds a valid backend token, refresh /auth/me to confirm backend verification status
      if (hasValidAccessToken()) {
        try {
          await bootstrapAuth({ force: true });
        } catch {
          /* ignore */
        }
        const refreshedUser = aurix.get().user;
        if (refreshedUser?.emailVerified) {
          setSuccess(true);
          toast.success(message || "Email verified successfully!");
          clearVerificationStorage();
          const destination = resolveTargetRoute(refreshedUser, redirectParam);
          navigate({ to: destination as any });
          return;
        }
      }

      // Verification succeeded in DB without returning session tokens; require explicit sign-in rather than forging client auth
      setSuccess(true);
      clearVerificationStorage();
      toast.success(message || "Email verified successfully. Please sign in to continue.");
      navigate({ to: "/login", replace: true });
    } catch (err: unknown) {
      const apiErr = err as { code?: string; data?: { code?: string }; message?: string } | null | undefined;
      const errCode = apiErr?.code ?? apiErr?.data?.code;
      const message =
        err instanceof Error ? err.message : apiErr?.message || "Incorrect or expired code";

      const isAlreadyVerified =
        errCode === "EMAIL_ALREADY_VERIFIED" ||
        (typeof message === "string" &&
          (message.toLowerCase().includes("already verified") ||
            message.toLowerCase().includes("already active")));

      if (isAlreadyVerified) {
        clearOtpTimerState(timerKey);
        if (hasValidAccessToken()) {
          try {
            await bootstrapAuth({ force: true });
          } catch {
            /* ignore */
          }
          const verifiedUser = aurix.get().user;
          if (verifiedUser?.emailVerified) {
            clearVerificationStorage();
            toast.info("Your email is already verified.");
            navigate({ to: getDefaultDashboardPath(verifiedUser) as any, replace: true });
            return;
          }
        }

        clearVerificationStorage();
        toast.info("Your email is already verified. Please sign in.");
        navigate({ to: "/login", replace: true });
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (resending || loading || resendCooldown > 0) return;

    if (!effectiveEmail && !verificationId) {
      toast.error("Verification session missing. Please return to sign in.");
      return;
    }

    setResending(true);
    setError(null);
    try {
      const vid =
        verificationId ||
        (typeof window !== "undefined"
          ? window.sessionStorage?.getItem("ofc360_pending_verification_id") ||
            window.sessionStorage?.getItem("ofc360_pending_verification_temp_token")
          : null);

      let response: any;
      if (isLoginMode && vid) {
        response = await authService.resendLoginOtp({
          verification_id: vid,
          email: effectiveEmail,
        });
      } else {
        response = await authService.resendOtp({ email: effectiveEmail });
      }

      const isSuccess = Boolean(response?.data?.success ?? response?.success ?? true);
      const message = response?.data?.message || response?.message;

      if (isSuccess) {
        const newVid = response?.data?.verification_id ?? response?.verification_id ?? vid;
        if (newVid && newVid !== verificationId) {
          setVerificationId(newVid);
          try {
            window.sessionStorage?.setItem("ofc360_pending_verification_temp_token", newVid);
            window.sessionStorage?.setItem("ofc360_pending_verification_id", newVid);
          } catch {
            /* ignore */
          }
        }

        const nextKey = buildOtpTimerKey(effectiveEmail, newVid);
        const meta = extractOtpMeta(response);
        saveOtpTimerState(nextKey, meta, { expirySeconds: 600, cooldownSeconds: 30 });
        const nextTimers = loadOtpTimerState(nextKey);
        if (nextTimers) {
          setOtpExpiresAt(nextTimers.otpExpiresAt);
          setResendAvailableAt(nextTimers.resendAvailableAt);
          setExpiryTime(nextTimers.expirySeconds);
          setResendCooldown(nextTimers.resendSeconds);
        }

        setCode("");
        toast.success(message || "New OTP sent successfully.");
      } else {
        toast.error(message || "Failed to resend code");
      }
    } catch (err: unknown) {
      const apiErr = err as { code?: string; data?: { code?: string }; message?: string } | null | undefined;
      const errCode = apiErr?.code ?? apiErr?.data?.code;
      const message = err instanceof Error ? err.message : apiErr?.message || "Please try again later.";

      if (errCode === "EMAIL_ALREADY_VERIFIED" || message.toLowerCase().includes("already verified")) {
        clearOtpTimerState(timerKey);
        clearVerificationStorage();
        toast.info("Your email is already verified. Please sign in.");
        navigate({ to: "/login", replace: true });
        return;
      }

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
        <>
          Want to use a different account?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(val) => {
              const sanitized = val.replace(/\D/g, "").slice(0, 6);
              setCode(sanitized);
              if (error) setError(null);
            }}
            inputMode="numeric"
            pattern="^[0-9]*$"
            autoFocus
            autoComplete="one-time-code"
            aria-label="Six-digit verification code"
            disabled={loading}
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-11 w-11 text-base font-medium" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error ? (
          <p role="alert" className="text-center text-xs text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || resending || normalizedDigits.length !== 6}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Verify and continue
        </Button>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {expiryTime > 0 ? `Code expires in ${formatTime(expiryTime)}` : "Code expired"}
          </span>
          <button
            type="button"
            onClick={resend}
            disabled={resendCooldown > 0 || resending || loading}
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {resending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
