import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
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
import { fnfApi } from "../api/fnfApi";
import { useAurix } from "@/lib/aurix-store";
import type { FnfRecord, FnfStatus } from "../types/fnf";
import { toast } from "sonner";

export default function FullAndFinalPage() {
  const aurixStore = useAurix();
  const currentUser = aurixStore.user;

  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [records, setRecords] = useState<FnfRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Initiate Modal
  const [initiateModalOpen, setInitiateModalOpen] = useState(false);
  const [empId, setEmpId] = useState("");
  const [exitType, setExitType] = useState<"resignation" | "termination">("resignation");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [noticeRequired, setNoticeRequired] = useState("60");
  const [noticeServed, setNoticeServed] = useState("60");
  const [exitReason, setExitReason] = useState("");
  const [initiating, setInitiating] = useState(false);

  // Selected Detail Modal
  const [selectedRecord, setSelectedRecord] = useState<FnfRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  const loadRecords = async () => {
    setLoading(true);
    setBackendUnavailable(false);
    try {
      const res = await fnfApi.getFnfRecords({
        page,
        limit: 20,
        search: searchQuery.trim() || undefined,
      });
      setRecords(res?.items || []);
      setTotalCount(res?.total || 0);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
      } else {
        toast.error("Failed to load F&F settlement records");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [page]);

  const handleInitiate = async () => {
    if (!empId.trim() || !lastWorkingDate || !exitReason.trim()) {
      toast.error("Please fill in all mandatory exit fields.");
      return;
    }

    setInitiating(true);
    try {
      const reqDays = parseInt(noticeRequired, 10) || 0;
      const srvDays = parseInt(noticeServed, 10) || 0;
      await fnfApi.initiateFnf({
        employeeId: empId.trim(),
        exitDetails: {
          exitType,
          lastWorkingDate,
          reason: exitReason.trim(),
          noticePeriodDaysRequired: reqDays,
          noticePeriodDaysServed: srvDays,
          shortfallDays: Math.max(0, reqDays - srvDays),
        },
      });
      toast.success("F&F case initiated. Calculation queued on server.");
      setInitiateModalOpen(false);
      setEmpId("");
      setLastWorkingDate("");
      setExitReason("");
      loadRecords();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate F&F");
    } finally {
      setInitiating(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRecord) return;
    if (currentUser?.id && selectedRecord.maker.id === currentUser.id) {
      toast.error("Maker-checker violation: You cannot approve an F&F case you initiated.");
      return;
    }

    try {
      await fnfApi.approveFnf(selectedRecord.id, approvalRemarks.trim() || "Approved by Finance/HR.");
      toast.success("F&F settlement approved.");
      setDetailModalOpen(false);
      loadRecords();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to approve F&F");
    }
  };

  const handleFinalize = async () => {
    if (!selectedRecord) return;
    setFinalizing(true);
    try {
      await fnfApi.finalizeFnf(selectedRecord.id, "Authoritative lock and settlement finalization.");
      toast.success("F&F settlement finalized & locked for disbursement.");
      setDetailModalOpen(false);
      loadRecords();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to finalize F&F");
    } finally {
      setFinalizing(false);
    }
  };

  const handleDownloadStatement = async (fnfId: string) => {
    try {
      const blob = await fnfApi.downloadFnfStatement(fnfId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FNF_STATEMENT_${fnfId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      toast.success("F&F statement downloaded.");
    } catch {
      toast.error("Failed to download settlement statement");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Full & Final (F&F) Settlement
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              Exit Management
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Authoritative severance calculations: unpaid salary, leave encashment, gratuity, notice adjustments, and recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecords}
            disabled={loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setInitiateModalOpen(true)}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Initiate F&F</span>
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
              The Full & Final Settlement API endpoint (<code>/api/v2/payroll/full-and-final</code>) is awaiting backend deployment.
              Severance preview tables and maker-checker sign-off structures are ready.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Exit Cases"
          value={formatCount(totalCount)}
          hint="All time F&F files"
          icon={UserX}
          accent="brand"
        />
        <StatCard
          label="Pending Sign-off"
          value={formatCount(records.filter((r) => r.status === "pending_approval" || r.status === "calculated").length)}
          hint="Awaiting checker"
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Finalized Cases"
          value={formatCount(records.filter((r) => r.status === "finalized").length)}
          hint="Locked for release"
          icon={Lock}
          accent="muted"
        />
        <StatCard
          label="Settled"
          value={formatCount(records.filter((r) => r.status === "settled").length)}
          hint="Bank disbursed"
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="fnf-search-input"
            type="search"
            placeholder="Search employee name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadRecords();
            }}
            className="pl-8 h-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* ── F&F Table ───────────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Employee</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Exit Type</th>
                <th className="px-4 py-3.5">Last Working Date</th>
                <th className="px-4 py-3.5 font-mono text-right">Net Settlement</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading settlement cases...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <UserX className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">No F&F Cases Found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {backendUnavailable
                        ? "F&F endpoint pending backend deployment."
                        : "Click 'Initiate F&F' to begin exit settlement processing for a separating employee."}
                    </p>
                  </td>
                </tr>
              ) : (
                records.map((fnf) => (
                  <tr key={fnf.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{fnf.employeeName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{fnf.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{fnf.department}</td>
                    <td className="px-4 py-3 capitalize">
                      <Badge variant="outline" className="text-[10px]">
                        {fnf.exitDetails.exitType.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(fnf.exitDetails.lastWorkingDate)}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-right text-emerald-600 dark:text-emerald-400">
                      {fnf.netSettlementFormatted}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          fnf.status === "finalized" || fnf.status === "settled"
                            ? "default"
                            : fnf.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize text-[10px]"
                      >
                        {fnf.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRecord(fnf);
                            setDetailModalOpen(true);
                          }}
                          className="h-7 text-xs rounded-lg"
                        >
                          Review Case
                        </Button>

                        {(fnf.status === "finalized" || fnf.status === "settled") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadStatement(fnf.id)}
                            className="h-7 text-xs gap-1"
                            title="Download settlement statement"
                          >
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Initiate F&F Modal ──────────────────────────────────────── */}
      <Dialog open={initiateModalOpen} onOpenChange={setInitiateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Initiate Full & Final Settlement</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide separating employee details to trigger server-side severance calculation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Employee ID / Code *</label>
              <Input
                id="fnf-emp-id"
                placeholder="e.g. EMP-101"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Separation Type</label>
              <select
                value={exitType}
                onChange={(e) => setExitType(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs"
              >
                <option value="resignation">Resignation</option>
                <option value="termination">Termination</option>
                <option value="retirement">Retirement</option>
                <option value="layoff">Layoff</option>
                <option value="contract_end">Contract Completion</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Last Working Day *</label>
              <Input
                id="fnf-lwd-input"
                type="date"
                value={lastWorkingDate}
                onChange={(e) => setLastWorkingDate(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-foreground">Notice Required (Days)</label>
                <Input
                  id="fnf-notice-req"
                  type="number"
                  value={noticeRequired}
                  onChange={(e) => setNoticeRequired(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Notice Served (Days)</label>
                <Input
                  id="fnf-notice-srv"
                  type="number"
                  value={noticeServed}
                  onChange={(e) => setNoticeServed(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Separation Reason *</label>
              <Textarea
                id="fnf-reason-input"
                placeholder="e.g. Voluntary resignation for career opportunity"
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                rows={2}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInitiateModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={initiating}
              onClick={handleInitiate}
              className="rounded-xl text-xs"
            >
              {initiating ? "Calculating..." : "Initiate F&F"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── F&F Breakdown & Sign-off Dialog ─────────────────────────── */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Settlement Breakdown: {selectedRecord?.employeeName} ({selectedRecord?.employeeCode})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review authoritative severance components computed by the backend payroll engine.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 py-2 text-xs">
              {/* Earnings Breakdown */}
              <div className="rounded-xl border border-border/70 p-4 space-y-2">
                <div className="flex items-center justify-between font-semibold text-foreground border-b border-border/50 pb-2">
                  <span>Severance Earnings</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {selectedRecord.earnings.totalEarningsFormatted}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                  <div>Unpaid Days Salary: {formatINR(selectedRecord.earnings.unpaidSalaryPaise / 100)}</div>
                  <div>Leave Encashment: {formatINR(selectedRecord.earnings.leaveEncashmentPaise / 100)}</div>
                  <div>Gratuity: {formatINR(selectedRecord.earnings.gratuityPaise / 100)}</div>
                  <div>Statutory Bonus: {formatINR(selectedRecord.earnings.statutoryBonusPaise / 100)}</div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="rounded-xl border border-border/70 p-4 space-y-2">
                <div className="flex items-center justify-between font-semibold text-foreground border-b border-border/50 pb-2">
                  <span>Severance Deductions & Recoveries</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    {selectedRecord.deductions.totalDeductionsFormatted}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                  <div>Notice Shortfall: {formatINR(selectedRecord.deductions.noticeShortfallRecoveryPaise / 100)}</div>
                  <div>Loan / Advance Recovery: {formatINR(selectedRecord.deductions.loanAdvanceRecoveryPaise / 100)}</div>
                  <div>Asset Recovery: {formatINR(selectedRecord.deductions.assetDamageRecoveryPaise / 100)}</div>
                  <div>Tax / Statutory Deductions: {formatINR(selectedRecord.deductions.tdsDeductionPaise / 100)}</div>
                </div>
              </div>

              {/* Net Settlement Banner */}
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Net Settlement Payable
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Final amount to be disbursed upon settlement execution
                  </p>
                </div>
                <span className="font-mono text-xl font-bold text-primary">
                  {selectedRecord.netSettlementFormatted}
                </span>
              </div>

              {/* Maker-checker notice */}
              <div className="text-[10px] text-muted-foreground italic border-t border-border/40 pt-2">
                Initiated by: {selectedRecord.maker.name} on {formatDate(selectedRecord.createdAt)}
                {selectedRecord.checker && ` • Approved by: ${selectedRecord.checker.name}`}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Close
            </Button>

            {selectedRecord?.status === "calculated" && (
              <Button
                size="sm"
                onClick={handleApprove}
                className="rounded-xl text-xs"
              >
                Approve Settlement
              </Button>
            )}

            {selectedRecord?.status === "approved" && (
              <Button
                size="sm"
                disabled={finalizing}
                onClick={handleFinalize}
                className="rounded-xl text-xs"
              >
                {finalizing ? "Finalizing..." : "Finalize & Seal F&F"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
