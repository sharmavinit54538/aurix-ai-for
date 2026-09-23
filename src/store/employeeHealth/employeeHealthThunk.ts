import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import employeeHealthApi from "@/services/employeeHealthApi";
import type {
  BurnoutRiskTrendItem,
  EmployeeHealthDashboardData,
  EmployeeHealthKpiItem,
  OvertimeByTeamItem,
} from "./employeeHealthTypes";

export const fetchEmployeeHealthDashboard = createAsyncThunk<
  EmployeeHealthDashboardData,
  void,
  { rejectValue: string }
>("employeeHealth/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await employeeHealthApi.getDashboard();
  } catch (err) {
    try {
      const [kpiRes, trendRes, otRes] = await Promise.allSettled([
        employeeHealthApi.getKpi(),
        employeeHealthApi.getBurnoutTrend(),
        employeeHealthApi.getOvertime(),
      ]);

      const burnoutRiskTrend = trendRes.status === "fulfilled" ? trendRes.value : undefined;
      const overtimeByTeam = otRes.status === "fulfilled" ? otRes.value : undefined;

      const dashboardData: EmployeeHealthDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        burnoutRiskTrend,
        overtimeByTeam,
        charts: {
          burnoutRiskTrend: burnoutRiskTrend ?? [],
          overtimeByTeam: overtimeByTeam ?? [],
        },
      };

      const hasData = [kpiRes, trendRes, otRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load employee health dashboard data"),
        );
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load employee health dashboard data"),
      );
    }
  }
});

export const fetchEmployeeHealthKpi = createAsyncThunk<
  EmployeeHealthKpiItem[],
  void,
  { rejectValue: string }
>("employeeHealth/fetchKpi", async (_, thunkAPI) => {
  try {
    return await employeeHealthApi.getKpi();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load employee health KPI metrics"),
    );
  }
});

export const fetchBurnoutRiskTrend = createAsyncThunk<
  BurnoutRiskTrendItem[],
  void,
  { rejectValue: string }
>("employeeHealth/fetchBurnoutRiskTrend", async (_, thunkAPI) => {
  try {
    return await employeeHealthApi.getBurnoutTrend();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load burnout risk trend"),
    );
  }
});

export const fetchOvertimeByTeam = createAsyncThunk<
  OvertimeByTeamItem[],
  void,
  { rejectValue: string }
>("employeeHealth/fetchOvertimeByTeam", async (_, thunkAPI) => {
  try {
    return await employeeHealthApi.getOvertime();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load overtime by team"),
    );
  }
});
