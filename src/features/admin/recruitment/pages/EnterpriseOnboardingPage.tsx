import { useState } from "react";
import {
  Users, CheckCircle2, Clock, AlertCircle, Laptop, ShieldCheck,
  CreditCard, Award, FileText, Check, X, ChevronRight, Package,
  Building, UserCheck, AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface OnboardingTask {
  id: string;
  department: "HR" | "IT" | "Admin" | "Finance" | "Manager";
  title: string;
  assignee: string;
  status: "Completed" | "Pending" | "Overdue" | "Blocked";
  dueDate: string;
}

interface NewHireOnboarding {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  joinDate: string;
  dayOneReadinessScore: number;
  laptopAssigned: string;
  accessGranted: string[];
  tasks: OnboardingTask[];
}

const INITIAL_HIRES: NewHireOnboarding[] = [
  {
    id: "nh-101",
    employeeName: "Meera Kulkarni",
    role: "Senior People Operations Partner",
    department: "Human Resources",
    joinDate: "2026-04-01",
    dayOneReadinessScore: 88,
    laptopAssigned: "MacBook Air M3 15-inch (Asset #OFC-MBP-842)",
    accessGranted: ["Google Workspace", "Slack", "BambooHR", "Notion", "OFC360 Admin"],
    tasks: [
      { id: "t-1", department: "HR", title: "Verify Government ID & Permanent Address", assignee: "Pooja Sharma", status: "Completed", dueDate: "2026-03-25" },
      { id: "t-2", department: "IT", title: "Provision Corporate Email & Security 2FA Keys", assignee: "Cloud Infra Lead", status: "Completed", dueDate: "2026-03-26" },
      { id: "t-3", department: "IT", title: "Ship Encrypted MacBook & Display Kit", assignee: "IT Asset Desk", status: "Completed", dueDate: "2026-03-27" },
      { id: "t-4", department: "Admin", title: "Issue RFID Office Access Badge & Desk Allocation", assignee: "Facilities Desk", status: "Pending", dueDate: "2026-03-30" },
      { id: "t-5", department: "Finance", title: "Bank Account & PF/ESI Compliance Direct Debit Setup", assignee: "Payroll Lead", status: "Completed", dueDate: "2026-03-28" },
      { id: "t-6", department: "Manager", title: "Schedule 1:1 Welcome Call & 30-Day Goal Alignment", assignee: "Meera Nair", status: "Pending", dueDate: "2026-04-01" },
    ],
  },
  {
    id: "nh-102",
    employeeName: "Aditya Roy",
    role: "Lead Product Designer (UI/UX)",
    department: "Design & Creative",
    joinDate: "2026-04-01",
    dayOneReadinessScore: 72,
    laptopAssigned: "MacBook Pro M3 Max (Asset #OFC-MBP-901)",
    accessGranted: ["Google Workspace", "Slack", "Figma Enterprise"],
    tasks: [
      { id: "t-11", department: "HR", title: "Verify Government ID & Educational Credentials", assignee: "Pooja Sharma", status: "Completed", dueDate: "2026-03-25" },
      { id: "t-12", department: "IT", title: "Configure Figma Enterprise & Adobe Creative Cloud Licenses", assignee: "IT Desk", status: "Pending", dueDate: "2026-03-28" },
      { id: "t-13", department: "IT", title: "Provision GitHub & Zero-Trust VPN Access", assignee: "Cloud Infra", status: "Blocked", dueDate: "2026-03-28" },
      { id: "t-14", department: "Finance", title: "Setup Direct Deposit & Tax Declaration Forms", assignee: "Finance Ops", status: "Pending", dueDate: "2026-03-29" },
      { id: "t-15", department: "Manager", title: "Assign Onboarding Mentor / Buddy", assignee: "Design Lead", status: "Completed", dueDate: "2026-03-24" },
    ],
  },
];

export function EnterpriseOnboardingPage() {
  const [newHires, setNewHires] = useState<NewHireOnboarding[]>(INITIAL_HIRES);
  const [selectedHireId, setSelectedHireId] = useState<string>("nh-101");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const activeHire = newHires.find((h) => h.id === selectedHireId) || newHires[0];

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = newHires.map((hire) => {
      if (hire.id !== activeHire.id) return hire;
      return {
        ...hire,
        tasks: hire.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === "Completed" ? ("Pending" as const) : ("Completed" as const) }
            : t
        ),
      };
    });
    setNewHires(updated);
    toast.success("Task status updated!");
  };

  const filteredTasks = activeHire.tasks.filter((t) => deptFilter === "all" || t.department === deptFilter);
  const completedTasks = activeHire.tasks.filter((t) => t.status === "Completed").length;
  const calculatedReadiness = Math.round((completedTasks / activeHire.tasks.length) * 100);

  const statusColors = {
    Completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    Pending: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    Overdue: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
    Blocked: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Department Employee Onboarding Hub"
        description="Track Day-One readiness scores, coordinate HR, IT, Admin, Finance, and Manager task handoffs, and ensure seamless hardware and access provisioning."
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: New Hires List */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between font-semibold text-sm">
            <span>Incoming Cohort</span>
            <Badge variant="outline" className="text-xs">{newHires.length} New Hires</Badge>
          </div>

          <div className="space-y-2">
            {newHires.map((hire) => (
              <button
                key={hire.id}
                onClick={() => setSelectedHireId(hire.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeHire.id === hire.id
                    ? "border-indigo-500 bg-accent/60 shadow-sm"
                    : "border-border bg-card/40 hover:bg-accent/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{hire.employeeName}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {hire.dayOneReadinessScore}% Ready
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{hire.role}</div>
                <div className="text-[10px] text-muted-foreground mt-2 flex justify-between">
                  <span>Dept: {hire.department}</span>
                  <span>Day 1: {hire.joinDate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Onboarding Tasks & Provisioning Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{activeHire.employeeName}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeHire.role} • {activeHire.department} • Target Start: <strong>{activeHire.joinDate}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Day-One Readiness Gauge</span>
                <div className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400">
                  {calculatedReadiness}% Ready
                </div>
              </div>
            </div>

            {/* Hardware & System Access Provisioning Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-card/40 space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-indigo-500" />
                  Hardware & IT Asset Allocation
                </div>
                <div className="text-muted-foreground font-mono text-[11px]">{activeHire.laptopAssigned}</div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card/40 space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  System Access Badges ({activeHire.accessGranted.length} Enabled)
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeHire.accessGranted.map((acc) => (
                    <Badge key={acc} variant="secondary" className="text-[9px]">{acc}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Task Filter Tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-2 pt-2 text-xs">
              <span className="text-muted-foreground mr-1 text-[11px]">Department:</span>
              {(["all", "HR", "IT", "Admin", "Finance", "Manager"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDeptFilter(d)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    deptFilter === d ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {d === "all" ? "All Tasks" : d}
                </button>
              ))}
            </div>

            {/* Onboarding Checklist Tasks Table */}
            <div className="space-y-2">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                    t.status === "Completed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px]">{t.department}</Badge>
                      <span className={`font-semibold ${t.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {t.title}
                      </span>
                      <Badge variant="outline" className={`text-[9px] ${statusColors[t.status]}`}>
                        {t.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Assigned to: <strong className="text-foreground">{t.assignee}</strong> • Due: {t.dueDate}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={t.status === "Completed" ? "outline" : "default"}
                    className="h-7 text-xs px-2.5 shrink-0 gap-1"
                    onClick={() => handleToggleTaskStatus(t.id)}
                  >
                    {t.status === "Completed" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" /> Completed
                      </>
                    ) : (
                      <>Mark Completed</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
