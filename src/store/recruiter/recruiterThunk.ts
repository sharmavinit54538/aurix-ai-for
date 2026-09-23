import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import recruiterApi from "@/services/recruiterApi";
import type {
  CandidateFunnelItem,
  JdMatchDistributionItem,
  RecruiterDashboardData,
  RecruiterKpiItem,
} from "./recruiterTypes";

export const fetchRecruiterDashboard = createAsyncThunk<
  RecruiterDashboardData,
  void,
  { rejectValue: string }
>("aiRecruiter/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await recruiterApi.getDashboard();
  } catch (err) {
    try {
      const [kpiRes, funnelRes, distRes] = await Promise.allSettled([
        recruiterApi.getKpi(),
        recruiterApi.getFunnel(),
        recruiterApi.getDistribution(),
      ]);

      const candidateFunnel = funnelRes.status === "fulfilled" ? funnelRes.value : undefined;
      const jdMatchDistribution = distRes.status === "fulfilled" ? distRes.value : undefined;

      const dashboardData: RecruiterDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        candidateFunnel,
        jdMatchDistribution,
        charts: {
          candidateFunnel: candidateFunnel ?? [],
          jdMatchDistribution: jdMatchDistribution ?? [],
        },
      };

      const hasData = [kpiRes, funnelRes, distRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load recruiter dashboard data"),
        );
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load recruiter dashboard data"),
      );
    }
  }
});

export const fetchRecruiterKpi = createAsyncThunk<
  RecruiterKpiItem[],
  void,
  { rejectValue: string }
>("aiRecruiter/fetchKpi", async (_, thunkAPI) => {
  try {
    return await recruiterApi.getKpi();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load recruiter KPI metrics"),
    );
  }
});

export const fetchCandidateFunnel = createAsyncThunk<
  CandidateFunnelItem[],
  void,
  { rejectValue: string }
>("aiRecruiter/fetchFunnel", async (_, thunkAPI) => {
  try {
    return await recruiterApi.getFunnel();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load candidate funnel"),
    );
  }
});

export const fetchJdMatchDistribution = createAsyncThunk<
  JdMatchDistributionItem[],
  void,
  { rejectValue: string }
>("aiRecruiter/fetchDistribution", async (_, thunkAPI) => {
  try {
    return await recruiterApi.getDistribution();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load JD match distribution"),
    );
  }
});
