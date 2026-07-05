import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/aurix/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { aurix, rememberStore } from "@/lib/aurix-store";
import { api, ApiError, setTokens, type LoginResponse } from "@/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Aurix" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function LoginPage() {
  const navigate = useNavigate();
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

  async function onSubmit(e: React.FormEvent) {
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

      const res = await api.post<LoginResponse>("auth/login", {
        identifier: email,
        password: password,
      });

      if (res.success && res.data) {
        const { access_token, refresh_token, user } = res.data;
        
        setTokens({ accessToken: access_token, refreshToken: refresh_token });

        const companyId = user.company_id ? String(user.company_id) : "default";

        aurix.set({
          user: {
            id: String(user.id),
            fullName: user.name,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
            companyId,
            emailVerified: user.is_verified,
            onboardingComplete: user.onboarding_completed ?? false,
            createdAt: new Date().toISOString(),
          },
          company: {
            id: companyId,
            name: user.company_name || user.name,
          },
        });

        toast.success(`Welcome back, ${user.name}!`);

        // Redirect based on user role
        if (!user.is_verified) {
          navigate({ to: "/verify-email" });
        } else if (!user.onboarding_completed) {
          navigate({ to: "/onboarding" });
        } else if (user.role === "manager") {
          navigate({ to: "/dashboard/manager" });
        } else if (user.role === "employee") {
          navigate({ to: "/dashboard/employee" });
        } else {
          navigate({ to: "/dashboard" });
        }
      } else {
        let displayError = "Server error";
        if (res.message === "Invalid email or password.") {
          displayError = "Invalid email or password";
        }
        toast.error(displayError);
      }
    } catch (err: unknown) {
      let displayError = "Server error";
      const apiErr = err instanceof ApiError ? err : null;
      const message = (apiErr?.message || (err instanceof Error ? err.message : "")).toLowerCase();
      if (apiErr?.status === 401) {
        displayError = "Invalid email or password";
      } else if (
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("connection") ||
        message === "network error"
      ) {
        displayError = "Network error";
      } else {
        displayError = "Server error";
      }
      toast.error(displayError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Aurix workspace"
      footer={
        <>
          New to Aurix?{" "}
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
      </form>
    </AuthShell>
  );
}
