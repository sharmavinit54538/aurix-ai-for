import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import aiInsightsApi from "@/services/aiInsightsApi";
import type {
  AIInsightsDashboardData,
  AttendanceInsightItem,
  AttritionItem,
  BurnoutItem,
  KpiItem,
  PerformanceData,
  RecruitmentData,
  AIInsightsCharts,
} from "./aiInsightsTypes";

export const fetchAIInsightsDashboard = createAsyncThunk<
  AIInsightsDashboardData,
  void,
  { rejectValue: string }
>("aiInsights/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await aiInsightsApi.getDashboard();
  } catch (err) {
    // If combined dashboard endpoint fails, attempt to fetch individual sections in parallel
    try {
      const [
        kpiRes,
        attritionRes,
        burnoutRes,
        attendanceRes,
        performanceRes,
        recruitmentRes,
        chartsRes,
        recommendationsRes,
      ] = await Promise.allSettled([
        aiInsightsApi.getKpi(),
        aiInsightsApi.getAttrition(),
        aiInsightsApi.getBurnout(),
        aiInsightsApi.getAttendance(),
        aiInsightsApi.getPerformance(),
        aiInsightsApi.getRecruitment(),
        aiInsightsApi.getCharts(),
        aiInsightsApi.getRecommendations(),
      ]);

      const dashboardData: AIInsightsDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        attrition: attritionRes.status === "fulfilled" ? attritionRes.value : undefined,
        burnout: burnoutRes.status === "fulfilled" ? burnoutRes.value : undefined,
        attendance: attendanceRes.status === "fulfilled" ? attendanceRes.value : undefined,
        performance: performanceRes.status === "fulfilled" ? performanceRes.value : undefined,
        recruitment: recruitmentRes.status === "fulfilled" ? recruitmentRes.value : undefined,
        charts: chartsRes.status === "fulfilled" ? chartsRes.value : undefined,
        recommendations: recommendationsRes.status === "fulfilled" ? recommendationsRes.value : undefined,
      };

      // Check if at least one sub-request succeeded
      const hasData = [
        kpiRes,
        attritionRes,
        burnoutRes,
        attendanceRes,
        performanceRes,
        recruitmentRes,
        chartsRes,
        recommendationsRes,
      ].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load AI Insights dashboard data"));
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load AI Insights dashboard data"));
    }
  }
});

export const fetchKpi = createAsyncThunk<KpiItem[], void, { rejectValue: string }>(
  "aiInsights/fetchKpi",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getKpi();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load KPI metrics"));
    }
  },
);

export const fetchAttrition = createAsyncThunk<AttritionItem[], void, { rejectValue: string }>(
  "aiInsights/fetchAttrition",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getAttrition();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load attrition predictions"));
    }
  },
);

export const fetchBurnout = createAsyncThunk<BurnoutItem[], void, { rejectValue: string }>(
  "aiInsights/fetchBurnout",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getBurnout();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load burnout data"));
    }
  },
);

export const fetchAttendance = createAsyncThunk<AttendanceInsightItem[], void, { rejectValue: string }>(
  "aiInsights/fetchAttendance",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getAttendance();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load attendance insights"));
    }
  },
);

export const fetchPerformance = createAsyncThunk<PerformanceData, void, { rejectValue: string }>(
  "aiInsights/fetchPerformance",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getPerformance();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load performance data"));
    }
  },
);

export const fetchRecruitment = createAsyncThunk<RecruitmentData, void, { rejectValue: string }>(
  "aiInsights/fetchRecruitment",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getRecruitment();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load recruitment data"));
    }
  },
);

export const fetchCharts = createAsyncThunk<AIInsightsCharts, void, { rejectValue: string }>(
  "aiInsights/fetchCharts",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getCharts();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load chart datasets"));
    }
  },
);

export const fetchRecommendations = createAsyncThunk<string[], void, { rejectValue: string }>(
  "aiInsights/fetchRecommendations",
  async (_, thunkAPI) => {
    try {
      return await aiInsightsApi.getRecommendations();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load recommendations"));
    }
  },
);
