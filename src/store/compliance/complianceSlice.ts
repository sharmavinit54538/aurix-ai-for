import { createSlice } from "@reduxjs/toolkit";
import {
  fetchComplianceReport,
  detectPolicyViolations,
  queryPolicyAssistant,
} from "./complianceThunk";

export interface ComplianceReportData {
  complianceScore: number;
  openRisks: number;
  missingDocs: number;
  auditReadiness: string;
  [key: string]: any;
}

export interface PolicyViolationData {
  violations: Array<any>;
  [key: string]: any;
}

export interface PolicyAssistantResponse {
  answer: string;
  [key: string]: any;
}

interface ComplianceState {
  report: {
    data: ComplianceReportData | null;
    loading: boolean;
    error: string | null;
  };
  violations: {
    data: PolicyViolationData | null;
    loading: boolean;
    error: string | null;
  };
  assistant: {
    data: PolicyAssistantResponse | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: ComplianceState = {
  report: {
    data: null,
    loading: false,
    error: null,
  },
  violations: {
    data: null,
    loading: false,
    error: null,
  },
  assistant: {
    data: null,
    loading: false,
    error: null,
  },
};

const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Compliance Report
    builder.addCase(fetchComplianceReport.pending, (state) => {
      state.report.loading = true;
      state.report.error = null;
    });
    builder.addCase(fetchComplianceReport.fulfilled, (state, action) => {
      state.report.loading = false;
      state.report.data = action.payload;
    });
    builder.addCase(fetchComplianceReport.rejected, (state, action) => {
      state.report.loading = false;
      state.report.error = action.error.message || "Failed to fetch compliance report";
    });

    // Policy Violations
    builder.addCase(detectPolicyViolations.pending, (state) => {
      state.violations.loading = true;
      state.violations.error = null;
    });
    builder.addCase(detectPolicyViolations.fulfilled, (state, action) => {
      state.violations.loading = false;
      state.violations.data = action.payload;
    });
    builder.addCase(detectPolicyViolations.rejected, (state, action) => {
      state.violations.loading = false;
      state.violations.error = action.error.message || "Failed to detect policy violations";
    });

    // Policy Assistant
    builder.addCase(queryPolicyAssistant.pending, (state) => {
      state.assistant.loading = true;
      state.assistant.error = null;
    });
    builder.addCase(queryPolicyAssistant.fulfilled, (state, action) => {
      state.assistant.loading = false;
      state.assistant.data = action.payload;
    });
    builder.addCase(queryPolicyAssistant.rejected, (state, action) => {
      state.assistant.loading = false;
      state.assistant.error = action.error.message || "Failed to query policy assistant";
    });
  },
});

export default complianceSlice.reducer;
