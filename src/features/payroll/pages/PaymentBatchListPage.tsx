import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate, formatCount } from "@/lib/format";
import { paymentApi } from "../api/paymentApi";
import type { PaymentBatch, PaymentBatchStatus } from "../types/payment";
import { toast } from "sonner";

export default function PaymentBatchListPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [batches, setBatches] = useState<PaymentBatch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadBatches = async () => {
    setLoading(true);
    setBackendUnavailable(false);
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
        setBackendUnavailable(true);
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

  const getStatusBadge = (status: PaymentBatchStatus) => {
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
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Salary Payment & Disbursement Hub
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary">
              Disbursement Batches
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Track, validate, approve, and reconcile salary payment batches across all finalized payroll cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={() => navigate({ to: "/dashboard/payroll" as any })}
            className="h-8 gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Batch from Run</span>
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
              The Payment & Disbursement API endpoint (<code>GET /api/v2/payroll/payment-batches</code>) is not yet deployed on the backend.
              Frontend architecture and contract mappings are ready.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

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
                      {backendUnavailable
                        ? "Backend payment API endpoints pending deployment."
                        : "Create a payment batch from any finalized payroll run to get started."}
                    </p>
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
    </div>
  );
}
