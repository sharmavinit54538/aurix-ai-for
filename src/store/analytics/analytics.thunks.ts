import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "@/api/utils";
import analyticsApi from "@/services/analytics.api";
import type {
  AnalyticsOverview,
  AnalyticsSummary,
  AnalyzeBurnoutPayload,
  AnalyzePredictivePayload,
  AnalyzeSalaryPayload,
  AnalyzeSentimentPayload,
  AttritionPrediction,
  BurnoutRiskInsight,
  ComplianceMetrics,
  ExportReportPayload,
  GenerateReportPayload,
  HeadcountMetrics,
  PaginationParams,
  PayrollCostMetrics,
  PredictAttritionPayload,
  PredictiveInsight,
  Report,
  ReportRequest,
  ReportResult,
  SalaryBenchmark,
  SentimentInsight,
  TurnoverMetrics,
} from "./analytics.types";

/**
 * Normalizes API errors into user-friendly error messages with status code recognition.
 */
export function getAnalyticsThunkErrorMessage(err: unknown, fallbackMessage: string): string {
  const parsed = parseApiError(err, fallbackMessage);
  const msg = parsed.message;

  if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) {
    switch (parsed.status) {
      case 400:
        return "Invalid request parameters. Please verify your query.";
      case 401:
        return "Authentication required. Please log in to view analytics.";
      case 403:
        return "Access denied. You lack permissions for this analytics report.";
      case 404:
        return "The requested report or analytics resource was not found.";
      case 409:
        return "Conflict detected while processing the analytics report.";
      case 422:
        return "Validation failed on the analytics parameters.";
      case 429:
        return "Too many requests. Please wait a moment before generating more reports.";
      case 500:
      default:
        return fallbackMessage || "Internal analytics service error. Please try again later.";
    }
  }

  return msg;
}

// ── 1. Overview & Summary Thunks ──────────────────────────────────

export const fetchAnalyticsOverview = createAsyncThunk<AnalyticsOverview, void, { rejectValue: string }>(
  "analytics/fetchAnalyticsOverview",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getOverview();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load analytics overview"));
    }
  },
);

export const fetchAnalyticsSummary = createAsyncThunk<AnalyticsSummary, void, { rejectValue: string }>(
  "analytics/fetchAnalyticsSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getSummary();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load analytics summary"));
    }
  },
);

// ── 2. Reports Engine Thunks ──────────────────────────────────────

export const fetchReports = createAsyncThunk<Report[], PaginationParams | undefined, { rejectValue: string }>(
  "analytics/fetchReports",
  async (params, { rejectWithValue }) => {
    try {
      return await analyticsApi.getReports(params);
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load reports"));
    }
  },
);

export const fetchReportById = createAsyncThunk<Report, string, { rejectValue: string }>(
  "analytics/fetchReportById",
  async (reportId, { rejectWithValue }) => {
    try {
      return await analyticsApi.getReportById(reportId);
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, `Failed to load report ${reportId}`));
    }
  },
);

export const createReport = createAsyncThunk<Report, ReportRequest, { rejectValue: string }>(
  "analytics/createReport",
  async (payload, { rejectWithValue }) => {
    try {
      return await analyticsApi.createReport(payload);
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to create report"));
    }
  },
);

export const updateReport = createAsyncThunk<
  Report,
  { reportId: string; payload: Partial<ReportRequest> },
  { rejectValue: string }
>("analytics/updateReport", async ({ reportId, payload }, { rejectWithValue }) => {
  try {
    return await analyticsApi.updateReport(reportId, payload);
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to update report"));
  }
});

export const deleteReport = createAsyncThunk<{ success: boolean; id: string }, string, { rejectValue: string }>(
  "analytics/deleteReport",
  async (reportId, { rejectWithValue }) => {
    try {
      return await analyticsApi.deleteReport(reportId);
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to delete report"));
    }
  },
);

export const generateReport = createAsyncThunk<ReportResult, GenerateReportPayload, { rejectValue: string }>(
  "analytics/generateReport",
  async (payload, { rejectWithValue }) => {
    try {
      return await analyticsApi.generateReport(payload);
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to generate report"));
    }
  },
);

export const exportReport = createAsyncThunk<
  { success: boolean; reportId: string },
  ExportReportPayload,
  { rejectValue: string }
>("analytics/exportReport", async ({ reportId, format }, { rejectWithValue }) => {
  try {
    await analyticsApi.exportReport(reportId, format);
    return { success: true, reportId };
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to export report"));
  }
});

