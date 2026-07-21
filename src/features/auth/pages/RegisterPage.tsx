import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { aurix } from "@/lib/aurix-store";
import { api } from "@/api";
import { toast } from "sonner";

const schema = z
  .object({
    fullName: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters")
      .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Name can contain only letters and single spaces"),
    email: z.string().email("Enter a valid work email"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number (e.g. 9876543210)"),
    companyName: z.string().min(2, "Enter your company name"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(64, "At most 64 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[a-z]/, "Include at least one lowercase letter")
      .regex(/[0-9]/, "Include at least one number")
      .regex(/[^A-Za-z0-9]/, "Include at least one special character (e.g. @, #, !)"),
    confirm: z.string(),
    accept: z.boolean(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] })
  .refine((d) => d.accept, { message: "You must accept the terms", path: ["accept"] });

function passwordScore(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirm: "",
    accept: false,
  });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const payload = {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        company_name: form.companyName,
      };
      const res = (await api.post("auth/register", payload)) as any;
console.log("Register response:", res);
      if (res.success) {
        aurix.set({
          user: {
            id: "",
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            role: "admin",
            companyId: "workspace",
            emailVerified: false,
            onboardingComplete: false,
            createdAt: new Date().toISOString(),
          },
          company: {
            id: "workspace",
            name: form.companyName,
          },
        });

        toast.success(res.message || "Registration successful!");
        navigate({ to: "/verify-email" as any });
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err: unknown) {
      const apiErr = err as { data?: { errors?: Array<{ field?: string | null; message: string }> }; message?: string };
      const apiErrors = apiErr?.data?.errors ?? [];
      if (apiErrors.length > 0) {
        const fieldMap: Record<string, string> = {
          name: "fullName",
          company_name: "companyName",
        };
        const fe: Record<string, string> = {};
        apiErrors.forEach(({ field, message }) => {
          if (field) {
            const key = fieldMap[field] ?? field;
            fe[key] = message;
          }
        });
        if (Object.keys(fe).length > 0) setErrors(fe);
        toast.error(apiErrors[0]?.message ?? apiErr.message ?? "Validation failed");
      } else {
        toast.error(apiErr.message || "Registration failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  }

  const score = passwordScore(form.password);
  const scoreLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][score];
  const scoreColor = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"][score];

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="You'll be set up as the Company Admin"
      footer={
        <>
          Already have a workspace?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Jane Cooper"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName ? <p className="text-xs text-destructive">{errors.fullName}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="Acme Corp"
            aria-invalid={!!errors.companyName}
          />
          {errors.companyName ? <p className="text-xs text-destructive">{errors.companyName}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@company.com"
              aria-invalid={!!errors.email}
            />
            {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="9876543210 (10-digit Indian mobile)"
              aria-invalid={!!errors.phone}
              maxLength={10}
            />
            {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
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
          {form.password ? (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${scoreColor}`}
                  style={{ width: `${(score / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{scoreLabel}</span>
            </div>
          ) : null}
          {!form.password && (
            <p className="text-xs text-muted-foreground">
              Must be 8–64 chars with uppercase, lowercase, number &amp; special character (e.g. @, #, !)
            </p>
          )}
          {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            placeholder="••••••••"
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm ? <p className="text-xs text-destructive">{errors.confirm}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={form.accept}
              onCheckedChange={(v) => set("accept", Boolean(v))}
              className="mt-0.5"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-foreground underline-offset-4 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-foreground underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.accept ? <p className="text-xs text-destructive">{errors.accept}</p> : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create workspace
        </Button>
      </form>
    </AuthShell>
  );
}
