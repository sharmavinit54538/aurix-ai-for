import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAnalyticsState = (state: RootState) => state.analytics;

// ── 1. Overview & Summary ─────────────────────────────────────────
export const selectAnalyticsOverview = createSelector(
  [selectAnalyticsState],
  (state) => state.overview,
);

export const selectAnalyticsOverviewData = createSelector(
  [selectAnalyticsState],
  (state) => state.overview.data,
);

export const selectAnalyticsSummary = createSelector(
  [selectAnalyticsState],
  (state) => state.summary,
);

export const selectAnalyticsSummaryData = createSelector(
  [selectAnalyticsState],
  (state) => state.summary.data,
);

// ── 2. Reports Engine ─────────────────────────────────────────────
export const selectReports = createSelector([selectAnalyticsState], (state) => state.reports);

export const selectReportsData = createSelector(
  [selectAnalyticsState],
  (state) => state.reports.data ?? [],
);

export const selectSelectedReport = createSelector(
  [selectAnalyticsState],
  (state) => state.selectedReport.data,
);

export const selectExportLoading = createSelector(
  [selectAnalyticsState],
  (state) => state.exportLoading,
);

// ── 3. Core HR Metrics ────────────────────────────────────────────
export const selectHeadcountMetrics = createSelector(
  [selectAnalyticsState],
  (state) => state.headcount,
);

export const selectPayrollCostMetrics = createSelector(
  [selectAnalyticsState],
  (state) => state.payrollCosts,
);

export const selectTurnoverMetrics = createSelector(
  [selectAnalyticsState],
  (state) => state.turnoverRates,
);

export const selectComplianceMetrics = createSelector(
  [selectAnalyticsState],
  (state) => state.complianceMetrics,
);

// ── 4. AI Predictive Analytics ────────────────────────────────────
export const selectPredictiveInsights = createSelector(
  [selectAnalyticsState],
  (state) => state.predictiveInsights,
);

export const selectAttritionPrediction = createSelector(
  [selectAnalyticsState],
  (state) => state.attrition,
);

export const selectSentimentInsight = createSelector(
  [selectAnalyticsState],
  (state) => state.sentiment,
);

export const selectBurnoutRisk = createSelector(
  [selectAnalyticsState],
  (state) => state.burnoutRisk,
);

export const selectSalaryBenchmarks = createSelector(
  [selectAnalyticsState],
  (state) => state.salaryBenchmarks,
);

// ── 5. Operations ─────────────────────────────────────────────────
export const selectAnalyticsOperationLoading = (opKey: string) => (state: RootState) =>
  Boolean(state.analytics?.operationLoading?.[opKey]);

export const selectAnalyticsOperationError = (opKey: string) => (state: RootState) =>
  state.analytics?.operationErrors?.[opKey] ?? null;

export const selectAnalyticsOperationSuccess = (opKey: string) => (state: RootState) =>
  Boolean(state.analytics?.operationSuccess?.[opKey]);
