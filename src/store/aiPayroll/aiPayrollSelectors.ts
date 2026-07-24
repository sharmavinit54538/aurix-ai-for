import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAIPayrollState = (state: RootState) => state.aiPayroll;

export const selectAIPayrollLoading = createSelector(
  [selectAIPayrollState],
  (state) => state?.loading ?? false,
);

export const selectAIPayrollError = createSelector(
  [selectAIPayrollState],
  (state) => state?.error ?? null,
);

export const selectAIPayrollLastUpdated = createSelector(
  [selectAIPayrollState],
  (state) => state?.lastUpdated ?? null,
);

export const selectAIPayrollActionLoading = createSelector(
  [selectAIPayrollState],
  (state) => state?.actionLoading ?? false,
);

export const selectAIPayrollActionError = createSelector(
  [selectAIPayrollState],
  (state) => state?.actionError ?? null,
);

export const selectAIPayrollDashboard = createSelector(
  [selectAIPayrollState],
  (state) => state?.dashboard ?? null,
);

export const selectAIPayrollForecast = createSelector(
  [selectAIPayrollState],
  (state) => state?.forecast ?? null,
);

export const selectAIPayrollCostAnalysis = createSelector(
  [selectAIPayrollState],
  (state) => state?.costAnalysis ?? null,
);

export const selectAIPayrollCostByDepartment = createSelector(
  [selectAIPayrollState],
  (state) => state?.costByDepartment ?? null,
);

export const selectAIPayrollBenchmarking = createSelector(
  [selectAIPayrollState],
  (state) => state?.benchmarking ?? { total: null, items: [] },
);

export const selectAIPayrollAnomalies = createSelector(
  [selectAIPayrollState],
  (state) => state?.anomalies ?? { total: null, items: [] },
);

export const selectAIPayrollFraud = createSelector(
  [selectAIPayrollState],
  (state) => state?.fraud ?? { total: null, items: [] },
);

export const selectAIPayrollHealthScore = createSelector(
  [selectAIPayrollState],
  (state) => state?.healthScore ?? null,
);

export const selectAIPayrollAnalytics = createSelector(
  [selectAIPayrollState],
  (state) => state?.analytics ?? null,
);

export const selectAIPayrollSelectedEmployee = createSelector(
  [selectAIPayrollState],
  (state) => state?.selectedEmployee ?? null,
);