// ── 3. Core HR Metrics Thunks ─────────────────────────────────────

export const fetchHeadcountMetrics = createAsyncThunk<HeadcountMetrics, void, { rejectValue: string }>(
  "analytics/fetchHeadcountMetrics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getHeadcountMetrics();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load headcount metrics"));
    }
  },
);

export const fetchPayrollCostMetrics = createAsyncThunk<PayrollCostMetrics, void, { rejectValue: string }>(
  "analytics/fetchPayrollCostMetrics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getPayrollCostMetrics();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load payroll cost metrics"));
    }
  },
);

export const fetchTurnoverMetrics = createAsyncThunk<TurnoverMetrics, void, { rejectValue: string }>(
  "analytics/fetchTurnoverMetrics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getTurnoverMetrics();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load turnover metrics"));
    }
  },
);

export const fetchComplianceMetrics = createAsyncThunk<ComplianceMetrics, void, { rejectValue: string }>(
  "analytics/fetchComplianceMetrics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getComplianceMetrics();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load compliance metrics"));
    }
  },
);

// ── 4. AI Predictive Analytics Thunks ─────────────────────────────

export const fetchPredictiveInsights = createAsyncThunk<PredictiveInsight[], void, { rejectValue: string }>(
  "analytics/fetchPredictiveInsights",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getPredictiveInsights();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load predictive insights"));
    }
  },
);

export const analyzePredictiveInsights = createAsyncThunk<
  PredictiveInsight[],
  AnalyzePredictivePayload | undefined,
  { rejectValue: string }
>("analytics/analyzePredictiveInsights", async (payload, { rejectWithValue }) => {
  try {
    return await analyticsApi.analyzePredictiveInsights(payload);
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to analyze predictive insights"));
  }
});

export const fetchAttritionAnalytics = createAsyncThunk<AttritionPrediction, void, { rejectValue: string }>(
  "analytics/fetchAttritionAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getAttritionAnalytics();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load attrition analytics"));
    }
  },
);

export const predictAttrition = createAsyncThunk<
  AttritionPrediction,
  PredictAttritionPayload | undefined,
  { rejectValue: string }
>("analytics/predictAttrition", async (payload, { rejectWithValue }) => {
  try {
    return await analyticsApi.predictAttrition(payload);
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to run attrition prediction"));
  }
});

export const fetchSentimentAnalytics = createAsyncThunk<SentimentInsight, void, { rejectValue: string }>(
  "analytics/fetchSentimentAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getSentimentAnalytics();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load sentiment analytics"));
    }
  },
);

export const analyzeSentiment = createAsyncThunk<
  SentimentInsight,
  AnalyzeSentimentPayload | undefined,
  { rejectValue: string }
>("analytics/analyzeSentiment", async (payload, { rejectWithValue }) => {
  try {
    return await analyticsApi.analyzeSentiment(payload);
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to analyze sentiment data"));
  }
});

export const fetchBurnoutRisk = createAsyncThunk<BurnoutRiskInsight, void, { rejectValue: string }>(
  "analytics/fetchBurnoutRisk",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getBurnoutRisk();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load burnout risk insights"));
    }
  },
);

export const analyzeBurnoutRisk = createAsyncThunk<
  BurnoutRiskInsight,
  AnalyzeBurnoutPayload | undefined,
  { rejectValue: string }
>("analytics/analyzeBurnoutRisk", async (payload, { rejectWithValue }) => {
  try {
    return await analyticsApi.analyzeBurnoutRisk(payload);
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to analyze burnout risk"));
  }
});

export const fetchSalaryBenchmarks = createAsyncThunk<SalaryBenchmark[], void, { rejectValue: string }>(
  "analytics/fetchSalaryBenchmarks",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsApi.getSalaryBenchmarks();
    } catch (err) {
      return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to load salary benchmarks"));
    }
  },
);

export const analyzeSalaryBenchmarks = createAsyncThunk<
  SalaryBenchmark[],
  AnalyzeSalaryPayload | undefined,
  { rejectValue: string }
>("analytics/analyzeSalaryBenchmarks", async (payload, { rejectWithValue }) => {
  try {
    return await analyticsApi.analyzeSalaryBenchmarks(payload);
  } catch (err) {
    return rejectWithValue(getAnalyticsThunkErrorMessage(err, "Failed to run salary benchmarks analysis"));
  }
});
