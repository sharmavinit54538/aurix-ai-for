/**
 * AI Hub TypeScript Definitions
 * OFC360 Production Ready Domain Types
 */

// ── Common & Pagination Types ─────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

export interface APIError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
  code?: string;
}

export interface SectionState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  lastUpdated: string | null;
}

// ── 1. AI Hub Overview & Agents ──────────────────────────────────

export interface AIAgentActivity {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  status: "completed" | "failed" | "running" | string;
  timestamp: string;
}

export interface AIHubOverview {
  totalAgents: number;
  activeAgents: number;
  tasksCompleted: number;
  successRate: number;
  systemHealth: "healthy" | "degraded" | "critical" | string;
  lastUpdated?: string;
  summary?: string;
  recentActivities?: AIAgentActivity[];
  metrics?: Record<string, unknown>;
}

export interface AIAgent {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "idle" | "running" | "error" | "offline" | "active" | string;
  version?: string;
  capabilities?: string[];
  config?: Record<string, unknown>;
  metrics?: {
    runsCount?: number;
    successRate?: number;
    averageResponseTimeMs?: number;
    lastRunAt?: string;
  };
  icon?: string;
  lastRunAt?: string;
}

export interface AIAgentStatus {
  agentId: string;
  status: "idle" | "running" | "error" | "offline" | "active" | string;
  currentTask?: string;
  progress?: number;
  uptime?: number;
  lastHeartbeat?: string;
  message?: string;
}

export interface AIAgentHistory {
  id: string;
  agentId: string;
  taskName: string;
  status: "success" | "failure" | "running" | "cancelled" | string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  inputSummary?: string;
  outputSummary?: string;
  error?: string;
}

export interface AgentRunRequest {
  parameters?: Record<string, unknown>;
  context?: Record<string, unknown>;
  trigger?: string;
  prompt?: string;
  [key: string]: unknown;
}

export interface AgentRunResponse {
  executionId: string;
  agentId: string;
  status: string;
  output?: unknown;
  result?: unknown;
  metrics?: {
    durationMs?: number;
    tokensUsed?: number;
    cost?: number;
  };
  message?: string;
  completedAt?: string;
}

export interface AgentFeedbackPayload {
  runId?: string;
  rating: number; // 1-5
  comment?: string;
  tags?: string[];
}

// ── 2. Workforce Insights ────────────────────────────────────────

export interface WorkforceInsight {
  id: string;
  title: string;
  department?: string;
  category?: string;
  metric?: string | number;
  trend?: number;
  riskLevel?: "low" | "medium" | "high" | "critical" | string;
  summary: string;
  recommendations?: string[];
  timestamp?: string;
  data?: Record<string, unknown>;
}

export interface AnalyzeWorkforcePayload {
  department?: string;
  timeframe?: string;
  metrics?: string[];
  [key: string]: unknown;
}

// ── 3. Recruiter ─────────────────────────────────────────────────

export interface RecruiterResult {
  id?: string;
  candidateId?: string;
  candidateName?: string;
  jobTitle?: string;
  matchScore?: number;
  skillsMatched?: string[];
  skillsMissing?: string[];
  summary?: string;
  questions?: string[];
  recommendation?: "hire" | "interview" | "reject" | "review" | string;
  [key: string]: unknown;
}

export interface ScreenResumesPayload {
  jobId?: string;
  resumeUrls?: string[];
  resumes?: Array<{ id: string; content?: string; url?: string }>;
  criteria?: Record<string, unknown>;
}

export interface MatchCandidatesPayload {
  jobDescription: string;
  candidateIds?: string[];
  filters?: Record<string, unknown>;
}

export interface GenerateQuestionsPayload {
  jobTitle: string;
  skills?: string[];
  experienceLevel?: "junior" | "mid" | "senior" | "lead" | string;
  category?: "technical" | "behavioral" | "leadership" | string;
}

// ── 4. Attendance Monitor ────────────────────────────────────────

export interface AttendanceAnomaly {
  id: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  date: string;
  anomalyType: "late_arrival" | "early_departure" | "missing_punch" | "unexpected_absence" | string;
  severity: "low" | "medium" | "high" | string;
  details?: string;
  status: "pending" | "reviewed" | "excused" | "resolved" | string;
}

export interface AttendanceMonitorData {
  anomaliesCount: number;
  onTimeRate: number;
  averageLateMinutes: number;
  anomalies: AttendanceAnomaly[];
  summary?: string;
  trends?: Array<{ date: string; rate: number; anomalies: number }>;
}

export interface AnalyzeAttendancePayload {
  startDate?: string;
  endDate?: string;
  department?: string;
}

// ── 5. Leave Assistant ───────────────────────────────────────────

