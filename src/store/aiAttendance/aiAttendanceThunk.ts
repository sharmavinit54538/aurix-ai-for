import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import aiAttendanceApi from "@/services/aiAttendanceApi";
import type { AIAttendanceDashboardData } from "./aiAttendanceTypes";

function hasAnyAttendanceData(data: AIAttendanceDashboardData): boolean {
  return Boolean(
    data.dashboard ||
      data.trend ||
      data.lateArrivals ||
      data.anomalies.items.length > 0 ||
      data.anomalies.total != null ||
      data.absencePattern ||
      data.overtime ||
      data.shiftViolations ||
      data.healthScore ||
      data.watchlist,
  );
}

export const fetchAIAttendanceDashboard = createAsyncThunk<
  AIAttendanceDashboardData,
  void,
  { rejectValue: string }
>("aiAttendance/fetchDashboard", async (_, thunkAPI) => {
  try {
    const dashboard = await aiAttendanceApi.getDashboard();
    if (hasAnyAttendanceData(dashboard)) {
      const needsSections =
        !dashboard.trend &&
        !dashboard.lateArrivals &&
        dashboard.anomalies.items.length === 0 &&
        dashboard.anomalies.total == null &&
        !dashboard.absencePattern &&
        !dashboard.overtime &&
        !dashboard.shiftViolations &&
        !dashboard.healthScore &&
        !dashboard.watchlist;

      if (!needsSections) return dashboard;

      const [
        trendRes,
        lateArrivalsRes,
        anomaliesRes,
        absencePatternRes,
        overtimeRes,
        shiftViolationsRes,
        healthScoreRes,
        watchlistRes,
      ] = await Promise.allSettled([
        aiAttendanceApi.getTrend(),
        aiAttendanceApi.getLateArrivals(),
        aiAttendanceApi.getAnomalies(),
        aiAttendanceApi.getAbsencePattern(),
        aiAttendanceApi.getOvertime(),
        aiAttendanceApi.getShiftViolations(),
        aiAttendanceApi.getHealthScore(),
        aiAttendanceApi.getWatchlist(),
      ]);

      return {
        dashboard: dashboard.dashboard,
        trend: trendRes.status === "fulfilled" ? trendRes.value : null,
        lateArrivals: lateArrivalsRes.status === "fulfilled" ? lateArrivalsRes.value : null,
        anomalies: anomaliesRes.status === "fulfilled" ? anomaliesRes.value : { total: null, items: [] },
        absencePattern: absencePatternRes.status === "fulfilled" ? absencePatternRes.value : null,
        overtime: overtimeRes.status === "fulfilled" ? overtimeRes.value : null,
        shiftViolations: shiftViolationsRes.status === "fulfilled" ? shiftViolationsRes.value : null,
        healthScore: healthScoreRes.status === "fulfilled" ? healthScoreRes.value : null,
        watchlist: watchlistRes.status === "fulfilled" ? watchlistRes.value : null,
      };
    }
  } catch {
    // Fall through to full section fetch
  }

  try {
    const [
      kpiRes,
      trendRes,
      lateArrivalsRes,
      anomaliesRes,
      absencePatternRes,
      overtimeRes,
      shiftViolationsRes,
      healthScoreRes,
      watchlistRes,
    ] = await Promise.allSettled([
      aiAttendanceApi.getDashboardKpis(),
      aiAttendanceApi.getTrend(),
      aiAttendanceApi.getLateArrivals(),
      aiAttendanceApi.getAnomalies(),
      aiAttendanceApi.getAbsencePattern(),
      aiAttendanceApi.getOvertime(),
      aiAttendanceApi.getShiftViolations(),
      aiAttendanceApi.getHealthScore(),
      aiAttendanceApi.getWatchlist(),
    ]);

    const data: AIAttendanceDashboardData = {
      dashboard: kpiRes.status === "fulfilled" ? kpiRes.value : null,
      trend: trendRes.status === "fulfilled" ? trendRes.value : null,
      lateArrivals: lateArrivalsRes.status === "fulfilled" ? lateArrivalsRes.value : null,
      anomalies: anomaliesRes.status === "fulfilled" ? anomaliesRes.value : { total: null, items: [] },
      absencePattern: absencePatternRes.status === "fulfilled" ? absencePatternRes.value : null,
      overtime: overtimeRes.status === "fulfilled" ? overtimeRes.value : null,
      shiftViolations: shiftViolationsRes.status === "fulfilled" ? shiftViolationsRes.value : null,
      healthScore: healthScoreRes.status === "fulfilled" ? healthScoreRes.value : null,
      watchlist: watchlistRes.status === "fulfilled" ? watchlistRes.value : null,
    };

    if (!hasAnyAttendanceData(data)) {
      return thunkAPI.rejectWithValue("Failed to load AI Attendance Monitor data");
    }

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load AI Attendance Monitor data"));
  }
});
