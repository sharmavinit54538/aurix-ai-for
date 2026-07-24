export interface LeaveDashboardKpis {
  pending: number | null;
  approved: number | null;
  rejected: number | null;
  teamAvailability: number | null;
  employeesOnLeave: number | null;
  approvalSuggestions?: number | null;
  conflicts?: number | null;
  averageApprovalTimeHours?: number | null;
  pendingTrend?: number | null;
  approvedTrend?: number | null;
  rejectedTrend?: number | null;
  availabilityTrend?: number | null;
}

export interface LeaveChartPoint {
  label: string;
  value: number;
  peakRisk?: string;
  department?: string;
  count?: number;
  percentage?: number;
}

export interface LeaveForecastData {
  period?: string;
  groupBy?: string;
  peakRisk?: string;
  points: LeaveChartPoint[];
}

export interface LeaveDistributionData {
  totalLeaves?: number | null;
  items: LeaveChartPoint[];
}

export interface LeaveApprovalSuggestionItem {
  id?: string;
  employeeId?: string;
  employeeName: string;
  department?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  suggestion: string;
  confidence?: number | null;
  reason?: string;
  leaveBalanceRemaining?: number | null;
  teamAvailabilityPct?: number | null;
}

export interface LeaveApprovalSuggestionsData {
  total: number | null;
  items: LeaveApprovalSuggestionItem[];
}

export interface LeaveConflictItem {
  id?: string;
  title: string;
  department?: string;
  severity?: string;
  note?: string;
  resolution?: string;
  employees?: string[];
}

export interface LeaveConflictsData {
  total: number | null;
  items: LeaveConflictItem[];
}

export interface LeaveTeamAvailabilityItem {
  department: string;
  availability: number;
  onLeave?: number;
  headcount?: number;
}

export interface LeaveShiftAvailabilityItem {
  shift: string;
  availability: number;
}

export interface LeaveTeamAvailabilityData {
  overall: number | null;
  totalEmployees?: number | null;
  availableCount?: number | null;
  onLeaveCount?: number | null;
  items: LeaveTeamAvailabilityItem[];
  shifts: LeaveShiftAvailabilityItem[];
}

export interface LeaveTrendsData {
  period?: string;
  points: LeaveChartPoint[];
}

export interface LeaveAnalyticsData {
  totalRequests?: number | null;
  avgDuration?: number | null;
  utilizationRate?: number | null;
  peakMonth?: string;
  summary?: string;
  [key: string]: string | number | null | undefined;
}

export interface LeaveRequestDetails {
  id: string;
  employeeName?: string;
  department?: string;
  leaveType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  days?: number | null;
  reason?: string;
  [key: string]: unknown;
}

export interface AILeaveDashboardData {
  dashboard: LeaveDashboardKpis | null;
  forecast: LeaveForecastData | null;
  distribution: LeaveDistributionData | null;
  approvalSuggestions: LeaveApprovalSuggestionsData;
  conflicts: LeaveConflictsData;
  teamAvailability: LeaveTeamAvailabilityData | null;
  trends: LeaveTrendsData | null;
  analytics: LeaveAnalyticsData | null;
}

export interface AILeaveState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  actionLoading: boolean;
  actionError: string | null;
  dashboard: LeaveDashboardKpis | null;
  forecast: LeaveForecastData | null;
  distribution: LeaveDistributionData | null;
  approvalSuggestions: LeaveApprovalSuggestionsData;
  conflicts: LeaveConflictsData;
  teamAvailability: LeaveTeamAvailabilityData | null;
  trends: LeaveTrendsData | null;
  analytics: LeaveAnalyticsData | null;
  selectedRequest: LeaveRequestDetails | null;
}
