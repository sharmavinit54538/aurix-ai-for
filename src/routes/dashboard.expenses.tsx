import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Receipt, CheckCircle2, XCircle, Wallet, Clock, Upload } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CsvButton, GlassCard, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/expenses")({
  head: () => ({ meta: [{ title: "Expense Claims — Aurix" }] }),
  component: ExpensesPage,
});

const CATEGORIES: ExpenseCategory[] = ["travel", "meals", "lodging", "supplies", "training", "client", "other"];

const STATUS_TONE: Record<ExpenseStatus, "warning" | "info" | "success" | "danger" | "muted"> = {
  pending: "warning",
  approved: "info",
  "changes-requested": "warning",
  rejected: "danger",
  paid: "success",
};

function emptyExpense(): Expense {
  return {
    id: newId("x"), employee: "", category: "travel", amount: 0, currency: "INR",
    date: new Date().toISOString().slice(0, 10), description: "", status: "pending", submittedAt: new Date().toISOString(),
  };
}

function ExpensesPage() {
  const expenses = useHrms((s) => s.expenses);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ExpenseStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Expense>(emptyExpense());

  const stats = useMemo(() => {
    const by = (s: ExpenseStatus) => expenses.filter((e) => e.status === s);
    return {
      pending: by("pending").length,
      approved: by("approved").length,
      rejected: by("rejected").length,
      paid: by("paid").length,
      paidAmount: by("paid").reduce((s, e) => s + e.amount, 0),
    };
  }, [expenses]);

  const monthly = useMemo(() => {
    const m = new Map<string, number>();
    expenses.forEach((e) => {
      const key = new Date(e.date).toLocaleString(undefined, { month: "short" });
      m.set(key, (m.get(key) ?? 0) + e.amount);
    });
    return Array.from(m, ([month, amount]) => ({ month, amount }));
  }, [expenses]);

  const filtered = useMemo(() => expenses
    .filter((e) => (filter === "all" ? true : e.status === filter))
    .filter((e) => query.trim() === "" ? true : `${e.employee} ${e.description} ${e.category}`.toLowerCase().includes(query.toLowerCase())),
  [expenses, filter, query]);

  function submit() {
    if (!draft.employee || draft.amount <= 0) return;
    hrms.upsertExpense({ ...draft, submittedAt: new Date().toISOString() });
    setOpen(false);
    setDraft(emptyExpense());
  }

  return (
    <>
      <PageHeader
        title="Expense Claims"
        description="Submit, review, and reimburse employee expenses."
        actions={
          <>
            <CsvButton rows={expenses} filename="expenses.csv" />
            <Button size="sm" onClick={() => { setDraft(emptyExpense()); setOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Submit claim
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="danger" />
        <StatCard label="Paid" value={`₹${stats.paidAmount.toLocaleString()}`} hint={`${stats.paid} claims`} icon={Wallet} accent="brand" />
      </div>

      <GlassCard className="mb-6">
        <div className="mb-2 font-medium">Monthly expense volume</div>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search claims…" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="h-9 rounded-md border border-border bg-background px-3 text-sm">
          <option value="all">All</option>
          {(["pending", "approved", "changes-requested", "rejected", "paid"] as ExpenseStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-border/60 last:border-0 align-top">
                <td className="px-4 py-3 font-medium">{e.employee}</td>
                <td className="px-4 py-3 capitalize">{e.category}</td>
                <td className="px-4 py-3">
                  <div>{e.description}</div>
                  {e.managerNote ? <div className="mt-1 text-xs text-muted-foreground">Note: {e.managerNote}</div> : null}
                  {e.receiptName ? <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Receipt className="h-3 w-3" />{e.receiptName}</div> : null}
                </td>
                <td className="px-4 py-3">₹{e.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(e.date).toLocaleDateString()}</td>
                <td className="px-4 py-3"><StatusBadge status={e.status} tone={STATUS_TONE[e.status]} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {e.status === "pending" || e.status === "changes-requested" ? (
                      <>
                        <Button size="sm" onClick={() => hrms.setExpenseStatus(e.id, "approved")}>Approve</Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          const note = window.prompt("Request changes — note:");
                          if (note != null) hrms.setExpenseStatus(e.id, "changes-requested", note);
                        }}>Changes</Button>
                        <Button variant="ghost" size="sm" onClick={() => hrms.setExpenseStatus(e.id, "rejected")}>Reject</Button>
                      </>
                    ) : e.status === "approved" ? (
                      <Button size="sm" onClick={() => hrms.setExpenseStatus(e.id, "paid")}>Mark paid</Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit expense claim</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Employee</Label><Input value={draft.employee} onChange={(e) => setDraft({ ...draft, employee: e.target.value })} /></div>
            <div>
              <Label>Category</Label>
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ExpenseCategory })} className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Date</Label><Input type="date" value={draft.date.slice(0, 10)} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></div>
            <div><Label>Amount (₹)</Label><Input type="number" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })} /></div>
            <div>
              <Label>Receipt</Label>
              <label className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card/40 text-xs text-muted-foreground hover:bg-card">
                <Upload className="h-3.5 w-3.5" />
                <span>{draft.receiptName ?? "Upload file"}</span>
                <input type="file" className="hidden" onChange={(e) => setDraft({ ...draft, receiptName: e.target.files?.[0]?.name })} />
              </label>
            </div>
            <div className="col-span-2"><Label>Description</Label><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
