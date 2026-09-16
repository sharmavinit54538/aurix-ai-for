import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AIAgent, AIHubState, SectionState } from "./aiHub.types";
import {
  analyzeAnalytics,
  analyzeAttendance,
  analyzeEmployeeHealth,
  analyzeLeavePatterns,
  analyzeMeeting,
  analyzePayroll,
  analyzeWorkforceInsights,
  askPolicyAssistant,
  checkPolicyCompliance,
  createChatConversation,
  deleteChatConversation,
  fetchAIAgentDetails,
  fetchAIAgentHistory,
  fetchAIAgentStatus,
  fetchAIAgents,
  fetchAIHubOverview,
  fetchAnalyticsCenter,
  fetchAttendanceAnomalies,
  fetchAttendanceMonitor,
  fetchAttritionAnalytics,
  fetchChatConversation,
  fetchChatConversations,
  fetchComplianceChecklist,
  fetchComplianceMonitor,
  fetchComplianceScore,
  fetchDiversityAnalytics,
  fetchDocumentGenerator,
  fetchDocumentTemplates,
  fetchEmployeeHealth,
  fetchExecutiveSummary,
  fetchLeaveAssistant,
  fetchMeetingActionItems,
  fetchMeetingIntelligence,
  fetchPayrollAnomalies,
  fetchPayrollInsights,
  fetchPerformanceCoach,
  fetchPolicyAssistant,
  fetchRecruiterInsights,
  fetchWellnessInsights,
  fetchWorkforceInsights,
  fetchWorkforcePlanning,
  forecastHeadcount,
  forecastLeaves,
  forecastWorkforce,
  generateDocument,
  generateInterviewQuestions,
  generatePerformanceGoals,
  generateTrainingRecommendations,
  matchCandidates,
  previewDocument,
  runAIAgent,
  runTaxAudit,
  scanCompliance,
  screenResumes,
  sendChatMessage,
  submitAIAgentFeedback,
  summarizeMeeting,
} from "./aiHub.thunks";

function createInitialSectionState<T>(data: T | null = null): SectionState<T> {
  return {
    data,
    loading: false,
    error: null,
    success: false,
    lastUpdated: null,
  };
}

const initialState: AIHubState = {
  overview: createInitialSectionState(),
  agents: createInitialSectionState([]),
  selectedAgent: null,
  agentDetails: createInitialSectionState(),
  agentHistory: createInitialSectionState([]),
  agentStatus: createInitialSectionState(),
  workforceInsights: createInitialSectionState([]),
  recruiter: createInitialSectionState([]),
  attendanceMonitor: createInitialSectionState({
    anomaliesCount: 0,
    onTimeRate: 0,
    averageLateMinutes: 0,
    anomalies: [],
  }),
  leaveAssistant: createInitialSectionState({
    pendingApprovals: 0,
  }),
  performanceCoach: createInitialSectionState({
    coachingSessionsCount: 0,
    goalsGeneratedCount: 0,
    recommendationsCount: 0,
    goals: [],
    trainingRecommendations: [],
  }),
  payrollInsights: createInitialSectionState({
    cycle: "Current",
    totalVariance: 0,
    variancePercentage: 0,
    anomaliesDetected: 0,
    taxAuditFlags: 0,
    summary: "",
  }),
  workforcePlanning: createInitialSectionState({
    currentHeadcount: 0,
    forecast: {
      horizonMonths: 12,
      projectedHeadcount: 0,
      projectedCost: 0,
    },
  }),
  employeeHealth: createInitialSectionState({
    burnoutRiskIndex: 0,
    wellnessScore: 0,
    sentimentScore: 0,
    trend: 0,
  }),
  policyAssistant: createInitialSectionState({
    queriesCount: 0,
    complianceRate: 100,
    recentQueries: [],
  }),
  documentGenerator: createInitialSectionState({
    templatesCount: 0,
    documentsGeneratedCount: 0,
    templates: [],
    recentDocuments: [],
  }),
  meetingIntelligence: createInitialSectionState({
    analyzedMeetingsCount: 0,
    actionItemsPendingCount: 0,
    recentSummaries: [],
    actionItems: [],
  }),
  complianceMonitor: createInitialSectionState({
    score: 100,
    status: "compliant",
    checklist: [],
  }),
  chatAssistant: createInitialSectionState({
    conversations: [],
    activeConversation: null,
    totalMessages: 0,
  }),
  analyticsCenter: createInitialSectionState({}),

  operationLoading: {},
  operationErrors: {},
  operationSuccess: {},
};

