import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import workforceInsightsApi from "@/services/workforceInsightsApi";
import type {
  DepartmentComparisonItem,
  HeadcountTrendItem,
  WorkforceInsightsDashboardData,
  WorkforceInsightsKpiItem,
} from "./workforceInsightsTypes";

export const fetchWorkforceInsightsDashboard = createAsyncThunk<
  WorkforceInsightsDashboardData,
  void,
  { rejectValue: string }
>("workforceInsights/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await workforceInsightsApi.getDashboard();
  } catch (err) {
    try {
      const [kpiRes, hcRes, deptRes] = await Promise.allSettled([
        workforceInsightsApi.getKpi(),
        workforceInsightsApi.getHeadcountTrends(),
        workforceInsightsApi.getDepartmentComparison(),
      ]);

      const headcountTrends = hcRes.status === "fulfilled" ? hcRes.value : undefined;
      const departmentComparison = deptRes.status === "fulfilled" ? deptRes.value : undefined;

      const dashboardData: WorkforceInsightsDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        headcountTrends,
        departmentComparison,
        charts: {
          headcountTrends: headcountTrends ?? [],
          departmentComparison: departmentComparison ?? [],
        },
      };

      const hasData = [kpiRes, hcRes, deptRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load workforce insights dashboard data"),
        );
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load workforce insights dashboard data"),
      );
    }
  }
});

export const fetchWorkforceInsightsKpi = createAsyncThunk<
  WorkforceInsightsKpiItem[],
  void,
  { rejectValue: string }
>("workforceInsights/fetchKpi", async (_, thunkAPI) => {
  try {
    return await workforceInsightsApi.getKpi();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load workforce insights KPI metrics"),
    );
  }
});

export const fetchHeadcountTrends = createAsyncThunk<
  HeadcountTrendItem[],
  void,
  { rejectValue: string }
>("workforceInsights/fetchHeadcountTrends", async (_, thunkAPI) => {
  try {
    return await workforceInsightsApi.getHeadcountTrends();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load headcount trends"),
    );
  }
});

export const fetchDepartmentComparison = createAsyncThunk<
  DepartmentComparisonItem[],
  void,
  { rejectValue: string }
>("workforceInsights/fetchDepartmentComparison", async (_, thunkAPI) => {
  try {
    return await workforceInsightsApi.getDepartmentComparison();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load department comparison"),
    );
  }
});
