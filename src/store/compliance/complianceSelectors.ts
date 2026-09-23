import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectComplianceState = (state: RootState) => state.compliance;

export const selectComplianceLoading = createSelector(
  [selectComplianceState],
  (state) => state?.loading ?? false,
);

export const selectComplianceError = createSelector(
  [selectComplianceState],
  (state) => state?.error ?? null,
);

export const selectComplianceLastUpdated = createSelector(
  [selectComplianceState],
  (state) => state?.lastUpdated ?? null,
);

export const selectComplianceSummary = createSelector(
  [selectComplianceState],
  (state) => state?.summary ?? null,
);

export const selectComplianceKPIs = createSelector(
  [selectComplianceState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectComplianceRisks = createSelector(
  [selectComplianceState],
  (state) => (Array.isArray(state?.risks) ? state.risks : []),
);

export const selectComplianceCharts = createSelector(
  [selectComplianceState],
  (state) => state?.charts ?? null,
);

export const selectComplianceTrend = createSelector(
  [selectComplianceCharts],
  (charts) => (Array.isArray(charts?.complianceTrend) ? charts.complianceTrend : []),
);

export const selectComplianceRisksByCategory = createSelector(
  [selectComplianceCharts],
  (charts) => (Array.isArray(charts?.risksByCategory) ? charts.risksByCategory : []),
);
