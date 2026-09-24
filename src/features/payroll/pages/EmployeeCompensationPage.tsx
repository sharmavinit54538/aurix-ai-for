import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  History,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
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
import { compensationApi } from "../api/compensationApi";
import { toPaise } from "../utils/money";
import type {
  EmployeeCompensation,
  CompensationRevisionRecord,
  BulkCompensationPreviewResult,
} from "../types/compensation";
import { toast } from "sonner";

export default function EmployeeCompensationPage() {
  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [compensations, setCompensations] = useState<EmployeeCompensation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<EmployeeCompensation | null>(null);
  const [newCtcRupees, setNewCtcRupees] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [submittingRevision, setSubmittingRevision] = useState(false);

  // History Slide-over / Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Bulk Import State
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<BulkCompensationPreviewResult | null>(null);
  const [parsingBulk, setParsingBulk] = useState(false);
  const [applyingBulk, setApplyingBulk] = useState(false);

  const loadCompensations = async () => {
    setLoading(true);
    setBackendUnavailable(false);
    try {
      const res = await compensationApi.getEmployeeCompensations({
        page,
        limit: 20,
        search: searchQuery.trim() || undefined,
      });
      setCompensations(res?.items || []);
      setTotalCount(res?.total || 0);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
      } else {
        toast.error("Failed to load employee compensations");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompensations();
  }, [page]);

  // Arrears Risk Check: If effective date is in the past, arrears calculation will be triggered
  const isPastEffectiveDate = Boolean(
    effectiveDate && new Date(effectiveDate) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  const handleProposeRevision = async () => {
    if (!selectedEmp || !newCtcRupees || !effectiveDate || !revisionReason.trim()) {
      toast.error("Please fill in all mandatory revision fields.");
      return;
    }

    const paise = toPaise(newCtcRupees);
    if (paise <= 0) {
      toast.error("CTC must be a positive amount.");
      return;
    }

    setSubmittingRevision(true);
    try {
      await compensationApi.proposeCompensationRevision(selectedEmp.employeeId, {
        newCtcAnnualPaise: paise,
        effectiveDate,
        reason: revisionReason.trim(),
      });
      toast.success("Compensation revision proposed for checker approval.");
      setRevisionModalOpen(false);
      setNewCtcRupees("");
      setEffectiveDate("");
      setRevisionReason("");
      loadCompensations();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to propose compensation revision");
    } finally {
      setSubmittingRevision(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFile(file);
    setParsingBulk(true);
    try {
      const preview = await compensationApi.previewBulkCompensation(file);
      setBulkPreview(preview);
      toast.info(
        `Bulk template validated: ${preview.validRows} valid rows, ${preview.invalidRows} errors.`
      );
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        toast.error("Bulk compensation service unavailable — backend pending");
      } else {
        toast.error("Failed to validate bulk compensation CSV");
      }
    } finally {
      setParsingBulk(false);
    }
  };

  const handleApplyBulk = async () => {
    if (!bulkPreview) return;
    setApplyingBulk(true);
    try {
      const res = await compensationApi.applyBulkCompensation(bulkPreview.previewToken);
      toast.success(`Bulk compensation updated: ${res.appliedCount} employee records updated.`);
      setBulkModalOpen(false);
      setBulkPreview(null);
      setBulkFile(null);
      loadCompensations();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply bulk compensation updates");
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
              Employee Compensation & Revisions
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              CTC Management
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage employee salary structures, execute maker-checker compensation revisions, and process bulk increments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCompensations}
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
              The Employee Compensation & Revision API endpoint (<code>/api/v2/payroll/compensations</code>) is awaiting backend deployment.
              Salary breakdown views and bulk validation checks are ready.
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
          label="Total Compensations"
          value={formatCount(totalCount)}
          hint="Active employee records"
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Pending Revisions"
          value={formatCount(compensations.filter((c) => c.status === "pending_approval").length)}
          hint="Awaiting checker approval"
          icon={UserCheck}
          accent="warning"
        />
        <StatCard
          label="Structures Assigned"
          value={formatCount(new Set(compensations.map((c) => c.structureId)).size)}
          hint="Active templates in use"
          icon={Layers}
          accent="muted"
        />
        <StatCard
          label="Arrears Protected"
          value="Active"
          hint="Retroactive revision guard"
          icon={ShieldCheck}
          accent="success"
        />
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="emp-comp-search-input"
            type="search"
            placeholder="Search employee code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadCompensations();
            }}
            className="pl-8 h-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* ── Compensation Table ──────────────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Employee</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Salary Structure</th>
                <th className="px-4 py-3.5 font-mono text-right">Annual CTC</th>
                <th className="px-4 py-3.5 font-mono text-right">Monthly Gross</th>
                <th className="px-4 py-3.5">Effective Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading compensation records...</span>
                  </td>
                </tr>
              ) : compensations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">No Compensation Records Found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {backendUnavailable
                        ? "Compensation API pending backend deployment."
                        : "Assign salary structures to employees to view their CTC details."}
                    </p>
                  </td>
                </tr>
              ) : (
                compensations.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{emp.employeeName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{emp.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{emp.department}</td>
                    <td className="px-4 py-3 font-medium text-primary">{emp.structureName}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-right text-foreground">
                      {emp.ctcAnnualFormatted}
                    </td>
                    <td className="px-4 py-3 font-mono text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                      {emp.ctcMonthlyFormatted}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(emp.effectiveDate)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={emp.status === "active" ? "default" : "secondary"}
                        className="capitalize text-[10px]"
                      >
                        {emp.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEmp(emp);
                            setHistoryModalOpen(true);
                          }}
                          className="h-7 text-xs rounded-lg gap-1"
                        >
                          <History className="h-3 w-3" />
                          <span>History</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedEmp(emp);
                            setRevisionModalOpen(true);
                          }}
                          className="h-7 text-xs rounded-lg gap-1"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>Revise CTC</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Propose Compensation Revision Modal ──────────────────────── */}
      <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Propose Compensation Revision</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a revised annual CTC for <strong>{selectedEmp?.employeeName}</strong> ({selectedEmp?.employeeCode}).
              Subject to maker-checker governance approval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="text-muted-foreground">Current Annual CTC</label>
              <div className="font-mono font-bold text-sm text-foreground mt-0.5">
                {selectedEmp?.ctcAnnualFormatted}
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">New Proposed Annual CTC (INR) *</label>
              <Input
                id="new-ctc-input"
                placeholder="e.g. 1500000"
                value={newCtcRupees}
                onChange={(e) => setNewCtcRupees(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Effective Date *</label>
              <Input
                id="effective-date-input"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            {/* Arrears Risk Warning */}
            {isPastEffectiveDate && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Retroactive Revision & Arrears Impact</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  The chosen effective date is in the past. If approved, retroactive arrears will automatically be queued for calculation in the next payroll calculation run.
                </p>
              </div>
            )}

            <div>
              <label className="font-semibold text-foreground">Justification Reason *</label>
              <Textarea
                id="revision-reason-input"
                placeholder="e.g. Annual appraisal increment / promotion to Senior Staff"
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                rows={2}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevisionModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={submittingRevision}
              onClick={handleProposeRevision}
              className="rounded-xl text-xs"
            >
              {submittingRevision ? "Submitting..." : "Propose for Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Revision History Modal ───────────────────────────────────── */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Compensation History: {selectedEmp?.employeeName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Audit log of salary structure revisions, maker-checker sign-offs, and effective dates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs max-h-96 overflow-y-auto">
            {!selectedEmp?.revisions || selectedEmp.revisions.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No past revisions recorded for this employee.
              </p>
            ) : (
              selectedEmp.revisions.map((rev) => (
                <div key={rev.id} className="rounded-xl border border-border/70 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Revision #{rev.revisionNumber} • {formatDate(rev.effectiveDate)}
                    </span>
                    <Badge variant={rev.status === "approved" ? "default" : "secondary"}>
                      {rev.status}
                    </Badge>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Previous: </span>
                    <span className="font-mono">{rev.previousCtcFormatted}</span>
                    <span className="mx-2 text-muted-foreground">→</span>
                    <span className="font-mono font-bold text-foreground">{rev.newCtcFormatted}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">"{rev.reason}"</p>
                  <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    Proposed by: {rev.maker.name} •{" "}
                    {rev.checker ? `Approved by: ${rev.checker.name}` : "Pending Approval"}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Import Modal ───────────────────────────────────────── */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Bulk Compensation Update (CSV)</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Upload a batch spreadsheet to update employee CTC figures across your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-2">
              <Upload className="h-6 w-6 mx-auto text-primary" />
              <div>
                <label className="font-semibold text-foreground cursor-pointer text-primary hover:underline">
                  Select Bulk Compensation CSV
                  <input
                    id="bulk-comp-input"
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Required columns: EmployeeCode, ComponentCode, Amount, EffectiveDate
                </p>
              </div>
            </div>

            {bulkPreview && (
              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Validation Preview</span>
                  <span>{bulkPreview.affectedEmployeesCount} Employees Affected</span>
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
                    <span className="font-semibold text-rose-600">Row Errors (Will be skipped)</span>
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
