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
import { rememberStore } from "@/lib/aurix-store";
import { getPostLoginRoute, persistAuthSession, useAuthReady } from "@/lib/auth-bootstrap";
import { api } from "@/api";
import { getErrorMessage } from "@/api/utils";
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
    if (!authReady) return;
    const workspace = aurix.get();
    if (workspace.user) {
      navigate({ to: getPostLoginRoute(workspace.user as any), replace: true });
    }
  }, [authReady, navigate]);

  useEffect(() => {
    const savedEmail = rememberStore.get();
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  if (!authReady || aurix.get().user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand-foreground" style={{ color: "var(--gradient-brand)" }} />
      </div>
    );
  }

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

      const res = await api.post("auth/login", {
        identifier: email,
        password,
      });
      const login = parseLoginResponse(res);
      if (login) {
        const { accessToken, refreshToken, user } = login;
        persistAuthSession(user, { accessToken, refreshToken });
        toast.success(`Welcome back, ${user.name}!`);
        navigate({ to: getPostLoginRoute(user) });
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
