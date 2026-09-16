import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "@/api/utils";
import aiHubApi from "@/services/aiHub.api";
import type {
  AIAgent,
  AIAgentHistory,
  AIAgentStatus,
  AIHubOverview,
  AgentFeedbackPayload,
  AgentRunRequest,
  AgentRunResponse,
  AnalyticsCenterData,
  AnalyticsResult,
  AnalyzeAnalyticsPayload,
  AnalyzeAttendancePayload,
  AnalyzeHealthPayload,
  AnalyzeLeavePatternsPayload,
  AnalyzeMeetingPayload,
  AnalyzePayrollPayload,
  AnalyzeWorkforcePayload,
  AskPolicyPayload,
  AttendanceAnomaly,
  AttendanceMonitorData,
  ChatConversation,
  ChatMessage,
  CheckCompliancePayload,
  ComplianceChecklistItem,
  ComplianceMonitorData,
  ComplianceResult,
  CreateConversationPayload,
  DocumentGeneratorData,
  DocumentTemplate,
  EmployeeHealthInsight,
  ForecastHeadcountPayload,
  ForecastLeavesPayload,
  ForecastWorkforcePayload,
  GenerateDocPayload,
  GenerateGoalsPayload,
  GenerateQuestionsPayload,
  GenerateTrainingPayload,
  GeneratedDocument,
  LeaveAssistantData,
  LeaveForecast,
  MatchCandidatesPayload,
  MeetingActionItem,
  MeetingIntelligenceData,
  MeetingSummary,
  PaginationParams,
  PayrollAnomaly,
  PayrollInsight,
  PerformanceCoachData,
  PerformanceGoal,
  PolicyAnswer,
  PolicyAssistantData,
  PreviewDocPayload,
  RecruiterResult,
  ScanCompliancePayload,
  ScreenResumesPayload,
  SendChatMessagePayload,
  SummarizeMeetingPayload,
  TaxAuditPayload,
  WorkforceForecast,
  WorkforceInsight,
  WorkforcePlanningData,
} from "./aiHub.types";

/**
 * Normalizes API errors into user-friendly error messages with status code recognition.
 */
export function getAIHubThunkErrorMessage(err: unknown, fallbackMessage: string): string {
  const parsed = parseApiError(err, fallbackMessage);
  const msg = parsed.message;

  if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) {
    switch (parsed.status) {
      case 400:
        return "Invalid request parameters. Please verify your input.";
      case 401:
        return "Authentication required. Please log in to continue.";
      case 403:
        return "Access denied. You do not have permission for this AI action.";
      case 404:
        return "The requested AI resource or agent was not found.";
      case 409:
        return "Conflict detected with ongoing AI processing.";
      case 422:
        return "Validation failed on the AI parameters.";
      case 429:
        return "Rate limit reached. Please wait a moment before trying again.";
      case 500:
      default:
        return fallbackMessage || "Internal AI service error. Please try again later.";
    }
  }

  return msg;
}

// ── 1. Overview & Agents Thunks ───────────────────────────────────

export const fetchAIHubOverview = createAsyncThunk<AIHubOverview, void, { rejectValue: string }>(
  "aiHub/fetchAIHubOverview",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getOverview();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load AI Hub overview"));
    }
  },
);

export const fetchAIAgents = createAsyncThunk<AIAgent[], void, { rejectValue: string }>(
  "aiHub/fetchAIAgents",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getAgents();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load AI agents"));
    }
  },
);

export const fetchAIAgentDetails = createAsyncThunk<AIAgent, string, { rejectValue: string }>(
  "aiHub/fetchAIAgentDetails",
  async (agentId, { rejectWithValue }) => {
    try {
      return await aiHubApi.getAgentDetails(agentId);
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to load details for agent ${agentId}`));
    }
  },
);

// ── 2. Common AI Agent Operations Thunks ─────────────────────────

export const runAIAgent = createAsyncThunk<
  AgentRunResponse,
  { agentId: string; payload?: AgentRunRequest },
  { rejectValue: string }
>("aiHub/runAIAgent", async ({ agentId, payload }, { rejectWithValue }) => {
  try {
    return await aiHubApi.runAgent(agentId, payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to run agent ${agentId}`));
  }
});

