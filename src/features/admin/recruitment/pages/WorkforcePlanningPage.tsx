import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2, Plus, Users, Target, Clock, ArrowRight,
  TrendingUp, FileCheck2, AlertCircle, CheckCircle2,
  DollarSign, Sparkles, Filter, Briefcase, ChevronRight, X
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";

export interface WorkforceRequirement {
  id: string;
  department: string;
  roleTitle: string;
  headcountNeeded: number;
  currentHeadcount: number;
  plannedQuarter: "Q1 2026" | "Q2 2026" | "Q3 2026" | "Q4 2026";
  priority: "Urgent" | "High" | "Medium" | "Low";
  budgetMin: number;
  budgetMax: number;
  currency: string;
  requiredSkills: string[];
  experienceLevel: string;
  justification: string;
  status: "Draft" | "Submitted" | "Dept Head Approved" | "Finance Approved" | "Approved" | "Converted to Job" | "Rejected";
  convertedJobId?: string;
  createdAt: string;
}

const INITIAL_REQUIREMENTS: WorkforceRequirement[] = [
  {
    id: "WFR-101",
    department: "Engineering",
    roleTitle: "Senior Full Stack Engineer",
    headcountNeeded: 3,
    currentHeadcount: 14,
    plannedQuarter: "Q1 2026",
    priority: "Urgent",
    budgetMin: 2200000,
    budgetMax: 3200000,
    currency: "INR",
    requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    experienceLevel: "5-8 yrs (Senior)",
    justification: "Scaling enterprise automation pipeline for tier-1 client deployments.",
    status: "Approved",
    createdAt: "2026-02-10",
  },
  {
    id: "WFR-102",
    department: "Data & AI Analytics",
    roleTitle: "Staff AI/ML Engineer",
    headcountNeeded: 2,
    currentHeadcount: 6,
    plannedQuarter: "Q1 2026",
    priority: "High",
    budgetMin: 3500000,
    budgetMax: 5000000,
    currency: "INR",
    requiredSkills: ["Python", "PyTorch", "LLMs", "Vector DBs"],
    experienceLevel: "8+ yrs (Lead)",
    justification: "Core model fine-tuning and agentic routing systems buildout.",
    status: "Finance Approved",
    createdAt: "2026-02-18",
  },
  {
    id: "WFR-103",
    department: "Design & Creative",
    roleTitle: "Lead Product Designer (UI/UX)",
    headcountNeeded: 1,
    currentHeadcount: 4,
    plannedQuarter: "Q2 2026",
    priority: "Medium",
    budgetMin: 2000000,
    budgetMax: 2800000,
    currency: "INR",
    requiredSkills: ["Figma", "Design Systems", "Prototyping"],
    experienceLevel: "5-8 yrs (Senior)",
    justification: "End-to-end design refresh across all executive portals and mobile views.",
    status: "Approved",
    createdAt: "2026-03-01",
  },
  {
    id: "WFR-104",
    department: "Sales & Business Dev",
    roleTitle: "Enterprise Account Executive",
    headcountNeeded: 4,
    currentHeadcount: 8,
    plannedQuarter: "Q2 2026",
    priority: "High",
    budgetMin: 1800000,
    budgetMax: 2500000,
    currency: "INR",
    requiredSkills: ["B2B SaaS", "Enterprise Sales", "Contract Negotiation"],
    experienceLevel: "4-7 yrs",
    justification: "Expansion into North American and Southeast Asian enterprise markets.",
    status: "Submitted",
    createdAt: "2026-03-05",
  },
  {
    id: "WFR-105",
    department: "Human Resources",
    roleTitle: "Senior People Operations Partner",
    headcountNeeded: 2,
    currentHeadcount: 5,
    plannedQuarter: "Q1 2026",
    priority: "Medium",
    budgetMin: 1200000,
    budgetMax: 1700000,
    currency: "INR",
    requiredSkills: ["HR Operations", "Onboarding", "Compliance"],
    experienceLevel: "3-5 yrs",
    justification: "Rapid workforce expansion requiring structured onboarding and BGV bandwidth.",
    status: "Converted to Job",
    convertedJobId: "job-105",
    createdAt: "2026-02-12",
  },
];

