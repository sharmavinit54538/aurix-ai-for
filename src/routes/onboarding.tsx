import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Papa from "papaparse";
import { z } from "zod";
import {
  ArrowLeft, ArrowRight, Building2, CheckCircle2, ChevronLeft, Pencil,
  Plus, Sparkles, Trash2, Upload, UserCog, UserPlus, Users, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Stepper } from "@/components/aurix/Stepper";
import { aurix, useAurix, uid, type Employee, type HR, type Manager } from "@/lib/aurix-store";
import { api, setTokens } from "@/api";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Set up your workspace — Aurix" }] }),
  component: OnboardingPage,
});

const STEPS = ["Company", "HR team", "Employees", "Managers", "Review", "Done"];
const INDUSTRIES = ["Software", "Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Other"];
const SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"];
const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function OnboardingPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);

  const { token } = Route.useSearch();
  const [tokenLoading, setTokenLoading] = useState(token ? true : false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [empData, setEmpData] = useState<any>(null);

  // Activation form fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!token) return;
    setTokenLoading(true);
    setTokenError(null);
    api.get(`onboarding/validate?token=${token}`)
      .then((res: any) => {
        if (res.success) {
          setEmpData(res.data);
          setPhone(res.data.phone || "");
        } else {
          setTokenError(res.message || "Invitation expired. Request new invitation.");
        }
      })
      .catch((err: any) => {
        setTokenError(err.message || "Invitation expired. Request new invitation.");
      })
      .finally(() => {
        setTokenLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (token) return; // skip for employee onboarding
    if (!ws.user) {
      navigate({ to: "/register" });
    } else if (!ws.user.emailVerified) {
      navigate({ to: "/verify-email" });
    } else if (ws.user.onboardingComplete) {
      navigate({ to: "/dashboard" });
    }
  }, [ws.user, navigate, token]);

  function next() { setStep((s) => Math.min(STEPS.length - 1, s + 1)); }
  function back() { setStep((s) => Math.max(0, s - 1)); }
  function goto(i: number) { setStep(i); }

  async function finish() {
    setLoading(true);
    try {
      // 1. Post HR Settings
      const hrSettings = {
        working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        week_start_day: "Monday",
        office_timing: "09:00 - 18:00",
        default_shift: "General Shift",
        time_format: "12h",
        date_format: "YYYY-MM-DD",
        financial_year: "2026-2027",
        leave_policy_template: "Standard Template"
      };
      await api.post("onboarding/hr-settings", hrSettings);

      // 2. Extrapolate and Post Departments
      const deptNames = Array.from(new Set([
        "Management",
        ...ws.hrs.map(h => h.department),
        ...ws.employees.map(e => e.department),
        ...ws.managers.map(m => m.department)
      ].filter(Boolean)));
      
      const depts = deptNames.map((d, index) => ({
        department_code: d.substring(0, 3).toUpperCase() + "_" + (10 + index),
        department_name: d,
        description: `Department for ${d}`
      }));
      await api.post("onboarding/departments", { departments: depts });

      // 3. Extrapolate and Post Designations
      const designations = Array.from(new Set([
        "Company Owner",
        ...ws.hrs.map(h => h.designation),
        ...ws.employees.map(e => e.designation),
        ...ws.managers.map(m => m.designation)
      ].filter(Boolean)));
      await api.post("onboarding/designations", { designations });

      // 4. Extrapolate and Post Invite Employees
      const allInvites = [
        ...ws.hrs.map(h => {
           const parts = h.fullName.split(" ");
           return {
             first_name: parts[0] || "HR",
             last_name: parts.slice(1).join(" ") || "Member",
             personal_email: h.email,
             phone: h.phone || "9876543210",
             department: h.department || "Human Resources",
             designation: h.designation || "HR Specialist"
           };
        }),
        ...ws.employees.map(e => {
           const parts = e.fullName.split(" ");
           return {
             first_name: parts[0] || "Employee",
             last_name: parts.slice(1).join(" ") || "Member",
             personal_email: e.email,
             phone: e.phone || "9876543210",
             department: e.department || "Engineering",
             designation: e.designation || "Software Engineer"
           };
        }),
        ...ws.managers.map(m => {
           const parts = m.fullName.split(" ");
           return {
             first_name: parts[0] || "Manager",
             last_name: parts.slice(1).join(" ") || "Member",
             personal_email: m.email,
             phone: m.phone || "9876543210",
             department: m.department || "Management",
             designation: m.designation || "Team Manager"
           };
        })
      ].filter(x => x.personal_email && x.first_name);

      // Clean phone numbers to exactly 10 digits
      allInvites.forEach(inv => {
        const cleanPhone = inv.phone.replace(/\D/g, "");
        inv.phone = cleanPhone.length >= 10 ? cleanPhone.substring(0, 10) : "9876543210";
      });

      if (allInvites.length > 0) {
        await api.post("onboarding/invite-employees", { employees: allInvites, skip: false });
      } else {
        await api.post("onboarding/invite-employees", { employees: [], skip: true });
      }

      // 5. Complete Onboarding Flow
      await api.post("onboarding/complete");

      if (ws.user) {
        aurix.set({ user: { ...ws.user, onboardingComplete: true } });
      }
      setStep(5);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (token) {
    if (tokenLoading) {
      return (
        <div className="relative min-h-screen flex items-center justify-center bg-background">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Validating your invitation...</p>
          </div>
        </div>
      );
    }

    if (tokenError) {
      return (
        <div className="relative min-h-screen flex items-center justify-center bg-background p-6">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <div className="max-w-md w-full rounded-2xl border border-border bg-card/70 p-8 text-center shadow-elegant backdrop-blur-xl">
            <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Invitation Expired</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Invitation expired. Request new invitation.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate({ to: "/login" })} className="w-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (empData) {
      const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
          return toast.error("Password is required");
        }
        if (password.length < 8) {
          return toast.error("Password must be at least 8 characters long");
        }
        if (!/[A-Z]/.test(password)) {
          return toast.error("Password must contain at least 1 uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
          return toast.error("Password must contain at least 1 lowercase letter");
        }
        if (!/[0-9]/.test(password)) {
          return toast.error("Password must contain at least 1 number");
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
          return toast.error("Password must contain at least 1 special character");
        }
        if (password !== confirmPassword) {
          return toast.error("Passwords do not match");
        }
        if (!acceptPolicies) {
          return toast.error("You must accept the company policies and terms of service");
        }

        setActivating(true);
        try {
          const res: any = await api.post("onboarding/activate", {
            token,
            password,
            phone,
            emergency_contact_name: emergencyName || null,
            emergency_contact_phone: emergencyPhone || null,
            profile_photo_url: profilePhoto || null,
          });

          if (res.success) {
            toast.success("Account activated successfully! Logging you in...");
            // Save user to aurix store
            if (res.data?.user) {
              aurix.set({ user: res.data.user });
            }
            // Save tokens via API client (correct storage key)
            if (res.data?.access_token && res.data?.refresh_token) {
              setTokens({
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
              });
            }
            // Redirect based on role — default to /dashboard/employee for employees
            const role = res.data?.user?.role;
            setTimeout(() => {
              if (role === "admin" || role === "hr") {
                navigate({ to: "/dashboard" });
              } else if (role === "manager") {
                navigate({ to: "/dashboard/manager" });
              } else {
                navigate({ to: "/dashboard/employee" });
              }
            }, 1000);
          } else {
            toast.error(res.message || "Failed to activate account. Please try again.");
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to activate account. Please try again.");
        } finally {
          setActivating(false);
        }
      };

      return (
        <div className="relative min-h-screen overflow-hidden bg-background">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <header className="flex items-center justify-between px-6 py-5 sm:px-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">Aurix</span>
            </Link>
            <span className="text-xs text-muted-foreground">Account Setup</span>
          </header>

          <div className="mx-auto max-w-2xl px-6 pb-16 sm:px-10">
            <div className="rounded-2xl border bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8" style={{ borderColor: "var(--glass-border)" }}>
              <div className="mb-6 flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight">Complete Your Account Setup</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Welcome! Please fill in the details below to activate your employee profile.</p>
                </div>
              </div>

              <form onSubmit={handleActivate} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Employee ID</Label>
                    <Input value={empData.employee_id} readOnly disabled className="bg-muted/50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input value={`${empData.first_name} ${empData.last_name}`} readOnly disabled className="bg-muted/50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Email</Label>
                    <Input value={empData.personal_email} readOnly disabled className="bg-muted/50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Department</Label>
                    <Input value={empData.department} readOnly disabled className="bg-muted/50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Designation</Label>
                    <Input value={empData.designation} readOnly disabled className="bg-muted/50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Joining Date</Label>
                    <Input value={empData.joining_date} readOnly disabled className="bg-muted/50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" required />
                  </div>

                  <div className="border-t border-border sm:col-span-2 my-2" />

                  <div className="space-y-1.5">
                    <Label className="text-xs">Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required />
                    <p className="text-[11px] text-muted-foreground">
                      Min 8 chars · 1 uppercase · 1 lowercase · 1 number · 1 special character
                    </p>
                    {password && (
                      <div className="flex gap-1 mt-1">
                        {[
                          password.length >= 8,
                          /[A-Z]/.test(password),
                          /[a-z]/.test(password),
                          /[0-9]/.test(password),
                          /[^A-Za-z0-9]/.test(password),
                        ].map((ok, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${ok ? "bg-emerald-500" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Confirm Password</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Verify your password" required />
                    {confirmPassword && (
                      <p className={`text-[11px] ${password === confirmPassword ? "text-emerald-500" : "text-destructive"}`}>
                        {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-border sm:col-span-2 my-2" />
                  <h3 className="text-sm font-medium sm:col-span-2">Additional Information (Optional)</h3>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Profile Photo URL</Label>
                    <Input value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} placeholder="https://example.com/photo.jpg" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Emergency Contact Name</Label>
                    <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Contact Name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Emergency Contact Phone</Label>
                    <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="Contact Phone" />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 mt-4">
                  <Checkbox id="terms" checked={acceptPolicies} onCheckedChange={(checked) => setAcceptPolicies(checked === true)} />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
                    I accept the company policies, code of conduct, and employee terms of service.
                  </Label>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={activating} className="w-full sm:w-auto">
                    {activating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Activate Account & Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Aurix</span>
        </Link>
        <span className="text-xs text-muted-foreground">Step {Math.min(step + 1, 5)} of 5</span>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-16 sm:px-10">
        <div className="mb-8 flex justify-center">
          <Stepper steps={STEPS.slice(0, 5)} current={Math.min(step, 4)} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 0 ? <CompanyStep onNext={next} /> : null}
            {step === 1 ? <HRStep onNext={next} onBack={back} /> : null}
            {step === 2 ? <EmployeesStep onNext={next} onBack={back} /> : null}
            {step === 3 ? <ManagersStep onNext={next} onBack={back} /> : null}
            {step === 4 ? <ReviewStep onBack={back} onFinish={finish} onEdit={goto} loading={loading} /> : null}
            {step === 5 ? <SuccessStep /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepCard({ title, description, icon: Icon, children, footer }: {
  title: string; description?: string; icon: any; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8" style={{ borderColor: "var(--glass-border)" }}>
      <div className="mb-6 flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {children}
      {footer ? <div className="mt-8 flex items-center justify-between border-t border-border pt-6">{footer}</div> : null}
    </div>
  );
}

/* ---------------- Step 1: Company ---------------- */

function CompanyStep({ onNext }: { onNext: () => void }) {
  const ws = useAurix();
  const [c, setC] = useState(ws.company ?? { id: uid("co"), name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof c>(k: K, v: any) { setC((p) => ({ ...p, [k]: v })); }

  function onLogo(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submit() {
    const fe: Record<string, string> = {};
    if (!c.name) fe.name = "Required";
    if (!c.industry) fe.industry = "Required";
    if (!c.size) fe.size = "Required";
    if (!c.email) fe.email = "Required";
    if (!c.country) fe.country = "Required";
    if (Object.keys(fe).length) { setErrors(fe); return; }
    
    setLoading(true);
    try {
      // 1. Submit company profile
      const companyPayload = {
        company_name: c.name,
        company_logo: c.logoDataUrl || null,
        industry: c.industry || "Software",
        company_size: c.size || "11–50",
        country: c.country || "USA",
        state: c.state || null,
        city: c.city || null,
        timezone: c.timezone || "UTC",
        currency: "USD"
      };
      await api.post("onboarding/company", companyPayload);

      // 2. Submit admin profile
      const nameParts = ws.user?.fullName?.split(" ") || [];
      const firstName = nameParts[0] || "Admin";
      const lastName = nameParts.slice(1).join(" ") || "User";
      
      let cleanPhone = (ws.user?.phone || "").replace(/\D/g, "");
      const adminPayload = {
        first_name: firstName,
        last_name: lastName,
        profile_photo: null,
        mobile_number: cleanPhone.length >= 10 ? cleanPhone.substring(0, 10) : "9876543210",
        designation: "Company Owner",
        preferred_language: "English"
      };
      await api.post("onboarding/admin-profile", adminPayload);

      aurix.set({ company: c });
      onNext();
    } catch (err: any) {
      toast.error(err.message || "Failed to save company details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StepCard
      title="Tell us about your company"
      description="This sets up your workspace identity. You can edit any of it later."
      icon={Building2}
      footer={
        <>
          <span />
          <Button onClick={submit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue
            {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Company logo</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl border border-border bg-muted text-muted-foreground">
              {c.logoDataUrl ? <img src={c.logoDataUrl} alt="Logo" className="h-full w-full object-cover" /> : <Building2 className="h-6 w-6" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
              <Upload className="h-4 w-4" />
              Upload logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onLogo(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        </div>

        <Field label="Company name" error={errors.name}>
          <Input value={c.name} onChange={(e) => set("name", e.target.value)} placeholder="Aurix, Inc." />
        </Field>
        <Field label="Industry" error={errors.industry}>
          <Select value={c.industry} onValueChange={(v) => set("industry", v)}>
            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Company size" error={errors.size}>
          <Select value={c.size} onValueChange={(v) => set("size", v)}>
            <SelectTrigger><SelectValue placeholder="Number of employees" /></SelectTrigger>
            <SelectContent>{SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Website"><Input value={c.website ?? ""} onChange={(e) => set("website", e.target.value)} placeholder="https://aurix.com" /></Field>
        <Field label="Company email" error={errors.email}>
          <Input type="email" value={c.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="hello@aurix.com" />
        </Field>
        <Field label="Company phone"><Input value={c.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 0100" /></Field>
        <div className="sm:col-span-2">
          <Field label="Address"><Textarea rows={2} value={c.address ?? ""} onChange={(e) => set("address", e.target.value)} placeholder="Street, building, suite" /></Field>
        </div>
        <Field label="City"><Input value={c.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Field>
        <Field label="State / Region"><Input value={c.state ?? ""} onChange={(e) => set("state", e.target.value)} /></Field>
        <Field label="Country" error={errors.country}><Input value={c.country ?? ""} onChange={(e) => set("country", e.target.value)} /></Field>
        <Field label="Timezone">
          <Select value={c.timezone} onValueChange={(v) => set("timezone", v)}>
            <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
            <SelectContent>{TIMEZONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>
    </StepCard>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

/* ---------------- Step 2: HR ---------------- */

function HRStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const ws = useAurix();
  const [hrs, setHrs] = useState<HR[]>(ws.hrs);
  const [draft, setDraft] = useState<HR>(blankHr());
  const [editing, setEditing] = useState<string | null>(null);

  function blankHr(): HR { return { id: uid("hr"), fullName: "", email: "", phone: "", department: "", designation: "" }; }

  function add() {
    if (!draft.fullName || !draft.email) { toast.error("HR name and email required"); return; }
    if (editing) setHrs((arr) => arr.map((h) => (h.id === editing ? draft : h)));
    else setHrs((arr) => [...arr, draft]);
    setDraft(blankHr()); setEditing(null);
  }

  function save() { aurix.set({ hrs }); onNext(); }

  return (
    <StepCard
      title="Add your HR team"
      description="HRs can manage employees, attendance, and onboarding."
      icon={UserCog}
      footer={
        <>
          <Button variant="ghost" onClick={onBack}><ChevronLeft className="mr-2 h-4 w-4" />Back</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={save}>Skip for now</Button>
            <Button onClick={save} disabled={hrs.length === 0}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name"><Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} /></Field>
        <Field label="Work email"><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
        <Field label="Phone"><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
        <Field label="Department"><Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} placeholder="People Ops" /></Field>
        <div className="sm:col-span-2">
          <Field label="Designation"><Input value={draft.designation} onChange={(e) => setDraft({ ...draft, designation: e.target.value })} placeholder="HR Business Partner" /></Field>
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button onClick={add} variant="outline"><Plus className="mr-2 h-4 w-4" />{editing ? "Save changes" : "Add HR"}</Button>
        </div>
      </div>

      {hrs.length ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-2.5">Name</th><th className="px-4 py-2.5">Email</th><th className="px-4 py-2.5">Department</th><th className="px-4 py-2.5">Designation</th><th className="px-4 py-2.5"></th></tr>
            </thead>
            <tbody>
              {hrs.map((h) => (
                <tr key={h.id} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">{h.fullName}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{h.email}</td>
                  <td className="px-4 py-2.5">{h.department || "—"}</td>
                  <td className="px-4 py-2.5">{h.designation || "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => { setDraft(h); setEditing(h.id); }} className="mr-1 rounded p-1.5 text-muted-foreground hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setHrs((arr) => arr.filter((x) => x.id !== h.id))} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyHint text="No HRs yet. Add at least one to manage employees." />
      )}
    </StepCard>
  );
}

/* ---------------- Step 3: Employees ---------------- */

function EmployeesStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const ws = useAurix();
  const [employees, setEmployees] = useState<Employee[]>(ws.employees);
  const [tab, setTab] = useState<"manual" | "import">("manual");
  const [draft, setDraft] = useState<Employee>(blankEmp());
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState<Employee[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function blankEmp(): Employee {
    return { id: uid("emp"), employeeId: "", fullName: "", email: "", phone: "", department: "", designation: "", joiningDate: "", managerName: "", shift: "General" };
  }

  function add() {
    if (!draft.fullName || !draft.email) { toast.error("Name and email required"); return; }
    if (editing) setEmployees((arr) => arr.map((e) => (e.id === editing ? draft : e)));
    else setEmployees((arr) => [...arr, draft]);
    setDraft(blankEmp()); setEditing(null);
  }

  function save() { aurix.set({ employees }); onNext(); }

  function onFile(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const errs: string[] = [];
        const rows: Employee[] = res.data.map((r, idx) => {
          const fullName = r["Full Name"] || r["full_name"] || r["name"] || "";
          const email = r["Email"] || r["email"] || "";
          if (!fullName || !email) errs.push(`Row ${idx + 2}: missing name or email`);
          return {
            id: uid("emp"),
            employeeId: r["Employee ID"] || r["employee_id"] || "",
            fullName, email,
            phone: r["Phone Number"] || r["phone"] || "",
            department: r["Department"] || "",
            designation: r["Designation"] || "",
            joiningDate: r["Joining Date"] || "",
            managerName: r["Manager Name"] || "",
            shift: r["Shift"] || "General",
          };
        });
        setPreview(rows); setErrors(errs);
      },
    });
  }

  function confirmImport() {
    if (!preview) return;
    setEmployees((arr) => [...arr, ...preview]);
    toast.success(`${preview.length} employees imported`, { description: errors.length ? `${errors.length} rows had warnings` : undefined });
    setPreview(null); setErrors([]);
  }

  return (
    <StepCard
      title="Add your employees"
      description="Import via CSV or add them one by one — you can always do more later."
      icon={Users}
      footer={
        <>
          <Button variant="ghost" onClick={onBack}><ChevronLeft className="mr-2 h-4 w-4" />Back</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={save}>Skip for now</Button>
            <Button onClick={save}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </>
      }
    >
      <div className="mb-6 inline-flex rounded-lg border border-border bg-muted/40 p-1">
        {(["manual", "import"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "manual" ? "Manual entry" : "CSV / Excel import"}
          </button>
        ))}
      </div>

      {tab === "manual" ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Employee ID"><Input value={draft.employeeId} onChange={(e) => setDraft({ ...draft, employeeId: e.target.value })} placeholder="EMP-001" /></Field>
            <Field label="Full name"><Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
            <Field label="Phone"><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
            <Field label="Department"><Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} /></Field>
            <Field label="Designation"><Input value={draft.designation} onChange={(e) => setDraft({ ...draft, designation: e.target.value })} /></Field>
            <Field label="Joining date"><Input type="date" value={draft.joiningDate} onChange={(e) => setDraft({ ...draft, joiningDate: e.target.value })} /></Field>
            <Field label="Shift">
              <Select value={draft.shift} onValueChange={(v) => setDraft({ ...draft, shift: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["General", "Morning", "Evening", "Night"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <div className="flex items-end"><Button onClick={add} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" />{editing ? "Save" : "Add employee"}</Button></div>
          </div>
        </>
      ) : (
        <div>
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:bg-muted/40">
            <Upload className="mb-3 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Drop a CSV file here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Columns: Employee ID, Full Name, Email, Phone Number, Department, Designation, Joining Date, Manager Name, Shift</p>
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>

          {preview ? (
            <div className="mt-5 rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="text-sm">
                  <span className="font-medium">{preview.length} rows ready</span>{" "}
                  {errors.length ? <span className="text-destructive">· {errors.length} warnings</span> : null}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setPreview(null); setErrors([]); }}>Cancel</Button>
                  <Button size="sm" onClick={confirmImport}>Import all</Button>
                </div>
              </div>
              <div className="max-h-64 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr><th className="px-3 py-2">ID</th><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Dept</th></tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 50).map((e) => (
                      <tr key={e.id} className="border-t border-border">
                        <td className="px-3 py-1.5">{e.employeeId || "—"}</td>
                        <td className="px-3 py-1.5">{e.fullName}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{e.email}</td>
                        <td className="px-3 py-1.5">{e.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {errors.length ? (
                <div className="border-t border-border bg-destructive/5 px-4 py-2 text-xs text-destructive">
                  {errors.slice(0, 5).join(" · ")}{errors.length > 5 ? ` · +${errors.length - 5} more` : ""}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      {employees.length ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h3 className="text-sm font-medium">{employees.length} employees added</h3>
          </div>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Dept</th><th className="px-4 py-2">Shift</th><th></th></tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-t border-border">
                    <td className="px-4 py-2">{e.employeeId || "—"}</td>
                    <td className="px-4 py-2 font-medium">{e.fullName}</td>
                    <td className="px-4 py-2 text-muted-foreground">{e.email}</td>
                    <td className="px-4 py-2">{e.department || "—"}</td>
                    <td className="px-4 py-2">{e.shift}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => { setDraft(e); setEditing(e.id); setTab("manual"); }} className="mr-1 rounded p-1.5 text-muted-foreground hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setEmployees((arr) => arr.filter((x) => x.id !== e.id))} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </StepCard>
  );
}

/* ---------------- Step 4: Managers ---------------- */

function ManagersStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const ws = useAurix();
  const [managers, setManagers] = useState<Manager[]>(ws.managers);
  const [draft, setDraft] = useState<Manager>(blank());
  const [editing, setEditing] = useState<string | null>(null);

  function blank(): Manager {
    return { id: uid("mgr"), fullName: "", email: "", phone: "", department: "", designation: "", team: [], shiftStart: "09:00", shiftEnd: "18:00", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] };
  }

  function add() {
    if (!draft.fullName || !draft.email) { toast.error("Manager name and email required"); return; }
    if (editing) setManagers((arr) => arr.map((m) => (m.id === editing ? draft : m)));
    else setManagers((arr) => [...arr, draft]);
    setDraft(blank()); setEditing(null);
  }

  function toggleDay(d: string) {
    setDraft((p) => ({ ...p, workingDays: p.workingDays.includes(d) ? p.workingDays.filter((x) => x !== d) : [...p.workingDays, d] }));
  }
  function toggleEmp(id: string) {
    setDraft((p) => ({ ...p, team: p.team.includes(id) ? p.team.filter((x) => x !== id) : [...p.team, id] }));
  }

  function save() { aurix.set({ managers }); onNext(); }

  return (
    <StepCard
      title="Add managers"
      description="Assign teams and reporting hierarchy."
      icon={UserPlus}
      footer={
        <>
          <Button variant="ghost" onClick={onBack}><ChevronLeft className="mr-2 h-4 w-4" />Back</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={save}>Skip for now</Button>
            <Button onClick={save}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Manager name"><Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} /></Field>
        <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
        <Field label="Phone"><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
        <Field label="Department"><Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} /></Field>
        <Field label="Designation"><Input value={draft.designation} onChange={(e) => setDraft({ ...draft, designation: e.target.value })} placeholder="Engineering Manager" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Shift start"><Input type="time" value={draft.shiftStart} onChange={(e) => setDraft({ ...draft, shiftStart: e.target.value })} /></Field>
          <Field label="Shift end"><Input type="time" value={draft.shiftEnd} onChange={(e) => setDraft({ ...draft, shiftEnd: e.target.value })} /></Field>
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-2 block">Working days</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const on = draft.workingDays.includes(d);
              return (
                <button type="button" key={d} onClick={() => toggleDay(d)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${on ? "border-transparent bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-2 block">Assign team members</Label>
          {ws.employees.length === 0 ? (
            <EmptyHint text="No employees yet. You can assign managers later from the dashboard." />
          ) : (
            <div className="max-h-44 overflow-auto rounded-xl border border-border p-2">
              {ws.employees.map((e) => (
                <label key={e.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent">
                  <Checkbox checked={draft.team.includes(e.id)} onCheckedChange={() => toggleEmp(e.id)} />
                  <span className="text-sm font-medium">{e.fullName}</span>
                  <span className="text-xs text-muted-foreground">{e.department || "—"}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <Button onClick={add} variant="outline"><Plus className="mr-2 h-4 w-4" />{editing ? "Save changes" : "Add manager"}</Button>
        </div>
      </div>

      {managers.length ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {managers.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-card/40 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{m.fullName}</div>
                  <div className="text-xs text-muted-foreground">{m.designation || m.department}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setDraft(m); setEditing(m.id); }} className="rounded p-1.5 text-muted-foreground hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setManagers((arr) => arr.filter((x) => x.id !== m.id))} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{m.team.length} reports</Badge>
                <Badge variant="outline">{m.shiftStart}–{m.shiftEnd}</Badge>
                <Badge variant="outline">{m.workingDays.length} days/wk</Badge>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </StepCard>
  );
}

/* ---------------- Step 5: Review ---------------- */

function ReviewStep({ onBack, onFinish, onEdit, loading }: { onBack: () => void; onFinish: () => void; onEdit: (i: number) => void; loading?: boolean }) {
  const ws = useAurix();
  const c = ws.company;
  return (
    <StepCard title="Review your workspace" description="Verify everything looks right before launching." icon={CheckCircle2}
      footer={<><Button variant="ghost" onClick={onBack} disabled={loading}><ChevronLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={onFinish} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Confirm & launch{!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}</Button></>}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReviewCard title="Company" onEdit={() => onEdit(0)}>
          <ReviewLine label="Name" value={c?.name} />
          <ReviewLine label="Industry" value={c?.industry} />
          <ReviewLine label="Size" value={c?.size} />
          <ReviewLine label="Email" value={c?.email} />
          <ReviewLine label="Location" value={[c?.city, c?.country].filter(Boolean).join(", ")} />
        </ReviewCard>
        <ReviewCard title="HR team" onEdit={() => onEdit(1)}>
          <ReviewLine label="Total HRs" value={String(ws.hrs.length)} />
          {ws.hrs.slice(0, 3).map((h) => <ReviewLine key={h.id} label={h.fullName} value={h.designation || h.email} />)}
        </ReviewCard>
        <ReviewCard title="Employees" onEdit={() => onEdit(2)}>
          <ReviewLine label="Total" value={String(ws.employees.length)} />
          <ReviewLine label="Departments" value={String(new Set(ws.employees.map((e) => e.department).filter(Boolean)).size)} />
        </ReviewCard>
        <ReviewCard title="Managers" onEdit={() => onEdit(3)}>
          <ReviewLine label="Total managers" value={String(ws.managers.length)} />
          <ReviewLine label="Avg team size" value={ws.managers.length ? (ws.managers.reduce((s, m) => s + m.team.length, 0) / ws.managers.length).toFixed(1) : "—"} />
        </ReviewCard>
      </div>
    </StepCard>
  );
}

function ReviewCard({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button onClick={onEdit} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Pencil className="h-3 w-3" />Edit
        </button>
      </div>
      <dl className="space-y-1.5 text-sm">{children}</dl>
    </div>
  );
}
function ReviewLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right font-medium">{value || "—"}</dd>
    </div>
  );
}
function EmptyHint({ text }: { text: string }) {
  return <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-center text-xs text-muted-foreground">{text}</p>;
}

/* ---------------- Step 6: Success ---------------- */

function SuccessStep() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-card/70 p-10 text-center shadow-elegant backdrop-blur-xl" style={{ borderColor: "var(--glass-border)" }}>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">Your Aurix workspace is ready</h2>
      <p className="mt-2 text-sm text-muted-foreground">Everything is set up. Jump into the dashboard or invite the rest of your team.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={() => navigate({ to: "/dashboard" })}>Go to dashboard</Button>
        <Button variant="outline" onClick={() => navigate({ to: "/dashboard/hr" as any })}>Invite team members</Button>
      </div>
    </div>
  );
}
