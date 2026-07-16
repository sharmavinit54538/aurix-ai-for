import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard, Download, FileText, LayoutDashboard, History as HistoryIcon,
  Percent, FileCheck, Receipt, Gift, TrendingUp, Landmark, Coins,
  HeartHandshake, Building, Sparkles, AlertCircle, Plus, Info, RefreshCw
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/payroll/")({
  head: () => ({ meta: [{ title: "Payroll Dashboard — Aurix" }] }),
  component: PayrollDashboardPage,
});

interface PayrollTab {
  id: string;
  label: string;
  icon: any;
}

const MOCK_REIMBURSEMENTS = [
  { id: "cl-1", category: "Internet Allowance", amount: 45, date: "2026-07-01", status: "approved" },
  { id: "cl-2", category: "Client Lunch Meeting", amount: 120, date: "2026-07-05", status: "pending" }
];

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function PayrollDashboardPage() {
  const ws = useAurix();
  const userRole = (ws.user?.role || "employee") as string;
  const total = ws.employees.reduce((s, e) => s + 4500 + ((e.id.length * 137) % 6000), 0);

  const [activeTab, setActiveTab] = useState("payslips");

  // Reimbursements form state
  const [reimbCategory, setReimbCategory] = useState("Internet Allowance");
  const [reimbAmount, setReimbAmount] = useState("");
  const [reimbDate, setReimbDate] = useState("");
  const [reimbDesc, setReimbDesc] = useState("");
  const [reimbList, setReimbList] = useState(MOCK_REIMBURSEMENTS);

  const employeeTabs: PayrollTab[] = [
    { id: "payslips", label: "Salary Slips", icon: FileText },
    { id: "structure", label: "Salary Structure", icon: LayoutDashboard },
    { id: "history", label: "Payroll History", icon: HistoryIcon },
    { id: "tax", label: "Tax Details", icon: Percent },
    { id: "form16", label: "Form 16", icon: FileCheck },
    { id: "reimbursements", label: "Reimbursements", icon: Receipt },
    { id: "bonuses", label: "Bonuses", icon: Gift },
    { id: "incentives", label: "Incentives", icon: TrendingUp },
    { id: "bank", label: "Bank Details", icon: Landmark },
    { id: "pf", label: "PF Details", icon: Coins },
    { id: "esi", label: "ESI Details", icon: HeartHandshake },
    { id: "tds", label: "TDS Statements", icon: Building },
  ];

  const handleReimbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reimbAmount || Number(reimbAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (!reimbDate) {
      toast.error("Please select a date.");
      return;
    }
    const newClaim = {
      id: "cl-" + Date.now(),
      category: reimbCategory,
      amount: Number(reimbAmount),
      date: reimbDate,
      status: "pending"
    };
    setReimbList([newClaim, ...reimbList]);
    toast.success("Reimbursement claim submitted successfully!");
    setReimbAmount("");
    setReimbDate("");
    setReimbDesc("");
  };

  // If user is employee, render unified side-tabbed layout
  if (userRole === "employee") {
    return (
      <>
        <PageHeader
          title="Payroll & Compensation Portal"
          description="Access your payslips, view your salary structure, and file reimbursement claims."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-1">
            {employeeTabs.map((t) => {
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
            {activeTab === "payslips" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Your Payslips</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { month: "June 2026", gross: 5500, net: 4290, date: "2026-06-30" },
                    { month: "May 2026", gross: 5500, net: 4290, date: "2026-05-31" },
                    { month: "April 2026", gross: 5500, net: 4290, date: "2026-04-30" }
                  ].map((p, i) => (
                    <div key={i} className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-sm">{p.month}</div>
                        <div className="text-muted-foreground mt-0.5">Net Payout: {fmt(p.net)}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Processed on: {p.date}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Downloading payslip PDF...")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "structure" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Active Salary Structure</h3>
                <div className="border rounded-xl bg-card/50 overflow-hidden text-xs">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Earnings Component</TableHead>
                        <TableHead className="pr-6 py-4 text-right">Monthly (USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Basic Salary", amount: 3500 },
                        { name: "House Rent Allowance (HRA)", amount: 1000 },
                        { name: "Special Allowance", amount: 1000 },
                      ].map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="pl-6 py-4 font-semibold">{item.name}</TableCell>
                          <TableCell className="pr-6 py-4 text-right font-mono">{fmt(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/10 font-semibold border-t">
                        <TableCell className="pl-6 py-4 font-bold text-foreground">Gross Earnings</TableCell>
                        <TableCell className="pr-6 py-4 text-right font-mono font-bold text-indigo-500">{fmt(5500)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Payout History Logs</h3>
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Payout Period</TableHead>
                        <TableHead className="py-4">Bank Account</TableHead>
                        <TableHead className="py-4">Transaction ID</TableHead>
                        <TableHead className="py-4 text-right">Net Paid</TableHead>
                        <TableHead className="pr-6 py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { period: "June 2026", bank: "Chase (***4321)", tx: "TXN98234710", amount: 4290, status: "completed" },
                        { period: "May 2026", bank: "Chase (***4321)", tx: "TXN98104239", amount: 4290, status: "completed" }
                      ].map((h, i) => (
                        <TableRow key={i} className="hover:bg-muted/5 transition-all">
                          <TableCell className="pl-6 py-4 font-semibold">{h.period}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{h.bank}</TableCell>
                          <TableCell className="py-4 font-mono text-xs text-muted-foreground">{h.tx}</TableCell>
                          <TableCell className="py-4 text-right font-bold font-mono">{fmt(h.amount)}</TableCell>
                          <TableCell className="pr-6 py-4">
                            <Badge variant="secondary" className="capitalize">{h.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {activeTab === "tax" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Income Tax Summary</h3>
                <div className="space-y-4 border rounded-xl p-4 bg-background/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Taxable Income:</span>
                    <span className="font-semibold">{fmt(66000)} / year</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Declared Deductions (80C / etc.):</span>
                    <span className="font-semibold text-emerald-500">{fmt(5000)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Projected TDS:</span>
                    <span className="font-bold text-rose-500">{fmt(14520)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "form16" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Form 16 Portal</h3>
                <div className="grid gap-3 sm:grid-cols-2 max-w-lg">
                  <div className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-sm">FY 2025-26 Form 16 Part A</div>
                      <div className="text-muted-foreground mt-0.5">Employer TDS summary details.</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloading Part A...")}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-sm">FY 2025-26 Form 16 Part B</div>
                      <div className="text-muted-foreground mt-0.5">Salary breakdown & tax calculations.</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloading Part B...")}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reimbursements" && (
              <div className="grid gap-6 md:grid-cols-2">
                <form onSubmit={handleReimbSubmit} className="space-y-4">
                  <h3 className="text-base font-semibold border-b pb-2">File Reimbursement Claim</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Claim Category</Label>
                    <select
                      value={reimbCategory}
                      onChange={(e) => setReimbCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                    >
                      <option value="Internet Allowance">Internet Allowance</option>
                      <option value="Travel Expenses">Travel Expenses</option>
                      <option value="Client Lunch Meeting">Client Lunch Meeting</option>
                      <option value="Office Equipment">Office Equipment</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Claim Amount (USD)</Label>
                    <Input
                      type="number"
                      required
                      min="1"
                      value={reimbAmount}
                      onChange={(e) => setReimbAmount(e.target.value)}
                      className="bg-background/50 border"
                      placeholder="e.g. 50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Bill Date</Label>
                    <Input
                      type="date"
                      required
                      value={reimbDate}
                      onChange={(e) => setReimbDate(e.target.value)}
                      className="bg-background/50 border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Detailed Remarks</Label>
                    <textarea
                      value={reimbDesc}
                      onChange={(e) => setReimbDesc(e.target.value)}
                      placeholder="Describe the claim details..."
                      className="w-full min-h-[90px] bg-background/50 border rounded-lg p-3 text-sm focus:ring-1"
                    />
                  </div>

                  <Button type="submit">Submit Claim</Button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold border-b pb-2">Claim Submission History</h3>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto">
                    {reimbList.map((log) => (
                      <div key={log.id} className="border bg-card/30 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold">{log.category}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Amount: {fmt(log.amount)} | Date: {log.date}</div>
                        </div>
                        <Badge
                          variant={log.status === "approved" ? "secondary" : "outline"}
                          className="text-[10px] capitalize"
                        >
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bonuses" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Annual Bonuses Log</h3>
                <div className="space-y-3 text-xs">
                  <div className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">Performance Bonus (Q1 2026)</div>
                      <div className="text-muted-foreground mt-0.5">Received on: 2026-03-31</div>
                    </div>
                    <span className="font-bold text-emerald-500 text-sm">{fmt(500)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "incentives" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Referral & Spot Incentives</h3>
                <div className="space-y-3 text-xs">
                  <div className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">Employee Referral Program</div>
                      <div className="text-muted-foreground mt-0.5">Candidate: Sarah Smith (Developer)</div>
                    </div>
                    <span className="font-bold text-emerald-500 text-sm">{fmt(1000)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bank" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Bank Details Record</h3>
                <div className="space-y-4 border rounded-xl p-4 bg-background/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-semibold">Chase Manhattan Bank</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Account Holder:</span>
                    <span className="font-semibold">{ws.user?.fullName || "Employee"}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-semibold">**** **** 4321</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">IFSC / Routing Code:</span>
                    <span className="font-semibold">CHASEUS33XX</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pf" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Provident Fund (PF) Breakdown</h3>
                <div className="space-y-4 border rounded-xl p-4 bg-background/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EPF UAN Number:</span>
                    <span className="font-semibold">100938472910</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Employee Monthly Contribution:</span>
                    <span className="font-semibold">{fmt(180)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Employer Monthly Contribution:</span>
                    <span className="font-semibold">{fmt(180)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "esi" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b pb-2">Employee State Insurance (ESI)</h3>
                <div className="space-y-4 border rounded-xl p-4 bg-background/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ESI IP Number:</span>
                    <span className="font-semibold">41103948293847</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Employee Share (0.75%):</span>
                    <span className="font-semibold">{fmt(33)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Employer Share (3.25%):</span>
                    <span className="font-semibold">{fmt(146)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tds" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Quarterly TDS Statements</h3>
                <div className="grid gap-3 sm:grid-cols-2 max-w-lg text-xs">
                  {[
                    { qtr: "Q1 Statement (Form 27D)", tax: 3630 },
                    { qtr: "Q2 Statement (Form 27D)", tax: 3630 }
                  ].map((item, i) => (
                    <div key={i} className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{item.qtr}</div>
                        <div className="text-muted-foreground mt-0.5">TDS Deducted: {fmt(item.tax)}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Downloading statement...")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Original Admin Dashboard view
  return (
    <>
      <PageHeader
        title="Payroll Dashboard"
        description="Run payroll, manage compensation, and download payslips."
        actions={
          <>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button><CreditCard className="mr-2 h-4 w-4" />Run payroll</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PayrollStatCard label="Current cycle" value="Jul 2026" />
        <PayrollStatCard label="Total payout" value={fmt(total)} />
        <PayrollStatCard label="Payslips ready" value={`${ws.employees.length} / ${ws.employees.length}`} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <div className="border-b border-border px-4 py-3"><h3 className="font-medium">Compensation</h3></div>
        {ws.employees.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Add employees to view their compensation.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Gross</th><th className="px-4 py-3">Net</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody>
                {ws.employees.map((e) => {
                  const gross = 4500 + ((e.id.length * 137) % 6000);
                  const net = Math.round(gross * 0.78);
                  return (
                    <tr key={e.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{e.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                      <td className="px-4 py-3">{fmt(gross)}</td>
                      <td className="px-4 py-3">{fmt(net)}</td>
                      <td className="px-4 py-3"><Badge variant="secondary">Ready</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function PayrollStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
