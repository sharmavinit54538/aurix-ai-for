import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Layers,
  Lock,
  RefreshCw,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatINR, formatCount } from "@/lib/format";
import { statutoryApi } from "../api/statutoryApi";
import type {
  StatutoryConfig,
  StatutoryPeriodSummary,
  StatutoryComponent,
} from "../types/statutory";
import { toast } from "sonner";

export default function StatutoryCompliancePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "pf" | "esi" | "pt" | "tds">("overview");
  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const [config, setConfig] = useState<StatutoryConfig | null>(null);
  const [summary, setSummary] = useState<StatutoryPeriodSummary | null>(null);
  const [downloadingReport, setDownloadingReport] = useState<StatutoryComponent | null>(null);

  const loadData = async () => {
    setLoading(true);
    setBackendUnavailable(false);
    try {
      const [cfgRes, sumRes] = await Promise.all([
        statutoryApi.getStatutoryConfig().catch((err) => {
          if (err?.response?.status === 404 || err?.response?.status === 501) {
            setBackendUnavailable(true);
          }
          return null;
        }),
        statutoryApi.getStatutorySummary().catch((err) => {
          if (err?.response?.status === 404 || err?.response?.status === 501) {
            setBackendUnavailable(true);
          }
          return null;
        }),
      ]);
      setConfig(cfgRes);
      setSummary(sumRes);
    } catch {
      toast.error("Failed to load statutory compliance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadReport = async (comp: StatutoryComponent, format: "csv" | "txt") => {
    setDownloadingReport(comp);
    try {
      const blob = await statutoryApi.requestStatutoryReport(comp, "current", format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${comp}_RETURN_REPORT.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      toast.success(`${comp} return report downloaded.`);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        toast.error("Statutory return service unavailable — backend pending");
      } else {
        toast.error(`Failed to download ${comp} report`);
      }
    } finally {
      setDownloadingReport(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Statutory Compliance & Government Returns
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              India Regulatory
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Authoritative computation of PF, ESI, Professional Tax, and TDS returns. Backend is authoritative for rates and slabs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
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
              Statutory Compliance API endpoints (<code>/api/v2/payroll/statutory/*</code>) are awaiting backend deployment.
              Regulatory rule models and ECR return export pipelines are ready.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Statutory Summary Stat Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Provident Fund (PF)"
          value={summary?.pfTotals?.formattedTotal || "—"}
          hint={summary ? `${summary.pfTotals.eligibleCount} employees covered` : "Authoritative backend calculation"}
          icon={Building}
          accent="brand"
        />
        <StatCard
          label="Employee State Insurance (ESI)"
          value={summary?.esiTotals?.formattedTotal || "—"}
          hint={summary ? `${summary.esiTotals.eligibleCount} employees covered` : "Authoritative backend calculation"}
          icon={ShieldCheck}
          accent="success"
        />
        <StatCard
          label="Professional Tax (PT)"
          value={summary?.ptTotals?.formattedTotal || "—"}
          hint={summary ? `${summary.ptTotals.coveredCount} employees covered` : "State slab jurisdiction"}
          icon={Scale}
          accent="warning"
        />
        <StatCard
          label="Income Tax / TDS"
          value={summary?.tdsTotals?.formattedTotal || "—"}
          hint={summary ? `${summary.tdsTotals.deductedCount} employees deducted` : "Regime & slab calculations"}
          icon={FileCheck}
          accent="muted"
        />
      </div>

      {/* ── Regulatory Governance Notice ────────────────────────────── */}
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Statutory Authority & Compliance Policy</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Statutory contribution formulas, wage ceilings, state slabs, and income tax exemptions are strictly executed on the server.
          The frontend does not duplicate or hardcode government rules.
        </p>
      </div>

      {/* ── Statutory Breakdown Tabs ─────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="space-y-4"
      >
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/60">
          <TabsTrigger value="overview" className="rounded-xl text-xs">
            Employee Contributions Overview
          </TabsTrigger>
          <TabsTrigger value="pf" className="rounded-xl text-xs">
            Provident Fund (PF)
          </TabsTrigger>
          <TabsTrigger value="esi" className="rounded-xl text-xs">
            Employee State Insurance (ESI)
          </TabsTrigger>
          <TabsTrigger value="pt" className="rounded-xl text-xs">
            Professional Tax (PT)
          </TabsTrigger>
          <TabsTrigger value="tds" className="rounded-xl text-xs">
            Income Tax / TDS
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
        <TabsContent value="overview">
          <GlassCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3 font-mono">UAN (PF)</th>
                    <th className="px-4 py-3 font-mono text-right">PF Deduction</th>
                    <th className="px-4 py-3 font-mono">IP Number (ESI)</th>
                    <th className="px-4 py-3 font-mono text-right">ESI Deduction</th>
                    <th className="px-4 py-3">PT State</th>
                    <th className="px-4 py-3 font-mono text-right">PT Amount</th>
                    <th className="px-4 py-3">Regime</th>
                    <th className="px-4 py-3 font-mono text-right">Monthly TDS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {!summary || summary.records.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                        <Scale className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                        <p className="font-semibold text-foreground text-sm">No Statutory Records Available</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {backendUnavailable
                            ? "Statutory summary endpoint pending backend deployment."
                            : "Run payroll calculation to generate official statutory withholdings."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    summary.records.map((r) => (
                      <tr key={r.employeeId} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{r.employeeName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{r.employeeCode}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{r.pfUan || "—"}</td>
                        <td className="px-4 py-3 font-mono text-right font-semibold text-foreground">
                          {formatINR(r.employeePfPaise / 100)}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{r.esiIpNumber || "—"}</td>
                        <td className="px-4 py-3 font-mono text-right font-semibold text-foreground">
                          {formatINR(r.employeeEsiPaise / 100)}
                        </td>
                        <td className="px-4 py-3">{r.ptState}</td>
                        <td className="px-4 py-3 font-mono text-right font-semibold text-foreground">
                          {formatINR(r.ptAmountPaise / 100)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px]">
                            {r.taxRegime}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatINR(r.monthlyTdsPaise / 100)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* ── TAB 2: PF ─────────────────────────────────────────────── */}
        <TabsContent value="pf" className="space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Employees' Provident Fund (EPF & EPS)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Statutory rates: Employee contribution (12%), Employer EPF (3.67%), Employer EPS (8.33%).
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => handleDownloadReport("PF", "txt")}
                disabled={Boolean(downloadingReport)}
                className="h-8 gap-1.5 text-xs rounded-xl"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download ECR Return (.txt)</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Covered Employees</span>
                <p className="font-mono font-semibold text-foreground mt-1">
                  {formatCount(summary?.pfTotals?.eligibleCount || 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Total Contributory Wages</span>
                <p className="font-mono font-semibold text-foreground mt-1">
                  {formatINR((summary?.pfTotals?.totalWagesPaise || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Employee PF (12%)</span>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatINR((summary?.pfTotals?.totalEmployeePfPaise || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Employer Share (12%)</span>
                <p className="font-mono font-semibold text-primary mt-1">
                  {formatINR((summary?.pfTotals?.totalEmployerPfPaise || 0) / 100)}
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* ── TAB 3: ESI ────────────────────────────────────────────── */}
        <TabsContent value="esi" className="space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Employee State Insurance (ESIC)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Coverage for employees earning up to ₹21,000/month gross: Employee (0.75%), Employer (3.25%).
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => handleDownloadReport("ESI", "csv")}
                disabled={Boolean(downloadingReport)}
                className="h-8 gap-1.5 text-xs rounded-xl"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download ESI Monthly Filing</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Covered Employees</span>
                <p className="font-mono font-semibold text-foreground mt-1">
                  {formatCount(summary?.esiTotals?.eligibleCount || 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Gross Insurable Wages</span>
                <p className="font-mono font-semibold text-foreground mt-1">
                  {formatINR((summary?.esiTotals?.totalWagesPaise || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Employee Share (0.75%)</span>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatINR((summary?.esiTotals?.totalEmployeeEsiPaise || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Employer Share (3.25%)</span>
                <p className="font-mono font-semibold text-primary mt-1">
                  {formatINR((summary?.esiTotals?.totalEmployerEsiPaise || 0) / 100)}
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* ── TAB 4: PT ─────────────────────────────────────────────── */}
        <TabsContent value="pt" className="space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Professional Tax (State Jurisdiction Slabs)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Withholding mapped to respective state tax schedules (Karnataka, Maharashtra, etc.).
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => handleDownloadReport("PT", "csv")}
                disabled={Boolean(downloadingReport)}
                className="h-8 gap-1.5 text-xs rounded-xl"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PT Statement</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Employees Under PT Coverage</span>
                <p className="font-mono font-semibold text-foreground mt-1">
                  {formatCount(summary?.ptTotals?.coveredCount || 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Total State PT Withheld</span>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {summary?.ptTotals?.formattedTotal || "—"}
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* ── TAB 5: TDS ────────────────────────────────────────────── */}
        <TabsContent value="tds" className="space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Income Tax / TDS (Form 24Q Summary)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Monthly tax deductions computed under Old vs New tax regimes.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => handleDownloadReport("TDS", "csv")}
                disabled={Boolean(downloadingReport)}
                className="h-8 gap-1.5 text-xs rounded-xl"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Form 24Q TDS Schedule</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Employees with TDS Withholdings</span>
                <p className="font-mono font-semibold text-foreground mt-1">
                  {formatCount(summary?.tdsTotals?.deductedCount || 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-muted-foreground">Total Monthly TDS Deducted</span>
                <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {summary?.tdsTotals?.formattedTotal || "—"}
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