export interface LeaveForecast {
  period: string;
  projectedAbsenceRate: number;
  predictedPeakDates: string[];
  departmentsImpacted?: Array<{ department: string; risk: string; count: number }>;
  recommendation?: string;
  details?: Record<string, unknown>;
}

export interface LeaveAssistantData {
  pendingApprovals: number;
  forecast?: LeaveForecast;
  patterns?: Array<{ type: string; frequency: number; trend: string }>;
  summary?: string;
}

export interface ForecastLeavesPayload {
  startDate?: string;
  endDate?: string;
  department?: string;
}

export interface AnalyzeLeavePatternsPayload {
  timeframe?: string;
  department?: string;
}

// ── 6. Performance Coach ─────────────────────────────────────────

export interface PerformanceGoal {
  id: string;
  employeeId?: string;
  employeeName?: string;
  title: string;
  description: string;
  category?: string;
  targetDate?: string;
  status?: "not_started" | "in_progress" | "completed" | "delayed" | string;
  keyResults?: string[];
  aiSuggestions?: string[];
}

export interface PerformanceCoachData {
  coachingSessionsCount: number;
  goalsGeneratedCount: number;
  recommendationsCount: number;
  goals: PerformanceGoal[];
  trainingRecommendations: Array<{
    id: string;
    skill: string;
    courseName?: string;
    provider?: string;
    targetEmployeesCount?: number;
  }>;
  summary?: string;
}

export interface GenerateGoalsPayload {
  employeeId?: string;
  role?: string;
  department?: string;
  okrCategory?: string;
  targetHorizon?: string;
}

export interface GenerateTrainingPayload {
  department?: string;
  skillsGaps?: string[];
  level?: string;
}

// ── 7. Payroll Insights ──────────────────────────────────────────

export interface PayrollAnomaly {
  id: string;
  employeeId: string;
  employeeName?: string;
  type: string;
  amount?: number;
  variancePercentage?: number;
  severity: "low" | "medium" | "high" | string;
  description: string;
}

export interface PayrollInsight {
  cycle: string;
  totalVariance: number;
  variancePercentage: number;
  anomaliesDetected: number;
  taxAuditFlags: number;
  summary: string;
  anomalies?: PayrollAnomaly[];
  flags?: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
}

export interface AnalyzePayrollPayload {
  cycle?: string;
  department?: string;
  thresholdPercentage?: number;
}

export interface TaxAuditPayload {
  taxYear?: number;
  quarter?: number;
  jurisdiction?: string;
}

// ── 8. Workforce Planning ────────────────────────────────────────

export interface WorkforceForecast {
  horizonMonths: number;
  projectedHeadcount: number;
  projectedCost: number;
  skillsGaps?: Array<{ skill: string; deficitCount: number }>;
  departmentProjections?: Record<string, number>;
  summary?: string;
}

export interface WorkforcePlanningData {
  currentHeadcount: number;
  forecast: WorkforceForecast;
  budgetEstimates?: Record<string, number>;
  hiringPlan?: Array<{ role: string; targetMonth: string; count: number }>;
}

export interface ForecastWorkforcePayload {
  horizonMonths?: number;
  growthRate?: number;
  departments?: string[];
}

export interface ForecastHeadcountPayload {
  growthTarget?: number;
  budgetCap?: number;
}

// ── 9. Employee Health ───────────────────────────────────────────

export interface EmployeeHealthInsight {
  burnoutRiskIndex: number;
  wellnessScore: number;
  sentimentScore: number;
  trend: number;
  flaggedDepartments?: Array<{ department: string; riskLevel: string }>;
  wellnessRecommendations?: string[];
  wellnessMetrics?: Record<string, unknown>;
}

export interface AnalyzeHealthPayload {
  department?: string;
  factors?: string[];
}

// ── 10. Policy Assistant ─────────────────────────────────────────

export interface PolicyAnswer {
  question: string;
  answer: string;
  confidence: number;
  sources?: Array<{ documentName: string; section?: string; url?: string }>;
  complianceNotes?: string;
}

export interface PolicyAssistantData {
  queriesCount: number;
  complianceRate: number;
  recentQueries?: PolicyAnswer[];
  summary?: string;
}

export interface AskPolicyPayload {
  question: string;
  department?: string;
  jurisdiction?: string;
}

export interface CheckCompliancePayload {
  documentText?: string;
  documentUrl?: string;
  policyId?: string;
  standard?: string;
}

// ── 11. Document Generator ───────────────────────────────────────

export interface DocumentTemplate {
  id: string;
  name: string;
  title?: string;
  category: string;
  description?: string;
  variables: string[];
  previewContent?: string;
}

export interface GeneratedDocument {
  id: string;
  templateId?: string;
  title: string;
  content?: string;
  status: "generating" | "completed" | "failed" | string;
  downloadUrl?: string;
  createdAt: string;
}

