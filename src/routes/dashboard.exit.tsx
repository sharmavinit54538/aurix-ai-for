import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LogOut, FileText, ShieldCheck, Wallet, CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, PrintButton, Progress, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { ExitCase, ExitStage } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/exit")({
  head: () => ({ meta: [{ title: "Exit Management — Aurix" }] }),
  component: ExitPage,
});

const STAGES: ExitStage[] = ["resignation", "notice", "interview", "assets", "hr", "manager", "it", "finance", "settled"];

function newExit(): ExitCase {
  return {
    id: newId("ex"), employee: "", role: "", resignedAt: new Date().toISOString().slice(0, 10),
    noticeDays: 60, lastWorkingDay: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10),
    reason: "", stage: "resignation",
    checklist: [
      { key: "assets", label: "Asset return", done: false },
      { key: "kt", label: "Knowledge transfer", done: false },
      { key: "manager", label: "Manager approval", done: false },
      { key: "hr", label: "HR approval", done: false },
      { key: "it", label: "IT clearance", done: false },
      { key: "finance", label: "Finance clearance", done: false },
    ],
    documents: [
      { name: "Experience Letter", issued: false },
      { name: "Relieving Letter", issued: false },
      { name: "Final Settlement", issued: false },
    ],
  };
}

function ExitPage() {
  const exits = useHrms((s) => s.exits);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ExitCase>(newExit());

  const stats = useMemo(() => {
    const total = exits.length;
    const inProgress = exits.filter((e) => e.stage !== "settled").length;
    const settled = exits.filter((e) => e.stage === "settled").length;
    const docsIssued = exits.reduce((s, e) => s + e.documents.filter((d) => d.issued).length, 0);
    return { total, inProgress, settled, docsIssued };
  }, [exits]);

  return (
    <>
      <PageHeader
        title="Exit Management"
        description="Resignations, clearances, and final settlements."
        actions={
          <>
            <PrintButton />
            <Button size="sm" onClick={() => { setDraft(newExit()); setOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> New exit case
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total cases" value={stats.total} icon={LogOut} />
        <StatCard label="In progress" value={stats.inProgress} icon={ShieldCheck} accent="warning" />
        <StatCard label="Settled" value={stats.settled} icon={CheckCircle2} accent="success" />
        <StatCard label="Documents issued" value={stats.docsIssued} icon={FileText} accent="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {exits.map((e) => {
          const done = e.checklist.filter((c) => c.done).length;
          const pct = Math.round((done / e.checklist.length) * 100);
          return (
            <GlassCard key={e.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{e.employee}</h3>
                    <StatusBadge status={e.stage} tone={e.stage === "settled" ? "success" : "warning"} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{e.role} · LWD {new Date(e.lastWorkingDay).toLocaleDateString()}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Reason: {e.reason || "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Clearance</div>
                  <div className="font-display text-lg font-semibold">{pct}%</div>
                </div>
              </div>

              <div className="mt-3"><Progress value={pct} /></div>

              <div className="mt-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Checklist</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {e.checklist.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">
                      <input type="checkbox" checked={c.done} onChange={() => hrms.toggleExitChecklist(e.id, c.key)} />
                      <span className={c.done ? "line-through text-muted-foreground" : ""}>{c.label}</span>
                      {c.doneAt ? <span className="ml-auto text-[10px] text-muted-foreground">{new Date(c.doneAt).toLocaleDateString()}</span> : null}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {e.documents.map((d) => (
                    <Button key={d.name} variant={d.issued ? "default" : "outline"} size="sm" onClick={() => hrms.issueExitDoc(e.id, d.name)} className="gap-1">
                      <FileText className="h-3.5 w-3.5" /> {d.issued ? `${d.name} ✓` : `Issue ${d.name}`}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {STAGES.map((s) => (
                    <button key={s} onClick={() => hrms.upsertExit({ ...e, stage: s })}
                      className={`rounded-md px-2 py-1 text-[10px] font-medium uppercase ${
                        e.stage === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New exit case</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Employee</Label><Input value={draft.employee} onChange={(e) => setDraft({ ...draft, employee: e.target.value })} /></div>
            <div><Label>Role</Label><Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></div>
            <div><Label>Resigned on</Label><Input type="date" value={draft.resignedAt.slice(0, 10)} onChange={(e) => setDraft({ ...draft, resignedAt: e.target.value })} /></div>
            <div><Label>Notice days</Label><Input type="number" value={draft.noticeDays} onChange={(e) => setDraft({ ...draft, noticeDays: Number(e.target.value) })} /></div>
            <div className="col-span-2"><Label>Last working day</Label><Input type="date" value={draft.lastWorkingDay.slice(0, 10)} onChange={(e) => setDraft({ ...draft, lastWorkingDay: e.target.value })} /></div>
            <div className="col-span-2"><Label>Reason</Label><Textarea value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (!draft.employee) return; hrms.upsertExit(draft); setOpen(false); setDraft(newExit()); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
