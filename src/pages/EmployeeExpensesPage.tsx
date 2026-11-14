import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PencilLine,
  Plus,
  Receipt,
  RefreshCw,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAurix } from "@/lib/aurix-store";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/lib/hrms/types";
import { expensesApi } from "@/services/expensesApi";

const CATEGORIES: ExpenseCategory[] = ["travel", "meals", "lodging", "supplies", "training", "client", "other"];

const STATUS_TONE: Record<ExpenseStatus, "warning" | "info" | "success" | "danger" | "muted"> = {
  pending: "warning",
  approved: "info",
  "changes-requested": "warning",
  rejected: "danger",
  paid: "success",
};

const FILTER_TABS: Array<{ id: ExpenseStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "changes-requested", label: "Needs Changes" },
  { id: "approved", label: "Approved" },
  { id: "paid", label: "Reimbursed" },
  { id: "rejected", label: "Rejected" },
];

function blankDraft(employeeName: string): Expense {
  return {
    id: "",
    employee: employeeName,
    category: "travel",
    amount: 0,
    currency: "INR",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
}

export function EmployeeExpensesPage() {
  const ws = useAurix();
  const employeeName = ws.user?.fullName?.trim() || ws.user?.email || "Employee";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ExpenseStatus | "all">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Expense>(() => blankDraft(employeeName));
  const [submitting, setSubmitting] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const loadMyExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expensesApi.getMyExpenses(employeeName);
      setExpenses(Array.isArray(res?.items) ? res.items : []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load your expenses";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [employeeName]);

  useEffect(() => {
    loadMyExpenses();
  }, [loadMyExpenses]);

  const stats = useMemo(() => {
    const by = (s: ExpenseStatus) => expenses.filter((e) => e.status === s);
    const pendingList = by("pending");
    const approvedList = by("approved");
    const paidList = by("paid");
    const actionList = by("changes-requested");

    return {
      pendingCount: pendingList.length,
      pendingAmount: pendingList.reduce((sum, e) => sum + Number(e.amount || 0), 0),
      approvedCount: approvedList.length,
      approvedAmount: approvedList.reduce((sum, e) => sum + Number(e.amount || 0), 0),
      paidCount: paidList.length,
      paidAmount: paidList.reduce((sum, e) => sum + Number(e.amount || 0), 0),
      actionCount: actionList.length,
    };
  }, [expenses]);

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => (filter === "all" ? true : e.status === filter))
        .filter((e) =>
          query.trim() === ""
            ? true
            : `${e.category} ${e.description} ${e.receiptName || ""}`
                .toLowerCase()
                .includes(query.toLowerCase()),
        ),
    [expenses, filter, query],
  );

  function openNewClaim() {
    setEditingId(null);
    setDraft(blankDraft(employeeName));
    setModalOpen(true);
  }

  function openResubmit(expense: Expense) {
    setEditingId(expense.id);
    setDraft({ ...expense, employee: employeeName });
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (!draft.description.trim() || Number(draft.amount) <= 0) {
      toast.error("Please enter a valid amount and business description");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await expensesApi.resubmitExpense(editingId, {
          ...draft,
          employee: employeeName,
        });
        setExpenses((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        toast.success("Expense claim updated and resubmitted for review");
      } else {
        const created = await expensesApi.createExpense({
          ...draft,
          employee: employeeName,
        });
        setExpenses((prev) => [created, ...prev]);
        toast.success("Expense claim submitted for approval");
      }
      setModalOpen(false);
      setEditingId(null);
      setDraft(blankDraft(employeeName));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWithdraw(id: string) {
    setWithdrawingId(id);
    try {
      await expensesApi.withdrawExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      toast.success("Expense claim withdrawn");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to withdraw expense claim");
    } finally {
      setWithdrawingId(null);
    }
  }

  if (error && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-rose-500" />
        <h3 className="mb-1 text-lg font-semibold">Unable to load your expense claims</h3>
        <p className="mb-4 text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadMyExpenses} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">My Expense Claims</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit reimbursements, upload receipts, and track payout status for{" "}
            <span className="font-medium text-foreground">{employeeName}</span>.
          </p>
        </div>
        <Button onClick={openNewClaim} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> New expense claim
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending Review"
          value={`₹${stats.pendingAmount.toLocaleString()}`}
          hint={`${stats.pendingCount} ${stats.pendingCount === 1 ? "claim" : "claims"}`}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Approved"
          value={`₹${stats.approvedAmount.toLocaleString()}`}
          hint={`${stats.approvedCount} awaiting payout`}
          icon={CheckCircle2}
          accent="info"
        />
        <StatCard
          label="Reimbursed"
          value={`₹${stats.paidAmount.toLocaleString()}`}
          hint={`${stats.paidCount} paid`}
          icon={Wallet}
          accent="success"
        />
        <StatCard
          label="Needs Action"
          value={stats.actionCount}
          hint={stats.actionCount > 0 ? "Revision requested" : "All up to date"}
          icon={AlertCircle}
          accent={stats.actionCount > 0 ? "danger" : "muted"}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filter === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SearchBox value={query} onChange={setQuery} placeholder="Search my claims…" />
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description &amp; Receipt</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Expense Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Loading your expense claims...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="mx-auto max-w-sm space-y-2">
                    <Receipt className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <div className="font-medium text-foreground">No expense claims found</div>
                    <p className="text-xs text-muted-foreground">
                      {expenses.length === 0
                        ? "You haven't submitted any reimbursement claims yet."
                        : "Try clearing your filter or search query."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((claim) => (
                <tr key={claim.id} className="border-b border-border/60 align-top last:border-0">
                  <td className="px-4 py-3.5 font-medium capitalize">{claim.category}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-foreground">{claim.description}</div>
                    {claim.managerNote ? (
                      <div className="mt-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300">
                        Reviewer note: {claim.managerNote}
                      </div>
                    ) : null}
                    {claim.receiptName ? (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Receipt className="h-3 w-3" /> {claim.receiptName}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 font-medium">₹{Number(claim.amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {Number.isNaN(new Date(claim.date).getTime())
                      ? claim.date
                      : new Date(claim.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={claim.status} tone={STATUS_TONE[claim.status] ?? "muted"} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {claim.status === "changes-requested" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => openResubmit(claim)}
                      >
                        <PencilLine className="h-3.5 w-3.5" /> Resubmit
                      </Button>
                    ) : claim.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={withdrawingId === claim.id}
                        className="gap-1.5 text-muted-foreground hover:text-destructive"
                        onClick={() => handleWithdraw(claim.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {withdrawingId === claim.id ? "Withdrawing…" : "Withdraw"}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Update & resubmit expense claim" : "New expense claim"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              Claimant: <span className="font-medium text-foreground">{employeeName}</span>
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as ExpenseCategory })}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-sm capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Expense Date</Label>
              <Input
                type="date"
                className="mt-1"
                value={draft.date.slice(0, 10)}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                min="1"
                className="mt-1"
                placeholder="e.g. 1500"
                value={draft.amount || ""}
                onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Receipt</Label>
              <label className="mt-1 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card/40 px-2 text-xs text-muted-foreground hover:bg-card">
                <Upload className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{draft.receiptName ?? "Upload receipt"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDraft({ ...draft, receiptName: file.name });
                  }}
                />
              </label>
            </div>
            <div className="col-span-2">
              <Label>Business Purpose / Description</Label>
              <Textarea
                className="mt-1"
                placeholder="Describe the business expense (e.g. client travel, team meal, course fee)"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : editingId ? "Resubmit claim" : "Submit claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeExpensesPage;
