import { useState } from "react";
import {
  GraduationCap, Target, Clock, Award, CheckCircle2, AlertTriangle,
  UserCheck, BookOpen, Share2, FileText, Check, ChevronRight,
  TrendingUp, Users, Calendar
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface TrainingModule {
  id: string;
  title: string;
  category: "Architecture & Codebase" | "Security & Compliance" | "Product Domain" | "Deployment & CI/CD";
  mentor: string;
  completed: boolean;
  resourceLink: string;
}

interface ProbationCheckin {
  milestone: "Day 30" | "Day 60" | "Day 90";
  date: string;
  status: "Completed" | "Pending" | "Upcoming";
  managerRating: number;
  managerNotes: string;
}

interface EmployeeProbationCase {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  mentor: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  probationStatus: "On Track" | "Needs Attention" | "Confirmed" | "Extended";
  goals: string[];
  trainingModules: TrainingModule[];
  checkpoints: ProbationCheckin[];
}

const INITIAL_PROBATION_CASES: EmployeeProbationCase[] = [
  {
    id: "prob-101",
    employeeName: "Siddharth Nambiar",
    role: "Senior Full Stack Engineer",
    department: "Engineering",
    mentor: "Arun Verma (Director of Engineering)",
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    daysRemaining: 30,
    probationStatus: "On Track",
    goals: [
      "Ship first production microservice deployment within first 45 days.",
      "Complete code reviews on 15+ pull requests adhering to security protocols.",
      "Document architectural guidelines for distributed event-bus reconciliation.",
    ],
    trainingModules: [
      { id: "tm-1", title: "OFC360 Core Microservices Architecture", category: "Architecture & Codebase", mentor: "Arun Verma", completed: true, resourceLink: "https://wiki.ofc360.internal/arch" },
      { id: "tm-2", title: "SOC-2 Type II Developer Security Protocols", category: "Security & Compliance", mentor: "Security Desk", completed: true, resourceLink: "https://wiki.ofc360.internal/soc2" },
      { id: "tm-3", title: "Zero-Downtime EKS Deployment Workflows", category: "Deployment & CI/CD", mentor: "DevOps Lead", completed: true, resourceLink: "https://wiki.ofc360.internal/eks" },
      { id: "tm-4", title: "Enterprise HR Domain Deep Dive", category: "Product Domain", mentor: "Pooja Sharma", completed: false, resourceLink: "https://wiki.ofc360.internal/domain" },
    ],
    checkpoints: [
      { milestone: "Day 30", date: "2026-02-15", status: "Completed", managerRating: 5, managerNotes: "Ramped up in under 3 weeks. Successfully resolved high-priority cache invalidation bug." },
      { milestone: "Day 60", date: "2026-03-15", status: "Completed", managerRating: 5, managerNotes: "Strong peer collaboration and proactive code reviews. Fully autonomous." },
      { milestone: "Day 90", date: "2026-04-15", status: "Upcoming", managerRating: 0, managerNotes: "Final confirmation evaluation scheduled." },
    ],
  },
  {
    id: "prob-102",
    employeeName: "Kavita Ranganathan",
    role: "DevOps & Cloud Infrastructure Lead",
    department: "Engineering",
    mentor: "Cloud Architect",
    startDate: "2026-02-01",
    endDate: "2026-05-01",
    daysRemaining: 46,
    probationStatus: "On Track",
    goals: [
      "Audit cloud cost allocation across multi-region Kubernetes clusters.",
      "Implement automated failover runbooks.",
    ],
    trainingModules: [
      { id: "tm-11", title: "Cloud Security & IAM Principles", category: "Security & Compliance", mentor: "SecOps", completed: true, resourceLink: "https://wiki.ofc360.internal/iam" },
      { id: "tm-12", title: "Terraform State Management & Secrets", category: "Deployment & CI/CD", mentor: "DevOps Lead", completed: false, resourceLink: "https://wiki.ofc360.internal/tf" },
    ],
    checkpoints: [
      { milestone: "Day 30", date: "2026-03-01", status: "Completed", managerRating: 4, managerNotes: "Solid start on infrastructure cost reduction analysis." },
      { milestone: "Day 60", date: "2026-04-01", status: "Upcoming", managerRating: 0, managerNotes: "" },
      { milestone: "Day 90", date: "2026-05-01", status: "Upcoming", managerRating: 0, managerNotes: "" },
    ],
  },
];

export function KnowledgeTransferProbationPage() {
  const [cases, setCases] = useState<EmployeeProbationCase[]>(INITIAL_PROBATION_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("prob-101");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recommendationDecision, setRecommendationDecision] = useState<"Confirmed" | "Extended">("Confirmed");
  const [recommendationFeedback, setRecommendationFeedback] = useState(
    "Employee has met all performance expectations ahead of schedule and demonstrated strong cultural alignment. Recommend immediate full employment confirmation."
  );

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleToggleModule = (moduleId: string) => {
    const updated = cases.map((c) => {
      if (c.id !== activeCase.id) return c;
      return {
        ...c,
        trainingModules: c.trainingModules.map((m) =>
          m.id === moduleId ? { ...m, completed: !m.completed } : m
        ),
      };
    });
    setCases(updated);
    toast.success("Training module progress updated!");
  };

  const handleCompleteProbation = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = cases.map((c) =>
      c.id === activeCase.id ? { ...c, probationStatus: recommendationDecision } : c
    );
    setCases(updated);
    toast.success(`Probation recommendation recorded: ${recommendationDecision}!`);
    setShowConfirmModal(false);
  };

  const completedModules = activeCase.trainingModules.filter((m) => m.completed).length;
  const trainingPct = Math.round((completedModules / activeCase.trainingModules.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Transfer (KT) & Probation Management Hub"
        description="Oversee structured employee ramp-up curricula, track mentor-led knowledge transfer plans, and conduct 30-60-90 day milestone performance reviews."
        actions={
          <Button
            onClick={() => setShowConfirmModal(true)}
            className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
          >
            <Award className="h-4 w-4" />
            Submit Probation Recommendation
          </Button>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Employees in Probation */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between font-semibold text-sm">
            <span>Employees on Probation</span>
            <Badge variant="outline" className="text-xs">{cases.length} Tracking</Badge>
          </div>

          <div className="space-y-2">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeCase.id === c.id
                    ? "border-indigo-500 bg-accent/60 shadow-sm"
                    : "border-border bg-card/40 hover:bg-accent/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{c.employeeName}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] ${
                      c.probationStatus === "Confirmed"
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                        : "bg-indigo-500/15 text-indigo-600 border-indigo-500/30"
                    }`}
                  >
                    {c.probationStatus}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.role}</div>
                <div className="text-[10px] text-muted-foreground mt-2 flex justify-between">
                  <span>Mentor: {c.mentor.split(" ")[0]}</span>
                  <span>Ends in {c.daysRemaining} days</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: KT Plan & 30-60-90 Day Reviews */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-5">
            {/* Header Profile Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{activeCase.employeeName}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeCase.role} • Mentor: <strong className="text-foreground">{activeCase.mentor}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Probation Timeline</span>
                <div className="text-xs font-semibold text-foreground">
                  {activeCase.startDate} → {activeCase.endDate} ({activeCase.daysRemaining}d left)
                </div>
              </div>
            </div>

            {/* Knowledge Transfer Modules Progress */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  Knowledge Transfer Curriculum ({completedModules}/{activeCase.trainingModules.length} Modules)
                </span>
                <span className="font-bold text-xs text-indigo-500">{trainingPct}% Completed</span>
              </div>
              <Progress value={trainingPct} className="h-2" />
            </div>

            {/* Modules List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Training Modules & Resource Checklist
              </h4>
              {activeCase.trainingModules.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleModule(m.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                    m.completed ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card/40 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`grid h-5 w-5 place-items-center rounded-full border ${
                        m.completed ? "bg-emerald-500 text-white border-emerald-500" : "border-border"
                      }`}
                    >
                      {m.completed && <Check className="h-3 w-3" />}
                    </div>
                    <div>
                      <div className={m.completed ? "line-through text-muted-foreground" : "font-medium text-foreground"}>
                        {m.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Mentor: {m.mentor}</div>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-[10px]">{m.category}</Badge>
                </div>
              ))}
            </div>

            {/* 30-60-90 Day Milestone Review Checkpoints */}
            <div className="space-y-3 pt-3 border-t border-border">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Probation Review Checkpoints (30-60-90 Day Milestones)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeCase.checkpoints.map((cp) => (
                  <div
                    key={cp.milestone}
                    className="p-3.5 rounded-xl border border-border bg-card/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{cp.milestone} Review</span>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] ${
                          cp.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cp.status}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Scheduled: {cp.date}</div>

                    {cp.status === "Completed" ? (
                      <div className="space-y-1 pt-1 border-t border-border/60">
                        <div className="text-[11px] font-semibold text-emerald-600">
                          Rating: {cp.managerRating} / 5 Stars
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal italic">
                          "{cp.managerNotes}"
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2 text-[10px] text-muted-foreground italic">
                        Evaluation form opens on milestone date.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Recommendation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCompleteProbation}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-500" />
                Probation Completion Recommendation
              </DialogTitle>
              <DialogDescription>
                Record manager sign-off for {activeCase.employeeName} ({activeCase.role}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div>
                <Label className="text-xs">Final Decision</Label>
                <Select
                  value={recommendationDecision}
                  onValueChange={(v: any) => setRecommendationDecision(v)}
                >
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirm Full-Time Permanent Employment</SelectItem>
                    <SelectItem value="Extended">Extend Probation by 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Manager Reviewer Notes & Feedback</Label>
                <Textarea
                  className="mt-1 text-xs"
                  rows={4}
                  value={recommendationFeedback}
                  onChange={(e) => setRecommendationFeedback(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-brand text-brand-foreground shadow-glow">
                Submit Recommendation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
