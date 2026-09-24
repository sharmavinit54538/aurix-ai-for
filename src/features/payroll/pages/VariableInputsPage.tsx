import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatINR, formatCount, formatDate } from "@/lib/format";
import { variableInputsApi } from "../api/variableInputsApi";
import { toPaise } from "../utils/money";
import type {
  VariablePayrollInput,
  VariableInputType,
  BulkVariableInputPreviewResult,
} from "../types/variableInputs";
import { toast } from "sonner";

export default function VariableInputsPage() {
  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [inputs, setInputs] = useState<VariablePayrollInput[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [empId, setEmpId] = useState("");
  const [inputType, setInputType] = useState<VariableInputType>("overtime");
  const [amountRupees, setAmountRupees] = useState("");
  const [units, setUnits] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Bulk Modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkPreview, setBulkPreview] = useState<BulkVariableInputPreviewResult | null>(null);
  const [parsingBulk, setParsingBulk] = useState(false);
  const [applyingBulk, setApplyingBulk] = useState(false);

  const loadInputs = async () => {
    setLoading(true);
    setBackendUnavailable(false);
    try {
      const res = await variableInputsApi.getVariableInputs({
        page,
        limit: 20,
        type: typeFilter !== "all" ? typeFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      setInputs(res?.items || []);
      setTotalCount(res?.total || 0);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
      } else {
        toast.error("Failed to load variable payroll inputs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInputs();
  }, [page, typeFilter]);

  const handleCreateInput = async () => {
    if (!empId.trim() || !amountRupees || !description.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    const paise = toPaise(amountRupees);
    if (paise <= 0) {
      toast.error("Amount must be greater than zero.");
      return;
    }

    setCreating(true);
    try {
      await variableInputsApi.createVariableInput({
        employeeId: empId.trim(),
        periodId: "current-active-period",
        type: inputType,
        amountPaise: paise,
        units: units ? parseFloat(units) : undefined,
        description: description.trim(),
      });
      toast.success("Variable input submitted for checker approval.");
      setCreateModalOpen(false);
      setEmpId("");
      setAmountRupees("");
      setUnits("");
      setDescription("");
      loadInputs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create variable input");
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await variableInputsApi.approveVariableInput(id, "Approved by payroll reviewer.");
      toast.success("Variable input approved for payroll calculation.");
      loadInputs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to approve variable input");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await variableInputsApi.rejectVariableInput(id, "Disallowed by payroll policy.");
      toast.warning("Variable input rejected.");
      loadInputs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject variable input");
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingBulk(true);
    try {
      const preview = await variableInputsApi.previewBulkVariableInputs(file);
      setBulkPreview(preview);
      toast.info(`Bulk inputs parsed: ${preview.validRows} valid, ${preview.invalidRows} errors.`);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        toast.error("Bulk variable input service unavailable — backend pending");
      } else {
        toast.error("Failed to parse variable inputs spreadsheet");
      }
    } finally {
      setParsingBulk(false);
    }
  };

  const handleApplyBulk = async () => {
    if (!bulkPreview) return;
    setApplyingBulk(true);
    try {
      const res = await variableInputsApi.applyBulkVariableInputs(bulkPreview.previewToken);
      toast.success(`Bulk inputs applied: ${res.appliedCount} entries recorded.`);
      setBulkModalOpen(false);
      setBulkPreview(null);
      loadInputs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply bulk inputs");
    } finally {
      setApplyingBulk(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Variable Payroll Inputs & Adjustments
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              Cycle Adjustments
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage overtime hours, bonuses, sales commissions, expense reimbursements, LOP, and salary advances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadInputs}
            disabled={loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkModalOpen(true)}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Bulk CSV Import</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Input</span>
          </Button>
        </div>
      </div>

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              The Variable Inputs API endpoint (<code>/api/v2/payroll/variable-inputs</code>) is awaiting backend deployment.
              Client-side maker-checker guards and period locking rules are active.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Summary Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Inputs"
          value={formatCount(totalCount)}
          hint="Current cycle entries"
          icon={Layers}
          accent="brand"
        />
        <StatCard
          label="Pending Approval"
          value={formatCount(inputs.filter((i) => i.status === "pending_approval").length)}
          hint="Maker-checker queue"
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Approved / Ready"
          value={formatCount(inputs.filter((i) => i.status === "approved").length)}
          hint="Ready for calculation engine"
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="Period Locking"
          value="Enforced"
          hint="Closed cycles protected"
          icon={Lock}
          accent="muted"
        />
      </div>

      {/* ── Type Filter Buttons & Search ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="variable-input-search"
            type="search"
            placeholder="Search employee or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadInputs();
            }}
            className="pl-8 h-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none">
          {["all", "overtime", "bonus", "incentive", "reimbursement", "deduction", "lop"].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={typeFilter === t ? "default" : "outline"}
              onClick={() => {
                setTypeFilter(t);
                setPage(1);
              }}
              className="rounded-xl text-xs h-8 capitalize whitespace-nowrap"
            >
              {t.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Inputs Table ────────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Employee</th>
                <th className="px-4 py-3.5">Input Type</th>
                <th className="px-4 py-3.5">Description / Reason</th>
                <th className="px-4 py-3.5 font-mono">Units / Qty</th>
                <th className="px-4 py-3.5 font-mono text-right">Amount (INR)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Created Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading variable inputs...</span>
                  </td>
                </tr>
              ) : inputs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Banknote className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">No Variable Inputs Found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {backendUnavailable
                        ? "Variable inputs API pending backend deployment."
                        : "Click 'New Input' to record overtime, bonuses, or adjustments for this cycle."}
                    </p>
                  </td>
                </tr>
              ) : (
                inputs.map((inp) => (
                  <tr key={inp.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{inp.employeeName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{inp.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <Badge variant="outline" className="text-[10px]">
                        {inp.type.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground/90 max-w-xs">{inp.description}</td>
                    <td className="px-4 py-3 font-mono">{inp.units ?? "—"}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-right text-foreground">
                      {inp.amountFormatted}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          inp.status === "approved"
                            ? "default"
                            : inp.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize text-[10px]"
                      >
                        {inp.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(inp.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {inp.status === "pending_approval" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(inp.id)}
                            className="h-7 text-xs text-rose-600 hover:text-rose-700"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(inp.id)}
                            className="h-7 text-xs"
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Create Variable Input Modal ─────────────────────────────── */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">New Variable Payroll Input</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a one-time adjustment, overtime hours, bonus, or reimbursement to the current payroll run.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Employee ID / Code *</label>
              <Input
                id="var-emp-id"
                placeholder="e.g. EMP-101"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Input Type</label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value as VariableInputType)}
                className="mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs"
              >
                <option value="overtime">Overtime</option>
                <option value="bonus">Bonus</option>
                <option value="incentive">Performance Incentive</option>
                <option value="commission">Sales Commission</option>
                <option value="reimbursement">Expense Reimbursement</option>
                <option value="deduction">Additional Deduction</option>
                <option value="advance_recovery">Salary Advance Recovery</option>
                <option value="lop">Loss of Pay (LOP)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-foreground">Amount (INR) *</label>
                <Input
                  id="var-amount"
                  placeholder="e.g. 5000"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Units / Hours (Optional)</label>
                <Input
                  id="var-units"
                  placeholder="e.g. 8.5"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Description / Business Reason *</label>
              <Textarea
                id="var-description"
                placeholder="e.g. Approved weekend release overtime support"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={creating}
              onClick={handleCreateInput}
              className="rounded-xl text-xs"
            >
              {creating ? "Submitting..." : "Submit for Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Import Modal ───────────────────────────────────────── */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Bulk Variable Inputs Upload (CSV)</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Upload a bulk CSV file containing overtime hours, bonuses, or adjustments for multiple employees.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-2">
              <Upload className="h-6 w-6 mx-auto text-primary" />
              <div>
                <label className="font-semibold text-foreground cursor-pointer text-primary hover:underline">
                  Choose CSV File
                  <input
                    id="bulk-var-input"
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Required columns: EmployeeCode, InputType, Amount, Units, Description
                </p>
              </div>
            </div>

            {bulkPreview && (
              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Validation Preview</span>
                  <span>Total Amount: {bulkPreview.totalAmountFormatted}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <span className="font-bold">{bulkPreview.validRows}</span> Valid Rows
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300">
                    <span className="font-bold">{bulkPreview.invalidRows}</span> Errors
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <span className="font-bold">{bulkPreview.duplicateRows}</span> Duplicates
                  </div>
                </div>

                {bulkPreview.errors.length > 0 && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 space-y-1">
                    <span className="font-semibold text-rose-600">Row Errors (Skipped)</span>
                    <ul className="list-disc pl-4 text-[10px] text-muted-foreground space-y-0.5">
                      {bulkPreview.errors.slice(0, 3).map((err, i) => (
                        <li key={i}>
                          Row {err.rowNumber} ({err.employeeCode}): {err.errorMessage}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkModalOpen(false);
                setBulkPreview(null);
              }}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!bulkPreview || bulkPreview.validRows === 0 || applyingBulk}
              onClick={handleApplyBulk}
              className="rounded-xl text-xs"
            >
              {applyingBulk ? "Applying..." : `Apply ${bulkPreview?.validRows || 0} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
