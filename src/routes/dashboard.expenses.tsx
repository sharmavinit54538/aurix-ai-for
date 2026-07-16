import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus, Receipt, CheckCircle2, XCircle, Wallet, Clock, Upload,
  FilePlus2, HandCoins, Plane, History as HistoryIcon, LayoutDashboard
} from "lucide-react";
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
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const ws = useAurix();
  const userRole = ws.user?.role || "employee";
  const [activeTab, setActiveTab] = useState(userRole === "employee" ? "submit" : "");

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

  const employeeExpenseTabs = [
    { id: "submit", label: "Submit Expense", icon: FilePlus2 },
    { id: "reimbursements", label: "Reimbursements", icon: HandCoins },
    { id: "travel-claims", label: "Travel Claims", icon: Plane },
    { id: "history", label: "Expense History", icon: HistoryIcon },
  ];

  const myExpenses = useMemo(() => {
    return expenses.filter(e => e.employee === ws.user?.fullName);
  }, [expenses, ws.user?.fullName]);

  const handleEmployeeSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    hrms.upsertExpense({
      ...draft,
      employee: ws.user?.fullName || "Employee",
      submittedAt: new Date().toISOString()
    });
    toast.success("Expense claim submitted successfully!");
    setDraft(emptyExpense());
    setActiveTab("history");
  };

  if (userRole === "employee") {
    return (
      <>
        <PageHeader 
          title="Expense & Reimbursements Portal" 
          description="Log and claim business expenditures, travel claims, and view reimbursement statements."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-1">
            {employeeExpenseTabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active 
                      ? "bg-accent text-foreground" 
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </aside>

          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            {activeTab === "submit" && (
              <form onSubmit={handleEmployeeSubmitExpense} className="space-y-4 max-w-md text-xs">
                <h3 className="text-base font-semibold border-b pb-2 font-display">Submit New Expense</h3>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Claim Category</Label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Claim Amount (INR)</Label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={draft.amount === 0 ? "" : draft.amount}
                    onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
                    className="bg-background/50 border"
                    placeholder="e.g. 1500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Expense Date</Label>
                  <Input
                    type="date"
                    required
                    value={draft.date}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Description / Comments</Label>
                  <Textarea
                    required
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    placeholder="Briefly explain the purpose of this expense..."
                    className="bg-background/50 border min-h-[90px]"
                  />
                </div>

                <Button type="submit">Submit Expense Request</Button>
              </form>
            )}

            {activeTab === "reimbursements" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Active Reimbursements</h3>
                <div className="space-y-3">
                  {myExpenses.filter(e => e.status !== "rejected" && e.status !== "paid").map((exp) => (
                    <div key={exp.id} className="border bg-card/30 rounded-xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-sm capitalize">{exp.category} Expense</div>
                        <div className="text-muted-foreground mt-0.5">{exp.description}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Submitted on: {exp.submittedAt ? exp.submittedAt.slice(0, 10) : exp.date}</div>
                      </div>
                      <div className="text-right space-y-1.5">
                        <div className="font-bold text-indigo-400">₹{exp.amount.toLocaleString()}</div>
                        <StatusBadge tone={STATUS_TONE[exp.status]} status={exp.status} />
                      </div>
                    </div>
                  ))}
                  {myExpenses.filter(e => e.status !== "rejected" && e.status !== "paid").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      No active pending reimbursements claims.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "travel-claims" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Travel Allowances & Flights Claims</h3>
                <div className="space-y-3">
                  {myExpenses.filter(e => e.category === "travel").map((exp) => (
                    <div key={exp.id} className="border bg-card/30 rounded-xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-sm">Travel Claim - {exp.description}</div>
                        <div className="text-muted-foreground mt-0.5">Date: {exp.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-indigo-400">₹{exp.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 capitalize">{exp.status}</div>
                      </div>
                    </div>
                  ))}
                  {myExpenses.filter(e => e.category === "travel").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      No travel claims filed.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Claims History Log</h3>
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Submitted Date</TableHead>
                        <TableHead className="py-4">Category</TableHead>
                        <TableHead className="py-4">Description</TableHead>
                        <TableHead className="py-4 text-right">Amount</TableHead>
                        <TableHead className="pr-6 py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myExpenses.map((exp) => (
                        <TableRow key={exp.id} className="hover:bg-muted/5 transition-all">
                          <TableCell className="pl-6 py-4 font-semibold">{exp.date}</TableCell>
                          <TableCell className="py-4 capitalize">{exp.category}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{exp.description}</TableCell>
                          <TableCell className="py-4 text-right font-bold font-mono">₹{exp.amount.toLocaleString()}</TableCell>
                          <TableCell className="pr-6 py-4">
                            <StatusBadge tone={STATUS_TONE[exp.status]} status={exp.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {myExpenses.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No past claims found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
          </div>
        </div>
      </>
    );
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
