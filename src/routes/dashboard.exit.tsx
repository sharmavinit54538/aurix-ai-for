import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { LogOut, FileText, ShieldCheck, CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, PrintButton, Progress, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { ExitCase, ExitStage, ExitTimelineEvent } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAurix, type Employee } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/exit")({
  head: () => ({ meta: [{ title: "Exit Management — Aurix" }] }),
  component: ExitPage,
});

const STAGES: ExitStage[] = ["requested", "under-review", "approved", "notice", "clearance", "settlement", "completed", "cancelled"];

function newExit(employeeProfile?: Employee): ExitCase {
  const employeeName = employeeProfile?.fullName || "";
  const employeeRole = employeeProfile?.designation || "";
  const employeeId = employeeProfile?.employeeId || "";
  const department = employeeProfile?.department || "";
  const joiningDate = employeeProfile?.joiningDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const managerName = employeeProfile?.managerName || "Maya Chen";

  return {
    id: newId("ex"), employee: employeeName, role: employeeRole, resignedAt: new Date().toISOString().slice(0, 10),
    noticeDays: 60, lastWorkingDay: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10),
    reason: "", stage: "requested",
    checklist: [
      { key: "assets", label: "Asset return checklist", done: false },
      { key: "kt", label: "Knowledge transfer", done: false },
      { key: "manager", label: "Manager approval", done: false },
      { key: "hr", label: "HR approval", done: false },
      { key: "it", label: "IT clearance", done: false },
      { key: "finance", label: "Finance clearance", done: false },
    ],
    documents: [
      { name: "Experience Letter", issued: false },
      { name: "Relieving Letter", issued: false },
      { name: "Final Settlement Letter", issued: false },
      { name: "No Dues Certificate", issued: false }
    ],
    employeeId: employeeId,
    department: department,
    designation: employeeRole,
    joiningDate: joiningDate,
    managerName: managerName,
    remainingDays: 60,
    managerApprovalStatus: "pending",
    hrApprovalStatus: "pending",
    clearanceWorkflow: [
      { department: "HR", status: "pending" },
      { department: "IT", status: "pending" },
      { department: "Finance", status: "pending" },
      { department: "Admin", status: "pending" },
      { department: "Manager", status: "pending" }
    ],
    assignedAssets: [
      { id: newId("ret"), assetId: "a1", assetName: "MacBook Pro 14 M3", category: "laptop", serial: "C02XJ1", status: "pending" },
      { id: newId("ret"), assetId: "a3", assetName: "LG UltraFine 27", category: "monitor", serial: "LG2701", status: "pending" },
      { id: newId("ret"), assetId: "a10", assetName: "Aurix access ID Card", category: "accessory", serial: "AC-19401", status: "pending" }
    ],
    timeline: [
      { id: newId("tl"), event: "Exit Requested", performedBy: employeeName || "Employee", timestamp: new Date().toISOString(), notes: "Submitted resignation request." }
    ]
  };
}

