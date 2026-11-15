import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  LogOut,
  Package,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAurix } from "@/lib/aurix-store";
import { exitsApi } from "@/services/exitsApi";
import {
  calculateExitClearanceSummary,
  computeLastWorkingDay,
} from "@/lib/hrms/exit-helpers";
import type { ExitCase } from "@/lib/hrms/types";

const DEFAULT_NOTICE_DAYS = 30;

function stageBadgeClass(stage: string): string {
  switch (stage) {
    case "Completed":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-400";
    case "Rejected":
      return "border-rose-500/30 bg-rose-500/15 text-rose-400";
    case "Resignation Approved":
    case "Notice Period Active":
      return "border-blue-500/30 bg-blue-500/15 text-blue-400";
    case "Clearance Pending":
    case "Settlement Pending":
      return "border-amber-500/30 bg-amber-500/15 text-amber-400";
    default:
      return "border-indigo-500/30 bg-indigo-500/15 text-indigo-400";
  }
}

export function EmployeeExitPage() {
  const ws = useAurix();
  const employeeName = ws.user?.name || "Employee";
  const employeeId = ws.user?.id || "";

  const [myExits, setMyExits] = useState<ExitCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resignOpen, setResignOpen] = useState(false);

  const [resignDate, setResignDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [noticeDays, setNoticeDays] = useState<number>(DEFAULT_NOTICE_DAYS);
  const [preferredLwd, setPreferredLwd] = useState(() =>
    computeLastWorkingDay(new Date().toISOString().slice(0, 10), DEFAULT_NOTICE_DAYS),
  );
  const [reason, setReason] = useState("");
  const [handoverNotes, setHandoverNotes] = useState("");

  const loadMyExits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await exitsApi.getMyExits(employeeName, employeeId);
      setMyExits(res.items);
    } catch {
      toast.error("Unable to load your exit status.");
    } finally {
      setLoading(false);
    }
  }, [employeeName, employeeId]);

  useEffect(() => {
    loadMyExits();
  }, [loadMyExits]);

  const handleResignDateChange = (nextDate: string) => {
    setResignDate(nextDate);
    setPreferredLwd(computeLastWorkingDay(nextDate, noticeDays));
  };

  const handleNoticeDaysChange = (days: number) => {
    const safeDays = Math.max(0, Math.min(180, Number.isFinite(days) ? days : DEFAULT_NOTICE_DAYS));
    setNoticeDays(safeDays);
    setPreferredLwd(computeLastWorkingDay(resignDate, safeDays));
  };

  const activeCase = useMemo(() => {
    return myExits.find((item) => item.stage !== "Rejected") || myExits[0] || null;
  }, [myExits]);

  const clearanceSummary = useMemo(
    () => calculateExitClearanceSummary(activeCase),
    [activeCase],
  );

  const daysRemaining = useMemo(() => {
    if (!activeCase?.lastWorkingDay) return null;
    const diffMs = new Date(activeCase.lastWorkingDay).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / 86400000));
  }, [activeCase]);

  const handleSubmitResignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for your resignation.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        employee: employeeName,
        employee_name: employeeName,
        employeeId: employeeId || "EMP-SELF",
        role: "Employee",
        dept: "Engineering",
        manager: "Reporting Manager",
        resignDate,
        lastWorkingDay: preferredLwd,
        noticeDays,
        reason: reason.trim(),
        handoverNotes: handoverNotes.trim(),
        stage: "Resignation Submitted" as const,
        isResignationApproved: false,
      };
      const created = await exitsApi.createExitCase(payload);
      const savedCase: ExitCase = {
        ...payload,
        ...(created && typeof created === "object" ? created : {}),
        id: (created as any)?.id || `ext-${Date.now()}`,
        employee: employeeName,
        assetsToReturn: (created as any)?.assetsToReturn || [],
        clearances: (created as any)?.clearances || [
          { dept: "Manager Handover", owner: "Reporting Manager", status: "Pending" },
          { dept: "IT & Assets", owner: "IT Desk", status: "Pending" },
          { dept: "Finance Settlement", owner: "Payroll Team", status: "Pending" },
          { dept: "HR Operations", owner: "HR Team", status: "Pending" },
        ],
        settlement: (created as any)?.settlement || {
          baseSalaryEarned: 0,
          leaveEncashment: 0,
          bonusProrata: 0,
          incentives: 0,
          taxDeduction: 0,
          recoveryAmount: 0,
          netPayable: 0,
          paymentStatus: "Pending",
        },
        interview: (created as any)?.interview || {
          status: "Pending",
          rating: 0,
          feedback: "",
          attritionReason: reason.trim(),
        },
        deactivated: false,
        timeline: (created as any)?.timeline || [
          {
            id: `tl-${Date.now()}`,
            time: new Date().toISOString().slice(0, 10),
            label: "Resignation Submitted",
            by: employeeName,
          },
        ],
      };

      setMyExits((prev) => [savedCase, ...prev]);
      setResignOpen(false);
      setReason("");
      setHandoverNotes("");
      toast.success("Resignation request submitted for manager and HR review.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit resignation request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    try {
      await exitsApi.withdrawExit(id);
      setMyExits((prev) => prev.filter((item) => item.id !== id));
      toast.success("Resignation request withdrawn.");
    } catch {
      toast.error("Unable to withdraw resignation request.");
    }
  };

  return (
    <div className="space-y-6">
      {!activeCase && (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setResignOpen(true)}
            className="gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Submit Resignation
          </Button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Employment Status
            </CardDescription>
            <CardTitle className="font-display text-2xl font-bold text-foreground">
              {activeCase ? activeCase.stage : "Active"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {activeCase ? `Request filed ${activeCase.resignDate}` : "No active exit request"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Notice Period Policy
            </CardDescription>
            <CardTitle className="font-display text-2xl font-bold tabular-nums text-foreground">
              {activeCase?.noticeDays ?? DEFAULT_NOTICE_DAYS} Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Standard policy requirement</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Last Working Day
            </CardDescription>
            <CardTitle className="font-display text-2xl font-bold tabular-nums text-foreground">
              {activeCase?.lastWorkingDay || "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {daysRemaining !== null ? `${daysRemaining} days remaining` : "Applicable upon resignation"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Clearance Progress
            </CardDescription>
            <CardTitle className="font-display text-2xl font-bold tabular-nums text-foreground">
              {activeCase ? `${clearanceSummary.percentage}%` : "0%"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={activeCase ? clearanceSummary.percentage : 0} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading your exit status...
        </Card>
      ) : activeCase ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Request Summary */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader className="flex flex-col gap-3 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg">My Resignation Request</CardTitle>
                  <Badge variant="outline" className={stageBadgeClass(activeCase.stage)}>
                    {activeCase.stage}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  Submitted by {activeCase.employee} on {activeCase.resignDate}
                </CardDescription>
              </div>
              {activeCase.stage === "Resignation Submitted" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWithdraw(activeCase.id)}
                  className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Withdraw Request
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> Resignation Date
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{activeCase.resignDate}</div>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Notice Period
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{activeCase.noticeDays} Days</div>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Target Last Day
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{activeCase.lastWorkingDay}</div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reason Stated
                </div>
                <p className="mt-1.5 text-sm text-foreground">{activeCase.reason}</p>
              </div>

              {/* Department Clearance Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Department Clearance Checklist</h3>
                  <span className="text-xs text-muted-foreground">
                    {clearanceSummary.completedSteps} / {clearanceSummary.totalSteps} completed
                  </span>
                </div>
                <div className="divide-y divide-border/60 rounded-xl border border-border/70">
                  {activeCase.clearances.map((clr) => (
                    <div key={clr.dept} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-foreground">{clr.dept}</div>
                        <div className="text-xs text-muted-foreground">Owner: {clr.owner}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          clr.status === "Cleared"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border-amber-500/30 bg-amber-500/15 text-amber-400"
                        }
                      >
                        {clr.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Settlement & Exit Interview */}
          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" /> Full & Final Settlement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline">{activeCase.settlement.paymentStatus}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Net Payable</span>
                  <span className="font-semibold tabular-nums">
                    {activeCase.settlement.netPayable > 0
                      ? `₹${activeCase.settlement.netPayable.toLocaleString("en-IN")}`
                      : "Pending calculation"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-primary" /> Asset Return Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {activeCase.assetsToReturn.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Assigned company hardware & access badges will be listed once IT clearance starts.
                  </p>
                ) : (
                  activeCase.assetsToReturn.map((asset) => (
                    <div key={asset.assetId} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{asset.name}</span>
                      <Badge variant="outline">{asset.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardCheck className="h-4 w-4 text-primary" /> Exit Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Status: <span className="font-semibold text-foreground">{activeCase.interview.status}</span>. HR will coordinate your confidential exit feedback session prior to your last working day.
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Active Employment — No Exit Request Filed
              </CardTitle>
              <CardDescription>
                Signed in as {employeeName}. Your offboarding & resignation details remain private to you, your reporting manager, and HR.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground leading-relaxed">
                Need to initiate an exit or discuss a transition plan? You can submit a formal resignation request below. Once submitted, you will be able to track manager approval, notice period countdown, IT asset handover, and Full & Final settlement right here.
              </div>
              <Button
                onClick={() => setResignOpen(true)}
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4" />
                Submit Resignation Request
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Offboarding Guide</CardTitle>
              <CardDescription>Standard 4-stage employee exit flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/15 font-semibold text-indigo-400">1</span>
                <span>Submit resignation & propose last working day</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/15 font-semibold text-indigo-400">2</span>
                <span>Reporting manager & HR confirm notice period</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/15 font-semibold text-indigo-400">3</span>
                <span>Complete project handover, IT asset return & exit interview</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/15 font-semibold text-indigo-400">4</span>
                <span>Receive Full & Final settlement and relieving letters</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Resignation Modal */}
      <Dialog open={resignOpen} onOpenChange={setResignOpen}>
        <DialogContent className="max-w-md border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <LogOut className="h-5 w-5 text-indigo-400" />
              Submit Resignation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submitting on behalf of <strong>{employeeName}</strong>. Your reporting manager and HR Operations will review this request.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitResignation} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="emp-resign-date" className="text-xs">Resignation Date</Label>
                <Input
                  id="emp-resign-date"
                  type="date"
                  value={resignDate}
                  onChange={(e) => handleResignDateChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-notice-days" className="text-xs">Notice Period (Days)</Label>
                <Input
                  id="emp-notice-days"
                  type="number"
                  min={0}
                  max={180}
                  value={noticeDays}
                  onChange={(e) => handleNoticeDaysChange(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emp-lwd" className="text-xs">Preferred Last Working Day</Label>
              <Input
                id="emp-lwd"
                type="date"
                value={preferredLwd}
                onChange={(e) => setPreferredLwd(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emp-resign-reason" className="text-xs">Primary Reason</Label>
              <Textarea
                id="emp-resign-reason"
                rows={3}
                placeholder="Share your primary reason for leaving..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emp-handover-notes" className="text-xs">Handover Plan (Optional)</Label>
              <Textarea
                id="emp-handover-notes"
                rows={2}
                placeholder="Mention key projects or documentation you will hand over..."
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>You can withdraw this resignation anytime while it is in "Resignation Submitted" status.</span>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setResignOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white hover:bg-indigo-700">
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeExitPage;
