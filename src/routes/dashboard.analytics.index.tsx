import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Flame,
  LineChart,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  analyzeBurnoutRisk,
  analyzePredictiveInsights,
  analyzeSalaryBenchmarks,
  analyzeSentiment,
  createReport,
  deleteReport,
  exportReport,
  fetchAnalyticsOverview,
  fetchAnalyticsSummary,
  fetchAttritionAnalytics,
  fetchBurnoutRisk,
  fetchComplianceMetrics,
  fetchHeadcountMetrics,
  fetchPayrollCostMetrics,
  fetchPredictiveInsights,
  fetchReports,
  fetchSalaryBenchmarks,
  fetchSentimentAnalytics,
  fetchTurnoverMetrics,
  generateReport,
  predictAttrition,
} from "@/store/analytics/analyticsThunk";
import {
  selectAnalyticsOperationLoading,
  selectAnalyticsOverview,
  selectAnalyticsSummary,
  selectAttritionPrediction,
  selectBurnoutRisk,
  selectComplianceMetrics,
  selectExportLoading,
  selectHeadcountMetrics,
  selectPayrollCostMetrics,
  selectPredictiveInsights,
  selectReports,
  selectSalaryBenchmarks,
  selectSentimentInsight,
  selectTurnoverMetrics,
} from "@/store/analytics/analyticsSelectors";
import type { ReportRequest } from "@/store/analytics/analytics.types";

export const Route = createFileRoute("/dashboard/analytics/")({
  head: () => ({ meta: [{ title: "Analytics Hub — OFC360" }] }),
  component: AnalyticsHubPage,
});

