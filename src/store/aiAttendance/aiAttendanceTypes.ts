export interface AttendanceDashboardKpis {
  attendanceHealth: number | null;
  anomalies: number | null;
  lateArrivals: number | null;
  otHours: number | null;
  attendanceHealthTrend?: number | null;
  anomaliesTrend?: number | null;
  lateArrivalsTrend?: number | null;
  otHoursTrend?: number | null;
}

export interface AttendanceTrendPoint {
  label: string;
  present: number;
  presentCount?: number;
  totalCount?: number;
}

export interface AttendanceTrendData {
  period?: string;
  groupBy?: string;
  daily: AttendanceTrendPoint[];
  weekly: AttendanceTrendPoint[];
  monthly: AttendanceTrendPoint[];
  department: AttendanceTrendPoint[];
}

export interface LateArrivalPoint {
  label: string;
  late: number;
  [key: string]: string | number;
}

export interface LateArrivalsData {
  period?: string;
  total: number | null;
  trend: number | null;
  byDay: LateArrivalPoint[];
  note?: string;
}

export interface AttendanceAnomalyItem {
  id?: string;
  title: string;
  count: number;
  tone: "warn" | "info" | "crit" | string;
  note: string;
}

export interface AttendanceAnomaliesData {
  total: number | null;
  items: AttendanceAnomalyItem[];
}

export interface AbsencePatternItem {
  id?: string;
  employeeName: string;
  department?: string;
  patternType: string;
  details?: string;
  riskLevel?: string;
}

export interface AbsencePatternData {
  patternsDetected: number | null;
  items: AbsencePatternItem[];
  fridayCount: number;
  mondayCount: number;
}

export interface OvertimeDeptItem {
  dept: string;
  hours: number;
}

export interface OvertimeEmployeeItem {
  name: string;
  hours: number;
}

export interface OvertimeData {
  dailyHours: number | null;
  weeklyHours: number | null;
  monthlyHours: number | null;
  totalHours: number | null;
  budgetImpactAmount: number | null;
  budgetImpact?: string;
  trend?: number | null;
  byDepartment: OvertimeDeptItem[];
  byEmployee: OvertimeEmployeeItem[];
}

export interface ShiftViolationItem {
  id?: string;
  type: string;
  count: number;
  note?: string;
}

export interface ShiftViolationsData {
  total: number | null;
  items: ShiftViolationItem[];
}

export interface AttendanceHealthScoreData {
  score: number | null;
  attendanceRate?: number | null;
  lateRate?: number | null;
  leaveRate?: number | null;
  otRate?: number | null;
  shiftComplianceRate?: number | null;
  policyViolationsCount?: number | null;
  label?: string;
  breakdown?: Array<{ label: string; score: number }>;
}

export interface WatchlistItem {
  id?: string;
  name: string;
  dept?: string;
  absences?: number;
  lateCount?: number;
  attendancePercentage?: number;
  riskLevel?: string;
  recommendation?: string;
}

export interface AttendanceWatchlistData {
  count: number | null;
  items: WatchlistItem[];
  recommendations: string[];
}

/** Combined payload used by the attendance monitor page */
export interface AIAttendanceDashboardData {
  dashboard: AttendanceDashboardKpis | null;
  trend: AttendanceTrendData | null;
  lateArrivals: LateArrivalsData | null;
  anomalies: AttendanceAnomaliesData;
  absencePattern: AbsencePatternData | null;
  overtime: OvertimeData | null;
  shiftViolations: ShiftViolationsData | null;
  healthScore: AttendanceHealthScoreData | null;
  watchlist: AttendanceWatchlistData | null;
}

export interface AIAttendanceState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  dashboard: AttendanceDashboardKpis | null;
  trend: AttendanceTrendData | null;
  lateArrivals: LateArrivalsData | null;
  anomalies: AttendanceAnomaliesData;
  absencePattern: AbsencePatternData | null;
  overtime: OvertimeData | null;
  shiftViolations: ShiftViolationsData | null;
  healthScore: AttendanceHealthScoreData | null;
  watchlist: AttendanceWatchlistData | null;
}
