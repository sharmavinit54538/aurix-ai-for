/**
 * Modular Dialog, Drawer & Action Menu Components for OFC360 Variable Inputs:
 * - VariableInputActionMenu (View + Three-Dot menu with dynamic status/permission rules)
 * - VariableInputDetailsDrawer (Employee Info, Input Details, Approval Audit, Payroll Processing)
 * - CreateVariableInputDialog (Employee search selector, type-aware fields, backend OT calc)
 * - ApproveRejectVariableInputDialog (Maker-checker approval / rejection audit dialog)
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  History,
  MoreHorizontal,
  Plus,
  RefreshCw,
  ShieldCheck,
  XCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatDate, formatDateTime } from "@/lib/format";
import type { PayrollPeriod } from "@/services/payroll/types";
import { variableInputsApi, type CreateVariableInputPayload } from "../api/variableInputsApi";
import type {
  VariableInputType,
  VariableMasterComponent,
  VariableMasterEmployee,
  VariablePayrollInput,
} from "../types/variableInputs";
import { formatPaiseToINR, toPaise } from "../utils/money";
import {
  formatCategoryLabel,
  formatInputTypeLabel,
  formatProcessingStatusLabel,
  formatUnitsWithType,
  formatVariableStatusLabel,
  getVariableStatusBadgeClass,
} from "../utils/variableInputHelpers";

// ── 1. Dynamic Status & Permission Action Menu ───────────────────────────────
interface VariableInputActionMenuProps {
  input: VariablePayrollInput;
  canApprove: boolean;
  onViewDetails: (inp: VariablePayrollInput) => void;
  onOpenApprove: (inp: VariablePayrollInput) => void;
  onOpenReject: (inp: VariablePayrollInput) => void;
}

export function VariableInputActionMenu({
  input,
  canApprove,
  onViewDetails,
  onOpenApprove,
  onOpenReject,
}: VariableInputActionMenuProps) {
  const isLocked = Boolean(
    input.isPeriodLocked || input.status === "processed" || input.status === "consumed"
  );
  const canActPending = canApprove && input.status === "pending_approval" && !isLocked;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onViewDetails(input)}
        className="h-7 gap-1 rounded-lg px-2 text-xs"
      >
        <Eye className="h-3.5 w-3.5" />
        <span>View</span>
      </Button>

      {canActPending && (
        <Button
          type="button"
          size="sm"
          onClick={() => onOpenApprove(input)}
          className="h-7 rounded-lg px-2.5 text-xs"
        >
          Approve
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={`Actions for ${input.employeeName || input.employeeCode || input.id}`}
            className="h-7 w-7 rounded-lg"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
            Variable Input Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onViewDetails(input)} className="gap-2 text-xs">
            <Eye className="h-3.5 w-3.5" />
            <span>View Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onViewDetails(input)} className="gap-2 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>View Approval & Audit Trail</span>
          </DropdownMenuItem>

          {canActPending && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onOpenApprove(input)}
                className="gap-2 text-xs text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve Input</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpenReject(input)}
                className="gap-2 text-xs text-rose-600 dark:text-rose-400"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject Input</span>
              </DropdownMenuItem>
            </>
          )}

          {input.status === "rejected" && (
            <DropdownMenuItem onClick={() => onViewDetails(input)} className="gap-2 text-xs">
              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
              <span>View Rejection Reason</span>
            </DropdownMenuItem>
          )}

          {input.payrollRunId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="gap-2 text-xs">
                <Link
                  to="/dashboard/payroll/runs/$runId/preview"
                  params={{ runId: input.payrollRunId }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Associated Payroll Run</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── 2. Variable Input Details Drawer ─────────────────────────────────────────
interface VariableInputDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input: VariablePayrollInput | null;
  canApprove: boolean;
  onOpenApprove: (inp: VariablePayrollInput) => void;
  onOpenReject: (inp: VariablePayrollInput) => void;
}

export function VariableInputDetailsDrawer({
  open,
  onOpenChange,
  input,
  canApprove,
  onOpenApprove,
  onOpenReject,
}: VariableInputDetailsDrawerProps) {
  const isLocked = Boolean(
    input?.isPeriodLocked || input?.status === "processed" || input?.status === "consumed"
  );
  const canActPending = Boolean(
    input && canApprove && input.status === "pending_approval" && !isLocked
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="border-b border-border/70 pb-4 pr-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <EmployeeAvatar
                src={input?.profileImage}
                name={input?.employeeName || "Employee"}
                className="h-11 w-11 rounded-full object-cover shrink-0 border border-border"
                fallbackClassName="h-11 w-11 rounded-full inline-flex items-center justify-center bg-primary/10 font-semibold text-primary text-sm shrink-0"
              />
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold truncate">
                  {input?.employeeName || "Employee Unavailable"}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono text-muted-foreground">
                  {input?.employeeCode ? `Code: ${input.employeeCode}` : "Code: Not Available"}
                  {input?.department ? ` • ${input.department}` : ""}
                </SheetDescription>
              </div>
            </div>
            {input && (
              <Badge
                variant="outline"
                className={`shrink-0 text-[11px] font-medium ${getVariableStatusBadgeClass(input.status)}`}
              >
                {formatVariableStatusLabel(input.status, input.statusRaw)}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {input && (
          <div className="space-y-6 py-5 text-xs">
            {/* Section 1: Employee Information */}
            <section className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Employee Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Employee Name</div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {input.employeeName || "Employee Unavailable"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Employee Code</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {input.employeeCode || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Department</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.department || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Designation</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.designation || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Employment Type</div>
                  <div className="font-medium text-foreground mt-0.5 capitalize">
                    {input.employmentType ? input.employmentType.replace(/_/g, " ") : "Not Available"}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Input Details */}
            <section className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Variable Input Details ({input.currency})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 p-3.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Input Type</div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {formatInputTypeLabel(input.type, input.typeRaw)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Financial Category</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {formatCategoryLabel(input.category)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Salary Component</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.salaryComponentName || "Default Engine Rule"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Quantity / Units</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {formatUnitsWithType(input)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Rate per Unit</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {input.ratePerUnitFormatted}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Total Amount</div>
                  <div className="font-mono text-sm font-bold text-foreground mt-0.5">
                    {input.amountFormatted !== "—" ? input.amountFormatted : "Amount Not Configured"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Payroll Period</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.periodName ||
                      (input.payrollMonth && input.payrollYear
                        ? `${input.payrollMonth}/${input.payrollYear}`
                        : input.periodId || "Not Available")}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Effective Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.effectiveDate ? formatDate(input.effectiveDate) : "Date Not Available"}
                  </div>
                </div>
                {input.claimReference && (
                  <div>
                    <div className="text-[10px] text-muted-foreground">Claim Reference</div>
                    <div className="font-mono font-medium text-foreground mt-0.5">
                      {input.claimReference}
                    </div>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-3 border-t border-border/50 pt-2">
                  <div className="text-[10px] text-muted-foreground">Description & Reason</div>
                  <p className="mt-0.5 font-medium text-foreground">
                    {input.description || "No description provided"}
                  </p>
                  {input.reason && input.reason !== input.description && (
                    <p className="mt-1 text-[11px] text-muted-foreground">Reason: {input.reason}</p>
                  )}
                  {input.notes && (
                    <p className="mt-1 text-[11px] text-muted-foreground">Notes: {input.notes}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Approval & Audit Information */}
            <section className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Approval & Audit Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Approval Status</div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {formatVariableStatusLabel(input.status, input.statusRaw)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Created By</div>
                  <div className="font-medium text-foreground mt-0.5">{input.maker?.name || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Created Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.createdAt ? formatDateTime(input.createdAt) : "Date Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Approved By</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.checker?.name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Approved Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {input.approvedAt ? formatDateTime(input.approvedAt) : "—"}
                  </div>
                </div>
                {input.updatedAt && (
                  <div>
                    <div className="text-[10px] text-muted-foreground">Last Updated</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDateTime(input.updatedAt)}
                    </div>
                  </div>
                )}
                {input.rejectionReason && (
                  <div className="col-span-2 sm:col-span-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-700 dark:text-rose-300">
                    <div className="font-semibold text-[11px]">
                      Rejection Reason{input.rejectedBy?.name ? ` (by ${input.rejectedBy.name})` : ""}
                    </div>
                    <p className="mt-0.5">{input.rejectionReason}</p>
                  </div>
                )}
                {input.cancellationReason && (
                  <div className="col-span-2 sm:col-span-3 rounded-lg border border-border bg-muted p-2.5 text-muted-foreground">
                    <div className="font-semibold text-[11px]">Cancellation Reason</div>
                    <p className="mt-0.5">{input.cancellationReason}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Section 4: Payroll Processing Information */}
            <section className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Payroll Processing & Engine Integration
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border/70 p-3.5">
                <div>
                  <div className="text-[10px] text-muted-foreground">Processing Status</div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {formatProcessingStatusLabel(input.processingStatus, input.processingStatusRaw)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Associated Payroll Run</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {input.payrollRunId ? (
                      <Link
                        to="/dashboard/payroll/runs/$runId/preview"
                        params={{ runId: input.payrollRunId }}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <span>{input.payrollRunReference || input.payrollRunId}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Processed Amount</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {input.processedAmountFormatted && input.processedAmountFormatted !== "—"
                      ? input.processedAmountFormatted
                      : input.processingStatus === "processed" || input.processingStatus === "finalized"
                        ? input.amountFormatted
                        : "—"}
                  </div>
                </div>
                {input.processedAt && (
                  <div>
                    <div className="text-[10px] text-muted-foreground">Processing Date</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDateTime(input.processedAt)}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground">
                {input.status === "approved" || input.status === "processed" || input.status === "consumed" ? (
                  <span>
                    <strong className="text-foreground">Payroll Engine Rule:</strong> Eligible for deterministic single-inclusion during period payroll calculation.{" "}
                    {input.category === "reimbursement" &&
                      "Reimbursements are settled outside taxable salary earnings unless configured otherwise."}
                  </span>
                ) : (
                  <span>
                    <strong className="text-foreground">Payroll Engine Rule:</strong> Records with status{" "}
                    <em>{formatVariableStatusLabel(input.status, input.statusRaw)}</em> are excluded from payroll runs until approved.
                  </span>
                )}
              </div>
            </section>

            {/* Footer Controls */}
            {canActPending && (
              <div className="flex items-center justify-end gap-2 border-t border-border/70 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenReject(input);
                  }}
                  className="h-8 gap-1 rounded-xl text-xs text-rose-600 hover:text-rose-700"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Input
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenApprove(input);
                  }}
                  className="h-8 gap-1 rounded-xl text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve Input
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── 3. Create Variable Input Modal ───────────────────────────────────────────
interface CreateVariableInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periods: PayrollPeriod[];
  defaultPeriodId: string;
  employees: VariableMasterEmployee[];
  components: VariableMasterComponent[];
  submitting: boolean;
  onCreate: (payload: CreateVariableInputPayload) => Promise<void>;
}

export function CreateVariableInputDialog({
  open,
  onOpenChange,
  periods,
  defaultPeriodId,
  employees,
  components,
  submitting,
  onCreate,
}: CreateVariableInputDialogProps) {
  const [empSearch, setEmpSearch] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [periodId, setPeriodId] = useState(defaultPeriodId);
  const [inputType, setInputType] = useState<VariableInputType>("overtime");
  const [salaryComponentId, setSalaryComponentId] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [units, setUnits] = useState("");
  const [unitType, setUnitType] = useState("hours");
  const [rateRupees, setRateRupees] = useState("");
  const [amountRupees, setAmountRupees] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [claimReference, setClaimReference] = useState("");
  const [notes, setNotes] = useState("");
  const [calculatingOt, setCalculatingOt] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPeriodId(defaultPeriodId);
    setEmployeeId("");
    setEmpSearch("");
    setSalaryComponentId("");
    setDescription("");
    setReason("");
    setUnits("");
    setRateRupees("");
    setAmountRupees("");
    setEffectiveDate("");
    setClaimReference("");
    setNotes("");
    setFormError(null);
  }, [open, defaultPeriodId]);

  useEffect(() => {
    if (inputType === "overtime") setUnitType("hours");
    else if (inputType === "lop") setUnitType("days");
    else if (inputType === "reimbursement") setUnitType("claim");
    else setUnitType("unit");
  }, [inputType]);

  const filteredEmployees = useMemo(() => {
    const q = empSearch.trim().toLowerCase();
    if (!q) return employees.slice(0, 100);
    return employees
      .filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q) ||
          (e.department || "").toLowerCase().includes(q)
      )
      .slice(0, 100);
  }, [employees, empSearch]);

  const handleBackendOtCalc = async () => {
    if (!employeeId.trim()) {
      setFormError("Select an employee before running backend overtime calculation.");
      return;
    }
    const hrs = Number(units.trim());
    if (!Number.isFinite(hrs) || hrs <= 0) {
      setFormError("Enter positive overtime hours to calculate via backend.");
      return;
    }
    setCalculatingOt(true);
    setFormError(null);
    try {
      const res = await variableInputsApi.calculateOvertime({
        employeeId: employeeId.trim(),
        hours: hrs,
        periodId: periodId || undefined,
        date: effectiveDate || undefined,
      });
      if (res.ratePerUnitPaise !== null) {
        setRateRupees(String(res.ratePerUnitPaise / 100));
      }
      if (res.amountPaise !== null) {
        setAmountRupees(String(res.amountPaise / 100));
      } else {
        setFormError("Backend overtime engine did not return an amount; verify employee overtime rules.");
      }
    } catch {
      setFormError("Backend overtime calculation unavailable for the selected employee/period.");
    } finally {
      setCalculatingOt(false);
    }
  };

  const handleSubmit = async () => {
    if (!periodId) {
      setFormError("Select a payroll period.");
      return;
    }
    if (!employeeId.trim()) {
      setFormError("Select or enter an employee.");
      return;
    }
    const amountPaise = toPaise(amountRupees);
    if (!amountRupees.trim() || amountPaise <= 0) {
      setFormError("Enter a valid positive Amount (INR).");
      return;
    }
    if (!description.trim()) {
      setFormError("Description / Business Reason is required.");
      return;
    }

    let parsedUnits: number | undefined;
    if (units.trim()) {
      const u = Number(units.trim());
      if (!Number.isFinite(u) || u < 0) {
        setFormError("Quantity / Units must be a non-negative number.");
        return;
      }
      parsedUnits = u;
    }

    setFormError(null);
    const periodObj = periods.find((p) => p.id === periodId);

    await onCreate({
      employeeId: employeeId.trim(),
      periodId,
      type: inputType,
      amountPaise,
      units: parsedUnits,
      unitType: parsedUnits !== undefined ? unitType : undefined,
      ratePerUnitPaise: rateRupees.trim() ? toPaise(rateRupees) : undefined,
      description: description.trim(),
      reason: reason.trim() || undefined,
      salaryComponentId: salaryComponentId || undefined,
      effectiveDate: effectiveDate || undefined,
      claimReference: claimReference.trim() || undefined,
      notes: notes.trim() || undefined,
      payrollMonth: periodObj?.periodMonth,
      payrollYear: periodObj?.periodYear,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="h-4 w-4 text-primary" />
            <span>New Variable Payroll Input</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create an employee overtime, bonus, incentive, reimbursement, deduction, or LOP record tied to a payroll period.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1 text-xs">
          {/* Employee Search & Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground" htmlFor="var-emp-select">
              Employee *
            </label>
            {employees.length > 0 ? (
              <>
                <Input
                  placeholder="Filter employees by name, code, or department..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  className="h-8 rounded-lg text-xs"
                />
                <select
                  id="var-emp-select"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
                >
                  <option value="">Select Employee</option>
                  {filteredEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName || e.employeeCode} ({e.employeeCode || "No Code"})
                      {e.department ? ` — ${e.department}` : ""}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <Input
                id="var-emp-id"
                placeholder="Employee ID / Code"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-8 rounded-lg text-xs"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground" htmlFor="var-period-select">
                Payroll Period *
              </label>
              <select
                id="var-period-select"
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">Select Period</option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground" htmlFor="var-type-select">
                Input Type *
              </label>
              <select
                id="var-type-select"
                value={inputType}
                onChange={(e) => setInputType(e.target.value as VariableInputType)}
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="overtime">Overtime</option>
                <option value="bonus">Bonus</option>
                <option value="incentive">Incentive</option>
                <option value="commission">Commission</option>
                <option value="reimbursement">Reimbursement</option>
                <option value="arrears">Arrears</option>
                <option value="adjustment">Adjustment</option>
                <option value="additional_allowance">Additional Allowance</option>
                <option value="additional_deduction">Additional Deduction</option>
                <option value="deduction">Deduction</option>
                <option value="advance_recovery">Advance Recovery</option>
                <option value="lop">Loss of Pay (LOP)</option>
              </select>
            </div>
          </div>

          {components.length > 0 && (
            <div>
              <label className="font-semibold text-foreground" htmlFor="var-comp-select">
                Salary Component Mapping
              </label>
              <select
                id="var-comp-select"
                value={salaryComponentId}
                onChange={(e) => setSalaryComponentId(e.target.value)}
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">Auto / Default Component Rule</option>
                {components.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code}) — {c.type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type-relevant fields */}
          {(inputType === "overtime" || inputType === "lop" || inputType === "commission") && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="font-semibold text-foreground" htmlFor="var-units">
                  {inputType === "overtime"
                    ? "Overtime Hours"
                    : inputType === "lop"
                      ? "LOP Days"
                      : "Quantity"}
                </label>
                <Input
                  id="var-units"
                  placeholder={inputType === "overtime" ? "e.g. 8" : "e.g. 1"}
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground" htmlFor="var-unit-type">
                  Unit Type
                </label>
                <Input
                  id="var-unit-type"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground" htmlFor="var-rate">
                  Rate / Unit (INR)
                </label>
                <Input
                  id="var-rate"
                  placeholder="Optional"
                  value={rateRupees}
                  onChange={(e) => setRateRupees(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          )}

          {inputType === "overtime" && (
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/25 px-3 py-2">
              <span className="text-[11px] text-muted-foreground">
                Use backend overtime rules to calculate amount from hours:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={calculatingOt}
                onClick={() => void handleBackendOtCalc()}
                className="h-7 gap-1 rounded-lg text-[11px]"
              >
                <Calculator className="h-3 w-3" />
                {calculatingOt ? "Calculating..." : "Calculate Overtime"}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground" htmlFor="var-amount">
                Total Amount (INR) *
              </label>
              <Input
                id="var-amount"
                placeholder="e.g. 5000"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground" htmlFor="var-eff-date">
                Effective Date
              </label>
              <Input
                id="var-eff-date"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
          </div>

          {inputType === "reimbursement" && (
            <div>
              <label className="font-semibold text-foreground" htmlFor="var-claim-ref">
                Claim Reference ID
              </label>
              <Input
                id="var-claim-ref"
                placeholder="e.g. EXP-2026-0412"
                value={claimReference}
                onChange={(e) => setClaimReference(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs font-mono"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-foreground" htmlFor="var-description">
              Description *
            </label>
            <Textarea
              id="var-description"
              placeholder="e.g. Infrastructure deployment weekend overtime support"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground" htmlFor="var-notes">
              Additional Notes / Business Reason
            </label>
            <Input
              id="var-notes"
              placeholder="Optional justification or approval notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 h-8 rounded-lg text-xs"
            />
          </div>

          {formError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 dark:text-rose-300">
              {formError}
            </div>
          )}
        </div>

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
          <Button
            type="button"
            size="sm"
            disabled={submitting}
            onClick={() => void handleSubmit()}
            className="rounded-xl text-xs"
          >
            {submitting ? "Submitting..." : "Submit Variable Input"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── 4. Approve / Reject Variable Input Audit Modal ───────────────────────────
interface ApproveRejectVariableInputDialogProps {
  mode: "approve" | "reject" | null;
  input: VariablePayrollInput | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: (remarksOrReason: string) => Promise<void>;
}

export function ApproveRejectVariableInputDialog({
  mode,
  input,
  submitting,
  onClose,
  onConfirm,
}: ApproveRejectVariableInputDialogProps) {
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (mode) {
      setText("");
      setErr(null);
    }
  }, [mode, input?.id]);

  const handleConfirm = async () => {
    if (mode === "reject" && text.trim().length < 5) {
      setErr("Rejection reason is required (minimum 5 characters).");
      return;
    }
    setErr(null);
    await onConfirm(text.trim());
  };

  return (
    <Dialog open={Boolean(mode && input)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            {mode === "approve" ? (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Approve Variable Input</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-600" />
                <span>Reject Variable Input</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {mode === "approve"
              ? "Approved entries become eligible for payroll calculation."
              : "Rejected entries are excluded from payroll and preserve audit history."}
          </DialogDescription>
        </DialogHeader>

        {input && (
          <div className="space-y-3 py-1 text-xs">
            <div className="rounded-xl border border-border/60 bg-muted/25 p-3 space-y-1">
              <div className="font-semibold text-foreground">
                {input.employeeName || "Employee"} {input.employeeCode ? `(${input.employeeCode})` : ""}
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{formatInputTypeLabel(input.type, input.typeRaw)}</span>
                <span className="font-mono font-bold text-foreground">
                  {input.amountFormatted !== "—"
                    ? input.amountFormatted
                    : input.amountPaise !== null
                      ? formatPaiseToINR(input.amountPaise)
                      : "Amount Not Configured"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{input.description}</p>
            </div>

            <div>
              <label className="font-semibold text-foreground" htmlFor="vi-audit-reason-input">
                {mode === "approve" ? "Approval Remarks (Optional)" : "Rejection Reason *"}
              </label>
              <Textarea
                id="vi-audit-reason-input"
                placeholder={
                  mode === "approve"
                    ? "e.g. Verified against attendance / manager sign-off"
                    : "e.g. Duplicate overtime entry for selected date"
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
            </div>

            {err && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-rose-700 dark:text-rose-300">
                {err}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={mode === "reject" ? "destructive" : "default"}
            size="sm"
            disabled={submitting}
            onClick={() => void handleConfirm()}
            className="rounded-xl text-xs"
          >
            {submitting
              ? "Saving..."
              : mode === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