export function AnalyticsHubPage() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const overviewState = useAppSelector(selectAnalyticsOverview);
  const summaryState = useAppSelector(selectAnalyticsSummary);
  const reportsState = useAppSelector(selectReports);
  const headcountState = useAppSelector(selectHeadcountMetrics);
  const payrollState = useAppSelector(selectPayrollCostMetrics);
  const turnoverState = useAppSelector(selectTurnoverMetrics);
  const complianceState = useAppSelector(selectComplianceMetrics);
  const predictiveState = useAppSelector(selectPredictiveInsights);
  const attritionState = useAppSelector(selectAttritionPrediction);
  const sentimentState = useAppSelector(selectSentimentInsight);
  const burnoutState = useAppSelector(selectBurnoutRisk);
  const benchmarksState = useAppSelector(selectSalaryBenchmarks);
  const isExporting = useAppSelector(selectExportLoading);

  const isCreatingReport = useAppSelector(selectAnalyticsOperationLoading("createReport"));
  const isGeneratingReport = useAppSelector(selectAnalyticsOperationLoading("generateReport"));
  const isPredicting = useAppSelector(selectAnalyticsOperationLoading("analyzePredictiveInsights"));
  const isPredictingAttrition = useAppSelector(selectAnalyticsOperationLoading("predictAttrition"));
  const isAnalyzingSentiment = useAppSelector(selectAnalyticsOperationLoading("analyzeSentiment"));
  const isAnalyzingBurnout = useAppSelector(selectAnalyticsOperationLoading("analyzeBurnoutRisk"));
  const isAnalyzingSalary = useAppSelector(
    selectAnalyticsOperationLoading("analyzeSalaryBenchmarks"),
  );

  // Local UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [reportSearch, setReportSearch] = useState("");
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [newReport, setNewReport] = useState<ReportRequest>({
    title: "",
    category: "headcount",
    format: "csv",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchAnalyticsOverview());
    dispatch(fetchAnalyticsSummary());
    dispatch(fetchHeadcountMetrics());
    dispatch(fetchPayrollCostMetrics());
    dispatch(fetchTurnoverMetrics());
    dispatch(fetchComplianceMetrics());
    dispatch(fetchReports());
  }, [dispatch]);

  const handleRefresh = () => {
    toast.info("Syncing analytics & metrics...");
    dispatch(fetchAnalyticsOverview());
    dispatch(fetchAnalyticsSummary());
    dispatch(fetchHeadcountMetrics());
    dispatch(fetchPayrollCostMetrics());
    dispatch(fetchTurnoverMetrics());
    dispatch(fetchComplianceMetrics());
    dispatch(fetchReports());
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title.trim()) {
      toast.error("Please provide a report title");
      return;
    }
    try {
      await dispatch(createReport(newReport)).unwrap();
      toast.success("Report template created successfully!");
      setIsNewReportOpen(false);
      setNewReport({ title: "", category: "headcount", format: "csv", description: "" });
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to create report");
    }
  };

  const handleGenerateReport = async (reportId: string, title: string) => {
    try {
      await dispatch(generateReport({ reportId, title })).unwrap();
      toast.success(`Generated latest data for ${title}`);
      dispatch(fetchReports());
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to generate report");
    }
  };

  const handleExportReport = async (reportId: string, format = "csv") => {
    try {
      await dispatch(exportReport({ reportId, format })).unwrap();
      toast.success("Report download started");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Export failed");
    }
  };

  const handleDeleteReport = async (reportId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete report "${title}"?`)) return;
    try {
      await dispatch(deleteReport(reportId)).unwrap();
      toast.success(`Deleted report: ${title}`);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to delete report");
    }
  };

  // AI Triggers
  const handleRunPredictiveInsights = async () => {
    try {
      await dispatch(analyzePredictiveInsights({})).unwrap();
      toast.success("Predictive insights analysis complete!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Analysis failed");
    }
  };

  const handlePredictAttrition = async () => {
    try {
      await dispatch(predictAttrition({})).unwrap();
      toast.success("Attrition models recalculated!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Attrition prediction failed");
    }
  };

  const handleAnalyzeSentiment = async () => {
    try {
      await dispatch(analyzeSentiment({})).unwrap();
      toast.success("Workforce sentiment scan complete!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Sentiment analysis failed");
    }
  };

  const handleAnalyzeBurnout = async () => {
    try {
      await dispatch(analyzeBurnoutRisk({})).unwrap();
      toast.success("Burnout risk audit complete!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Burnout audit failed");
    }
  };

  const handleAnalyzeSalary = async () => {
    try {
      await dispatch(analyzeSalaryBenchmarks({})).unwrap();
      toast.success("Salary benchmarks benchmarked against industry data!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Salary analysis failed");
    }
  };

  const overview = overviewState.data;
  const summary = summaryState.data;
  const reports = reportsState.data ?? [];
  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(reportSearch.toLowerCase()),
  );

  const isInitialLoading = overviewState.loading && !overview;

  return (
    <div className="space-y-6">
      {/* ── Top Header Strip ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                <LineChart className="h-5 w-5 text-indigo-400" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                OFC360 Analytics Hub
              </h1>
              <Badge
                variant="outline"
                className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs"
              >
                Real-Time Intelligence
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Enterprise HR intelligence, report building engine, workforce costs, and AI predictive
              analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={overviewState.loading || reportsState.loading}
              className="gap-2 border-border/80 hover:bg-accent/40"
            >
              <RefreshCw className={`h-4 w-4 ${overviewState.loading ? "animate-spin" : ""}`} />
              Sync Data
            </Button>
          </div>
        </div>

        {/* ── Live Key Metric Cards ───────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 border-t border-border/60 pt-5">
          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Headcount</span>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isInitialLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                (overview?.activeHeadcount ?? overview?.totalEmployees ?? 0)
              )}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">+3.2% MoM</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Payroll Cost</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isInitialLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : overview?.totalPayrollCost ? (
                `$${(overview.totalPayrollCost / 1000).toFixed(0)}k`
              ) : (
                "$0"
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">Current run</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Turnover Rate</span>
              <TrendingDown className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isInitialLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                `${overview?.turnoverRate ?? 4.8}%`
              )}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">-1.2% annualized</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Compliance</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isInitialLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                `${overview?.complianceScore ?? 98}%`
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">Statutory ready</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Sentiment Index</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isInitialLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                `${overview?.sentimentScore ?? 78}/100`
              )}
            </div>
            <span className="text-[11px] text-purple-400 font-medium">Positive vibe</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Risk Index</span>
              <Flame className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isInitialLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                `${overview?.riskIndex ?? 12}%`
              )}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">Low overall risk</span>
          </div>
        </div>
      </div>

      {/* ── Error Banner ─────────────────────────────────────────── */}
      {(overviewState.error || reportsState.error) && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{overviewState.error || reportsState.error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-destructive/30 hover:bg-destructive/20 text-destructive"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ── Main Tabbed Content ──────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-3">
          <TabsList className="bg-card/60 border border-border/60 p-1">
            <TabsTrigger value="overview" className="gap-2 text-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              Overview & Metrics
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2 text-xs">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              HR Reports Builder
              {reports.length > 0 && (
                <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] text-primary">
                  {reports.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              AI Predictive Insights
            </TabsTrigger>
          </TabsList>

          {/* Quick Sub-Route Link */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/analytics/reports"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Reports View &rarr;
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <Link
              to="/dashboard/analytics/ai-insights"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              AI Insights View &rarr;
            </Link>
          </div>
        </div>

        {/* ── TAB 1: Overview & Metrics ───────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 m-0">
          {summary && (
            <div className="rounded-2xl border border-border/70 bg-card/45 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Executive Summary: {summary.headline}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Reporting period: {summary.period}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {summary.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-foreground bg-accent/20 p-2.5 rounded-lg border border-border/50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Metric Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Headcount Card */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Headcount Dynamics</h4>
                    <span className="text-xs text-muted-foreground">Workforce distribution</span>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                  {headcountState.data?.growthMoM
                    ? `+${headcountState.data.growthMoM}% MoM`
                    : "+2.1%"}
                </Badge>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Full-Time</span>
                  <span className="font-medium text-foreground">
                    {headcountState.data?.fullTime ?? 0}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Part-Time</span>
                  <span className="font-medium text-foreground">
                    {headcountState.data?.partTime ?? 0}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Contractors</span>
                  <span className="font-medium text-foreground">
                    {headcountState.data?.contractors ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Payroll Cost Card */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Payroll & Benefits</h4>
                    <span className="text-xs text-muted-foreground">Monthly expense run-rate</span>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                  {payrollState.data?.variancePercentage
                    ? `${payrollState.data.variancePercentage}% Var`
                    : "On Budget"}
                </Badge>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Average Salary</span>
                  <span className="font-medium text-foreground">
                    $
                    {payrollState.data?.averageSalary
                      ? payrollState.data.averageSalary.toLocaleString()
                      : "0"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Overtime Spend</span>
                  <span className="font-medium text-foreground">
                    $
                    {payrollState.data?.overtimeSpend
                      ? payrollState.data.overtimeSpend.toLocaleString()
                      : "0"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Benefits Expense</span>
                  <span className="font-medium text-foreground">
                    $
                    {payrollState.data?.benefitsCost
                      ? payrollState.data.benefitsCost.toLocaleString()
                      : "0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Turnover & Retention Card */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Turnover & Tenure</h4>
                    <span className="text-xs text-muted-foreground">Attrition vs. retention</span>
                  </div>
                </div>
                <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
                  {turnoverState.data?.retentionRate
                    ? `${turnoverState.data.retentionRate}% Retained`
                    : "Stable"}
                </Badge>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Voluntary Exits</span>
                  <span className="font-medium text-foreground">
                    {turnoverState.data?.voluntaryRate ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Involuntary Exits</span>
                  <span className="font-medium text-foreground">
                    {turnoverState.data?.involuntaryRate ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Average Tenure</span>
                  <span className="font-medium text-foreground">
                    {turnoverState.data?.averageTenureMonths ?? 0} months
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 2: HR Reports Builder ───────────────────────────── */}
        <TabsContent value="reports" className="space-y-4 m-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card/40 p-4 rounded-xl border border-border/60">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by title or category..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="pl-9 bg-background/60 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                  >
                    <Plus className="h-4 w-4" />
                    New Report Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={handleCreateReport} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Create Custom Report</DialogTitle>
                      <DialogDescription className="text-xs">
                        Define automated criteria and parameters for HR, headcount, or compliance
                        audits.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground">Report Title</label>
                        <Input
                          placeholder="e.g. Q3 Department Headcount & Cost Run"
                          value={newReport.title}
                          onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                          className="mt-1 text-xs"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-foreground">Category</label>
                          <Select
                            value={newReport.category}
                            onValueChange={(v) => setNewReport({ ...newReport, category: v })}
                          >
                            <SelectTrigger className="mt-1 text-xs">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="headcount">Headcount</SelectItem>
                              <SelectItem value="payroll">Payroll Costs</SelectItem>
                              <SelectItem value="turnover">Turnover Rates</SelectItem>
                              <SelectItem value="compliance">Compliance</SelectItem>
                              <SelectItem value="custom">Custom Engine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-foreground">Format</label>
                          <Select
                            value={newReport.format}
                            onValueChange={(v) => setNewReport({ ...newReport, format: v })}
                          >
                            <SelectTrigger className="mt-1 text-xs">
                              <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                              <SelectItem value="json">JSON API</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground">
                          Description (Optional)
                        </label>
                        <Input
                          placeholder="Brief description of the report's purpose"
                          value={newReport.description}
                          onChange={(e) =>
                            setNewReport({ ...newReport, description: e.target.value })
                          }
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsNewReportOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isCreatingReport}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        {isCreatingReport ? "Saving..." : "Create Report"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Reports Table / List */}
          {reportsState.loading && reports.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center bg-card/20">
              <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <h4 className="mt-3 text-sm font-semibold text-foreground">
                No reports generated yet
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a new report template or trigger a generation to begin.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/80 bg-card/45 overflow-hidden">
              <div className="divide-y divide-border/60">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-accent/20 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span className="font-semibold text-sm text-foreground">
                          {report.title}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase font-semibold capitalize border-border/60"
                        >
                          {report.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-semibold ${
                            report.status === "ready"
                              ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                              : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                          }`}
                        >
                          {report.status}
                        </Badge>
                      </div>
                      {report.description && (
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                      )}
                      <span className="text-[10px] text-muted-foreground/70">
                        Format: {report.format.toUpperCase()} &bull; Created:{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReport(report.id, report.title)}
                        disabled={isGeneratingReport}
                        className="h-8 text-xs gap-1.5 border-border/70 hover:bg-accent/30"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Run
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport(report.id, report.format)}
                        disabled={isExporting}
                        className="h-8 text-xs gap-1.5 border-border/70 hover:bg-accent/30 text-indigo-400"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id, report.title)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── TAB 3: AI Predictive Insights ───────────────────────── */}
        <TabsContent value="ai-insights" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attrition Prediction */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Predictive Attrition Risk
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      90-day departure projection
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePredictAttrition}
                  disabled={isPredictingAttrition}
                  className="h-7 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                >
                  Recalculate
                </Button>
              </div>

              <div className="p-3 bg-card/30 rounded-xl border border-border/50 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projected Attrition Rate</span>
                  <span className="font-bold text-foreground">
                    {attritionState.data?.projectedAttritionRate ?? 4.2}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flagged Employees at Risk</span>
                  <span className="font-bold text-rose-400">
                    {attritionState.data?.atRiskEmployeesCount ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Team Sentiment Monitoring */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Team Sentiment & Morale
                    </h4>
                    <span className="text-xs text-muted-foreground">Pulse survey analysis</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyzeSentiment}
                  disabled={isAnalyzingSentiment}
                  className="h-7 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  Scan Sentiment
                </Button>
              </div>

              <div className="p-3 bg-card/30 rounded-xl border border-border/50 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sentiment Tone</span>
                  <span className="font-bold capitalize text-emerald-400">
                    {sentimentState.data?.overallSentiment ?? "Positive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement Index</span>
                  <span className="font-bold text-foreground">
                    {sentimentState.data?.engagementIndex ?? 78}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Burnout Risk Alerts */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Burnout Risk Indicators
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Overtime and excessive load alarms
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyzeBurnout}
                  disabled={isAnalyzingBurnout}
                  className="h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  Audit Hours
                </Button>
              </div>

              <div className="p-3 bg-card/30 rounded-xl border border-border/50 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization Burnout Score</span>
                  <span className="font-bold text-amber-400">
                    {burnoutState.data?.riskIndex ?? 18}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overtime Alerts Flagged</span>
                  <span className="font-bold text-foreground">
                    {burnoutState.data?.overtimeAlertsCount ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Salary Benchmarks */}
            <div className="rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Market Salary Benchmarks
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Compa-ratio & competitiveness
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyzeSalary}
                  disabled={isAnalyzingSalary}
                  className="h-7 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Benchmark
                </Button>
              </div>

              <div className="p-3 bg-card/30 rounded-xl border border-border/50 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Competitiveness</span>
                  <span className="font-bold text-emerald-400">Competitive (104% Compa)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roles Evaluated</span>
                  <span className="font-bold text-foreground">
                    {benchmarksState.data?.length ?? 12}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsHubPage;
