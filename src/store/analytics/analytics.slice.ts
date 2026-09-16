import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnalyticsState, Report, SectionState } from "./analytics.types";
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
  fetchReportById,
  fetchReports,
  fetchSalaryBenchmarks,
  fetchSentimentAnalytics,
  fetchTurnoverMetrics,
  generateReport,
  predictAttrition,
  updateReport,
} from "./analytics.thunks";

function createInitialSectionState<T>(data: T | null = null): SectionState<T> {
  return {
    data,
    loading: false,
    error: null,
    success: false,
    lastUpdated: null,
  };
}

const initialState: AnalyticsState = {
  overview: createInitialSectionState(),
  summary: createInitialSectionState(),
  reports: createInitialSectionState([]),
  selectedReport: createInitialSectionState(),
  headcount: createInitialSectionState({
    totalHeadcount: 0,
    fullTime: 0,
    partTime: 0,
    contractors: 0,
    growthMoM: 0,
    byDepartment: [],
    monthlyTrend: [],
  }),
  payrollCosts: createInitialSectionState({
    totalCost: 0,
    averageSalary: 0,
    overtimeSpend: 0,
    benefitsCost: 0,
    variancePercentage: 0,
    byDepartment: [],
    trend: [],
  }),
  turnoverRates: createInitialSectionState({
    rate: 0,
    voluntaryRate: 0,
    involuntaryRate: 0,
    retentionRate: 100,
    averageTenureMonths: 0,
    byDepartment: [],
  }),
  complianceMetrics: createInitialSectionState({
    overallScore: 100,
    statutoryComplianceRate: 100,
    auditReadinessScore: 100,
    pendingAuditsCount: 0,
    flaggedViolationsCount: 0,
    standards: [],
  }),
  predictiveInsights: createInitialSectionState([]),
  attrition: createInitialSectionState({
    projectedAttritionRate: 0,
    atRiskEmployeesCount: 0,
    highRiskDepartments: [],
    primaryDrivers: [],
    predictions: [],
  }),
  sentiment: createInitialSectionState({
    overallSentiment: "neutral",
    sentimentScore: 70,
    engagementIndex: 75,
    positiveThemes: [],
    concernAreas: [],
    departmentBreakdown: [],
  }),
  burnoutRisk: createInitialSectionState({
    riskIndex: 0,
    employeesAtRiskCount: 0,
    overtimeAlertsCount: 0,
    excessiveHoursFlags: 0,
    criticalDepartments: [],
    recommendations: [],
  }),
  salaryBenchmarks: createInitialSectionState([]),

  exportLoading: false,
  operationLoading: {},
  operationErrors: {},
  operationSuccess: {},
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport.data = action.payload;
    },
    clearOperationStatus: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.operationLoading[key];
      delete state.operationErrors[key];
      delete state.operationSuccess[key];
    },
    resetAnalyticsState: () => initialState,
  },
  extraReducers: (builder) => {
    // ── 1. Overview & Summary ─────────────────────────────────────────
    builder
      .addCase(fetchAnalyticsOverview.pending, (state) => {
        state.overview.loading = true;
        state.overview.error = null;
      })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
        state.overview.loading = false;
        state.overview.data = action.payload;
        state.overview.success = true;
        state.overview.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAnalyticsOverview.rejected, (state, action) => {
        state.overview.loading = false;
        state.overview.error = action.payload || "Failed to load overview";
        state.overview.success = false;
      })

      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
        state.summary.success = true;
        state.summary.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.payload || "Failed to load summary";
        state.summary.success = false;
      });

    // ── 2. Reports Engine ─────────────────────────────────────────────
    builder
      .addCase(fetchReports.pending, (state) => {
        state.reports.loading = true;
        state.reports.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports.loading = false;
        state.reports.data = action.payload;
        state.reports.success = true;
        state.reports.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reports.loading = false;
        state.reports.error = action.payload || "Failed to load reports";
        state.reports.success = false;
      })

      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.selectedReport.data = action.payload;
      })

      .addCase(createReport.pending, (state) => {
        state.operationLoading["createReport"] = true;
        state.operationErrors["createReport"] = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.operationLoading["createReport"] = false;
        state.operationSuccess["createReport"] = true;
        state.reports.data = [action.payload, ...(state.reports.data ?? [])];
      })
      .addCase(createReport.rejected, (state, action) => {
        state.operationLoading["createReport"] = false;
        state.operationErrors["createReport"] = action.payload || "Failed to create report";
      })

      .addCase(updateReport.pending, (state) => {
        state.operationLoading["updateReport"] = true;
        state.operationErrors["updateReport"] = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.operationLoading["updateReport"] = false;
        state.operationSuccess["updateReport"] = true;
        if (state.reports.data) {
          const index = state.reports.data.findIndex((r) => r.id === action.payload.id);
          if (index !== -1) {
            state.reports.data[index] = action.payload;
          }
        }
        if (state.selectedReport.data?.id === action.payload.id) {
          state.selectedReport.data = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.operationLoading["updateReport"] = false;
        state.operationErrors["updateReport"] = action.payload || "Failed to update report";
      })

      .addCase(deleteReport.pending, (state) => {
        state.operationLoading["deleteReport"] = true;
        state.operationErrors["deleteReport"] = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.operationLoading["deleteReport"] = false;
        state.operationSuccess["deleteReport"] = true;
        if (state.reports.data) {
          state.reports.data = state.reports.data.filter((r) => r.id !== action.payload.id);
        }
        if (state.selectedReport.data?.id === action.payload.id) {
          state.selectedReport.data = null;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.operationLoading["deleteReport"] = false;
        state.operationErrors["deleteReport"] = action.payload || "Failed to delete report";
      })

      .addCase(generateReport.pending, (state) => {
        state.operationLoading["generateReport"] = true;
        state.operationErrors["generateReport"] = null;
      })
      .addCase(generateReport.fulfilled, (state) => {
        state.operationLoading["generateReport"] = false;
        state.operationSuccess["generateReport"] = true;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.operationLoading["generateReport"] = false;
        state.operationErrors["generateReport"] = action.payload || "Failed to generate report";
      })

      .addCase(exportReport.pending, (state) => {
        state.exportLoading = true;
        state.operationLoading["exportReport"] = true;
      })
      .addCase(exportReport.fulfilled, (state) => {
        state.exportLoading = false;
        state.operationLoading["exportReport"] = false;
        state.operationSuccess["exportReport"] = true;
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.exportLoading = false;
        state.operationLoading["exportReport"] = false;
        state.operationErrors["exportReport"] = action.payload || "Failed to export report";
      });

    // ── 3. Core HR Metrics ────────────────────────────────────────────
    builder
      .addCase(fetchHeadcountMetrics.pending, (state) => {
        state.headcount.loading = true;
        state.headcount.error = null;
      })
      .addCase(fetchHeadcountMetrics.fulfilled, (state, action) => {
        state.headcount.loading = false;
        state.headcount.data = action.payload;
        state.headcount.success = true;
        state.headcount.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchHeadcountMetrics.rejected, (state, action) => {
        state.headcount.loading = false;
        state.headcount.error = action.payload || "Failed to load headcount metrics";
      })

      .addCase(fetchPayrollCostMetrics.pending, (state) => {
        state.payrollCosts.loading = true;
        state.payrollCosts.error = null;
      })
      .addCase(fetchPayrollCostMetrics.fulfilled, (state, action) => {
        state.payrollCosts.loading = false;
        state.payrollCosts.data = action.payload;
        state.payrollCosts.success = true;
        state.payrollCosts.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPayrollCostMetrics.rejected, (state, action) => {
        state.payrollCosts.loading = false;
        state.payrollCosts.error = action.payload || "Failed to load payroll cost metrics";
      })

      .addCase(fetchTurnoverMetrics.pending, (state) => {
        state.turnoverRates.loading = true;
        state.turnoverRates.error = null;
      })
      .addCase(fetchTurnoverMetrics.fulfilled, (state, action) => {
        state.turnoverRates.loading = false;
        state.turnoverRates.data = action.payload;
        state.turnoverRates.success = true;
        state.turnoverRates.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTurnoverMetrics.rejected, (state, action) => {
        state.turnoverRates.loading = false;
        state.turnoverRates.error = action.payload || "Failed to load turnover metrics";
      })

      .addCase(fetchComplianceMetrics.pending, (state) => {
        state.complianceMetrics.loading = true;
        state.complianceMetrics.error = null;
      })
      .addCase(fetchComplianceMetrics.fulfilled, (state, action) => {
        state.complianceMetrics.loading = false;
        state.complianceMetrics.data = action.payload;
        state.complianceMetrics.success = true;
        state.complianceMetrics.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchComplianceMetrics.rejected, (state, action) => {
        state.complianceMetrics.loading = false;
        state.complianceMetrics.error = action.payload || "Failed to load compliance metrics";
      });

    // ── 4. AI Predictive Analytics ────────────────────────────────────
    builder
      .addCase(fetchPredictiveInsights.pending, (state) => {
        state.predictiveInsights.loading = true;
        state.predictiveInsights.error = null;
      })
      .addCase(fetchPredictiveInsights.fulfilled, (state, action) => {
        state.predictiveInsights.loading = false;
        state.predictiveInsights.data = action.payload;
        state.predictiveInsights.success = true;
        state.predictiveInsights.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPredictiveInsights.rejected, (state, action) => {
        state.predictiveInsights.loading = false;
        state.predictiveInsights.error = action.payload || "Failed to load predictive insights";
      })

      .addCase(analyzePredictiveInsights.pending, (state) => {
        state.operationLoading["analyzePredictiveInsights"] = true;
      })
      .addCase(analyzePredictiveInsights.fulfilled, (state, action) => {
        state.operationLoading["analyzePredictiveInsights"] = false;
        state.operationSuccess["analyzePredictiveInsights"] = true;
        state.predictiveInsights.data = action.payload;
      })
      .addCase(analyzePredictiveInsights.rejected, (state, action) => {
        state.operationLoading["analyzePredictiveInsights"] = false;
        state.operationErrors["analyzePredictiveInsights"] =
          action.payload || "Predictive analysis failed";
      })

      .addCase(fetchAttritionAnalytics.pending, (state) => {
        state.attrition.loading = true;
      })
      .addCase(fetchAttritionAnalytics.fulfilled, (state, action) => {
        state.attrition.loading = false;
        state.attrition.data = action.payload;
        state.attrition.success = true;
      })
      .addCase(fetchAttritionAnalytics.rejected, (state, action) => {
        state.attrition.loading = false;
        state.attrition.error = action.payload || "Failed to load attrition analytics";
      })

      .addCase(predictAttrition.pending, (state) => {
        state.operationLoading["predictAttrition"] = true;
      })
      .addCase(predictAttrition.fulfilled, (state, action) => {
        state.operationLoading["predictAttrition"] = false;
        state.operationSuccess["predictAttrition"] = true;
        state.attrition.data = action.payload;
      })
      .addCase(predictAttrition.rejected, (state, action) => {
        state.operationLoading["predictAttrition"] = false;
        state.operationErrors["predictAttrition"] = action.payload || "Attrition prediction failed";
      })

      .addCase(fetchSentimentAnalytics.fulfilled, (state, action) => {
        state.sentiment.data = action.payload;
        state.sentiment.success = true;
      })
      .addCase(analyzeSentiment.pending, (state) => {
        state.operationLoading["analyzeSentiment"] = true;
      })
      .addCase(analyzeSentiment.fulfilled, (state, action) => {
        state.operationLoading["analyzeSentiment"] = false;
        state.operationSuccess["analyzeSentiment"] = true;
        state.sentiment.data = action.payload;
      })
      .addCase(analyzeSentiment.rejected, (state, action) => {
        state.operationLoading["analyzeSentiment"] = false;
        state.operationErrors["analyzeSentiment"] = action.payload || "Sentiment analysis failed";
      })

      .addCase(fetchBurnoutRisk.fulfilled, (state, action) => {
        state.burnoutRisk.data = action.payload;
        state.burnoutRisk.success = true;
      })
      .addCase(analyzeBurnoutRisk.pending, (state) => {
        state.operationLoading["analyzeBurnoutRisk"] = true;
      })
      .addCase(analyzeBurnoutRisk.fulfilled, (state, action) => {
        state.operationLoading["analyzeBurnoutRisk"] = false;
        state.operationSuccess["analyzeBurnoutRisk"] = true;
        state.burnoutRisk.data = action.payload;
      })
      .addCase(analyzeBurnoutRisk.rejected, (state, action) => {
        state.operationLoading["analyzeBurnoutRisk"] = false;
        state.operationErrors["analyzeBurnoutRisk"] = action.payload || "Burnout analysis failed";
      })

      .addCase(fetchSalaryBenchmarks.fulfilled, (state, action) => {
        state.salaryBenchmarks.data = action.payload;
        state.salaryBenchmarks.success = true;
      })
      .addCase(analyzeSalaryBenchmarks.pending, (state) => {
        state.operationLoading["analyzeSalaryBenchmarks"] = true;
      })
      .addCase(analyzeSalaryBenchmarks.fulfilled, (state, action) => {
        state.operationLoading["analyzeSalaryBenchmarks"] = false;
        state.operationSuccess["analyzeSalaryBenchmarks"] = true;
        state.salaryBenchmarks.data = action.payload;
      })
      .addCase(analyzeSalaryBenchmarks.rejected, (state, action) => {
        state.operationLoading["analyzeSalaryBenchmarks"] = false;
        state.operationErrors["analyzeSalaryBenchmarks"] =
          action.payload || "Salary analysis failed";
      });
  },
});

export const { setSelectedReport, clearOperationStatus, resetAnalyticsState } =
  analyticsSlice.actions;

export default analyticsSlice.reducer;
