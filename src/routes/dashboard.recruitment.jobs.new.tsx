import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, X, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { recruitment } from "@/lib/recruitment/store";
import { api } from "@/api";
import type { EmploymentType, Job, WorkMode } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/jobs/new")({
  head: () => ({ meta: [{ title: "Create Job — Recruitment" }] }),
  component: NewJob,
});

const STEPS = ["Basics", "Description", "Compensation", "Hiring Team", "Review"];

function NewJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Job>>({
    title: "",
    department: "Engineering",
    employmentType: "Full-time" as EmploymentType,
    experience: "3-5 yrs",
    skills: [],
    salaryMin: 80000,
    salaryMax: 120000,
    currency: "INR",
    vacancies: 1,
    location: "Remote",
    workMode: "Remote" as WorkMode,
    description: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
    hiringManager: "",
    recruiter: "",
    status: "draft",
  });

  function set<K extends keyof Job>(k: K, v: Job[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleAiAutofill() {
    if (!form.title?.trim()) {
      setAiError("Job Title is required to run AI auto-fill.");
      return;
    }
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await api.post("/jobs/ai-autofill", {
        title: form.title,
        experience: form.experience || null,
        salary_min: form.salaryMin || null,
        salary_max: form.salaryMax || null,
        currency: form.currency || null,
      });

      if (res.success && res.data) {
        const data = res.data;
        setForm((f) => ({
          ...f,
          department: data.department || f.department,
          employmentType: (data.employment_type === "Full-time" ? "Full-time" :
                           data.employment_type === "Part-time" ? "Part-time" :
                           data.employment_type === "Contract" ? "Contract" :
                           data.employment_type === "Internship" ? "Internship" :
                           data.employment_type || f.employmentType) as any,
          location: data.location || f.location,
          workMode: (data.work_mode === "Remote" ? "Remote" :
                     data.work_mode === "Hybrid" ? "Hybrid" :
                     data.work_mode === "Onsite" ? "Onsite" :
                     data.work_mode || f.workMode) as any,
          vacancies: data.vacancies || f.vacancies,
          skills: data.skills || f.skills,
          description: data.description || f.description,
          responsibilities: data.responsibilities || f.responsibilities,
          requirements: data.requirements || f.requirements,
          benefits: data.benefits || f.benefits,
        }));
      } else {
        setAiError(res.message || "AI auto-fill suggestions unavailable. Please fill manually.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "AI auto-fill suggestions unavailable. Please fill manually.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function submit(status: "active" | "draft") {
    if (!form.title) {
      setErrorMsg("Job Title is required.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const today = new Date().toISOString();
    const close = new Date();
    close.setDate(close.getDate() + 30);

    const jobPayload: Job = {
      id: "", 
      title: form.title || "",
      department: form.department || "General",
      employmentType: (form.employmentType as EmploymentType) || "Full-time",
      experience: form.experience || "—",
      skills: form.skills || [],
      salaryMin: form.salaryMin || 0,
      salaryMax: form.salaryMax || 0,
      currency: form.currency || "INR",
      vacancies: form.vacancies || 1,
      location: form.location || "Remote",
      workMode: (form.workMode as WorkMode) || "Remote",
      description: form.description || "",
      responsibilities: form.responsibilities || [],
      requirements: form.requirements || [],
      benefits: form.benefits || [],
      hiringManager: form.hiringManager || "",
      recruiter: form.recruiter || "",
      status,
      publishedAt: today,
      closingAt: close.toISOString(),
      applicants: 0,
    };

    try {
      const response = await recruitment.upsertJob(jobPayload);
      if (response && response.success && response.data) {
        navigate({ to: "/dashboard/recruitment/jobs/$jobId", params: { jobId: response.data.id } });
      } else {
        setErrorMsg(response?.message || "Failed to create job posting.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while communicating with the backend.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Create Job" description="Post a new role to your hiring pipeline." />

      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-colors ${
              i < step ? "bg-emerald-500/20 text-emerald-600" :
              i === step ? "text-brand-foreground shadow-glow" :
              "bg-muted text-muted-foreground"
            }`} style={i === step ? { background: "var(--gradient-brand)" } : undefined}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div className="hidden text-xs font-medium sm:block">{s}</div>
            {i < STEPS.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        {step === 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Job Title</Label>
              <div className="flex gap-2">
                <Input value={form.title} onChange={(e) => { set("title", e.target.value); setAiError(null); }} placeholder="Senior Product Designer" className="flex-1" />
                <Button type="button" onClick={handleAiAutofill} disabled={isGenerating || isSubmitting} className="shrink-0 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                  {isGenerating ? "Generating..." : "Auto-fill with AI"}
                </Button>
              </div>
              {aiError && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {aiError}
                </p>
              )}
            </div>
            <Field label="Department"><Input value={form.department} onChange={(e) => set("department", e.target.value)} /></Field>
            <Field label="Employment Type">
              <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value as EmploymentType)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {(["Full-time", "Part-time", "Contract", "Internship", "Temporary"] as EmploymentType[]).map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Experience"><Input value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="3-5 yrs" /></Field>
            <Field label="Location"><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></Field>
            <Field label="Work Mode">
              <select value={form.workMode} onChange={(e) => set("workMode", e.target.value as WorkMode)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {(["Remote", "Hybrid", "Onsite"] as WorkMode[]).map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Vacancies"><Input type="number" value={form.vacancies} onChange={(e) => set("vacancies", Number(e.target.value))} /></Field>
            <Field label="Skills (comma-separated)">
              <Input
                value={form.skills?.join(", ")}
                onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="Figma, Design Systems, Prototyping"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">{form.skills?.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
            </Field>
          </div>
        ) : step === 1 ? (
          <div className="space-y-5">
            <Field label="Description"><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Lead end-to-end design for our enterprise product surfaces..." /></Field>
            <ListField label="Responsibilities" value={form.responsibilities || []} onChange={(v) => set("responsibilities", v)} placeholder="Own product surfaces end-to-end" />
            <ListField label="Requirements" value={form.requirements || []} onChange={(v) => set("requirements", v)} placeholder="5+ years product design experience" />
            <ListField label="Benefits" value={form.benefits || []} onChange={(v) => set("benefits", v)} placeholder="Equity, health, learning stipend" />
          </div>
        ) : step === 2 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Min Salary"><Input type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", Number(e.target.value))} /></Field>
            <Field label="Max Salary"><Input type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", Number(e.target.value))} /></Field>
            <Field label="Currency"><Input value={form.currency} onChange={(e) => set("currency", e.target.value)} /></Field>
            <div className="sm:col-span-3 rounded-xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
              Listed compensation will appear on the job posting and in candidate-facing pages.
            </div>
          </div>
        ) : step === 3 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Hiring Manager"><Input value={form.hiringManager} onChange={(e) => set("hiringManager", e.target.value)} /></Field>
            <Field label="Recruiter"><Input value={form.recruiter} onChange={(e) => set("recruiter", e.target.value)} /></Field>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">{form.title}</h3>
            <p className="text-sm text-muted-foreground">{form.department} · {form.employmentType} · {form.workMode} · {form.location}</p>
            <div className="flex flex-wrap gap-1.5">{form.skills?.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
            <p className="text-sm">{form.description}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Summary label="Compensation" value={`${form.currency} ${form.salaryMin?.toLocaleString()} – ${form.salaryMax?.toLocaleString()}`} />
              <Summary label="Vacancies" value={String(form.vacancies)} />
              <Summary label="Hiring Manager" value={form.hiringManager || "—"} />
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => submit("draft")} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
            <Button onClick={() => submit("active")} disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function ListField({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) { e.preventDefault(); onChange([...value, input.trim()]); setInput(""); }
        }} />
        <Button type="button" variant="outline" onClick={() => { if (input.trim()) { onChange([...value, input.trim()]); setInput(""); } }}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ul className="mt-2 space-y-1.5">
        {value.map((v, i) => (
          <li key={i} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-1.5 text-sm">
            <span>{v}</span>
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
          </li>
        ))}
      </ul>
    </Field>
  );
}
