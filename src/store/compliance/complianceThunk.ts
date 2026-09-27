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
    // If dashboard endpoint fails, retry getDashboard once or fall back to getRisks alone
    try {
      return await complianceApi.getDashboard();
    } catch {
      try {
        const risks = await complianceApi.getRisks();
        if (risks && risks.length > 0) {
          return {
            risksByCategory: risks,
            charts: {
              complianceTrend: [],
              risksByCategory: risks,
            },
          };
        }
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load compliance dashboard data"),
        );
      } catch {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load compliance dashboard data"),
        );
      }
    }
  }
});

export const fetchComplianceKpi = createAsyncThunk<ComplianceKpiItem[], void, { rejectValue: string }>(
  "compliance/fetchKpi",
  async (_, thunkAPI) => {
    try {
      const data = await complianceApi.getDashboard();
      return data.kpi ?? [];
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
      const data = await complianceApi.getDashboard();
      return data.charts?.complianceTrend ?? data.complianceTrend ?? [];
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to load compliance trend"));
    }
  },
);
