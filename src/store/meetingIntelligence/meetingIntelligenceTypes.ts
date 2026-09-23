export interface MeetingIntelligenceKpiItem {
  label: string;
  score: number | string;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface ActionItemsByWeekItem {
  w: string;
  items: number;
}

export interface MeetingVolumeItem {
  d: string;
  n: number;
}

export interface MeetingActionItemSummary {
  id?: string;
  title?: string;
  assignee?: string;
  dueDate?: string;
  status?: string;
}

export interface MeetingIntelligenceSummary {
  meetingsAnalyzed: number;
  actionItems: number;
  followUps: number;
  avgDuration: string | number;
  lastAnalysis?: string;
}

export interface MeetingIntelligenceCharts {
  actionItemsByWeek: ActionItemsByWeekItem[];
  meetingVolume: MeetingVolumeItem[];
}

export interface MeetingIntelligenceDashboardData {
  summary?: MeetingIntelligenceSummary;
  kpi?: MeetingIntelligenceKpiItem[];
  actionItems?: MeetingActionItemSummary[];
  charts?: MeetingIntelligenceCharts;
  actionItemsByWeek?: ActionItemsByWeekItem[];
  meetingVolume?: MeetingVolumeItem[];
}

export interface MeetingIntelligenceState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: MeetingIntelligenceSummary | null;
  kpi: MeetingIntelligenceKpiItem[];
  actionItems: MeetingActionItemSummary[];
  charts: MeetingIntelligenceCharts | null;
}
