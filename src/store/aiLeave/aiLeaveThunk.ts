import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import aiLeaveApi from "@/services/aiLeaveApi";
import type {
  AILeaveDashboardData,
  LeaveConflictsData,
  LeaveApprovalSuggestionsData,
  LeaveForecastData,
  LeaveRequestDetails,
} from "./aiLeaveTypes";

function hasAnyLeaveData(data: AILeaveDashboardData): boolean {
  return Boolean(
    data.dashboard ||
      data.forecast ||
      data.distribution ||
      data.approvalSuggestions.items.length > 0 ||
      data.approvalSuggestions.total != null ||
      data.conflicts.items.length > 0 ||
      data.conflicts.total != null ||
      data.teamAvailability ||
      data.trends ||
      data.analytics,
  );
}

export const fetchAILeaveDashboard = createAsyncThunk<
  AILeaveDashboardData,
  void,
  { rejectValue: string }
>("aiLeave/fetchDashboard", async (_, thunkAPI) => {
  try {
    const dashboard = await aiLeaveApi.getDashboard();
    if (hasAnyLeaveData(dashboard)) {
      const needsSections =
        !dashboard.forecast &&
        !dashboard.distribution &&
        dashboard.approvalSuggestions.items.length === 0 &&
        dashboard.approvalSuggestions.total == null &&
        dashboard.conflicts.items.length === 0 &&
        dashboard.conflicts.total == null &&
        !dashboard.teamAvailability &&
        !dashboard.trends &&
        !dashboard.analytics;

      if (!needsSections) return dashboard;

      const [
        forecastRes,
        distributionRes,
        suggestionsRes,
        conflictsRes,
        availabilityRes,
        trendsRes,
        analyticsRes,
      ] = await Promise.allSettled([
        aiLeaveApi.getForecast(),
        aiLeaveApi.getDistribution(),
        aiLeaveApi.getApprovalSuggestions(),
        aiLeaveApi.getConflicts(),
        aiLeaveApi.getTeamAvailability(),
        aiLeaveApi.getTrends(),
        aiLeaveApi.getAnalytics(),
      ]);

      return {
        dashboard: dashboard.dashboard,
        forecast: forecastRes.status === "fulfilled" ? forecastRes.value : null,
        distribution: distributionRes.status === "fulfilled" ? distributionRes.value : null,
        approvalSuggestions:
          suggestionsRes.status === "fulfilled" ? suggestionsRes.value : { total: null, items: [] },
        conflicts: conflictsRes.status === "fulfilled" ? conflictsRes.value : { total: null, items: [] },
        teamAvailability: availabilityRes.status === "fulfilled" ? availabilityRes.value : null,
        trends: trendsRes.status === "fulfilled" ? trendsRes.value : null,
        analytics: analyticsRes.status === "fulfilled" ? analyticsRes.value : null,
      };
    }
  } catch {
    // Fall through
  }

  try {
    const [
      kpiRes,
      forecastRes,
      distributionRes,
      suggestionsRes,
      conflictsRes,
      availabilityRes,
      trendsRes,
      analyticsRes,
    ] = await Promise.allSettled([
      aiLeaveApi.getDashboardKpis(),
      aiLeaveApi.getForecast(),
      aiLeaveApi.getDistribution(),
      aiLeaveApi.getApprovalSuggestions(),
      aiLeaveApi.getConflicts(),
      aiLeaveApi.getTeamAvailability(),
      aiLeaveApi.getTrends(),
      aiLeaveApi.getAnalytics(),
    ]);

    const data: AILeaveDashboardData = {
      dashboard: kpiRes.status === "fulfilled" ? kpiRes.value : null,
      forecast: forecastRes.status === "fulfilled" ? forecastRes.value : null,
      distribution: distributionRes.status === "fulfilled" ? distributionRes.value : null,
      approvalSuggestions:
        suggestionsRes.status === "fulfilled" ? suggestionsRes.value : { total: null, items: [] },
      conflicts: conflictsRes.status === "fulfilled" ? conflictsRes.value : { total: null, items: [] },
      teamAvailability: availabilityRes.status === "fulfilled" ? availabilityRes.value : null,
      trends: trendsRes.status === "fulfilled" ? trendsRes.value : null,
      analytics: analyticsRes.status === "fulfilled" ? analyticsRes.value : null,
    };

    if (!hasAnyLeaveData(data)) {
      return thunkAPI.rejectWithValue("Failed to load AI Leave Assistant data");
    }

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load AI Leave Assistant data"));
  }
});

export const generateAILeaveForecast = createAsyncThunk<
  LeaveForecastData | null,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiLeave/generateForecast", async (payload, thunkAPI) => {
  try {
    return await aiLeaveApi.generateForecast(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to generate leave forecast"));
  }
});

export const generateAILeaveSuggestions = createAsyncThunk<
  LeaveApprovalSuggestionsData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiLeave/generateSuggestions", async (payload, thunkAPI) => {
  try {
    return await aiLeaveApi.generateSuggestions(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to generate approval suggestions"));
  }
});

export const detectAILeaveConflicts = createAsyncThunk<
  LeaveConflictsData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiLeave/detectConflicts", async (payload, thunkAPI) => {
  try {
    return await aiLeaveApi.detectConflicts(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to detect leave conflicts"));
  }
});

export const analyzeAILeaveRequest = createAsyncThunk<
  unknown,
  Record<string, unknown>,
  { rejectValue: string }
>("aiLeave/analyze", async (payload, thunkAPI) => {
  try {
    return await aiLeaveApi.analyzeLeave(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to analyze leave request"));
  }
});

export const fetchAILeaveRequestDetails = createAsyncThunk<
  LeaveRequestDetails | null,
  string,
  { rejectValue: string }
>("aiLeave/fetchRequestDetails", async (leaveRequestId, thunkAPI) => {
  try {
    return await aiLeaveApi.getRequestDetails(leaveRequestId);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load leave request details"));
  }
});
