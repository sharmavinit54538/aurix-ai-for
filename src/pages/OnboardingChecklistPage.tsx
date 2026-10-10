import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, UserCheck, ClipboardCheck, RefreshCw, AlertCircle } from "lucide-react";
import { GlassCard, Progress, StatCard } from "@/components/hrms/Shared";
import { onboardingChecklistApi } from "@/services/onboardingChecklistApi";
import type { OnboardingCase } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const DEFAULT_TASKS = [
  { key: "offer", label: "Offer accepted", owner: "HR" },
  { key: "docs", label: "Documents submitted", owner: "Employee" },
  { key: "bgv", label: "Background verification", owner: "HR" },
  { key: "laptop", label: "Laptop assigned", owner: "IT" },
  { key: "email", label: "Email created", owner: "IT" },
  { key: "slack", label: "Slack created", owner: "IT" },
  { key: "github", label: "GitHub access", owner: "IT" },
  { key: "training", label: "Training assigned", owner: "Manager" },
  { key: "policy", label: "Policies read", owner: "Employee" },
  { key: "intro", label: "Manager introduction", owner: "Manager" },
  { key: "id", label: "ID card generated", owner: "HR" },
  { key: "probation", label: "Probation started", owner: "HR" },
];

function newCase(): OnboardingCase {
  return {
    id: "",
    employee: "",
    role: "",
    manager: "",
    joinDate: new Date().toISOString().slice(0, 10),
    tasks: DEFAULT_TASKS.map((t) => ({ ...t, done: false })),
  };
}

function getCompletionPercentage(c: OnboardingCase): number {
  if (c.tasks.length > 0) {
    const done = c.tasks.filter((t) => t.done).length;
    return Math.round((done / c.tasks.length) * 100);
  }
  return c.completionPercentage ?? 0;
}

function formatJoinDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

export default function OnboardingChecklistPage() {
  const [cases, setCases] = useState<OnboardingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<OnboardingCase>(newCase());
  const [submitting, setSubmitting] = useState(false);

  const loadOnboardings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await onboardingChecklistApi.getOnboardings();
      setCases(res.items);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load onboarding checklists";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOnboardings();
  }, [loadOnboardings]);

  const stats = useMemo(() => {
    const casesWithTasks = cases.filter((c) => c.tasks.length > 0);
    const totalTasks = casesWithTasks.reduce((s, c) => s + c.tasks.length, 0);
    const doneTasks = casesWithTasks.reduce((s, c) => s + c.tasks.filter((t) => t.done).length, 0);

    const casesWithCompletion = cases.filter((c) => typeof c.completionPercentage === "number");
    const avgFromCompletion = casesWithCompletion.length > 0
      ? Math.round(casesWithCompletion.reduce((s, c) => s + (c.completionPercentage ?? 0), 0) / casesWithCompletion.length)
      : 0;

    const avgFromTasks = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      doneTasks,
      avgPct: casesWithTasks.length > 0 ? avgFromTasks : avgFromCompletion,
      showTasksCount: casesWithTasks.length > 0,
    };
  }, [cases]);

  async function handleToggle(caseId: string, taskKey: string, currentDone: boolean) {
    try {
      const updated = await onboardingChecklistApi.toggleOnboardingTask(caseId, taskKey, !currentDone);
      setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update checklist task");
    }
  }

  async function handleCreate() {
    if (!draft.employee || !draft.role) {
      toast.error("Please enter employee name and role");
      return;
    }
    setSubmitting(true);
    try {
      const created = await onboardingChecklistApi.createOnboarding(draft);
      setCases((prev) => [created, ...prev]);
      setOpen(false);
      setDraft(newCase());
      toast.success("New onboarding initialized");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create onboarding");
    } finally {
      setSubmitting(false);
    }
  }

  if (error && cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load onboarding checklists</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadOnboardings} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <Button
          size="sm"
          onClick={() => {
            setDraft(newCase());
            setOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> New onboarding
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active onboardings" value={cases.length} icon={UserCheck} />
        <StatCard
          label={stats.showTasksCount ? "Tasks completed" : "Avg completion (backend)"}
          value={stats.showTasksCount ? `${stats.doneTasks}/${stats.totalTasks}` : `${stats.avgPct}%`}
          icon={ClipboardCheck}
          accent="success"
        />
        <StatCard label="Average completion" value={`${stats.avgPct}%`} accent="brand" />
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading onboardings...
        </div>
      ) : cases.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No onboarding checklists active.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {cases.map((c) => {
            const pct = getCompletionPercentage(c);
            const hasTasks = c.tasks.length > 0;
            const joinDateFormatted = formatJoinDate(c.joinDate);

            return (
              <GlassCard key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{c.employee}</h3>
                    <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-2">
                      {c.department && <span>{c.department}</span>}
                      {c.role && <span>{c.role}</span>}
                      {joinDateFormatted && <span>Joins {joinDateFormatted}</span>}
                      {c.manager && <span>Manager {c.manager}</span>}
                      {c.currentStep && <span>Step: {c.currentStep}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <div className="font-display text-lg font-semibold">{pct}%</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={pct} />
                </div>
                {hasTasks && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {c.tasks.map((t) => (
                      <label
                        key={t.key}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm cursor-pointer hover:bg-card/70 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => handleToggle(c.id, t.key, t.done)}
                        />
                        <span className={t.done ? "line-through text-muted-foreground" : ""}>
                          {t.label}
                        </span>
                        <span className="ml-auto text-[10px] uppercase text-muted-foreground">
                          {t.owner}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {!hasTasks && c.missingDocuments && c.missingDocuments.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground mb-2">Missing documents:</div>
                    <div className="flex flex-wrap gap-1">
                      {c.missingDocuments.map((doc, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New onboarding</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Employee</Label>
              <Input
                value={draft.employee}
                onChange={(e) => setDraft({ ...draft, employee: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </div>
            <div>
              <Label>Manager</Label>
              <Input
                value={draft.manager}
                onChange={(e) => setDraft({ ...draft, manager: e.target.value })}
              />
            </div>
            <div>
              <Label>Join date</Label>
              <Input
                type="date"
                value={draft.joinDate.slice(0, 10)}
                onChange={(e) => setDraft({ ...draft, joinDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? "Starting..." : "Start onboarding"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}