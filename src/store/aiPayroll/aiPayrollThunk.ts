import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import aiPayrollApi from "@/services/aiPayrollApi";
import type {
  AIPayrollDashboardData,
  EmployeePayrollProfile,
  PayrollAnomaliesData,
  PayrollForecastData,
  PayrollFraudData,
} from "./aiPayrollTypes";

function hasAnyPayrollData(data: AIPayrollDashboardData): boolean {
  return Boolean(
    data.dashboard ||
      data.forecast ||
      data.costAnalysis ||
      data.costByDepartment ||
      data.benchmarking.items.length > 0 ||
      data.benchmarking.total != null ||
      data.anomalies.items.length > 0 ||
      data.anomalies.total != null ||
      data.fraud.items.length > 0 ||
      data.fraud.total != null ||
      data.healthScore ||
      data.analytics,
  );
}

export const fetchAIPayrollDashboard = createAsyncThunk<
  AIPayrollDashboardData,
  void,
  { rejectValue: string }
>("aiPayroll/fetchDashboard", async (_, thunkAPI) => {
  try {
    const dashboard = await aiPayrollApi.getDashboard();
    if (hasAnyPayrollData(dashboard)) {
      const needsSections =
        !dashboard.forecast &&
        !dashboard.costAnalysis &&
        !dashboard.costByDepartment &&
        dashboard.benchmarking.items.length === 0 &&
        dashboard.benchmarking.total == null &&
        dashboard.anomalies.items.length === 0 &&
        dashboard.anomalies.total == null &&
        dashboard.fraud.items.length === 0 &&
        dashboard.fraud.total == null &&
        !dashboard.healthScore &&
        !dashboard.analytics;

      if (!needsSections) return dashboard;

      const [
        forecastRes,
        costRes,
        deptRes,
        benchRes,
        anomaliesRes,
        fraudRes,
        healthRes,
        analyticsRes,
      ] = await Promise.allSettled([
        aiPayrollApi.getForecast(),
        aiPayrollApi.getCostAnalysis(),
        aiPayrollApi.getCostByDepartment(),
        aiPayrollApi.getBenchmarking(),
        aiPayrollApi.getAnomalies(),
        aiPayrollApi.getFraudDetection(),
        aiPayrollApi.getHealthScore(),
        aiPayrollApi.getAnalytics(),
      ]);

      return {
        dashboard: dashboard.dashboard,
        forecast: forecastRes.status === "fulfilled" ? forecastRes.value : null,
        costAnalysis: costRes.status === "fulfilled" ? costRes.value : null,
        costByDepartment: deptRes.status === "fulfilled" ? deptRes.value : null,
        benchmarking:
          benchRes.status === "fulfilled" ? benchRes.value : { total: null, items: [] },
        anomalies:
          anomaliesRes.status === "fulfilled" ? anomaliesRes.value : { total: null, items: [] },
        fraud: fraudRes.status === "fulfilled" ? fraudRes.value : { total: null, items: [] },
        healthScore: healthRes.status === "fulfilled" ? healthRes.value : null,
        analytics: analyticsRes.status === "fulfilled" ? analyticsRes.value : null,
      };
    }
  } catch {
    // Fall through to section fetches
  }

  try {
    const [
      kpiRes,
      forecastRes,
      costRes,
      deptRes,
      benchRes,
      anomaliesRes,
      fraudRes,
      healthRes,
      analyticsRes,
    ] = await Promise.allSettled([
      aiPayrollApi.getDashboardKpis(),
      aiPayrollApi.getForecast(),
      aiPayrollApi.getCostAnalysis(),
      aiPayrollApi.getCostByDepartment(),
      aiPayrollApi.getBenchmarking(),
      aiPayrollApi.getAnomalies(),
      aiPayrollApi.getFraudDetection(),
      aiPayrollApi.getHealthScore(),
      aiPayrollApi.getAnalytics(),
    ]);

    const data: AIPayrollDashboardData = {
      dashboard: kpiRes.status === "fulfilled" ? kpiRes.value : null,
      forecast: forecastRes.status === "fulfilled" ? forecastRes.value : null,
      costAnalysis: costRes.status === "fulfilled" ? costRes.value : null,
      costByDepartment: deptRes.status === "fulfilled" ? deptRes.value : null,
      benchmarking: benchRes.status === "fulfilled" ? benchRes.value : { total: null, items: [] },
      anomalies:
        anomaliesRes.status === "fulfilled" ? anomaliesRes.value : { total: null, items: [] },
      fraud: fraudRes.status === "fulfilled" ? fraudRes.value : { total: null, items: [] },
      healthScore: healthRes.status === "fulfilled" ? healthRes.value : null,
      analytics: analyticsRes.status === "fulfilled" ? analyticsRes.value : null,
    };

    if (!hasAnyPayrollData(data)) {
      return thunkAPI.rejectWithValue("Failed to load AI Payroll Insights data");
    }

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load AI Payroll Insights data"));
  }
});

export const generateAIPayrollForecast = createAsyncThunk<
  PayrollForecastData | null,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPayroll/generateForecast", async (payload, thunkAPI) => {
  try {
    return await aiPayrollApi.generateForecast(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to generate payroll forecast"));
  }
});

export const analyzeAIPayroll = createAsyncThunk<
  unknown,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPayroll/analyze", async (payload, thunkAPI) => {
  try {
    return await aiPayrollApi.analyze(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to run payroll analysis"));
  }
});

export const detectAIPayrollAnomalies = createAsyncThunk<
  PayrollAnomaliesData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPayroll/detectAnomalies", async (payload, thunkAPI) => {
  try {
    return await aiPayrollApi.detectAnomalies(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to detect payroll anomalies"));
  }
});

export const detectAIPayrollFraud = createAsyncThunk<
  PayrollFraudData,
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("aiPayroll/detectFraud", async (payload, thunkAPI) => {
  try {
    return await aiPayrollApi.detectFraud(payload ?? {});
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to detect payroll fraud"));
  }
});

export const fetchAIEmployeePayroll = createAsyncThunk<
  EmployeePayrollProfile | null,
  string,
  { rejectValue: string }
>("aiPayroll/fetchEmployee", async (employeeId, thunkAPI) => {
  try {
    return await aiPayrollApi.getEmployeeProfile(employeeId);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load employee payroll profile"));
  }
});