export const fetchAIAgentHistory = createAsyncThunk<
  AIAgentHistory[],
  { agentId: string; params?: PaginationParams },
  { rejectValue: string }
>("aiHub/fetchAIAgentHistory", async ({ agentId, params }, { rejectWithValue }) => {
  try {
    return await aiHubApi.getAgentHistory(agentId, params);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to load history for agent ${agentId}`));
  }
});

export const fetchAIAgentStatus = createAsyncThunk<AIAgentStatus, string, { rejectValue: string }>(
  "aiHub/fetchAIAgentStatus",
  async (agentId, { rejectWithValue }) => {
    try {
      return await aiHubApi.getAgentStatus(agentId);
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, `Failed to check status for agent ${agentId}`));
    }
  },
);

export const submitAIAgentFeedback = createAsyncThunk<
  { success: boolean; message?: string },
  { agentId: string; payload: AgentFeedbackPayload },
  { rejectValue: string }
>("aiHub/submitAIAgentFeedback", async ({ agentId, payload }, { rejectWithValue }) => {
  try {
    return await aiHubApi.submitAgentFeedback(agentId, payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to submit agent feedback"));
  }
});

// ── 3. Workforce Insights Thunks ──────────────────────────────────

export const fetchWorkforceInsights = createAsyncThunk<WorkforceInsight[], void, { rejectValue: string }>(
  "aiHub/fetchWorkforceInsights",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getWorkforceInsights();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load workforce insights"));
    }
  },
);

export const analyzeWorkforceInsights = createAsyncThunk<
  WorkforceInsight[],
  AnalyzeWorkforcePayload | undefined,
  { rejectValue: string }
>("aiHub/analyzeWorkforceInsights", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzeWorkforceInsights(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze workforce data"));
  }
});

// ── 4. Recruiter Thunks ───────────────────────────────────────────

export const fetchRecruiterInsights = createAsyncThunk<RecruiterResult[], void, { rejectValue: string }>(
  "aiHub/fetchRecruiterInsights",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getRecruiterInsights();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load recruiter insights"));
    }
  },
);

export const screenResumes = createAsyncThunk<
  RecruiterResult[],
  ScreenResumesPayload,
  { rejectValue: string }
>("aiHub/screenResumes", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.screenResumes(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to screen resumes"));
  }
});

export const matchCandidates = createAsyncThunk<
  RecruiterResult[],
  MatchCandidatesPayload,
  { rejectValue: string }
>("aiHub/matchCandidates", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.matchCandidates(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to match candidates to job requirements"));
  }
});

export const generateInterviewQuestions = createAsyncThunk<
  { questions: string[]; jobTitle: string },
  GenerateQuestionsPayload,
  { rejectValue: string }
>("aiHub/generateInterviewQuestions", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.generateInterviewQuestions(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate interview questions"));
  }
});

// ── 5. Attendance Monitor Thunks ──────────────────────────────────

export const fetchAttendanceMonitor = createAsyncThunk<AttendanceMonitorData, void, { rejectValue: string }>(
  "aiHub/fetchAttendanceMonitor",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getAttendanceMonitor();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load attendance monitor data"));
    }
  },
);

export const analyzeAttendance = createAsyncThunk<
  AttendanceMonitorData,
  AnalyzeAttendancePayload | undefined,
  { rejectValue: string }
>("aiHub/analyzeAttendance", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzeAttendance(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run attendance analysis"));
  }
});

export const fetchAttendanceAnomalies = createAsyncThunk<
  AttendanceAnomaly[],
  PaginationParams | undefined,
  { rejectValue: string }
>("aiHub/fetchAttendanceAnomalies", async (params, { rejectWithValue }) => {
  try {
    return await aiHubApi.getAttendanceAnomalies(params);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to fetch attendance anomalies"));
  }
});

// ── 6. Leave Assistant Thunks ─────────────────────────────────────

export const fetchLeaveAssistant = createAsyncThunk<LeaveAssistantData, void, { rejectValue: string }>(
  "aiHub/fetchLeaveAssistant",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getLeaveAssistant();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load leave assistant data"));
    }
  },
);

export const forecastLeaves = createAsyncThunk<
  LeaveForecast,
  ForecastLeavesPayload | undefined,
  { rejectValue: string }
>("aiHub/forecastLeaves", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.forecastLeaves(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to forecast leave trends"));
  }
});

export const analyzeLeavePatterns = createAsyncThunk<
  LeaveAssistantData,
  AnalyzeLeavePatternsPayload | undefined,
  { rejectValue: string }
>("aiHub/analyzeLeavePatterns", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzeLeavePatterns(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze leave patterns"));
  }
});

// ── 7. Performance Coach Thunks ───────────────────────────────────

export const fetchPerformanceCoach = createAsyncThunk<PerformanceCoachData, void, { rejectValue: string }>(
  "aiHub/fetchPerformanceCoach",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getPerformanceCoach();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load performance coach data"));
    }
  },
);

export const generatePerformanceGoals = createAsyncThunk<
  PerformanceGoal[],
  GenerateGoalsPayload,
  { rejectValue: string }
>("aiHub/generatePerformanceGoals", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.generatePerformanceGoals(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate SMART performance goals"));
  }
});

export const generateTrainingRecommendations = createAsyncThunk<
  PerformanceCoachData["trainingRecommendations"],
  GenerateTrainingPayload,
  { rejectValue: string }
>("aiHub/generateTrainingRecommendations", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.generateTrainingRecommendations(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate training recommendations"));
  }
});

// ── 8. Payroll Insights Thunks ────────────────────────────────────

export const fetchPayrollInsights = createAsyncThunk<PayrollInsight, void, { rejectValue: string }>(
  "aiHub/fetchPayrollInsights",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getPayrollInsights();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load payroll insights"));
    }
  },
);

export const analyzePayroll = createAsyncThunk<
  PayrollInsight,
  AnalyzePayrollPayload | undefined,
  { rejectValue: string }
>("aiHub/analyzePayroll", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzePayroll(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze payroll variances"));
  }
});

export const fetchPayrollAnomalies = createAsyncThunk<
  PayrollAnomaly[],
  PaginationParams | undefined,
  { rejectValue: string }
>("aiHub/fetchPayrollAnomalies", async (params, { rejectWithValue }) => {
  try {
    return await aiHubApi.getPayrollAnomalies(params);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to fetch payroll anomalies"));
  }
});

export const runTaxAudit = createAsyncThunk<
  { passed: boolean; flagsCount: number; summary: string },
  TaxAuditPayload | undefined,
  { rejectValue: string }
>("aiHub/runTaxAudit", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.runTaxAudit(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run automated tax audit"));
  }
});

// ── 9. Workforce Planning Thunks ──────────────────────────────────

export const fetchWorkforcePlanning = createAsyncThunk<WorkforcePlanningData, void, { rejectValue: string }>(
  "aiHub/fetchWorkforcePlanning",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getWorkforcePlanning();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load workforce planning data"));
    }
  },
);

export const forecastWorkforce = createAsyncThunk<
  WorkforceForecast,
  ForecastWorkforcePayload | undefined,
  { rejectValue: string }
>("aiHub/forecastWorkforce", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.forecastWorkforce(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to forecast workforce demand"));
  }
});

export const forecastHeadcount = createAsyncThunk<
  { recommendedHeadcount: number; budgetEstimated: number; summary?: string },
  ForecastHeadcountPayload | undefined,
  { rejectValue: string }
>("aiHub/forecastHeadcount", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.forecastHeadcount(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to forecast headcount requirements"));
  }
});

// ── 10. Employee Health Thunks ────────────────────────────────────

export const fetchEmployeeHealth = createAsyncThunk<EmployeeHealthInsight, void, { rejectValue: string }>(
  "aiHub/fetchEmployeeHealth",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getEmployeeHealth();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load employee health insights"));
    }
  },
);

export const analyzeEmployeeHealth = createAsyncThunk<
  EmployeeHealthInsight,
  AnalyzeHealthPayload | undefined,
  { rejectValue: string }
>("aiHub/analyzeEmployeeHealth", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzeEmployeeHealth(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze organizational wellness"));
  }
});

export const fetchWellnessInsights = createAsyncThunk<
  { wellnessScore: number; recommendations: string[] },
  void,
  { rejectValue: string }
>("aiHub/fetchWellnessInsights", async (_, { rejectWithValue }) => {
  try {
    return await aiHubApi.getWellnessInsights();
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load wellness recommendations"));
  }
});

// ── 11. Policy Assistant Thunks ───────────────────────────────────

export const fetchPolicyAssistant = createAsyncThunk<PolicyAssistantData, void, { rejectValue: string }>(
  "aiHub/fetchPolicyAssistant",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getPolicyAssistant();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load policy assistant overview"));
    }
  },
);

export const askPolicyAssistant = createAsyncThunk<PolicyAnswer, AskPolicyPayload, { rejectValue: string }>(
  "aiHub/askPolicyAssistant",
  async (payload, { rejectWithValue }) => {
    try {
      return await aiHubApi.askPolicyAssistant(payload);
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to resolve policy query"));
    }
  },
);

export const checkPolicyCompliance = createAsyncThunk<
  { compliant: boolean; score: number; issues?: string[] },
  CheckCompliancePayload,
  { rejectValue: string }
>("aiHub/checkPolicyCompliance", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.checkPolicyCompliance(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to verify document compliance"));
  }
});

// ── 12. Document Generator Thunks ─────────────────────────────────

export const fetchDocumentGenerator = createAsyncThunk<DocumentGeneratorData, void, { rejectValue: string }>(
  "aiHub/fetchDocumentGenerator",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getDocumentGenerator();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load document generator"));
    }
  },
);

export const fetchDocumentTemplates = createAsyncThunk<DocumentTemplate[], void, { rejectValue: string }>(
  "aiHub/fetchDocumentTemplates",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getDocumentTemplates();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load document templates"));
    }
  },
);

export const generateDocument = createAsyncThunk<
  GeneratedDocument,
  GenerateDocPayload,
  { rejectValue: string }
>("aiHub/generateDocument", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.generateDocument(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to generate document"));
  }
});

export const previewDocument = createAsyncThunk<
  { previewContent: string; templateId: string },
  PreviewDocPayload,
  { rejectValue: string }
>("aiHub/previewDocument", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.previewDocument(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to preview document"));
  }
});

// ── 13. Meeting Intelligence Thunks ───────────────────────────────

export const fetchMeetingIntelligence = createAsyncThunk<MeetingIntelligenceData, void, { rejectValue: string }>(
  "aiHub/fetchMeetingIntelligence",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getMeetingIntelligence();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load meeting intelligence"));
    }
  },
);

export const analyzeMeeting = createAsyncThunk<
  MeetingSummary,
  AnalyzeMeetingPayload,
  { rejectValue: string }
>("aiHub/analyzeMeeting", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzeMeeting(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to analyze meeting"));
  }
});

export const summarizeMeeting = createAsyncThunk<
  { summary: string; keyPoints: string[] },
  SummarizeMeetingPayload,
  { rejectValue: string }
>("aiHub/summarizeMeeting", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.summarizeMeeting(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to summarize meeting"));
  }
});

export const fetchMeetingActionItems = createAsyncThunk<
  MeetingActionItem[],
  PaginationParams | undefined,
  { rejectValue: string }
>("aiHub/fetchMeetingActionItems", async (params, { rejectWithValue }) => {
  try {
    return await aiHubApi.getMeetingActionItems(params);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load meeting action items"));
  }
});

// ── 14. Compliance Monitor Thunks ─────────────────────────────────

export const fetchComplianceMonitor = createAsyncThunk<ComplianceMonitorData, void, { rejectValue: string }>(
  "aiHub/fetchComplianceMonitor",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getComplianceMonitor();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load compliance monitor"));
    }
  },
);

export const scanCompliance = createAsyncThunk<
  ComplianceResult,
  ScanCompliancePayload | undefined,
  { rejectValue: string }
>("aiHub/scanCompliance", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.scanCompliance(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run compliance scan"));
  }
});

export const fetchComplianceChecklist = createAsyncThunk<ComplianceChecklistItem[], void, { rejectValue: string }>(
  "aiHub/fetchComplianceChecklist",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getComplianceChecklist();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load compliance checklist"));
    }
  },
);

export const fetchComplianceScore = createAsyncThunk<
  { score: number; status: string; lastScan: string },
  void,
  { rejectValue: string }
>("aiHub/fetchComplianceScore", async (_, { rejectWithValue }) => {
  try {
    return await aiHubApi.getComplianceScore();
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load compliance score"));
  }
});

// ── 15. Chat Assistant Thunks ─────────────────────────────────────

export const fetchChatConversations = createAsyncThunk<
  ChatConversation[],
  PaginationParams | undefined,
  { rejectValue: string }
>("aiHub/fetchChatConversations", async (params, { rejectWithValue }) => {
  try {
    return await aiHubApi.getChatConversations(params);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load chat conversations"));
  }
});

export const createChatConversation = createAsyncThunk<
  ChatConversation,
  CreateConversationPayload | undefined,
  { rejectValue: string }
>("aiHub/createChatConversation", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.createChatConversation(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to create conversation"));
  }
});

export const fetchChatConversation = createAsyncThunk<ChatConversation, string, { rejectValue: string }>(
  "aiHub/fetchChatConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      return await aiHubApi.getChatConversation(conversationId);
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load conversation details"));
    }
  },
);

export const sendChatMessage = createAsyncThunk<
  ChatMessage,
  SendChatMessagePayload,
  { rejectValue: string }
>("aiHub/sendChatMessage", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.sendChatMessage(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to send message to assistant"));
  }
});

export const deleteChatConversation = createAsyncThunk<
  { success: boolean; id: string },
  string,
  { rejectValue: string }
>("aiHub/deleteChatConversation", async (conversationId, { rejectWithValue }) => {
  try {
    return await aiHubApi.deleteChatConversation(conversationId);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to delete conversation"));
  }
});

// ── 16. Analytics Center Thunks ───────────────────────────────────

export const fetchAnalyticsCenter = createAsyncThunk<AnalyticsCenterData, void, { rejectValue: string }>(
  "aiHub/fetchAnalyticsCenter",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getAnalyticsCenter();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load analytics center"));
    }
  },
);

export const analyzeAnalytics = createAsyncThunk<
  AnalyticsResult,
  AnalyzeAnalyticsPayload | undefined,
  { rejectValue: string }
>("aiHub/analyzeAnalytics", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.analyzeAnalytics(payload);
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to run analytics query"));
  }
});

export const fetchAttritionAnalytics = createAsyncThunk<Record<string, unknown>, void, { rejectValue: string }>(
  "aiHub/fetchAttritionAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getAttritionAnalytics();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load attrition analytics"));
    }
  },
);

export const fetchDiversityAnalytics = createAsyncThunk<Record<string, unknown>, void, { rejectValue: string }>(
  "aiHub/fetchDiversityAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await aiHubApi.getDiversityAnalytics();
    } catch (err) {
      return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load diversity analytics"));
    }
  },
);

export const fetchExecutiveSummary = createAsyncThunk<
  { executiveSummary: string; timestamp: string },
  void,
  { rejectValue: string }
>("aiHub/fetchExecutiveSummary", async (_, { rejectWithValue }) => {
  try {
    return await aiHubApi.getExecutiveSummary();
  } catch (err) {
    return rejectWithValue(getAIHubThunkErrorMessage(err, "Failed to load executive summary"));
  }
});
