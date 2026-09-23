import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import leaveAssistantApi from "@/services/leaveAssistantApi";
import type {
  LeaveAssistantDashboardData,
  LeaveAssistantKpiItem,
  LeaveForecastItem,
  LeaveTypeDistributionItem,
} from "./leaveAssistantTypes";

export const fetchLeaveAssistantDashboard = createAsyncThunk<
  LeaveAssistantDashboardData,
  void,
  { rejectValue: string }
>("leaveAssistant/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await leaveAssistantApi.getDashboard();
  } catch (err) {
    try {
      const [kpiRes, forecastRes, distRes] = await Promise.allSettled([
        leaveAssistantApi.getKpi(),
        leaveAssistantApi.getForecast(),
        leaveAssistantApi.getDistribution(),
      ]);

      const leaveForecast = forecastRes.status === "fulfilled" ? forecastRes.value : undefined;
      const leaveTypeDistribution = distRes.status === "fulfilled" ? distRes.value : undefined;

      const dashboardData: LeaveAssistantDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        leaveForecast,
        leaveTypeDistribution,
        charts: {
          leaveForecast: leaveForecast ?? [],
          leaveTypeDistribution: leaveTypeDistribution ?? [],
        },
      };

      const hasData = [kpiRes, forecastRes, distRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load leave assistant dashboard data"),
        );
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load leave assistant dashboard data"),
      );
    }
  }
});

export const fetchLeaveAssistantKpi = createAsyncThunk<
  LeaveAssistantKpiItem[],
  void,
  { rejectValue: string }
>("leaveAssistant/fetchKpi", async (_, thunkAPI) => {
  try {
    return await leaveAssistantApi.getKpi();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load leave assistant KPI metrics"),
    );
  }
});

export const fetchLeaveForecast = createAsyncThunk<
  LeaveForecastItem[],
  void,
  { rejectValue: string }
>("leaveAssistant/fetchForecast", async (_, thunkAPI) => {
  try {
    return await leaveAssistantApi.getForecast();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load leave forecast"),
    );
  }
});

export const fetchLeaveTypeDistribution = createAsyncThunk<
  LeaveTypeDistributionItem[],
  void,
  { rejectValue: string }
>("leaveAssistant/fetchDistribution", async (_, thunkAPI) => {
  try {
    return await leaveAssistantApi.getDistribution();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load leave type distribution"),
    );
  }
});
