import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAIHubState = (state: RootState) => state.aiHub;

// ── 1. Overview & Agents Selectors ───────────────────────────────
export const selectAIHubOverview = createSelector(
  [selectAIHubState],
  (state) => state.overview,
);

export const selectAIHubOverviewData = createSelector(
  [selectAIHubState],
  (state) => state.overview.data,
);

export const selectAIHubOverviewLoading = createSelector(
  [selectAIHubState],
  (state) => state.overview.loading,
);

export const selectAIHubOverviewError = createSelector(
  [selectAIHubState],
  (state) => state.overview.error,
);

export const selectAIAgents = createSelector(
  [selectAIHubState],
  (state) => state.agents,
);

export const selectAIAgentsData = createSelector(
  [selectAIHubState],
  (state) => state.agents.data ?? [],
);

export const selectAIAgentsLoading = createSelector(
  [selectAIHubState],
  (state) => state.agents.loading,
);

export const selectSelectedAgent = createSelector(
  [selectAIHubState],
  (state) => state.selectedAgent,
);

export const selectAIAgentDetails = createSelector(
  [selectAIHubState],
  (state) => state.agentDetails,
);

export const selectAIAgentHistory = createSelector(
  [selectAIHubState],
  (state) => state.agentHistory,
);

export const selectAIAgentStatus = createSelector(
  [selectAIHubState],
  (state) => state.agentStatus,
);

// ── 2. Domain Module Selectors ───────────────────────────────────
export const selectWorkforceInsights = createSelector(
  [selectAIHubState],
  (state) => state.workforceInsights,
);

export const selectRecruiter = createSelector(
  [selectAIHubState],
  (state) => state.recruiter,
);

export const selectAttendanceMonitor = createSelector(
  [selectAIHubState],
  (state) => state.attendanceMonitor,
);

export const selectLeaveAssistant = createSelector(
  [selectAIHubState],
  (state) => state.leaveAssistant,
);

export const selectPerformanceCoach = createSelector(
  [selectAIHubState],
  (state) => state.performanceCoach,
);

export const selectPayrollInsights = createSelector(
  [selectAIHubState],
  (state) => state.payrollInsights,
);

export const selectWorkforcePlanning = createSelector(
  [selectAIHubState],
  (state) => state.workforcePlanning,
);

export const selectEmployeeHealth = createSelector(
  [selectAIHubState],
  (state) => state.employeeHealth,
);

export const selectPolicyAssistant = createSelector(
  [selectAIHubState],
  (state) => state.policyAssistant,
);

export const selectDocumentGenerator = createSelector(
  [selectAIHubState],
  (state) => state.documentGenerator,
);

export const selectMeetingIntelligence = createSelector(
  [selectAIHubState],
  (state) => state.meetingIntelligence,
);

export const selectComplianceMonitor = createSelector(
  [selectAIHubState],
  (state) => state.complianceMonitor,
);

export const selectChatAssistant = createSelector(
  [selectAIHubState],
  (state) => state.chatAssistant,
);

export const selectAnalyticsCenter = createSelector(
  [selectAIHubState],
  (state) => state.analyticsCenter,
);

// ── 3. Operation Selectors ───────────────────────────────────────
export const selectAIHubOperationLoading = (opKey: string) => (state: RootState) =>
  Boolean(state.aiHub?.operationLoading?.[opKey]);

export const selectAIHubOperationError = (opKey: string) => (state: RootState) =>
  state.aiHub?.operationErrors?.[opKey] ?? null;

export const selectAIHubOperationSuccess = (opKey: string) => (state: RootState) =>
  Boolean(state.aiHub?.operationSuccess?.[opKey]);
