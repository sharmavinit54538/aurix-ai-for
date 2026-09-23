import { useState } from "react";
import {
  Users, Laptop, ShieldCheck, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const INITIAL_HIRES: NewHireOnboarding[] = [];

export function EnterpriseOnboardingPage() {
  const [newHires, setNewHires] = useState<NewHireOnboarding[]>(INITIAL_HIRES);
  const [selectedHireId, setSelectedHireId] = useState<string>("");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const activeHire = newHires.find((h) => h.id === selectedHireId) || newHires[0] || null;

  const handleToggleTaskStatus = (taskId: string) => {
    if (!activeHire) return;
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

  const filteredTasks = activeHire?.tasks.filter((t) => deptFilter === "all" || t.department === deptFilter) ?? [];
  const completedTasks = activeHire?.tasks.filter((t) => t.status === "Completed").length ?? 0;
  const totalTasks = activeHire?.tasks.length ?? 0;
  const calculatedReadiness = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusColors = {
    Completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    Pending: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    Overdue: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
    Blocked: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
  };

  return (
    <div className="space-y-6">

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
                  activeHire?.id === hire.id
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
            {newHires.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-6">No new hires in the pipeline.</div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Onboarding Tasks & Provisioning Matrix */}
        <div className="lg:col-span-2 space-y-4">
          {activeHire ? (
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
          ) : (
            <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]">
              <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-sm text-foreground">No Onboarding Cases</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                There are no employees currently in the onboarding pipeline. New hires will appear here once added.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