export interface DocumentGeneratorData {
  templatesCount: number;
  documentsGeneratedCount: number;
  templates: DocumentTemplate[];
  recentDocuments: GeneratedDocument[];
}

export interface GenerateDocPayload {
  templateId: string;
  title: string;
  variables: Record<string, string | number>;
  format?: "pdf" | "docx" | "html";
}

export interface PreviewDocPayload {
  templateId: string;
  variables: Record<string, string | number>;
}

// ── 12. Meeting Intelligence ─────────────────────────────────────

export interface MeetingActionItem {
  id: string;
  assignee?: string;
  task: string;
  dueDate?: string;
  status?: "pending" | "completed" | string;
}

export interface MeetingSummary {
  meetingId: string;
  title: string;
  date?: string;
  summary: string;
  actionItems: MeetingActionItem[];
  keyDecisions?: string[];
  sentiment?: string;
}

export interface MeetingIntelligenceData {
  analyzedMeetingsCount: number;
  actionItemsPendingCount: number;
  recentSummaries: MeetingSummary[];
  actionItems: MeetingActionItem[];
}

export interface AnalyzeMeetingPayload {
  meetingId?: string;
  transcript?: string;
  audioUrl?: string;
  participants?: string[];
}

export interface SummarizeMeetingPayload {
  meetingId?: string;
  transcript: string;
  keyPointsCount?: number;
}

// ── 13. Compliance Monitor ───────────────────────────────────────

export interface ComplianceChecklistItem {
  id: string;
  requirement: string;
  category?: string;
  status: "passed" | "failed" | "in_progress" | string;
  severity: "critical" | "major" | "minor" | string;
  notes?: string;
}

export interface ComplianceResult {
  framework: string;
  overallScore: number;
  status: "compliant" | "warning" | "non_compliant" | string;
  checklist?: ComplianceChecklistItem[];
  scannedAt: string;
  summary?: string;
}

export interface ComplianceMonitorData {
  score: number;
  status: string;
  checklist: ComplianceChecklistItem[];
  recentScans?: ComplianceResult[];
}

export interface ScanCompliancePayload {
  framework?: string;
  scope?: string;
  fullScan?: boolean;
}

// ── 14. Chat Assistant ───────────────────────────────────────────

export interface ChatMessage {
  id: string;
  conversationId?: string;
  sender: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChatConversation {
  id: string;
  title: string;
  agentId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatAssistantData {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  totalMessages: number;
}

export interface CreateConversationPayload {
  title?: string;
  agentId?: string;
  initialMessage?: string;
}

export interface SendChatMessagePayload {
  conversationId: string;
  content: string;
  agentId?: string;
}

// ── 15. Analytics Center ─────────────────────────────────────────

export interface AnalyticsCenterData {
  overview?: Record<string, unknown>;
  executiveSummary?: string;
  attrition?: Record<string, unknown>;
  diversity?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  lastUpdated?: string;
}

export interface AnalyticsResult {
  category: string;
  executiveSummary?: string;
  attrition?: Record<string, unknown>;
  diversity?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  charts?: unknown[];
  timestamp?: string;
}

export interface AnalyzeAnalyticsPayload {
  category?: string;
  timeframe?: string;
  filters?: Record<string, unknown>;
}

// ── Complete AI Hub State ────────────────────────────────────────

export interface AIHubState {
  // Domain Sections
  overview: SectionState<AIHubOverview>;
  agents: SectionState<AIAgent[]>;
  selectedAgent: AIAgent | null;
  agentDetails: SectionState<AIAgent>;
  agentHistory: SectionState<AIAgentHistory[]>;
  agentStatus: SectionState<AIAgentStatus>;
  workforceInsights: SectionState<WorkforceInsight[]>;
  recruiter: SectionState<RecruiterResult[]>;
  attendanceMonitor: SectionState<AttendanceMonitorData>;
  leaveAssistant: SectionState<LeaveAssistantData>;
  performanceCoach: SectionState<PerformanceCoachData>;
  payrollInsights: SectionState<PayrollInsight>;
  workforcePlanning: SectionState<WorkforcePlanningData>;
  employeeHealth: SectionState<EmployeeHealthInsight>;
  policyAssistant: SectionState<PolicyAssistantData>;
  documentGenerator: SectionState<DocumentGeneratorData>;
  meetingIntelligence: SectionState<MeetingIntelligenceData>;
  complianceMonitor: SectionState<ComplianceMonitorData>;
  chatAssistant: SectionState<ChatAssistantData>;
  analyticsCenter: SectionState<AnalyticsCenterData>;

  // Operation-level status trackers
  operationLoading: Record<string, boolean>;
  operationErrors: Record<string, string | null>;
  operationSuccess: Record<string, boolean>;
}