export const aiHubSlice = createSlice({
  name: "aiHub",
  initialState,
  reducers: {
    setSelectedAgent: (state, action: PayloadAction<AIAgent | null>) => {
      state.selectedAgent = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      if (state.chatAssistant.data) {
        state.chatAssistant.data.activeConversation =
          state.chatAssistant.data.conversations.find((c) => c.id === action.payload) || null;
      }
    },
    clearOperationStatus: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.operationLoading[key];
      delete state.operationErrors[key];
      delete state.operationSuccess[key];
    },
    resetAIHubState: () => initialState,
  },
  extraReducers: (builder) => {
    // ── 1. Overview & Agents ─────────────────────────────────────────
    builder
      .addCase(fetchAIHubOverview.pending, (state) => {
        state.overview.loading = true;
        state.overview.error = null;
      })
      .addCase(fetchAIHubOverview.fulfilled, (state, action) => {
        state.overview.loading = false;
        state.overview.data = action.payload;
        state.overview.success = true;
        state.overview.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIHubOverview.rejected, (state, action) => {
        state.overview.loading = false;
        state.overview.error = action.payload || "Failed to load overview";
        state.overview.success = false;
      })

      .addCase(fetchAIAgents.pending, (state) => {
        state.agents.loading = true;
        state.agents.error = null;
      })
      .addCase(fetchAIAgents.fulfilled, (state, action) => {
        state.agents.loading = false;
        state.agents.data = action.payload;
        state.agents.success = true;
        state.agents.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIAgents.rejected, (state, action) => {
        state.agents.loading = false;
        state.agents.error = action.payload || "Failed to load agents";
        state.agents.success = false;
      })

      .addCase(fetchAIAgentDetails.pending, (state) => {
        state.agentDetails.loading = true;
        state.agentDetails.error = null;
      })
      .addCase(fetchAIAgentDetails.fulfilled, (state, action) => {
        state.agentDetails.loading = false;
        state.agentDetails.data = action.payload;
        state.agentDetails.success = true;
        state.agentDetails.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIAgentDetails.rejected, (state, action) => {
        state.agentDetails.loading = false;
        state.agentDetails.error = action.payload || "Failed to load agent details";
        state.agentDetails.success = false;
      });

    // ── 2. Common Agent Operations ──────────────────────────────────
    builder
      .addCase(runAIAgent.pending, (state) => {
        state.operationLoading["runAIAgent"] = true;
        state.operationErrors["runAIAgent"] = null;
        state.operationSuccess["runAIAgent"] = false;
      })
      .addCase(runAIAgent.fulfilled, (state, action) => {
        state.operationLoading["runAIAgent"] = false;
        state.operationSuccess["runAIAgent"] = true;
        // Optionally update overview counters
        if (state.overview.data) {
          state.overview.data.tasksCompleted += 1;
        }
        if (state.agentStatus.data && state.agentStatus.data.agentId === action.payload.agentId) {
          state.agentStatus.data.status = action.payload.status || "idle";
        }
      })
      .addCase(runAIAgent.rejected, (state, action) => {
        state.operationLoading["runAIAgent"] = false;
        state.operationErrors["runAIAgent"] = action.payload || "Agent run failed";
        state.operationSuccess["runAIAgent"] = false;
      })

      .addCase(fetchAIAgentHistory.pending, (state) => {
        state.agentHistory.loading = true;
        state.agentHistory.error = null;
      })
      .addCase(fetchAIAgentHistory.fulfilled, (state, action) => {
        state.agentHistory.loading = false;
        state.agentHistory.data = action.payload;
        state.agentHistory.success = true;
        state.agentHistory.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIAgentHistory.rejected, (state, action) => {
        state.agentHistory.loading = false;
        state.agentHistory.error = action.payload || "Failed to load agent history";
        state.agentHistory.success = false;
      })

      .addCase(fetchAIAgentStatus.pending, (state) => {
        state.agentStatus.loading = true;
        state.agentStatus.error = null;
      })
      .addCase(fetchAIAgentStatus.fulfilled, (state, action) => {
        state.agentStatus.loading = false;
        state.agentStatus.data = action.payload;
        state.agentStatus.success = true;
        state.agentStatus.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIAgentStatus.rejected, (state, action) => {
        state.agentStatus.loading = false;
        state.agentStatus.error = action.payload || "Failed to fetch agent status";
        state.agentStatus.success = false;
      })

      .addCase(submitAIAgentFeedback.pending, (state) => {
        state.operationLoading["submitAIAgentFeedback"] = true;
        state.operationErrors["submitAIAgentFeedback"] = null;
      })
      .addCase(submitAIAgentFeedback.fulfilled, (state) => {
        state.operationLoading["submitAIAgentFeedback"] = false;
        state.operationSuccess["submitAIAgentFeedback"] = true;
      })
      .addCase(submitAIAgentFeedback.rejected, (state, action) => {
        state.operationLoading["submitAIAgentFeedback"] = false;
        state.operationErrors["submitAIAgentFeedback"] =
          action.payload || "Feedback submission failed";
      });

    // ── 3. Workforce Insights ────────────────────────────────────────
    builder
      .addCase(fetchWorkforceInsights.pending, (state) => {
        state.workforceInsights.loading = true;
        state.workforceInsights.error = null;
      })
      .addCase(fetchWorkforceInsights.fulfilled, (state, action) => {
        state.workforceInsights.loading = false;
        state.workforceInsights.data = action.payload;
        state.workforceInsights.success = true;
        state.workforceInsights.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWorkforceInsights.rejected, (state, action) => {
        state.workforceInsights.loading = false;
        state.workforceInsights.error = action.payload || "Failed to load workforce insights";
        state.workforceInsights.success = false;
      })

      .addCase(analyzeWorkforceInsights.pending, (state) => {
        state.operationLoading["analyzeWorkforceInsights"] = true;
        state.operationErrors["analyzeWorkforceInsights"] = null;
      })
      .addCase(analyzeWorkforceInsights.fulfilled, (state, action) => {
        state.operationLoading["analyzeWorkforceInsights"] = false;
        state.operationSuccess["analyzeWorkforceInsights"] = true;
        state.workforceInsights.data = action.payload;
        state.workforceInsights.lastUpdated = new Date().toISOString();
      })
      .addCase(analyzeWorkforceInsights.rejected, (state, action) => {
        state.operationLoading["analyzeWorkforceInsights"] = false;
        state.operationErrors["analyzeWorkforceInsights"] =
          action.payload || "Workforce analysis failed";
      });

    // ── 4. Recruiter ─────────────────────────────────────────────────
    builder
      .addCase(fetchRecruiterInsights.pending, (state) => {
        state.recruiter.loading = true;
        state.recruiter.error = null;
      })
      .addCase(fetchRecruiterInsights.fulfilled, (state, action) => {
        state.recruiter.loading = false;
        state.recruiter.data = action.payload;
        state.recruiter.success = true;
        state.recruiter.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRecruiterInsights.rejected, (state, action) => {
        state.recruiter.loading = false;
        state.recruiter.error = action.payload || "Failed to load recruiter insights";
        state.recruiter.success = false;
      })

      .addCase(screenResumes.pending, (state) => {
        state.operationLoading["screenResumes"] = true;
        state.operationErrors["screenResumes"] = null;
      })
      .addCase(screenResumes.fulfilled, (state, action) => {
        state.operationLoading["screenResumes"] = false;
        state.operationSuccess["screenResumes"] = true;
        state.recruiter.data = action.payload;
      })
      .addCase(screenResumes.rejected, (state, action) => {
        state.operationLoading["screenResumes"] = false;
        state.operationErrors["screenResumes"] = action.payload || "Screen resumes failed";
      })

      .addCase(matchCandidates.pending, (state) => {
        state.operationLoading["matchCandidates"] = true;
        state.operationErrors["matchCandidates"] = null;
      })
      .addCase(matchCandidates.fulfilled, (state, action) => {
        state.operationLoading["matchCandidates"] = false;
        state.operationSuccess["matchCandidates"] = true;
        state.recruiter.data = action.payload;
      })
      .addCase(matchCandidates.rejected, (state, action) => {
        state.operationLoading["matchCandidates"] = false;
        state.operationErrors["matchCandidates"] = action.payload || "Candidate matching failed";
      })

      .addCase(generateInterviewQuestions.pending, (state) => {
        state.operationLoading["generateInterviewQuestions"] = true;
        state.operationErrors["generateInterviewQuestions"] = null;
      })
      .addCase(generateInterviewQuestions.fulfilled, (state) => {
        state.operationLoading["generateInterviewQuestions"] = false;
        state.operationSuccess["generateInterviewQuestions"] = true;
      })
      .addCase(generateInterviewQuestions.rejected, (state, action) => {
        state.operationLoading["generateInterviewQuestions"] = false;
        state.operationErrors["generateInterviewQuestions"] =
          action.payload || "Question generation failed";
      });

    // ── 5. Attendance Monitor ────────────────────────────────────────
    builder
      .addCase(fetchAttendanceMonitor.pending, (state) => {
        state.attendanceMonitor.loading = true;
        state.attendanceMonitor.error = null;
      })
      .addCase(fetchAttendanceMonitor.fulfilled, (state, action) => {
        state.attendanceMonitor.loading = false;
        state.attendanceMonitor.data = action.payload;
        state.attendanceMonitor.success = true;
        state.attendanceMonitor.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAttendanceMonitor.rejected, (state, action) => {
        state.attendanceMonitor.loading = false;
        state.attendanceMonitor.error = action.payload || "Failed to load attendance monitor";
        state.attendanceMonitor.success = false;
      })

      .addCase(analyzeAttendance.pending, (state) => {
        state.operationLoading["analyzeAttendance"] = true;
        state.operationErrors["analyzeAttendance"] = null;
      })
      .addCase(analyzeAttendance.fulfilled, (state, action) => {
        state.operationLoading["analyzeAttendance"] = false;
        state.operationSuccess["analyzeAttendance"] = true;
        state.attendanceMonitor.data = action.payload;
      })
      .addCase(analyzeAttendance.rejected, (state, action) => {
        state.operationLoading["analyzeAttendance"] = false;
        state.operationErrors["analyzeAttendance"] = action.payload || "Attendance analysis failed";
      })

      .addCase(fetchAttendanceAnomalies.fulfilled, (state, action) => {
        if (state.attendanceMonitor.data) {
          state.attendanceMonitor.data.anomalies = action.payload;
        }
      });

    // ── 6. Leave Assistant ───────────────────────────────────────────
    builder
      .addCase(fetchLeaveAssistant.pending, (state) => {
        state.leaveAssistant.loading = true;
        state.leaveAssistant.error = null;
      })
      .addCase(fetchLeaveAssistant.fulfilled, (state, action) => {
        state.leaveAssistant.loading = false;
        state.leaveAssistant.data = action.payload;
        state.leaveAssistant.success = true;
        state.leaveAssistant.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchLeaveAssistant.rejected, (state, action) => {
        state.leaveAssistant.loading = false;
        state.leaveAssistant.error = action.payload || "Failed to load leave assistant";
        state.leaveAssistant.success = false;
      })

      .addCase(forecastLeaves.pending, (state) => {
        state.operationLoading["forecastLeaves"] = true;
        state.operationErrors["forecastLeaves"] = null;
      })
      .addCase(forecastLeaves.fulfilled, (state, action) => {
        state.operationLoading["forecastLeaves"] = false;
        state.operationSuccess["forecastLeaves"] = true;
        if (state.leaveAssistant.data) {
          state.leaveAssistant.data.forecast = action.payload;
        }
      })
      .addCase(forecastLeaves.rejected, (state, action) => {
        state.operationLoading["forecastLeaves"] = false;
        state.operationErrors["forecastLeaves"] = action.payload || "Leave forecast failed";
      })

      .addCase(analyzeLeavePatterns.fulfilled, (state, action) => {
        state.leaveAssistant.data = action.payload;
      });

    // ── 7. Performance Coach ─────────────────────────────────────────
    builder
      .addCase(fetchPerformanceCoach.pending, (state) => {
        state.performanceCoach.loading = true;
        state.performanceCoach.error = null;
      })
      .addCase(fetchPerformanceCoach.fulfilled, (state, action) => {
        state.performanceCoach.loading = false;
        state.performanceCoach.data = action.payload;
        state.performanceCoach.success = true;
        state.performanceCoach.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPerformanceCoach.rejected, (state, action) => {
        state.performanceCoach.loading = false;
        state.performanceCoach.error = action.payload || "Failed to load performance coach";
        state.performanceCoach.success = false;
      })

      .addCase(generatePerformanceGoals.pending, (state) => {
        state.operationLoading["generatePerformanceGoals"] = true;
        state.operationErrors["generatePerformanceGoals"] = null;
      })
      .addCase(generatePerformanceGoals.fulfilled, (state, action) => {
        state.operationLoading["generatePerformanceGoals"] = false;
        state.operationSuccess["generatePerformanceGoals"] = true;
        if (state.performanceCoach.data) {
          state.performanceCoach.data.goals = action.payload;
        }
      })
      .addCase(generatePerformanceGoals.rejected, (state, action) => {
        state.operationLoading["generatePerformanceGoals"] = false;
        state.operationErrors["generatePerformanceGoals"] =
          action.payload || "Goal generation failed";
      })

      .addCase(generateTrainingRecommendations.fulfilled, (state, action) => {
        if (state.performanceCoach.data) {
          state.performanceCoach.data.trainingRecommendations = action.payload;
        }
      });

    // ── 8. Payroll Insights ──────────────────────────────────────────
    builder
      .addCase(fetchPayrollInsights.pending, (state) => {
        state.payrollInsights.loading = true;
        state.payrollInsights.error = null;
      })
      .addCase(fetchPayrollInsights.fulfilled, (state, action) => {
        state.payrollInsights.loading = false;
        state.payrollInsights.data = action.payload;
        state.payrollInsights.success = true;
        state.payrollInsights.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPayrollInsights.rejected, (state, action) => {
        state.payrollInsights.loading = false;
        state.payrollInsights.error = action.payload || "Failed to load payroll insights";
        state.payrollInsights.success = false;
      })

      .addCase(analyzePayroll.pending, (state) => {
        state.operationLoading["analyzePayroll"] = true;
        state.operationErrors["analyzePayroll"] = null;
      })
      .addCase(analyzePayroll.fulfilled, (state, action) => {
        state.operationLoading["analyzePayroll"] = false;
        state.operationSuccess["analyzePayroll"] = true;
        state.payrollInsights.data = action.payload;
      })
      .addCase(analyzePayroll.rejected, (state, action) => {
        state.operationLoading["analyzePayroll"] = false;
        state.operationErrors["analyzePayroll"] = action.payload || "Payroll analysis failed";
      })

      .addCase(fetchPayrollAnomalies.fulfilled, (state, action) => {
        if (state.payrollInsights.data) {
          state.payrollInsights.data.anomalies = action.payload;
        }
      })

      .addCase(runTaxAudit.pending, (state) => {
        state.operationLoading["runTaxAudit"] = true;
        state.operationErrors["runTaxAudit"] = null;
      })
      .addCase(runTaxAudit.fulfilled, (state) => {
        state.operationLoading["runTaxAudit"] = false;
        state.operationSuccess["runTaxAudit"] = true;
      })
      .addCase(runTaxAudit.rejected, (state, action) => {
        state.operationLoading["runTaxAudit"] = false;
        state.operationErrors["runTaxAudit"] = action.payload || "Tax audit failed";
      });

    // ── 9. Workforce Planning ────────────────────────────────────────
    builder
      .addCase(fetchWorkforcePlanning.pending, (state) => {
        state.workforcePlanning.loading = true;
        state.workforcePlanning.error = null;
      })
      .addCase(fetchWorkforcePlanning.fulfilled, (state, action) => {
        state.workforcePlanning.loading = false;
        state.workforcePlanning.data = action.payload;
        state.workforcePlanning.success = true;
        state.workforcePlanning.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWorkforcePlanning.rejected, (state, action) => {
        state.workforcePlanning.loading = false;
        state.workforcePlanning.error = action.payload || "Failed to load workforce planning";
        state.workforcePlanning.success = false;
      })

      .addCase(forecastWorkforce.pending, (state) => {
        state.operationLoading["forecastWorkforce"] = true;
        state.operationErrors["forecastWorkforce"] = null;
      })
      .addCase(forecastWorkforce.fulfilled, (state, action) => {
        state.operationLoading["forecastWorkforce"] = false;
        state.operationSuccess["forecastWorkforce"] = true;
        if (state.workforcePlanning.data) {
          state.workforcePlanning.data.forecast = action.payload;
        }
      })
      .addCase(forecastWorkforce.rejected, (state, action) => {
        state.operationLoading["forecastWorkforce"] = false;
        state.operationErrors["forecastWorkforce"] = action.payload || "Workforce forecast failed";
      })

      .addCase(forecastHeadcount.pending, (state) => {
        state.operationLoading["forecastHeadcount"] = true;
      })
      .addCase(forecastHeadcount.fulfilled, (state) => {
        state.operationLoading["forecastHeadcount"] = false;
        state.operationSuccess["forecastHeadcount"] = true;
      })
      .addCase(forecastHeadcount.rejected, (state, action) => {
        state.operationLoading["forecastHeadcount"] = false;
        state.operationErrors["forecastHeadcount"] = action.payload || "Headcount forecast failed";
      });

    // ── 10. Employee Health ──────────────────────────────────────────
    builder
      .addCase(fetchEmployeeHealth.pending, (state) => {
        state.employeeHealth.loading = true;
        state.employeeHealth.error = null;
      })
      .addCase(fetchEmployeeHealth.fulfilled, (state, action) => {
        state.employeeHealth.loading = false;
        state.employeeHealth.data = action.payload;
        state.employeeHealth.success = true;
        state.employeeHealth.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEmployeeHealth.rejected, (state, action) => {
        state.employeeHealth.loading = false;
        state.employeeHealth.error = action.payload || "Failed to load employee health";
        state.employeeHealth.success = false;
      })

      .addCase(analyzeEmployeeHealth.pending, (state) => {
        state.operationLoading["analyzeEmployeeHealth"] = true;
        state.operationErrors["analyzeEmployeeHealth"] = null;
      })
      .addCase(analyzeEmployeeHealth.fulfilled, (state, action) => {
        state.operationLoading["analyzeEmployeeHealth"] = false;
        state.operationSuccess["analyzeEmployeeHealth"] = true;
        state.employeeHealth.data = action.payload;
      })
      .addCase(analyzeEmployeeHealth.rejected, (state, action) => {
        state.operationLoading["analyzeEmployeeHealth"] = false;
        state.operationErrors["analyzeEmployeeHealth"] = action.payload || "Health analysis failed";
      })

      .addCase(fetchWellnessInsights.fulfilled, (state, action) => {
        if (state.employeeHealth.data) {
          state.employeeHealth.data.wellnessScore = action.payload.wellnessScore;
          state.employeeHealth.data.wellnessRecommendations = action.payload.recommendations;
        }
      });

    // ── 11. Policy Assistant ─────────────────────────────────────────
    builder
      .addCase(fetchPolicyAssistant.pending, (state) => {
        state.policyAssistant.loading = true;
        state.policyAssistant.error = null;
      })
      .addCase(fetchPolicyAssistant.fulfilled, (state, action) => {
        state.policyAssistant.loading = false;
        state.policyAssistant.data = action.payload;
        state.policyAssistant.success = true;
        state.policyAssistant.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPolicyAssistant.rejected, (state, action) => {
        state.policyAssistant.loading = false;
        state.policyAssistant.error = action.payload || "Failed to load policy assistant";
        state.policyAssistant.success = false;
      })

      .addCase(askPolicyAssistant.pending, (state) => {
        state.operationLoading["askPolicyAssistant"] = true;
        state.operationErrors["askPolicyAssistant"] = null;
      })
      .addCase(askPolicyAssistant.fulfilled, (state, action) => {
        state.operationLoading["askPolicyAssistant"] = false;
        state.operationSuccess["askPolicyAssistant"] = true;
        if (state.policyAssistant.data) {
          state.policyAssistant.data.queriesCount += 1;
          state.policyAssistant.data.recentQueries = [
            action.payload,
            ...(state.policyAssistant.data.recentQueries ?? []),
          ].slice(0, 10);
        }
      })
      .addCase(askPolicyAssistant.rejected, (state, action) => {
        state.operationLoading["askPolicyAssistant"] = false;
        state.operationErrors["askPolicyAssistant"] = action.payload || "Policy query failed";
      })

      .addCase(checkPolicyCompliance.pending, (state) => {
        state.operationLoading["checkPolicyCompliance"] = true;
      })
      .addCase(checkPolicyCompliance.fulfilled, (state) => {
        state.operationLoading["checkPolicyCompliance"] = false;
        state.operationSuccess["checkPolicyCompliance"] = true;
      })
      .addCase(checkPolicyCompliance.rejected, (state, action) => {
        state.operationLoading["checkPolicyCompliance"] = false;
        state.operationErrors["checkPolicyCompliance"] =
          action.payload || "Compliance check failed";
      });

    // ── 12. Document Generator ───────────────────────────────────────
    builder
      .addCase(fetchDocumentGenerator.pending, (state) => {
        state.documentGenerator.loading = true;
        state.documentGenerator.error = null;
      })
      .addCase(fetchDocumentGenerator.fulfilled, (state, action) => {
        state.documentGenerator.loading = false;
        state.documentGenerator.data = action.payload;
        state.documentGenerator.success = true;
        state.documentGenerator.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDocumentGenerator.rejected, (state, action) => {
        state.documentGenerator.loading = false;
        state.documentGenerator.error = action.payload || "Failed to load document generator";
        state.documentGenerator.success = false;
      })

      .addCase(fetchDocumentTemplates.fulfilled, (state, action) => {
        if (state.documentGenerator.data) {
          state.documentGenerator.data.templates = action.payload;
          state.documentGenerator.data.templatesCount = action.payload.length;
        }
      })

      .addCase(generateDocument.pending, (state) => {
        state.operationLoading["generateDocument"] = true;
        state.operationErrors["generateDocument"] = null;
      })
      .addCase(generateDocument.fulfilled, (state, action) => {
        state.operationLoading["generateDocument"] = false;
        state.operationSuccess["generateDocument"] = true;
        if (state.documentGenerator.data) {
          state.documentGenerator.data.documentsGeneratedCount += 1;
          state.documentGenerator.data.recentDocuments = [
            action.payload,
            ...(state.documentGenerator.data.recentDocuments ?? []),
          ];
        }
      })
      .addCase(generateDocument.rejected, (state, action) => {
        state.operationLoading["generateDocument"] = false;
        state.operationErrors["generateDocument"] = action.payload || "Document generation failed";
      })

      .addCase(previewDocument.pending, (state) => {
        state.operationLoading["previewDocument"] = true;
      })
      .addCase(previewDocument.fulfilled, (state) => {
        state.operationLoading["previewDocument"] = false;
        state.operationSuccess["previewDocument"] = true;
      })
      .addCase(previewDocument.rejected, (state, action) => {
        state.operationLoading["previewDocument"] = false;
        state.operationErrors["previewDocument"] = action.payload || "Document preview failed";
      });

    // ── 13. Meeting Intelligence ─────────────────────────────────────
    builder
      .addCase(fetchMeetingIntelligence.pending, (state) => {
        state.meetingIntelligence.loading = true;
        state.meetingIntelligence.error = null;
      })
      .addCase(fetchMeetingIntelligence.fulfilled, (state, action) => {
        state.meetingIntelligence.loading = false;
        state.meetingIntelligence.data = action.payload;
        state.meetingIntelligence.success = true;
        state.meetingIntelligence.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMeetingIntelligence.rejected, (state, action) => {
        state.meetingIntelligence.loading = false;
        state.meetingIntelligence.error = action.payload || "Failed to load meeting intelligence";
        state.meetingIntelligence.success = false;
      })

      .addCase(analyzeMeeting.pending, (state) => {
        state.operationLoading["analyzeMeeting"] = true;
        state.operationErrors["analyzeMeeting"] = null;
      })
      .addCase(analyzeMeeting.fulfilled, (state, action) => {
        state.operationLoading["analyzeMeeting"] = false;
        state.operationSuccess["analyzeMeeting"] = true;
        if (state.meetingIntelligence.data) {
          state.meetingIntelligence.data.analyzedMeetingsCount += 1;
          state.meetingIntelligence.data.recentSummaries = [
            action.payload,
            ...(state.meetingIntelligence.data.recentSummaries ?? []),
          ];
        }
      })
      .addCase(analyzeMeeting.rejected, (state, action) => {
        state.operationLoading["analyzeMeeting"] = false;
        state.operationErrors["analyzeMeeting"] = action.payload || "Meeting analysis failed";
      })

      .addCase(summarizeMeeting.fulfilled, (state) => {
        state.operationSuccess["summarizeMeeting"] = true;
      })

      .addCase(fetchMeetingActionItems.fulfilled, (state, action) => {
        if (state.meetingIntelligence.data) {
          state.meetingIntelligence.data.actionItems = action.payload;
          state.meetingIntelligence.data.actionItemsPendingCount = action.payload.filter(
            (i) => i.status !== "completed",
          ).length;
        }
      });

    // ── 14. Compliance Monitor ───────────────────────────────────────
    builder
      .addCase(fetchComplianceMonitor.pending, (state) => {
        state.complianceMonitor.loading = true;
        state.complianceMonitor.error = null;
      })
      .addCase(fetchComplianceMonitor.fulfilled, (state, action) => {
        state.complianceMonitor.loading = false;
        state.complianceMonitor.data = action.payload;
        state.complianceMonitor.success = true;
        state.complianceMonitor.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchComplianceMonitor.rejected, (state, action) => {
        state.complianceMonitor.loading = false;
        state.complianceMonitor.error = action.payload || "Failed to load compliance monitor";
        state.complianceMonitor.success = false;
      })

      .addCase(scanCompliance.pending, (state) => {
        state.operationLoading["scanCompliance"] = true;
        state.operationErrors["scanCompliance"] = null;
      })
      .addCase(scanCompliance.fulfilled, (state, action) => {
        state.operationLoading["scanCompliance"] = false;
        state.operationSuccess["scanCompliance"] = true;
        if (state.complianceMonitor.data) {
          state.complianceMonitor.data.score = action.payload.overallScore;
          state.complianceMonitor.data.status = action.payload.status;
          if (action.payload.checklist) {
            state.complianceMonitor.data.checklist = action.payload.checklist;
          }
        }
      })
      .addCase(scanCompliance.rejected, (state, action) => {
        state.operationLoading["scanCompliance"] = false;
        state.operationErrors["scanCompliance"] = action.payload || "Compliance scan failed";
      })

      .addCase(fetchComplianceChecklist.fulfilled, (state, action) => {
        if (state.complianceMonitor.data) {
          state.complianceMonitor.data.checklist = action.payload;
        }
      })

      .addCase(fetchComplianceScore.fulfilled, (state, action) => {
        if (state.complianceMonitor.data) {
          state.complianceMonitor.data.score = action.payload.score;
          state.complianceMonitor.data.status = action.payload.status;
        }
      });

    // ── 15. Chat Assistant ───────────────────────────────────────────
    builder
      .addCase(fetchChatConversations.pending, (state) => {
        state.chatAssistant.loading = true;
        state.chatAssistant.error = null;
      })
      .addCase(fetchChatConversations.fulfilled, (state, action) => {
        state.chatAssistant.loading = false;
        state.chatAssistant.success = true;
        state.chatAssistant.lastUpdated = new Date().toISOString();
        if (state.chatAssistant.data) {
          state.chatAssistant.data.conversations = action.payload;
          if (!state.chatAssistant.data.activeConversation && action.payload.length > 0) {
            state.chatAssistant.data.activeConversation = action.payload[0];
          }
        }
      })
      .addCase(fetchChatConversations.rejected, (state, action) => {
        state.chatAssistant.loading = false;
        state.chatAssistant.error = action.payload || "Failed to load chat conversations";
        state.chatAssistant.success = false;
      })

      .addCase(createChatConversation.pending, (state) => {
        state.operationLoading["createChatConversation"] = true;
      })
      .addCase(createChatConversation.fulfilled, (state, action) => {
        state.operationLoading["createChatConversation"] = false;
        state.operationSuccess["createChatConversation"] = true;
        if (state.chatAssistant.data) {
          state.chatAssistant.data.conversations = [
            action.payload,
            ...state.chatAssistant.data.conversations,
          ];
          state.chatAssistant.data.activeConversation = action.payload;
        }
      })
      .addCase(createChatConversation.rejected, (state, action) => {
        state.operationLoading["createChatConversation"] = false;
        state.operationErrors["createChatConversation"] =
          action.payload || "Failed to create conversation";
      })

      .addCase(fetchChatConversation.fulfilled, (state, action) => {
        if (state.chatAssistant.data) {
          state.chatAssistant.data.activeConversation = action.payload;
          const idx = state.chatAssistant.data.conversations.findIndex(
            (c) => c.id === action.payload.id,
          );
          if (idx !== -1) {
            state.chatAssistant.data.conversations[idx] = action.payload;
          } else {
            state.chatAssistant.data.conversations.push(action.payload);
          }
        }
      })

      .addCase(sendChatMessage.pending, (state) => {
        state.operationLoading["sendChatMessage"] = true;
        state.operationErrors["sendChatMessage"] = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.operationLoading["sendChatMessage"] = false;
        state.operationSuccess["sendChatMessage"] = true;
        if (state.chatAssistant.data?.activeConversation) {
          state.chatAssistant.data.activeConversation.messages.push(action.payload);
          state.chatAssistant.data.totalMessages += 1;
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.operationLoading["sendChatMessage"] = false;
        state.operationErrors["sendChatMessage"] = action.payload || "Failed to send message";
      })

      .addCase(deleteChatConversation.fulfilled, (state, action) => {
        if (state.chatAssistant.data) {
          state.chatAssistant.data.conversations = state.chatAssistant.data.conversations.filter(
            (c) => c.id !== action.payload.id,
          );
          if (state.chatAssistant.data.activeConversation?.id === action.payload.id) {
            state.chatAssistant.data.activeConversation =
              state.chatAssistant.data.conversations[0] || null;
          }
        }
      });

    // ── 16. Analytics Center ─────────────────────────────────────────
    builder
      .addCase(fetchAnalyticsCenter.pending, (state) => {
        state.analyticsCenter.loading = true;
        state.analyticsCenter.error = null;
      })
      .addCase(fetchAnalyticsCenter.fulfilled, (state, action) => {
        state.analyticsCenter.loading = false;
        state.analyticsCenter.data = action.payload;
        state.analyticsCenter.success = true;
        state.analyticsCenter.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAnalyticsCenter.rejected, (state, action) => {
        state.analyticsCenter.loading = false;
        state.analyticsCenter.error = action.payload || "Failed to load analytics center";
        state.analyticsCenter.success = false;
      })

      .addCase(analyzeAnalytics.pending, (state) => {
        state.operationLoading["analyzeAnalytics"] = true;
        state.operationErrors["analyzeAnalytics"] = null;
      })
      .addCase(analyzeAnalytics.fulfilled, (state, action) => {
        state.operationLoading["analyzeAnalytics"] = false;
        state.operationSuccess["analyzeAnalytics"] = true;
        if (state.analyticsCenter.data) {
          state.analyticsCenter.data.overview = action.payload.metrics ?? {};
          state.analyticsCenter.data.executiveSummary = action.payload.executiveSummary;
        }
      })
      .addCase(analyzeAnalytics.rejected, (state, action) => {
        state.operationLoading["analyzeAnalytics"] = false;
        state.operationErrors["analyzeAnalytics"] = action.payload || "Analytics analysis failed";
      })

      .addCase(fetchAttritionAnalytics.fulfilled, (state, action) => {
        if (state.analyticsCenter.data) {
          state.analyticsCenter.data.attrition = action.payload;
        }
      })

      .addCase(fetchDiversityAnalytics.fulfilled, (state, action) => {
        if (state.analyticsCenter.data) {
          state.analyticsCenter.data.diversity = action.payload;
        }
      })

      .addCase(fetchExecutiveSummary.fulfilled, (state, action) => {
        if (state.analyticsCenter.data) {
          state.analyticsCenter.data.executiveSummary = action.payload.executiveSummary;
        }
      });
  },
});

export const { setSelectedAgent, setActiveConversation, clearOperationStatus, resetAIHubState } =
  aiHubSlice.actions;

export default aiHubSlice.reducer;
