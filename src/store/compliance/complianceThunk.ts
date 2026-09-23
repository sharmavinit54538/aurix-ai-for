import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import complianceApi from "@/services/complianceApi";
import type {
  ComplianceDashboardData,
  ComplianceKpiItem,
  ComplianceTrendItem,
  RiskByCategoryItem,
} from "./complianceTypes";

export const fetchComplianceDashboard = createAsyncThunk<
  ComplianceDashboardData,
  void,
  { rejectValue: string }
>("compliance/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await complianceApi.getDashboard();
  } catch (err) {
    // If combined dashboard endpoint fails, attempt to fetch individual sections in parallel
    try {
      const [kpiRes, risksRes, trendRes] = await Promise.allSettled([
        complianceApi.getKpi(),
        complianceApi.getRisks(),
        complianceApi.getTrend(),
      ]);

      const dashboardData: ComplianceDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        risksByCategory: risksRes.status === "fulfilled" ? risksRes.value : undefined,
        complianceTrend: trendRes.status === "fulfilled" ? trendRes.value : undefined,
        charts: {
          complianceTrend: trendRes.status === "fulfilled" ? trendRes.value : [],
          risksByCategory: risksRes.status === "fulfilled" ? risksRes.value : [],
        },
      };

      const hasData = [kpiRes, risksRes, trendRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load compliance dashboard data"));
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load compliance dashboard data"));
    }
  }
});

export const fetchComplianceKpi = createAsyncThunk<ComplianceKpiItem[], void, { rejectValue: string }>(
  "compliance/fetchKpi",
  async (_, thunkAPI) => {
    try {
      return await complianceApi.getKpi();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load compliance KPI metrics"));
    }
  },
);

export const fetchComplianceRisks = createAsyncThunk<RiskByCategoryItem[], void, { rejectValue: string }>(
  "compliance/fetchRisks",
  async (_, thunkAPI) => {
    try {
      return await complianceApi.getRisks();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load compliance risks"));
    }
  },
);

export const fetchComplianceTrend = createAsyncThunk<ComplianceTrendItem[], void, { rejectValue: string }>(
  "compliance/fetchTrend",
  async (_, thunkAPI) => {
    try {
      return await complianceApi.getTrend();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load compliance trend"));
    }
  },
);
