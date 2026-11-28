/**
 * Modular Dialog & Drawer Components for OFC360 Compensation Management:
 * - CompensationViewDrawer (Employee details, summary, salary component breakdown)
 * - CompensationHistoryDialog (Immutable revision audit timeline + maker-checker signoff)
 * - CompensationRevisionDialog (Structured CTC revision / structure assignment + confirmation)
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CheckCircle as ApproveIcon,
  History,
  Layers,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  XCircle as RejectIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeAvatar } from "@/features/admin/employees/components/EmployeeAvatar";
import { formatDate } from "@/lib/format";
import { formatPaiseToINR, toPaise } from "../utils/money";
import type {
  CompensationRevisionRecord,
  CompensationStatus,
  EmployeeCompensation,
  SalaryStructureTemplate,
} from "../types/compensation";

export function formatCompensationStatusLabel(
  status: CompensationStatus,
  rawStatus?: string | null
): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "scheduled":
      return "Scheduled";
    case "expired":
      return "Expired";
    case "pending_approval":
      return "Pending Approval";
    case "superseded":
      return "Superseded";
    case "draft":
      return "Draft";
    case "historical":
      return "Historical";
    case "not_assigned":
      return "Not Assigned";
    case "unknown":
      return rawStatus ? rawStatus.replace(/_/g, " ") : "Not Available";
  }
}

export function getCompensationStatusBadgeClass(status: CompensationStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
    case "scheduled":
      return "border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-300";
    case "pending_approval":
      return "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300";
    case "inactive":
    case "expired":
      return "border-rose-500/30 bg-rose-500/12 text-rose-700 dark:text-rose-300";
    case "superseded":
    case "historical":
    case "draft":
      return "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300";
    case "not_assigned":
    case "unknown":
      return "border-border bg-muted text-muted-foreground";
  }
}

function formatEmploymentTypeLabel(val?: string): string {
  if (!val) return "Not Available";
  return val
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── 1. View Compensation Details Drawer ──────────────────────────────────────
interface CompensationViewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeCompensation | null;
  loading: boolean;
  onOpenHistory: (emp: EmployeeCompensation) => void;
  onOpenRevise: (emp: EmployeeCompensation) => void;
}

export function CompensationViewDrawer({
  open,
  onOpenChange,
  employee,
  loading,
  onOpenHistory,
  onOpenRevise,
}: CompensationViewDrawerProps) {
  const earnings = useMemo(
    () => (employee?.components || []).filter((c) => c.type === "earning"),
    [employee?.components]
  );
  const deductions = useMemo(
    () => (employee?.components || []).filter((c) => c.type === "deduction"),
    [employee?.components]
  );
  const employerContributions = useMemo(
    () => (employee?.components || []).filter((c) => c.type === "employer_contribution"),
    [employee?.components]
  );

  const earningsAnnualSumPaise = useMemo(
    () =>
      earnings.reduce(
        (sum, c) => sum + (c.annualAmountPaise ?? (c.monthlyAmountPaise ?? 0) * 12),
        0
      ),
    [earnings]
  );

  const employerAnnualSumPaise = useMemo(
    () =>
      employerContributions.reduce(
        (sum, c) => sum + (c.annualAmountPaise ?? (c.monthlyAmountPaise ?? 0) * 12),
        0
      ),
    [employerContributions]
  );

  const componentsCount = employee?.components?.length ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="border-b border-border/70 pb-4 pr-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <EmployeeAvatar
                src={employee?.profileImage}
                name={employee?.employeeName || "Employee"}
                className="h-11 w-11 rounded-full object-cover shrink-0 border border-border"
                fallbackClassName="h-11 w-11 rounded-full inline-flex items-center justify-center bg-primary/10 font-semibold text-primary text-sm shrink-0"
              />
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold truncate">
                  {employee?.employeeName || "Employee Name Not Available"}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono text-muted-foreground">
                  {employee?.employeeCode ? `Code: ${employee.employeeCode}` : "Code: Not Available"}
                  {employee?.department ? ` • ${employee.department}` : ""}
                </SheetDescription>
              </div>
            </div>
            {employee && (
              <Badge
                variant="outline"
                className={`shrink-0 text-[11px] font-medium ${getCompensationStatusBadgeClass(employee.status)}`}
              >
                {formatCompensationStatusLabel(employee.status, employee.statusRaw)}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <span>Loading authoritative compensation breakdown...</span>
          </div>
        )}

        {employee && !loading && (
          <div className="space-y-6 py-5 text-xs">
            {/* Employee Details */}
            <section className="space-y-2.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Employee Master Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Employee Name</div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {employee.employeeName || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Employee Code</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {employee.employeeCode || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Department</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.department || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Designation</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.designation || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Employment Type</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {formatEmploymentTypeLabel(employee.employmentType)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Date of Joining</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.joiningDate ? formatDate(employee.joiningDate) : "Not Available"}
                  </div>
                </div>
              </div>
            </section>

            {/* Compensation Summary */}
            <section className="space-y-2.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Compensation Summary ({employee.currency || "INR"})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/70 p-3">
                  <div className="text-[10px] text-muted-foreground">Annual CTC</div>
                  <div className="mt-1 font-mono text-sm font-bold text-foreground tabular-nums">
                    {employee.ctcAnnualFormatted !== "—" ? employee.ctcAnnualFormatted : "Not Configured"}
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-3">
                  <div className="text-[10px] text-muted-foreground">Monthly CTC</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">
                    {employee.ctcMonthlyFormatted !== "—" ? employee.ctcMonthlyFormatted : "Not Available"}
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="text-[10px] text-muted-foreground">Monthly Gross Salary</div>
                  <div className="mt-1 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    {employee.grossMonthlyFormatted !== "—" ? employee.grossMonthlyFormatted : "Not Available"}
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-3">
                  <div className="text-[10px] text-muted-foreground">Annual Gross Salary</div>
                  <div className="mt-1 font-mono text-xs font-semibold text-foreground tabular-nums">
                    {employee.grossAnnualFormatted !== "—" ? employee.grossAnnualFormatted : "Not Available"}
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-3">
                  <div className="text-[10px] text-muted-foreground">Fixed / Variable Pay</div>
                  <div className="mt-1 font-mono text-xs text-foreground tabular-nums">
                    {employee.fixedPayFormatted !== "—" || employee.variablePayFormatted !== "—"
                      ? `${employee.fixedPayFormatted} / ${employee.variablePayFormatted}`
                      : "Not Available"}
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-3">
                  <div className="text-[10px] text-muted-foreground">Employer Contributions</div>
                  <div className="mt-1 font-mono text-xs font-semibold text-foreground tabular-nums">
                    {employee.employerContributionsFormatted !== "—"
                      ? employee.employerContributionsFormatted
                      : "Not Available"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Salary Structure</div>
                  <div className="font-semibold text-primary mt-0.5">
                    {employee.structureName || "Not Assigned"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Effective Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.effectiveDate ? formatDate(employee.effectiveDate) : "Not Configured"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Last Revision</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.lastRevisionDate ? formatDate(employee.lastRevisionDate) : "—"}
                  </div>
                </div>
              </div>
            </section>

            {/* Salary Components Breakdown */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Salary Components Breakdown
                </h3>
                {componentsCount > 0 && employee.ctcAnnualPaise !== null && (
                  <span className="text-[11px] text-muted-foreground">
                    Earnings + Employer:{" "}
                    <strong className="font-mono text-foreground">
                      {formatPaiseToINR(earningsAnnualSumPaise + employerAnnualSumPaise)}
                    </strong>
                  </span>
                )}
              </div>

              {componentsCount === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-5 text-center text-muted-foreground">
                  <Layers className="h-6 w-6 mx-auto mb-1.5 opacity-60" />
                  <p className="font-medium text-foreground">Salary Component Breakdown Not Available</p>
                  <p className="text-[11px] mt-0.5">
                    No individualized pay component lines were returned by the backend compensation API for this record.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/70">
                      <tr>
                        <th className="px-3 py-2.5">Component</th>
                        <th className="px-3 py-2.5">Type</th>
                        <th className="px-3 py-2.5 text-right font-mono">Monthly</th>
                        <th className="px-3 py-2.5 text-right font-mono">Annual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {[...earnings, ...deductions, ...employerContributions].map((comp) => (
                        <tr key={`${comp.componentId}-${comp.code}`}>
                          <td className="px-3 py-2">
                            <div className="font-medium text-foreground">{comp.name}</div>
                            <div className="font-mono text-[10px] text-muted-foreground">{comp.code}</div>
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {comp.type.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground">
                            {comp.monthlyFormatted}
                          </td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums font-medium text-foreground">
                            {comp.annualFormatted}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/70 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!employee.employeeId}
                onClick={() => {
                  onOpenChange(false);
                  onOpenHistory(employee);
                }}
                className="h-8 gap-1.5 rounded-xl text-xs"
              >
                <History className="h-3.5 w-3.5" />
                Revision History
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!employee.employeeId}
                onClick={() => {
                  onOpenChange(false);
                  onOpenRevise(employee);
                }}
                className="h-8 gap-1.5 rounded-xl text-xs"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Revise CTC
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── 2. Immutable Revision History Modal ──────────────────────────────────────
interface CompensationHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeCompensation | null;
  loading: boolean;
  error: string | null;
  canApprove: boolean;
  onApproveClick: (rev: CompensationRevisionRecord) => void;
  onRejectClick: (rev: CompensationRevisionRecord) => void;
}

export function CompensationHistoryDialog({
  open,
  onOpenChange,
  employee,
  loading,
  error,
  canApprove,
  onApproveClick,
  onRejectClick,
}: CompensationHistoryDialogProps) {
  const revisions = employee?.revisions || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <History className="h-4 w-4 text-primary" />
            <span>
              Compensation History: {employee?.employeeName || "Employee"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Immutable audit trail of salary revisions, structure changes, maker-checker sign-offs, and effective dates
            {employee?.employeeCode ? ` • ${employee.employeeCode}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[26rem] space-y-3 overflow-y-auto py-2 text-xs">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span>Loading compensation revision history...</span>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-300">
              {error}
            </div>
          ) : revisions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <Calendar className="h-7 w-7 mx-auto mb-2 opacity-60" />
              <p className="font-medium text-foreground">No Historical Revisions Recorded</p>
              <p className="text-[11px] mt-0.5">
                This employee does not have any prior or pending CTC revision records in the backend.
              </p>
            </div>
          ) : (
            revisions.map((rev) => {
              const makerName = rev.maker?.name || "—";
              const checkerName = rev.checker?.name;
              const pctText =
                rev.changePercentage !== null && Number.isFinite(rev.changePercentage)
                  ? `${rev.changePercentage >= 0 ? "+" : ""}${rev.changePercentage.toFixed(2)}%`
                  : null;

              return (
                <div key={rev.id} className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        Revision #{rev.revisionNumber}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Effective: {rev.effectiveDate ? formatDate(rev.effectiveDate) : "Not Available"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        rev.status === "approved"
                          ? "default"
                          : rev.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      className="capitalize text-[10px]"
                    >
                      {String(rev.status || "unknown").replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-lg bg-muted/30 p-2.5">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Annual CTC Change</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono">
                        <span>{rev.previousCtcFormatted}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-bold text-foreground">{rev.newCtcFormatted}</span>
                        {rev.revisionAmountFormatted && rev.revisionAmountFormatted !== "—" && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300">
                            ({rev.revisionAmountFormatted}{pctText ? ` / ${pctText}` : ""})
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-muted-foreground">Monthly Gross Change</div>
                      <div className="mt-0.5 flex items-center gap-1.5 font-mono">
                        <span>{rev.previousMonthlyGrossFormatted || "—"}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {rev.newMonthlyGrossFormatted || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(rev.previousStructureName || rev.newStructureName) && (
                    <div className="text-[11px] text-muted-foreground">
                      Structure:{" "}
                      <span className="text-foreground">{rev.previousStructureName || "—"}</span>
                      <span className="mx-1.5">→</span>
                      <span className="font-medium text-primary">{rev.newStructureName || "—"}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-foreground">
                    <span className="text-muted-foreground">Reason: </span>
                    {rev.reason || "Not Available"}
                  </p>

                  {rev.rejectionReason && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400">
                      Rejection Reason: {rev.rejectionReason}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                    <span>
                      Revised By: <strong className="text-foreground">{makerName}</strong>
                      {rev.revisionDate || rev.createdAt
                        ? ` on ${formatDate(rev.revisionDate || rev.createdAt)}`
                        : ""}
                    </span>
                    <span>
                      {checkerName
                        ? `Approved By: ${checkerName}${rev.reviewedAt ? ` (${formatDate(rev.reviewedAt)})` : ""}`
                        : rev.status === "pending_approval"
                          ? "Awaiting Checker Approval"
                          : "—"}
                    </span>
                  </div>

                  {rev.status === "pending_approval" && canApprove && (
                    <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onRejectClick(rev)}
                        className="h-7 text-xs text-rose-600 hover:text-rose-700"
                      >
                        <RejectIcon className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onApproveClick(rev)}
                        className="h-7 text-xs"
                      >
                        <ApproveIcon className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── 3. Structured Revise CTC Dialog with Confirmation ────────────────────────
interface CompensationRevisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeCompensation | null;
  structures: SalaryStructureTemplate[];
  submitting: boolean;
  onSubmitRevision: (payload: {
    newCtcAnnualPaise: number;
    salaryStructureId?: string;
    revisionPercentage?: number;
    effectiveDate: string;
    reason: string;
    notes?: string;
  }) => Promise<void>;
}

export function CompensationRevisionDialog({
  open,
  onOpenChange,
  employee,
  structures,
  submitting,
  onSubmitRevision,
}: CompensationRevisionDialogProps) {
  const [newCtcRupees, setNewCtcRupees] = useState("");
  const [revisionPct, setRevisionPct] = useState("");
  const [selectedStructureId, setSelectedStructureId] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const initializedForKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      initializedForKeyRef.current = null;
      return;
    }
    if (!employee) return;
    const key = employee.employeeId || employee.id;
    if (initializedForKeyRef.current === key) return;
    initializedForKeyRef.current = key;

    setSelectedStructureId(employee.structureId || "");
    const initialRupees =
      employee.ctcAnnualPaise !== null && employee.ctcAnnualPaise > 0
        ? String(employee.ctcAnnualPaise / 100)
        : "";
    setNewCtcRupees(initialRupees);
    setRevisionPct("");
    setEffectiveDate("");
    setReason("");
    setNotes("");
    setConfirmStep(false);
    setValidationError(null);
  }, [open, employee]);

  const nowLocal = new Date();
  const todayLocalStr = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, "0")}-${String(nowLocal.getDate()).padStart(2, "0")}`;
  const isPastEffectiveDate = Boolean(effectiveDate && effectiveDate < todayLocalStr);

  const currentAnnualPaise = employee?.ctcAnnualPaise ?? null;
  const revisedAnnualPaise = newCtcRupees.trim() ? toPaise(newCtcRupees) : 0;
  const differencePaise =
    currentAnnualPaise !== null && revisedAnnualPaise > 0
      ? revisedAnnualPaise - currentAnnualPaise
      : null;
  const computedPct =
    currentAnnualPaise !== null && currentAnnualPaise > 0 && differencePaise !== null
      ? Number(((differencePaise / currentAnnualPaise) * 100).toFixed(2))
      : null;

  const selectedStructure = useMemo(
    () => structures.find((s) => s.id === selectedStructureId) || null,
    [structures, selectedStructureId]
  );

  const handleCtcInputChange = (val: string) => {
    setNewCtcRupees(val);
    setConfirmStep(false);
    setValidationError(null);
    if (currentAnnualPaise && currentAnnualPaise > 0) {
      const nextPaise = toPaise(val);
      if (nextPaise > 0) {
        const pct = (((nextPaise - currentAnnualPaise) / currentAnnualPaise) * 100).toFixed(2);
        setRevisionPct(pct);
      } else {
        setRevisionPct("");
      }
    }
  };

  const handlePctInputChange = (val: string) => {
    setRevisionPct(val);
    setConfirmStep(false);
    setValidationError(null);
    const pctNum = Number(val);
    if (currentAnnualPaise && currentAnnualPaise > 0 && Number.isFinite(pctNum)) {
      const nextRupees = ((currentAnnualPaise / 100) * (1 + pctNum / 100)).toFixed(2);
      setNewCtcRupees(nextRupees);
    }
  };

  const validateAndAdvance = () => {
    if (!employee) return;
    if (!newCtcRupees.trim() || revisedAnnualPaise <= 0) {
      setValidationError("Please enter a valid positive Revised Annual CTC.");
      return;
    }
    if (!effectiveDate) {
      setValidationError("Effective From Date is required.");
      return;
    }
    if (!reason.trim()) {
      setValidationError("Revision Reason is required.");
      return;
    }
    setValidationError(null);
    setConfirmStep(true);
  };

  const handleConfirmSubmit = async () => {
    if (!employee || submitting) return;
    const pctVal = revisionPct.trim() && Number.isFinite(Number(revisionPct))
      ? Number(revisionPct)
      : computedPct ?? undefined;

    await onSubmitRevision({
      newCtcAnnualPaise: revisedAnnualPaise,
      salaryStructureId: selectedStructureId || undefined,
      revisionPercentage: pctVal,
      effectiveDate,
      reason: reason.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Revise Employee Compensation</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Submit a maker-checker CTC revision for{" "}
            <strong className="text-foreground">{employee?.employeeName || "Employee"}</strong>
            {employee?.employeeCode ? ` (${employee.employeeCode})` : ""}. Historical compensation records remain preserved.
          </DialogDescription>
        </DialogHeader>

        {employee && (
          <div className="space-y-4 py-1 text-xs">
            {/* Current Compensation Context */}
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current Compensation Baseline
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Salary Structure</div>
                  <div className="font-medium text-foreground mt-0.5 truncate">
                    {employee.structureName || "Not Assigned"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Current Annual CTC</div>
                  <div className="font-mono font-semibold text-foreground mt-0.5">
                    {employee.ctcAnnualFormatted !== "—" ? employee.ctcAnnualFormatted : "Not Configured"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Current Monthly Gross</div>
                  <div className="font-mono font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {employee.grossMonthlyFormatted !== "—" ? employee.grossMonthlyFormatted : "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Current Effective Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.effectiveDate ? formatDate(employee.effectiveDate) : "Not Configured"}
                  </div>
                </div>
              </div>
            </div>

            {/* Revision Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground" htmlFor="new-ctc-input">
                  Revised Annual CTC (INR) *
                </label>
                <Input
                  id="new-ctc-input"
                  placeholder="e.g. 1500000"
                  value={newCtcRupees}
                  onChange={(e) => handleCtcInputChange(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground" htmlFor="revision-pct-input">
                  Revision Percentage (%)
                </label>
                <Input
                  id="revision-pct-input"
                  placeholder="e.g. 12.5"
                  value={revisionPct}
                  disabled={!currentAnnualPaise || currentAnnualPaise <= 0}
                  onChange={(e) => handlePctInputChange(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground" htmlFor="revision-structure-select">
                  Revised Salary Structure
                </label>
                <select
                  id="revision-structure-select"
                  value={selectedStructureId}
                  onChange={(e) => {
                    setSelectedStructureId(e.target.value);
                    setConfirmStep(false);
                  }}
                  className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                >
                  <option value="">Keep Current / Unchanged</option>
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground" htmlFor="effective-date-input">
                  Effective From Date *
                </label>
                <Input
                  id="effective-date-input"
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => {
                    setEffectiveDate(e.target.value);
                    setConfirmStep(false);
                  }}
                  className="mt-1 h-8 rounded-lg text-xs"
                />
              </div>
            </div>

            {isPastEffectiveDate && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Retroactive Revision & Arrears Impact</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  The chosen effective date precedes today. Finalized historical payroll runs are locked;
                  if approved, arrears will queue through the payroll arrears workflow for the next cycle.
                </p>
              </div>
            )}

            <div>
              <label className="font-semibold text-foreground" htmlFor="revision-reason-input">
                Revision Reason *
              </label>
              <Textarea
                id="revision-reason-input"
                placeholder="e.g. Annual performance increment / promotion"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setConfirmStep(false);
                }}
                rows={2}
                className="mt-1 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground" htmlFor="revision-notes-input">
                Additional Notes
              </label>
              <Input
                id="revision-notes-input"
                placeholder="Optional approval notes or appraisal cycle reference"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            {/* Revision Impact Preview */}
            {revisedAnnualPaise > 0 && (
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Revision Comparison Summary
                  </span>
                  {selectedStructure && (
                    <span className="text-[10px] text-muted-foreground">
                      Template: {selectedStructure.name} ({selectedStructure.components.length} components)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Current CTC</div>
                    <div className="font-mono font-medium">
                      {employee.ctcAnnualFormatted !== "—" ? employee.ctcAnnualFormatted : "Not Configured"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Revised CTC</div>
                    <div className="font-mono font-bold text-foreground">
                      {formatPaiseToINR(revisedAnnualPaise)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">CTC Difference</div>
                    <div className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                      {differencePaise !== null
                        ? `${differencePaise >= 0 ? "+" : "-"}${formatPaiseToINR(Math.abs(differencePaise))}`
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Variance %</div>
                    <div className="font-mono font-semibold">
                      {computedPct !== null ? `${computedPct >= 0 ? "+" : ""}${computedPct}%` : "—"}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Revised monthly gross and salary component split are calculated by the backend payroll engine upon submission and approval.
                </p>
              </div>
            )}

            {validationError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 dark:text-rose-300">
                {validationError}
              </div>
            )}

            {confirmStep && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Confirm Submission for Approval</span>
                </div>
                <p className="text-[11px] text-emerald-900/85 dark:text-emerald-200/85">
                  Submitting {formatPaiseToINR(revisedAnnualPaise)} annual CTC effective{" "}
                  <strong>{effectiveDate ? formatDate(effectiveDate) : "—"}</strong>. Click{" "}
                  <strong>Confirm & Submit Revision</strong> to record this proposal without altering historical records.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>
          {!confirmStep ? (
            <Button
              type="button"
              size="sm"
              disabled={!employee}
              onClick={validateAndAdvance}
              className="rounded-xl text-xs gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Review Revision
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={submitting}
              onClick={() => void handleConfirmSubmit()}
              className="rounded-xl text-xs gap-1"
            >
              {submitting ? "Submitting..." : "Confirm & Submit Revision"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
