import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { getApiResponseMessage, parseLoginResponse } from "@/features/auth/utils/parseLoginResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { aurix, rememberStore } from "@/lib/aurix-store";
import { persistAuthSession, useAuthReady } from "@/lib/auth-bootstrap";
import { getSafeRedirectUrl } from "@/lib/role-routing";
import { normalizeRole } from "@/lib/roles";
import { authService, hasValidAccessToken } from "@/api";
import { getErrorMessage } from "@/api/utils";
import {
  documentVerificationApi,
  isDigiLockerVerificationEnabled,
} from "@/services/documentVerificationApi";
import { syncVerifiedStatusToStore } from "@/hooks/useDocumentVerification";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function formatLoginError(message: string) {
  return message === "Invalid email or password." ? "Invalid email or password" : message;
}

export function LoginPage() {
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = rememberStore.get();
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      if (remember) rememberStore.set(email);
      else rememberStore.clear();

      const res = await authService.login({
        identifier: email,
        password,
      });
      const login = parseLoginResponse(res, email);
      if (login?.status === "authenticated") {
        const { accessToken, refreshToken, user } = login;
        if (user.company_name && user.company_name !== "Workspace") {
          try {
            window.sessionStorage?.setItem("ofc360_registered_company_name", user.company_name);
            window.localStorage?.setItem("ofc360_registered_company_name", user.company_name);
            window.sessionStorage?.setItem("company_name", user.company_name);
            window.localStorage?.setItem("company_name", user.company_name);
          } catch {
            /* ignore */
          }
        }
        persistAuthSession(user, { accessToken, refreshToken });
        toast.success(`Welcome back, ${user.name}!`);

        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect") || params.get("callbackUrl");
        const destination = getSafeRedirectUrl(redirectParam, user);

        if (isDigiLockerVerificationEnabled() && normalizeRole(user.role) === "employee") {
          const explicitStatus =
            user.documentVerificationStatus || user.document_verification_status;
          const explicitVerifiedBool =
            typeof user.documentsVerified === "boolean"
              ? user.documentsVerified
              : typeof user.documents_verified === "boolean"
                ? user.documents_verified
                : undefined;

          if (explicitStatus === "VERIFIED" || explicitVerifiedBool === true) {
            syncVerifiedStatusToStore(
              "VERIFIED",
              user.documentsVerifiedAt || user.documents_verified_at,
            );
            navigate({ to: destination as any });
            return;
          }

          if (explicitStatus && explicitStatus !== "VERIFIED") {
            syncVerifiedStatusToStore(explicitStatus);
            navigate({
              to: "/verify-documents" as any,
              search: redirectParam ? ({ redirect: destination } as any) : undefined,
            });
            return;
          }

          if (explicitVerifiedBool === false) {
            syncVerifiedStatusToStore("NOT_STARTED");
            navigate({
              to: "/verify-documents" as any,
              search: redirectParam ? ({ redirect: destination } as any) : undefined,
            });
            return;
          }

          try {
            const statusRes = await documentVerificationApi.getStatus();
            syncVerifiedStatusToStore(statusRes.status, statusRes.verifiedAt);
            if (statusRes.status === "VERIFIED") {
              navigate({ to: destination as any });
              return;
            }
          } catch {
            // If status cannot be confirmed as VERIFIED, route employee to /verify-documents
          }

          navigate({
            to: "/verify-documents" as any,
            search: redirectParam ? ({ redirect: destination } as any) : undefined,
          });
          return;
        }

        navigate({ to: destination as any });
        return;
      }

      if (login?.status === "verification_required") {
        const targetEmail = login.email || email;
        const msg = login.message || "Verification code sent to your email. Please verify to continue.";
        toast.info(msg);

        const vid = login.verificationId || login.tempToken;
        try {
          if (typeof window !== "undefined") {
            window.sessionStorage?.removeItem("ofc360_email_verified");
            window.localStorage?.removeItem("ofc360_email_verified");
            window.sessionStorage?.setItem("ofc360_pending_verification_email", targetEmail);
            window.sessionStorage?.setItem("ofc360_pending_verification_password", password);
            window.sessionStorage?.setItem("ofc360_pending_verification_mode", "login");
            window.sessionStorage?.setItem(
              "aurix_pending_auth",
              JSON.stringify({ email: targetEmail, password }),
            );
            if (login.userId) {
              window.sessionStorage?.setItem("ofc360_pending_verification_user_id", String(login.userId));
            }
            if (vid) {
              window.sessionStorage?.setItem("ofc360_pending_verification_temp_token", vid);
              window.sessionStorage?.setItem("ofc360_pending_verification_id", vid);
            }
          }
        } catch {
          // ignore sessionStorage write errors
        }

        const existingUser = aurix.get().user;
        aurix.set({
          user: {
            id: login.userId || existingUser?.id || "",
            fullName: existingUser?.fullName || "",
            email: targetEmail,
            phone: existingUser?.phone || "",
            role: existingUser?.role || "hr_admin",
            companyId: existingUser?.companyId || "workspace",
            emailVerified: false,
            onboardingComplete: existingUser?.onboardingComplete ?? false,
            createdAt: existingUser?.createdAt || new Date().toISOString(),
          },
        });

        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect") || params.get("callbackUrl");

        const searchParams = new URLSearchParams();
        searchParams.set("email", targetEmail);
        searchParams.set("mode", "login");
        if (login.userId) searchParams.set("userId", String(login.userId));
        if (vid) searchParams.set("verification_id", vid);
        if (redirectParam) searchParams.set("redirect", redirectParam);

        navigate({
          to: (`/verify-email?${searchParams.toString()}`) as any,
          search: {
            email: targetEmail,
            mode: "login",
            ...(vid ? { verification_id: vid } : {}),
            ...(redirectParam ? { redirect: redirectParam } : {}),
          } as any,
        });
        return;
      }

      toast.error(formatLoginError(getApiResponseMessage(res)));
    } catch (err: unknown) {
      toast.error(formatLoginError(getErrorMessage(err, "Server error")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your OFC360 workspace"
      footer={
        <>
          New to OFC360?{" "}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create a workspace
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
          Remember me on this device
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign in
        </Button>

        <div className="mt-4 rounded-xl border border-border/70 bg-muted/30 p-3 text-xs space-y-2">
          <div className="font-semibold text-foreground">Demo Login Credentials (Click to fill):</div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail("employee@aurix.ai");
                setPassword("Employee@123");
                setErrors({});
              }}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-left hover:bg-accent transition-colors cursor-pointer"
            >
              <span className="font-medium text-foreground">Employee Portal</span>
              <span className="font-mono text-[11px] text-muted-foreground">employee@aurix.ai / Employee@123</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("hr@aurix.ai");
                setPassword("Admin@123");
                setErrors({});
              }}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-left hover:bg-accent transition-colors cursor-pointer"
            >
              <span className="font-medium text-foreground">HR Admin</span>
              <span className="font-mono text-[11px] text-muted-foreground">hr@aurix.ai / Admin@123</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("manager@aurix.ai");
                setPassword("Manager@123");
                setErrors({});
              }}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-left hover:bg-accent transition-colors cursor-pointer"
            >
              <span className="font-medium text-foreground">Manager Portal</span>
              <span className="font-mono text-[11px] text-muted-foreground">manager@aurix.ai / Manager@123</span>
            </button>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
