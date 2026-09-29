import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LogOut,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Calendar,
  Briefcase,
  Check,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { PrintButton, StatCard, StatusBadge, EmptyState, SearchBox } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { ExitCase, ExitStage } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/exit")({
  head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
  component: ExitPage,
});

const STAGES: ExitStage[] = ["resignation", "notice", "interview", "assets", "hr", "manager", "it", "finance", "settled"];

function newExit(): ExitCase {
  return {
    id: newId("ex"),
    employee: "",
    role: "",
    resignedAt: new Date().toISOString().slice(0, 10),
    noticeDays: 60,
    lastWorkingDay: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10),
    reason: "",
    stage: "resignation",
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
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = exits.length;
    const inProgress = exits.filter((e) => e.stage !== "settled").length;
    const settled = exits.filter((e) => e.stage === "settled").length;
    const docsIssued = exits.reduce((s, e) => s + e.documents.filter((d) => d.issued).length, 0);
    return { total, inProgress, settled, docsIssued };
  }, [exits]);

  const filteredExits = useMemo(() => {
    if (!search.trim()) return exits;
    const q = search.toLowerCase();
    return exits.filter(
      (e) =>
        e.employee.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.stage.toLowerCase().includes(q) ||
        (e.reason && e.reason.toLowerCase().includes(q)),
    );
  }, [exits, search]);

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

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by employee, role, or stage…"
        />
        <div className="text-xs text-muted-foreground">
          Showing {filteredExits.length} of {exits.length} case{exits.length === 1 ? "" : "s"}
        </div>
      </div>

      {filteredExits.length === 0 ? (
        <EmptyState
          title="No exit cases found"
          description={search ? `No exit records match "${search}".` : "There are currently no exit cases recorded."}
          icon={LogOut}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredExits.map((e) => {
            const done = e.checklist.filter((c) => c.done).length;
            const totalChecklist = e.checklist.length;
            const pct = totalChecklist > 0 ? Math.round((done / totalChecklist) * 100) : 0;
            const docsIssuedCount = e.documents.filter((d) => d.issued).length;
            const stageIdx = STAGES.indexOf(e.stage);

            const initials = e.employee
              ? e.employee
                  .trim()
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "EX";

            return (
              <div
                key={e.id}
                className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur-xl shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md space-y-4 overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border/40">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border border-violet-500/30 text-foreground font-bold text-sm shadow-sm">
                      {initials}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-foreground tracking-tight">
                          {e.employee || "Unnamed Employee"}
                        </h3>
                        <StatusBadge
                          status={e.stage}
                          tone={e.stage === "settled" ? "success" : e.stage === "resignation" ? "warning" : "info"}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          {e.role || "Employee"}
                        </span>
                        <span className="text-muted-foreground/40">•</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          LWD: <span className="font-medium text-foreground/90">{new Date(e.lastWorkingDay).toLocaleDateString()}</span>
                        </span>
                        {e.noticeDays ? (
                          <>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {e.noticeDays}d notice
                            </span>
                          </>
                        ) : null}
                      </div>

                      {e.reason && (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground border border-border/40">
                            <span className="font-medium text-foreground/70">Reason:</span> {e.reason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clearance Stat */}
                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-0.5 shrink-0 bg-muted/20 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Clearance
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-display text-2xl font-bold tracking-tight ${pct === 100 ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}>
                        {pct}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        ({done}/{totalChecklist})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clearance Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Clearance Progress</span>
                    <span className={pct === 100 ? "text-emerald-500 font-medium" : ""}>
                      {pct === 100 ? "All requirements cleared" : `${totalChecklist - done} item${totalChecklist - done === 1 ? "" : "s"} pending`}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50 border border-border/30">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 
                          ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" 
                          : "linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)",
                      }}
                    />
                  </div>
                </div>

                {/* Checklist Section */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      Department Clearance Checklist
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {done}/{totalChecklist} Done
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {e.checklist.map((c) => (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => hrms.toggleExitChecklist(e.id, c.key)}
                        className={`group flex items-center justify-between gap-2 rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer ${
                          c.done
                            ? "border-emerald-500/30 bg-emerald-500/5 text-foreground hover:bg-emerald-500/10"
                            : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all ${
                              c.done
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                                : "border-border bg-background group-hover:border-primary/60"
                            }`}
                          >
                            {c.done && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <span className={`truncate font-medium ${c.done ? "line-through text-muted-foreground" : ""}`}>
                            {c.label}
                          </span>
                        </div>

                        {c.doneAt && (
                          <span className="shrink-0 text-[10px] text-muted-foreground/80 bg-background/80 px-1.5 py-0.5 rounded border border-border/40 font-mono">
                            {new Date(c.doneAt).toLocaleDateString()}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exit Pipeline / Workflow Stages */}
                <div className="pt-2 border-t border-border/50">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span>Exit Workflow Stage</span>
                    </div>
                    <span className="text-[11px] font-medium capitalize text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      Current: {e.stage}
                    </span>
                  </div>

                  {/* Stage Pills Container: Clean wrapping layout that never overflows */}
                  <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-muted/30 border border-border/40">
                    {STAGES.map((s, idx) => {
                      const isCurrent = e.stage === s;
                      const isPast = idx < stageIdx;

                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => hrms.upsertExit({ ...e, stage: s })}
                          title={`Set stage to ${s}`}
                          className={`group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground font-semibold shadow-sm ring-1 ring-primary/40"
                              : isPast
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15"
                              : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-accent/60 border border-transparent"
                          }`}
                        >
                          {isPast ? (
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                          ) : isCurrent ? (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground animate-pulse" />
                          ) : (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                          )}
                          <span>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settlement & Exit Documents */}
                <div className="pt-2 border-t border-border/50">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>Settlement & Exit Documents</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {docsIssuedCount}/{e.documents.length} Issued
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {e.documents.map((d) => (
                      <Button
                        key={d.name}
                        type="button"
                        variant={d.issued ? "default" : "outline"}
                        size="sm"
                        onClick={() => hrms.issueExitDoc(e.id, d.name)}
                        className={`h-9 w-full justify-between gap-1.5 px-3 text-xs font-medium transition-all ${
                          d.issued
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm"
                            : "border-border/80 hover:bg-accent hover:border-primary/40 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText className={`h-3.5 w-3.5 shrink-0 ${d.issued ? "text-white" : "text-primary"}`} />
                          <span className="truncate">{d.name}</span>
                        </div>
                        {d.issued ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-semibold shrink-0">
                            <Check className="h-2.5 w-2.5" /> Issued
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground shrink-0 uppercase tracking-wider">
                            Issue
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