function ExitPage() {
  const exits = useHrms((s) => s.exits);
  const ws = useAurix();
  const role = (ws.user?.role ?? "admin") as string;

  const employeeProfile = useMemo(() => {
    return ws.employees.find((emp) => emp.fullName === ws.user?.fullName || emp.email === ws.user?.email);
  }, [ws.employees, ws.user]);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ExitCase>(newExit(employeeProfile));

  const myExits = useMemo(() => {
    if (role === "employee") {
      return exits.filter((e) => e.employee === ws.user?.fullName);
    }
    return exits;
  }, [exits, role, ws.user]);

  const hasExitCase = myExits.length > 0;

  useEffect(() => {
    if (role !== "employee") return;
    const activeExit = myExits.find((e) => e.stage !== "completed" && e.stage !== "cancelled");
    if (!activeExit) return;

    // Simulated Auto-approvals sequentially:
    // Step 1: Manager approval (after 4s)
    const managerDone = activeExit.checklist.find((c) => c.key === "manager")?.done;
    if (!managerDone) {
      const timer = setTimeout(() => {
        hrms.toggleExitChecklist(activeExit.id, "manager");
        toast.success("Manager approved your resignation request!");
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Step 2: HR approval (after 4s from manager)
    const hrDone = activeExit.checklist.find((c) => c.key === "hr")?.done;
    if (!hrDone) {
      const timer = setTimeout(() => {
        hrms.toggleExitChecklist(activeExit.id, "hr");
        toast.success("HR department approved your exit request!");
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Step 3: Asset return & IT clearance (after 4s from HR)
    const itDone = activeExit.checklist.find((c) => c.key === "it")?.done;
    const assetsDone = activeExit.checklist.find((c) => c.key === "assets")?.done;
    if (!itDone || !assetsDone) {
      const timer = setTimeout(() => {
        if (!assetsDone) hrms.toggleExitChecklist(activeExit.id, "assets");
        if (!itDone) hrms.toggleExitChecklist(activeExit.id, "it");
        toast.success("IT Department: Asset return & clearance completed!");
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Step 4: Finance clearance & Knowledge Transfer (after 4s from IT)
    const financeDone = activeExit.checklist.find((c) => c.key === "finance")?.done;
    const ktDone = activeExit.checklist.find((c) => c.key === "kt")?.done;
    if (!financeDone || !ktDone) {
      const timer = setTimeout(() => {
        if (!financeDone) hrms.toggleExitChecklist(activeExit.id, "finance");
        if (!ktDone) hrms.toggleExitChecklist(activeExit.id, "kt");
        
        // Auto issue letters
        activeExit.documents.forEach((doc) => {
          hrms.issueExitDoc(activeExit.id, doc.name);
        });

        toast.success("Finance department clearance complete! All letters generated successfully.");
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Step 5: Transition exit stage to completed (after 4s from Step 4)
    const allDone = activeExit.checklist.every((c) => c.done);
    if (allDone && activeExit.stage !== "completed") {
      const timer = setTimeout(() => {
        hrms.upsertExit({ ...activeExit, stage: "completed" });
        toast.success("Exit process completed! You are officially relieved from your duties.");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [myExits, role]);

  const stats = useMemo(() => {
    const total = exits.length;
    const inProgress = exits.filter((e) => e.stage !== "settled" && e.stage !== "completed" && e.stage !== "cancelled").length;
    const settled = exits.filter((e) => e.stage === "settled" || e.stage === "completed").length;
    const docsIssued = exits.reduce((s, e) => s + e.documents.filter((d) => d.issued).length, 0);
    return { total, inProgress, settled, docsIssued };
  }, [exits]);

  const handleResignedAtChange = (dateVal: string) => {
    const notice = draft.noticeDays || 60;
    const lwd = new Date(new Date(dateVal).getTime() + notice * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setDraft({ ...draft, resignedAt: dateVal, lastWorkingDay: lwd });
  };

  const handleNoticeDaysChange = (daysVal: number) => {
    const resign = draft.resignedAt || new Date().toISOString().slice(0, 10);
    const lwd = new Date(new Date(resign).getTime() + daysVal * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setDraft({ ...draft, noticeDays: daysVal, lastWorkingDay: lwd });
  };

  return (
    <>
      <PageHeader
        title="Exit Management"
        description={role === "employee" ? "Track your resignation process, clearance checklist, and settlement documents." : "Resignations, clearances, and final settlements."}
        actions={
          <>
            <PrintButton />
            {(!hasExitCase || role !== "employee") && (
              <Button size="sm" onClick={() => { setDraft(newExit(employeeProfile)); setOpen(true); }} className="gap-2">
                <Plus className="h-4 w-4" /> {role === "employee" ? "Initiate Resignation" : "New exit case"}
              </Button>
            )}
          </>
        }
      />

      {role !== "employee" && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total cases" value={stats.total} icon={LogOut} />
          <StatCard label="In progress" value={stats.inProgress} icon={ShieldCheck} accent="warning" />
          <StatCard label="Settled" value={stats.settled} icon={CheckCircle2} accent="success" />
          <StatCard label="Documents issued" value={stats.docsIssued} icon={FileText} accent="brand" />
        </div>
      )}

      {myExits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
            <LogOut className="h-5 w-5" />
          </div>
          <h2 className="font-display text-lg font-semibold tracking-tight">No Exit Requests</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {role === "employee"
              ? "You have not submitted any exit or resignation requests. If you wish to resign, you can initiate the process by clicking the button below."
              : "No exit or resignation cases have been registered in the system."}
          </p>
          {role === "employee" && (
            <Button className="mt-4" onClick={() => { setDraft(newExit(employeeProfile)); setOpen(true); }}>
              Initiate Resignation
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {myExits.map((e) => {
            const done = e.checklist.filter((c) => c.done).length;
            const pct = Math.round((done / e.checklist.length) * 100);

            if (role === "employee" && (e.stage === "completed" || e.stage === "settled")) {
              return (
                <GlassCard key={e.id} className="text-center p-8 space-y-6 max-w-xl mx-auto border-emerald-500/20 bg-emerald-500/5">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-glow shadow-emerald-500/25">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">Relieved & Settled</h3>
                    <p className="text-sm text-muted-foreground">Thank you for your valuable contributions, <strong>{e.employee}</strong>!</p>
                  </div>

                  <div className="border-t border-b border-border/60 py-4 grid grid-cols-2 gap-4 text-left text-xs bg-background/20 rounded-xl p-4">
                    <div>
                      <span className="text-muted-foreground block">Employee ID</span>
                      <span className="font-semibold text-foreground">{e.employeeId || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Department</span>
                      <span className="font-semibold text-foreground">{e.department || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Joining Date</span>
                      <span className="font-semibold text-foreground">{e.joiningDate || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Last Working Day</span>
                      <span className="font-semibold text-foreground">{new Date(e.lastWorkingDay).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Your Exit Documents</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {e.documents.map((d) => (
                        <Button
                          key={d.name}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            toast.success(`Downloading ${d.name}...`);
                          }}
                          className="w-full justify-start gap-2 text-xs"
                        >
                          <FileText className="h-4 w-4 text-emerald-500" />
                          <span>{d.name} ✓</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-muted-foreground italic">
                    "Wishing you the absolute best in all your future endeavors. Farewell!"
                  </div>
                </GlassCard>
              );
            }

            return (
              <GlassCard key={e.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{e.employee}</h3>
                      <StatusBadge status={e.stage} tone={e.stage === "settled" || e.stage === "completed" ? "success" : "warning"} />
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
                      <label key={c.key} className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm cursor-pointer hover:bg-card/60 transition-colors">
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
                      <Button
                        key={d.name}
                        variant={d.issued ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (!d.issued) {
                            hrms.issueExitDoc(e.id, d.name);
                            toast.success(`${d.name} generated and issued successfully!`);
                          } else {
                            toast.success(`Downloading ${d.name}...`);
                          }
                        }}
                        className="gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {d.issued ? `${d.name} ✓` : `Generate ${d.name}`}
                      </Button>
                    ))}
                  </div>
                  {role !== "employee" && (
                    <div className="flex gap-1">
                      {STAGES.map((s) => (
                        <button key={s} onClick={() => hrms.upsertExit({ ...e, stage: s })}
                          className={`rounded-md px-2 py-1 text-[10px] font-medium uppercase ${
                            e.stage === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{role === "employee" ? "Initiate Resignation" : "New exit case"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Employee</Label>
              <Input value={draft.employee} disabled={role === "employee"} onChange={(e) => setDraft({ ...draft, employee: e.target.value })} />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={draft.role} disabled={role === "employee"} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
            </div>
            <div><Label>Resigned on</Label><Input type="date" value={draft.resignedAt.slice(0, 10)} onChange={(e) => handleResignedAtChange(e.target.value)} /></div>
            <div><Label>Notice days</Label><Input type="number" value={draft.noticeDays} onChange={(e) => handleNoticeDaysChange(Number(e.target.value))} /></div>
            <div className="col-span-2"><Label>Last working day</Label><Input type="date" value={draft.lastWorkingDay.slice(0, 10)} onChange={(e) => setDraft({ ...draft, lastWorkingDay: e.target.value })} /></div>
            <div className="col-span-2"><Label>Reason</Label><Textarea value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (!draft.employee) return; hrms.upsertExit(draft); setOpen(false); setDraft(newExit(employeeProfile)); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
