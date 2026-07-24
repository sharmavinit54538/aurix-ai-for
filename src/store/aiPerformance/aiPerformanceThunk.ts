import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import aiPerformanceApi from "@/services/aiPerformanceApi";
import type {
  AIPerformanceDashboardData,
  CoachingSuggestionsData,
  EmployeePerformanceProfile,
  PromotionRecommendationsData,
  SkillGapsData,
} from "./aiPerformanceTypes";

function hasAnyPerformanceData(data: AIPerformanceDashboardData): boolean {
  return Boolean(
    data.dashboard ||
      data.trends ||
      data.kpiAttainment ||
      data.topPerformers.employees.length > 0 ||
      data.topPerformers.total != null ||
      data.skillGaps.items.length > 0 ||
      data.skillGaps.total != null ||
      data.promotions.items.length > 0 ||
      data.promotions.total != null ||
      data.coaching.items.length > 0 ||
      data.coaching.total != null ||
      data.analytics,
  );
}

export const fetchAIPerformanceDashboard = createAsyncThunk<
  AIPerformanceDashboardData,
  void,
  { rejectValue: string }
>("aiPerformance/fetchDashboard", async (_, thunkAPI) => {
  try {
    const dashboard = await aiPerformanceApi.getDashboard();
    if (hasAnyPerformanceData(dashboard)) {
      const needsSections =
        !dashboard.trends &&
        !dashboard.kpiAttainment &&
        dashboard.topPerformers.employees.length === 0 &&
        dashboard.topPerformers.total == null &&
        dashboard.skillGaps.items.length === 0 &&
        dashboard.skillGaps.total == null &&
        dashboard.promotions.items.length === 0 &&
        dashboard.promotions.total == null &&
        dashboard.coaching.items.length === 0 &&
        dashboard.coaching.total == null &&
        !dashboard.analytics;

      if (!needsSections) return dashboard;

      const [
        trendsRes,
        kpiRes,
        topRes,
        gapsRes,
        promotionsRes,
        coachingRes,
        analyticsRes,
      ] = await Promise.allSettled([
        aiPerformanceApi.getTrends(),
        aiPerformanceApi.getKpiAttainment(),
        aiPerformanceApi.getTopPerformers(),
        aiPerformanceApi.getSkillGaps(),
        aiPerformanceApi.getPromotionRecommendations(),
        aiPerformanceApi.getCoachingSuggestions(),
        aiPerformanceApi.getAnalytics(),
      ]);

      return {
        dashboard: dashboard.dashboard,
        trends: trendsRes.status === "fulfilled" ? trendsRes.value : null,
        kpiAttainment: kpiRes.status === "fulfilled" ? kpiRes.value : null,
        topPerformers:
          topRes.status === "fulfilled"
            ? topRes.value
            : { total: null, employees: [], teams: [], departments: [], managers: [] },
        skillGaps: gapsRes.status === "fulfilled" ? gapsRes.value : { total: null, items: [] },
        promotions: promotionsRes.status === "fulfilled" ? promotionsRes.value : { total: null, items: [] },
        coaching: coachingRes.status === "fulfilled" ? coachingRes.value : { total: null, items: [] },
        analytics: analyticsRes.status === "fulfilled" ? analyticsRes.value : null,
      };
    }
  } catch {
    // Fall through
  }

  try {
    const [
      kpiRes,
      trendsRes,
      attainmentRes,
      topRes,
      gapsRes,
      promotionsRes,
      coachingRes,
      analyticsRes,
    ] = await Promise.allSettled([
      aiPerformanceApi.getDashboardKpis(),
      aiPerformanceApi.getTrends(),
      aiPerformanceApi.getKpiAttainment(),
      aiPerformanceApi.getTopPerformers(),
      aiPerformanceApi.getSkillGaps(),
      aiPerformanceApi.getPromotionRecommendations(),
      aiPerformanceApi.getCoachingSuggestions(),
      aiPerformanceApi.getAnalytics(),
    ]);

    const data: AIPerformanceDashboardData = {
      dashboard: kpiRes.status === "fulfilled" ? kpiRes.value : null,
      trends: trendsRes.status === "fulfilled" ? trendsRes.value : null,
      kpiAttainment: attainmentRes.status === "fulfilled" ? attainmentRes.value : null,
      topPerformers:
        topRes.status === "fulfilled"
          ? topRes.value
          : { total: null, employees: [], teams: [], departments: [], managers: [] },
      skillGaps: gapsRes.status === "fulfilled" ? gapsRes.value : { total: null, items: [] },
      promotions: promotionsRes.status === "fulfilled" ? promotionsRes.value : { total: null, items: [] },
      coaching: coachingRes.status === "fulfilled" ? coachingRes.value : { total: null, items: [] },
      analytics: analyticsRes.status === "fulfilled" ? analyticsRes.value : null,
    };

    if (!hasAnyPerformanceData(data)) {
      return thunkAPI.rejectWithValue("Failed to load AI Performance Coach data");
    }

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load AI Performance Coach data"));
  }
});

export const generateAICoaching = createAsyncThunk<
  CoachingSuggestionsData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPerformance/generateCoaching", async (payload, thunkAPI) => {
  try {
    return await aiPerformanceApi.generateCoaching(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to generate coaching suggestions"));
  }
});

export const generateAIPromotion = createAsyncThunk<
  PromotionRecommendationsData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPerformance/generatePromotion", async (payload, thunkAPI) => {
  try {
    return await aiPerformanceApi.generatePromotion(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to generate promotion assessment"));
  }
});

export const analyzeAISkillGaps = createAsyncThunk<
  SkillGapsData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPerformance/analyzeSkillGaps", async (payload, thunkAPI) => {
  try {
    return await aiPerformanceApi.analyzeSkillGaps(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to analyze skill gaps"));
  }
});

export const evaluateAIPerformance = createAsyncThunk<
  unknown,
  Record<string, unknown>,
  { rejectValue: string }
>("aiPerformance/evaluate", async (payload, thunkAPI) => {
  try {
    return await aiPerformanceApi.evaluate(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to evaluate performance"));
  }
});

export const fetchAIEmployeePerformance = createAsyncThunk<
  EmployeePerformanceProfile | null,
  string,
  { rejectValue: string }
>("aiPerformance/fetchEmployee", async (employeeId, thunkAPI) => {
  try {
    return await aiPerformanceApi.getEmployeeProfile(employeeId);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load employee performance profile"));
  }
});