const DEPARTMENTS = [
  "Engineering",
  "Data & AI Analytics",
  "Product Management",
  "Design & Creative",
  "Sales & Business Dev",
  "Human Resources",
  "Finance & Accounting",
  "Operations",
];

export function WorkforcePlanningPage() {
  const navigate = useNavigate();
  const { upsertJob } = useRecruitment();
  const [requirements, setRequirements] = useState<WorkforceRequirement[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ofc360:workforce_requirements");
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return INITIAL_REQUIREMENTS;
  });

  const [filterDept, setFilterDept] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<WorkforceRequirement | null>(null);

  // New Requirement Form State
  const [form, setForm] = useState({
    department: "Engineering",
    roleTitle: "",
    headcountNeeded: 1,
    currentHeadcount: 10,
    plannedQuarter: "Q2 2026" as WorkforceRequirement["plannedQuarter"],
    priority: "High" as WorkforceRequirement["priority"],
    budgetMin: 1800000,
    budgetMax: 2600000,
    currency: "INR",
    requiredSkills: "React, TypeScript, Cloud",
    experienceLevel: "3-5 yrs (Mid-Level)",
    justification: "",
  });

  const saveRequirements = (updated: WorkforceRequirement[]) => {
    setRequirements(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ofc360:workforce_requirements", JSON.stringify(updated));
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roleTitle.trim()) {
      toast.error("Please enter a role title.");
      return;
    }

    const newReq: WorkforceRequirement = {
      id: `WFR-${Math.floor(100 + Math.random() * 900)}`,
      department: form.department,
      roleTitle: form.roleTitle,
      headcountNeeded: Number(form.headcountNeeded) || 1,
      currentHeadcount: Number(form.currentHeadcount) || 0,
      plannedQuarter: form.plannedQuarter,
      priority: form.priority,
      budgetMin: Number(form.budgetMin),
      budgetMax: Number(form.budgetMax),
      currency: form.currency,
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      experienceLevel: form.experienceLevel,
      justification: form.justification || "Headcount required for planned project milestones.",
      status: "Submitted",
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveRequirements([newReq, ...requirements]);
    toast.success(`Workforce requirement ${newReq.id} created successfully!`);
    setShowCreateModal(false);
    setForm({
      department: "Engineering",
      roleTitle: "",
      headcountNeeded: 1,
      currentHeadcount: 10,
      plannedQuarter: "Q2 2026",
      priority: "High",
      budgetMin: 1800000,
      budgetMax: 2600000,
      currency: "INR",
      requiredSkills: "React, TypeScript, Cloud",
      experienceLevel: "3-5 yrs (Mid-Level)",
      justification: "",
    });
  };

  const handleStatusChange = (id: string, newStatus: WorkforceRequirement["status"]) => {
    const updated = requirements.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    saveRequirements(updated);
    toast.success(`Requirement ${id} marked as ${newStatus}`);
  };

  const handleConvertToJob = (req: WorkforceRequirement) => {
    const newJobId = `job-${Math.floor(100 + Math.random() * 900)}`;
    const newJob = {
      id: newJobId,
      title: req.roleTitle,
      department: req.department,
      employmentType: "Full-time" as const,
      experience: req.experienceLevel,
      skills: req.requiredSkills,
      salaryMin: req.budgetMin,
      salaryMax: req.budgetMax,
      currency: req.currency,
      vacancies: req.headcountNeeded,
      location: "Bengaluru, India (Hybrid)",
      workMode: "Hybrid" as const,
      description: `We are hiring ${req.headcountNeeded} ${req.roleTitle} for our ${req.department} team.\n\nJustification: ${req.justification}`,
      responsibilities: [
        `Deliver high-impact features aligned with ${req.department} priorities.`,
        "Collaborate cross-functionally across product, design, and engineering.",
      ],
      requirements: [
        `Demonstrated experience in ${req.requiredSkills.join(", ")}.`,
        `Minimum ${req.experienceLevel} required.`,
      ],
      benefits: ["Competitive CTC", "Comprehensive Health Cover", "Growth Opportunities"],
      hiringManager: "Department Lead",
      recruiter: "Recruitment Team",
      status: "active" as const,
      publishedAt: new Date().toISOString(),
      closingAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      applicants: 0,
    };

    upsertJob(newJob);
    const updated = requirements.map((r) =>
      r.id === req.id ? { ...r, status: "Converted to Job" as const, convertedJobId: newJobId } : r
    );
    saveRequirements(updated);
    toast.success(`Requirement ${req.id} converted into Active Job ${newJobId}!`);
    navigate({ to: "/dashboard/recruitment/jobs" as any });
  };

  // KPIs
  const totalPlannedHeadcount = requirements.reduce((acc, r) => acc + r.headcountNeeded, 0);
  const totalApproved = requirements.filter((r) => r.status === "Approved" || r.status === "Converted to Job").length;
  const totalPending = requirements.filter((r) => r.status === "Submitted" || r.status === "Finance Approved" || r.status === "Dept Head Approved").length;
  const totalBudgetEst = requirements.reduce((acc, r) => acc + (r.budgetMin + r.budgetMax) / 2 * r.headcountNeeded, 0);

  const filtered = useMemo(() => {
    return requirements.filter((r) => {
      if (filterDept !== "all" && r.department !== filterDept) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      return true;
    });
  }, [requirements, filterDept, filterStatus]);

  const priorityColors = {
    Urgent: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
    High: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    Medium: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
    Low: "bg-muted text-muted-foreground border-border",
  };

  const statusColors: Record<WorkforceRequirement["status"], string> = {
    Draft: "bg-muted text-muted-foreground",
    Submitted: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    "Dept Head Approved": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    "Finance Approved": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    Approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    "Converted to Job": "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    Rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workforce Planning & Headcount Requirements"
        description="Forecast talent capacity, track department hiring demands, manage budget allocations, and convert approved requisitions into active jobs."
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreateModal(true)} className="gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" />
              New Workforce Requirement
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Headcount Needed</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{totalPlannedHeadcount} Positions</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Across {DEPARTMENTS.length} functional units</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Approved Requisitions</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalApproved} Approved</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Ready for recruiter sourcing</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending Approvals</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">{totalPending} In Review</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Dept Head & Finance sign-off</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Annualized Budget Pool</span>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">₹{(totalBudgetEst / 10000000).toFixed(2)} Cr</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Est. salary allocations</div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/40 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5" />
            Filter by:
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="h-8 text-xs w-[160px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-8 text-xs w-[170px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Dept Head Approved">Dept Head Approved</SelectItem>
              <SelectItem value="Finance Approved">Finance Approved</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Converted to Job">Converted to Job</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {requirements.length} requirements
        </div>
      </div>

      {/* Main Requirements Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Requirement ID & Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Headcount</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Budget Range</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground text-sm flex items-center gap-1.5">
                      {req.roleTitle}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {req.id} • {req.experienceLevel}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-muted-foreground">{req.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      +{req.headcountNeeded}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">(Current: {req.currentHeadcount})</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${priorityColors[req.priority]}`}>
                      {req.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-muted-foreground">
                    {req.plannedQuarter}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{(req.budgetMin / 100000).toFixed(1)}L - ₹{(req.budgetMax / 100000).toFixed(1)}L
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-[10px] ${statusColors[req.status]}`}>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2"
                        onClick={() => setSelectedReq(req)}
                      >
                        Details
                      </Button>

                      {req.status === "Approved" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs px-2.5 bg-gradient-brand text-brand-foreground shadow-glow gap-1"
                          onClick={() => handleConvertToJob(req)}
                        >
                          <Sparkles className="h-3 w-3" />
                          Convert to Job
                        </Button>
                      )}

                      {req.status === "Submitted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                          onClick={() => handleStatusChange(req.id, "Approved")}
                        >
                          Approve
                        </Button>
                      )}

                      {req.status === "Converted to Job" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2 text-indigo-500"
                          asChild
                        >
                          <Link to="/dashboard/recruitment/jobs">
                            View Job <ChevronRight className="h-3 w-3 ml-0.5" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer / Modal */}
      {selectedReq && (
        <Dialog open={Boolean(selectedReq)} onOpenChange={() => setSelectedReq(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={priorityColors[selectedReq.priority]}>{selectedReq.priority}</Badge>
                <Badge variant="secondary" className={statusColors[selectedReq.status]}>{selectedReq.status}</Badge>
              </div>
              <DialogTitle className="text-xl font-bold mt-2">{selectedReq.roleTitle}</DialogTitle>
              <DialogDescription>
                {selectedReq.id} • {selectedReq.department} • Planned for {selectedReq.plannedQuarter}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-xl">
                <div>
                  <span className="text-muted-foreground">Headcount Needed:</span>
                  <div className="font-semibold text-sm text-foreground">+{selectedReq.headcountNeeded} Openings</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Annual Budget Band:</span>
                  <div className="font-semibold text-sm text-foreground">
                    ₹{(selectedReq.budgetMin / 100000).toFixed(1)}L – ₹{(selectedReq.budgetMax / 100000).toFixed(1)}L
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Experience Level:</span>
                  <div className="font-semibold text-foreground">{selectedReq.experienceLevel}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Target Quarter:</span>
                  <div className="font-semibold text-foreground">{selectedReq.plannedQuarter}</div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Business Justification & Project Alignment</Label>
                <p className="mt-1 p-3 rounded-lg border border-border bg-card/60 text-foreground leading-relaxed">
                  {selectedReq.justification}
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Required Skillsets</Label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedReq.requiredSkills.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Workflow Stage:</span>
                  <Select
                    value={selectedReq.status}
                    onValueChange={(val: any) => {
                      handleStatusChange(selectedReq.id, val);
                      setSelectedReq({ ...selectedReq, status: val });
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Dept Head Approved">Dept Head Approved</SelectItem>
                      <SelectItem value="Finance Approved">Finance Approved</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedReq.status === "Approved" && (
                  <Button
                    size="sm"
                    className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
                    onClick={() => {
                      const cur = selectedReq;
                      setSelectedReq(null);
                      handleConvertToJob(cur);
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Convert to Active Job
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Create Workforce Requirement</DialogTitle>
              <DialogDescription>
                Submit a new hiring requisition for approval by Department Head and Finance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Department *</Label>
                  <Select
                    value={form.department}
                    onValueChange={(v) => setForm({ ...form, department: v })}
                  >
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Target Timeline *</Label>
                  <Select
                    value={form.plannedQuarter}
                    onValueChange={(v: any) => setForm({ ...form, plannedQuarter: v })}
                  >
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                      <SelectItem value="Q2 2026">Q2 2026</SelectItem>
                      <SelectItem value="Q3 2026">Q3 2026</SelectItem>
                      <SelectItem value="Q4 2026">Q4 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Role Title *</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. Senior Distributed Systems Engineer"
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Headcount *</Label>
                  <Input
                    type="number"
                    min="1"
                    className="mt-1 h-9 text-xs"
                    value={form.headcountNeeded}
                    onChange={(e) => setForm({ ...form, headcountNeeded: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Priority *</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v: any) => setForm({ ...form, priority: v })}
                  >
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Experience *</Label>
                  <Input
                    className="mt-1 h-9 text-xs"
                    value={form.experienceLevel}
                    onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Min Salary (INR / yr)</Label>
                  <Input
                    type="number"
                    className="mt-1 h-9 text-xs"
                    value={form.budgetMin}
                    onChange={(e) => setForm({ ...form, budgetMin: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Salary (INR / yr)</Label>
                  <Input
                    type="number"
                    className="mt-1 h-9 text-xs"
                    value={form.budgetMax}
                    onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Required Skills (Comma separated)</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="React, TypeScript, AWS, System Architecture"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs">Business Justification & Impact</Label>
                <Textarea
                  className="mt-1 text-xs"
                  rows={2}
                  placeholder="Describe why this role is needed and the business goals it impacts..."
                  value={form.justification}
                  onChange={(e) => setForm({ ...form, justification: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
