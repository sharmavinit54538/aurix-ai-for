import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatCount } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { paymentApi } from "../api/paymentApi";
import { payrollApi } from "@/services/payrollApi";
import type { PaymentBatch, PaymentBatchStatus } from "../types/payment";
import { toast } from "sonner";

export default function PaymentBatchListPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<PaymentBatch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Run selection modal state
  const [selectRunModalOpen, setSelectRunModalOpen] = useState(false);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [availableRuns, setAvailableRuns] = useState<
    Array<{ id: string; name: string; status: string; employeeCount?: number | null }>
  >([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [customRunId, setCustomRunId] = useState("");

  const fetchAvailableRuns = async () => {
    setLoadingRuns(true);
    try {
      let runs: Array<{ id: string; name: string; status: string; employeeCount?: number | null }> = [];
      const dash = await payrollApi.getDashboard().catch(() => null);
      if (dash?.recentRuns && dash.recentRuns.length > 0) {
        runs = dash.recentRuns.map((r) => ({
          id: r.id,
          name: r.periodName || `Run #${r.id}`,
          status: r.status,
          employeeCount: r.employeeCount,
        }));
      }

      if (runs.length === 0) {
        const periods = await payrollApi.getPeriodsList({ limit: 10 }).catch(() => null);
        if (periods?.items && periods.items.length > 0) {
          runs = periods.items.map((p) => ({
            id: p.id,
            name: p.name,
            status: p.status || "draft",
            employeeCount: p.employeeCount,
          }));
        }
      }

      setAvailableRuns(runs);
      if (runs.length > 0) {
        setSelectedRunId(runs[0].id);
      }
    } catch {
      setAvailableRuns([]);
    } finally {
      setLoadingRuns(false);
    }
  };

  const handleOpenNewBatchModal = () => {
    setSelectRunModalOpen(true);
    fetchAvailableRuns();
  };

  const handleProceedToRunPayment = (runIdToUse?: string) => {
    const targetRunId = (runIdToUse || customRunId.trim() || selectedRunId).trim();
    if (!targetRunId) {
      toast.error("Please select a payroll run or enter a Run ID");
      return;
    }
    setSelectRunModalOpen(false);
    navigate({
      to: `/dashboard/payroll/runs/${targetRunId}/payment` as any,
    });
  };

  const loadBatches = async () => {
    setLoading(true);
    try {
      const data = await paymentApi.getPaymentBatches({
        page,
        limit: 20,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      setBatches(data?.items || []);
      setTotalCount(data?.total || 0);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBatches([]);
        setTotalCount(0);
      } else {
        toast.error("Failed to load payment batches");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [page, statusFilter]);

  const getStatusBadge = (status?: PaymentBatchStatus | string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Approved</Badge>;
      case "submitted":
        return <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30">Submitted to Bank</Badge>;
      case "reconciled":
      case "closed":
        return <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">Reconciled</Badge>;
      case "validation_failed":
      case "rejected":
        return <Badge variant="destructive">Validation Failed</Badge>;
      case "validated":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">Validated</Badge>;
      default:
        return <Badge variant="outline">{status.replace(/_/g, " ")}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Top Actions Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={loadBatches}
          disabled={loading}
          className="h-8 gap-1.5 text-xs"
        >
          <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          <span>Refresh</span>
        </Button>

        <Button
          size="sm"
          onClick={handleOpenNewBatchModal}
          className="h-8 gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Batch from Run</span>
        </Button>
      </div>

      {/* ── Summary Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Batches"
          value={formatCount(totalCount)}
          hint="All time disbursements"
          icon={Layers}
          accent="brand"
        />
        <StatCard
          label="Pending Approval"
          value={formatCount(batches.filter((b) => b.status === "validated" || b.status === "pending_approval").length)}
          hint="Awaiting checker"
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Submitted to Bank"
          value={formatCount(batches.filter((b) => b.status === "submitted").length)}
          hint="In banking processing"
          icon={Banknote}
          accent="brand"
        />
        <StatCard
          label="Reconciled"
          value={formatCount(batches.filter((b) => b.status === "reconciled" || b.status === "closed").length)}
          hint="100% matched"
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      {/* ── Search and Filter Controls ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="batch-search-input"
            type="search"
            placeholder="Search batch number or period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadBatches();
            }}
            className="pl-8 h-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none">
          {["all", "draft", "validated", "approved", "submitted", "reconciled"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className="rounded-xl text-xs h-8 capitalize"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Batches Table ───────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Batch Number</th>
                <th className="px-4 py-3.5">Payroll Period</th>
                <th className="px-4 py-3.5">Payment Mode</th>
                <th className="px-4 py-3.5">Employees</th>
                <th className="px-4 py-3.5">Payable Amount</th>
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
                    <span>Loading payment batches...</span>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">No Payment Batches Found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Create a payment batch from any finalized payroll run to get started.
                    </p>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        onClick={handleOpenNewBatchModal}
                        className="h-8 gap-1.5 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>New Batch from Run</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">
                      {batch.batchNumber}
                    </td>
                    <td className="px-4 py-3 text-foreground">{batch.periodName}</td>
                    <td className="px-4 py-3 font-medium text-primary">{batch.paymentMode}</td>
                    <td className="px-4 py-3 font-mono">{formatCount(batch.employeeCount)}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {batch.payableAmountFormatted}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(batch.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(batch.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          navigate({
                            to: `/dashboard/payroll/payments/${batch.id}` as any,
                          })
                        }
                        className="h-7 text-xs gap-1"
                      >
                        <span>Manage</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Select Payroll Run Dialog ─────────────────────────────── */}
      <Dialog open={selectRunModalOpen} onOpenChange={setSelectRunModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              <span>Create Payment Batch from Run</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a finalized payroll run or enter a Run ID to initiate payment disbursements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {loadingRuns ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground gap-2 text-xs">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>Loading available payroll runs...</span>
              </div>
            ) : availableRuns.length > 0 ? (
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Available Payroll Runs</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {availableRuns.map((r) => {
                    const isSelected = selectedRunId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRunId(r.id);
                          setCustomRunId("");
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-border/70 hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{r.name}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">Run ID: {r.id}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {r.status || "Ready"}
                          </Badge>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "ghost"}
                            className="h-7 text-xs px-2.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProceedToRunPayment(r.id);
                            }}
                          >
                            <span>Select</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 p-4 text-center">
                <Clock className="h-6 w-6 text-muted-foreground/60 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-foreground">No recent payroll runs detected</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Enter a Payroll Run ID below to configure its payment disbursement.
                </p>
              </div>
            )}

            {/* Manual Run ID Input */}
            <div className="space-y-1.5 pt-1 border-t border-border/60">
              <label className="text-xs font-medium text-muted-foreground">
                Or enter Payroll Run ID directly:
              </label>
              <Input
                placeholder="e.g. run-2026-09 or 1"
                value={customRunId}
                onChange={(e) => {
                  setCustomRunId(e.target.value);
                  if (e.target.value) setSelectedRunId("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleProceedToRunPayment();
                }}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t border-border/60 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectRunModalOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleProceedToRunPayment()}
              disabled={!selectedRunId && !customRunId.trim()}
              className="h-8 text-xs gap-1.5"
            >
              <span>Continue to Payment Batch</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
