// ============================================================
// Aurix HR — Enterprise Executive Dashboard — Live Data Schema
// ============================================================

export interface KpiSparkPoint { v: number }

export interface KpiCard {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  accent: string;
  bgAccent: string;
  spark: KpiSparkPoint[];
  link: string;
}

export const KPI_CARDS: KpiCard[] = [];

export interface ApprovalItem {
  id: string;
  name: string;
  department: string;
  type: string;
  detail: string;
  requestedAt: string;
  urgent?: boolean;
}

export const APPROVAL_DATA: Record<string, ApprovalItem[]> = {
  Leave: [],
  Attendance: [],
  Recruitment: [],
  Onboarding: [],
  Exit: [],
  Assets: [],
  Documents: [],
  Expenses: [],
};

export const PIPELINE_STAGES: any[] = [];
export const ACTIVE_JOBS: any[] = [];
export const INTERVIEWS_TODAY: any[] = [];
export const WEEKLY_ATTENDANCE: any[] = [];
export const DEPT_ATTENDANCE: any[] = [];
export const MONTHLY_PAYROLL: any[] = [];
export const PAYROLL_STATUS: any[] = [];
export const ASSET_STATS: any[] = [];
export const ONBOARDING_STAGES: any[] = [];
export const EXIT_STAGES: any[] = [];

export const AI_FEATURES = [
  { title: "HR Copilot", desc: "AI-powered HR Q&A and policy guidance", link: "/ai/chat-assistant", color: "from-violet-600 to-purple-700" },
  { title: "Resume Screening", desc: "Automated resume parsing & scoring", link: "/ai/recruiter", color: "from-blue-600 to-indigo-700" },
  { title: "Interview Copilot", desc: "Real-time interview assistance", link: "/dashboard/recruitment/copilot", color: "from-cyan-600 to-blue-700" },
  { title: "AI Analytics", desc: "Predictive workforce intelligence", link: "/ai/analytics-center", color: "from-emerald-600 to-teal-700" },
  { title: "Policy Assistant", desc: "Instant policy answers & summaries", link: "/ai/policy-assistant", color: "from-amber-600 to-orange-700" },
  { title: "AI Chat", desc: "Multi-modal HR assistant", link: "/ai/chat-assistant", color: "from-rose-600 to-pink-700" },
];

export const AI_METRICS: any[] = [];
export const AI_RECENT: any[] = [];
export const HEADCOUNT_GROWTH: any[] = [];
export const ATTRITION_RATE: any[] = [];
export const SALARY_DISTRIBUTION: any[] = [];
export const GENDER_DIVERSITY: any[] = [];
export const DEPT_DISTRIBUTION: any[] = [];

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "holiday" | "birthday" | "interview" | "payroll" | "event";
  time?: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [];

export interface ActivityItem {
  id: string;
  type: "employee" | "candidate" | "leave" | "asset" | "exit" | "payroll" | "document" | "alert";
  icon: string;
  text: string;
  user: string;
  time: string;
  color: string;
}

export const ACTIVITY_FEED: ActivityItem[] = [];

export interface NotificationItem {
  id: string;
  category: "Critical" | "Compliance" | "AI" | "Payroll" | "Assets" | "Documents";
  title: string;
  detail: string;
  severity: "critical" | "warn" | "info";
  time: string;
}

export const NOTIFICATIONS: NotificationItem[] = [];

export interface DeptCard {
  name: string;
  headcount: number;
  attendance: number;
  productivity: number;
  openPositions: number;
  color: string;
  bgColor: string;
}

export const DEPT_PERFORMANCE: DeptCard[] = [];

export const REPORT_BUTTONS = [
  { label: "Attendance", link: "/dashboard/attendance", color: "from-teal-600 to-cyan-600" },
  { label: "Payroll", link: "/dashboard/payroll/reports", color: "from-green-600 to-emerald-600" },
  { label: "Recruitment", link: "/dashboard/recruitment/reports", color: "from-indigo-600 to-blue-600" },
  { label: "Assets", link: "/dashboard/assets", color: "from-slate-600 to-gray-600" },
  { label: "Leave", link: "/dashboard/leaves", color: "from-amber-600 to-orange-600" },
  { label: "Exit", link: "/dashboard/exit", color: "from-rose-600 to-red-600" },
  { label: "Analytics", link: "/dashboard/recruitment/analytics", color: "from-violet-600 to-purple-600" },
];

export const WIDGET_SCORES: any[] = [];
export const WORLD_CLOCKS: any[] = [];
