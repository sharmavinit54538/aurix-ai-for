import apiInstance from "@/api/apiInstance";
import type {
  AnalyticsOverview,
  AnalyticsSummary,
  AnalyzeBurnoutPayload,
  AnalyzePredictivePayload,
  AnalyzeSalaryPayload,
  AnalyzeSentimentPayload,
  AttritionPrediction,
  BurnoutRiskInsight,
  ComplianceMetrics,
  GenerateReportPayload,
  HeadcountMetrics,
  PaginationParams,
  PayrollCostMetrics,
  PredictAttritionPayload,
  PredictiveInsight,
  Report,
  ReportRequest,
  ReportResult,
  SalaryBenchmark,
  SentimentInsight,
  TurnoverMetrics,
} from "@/store/analytics/analytics.types";

function extractData<T>(res: unknown, fallback?: T): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined) ? r.data : res;

  if (body == null) return (fallback ?? null) as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return (body ?? fallback) as T;
}

export const analyticsApi = {
  // ── 1. Overview & Summary ─────────────────────────────────────────
  async getAnalytics(): Promise<AnalyticsOverview> {
    const res = await apiInstance.get("/analytics");
    return extractData<AnalyticsOverview>(res);
  },

  async getOverview(): Promise<AnalyticsOverview> {
    const res = await apiInstance.get("/analytics/overview");
    const raw = extractData<Record<string, unknown>>(res, {});
    return {
      totalEmployees: Number(raw?.totalEmployees ?? raw?.total_employees ?? 0),
      activeHeadcount: Number(raw?.activeHeadcount ?? raw?.active_headcount ?? 0),
      totalPayrollCost: Number(raw?.totalPayrollCost ?? raw?.total_payroll_cost ?? 0),
      turnoverRate: Number(raw?.turnoverRate ?? raw?.turnover_rate ?? 0),
      complianceScore: Number(raw?.complianceScore ?? raw?.compliance_score ?? 0),
      riskIndex: Number(raw?.riskIndex ?? raw?.risk_index ?? 0),
      sentimentScore: Number(raw?.sentimentScore ?? raw?.sentiment_score ?? 0),
      lastUpdated: raw?.lastUpdated ? String(raw.lastUpdated) : new Date().toISOString(),
      summary: raw?.summary ? String(raw.summary) : undefined,
      departmentBreakdown: Array.isArray(raw?.departmentBreakdown ?? raw?.department_breakdown)
        ? (raw.departmentBreakdown ?? raw.department_breakdown)
        : [],
      metrics: (raw?.metrics as Record<string, unknown>) ?? {},
    };
  },

  async getSummary(): Promise<AnalyticsSummary> {
    const res = await apiInstance.get("/analytics/summary");
    return extractData<AnalyticsSummary>(res, {
      period: "Current Quarter",
      headline: "Workforce Analytics Summary",
      keyFindings: [],
    });
  },

  // ── 2. Reports Engine ─────────────────────────────────────────────
  async getReports(params?: PaginationParams): Promise<Report[]> {
    const res = await apiInstance.get("/analytics/reports", { params });
    const raw = extractData<unknown>(res, []);
    if (Array.isArray(raw)) return raw as Report[];
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray((raw as { items: unknown }).items)) {
      return (raw as { items: Report[] }).items;
    }
    return [];
  },

  async getReportById(reportId: string): Promise<Report> {
    const res = await apiInstance.get(`/analytics/reports/${encodeURIComponent(reportId)}`);
    return extractData<Report>(res);
  },

  async createReport(payload: ReportRequest): Promise<Report> {
    const res = await apiInstance.post("/analytics/reports", payload);
    return extractData<Report>(res);
  },

  async updateReport(reportId: string, payload: Partial<ReportRequest>): Promise<Report> {
    const res = await apiInstance.patch(`/analytics/reports/${encodeURIComponent(reportId)}`, payload);
    return extractData<Report>(res);
  },

  async deleteReport(reportId: string): Promise<{ success: boolean; id: string }> {
    const res = await apiInstance.delete(`/analytics/reports/${encodeURIComponent(reportId)}`);
    return extractData<{ success: boolean; id: string }>(res, { success: true, id: reportId });
  },

  async generateReport(payload: GenerateReportPayload): Promise<ReportResult> {
    const res = await apiInstance.post("/analytics/reports/generate", payload);
    return extractData<ReportResult>(res);
  },

  async exportReport(reportId: string, format = "csv"): Promise<Blob> {
    const res = await apiInstance.get(`/analytics/reports/${encodeURIComponent(reportId)}/export`, {
      params: { format },
      responseType: "blob",
    });

    const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: "text/csv" });

    if (typeof window !== "undefined") {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${reportId}_${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    return blob;
  },

  // ── 3. Core HR Metrics ────────────────────────────────────────────
  async getHeadcountMetrics(): Promise<HeadcountMetrics> {
    const res = await apiInstance.get("/analytics/headcount");
    return extractData<HeadcountMetrics>(res, {
      totalHeadcount: 0,
      fullTime: 0,
      partTime: 0,
      contractors: 0,
      growthMoM: 0,
      byDepartment: [],
      monthlyTrend: [],
    });
  },

  async getPayrollCostMetrics(): Promise<PayrollCostMetrics> {
    const res = await apiInstance.get("/analytics/payroll-costs");
    return extractData<PayrollCostMetrics>(res, {
      totalCost: 0,
      averageSalary: 0,
      overtimeSpend: 0,
      benefitsCost: 0,
      variancePercentage: 0,
      byDepartment: [],
      trend: [],
    });
  },

  async getTurnoverMetrics(): Promise<TurnoverMetrics> {
    const res = await apiInstance.get("/analytics/turnover-rates");
    return extractData<TurnoverMetrics>(res, {
      rate: 0,
      voluntaryRate: 0,
      involuntaryRate: 0,
      retentionRate: 100,
      averageTenureMonths: 0,
      byDepartment: [],
    });
  },

  async getComplianceMetrics(): Promise<ComplianceMetrics> {
    const res = await apiInstance.get("/analytics/compliance-metrics");
    return extractData<ComplianceMetrics>(res, {
      overallScore: 100,
      statutoryComplianceRate: 100,
      auditReadinessScore: 100,
      pendingAuditsCount: 0,
      flaggedViolationsCount: 0,
      standards: [],
    });
  },

  // ── 4. AI Predictive Analytics ────────────────────────────────────
  async getPredictiveInsights(): Promise<PredictiveInsight[]> {
    const res = await apiInstance.get("/analytics/predictive-insights");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as PredictiveInsight[]) : [];
  },

  async analyzePredictiveInsights(payload?: AnalyzePredictivePayload): Promise<PredictiveInsight[]> {
    const res = await apiInstance.post("/analytics/predictive-insights/analyze", payload ?? {});
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as PredictiveInsight[]) : [];
  },

  async getAttritionAnalytics(): Promise<AttritionPrediction> {
    const res = await apiInstance.get("/analytics/attrition");
    return extractData<AttritionPrediction>(res, {
      projectedAttritionRate: 0,
      atRiskEmployeesCount: 0,
      highRiskDepartments: [],
      primaryDrivers: [],
      predictions: [],
    });
  },

  async predictAttrition(payload?: PredictAttritionPayload): Promise<AttritionPrediction> {
    const res = await apiInstance.post("/analytics/attrition/predict", payload ?? {});
    return extractData<AttritionPrediction>(res, {
      projectedAttritionRate: 0,
      atRiskEmployeesCount: 0,
      highRiskDepartments: [],
      primaryDrivers: [],
      predictions: [],
    });
  },

  async getSentimentAnalytics(): Promise<SentimentInsight> {
    const res = await apiInstance.get("/analytics/sentiment");
    return extractData<SentimentInsight>(res, {
      overallSentiment: "neutral",
      sentimentScore: 70,
      engagementIndex: 75,
      positiveThemes: [],
      concernAreas: [],
      departmentBreakdown: [],
    });
  },

  async analyzeSentiment(payload?: AnalyzeSentimentPayload): Promise<SentimentInsight> {
    const res = await apiInstance.post("/analytics/sentiment/analyze", payload ?? {});
    return extractData<SentimentInsight>(res, {
      overallSentiment: "neutral",
      sentimentScore: 70,
      engagementIndex: 75,
      positiveThemes: [],
      concernAreas: [],
      departmentBreakdown: [],
    });
  },

  async getBurnoutRisk(): Promise<BurnoutRiskInsight> {
    const res = await apiInstance.get("/analytics/burnout-risk");
    return extractData<BurnoutRiskInsight>(res, {
      riskIndex: 0,
      employeesAtRiskCount: 0,
      overtimeAlertsCount: 0,
      excessiveHoursFlags: 0,
      criticalDepartments: [],
      recommendations: [],
    });
  },

  async analyzeBurnoutRisk(payload?: AnalyzeBurnoutPayload): Promise<BurnoutRiskInsight> {
    const res = await apiInstance.post("/analytics/burnout-risk/analyze", payload ?? {});
    return extractData<BurnoutRiskInsight>(res, {
      riskIndex: 0,
      employeesAtRiskCount: 0,
      overtimeAlertsCount: 0,
      excessiveHoursFlags: 0,
      criticalDepartments: [],
      recommendations: [],
    });
  },

  async getSalaryBenchmarks(): Promise<SalaryBenchmark[]> {
    const res = await apiInstance.get("/analytics/salary-benchmarks");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as SalaryBenchmark[]) : [];
  },

  async analyzeSalaryBenchmarks(payload?: AnalyzeSalaryPayload): Promise<SalaryBenchmark[]> {
    const res = await apiInstance.post("/analytics/salary-benchmarks/analyze", payload ?? {});
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as SalaryBenchmark[]) : [];
  },
};

export default analyticsApi;
