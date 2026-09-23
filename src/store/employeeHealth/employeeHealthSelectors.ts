import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectEmployeeHealthState = (state: RootState) => state.employeeHealth;

export const selectEmployeeHealthLoading = createSelector(
  [selectEmployeeHealthState],
  (state) => state?.loading ?? false,
);

export const selectEmployeeHealthError = createSelector(
  [selectEmployeeHealthState],
  (state) => state?.error ?? null,
);

export const selectEmployeeHealthLastUpdated = createSelector(
  [selectEmployeeHealthState],
  (state) => state?.lastUpdated ?? null,
);

export const selectEmployeeHealthSummary = createSelector(
  [selectEmployeeHealthState],
  (state) => state?.summary ?? null,
);

export const selectEmployeeHealthKPIs = createSelector(
  [selectEmployeeHealthState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectEmployeeHealthCharts = createSelector(
  [selectEmployeeHealthState],
  (state) => state?.charts ?? null,
);

export const selectEmployeeHealthBurnoutTrend = createSelector(
  [selectEmployeeHealthCharts],
  (charts) => (Array.isArray(charts?.burnoutRiskTrend) ? charts.burnoutRiskTrend : []),
);

export const selectEmployeeHealthOvertimeByTeam = createSelector(
  [selectEmployeeHealthCharts],
  (charts) => (Array.isArray(charts?.overtimeByTeam) ? charts.overtimeByTeam : []),
);
