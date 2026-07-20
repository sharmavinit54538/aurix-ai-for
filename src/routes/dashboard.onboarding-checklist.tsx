import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, UserCheck, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, Progress, StatCard } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { OnboardingCase } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/onboarding-checklist")({
  head: () => ({ meta: [{ title: "Onboarding Checklist — Aurix" }] }),
  component: OnboardingPage,
});

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
    id: newId("ob"), employee: "", role: "", manager: "",
    joinDate: new Date().toISOString().slice(0, 10),
    tasks: DEFAULT_TASKS.map((t) => ({ ...t, done: false })),
  };
}

export function OnboardingPage() {
  const cases = useHrms((s) => s.onboarding);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<OnboardingCase>(newCase());

  const totalTasks = cases.reduce((s, c) => s + c.tasks.length, 0);
  const doneTasks = cases.reduce((s, c) => s + c.tasks.filter((t) => t.done).length, 0);
  const avgPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Onboarding Checklist"
        description="Track new hires through their first 30 days."
        actions={
          <Button size="sm" onClick={() => { setDraft(newCase()); setOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> New onboarding
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active onboardings" value={cases.length} icon={UserCheck} />
        <StatCard label="Tasks completed" value={`${doneTasks}/${totalTasks}`} icon={ClipboardCheck} accent="success" />
        <StatCard label="Average completion" value={`${avgPct}%`} accent="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cases.map((c) => {
          const done = c.tasks.filter((t) => t.done).length;
          const pct = Math.round((done / c.tasks.length) * 100);
          return (
            <GlassCard key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{c.employee}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">{c.role} · Joins {new Date(c.joinDate).toLocaleDateString()} · Manager {c.manager}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Progress</div>
                  <div className="font-display text-lg font-semibold">{pct}%</div>
                </div>
              </div>
              <div className="mt-3"><Progress value={pct} /></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {c.tasks.map((t) => (
                  <label key={t.key} className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">
                    <input type="checkbox" checked={t.done} onChange={() => hrms.toggleOnboardingTask(c.id, t.key)} />
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
                    <span className="ml-auto text-[10px] uppercase text-muted-foreground">{t.owner}</span>
                  </label>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New onboarding</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Employee</Label><Input value={draft.employee} onChange={(e) => setDraft({ ...draft, employee: e.target.value })} /></div>
            <div><Label>Role</Label><Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></div>
            <div><Label>Manager</Label><Input value={draft.manager} onChange={(e) => setDraft({ ...draft, manager: e.target.value })} /></div>
            <div><Label>Join date</Label><Input type="date" value={draft.joinDate.slice(0, 10)} onChange={(e) => setDraft({ ...draft, joinDate: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (!draft.employee) return; hrms.addOnboarding(draft); setOpen(false); setDraft(newCase()); }}>Start onboarding</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
