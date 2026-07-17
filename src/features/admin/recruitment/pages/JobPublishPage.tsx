import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, CheckCircle2, ChevronRight, Globe, Lock, Mail, ShieldAlert, Sparkles,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { api } from "@/api";

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn Jobs", desc: "Reach active professionals worldwide", icon: "in" },
  { key: "indeed", label: "Indeed", desc: "The world's #1 job site", icon: "id" },
  { key: "naukri", label: "Naukri", desc: "India's largest employment platform", icon: "nk" },
  { key: "foundit", label: "Foundit", desc: "Monster India's newly upgraded job board", icon: "fi" },
  { key: "glassdoor", label: "Glassdoor", desc: "Employer branding & job distribution", icon: "gd" },
  { key: "wellfound", label: "Wellfound (AngelList)", desc: "Reach top startup talent", icon: "wf" },
];

export function JobPublishPage() {
  const { jobId } = useParams({ from: "/dashboard/recruitment/jobs/$jobId/publish" });
  const navigate = useNavigate();
  const job = useRecruitment((s) => s.jobs.find((j) => j.id === jobId));

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<string>("linkedin");
  const [salaryVisible, setSalaryVisible] = useState(true);
  const [remoteOption, setRemoteOption] = useState<string>("Hybrid");
  const [empType, setEmpType] = useState<string>("Full-time");
  const [skills, setSkills] = useState<string>("");
  const [category, setCategory] = useState<string>("Software Engineering");
  const [appMethod, setAppMethod] = useState<string>("Easy Apply");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (job) {
      setRemoteOption(job.workMode || "Hybrid");
      setEmpType(job.employmentType || "Full-time");
      setSkills(job.skills?.join(", ") || "");
    }
  }, [job]);

  if (!job) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Job Posting Not Found</h3>
        <p className="text-sm text-muted-foreground">The requested job could not be retrieved.</p>
        <Button className="mt-4" asChild>
          <Link to="/dashboard/recruitment/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

  function handlePublish() {
    setPublishing(true);
    // Simulate API connection & publishing latency
    setTimeout(() => {
      setStep(4);
      setPublishing(false);
    }, 2000);
  }

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/recruitment/jobs/$jobId" params={{ jobId }}>
            <ArrowLeft className="mr-2 h-4 w-4" />Back to Job details
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Publish: ${job.title}`}
        description="Configure and distribute this job posting across recruiting channels."
      />

      {/* Progress Tracker */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {[
          { num: 1, label: "Platform" },
          { num: 2, label: "Review Info" },
          { num: 3, label: "Settings" },
          { num: 4, label: "Finish" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all ${
                step === s.num
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : step > s.num
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span className={`text-sm font-medium ${step === s.num ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {s.num < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/60 p-6 shadow-xl backdrop-blur-xl">
        {/* Step 1: Choose Platform */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-base font-semibold">Choose Target Platform</h3>
              <p className="text-xs text-muted-foreground">Select the board where you want to publish this role.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                    platform === p.key
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {p.icon}
                  </div>
                  <span className="font-semibold text-sm">{p.label}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Next Step<ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Review Job Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-base font-semibold">Review Job Information</h3>
              <p className="text-xs text-muted-foreground">Verify job description and details before publishing.</p>
            </div>
            <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Title</span>
                  <span className="font-medium text-foreground">{job.title}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Department</span>
                  <span className="font-medium text-foreground">{job.department}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Location</span>
                  <span className="font-medium text-foreground">{job.location} ({job.workMode})</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Salary Range</span>
                  <span className="font-medium text-foreground">
                    {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground block">Description Summary</span>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>
                Configure Settings<ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Configure Settings */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-base font-semibold">Configure Platform Settings</h3>
              <p className="text-xs text-muted-foreground">Adjust attributes specifically for {PLATFORMS.find(p => p.key === platform)?.label}.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-3 bg-background/30">
                <div>
                  <span className="text-sm font-medium block">Salary Visibility</span>
                  <span className="text-[10px] text-muted-foreground">Display compensation details on the public board</span>
                </div>
                <input
                  type="checkbox"
                  checked={salaryVisible}
                  onChange={(e) => setSalaryVisible(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="remote">Remote Option</Label>
                  <select
                    id="remote"
                    value={remoteOption}
                    onChange={(e) => setRemoteOption(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="empType">Employment Type</Label>
                  <select
                    id="empType"
                    value={empType}
                    onChange={(e) => setEmpType(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="appMethod">Application Method</Label>
                  <select
                    id="appMethod"
                    value={appMethod}
                    onChange={(e) => setAppMethod(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Easy Apply">Easy Apply (Direct)</option>
                    <option value="External URL">External Career Page</option>
                    <option value="Email">Email Resume</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    id="expiry"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skills">Skills Tags (Comma separated)</Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Role<Globe className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success Animation */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <CheckCircle2 className="h-16 w-16 text-emerald-500 relative" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Job Published Successfully!</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Your role is now live on {PLATFORMS.find(p => p.key === platform)?.label} and will begin receiving candidates soon.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard/recruitment/jobs/$jobId" params={{ jobId }}>
                  View Details Page
                </Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard/recruitment/jobs">
                  Back to Jobs list
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

