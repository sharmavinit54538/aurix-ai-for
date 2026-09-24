import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  RefreshCw,
  Shield,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { essApi, type MyPayslipItem } from "../api/essApi";
import type { EmployeeSelfServiceData, ProvisionSlipRecord } from "../types/ess";
import { toast } from "sonner";
import { formatINR, formatDate, maskAccountNumber } from "@/lib/format";

export default function EmployeeSelfServicePayrollPage() {
  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [data, setData] = useState<EmployeeSelfServiceData | null>(null);

  // Payslips list state
  const [payslips, setPayslips] = useState<MyPayslipItem[]>([]);
  const [payslipsTotal, setPayslipsTotal] = useState(0);
  const [payslipsLoading, setPayslipsLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Provisional slips state
  const [provisionSlips, setProvisionSlips] = useState<ProvisionSlipRecord[]>([]);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionUnavailable, setProvisionUnavailable] = useState(false);

  // Downloading state
  const [downloadingRunId, setDownloadingRunId] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setBackendUnavailable(false);
    try {
      const res = await essApi.getMyPayrollDashboard();
      setData(res);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
      } else {
        toast.error("Failed to load your payroll details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPayslips = async () => {
    setPayslipsLoading(true);
    try {
      const res = await essApi.getMyPayslips({ page, limit: 10 });
      setPayslips(res.items || []);
      setPayslipsTotal(res.total || 0);
    } catch (err: any) {
      // Non-blocking if dashboard already rendered
    } finally {
      setPayslipsLoading(false);
    }
  };

  const loadProvisionSlips = async () => {
    setProvisionLoading(true);
    setProvisionUnavailable(false);
    try {
      const res = await essApi.getMyProvisionSlips();
      setProvisionSlips(res || []);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setProvisionUnavailable(true);
      }
    } finally {
      setProvisionLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadPayslips();
    loadProvisionSlips();
  }, [page]);

  const handleDownloadPayslip = async (runId: string, periodName: string) => {
    setDownloadingRunId(runId);
    try {
      const blob = await essApi.downloadMyPayslip(runId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${periodName.replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to download payslip PDF");
    } finally {
      setDownloadingRunId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">My Payroll & Payslips</h1>
            <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Strict Self-Isolation
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            View your salary statements, download digitally signed payslips, and review your tax declarations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadDashboard();
              loadPayslips();
              loadProvisionSlips();
            }}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {backendUnavailable && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Endpoint Pending</AlertTitle>
          <AlertDescription>
            The Employee Self-Service API endpoint (`/api/v2/payroll/employee/dashboard`) is not yet deployed on this environment.
            Refer to `docs/PAYROLL_BACKEND_TODO.md` for the required contract specification.
          </AlertDescription>
        </Alert>
      )}

      {/* Employee Identity Card */}
      {data && (
        <div className="rounded-2xl border border-border bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent p-5 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/20 text-brand-600 dark:text-brand-300 font-bold text-lg">
                {data.employeeName?.charAt(0) || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{data.employeeName}</span>
                  <Badge variant="secondary" className="font-mono text-xs">{data.employeeCode}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{data.department || "General"}</span>
                  <span>•</span>
                  <span>{data.designation || "Staff"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Shield className="h-3 w-3" />
                    Authorized Personal Session
                  </span>
                </div>
              </div>
            </div>
            {data.bankDetails && (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground font-medium">Disbursement Account</div>
                  <div className="font-mono font-medium">
                    {data.bankDetails.bankName} • {data.bankDetails.accountNumberMasked || maskAccountNumber("1234567890")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YTD Stats */}
      {data?.ytdSummary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={`YTD Gross (${data.ytdSummary.financialYear})`}
            value={data.ytdSummary.grossFormatted || formatINR(data.ytdSummary.totalGrossPaise / 100)}
            hint="Gross taxable earnings"
            accent="brand"
            icon={Wallet}
          />
          <StatCard
            label="YTD Total Deductions"
            value={data.ytdSummary.deductionsFormatted || formatINR(data.ytdSummary.totalDeductionsPaise / 100)}
            hint="PF, PT, TDS & recoveries"
            accent="warning"
            icon={Layers}
          />
          <StatCard
            label="YTD Net Disbursed"
            value={data.ytdSummary.netFormatted || formatINR(data.ytdSummary.totalNetPaise / 100)}
            hint="Total net take-home"
            accent="success"
            icon={CheckCircle2}
          />
          <StatCard
            label="YTD Income Tax (TDS)"
            value={formatINR(data.ytdSummary.totalTdsPaise / 100)}
            hint="Deposited with IT Dept"
            accent="muted"
            icon={FileText}
          />
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="payslips" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="payslips" className="gap-2">
            <FileText className="h-4 w-4" />
            Payslips & Statements
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <Shield className="h-4 w-4" />
            Tax & Deductions
          </TabsTrigger>
          <TabsTrigger value="bank" className="gap-2">
            <Banknote className="h-4 w-4" />
            Disbursement & Bank Details
          </TabsTrigger>
          <TabsTrigger value="provisional" className="gap-2">
            <Clock className="h-4 w-4" />
            Provisional Slips
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Payslips */}
        <TabsContent value="payslips" className="space-y-4">
          {/* Latest Payslip Highlight */}
          {data?.latestPayslip && (
            <GlassCard className="border-brand-500/20 bg-brand-500/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-brand-500/40 text-brand-600 dark:text-brand-300">
                      Latest Finalized Payslip
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Paid on {data.latestPayslip.payDate ? formatDate(data.latestPayslip.payDate) : "—"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{data.latestPayslip.periodName}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground">Gross: </span>
                      <span className="font-semibold">{data.latestPayslip.grossFormatted}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span className="text-xs text-muted-foreground">Deductions: </span>
                      <span className="font-semibold text-rose-500">{data.latestPayslip.deductionsFormatted}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span className="text-xs text-muted-foreground">Net Pay: </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {data.latestPayslip.netPayFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    handleDownloadPayslip(data.latestPayslip!.runId, data.latestPayslip!.periodName)
                  }
                  disabled={downloadingRunId === data.latestPayslip.runId}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {downloadingRunId === data.latestPayslip.runId ? "Downloading..." : "Download PDF"}
                </Button>
              </div>
            </GlassCard>
          )}

          {/* Payslip History Table */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Payslip History</h3>
                <p className="text-xs text-muted-foreground">All digitally approved payslips for your account</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Period</th>
                    <th className="px-4 py-3 font-medium">Disbursement Date</th>
                    <th className="px-4 py-3 font-medium text-right">Gross Earnings</th>
                    <th className="px-4 py-3 font-medium text-right">Net Take-Home</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payslipsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Loading your payslips...
                      </td>
                    </tr>
                  ) : payslips.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No historical payslips found for your account.
                      </td>
                    </tr>
                  ) : (
                    payslips.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium">{p.periodName}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.payDate ? formatDate(p.payDate) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{p.grossAmountFormatted}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {p.netPayFormatted}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            {p.status || "FINALIZED"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPayslip(p.runId, p.periodName)}
                            disabled={downloadingRunId === p.runId}
                            className="gap-1.5"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {downloadingRunId === p.runId ? "..." : "PDF"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Tab 2: Tax Overview */}
        <TabsContent value="tax" className="space-y-4">
          <GlassCard>
            <div className="mb-4">
              <h3 className="font-semibold">Income Tax & Statutory Declarations</h3>
              <p className="text-xs text-muted-foreground">
                Authoritative calculations performed by backend payroll engine under Indian Income Tax Act.
              </p>
            </div>

            {data?.taxOverview ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="text-xs text-muted-foreground font-medium uppercase">Active Regime</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold">{data.taxOverview.taxRegime} REGIME</span>
                    <Badge variant="outline" className="border-brand-500/30 text-brand-600 dark:text-brand-300">
                      Locked
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Regime election for FY {data.ytdSummary?.financialYear || "current"}.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="text-xs text-muted-foreground font-medium uppercase">Declared Deductions / Exemptions</div>
                  <div className="mt-2 text-2xl font-bold">
                    {formatINR(data.taxOverview.declaredExemptionsPaise / 100)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Section 80C, 80D, HRA & Chapter VI-A investments.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="text-xs text-muted-foreground font-medium uppercase">Projected Annual Tax</div>
                  <div className="mt-2 text-2xl font-bold">
                    {data.taxOverview.annualTaxFormatted || formatINR(data.taxOverview.projectedAnnualTaxPaise / 100)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Total computed tax liability for current financial year.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="text-xs text-muted-foreground font-medium uppercase">TDS Deducted So Far</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {data.taxOverview.taxDeductedFormatted || formatINR(data.taxOverview.taxDeductedSoFarPaise / 100)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Deposited with NSDL under Form 24Q.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="text-xs text-muted-foreground font-medium uppercase">Remaining Projected Tax</div>
                  <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {formatINR(data.taxOverview.remainingTaxPaise / 100)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    To be amortized over remaining payroll periods.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No active tax declarations found.
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* Tab 3: Bank Details */}
        <TabsContent value="bank" className="space-y-4">
          <GlassCard>
            <div className="mb-4">
              <h3 className="font-semibold">Disbursement Bank Account</h3>
              <p className="text-xs text-muted-foreground">
                The authenticated bank account designated for your direct salary transfers.
              </p>
            </div>

            {data?.bankDetails ? (
              <div className="max-w-xl space-y-4 rounded-xl border border-border bg-card/30 p-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Account Holder Name</span>
                    <p className="mt-1 font-semibold">{data.bankDetails.accountHolderName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Bank Name</span>
                    <p className="mt-1 font-semibold">{data.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Account Number</span>
                    <p className="mt-1 font-mono font-semibold">
                      {data.bankDetails.accountNumberMasked || maskAccountNumber("1234567890")}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">IFSC Code</span>
                    <p className="mt-1 font-mono font-semibold">{data.bankDetails.ifscCode}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
                  <div className="flex items-center gap-2 font-medium">
                    <Shield className="h-3.5 w-3.5" />
                    Security & Compliance Notice
                  </div>
                  <p className="mt-1">
                    To prevent payroll diversion attacks, bank account modifications require a verified cancelled cheque submission and HR maker-checker validation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No disbursement account configured.
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* Tab 4: Provisional Slips */}
        <TabsContent value="provisional" className="space-y-4">
          <GlassCard>
            <div className="mb-4">
              <h3 className="font-semibold">Provisional Salary Slips</h3>
              <p className="text-xs text-muted-foreground">
                Advance draft slips prior to finalization or for visa / loan application requirements.
              </p>
            </div>

            {provisionUnavailable ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <HelpCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <h4 className="font-medium text-sm">Feature Unavailable on Backend</h4>
                <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                  Provisional salary slips are not supported by the current backend environment. This requirement is tracked in `docs/PAYROLL_BACKEND_TODO.md`.
                </p>
              </div>
            ) : provisionLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading provisional slips...</div>
            ) : provisionSlips.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No active provisional salary slips issued.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Period</th>
                      <th className="px-4 py-3 font-medium">Generated At</th>
                      <th className="px-4 py-3 font-medium text-right">Provisional Gross</th>
                      <th className="px-4 py-3 font-medium text-right">Provisional Net</th>
                      <th className="px-4 py-3 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {provisionSlips.map((ps) => (
                      <tr key={ps.provisionId} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium">{ps.periodName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(ps.generatedAt)}</td>
                        <td className="px-4 py-3 text-right font-medium">{ps.provisionalGrossFormatted}</td>
                        <td className="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400">
                          {ps.provisionalNetFormatted}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="capitalize">
                            {ps.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
