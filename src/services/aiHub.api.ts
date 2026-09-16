import apiInstance from "@/api/apiInstance";
import type {
  AIAgent,
  AIAgentActivity,
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
} from "@/store/aiHub/aiHub.types";

/**
 * Normalizes backend responses unwrapping { data: T } or { result: T } or direct payload.
 */
function extractData<T>(res: unknown, fallback?: T): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined) ? r.data : res;

  if (body == null) return (fallback ?? null) as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return (body ?? fallback) as T;
}

export const aiHubApi = {
  // ── 1. AI Hub Overview & Agents ──────────────────────────────────
  async getOverview(): Promise<AIHubOverview> {
    const res = await apiInstance.get("/ai-hub");
    const raw = extractData<Record<string, unknown>>(res, {});
    return {
      totalAgents: Number(raw?.totalAgents ?? raw?.total_agents ?? 0),
      activeAgents: Number(raw?.activeAgents ?? raw?.active_agents ?? 0),
      tasksCompleted: Number(raw?.tasksCompleted ?? raw?.tasks_completed ?? 0),
      successRate: Number(raw?.successRate ?? raw?.success_rate ?? 0),
      systemHealth: String(raw?.systemHealth ?? raw?.system_health ?? "healthy"),
      lastUpdated: raw?.lastUpdated ? String(raw.lastUpdated) : new Date().toISOString(),
      summary: raw?.summary ? String(raw.summary) : undefined,
      recentActivities: Array.isArray(raw?.recentActivities ?? raw?.recent_activities)
        ? ((raw.recentActivities ?? raw.recent_activities) as AIAgentActivity[])
        : [],
      metrics: (raw?.metrics as Record<string, unknown>) ?? {},
    };
  },

  async getAgents(): Promise<AIAgent[]> {
    const res = await apiInstance.get("/ai-hub/agents");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as AIAgent[]) : [];
  },

  async getAgentDetails(agentId: string): Promise<AIAgent> {
    const res = await apiInstance.get(`/ai-hub/agents/${encodeURIComponent(agentId)}`);
    return extractData<AIAgent>(res);
  },

  // ── 2. Common AI Agent Operations ────────────────────────────────
  async runAgent(agentId: string, payload?: AgentRunRequest): Promise<AgentRunResponse> {
    const res = await apiInstance.post(`/ai-hub/agents/${encodeURIComponent(agentId)}/run`, payload ?? {});
    return extractData<AgentRunResponse>(res);
  },

  async getAgentHistory(agentId: string, params?: PaginationParams): Promise<AIAgentHistory[]> {
    const res = await apiInstance.get(`/ai-hub/agents/${encodeURIComponent(agentId)}/history`, { params });
    const raw = extractData<unknown>(res, []);
    if (Array.isArray(raw)) return raw as AIAgentHistory[];
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray((raw as { items: unknown }).items)) {
      return (raw as { items: AIAgentHistory[] }).items;
    }
    return [];
  },

  async getAgentStatus(agentId: string): Promise<AIAgentStatus> {
    const res = await apiInstance.get(`/ai-hub/agents/${encodeURIComponent(agentId)}/status`);
    return extractData<AIAgentStatus>(res, {
      agentId,
      status: "idle",
    });
  },

  async submitAgentFeedback(agentId: string, payload: AgentFeedbackPayload): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/ai-hub/agents/${encodeURIComponent(agentId)}/feedback`, payload);
    return extractData<{ success: boolean; message?: string }>(res, { success: true });
  },

  // ── 3. Workforce Insights ────────────────────────────────────────
  async getWorkforceInsights(): Promise<WorkforceInsight[]> {
    const res = await apiInstance.get("/ai-hub/workforce-insights");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as WorkforceInsight[]) : [];
  },

  async analyzeWorkforceInsights(payload?: AnalyzeWorkforcePayload): Promise<WorkforceInsight[]> {
    const res = await apiInstance.post("/ai-hub/workforce-insights/analyze", payload ?? {});
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as WorkforceInsight[]) : [];
  },

  // ── 4. Recruiter ─────────────────────────────────────────────────
  async getRecruiterInsights(): Promise<RecruiterResult[]> {
    const res = await apiInstance.get("/ai-hub/recruiter");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as RecruiterResult[]) : [];
  },

  async screenResumes(payload: ScreenResumesPayload): Promise<RecruiterResult[]> {
    const res = await apiInstance.post("/ai-hub/recruiter/screen-resumes", payload);
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as RecruiterResult[]) : [];
  },

  async matchCandidates(payload: MatchCandidatesPayload): Promise<RecruiterResult[]> {
    const res = await apiInstance.post("/ai-hub/recruiter/match-candidates", payload);
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as RecruiterResult[]) : [];
  },

  async generateInterviewQuestions(payload: GenerateQuestionsPayload): Promise<{ questions: string[]; jobTitle: string }> {
    const res = await apiInstance.post("/ai-hub/recruiter/generate-questions", payload);
    return extractData<{ questions: string[]; jobTitle: string }>(res, {
      questions: [],
      jobTitle: payload.jobTitle,
    });
  },

  // ── 5. Attendance Monitor ────────────────────────────────────────
  async getAttendanceMonitor(): Promise<AttendanceMonitorData> {
    const res = await apiInstance.get("/ai-hub/attendance-monitor");
    return extractData<AttendanceMonitorData>(res, {
      anomaliesCount: 0,
      onTimeRate: 0,
      averageLateMinutes: 0,
      anomalies: [],
    });
  },

  async analyzeAttendance(payload?: AnalyzeAttendancePayload): Promise<AttendanceMonitorData> {
    const res = await apiInstance.post("/ai-hub/attendance-monitor/analyze", payload ?? {});
    return extractData<AttendanceMonitorData>(res, {
      anomaliesCount: 0,
      onTimeRate: 0,
      averageLateMinutes: 0,
      anomalies: [],
    });
  },

  async getAttendanceAnomalies(params?: PaginationParams): Promise<AttendanceAnomaly[]> {
    const res = await apiInstance.get("/ai-hub/attendance-monitor/anomalies", { params });
    const raw = extractData<unknown>(res, []);
    if (Array.isArray(raw)) return raw as AttendanceAnomaly[];
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray((raw as { items: unknown }).items)) {
      return (raw as { items: AttendanceAnomaly[] }).items;
    }
    return [];
  },

  // ── 6. Leave Assistant ───────────────────────────────────────────
  async getLeaveAssistant(): Promise<LeaveAssistantData> {
    const res = await apiInstance.get("/ai-hub/leave-assistant");
    return extractData<LeaveAssistantData>(res, {
      pendingApprovals: 0,
    });
  },

  async forecastLeaves(payload?: ForecastLeavesPayload): Promise<LeaveForecast> {
    const res = await apiInstance.post("/ai-hub/leave-assistant/forecast", payload ?? {});
    return extractData<LeaveForecast>(res, {
      period: "Next 30 Days",
      projectedAbsenceRate: 0,
      predictedPeakDates: [],
    });
  },

  async analyzeLeavePatterns(payload?: AnalyzeLeavePatternsPayload): Promise<LeaveAssistantData> {
    const res = await apiInstance.post("/ai-hub/leave-assistant/analyze", payload ?? {});
    return extractData<LeaveAssistantData>(res, {
      pendingApprovals: 0,
    });
  },

  // ── 7. Performance Coach ─────────────────────────────────────────
  async getPerformanceCoach(): Promise<PerformanceCoachData> {
    const res = await apiInstance.get("/ai-hub/performance-coach");
    return extractData<PerformanceCoachData>(res, {
      coachingSessionsCount: 0,
      goalsGeneratedCount: 0,
      recommendationsCount: 0,
      goals: [],
      trainingRecommendations: [],
    });
  },

  async generatePerformanceGoals(payload: GenerateGoalsPayload): Promise<PerformanceGoal[]> {
    const res = await apiInstance.post("/ai-hub/performance-coach/goals", payload);
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as PerformanceGoal[]) : [];
  },

  async generateTrainingRecommendations(payload: GenerateTrainingPayload): Promise<PerformanceCoachData["trainingRecommendations"]> {
    const res = await apiInstance.post("/ai-hub/performance-coach/training-recommendations", payload);
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as PerformanceCoachData["trainingRecommendations"]) : [];
  },

  // ── 8. Payroll Insights ──────────────────────────────────────────
  async getPayrollInsights(): Promise<PayrollInsight> {
    const res = await apiInstance.get("/ai-hub/payroll-insights");
    return extractData<PayrollInsight>(res, {
      cycle: "Current",
      totalVariance: 0,
      variancePercentage: 0,
      anomaliesDetected: 0,
      taxAuditFlags: 0,
      summary: "",
    });
  },

  async analyzePayroll(payload?: AnalyzePayrollPayload): Promise<PayrollInsight> {
    const res = await apiInstance.post("/ai-hub/payroll-insights/analyze", payload ?? {});
    return extractData<PayrollInsight>(res, {
      cycle: "Current",
      totalVariance: 0,
      variancePercentage: 0,
      anomaliesDetected: 0,
      taxAuditFlags: 0,
      summary: "",
    });
  },

  async getPayrollAnomalies(params?: PaginationParams): Promise<PayrollAnomaly[]> {
    const res = await apiInstance.get("/ai-hub/payroll-insights/anomalies", { params });
    const raw = extractData<unknown>(res, []);
    if (Array.isArray(raw)) return raw as PayrollAnomaly[];
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray((raw as { items: unknown }).items)) {
      return (raw as { items: PayrollAnomaly[] }).items;
    }
    return [];
  },

  async runTaxAudit(payload?: TaxAuditPayload): Promise<{ passed: boolean; flagsCount: number; summary: string }> {
    const res = await apiInstance.post("/ai-hub/payroll-insights/tax-audit", payload ?? {});
    return extractData<{ passed: boolean; flagsCount: number; summary: string }>(res, {
      passed: true,
      flagsCount: 0,
      summary: "Tax audit completed with no critical flags.",
    });
  },

  // ── 9. Workforce Planning ────────────────────────────────────────
  async getWorkforcePlanning(): Promise<WorkforcePlanningData> {
    const res = await apiInstance.get("/ai-hub/workforce-planning");
    return extractData<WorkforcePlanningData>(res, {
      currentHeadcount: 0,
      forecast: {
        horizonMonths: 12,
        projectedHeadcount: 0,
        projectedCost: 0,
      },
    });
  },

  async forecastWorkforce(payload?: ForecastWorkforcePayload): Promise<WorkforceForecast> {
    const res = await apiInstance.post("/ai-hub/workforce-planning/forecast", payload ?? {});
    return extractData<WorkforceForecast>(res, {
      horizonMonths: payload?.horizonMonths ?? 12,
      projectedHeadcount: 0,
      projectedCost: 0,
    });
  },

  async forecastHeadcount(payload?: ForecastHeadcountPayload): Promise<{ recommendedHeadcount: number; budgetEstimated: number; summary?: string }> {
    const res = await apiInstance.post("/ai-hub/workforce-planning/headcount", payload ?? {});
    return extractData<{ recommendedHeadcount: number; budgetEstimated: number; summary?: string }>(res, {
      recommendedHeadcount: 0,
      budgetEstimated: 0,
    });
  },

  // ── 10. Employee Health ──────────────────────────────────────────
  async getEmployeeHealth(): Promise<EmployeeHealthInsight> {
    const res = await apiInstance.get("/ai-hub/employee-health");
    return extractData<EmployeeHealthInsight>(res, {
      burnoutRiskIndex: 0,
      wellnessScore: 0,
      sentimentScore: 0,
      trend: 0,
    });
  },

  async analyzeEmployeeHealth(payload?: AnalyzeHealthPayload): Promise<EmployeeHealthInsight> {
    const res = await apiInstance.post("/ai-hub/employee-health/analyze", payload ?? {});
    return extractData<EmployeeHealthInsight>(res, {
      burnoutRiskIndex: 0,
      wellnessScore: 0,
      sentimentScore: 0,
      trend: 0,
    });
  },

  async getWellnessInsights(): Promise<{ wellnessScore: number; recommendations: string[] }> {
    const res = await apiInstance.get("/ai-hub/employee-health/wellness");
    return extractData<{ wellnessScore: number; recommendations: string[] }>(res, {
      wellnessScore: 0,
      recommendations: [],
    });
  },

  // ── 11. Policy Assistant ─────────────────────────────────────────
  async getPolicyAssistant(): Promise<PolicyAssistantData> {
    const res = await apiInstance.get("/ai-hub/policy-assistant");
    return extractData<PolicyAssistantData>(res, {
      queriesCount: 0,
      complianceRate: 100,
      recentQueries: [],
    });
  },

  async askPolicyAssistant(payload: AskPolicyPayload): Promise<PolicyAnswer> {
    const res = await apiInstance.post("/ai-hub/policy-assistant/ask", payload);
    return extractData<PolicyAnswer>(res, {
      question: payload.question,
      answer: "",
      confidence: 0,
    });
  },

  async checkPolicyCompliance(payload: CheckCompliancePayload): Promise<{ compliant: boolean; score: number; issues?: string[] }> {
    const res = await apiInstance.post("/ai-hub/policy-assistant/check-compliance", payload);
    return extractData<{ compliant: boolean; score: number; issues?: string[] }>(res, {
      compliant: true,
      score: 100,
      issues: [],
    });
  },

  // ── 12. Document Generator ───────────────────────────────────────
  async getDocumentGenerator(): Promise<DocumentGeneratorData> {
    const res = await apiInstance.get("/ai-hub/document-generator");
    return extractData<DocumentGeneratorData>(res, {
      templatesCount: 0,
      documentsGeneratedCount: 0,
      templates: [],
      recentDocuments: [],
    });
  },

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const res = await apiInstance.get("/ai-hub/document-generator/templates");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as DocumentTemplate[]) : [];
  },

  async generateDocument(payload: GenerateDocPayload): Promise<GeneratedDocument> {
    const res = await apiInstance.post("/ai-hub/document-generator/generate", payload);
    return extractData<GeneratedDocument>(res);
  },

  async previewDocument(payload: PreviewDocPayload): Promise<{ previewContent: string; templateId: string }> {
    const res = await apiInstance.post("/ai-hub/document-generator/preview", payload);
    return extractData<{ previewContent: string; templateId: string }>(res, {
      previewContent: "",
      templateId: payload.templateId,
    });
  },

  // ── 13. Meeting Intelligence ─────────────────────────────────────
  async getMeetingIntelligence(): Promise<MeetingIntelligenceData> {
    const res = await apiInstance.get("/ai-hub/meeting-intelligence");
    return extractData<MeetingIntelligenceData>(res, {
      analyzedMeetingsCount: 0,
      actionItemsPendingCount: 0,
      recentSummaries: [],
      actionItems: [],
    });
  },

  async analyzeMeeting(payload: AnalyzeMeetingPayload): Promise<MeetingSummary> {
    const res = await apiInstance.post("/ai-hub/meeting-intelligence/analyze", payload);
    return extractData<MeetingSummary>(res);
  },

  async summarizeMeeting(payload: SummarizeMeetingPayload): Promise<{ summary: string; keyPoints: string[] }> {
    const res = await apiInstance.post("/ai-hub/meeting-intelligence/summarize", payload);
    return extractData<{ summary: string; keyPoints: string[] }>(res, {
      summary: "",
      keyPoints: [],
    });
  },

  async getMeetingActionItems(params?: PaginationParams): Promise<MeetingActionItem[]> {
    const res = await apiInstance.get("/ai-hub/meeting-intelligence/action-items", { params });
    const raw = extractData<unknown>(res, []);
    if (Array.isArray(raw)) return raw as MeetingActionItem[];
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray((raw as { items: unknown }).items)) {
      return (raw as { items: MeetingActionItem[] }).items;
    }
    return [];
  },

  // ── 14. Compliance Monitor ───────────────────────────────────────
  async getComplianceMonitor(): Promise<ComplianceMonitorData> {
    const res = await apiInstance.get("/ai-hub/compliance-monitor");
    return extractData<ComplianceMonitorData>(res, {
      score: 100,
      status: "compliant",
      checklist: [],
    });
  },

  async scanCompliance(payload?: ScanCompliancePayload): Promise<ComplianceResult> {
    const res = await apiInstance.post("/ai-hub/compliance-monitor/scan", payload ?? {});
    return extractData<ComplianceResult>(res, {
      framework: payload?.framework ?? "General Statutory",
      overallScore: 100,
      status: "compliant",
      scannedAt: new Date().toISOString(),
    });
  },

  async getComplianceChecklist(): Promise<ComplianceChecklistItem[]> {
    const res = await apiInstance.get("/ai-hub/compliance-monitor/checklist");
    const raw = extractData<unknown>(res, []);
    return Array.isArray(raw) ? (raw as ComplianceChecklistItem[]) : [];
  },

  async getComplianceScore(): Promise<{ score: number; status: string; lastScan: string }> {
    const res = await apiInstance.get("/ai-hub/compliance-monitor/score");
    return extractData<{ score: number; status: string; lastScan: string }>(res, {
      score: 100,
      status: "compliant",
      lastScan: new Date().toISOString(),
    });
  },

  // ── 15. Chat Assistant ───────────────────────────────────────────
  async getChatConversations(params?: PaginationParams): Promise<ChatConversation[]> {
    const res = await apiInstance.get("/ai-hub/chat-assistant/conversations", { params });
    const raw = extractData<unknown>(res, []);
    if (Array.isArray(raw)) return raw as ChatConversation[];
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray((raw as { items: unknown }).items)) {
      return (raw as { items: ChatConversation[] }).items;
    }
    return [];
  },

  async createChatConversation(payload?: CreateConversationPayload): Promise<ChatConversation> {
    const res = await apiInstance.post("/ai-hub/chat-assistant/conversations", payload ?? {});
    return extractData<ChatConversation>(res);
  },

  async getChatConversation(conversationId: string): Promise<ChatConversation> {
    const res = await apiInstance.get(`/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}`);
    return extractData<ChatConversation>(res);
  },

  async sendChatMessage(payload: SendChatMessagePayload): Promise<ChatMessage> {
    const res = await apiInstance.post("/ai-hub/chat-assistant/message", payload);
    return extractData<ChatMessage>(res);
  },

  async deleteChatConversation(conversationId: string): Promise<{ success: boolean; id: string }> {
    const res = await apiInstance.delete(`/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}`);
    return extractData<{ success: boolean; id: string }>(res, { success: true, id: conversationId });
  },

  // ── 16. Analytics Center ─────────────────────────────────────────
  async getAnalyticsCenter(): Promise<AnalyticsCenterData> {
    const res = await apiInstance.get("/ai-hub/analytics-center");
    return extractData<AnalyticsCenterData>(res, {});
  },

  async analyzeAnalytics(payload?: AnalyzeAnalyticsPayload): Promise<AnalyticsResult> {
    const res = await apiInstance.post("/ai-hub/analytics-center/analyze", payload ?? {});
    return extractData<AnalyticsResult>(res, {
      category: payload?.category ?? "General",
      timestamp: new Date().toISOString(),
    });
  },

  async getAttritionAnalytics(): Promise<Record<string, unknown>> {
    const res = await apiInstance.get("/ai-hub/analytics-center/attrition");
    return extractData<Record<string, unknown>>(res, {});
  },

  async getDiversityAnalytics(): Promise<Record<string, unknown>> {
    const res = await apiInstance.get("/ai-hub/analytics-center/diversity");
    return extractData<Record<string, unknown>>(res, {});
  },

  async getExecutiveSummary(): Promise<{ executiveSummary: string; timestamp: string }> {
    const res = await apiInstance.get("/ai-hub/analytics-center/executive-summary");
    return extractData<{ executiveSummary: string; timestamp: string }>(res, {
      executiveSummary: "",
      timestamp: new Date().toISOString(),
    });
  },
};

export default aiHubApi;
