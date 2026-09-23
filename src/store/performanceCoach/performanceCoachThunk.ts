import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import performanceCoachApi from "@/services/performanceCoachApi";
import type {
  KpiAttainmentItem,
  PerformanceCoachDashboardData,
  PerformanceCoachKpiItem,
  PerformanceTrendItem,
} from "./performanceCoachTypes";

export const fetchPerformanceCoachDashboard = createAsyncThunk<
  PerformanceCoachDashboardData,
  void,
  { rejectValue: string }
>("performanceCoach/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await performanceCoachApi.getDashboard();
  } catch (err) {
    try {
      const [kpiRes, trendRes, attRes] = await Promise.allSettled([
        performanceCoachApi.getKpi(),
        performanceCoachApi.getTrend(),
        performanceCoachApi.getAttainment(),
      ]);

      const performanceTrend = trendRes.status === "fulfilled" ? trendRes.value : undefined;
      const kpiAttainment = attRes.status === "fulfilled" ? attRes.value : undefined;

      const dashboardData: PerformanceCoachDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        performanceTrend,
        kpiAttainment,
        charts: {
          performanceTrend: performanceTrend ?? [],
          kpiAttainment: kpiAttainment ?? [],
        },
      };

      const hasData = [kpiRes, trendRes, attRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load performance coach dashboard data"),
        );
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load performance coach dashboard data"),
      );
    }
  }
});

export const fetchPerformanceCoachKpi = createAsyncThunk<
  PerformanceCoachKpiItem[],
  void,
  { rejectValue: string }
>("performanceCoach/fetchKpi", async (_, thunkAPI) => {
  try {
    return await performanceCoachApi.getKpi();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load performance coach KPI metrics"),
    );
  }
});

export const fetchPerformanceTrend = createAsyncThunk<
  PerformanceTrendItem[],
  void,
  { rejectValue: string }
>("performanceCoach/fetchTrend", async (_, thunkAPI) => {
  try {
    return await performanceCoachApi.getTrend();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load performance trend"),
    );
  }
});

export const fetchKpiAttainment = createAsyncThunk<
  KpiAttainmentItem[],
  void,
  { rejectValue: string }
>("performanceCoach/fetchAttainment", async (_, thunkAPI) => {
  try {
    return await performanceCoachApi.getAttainment();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load KPI attainment"),
    );
  }
});
