import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAIAttendanceState = (state: RootState) => state.aiAttendance;

export const selectAIAttendanceLoading = createSelector(
  [selectAIAttendanceState],
  (state) => state?.loading ?? false,
);

export const selectAIAttendanceError = createSelector(
  [selectAIAttendanceState],
  (state) => state?.error ?? null,
);

export const selectAIAttendanceLastUpdated = createSelector(
  [selectAIAttendanceState],
  (state) => state?.lastUpdated ?? null,
);

export const selectAIAttendanceDashboard = createSelector(
  [selectAIAttendanceState],
  (state) => state?.dashboard ?? null,
);

export const selectAIAttendanceTrend = createSelector(
  [selectAIAttendanceState],
  (state) => state?.trend ?? null,
);

export const selectAIAttendanceLateArrivals = createSelector(
  [selectAIAttendanceState],
  (state) => state?.lateArrivals ?? null,
);

export const selectAIAttendanceAnomalies = createSelector(
  [selectAIAttendanceState],
  (state) => state?.anomalies ?? { total: null, items: [] },
);

export const selectAIAttendanceAbsencePattern = createSelector(
  [selectAIAttendanceState],
  (state) => state?.absencePattern ?? null,
);

export const selectAIAttendanceOvertime = createSelector(
  [selectAIAttendanceState],
  (state) => state?.overtime ?? null,
);

export const selectAIAttendanceShiftViolations = createSelector(
  [selectAIAttendanceState],
  (state) => state?.shiftViolations ?? null,
);

export const selectAIAttendanceHealthScore = createSelector(
  [selectAIAttendanceState],
  (state) => state?.healthScore ?? null,
);

export const selectAIAttendanceWatchlist = createSelector(
  [selectAIAttendanceState],
  (state) => state?.watchlist ?? null,
);
