import apiInstance from "@/api/apiInstance";
import type {
  AbsencePatternData,
  AbsencePatternItem,
  AIAttendanceDashboardData,
  AttendanceAnomaliesData,
  AttendanceAnomalyItem,
  AttendanceDashboardKpis,
  AttendanceHealthScoreData,
  AttendanceTrendData,
  AttendanceTrendPoint,
  AttendanceWatchlistData,
  LateArrivalsData,
  OvertimeData,
  OvertimeDeptItem,
  OvertimeEmployeeItem,
  ShiftViolationItem,
  ShiftViolationsData,
  WatchlistItem,
} from "@/store/aiAttendance/aiAttendanceTypes";

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Unwrap only the API envelope `{ success, message, data }`, not nested `data` arrays. */
function unwrap(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  if ("success" in payload && "data" in payload) return payload.data ?? payload;
  return payload;
}

function pick(obj: AnyRecord | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function asOptionalId(value: unknown): string | undefined {
  if (value == null) return undefined;
  const id = asString(value);
  return id || undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

function normalizeTrendPoints(raw: unknown): AttendanceTrendPoint[] {
  const points: AttendanceTrendPoint[] = [];

  asArray(raw).forEach((item) => {
    if (!isRecord(item)) return;
    const label = asString(
      pick(item, "label", "d", "day", "date", "m", "month", "week", "dept", "department", "name"),
      "",
    );
    if (!label) return;

    const present =
      asNumber(
        pick(
          item,
          "attendance_percentage",
          "attendancePercentage",
          "present",
          "attendance",
          "rate",
          "pct",
          "value",
        ),
      ) ?? 0;

    points.push({
      label,
      present,
      presentCount: asNumber(pick(item, "present_count", "presentCount")) ?? undefined,
      totalCount: asNumber(pick(item, "total_count", "totalCount")) ?? undefined,
    });
  });

  return points;
}

export function normalizeDashboardKpis(raw: unknown): AttendanceDashboardKpis | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const kpis = isRecord(data.kpis) ? data.kpis : data;

  return {
    attendanceHealth: asNumber(
      pick(
        kpis,
        "attendanceHealth",
        "attendance_health",
        "health",
        "healthScore",
        "health_score",
        "overall_score",
        "overallScore",
      ),
    ),
    anomalies: asNumber(
      pick(kpis, "anomalies", "anomalyCount", "anomaly_count", "anomaliesDetected", "total_anomalies", "totalAnomalies"),
    ),
    lateArrivals: asNumber(
      pick(kpis, "lateArrivals", "late_arrivals", "late", "lateCount", "total_late", "totalLate"),
    ),
    otHours: asNumber(
      pick(
        kpis,
        "otHours",
        "ot_hours",
        "overtimeHours",
        "overtime_hours",
        "overtime",
        "monthly_ot_hours",
        "weekly_ot_hours",
        "daily_ot_hours",
      ),
    ),
    attendanceHealthTrend: asNumber(
      pick(kpis, "attendanceHealthTrend", "attendance_health_trend", "healthTrend", "health_trend"),
    ),
    anomaliesTrend: asNumber(pick(kpis, "anomaliesTrend", "anomalies_trend", "anomalyTrend")),
    lateArrivalsTrend: asNumber(pick(kpis, "lateArrivalsTrend", "late_arrivals_trend", "lateTrend")),
    otHoursTrend: asNumber(pick(kpis, "otHoursTrend", "ot_hours_trend", "overtimeTrend")),
  };
}

export function normalizeTrend(raw: unknown): AttendanceTrendData | null {
  const data = unwrap(raw);
  if (!data) return null;

  if (Array.isArray(data)) {
    return {
      daily: normalizeTrendPoints(data),
      weekly: [],
      monthly: [],
      department: [],
    };
  }

  if (!isRecord(data)) return null;

  const groupBy = asString(pick(data, "group_by", "groupBy"), "daily").toLowerCase();
  const series = normalizeTrendPoints(pick(data, "data", "daily", "days", "trend", "series"));
  const weekly = normalizeTrendPoints(pick(data, "weekly", "weeks"));
  const monthly = normalizeTrendPoints(pick(data, "monthly", "months"));
  const department = normalizeTrendPoints(
    pick(data, "department", "departments", "byDepartment", "by_department"),
  );

  const empty: AttendanceTrendData = {
    period: asString(pick(data, "period"), "") || undefined,
    groupBy: asString(pick(data, "group_by", "groupBy"), "") || undefined,
    daily: [],
    weekly: [],
    monthly: [],
    department,
  };

  if (groupBy.includes("week")) return { ...empty, weekly: series.length ? series : weekly };
  if (groupBy.includes("month")) return { ...empty, monthly: series.length ? series : monthly };
  if (groupBy.includes("dept") || groupBy.includes("department")) {
    return { ...empty, department: series.length ? series : department };
  }

  return { ...empty, daily: series, weekly, monthly };
}

export function normalizeLateArrivals(raw: unknown): LateArrivalsData | null {
  const data = unwrap(raw);
  if (!data) return null;

  if (Array.isArray(data)) {
    return {
      total: data.length,
      trend: null,
      byDay: data.map((item, index) => {
        if (!isRecord(item)) return { label: `Day ${index + 1}`, late: asNumber(item) ?? 0 };
        return {
          label: asString(pick(item, "label", "d", "day", "date", "name"), `Day ${index + 1}`),
          late: asNumber(pick(item, "late", "count", "value", "arrivals", "late_count")) ?? 0,
        };
      }),
    };
  }

  if (!isRecord(data)) return null;

  const byDay = asArray(pick(data, "data", "byDay", "by_day", "days", "chart", "series", "items")).map(
    (item, index) => {
      if (!isRecord(item)) return { label: `Day ${index + 1}`, late: asNumber(item) ?? 0 };
      return {
        label: asString(pick(item, "label", "d", "day", "date", "name"), `Day ${index + 1}`),
        late: asNumber(pick(item, "late", "count", "value", "arrivals", "late_count")) ?? 0,
      };
    },
  );

  const period = asString(pick(data, "period"), "") || undefined;

  return {
    period,
    total: asNumber(pick(data, "total_late", "totalLate", "total", "count", "lateArrivals", "late_arrivals")),
    trend: asNumber(pick(data, "trend", "delta", "change")),
    byDay,
    note: period,
  };
}

export function normalizeAnomalies(raw: unknown): AttendanceAnomaliesData {
  const data = unwrap(raw);
  const empty: AttendanceAnomaliesData = { total: null, items: [] };
  if (!data) return empty;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "items", "anomalies", "data", "results") : data);
  const items: AttendanceAnomalyItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "id", "employee_id", "employeeId")),
      title: asString(pick(item, "title", "type", "name", "label", "anomaly_type"), `Anomaly ${index + 1}`),
      count: asNumber(pick(item, "count", "value", "total")) ?? 1,
      tone: asString(pick(item, "tone", "severity", "level", "risk_level"), "warn"),
      note: asString(pick(item, "note", "description", "message", "reason", "details"), ""),
    });
  });

  const total =
    (root ? asNumber(pick(root, "total_anomalies", "totalAnomalies", "total", "count")) : null) ??
    (items.length > 0 ? items.reduce((sum, item) => sum + item.count, 0) : Array.isArray(data) ? data.length : null);

  return { total, items };
}

export function normalizeAbsencePattern(raw: unknown): AbsencePatternData | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const items: AbsencePatternItem[] = [];
  asArray(pick(data, "items", "patterns", "data")).forEach((item) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "employee_id", "employeeId", "id")),
      employeeName: asString(
        pick(item, "employee_name", "employeeName", "name"),
        "Unknown employee",
      ),
      department: asString(pick(item, "department", "dept"), "") || undefined,
      patternType: asString(pick(item, "pattern_type", "patternType", "type"), "UNKNOWN"),
      details: asString(pick(item, "details", "note", "description", "message"), "") || undefined,
      riskLevel: asString(pick(item, "risk_level", "riskLevel", "severity"), "") || undefined,
    });
  });

  const fridayCount = items.filter((item) => item.patternType.toUpperCase().includes("FRIDAY")).length;
  const mondayCount = items.filter((item) => item.patternType.toUpperCase().includes("MONDAY")).length;

  return {
    patternsDetected:
      asNumber(pick(data, "patterns_detected", "patternsDetected", "total", "count")) ?? items.length,
    items,
    fridayCount,
    mondayCount,
  };
}

export function normalizeOvertime(raw: unknown): OvertimeData | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const byDepartment: OvertimeDeptItem[] = [];
  asArray(pick(data, "department_wise_ot", "departmentWiseOt", "byDepartment", "by_department", "departments")).forEach(
    (item) => {
      if (!isRecord(item)) return;
      byDepartment.push({
        dept: asString(pick(item, "department", "dept", "name", "label"), "Unknown"),
        hours: asNumber(pick(item, "ot_hours", "otHours", "hours", "value", "total")) ?? 0,
      });
    },
  );

  const byEmployee: OvertimeEmployeeItem[] = [];
  asArray(pick(data, "employee_wise_ot", "employeeWiseOt", "byEmployee", "employees")).forEach((item) => {
    if (!isRecord(item)) return;
    byEmployee.push({
      name: asString(pick(item, "employee_name", "employeeName", "name"), "Unknown"),
      hours: asNumber(pick(item, "ot_hours", "otHours", "hours", "value", "total")) ?? 0,
    });
  });

  const dailyHours = asNumber(pick(data, "daily_ot_hours", "dailyOtHours", "dailyHours"));
  const weeklyHours = asNumber(pick(data, "weekly_ot_hours", "weeklyOtHours", "weeklyHours"));
  const monthlyHours = asNumber(pick(data, "monthly_ot_hours", "monthlyOtHours", "monthlyHours"));
  const budgetImpactAmount = asNumber(
    pick(data, "budget_impact_amount", "budgetImpactAmount", "budget_impact", "budgetImpact"),
  );

  return {
    dailyHours,
    weeklyHours,
    monthlyHours,
    totalHours: monthlyHours ?? weeklyHours ?? dailyHours,
    budgetImpactAmount,
    budgetImpact: budgetImpactAmount != null ? formatCurrency(budgetImpactAmount) : undefined,
    trend: asNumber(pick(data, "trend", "delta", "change")),
    byDepartment,
    byEmployee,
  };
}

export function normalizeShiftViolations(raw: unknown): ShiftViolationsData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "items", "violations", "data", "results") : data);
  const items: ShiftViolationItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "id", "employee_id", "employeeId")),
      type: asString(
        pick(item, "type", "title", "name", "label", "violation_type", "violationType"),
        `Violation ${index + 1}`,
      ),
      count: asNumber(pick(item, "count", "value", "total")) ?? 1,
      note: asString(pick(item, "note", "description", "message", "details"), "") || undefined,
    });
  });

  return {
    total:
      (root ? asNumber(pick(root, "total_violations", "totalViolations", "total", "count")) : null) ??
      items.reduce((sum, item) => sum + item.count, 0),
    items,
  };
}

export function normalizeHealthScore(raw: unknown): AttendanceHealthScoreData | null {
  const data = unwrap(raw);
  if (typeof data === "number") return { score: data };
  if (!isRecord(data)) return null;

  const attendanceRate = asNumber(pick(data, "attendance_rate", "attendanceRate"));
  const lateRate = asNumber(pick(data, "late_rate", "lateRate"));
  const leaveRate = asNumber(pick(data, "leave_rate", "leaveRate"));
  const otRate = asNumber(pick(data, "ot_rate", "otRate"));
  const shiftComplianceRate = asNumber(pick(data, "shift_compliance_rate", "shiftComplianceRate"));
  const policyViolationsCount = asNumber(pick(data, "policy_violations_count", "policyViolationsCount"));

  const breakdown = [
    attendanceRate != null ? { label: "Attendance rate", score: attendanceRate } : null,
    lateRate != null ? { label: "Late rate", score: lateRate } : null,
    leaveRate != null ? { label: "Leave rate", score: leaveRate } : null,
    otRate != null ? { label: "OT rate", score: otRate } : null,
    shiftComplianceRate != null ? { label: "Shift compliance", score: shiftComplianceRate } : null,
  ].filter((item): item is { label: string; score: number } => Boolean(item));

  return {
    score: asNumber(
      pick(data, "overall_score", "overallScore", "score", "healthScore", "health_score", "value", "attendanceHealth"),
    ),
    attendanceRate,
    lateRate,
    leaveRate,
    otRate,
    shiftComplianceRate,
    policyViolationsCount,
    label: asString(pick(data, "label", "status", "grade"), "") || undefined,
    breakdown,
  };
}

export function normalizeWatchlist(raw: unknown): AttendanceWatchlistData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "items", "employees", "watchlist", "data", "results") : data);
  const items: WatchlistItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "employee_id", "employeeId", "id")),
      name: asString(
        pick(item, "employee_name", "employeeName", "name", "employee"),
        `Employee ${index + 1}`,
      ),
      dept: asString(pick(item, "department", "dept"), "") || undefined,
      absences: asNumber(pick(item, "absent_days", "absentDays", "absences", "absence_count", "days")) ?? undefined,
      lateCount: asNumber(pick(item, "late_count", "lateCount")) ?? undefined,
      attendancePercentage:
        asNumber(pick(item, "attendance_percentage", "attendancePercentage")) ?? undefined,
      riskLevel: asString(pick(item, "risk_level", "riskLevel"), "") || undefined,
      recommendation:
        asString(pick(item, "recommendation", "action", "aiRecommendation", "ai_recommendation"), "") || undefined,
    });
  });

  const recommendations = items
    .map((item) => item.recommendation)
    .filter((value): value is string => Boolean(value));

  return {
    count: (root ? asNumber(pick(root, "total_at_risk", "totalAtRisk", "count", "total")) : null) ?? items.length,
    items,
    recommendations: [...new Set(recommendations)],
  };
}

export function normalizeAttendanceDashboard(raw: unknown): AIAttendanceDashboardData {
  const data = unwrap(raw);
  if (!isRecord(data)) {
    return {
      dashboard: null,
      trend: null,
      lateArrivals: null,
      anomalies: { total: null, items: [] },
      absencePattern: null,
      overtime: null,
      shiftViolations: null,
      healthScore: null,
      watchlist: null,
    };
  }

  return {
    dashboard: normalizeDashboardKpis(pick(data, "dashboard", "kpis", "kpi") ?? data),
    trend: normalizeTrend(pick(data, "trend", "trends", "attendanceTrend")),
    lateArrivals: normalizeLateArrivals(pick(data, "lateArrivals", "late_arrivals")),
    anomalies: normalizeAnomalies(pick(data, "anomalies", "anomaly")),
    absencePattern: normalizeAbsencePattern(pick(data, "absencePattern", "absence_pattern")),
    overtime: normalizeOvertime(pick(data, "overtime")),
    shiftViolations: normalizeShiftViolations(pick(data, "shiftViolations", "shift_violations")),
    healthScore: normalizeHealthScore(pick(data, "healthScore", "health_score")),
    watchlist: normalizeWatchlist(pick(data, "watchlist")),
  };
}

async function getEndpoint<T>(path: string, normalize: (raw: unknown) => T): Promise<T> {
  const response = await apiInstance.get(path);
  // Pass full envelope so unwrap can detect { success, data }; fallback to body
  return normalize(response.data ?? response);
}

export const aiAttendanceApi = {
  async getDashboard(): Promise<AIAttendanceDashboardData> {
    return getEndpoint("/ai/attendance/dashboard", (raw) => {
      const combined = normalizeAttendanceDashboard(raw);
      if (
        combined.trend ||
        combined.lateArrivals ||
        combined.anomalies.items.length > 0 ||
        combined.anomalies.total != null ||
        combined.absencePattern ||
        combined.overtime ||
        combined.shiftViolations ||
        combined.healthScore ||
        combined.watchlist
      ) {
        return combined;
      }

      return {
        ...combined,
        dashboard: normalizeDashboardKpis(raw) ?? combined.dashboard,
      };
    });
  },

  async getDashboardKpis(): Promise<AttendanceDashboardKpis | null> {
    return getEndpoint("/ai/attendance/dashboard", normalizeDashboardKpis);
  },

  async getTrend(): Promise<AttendanceTrendData | null> {
    return getEndpoint("/ai/attendance/trend", normalizeTrend);
  },

  async getLateArrivals(): Promise<LateArrivalsData | null> {
    return getEndpoint("/ai/attendance/late-arrivals", normalizeLateArrivals);
  },

  async getAnomalies(): Promise<AttendanceAnomaliesData> {
    return getEndpoint("/ai/attendance/anomalies", normalizeAnomalies);
  },

  async getAbsencePattern(): Promise<AbsencePatternData | null> {
    return getEndpoint("/ai/attendance/absence-pattern", normalizeAbsencePattern);
  },

  async getOvertime(): Promise<OvertimeData | null> {
    return getEndpoint("/ai/attendance/overtime", normalizeOvertime);
  },

  async getShiftViolations(): Promise<ShiftViolationsData | null> {
    return getEndpoint("/ai/attendance/shift-violations", normalizeShiftViolations);
  },

  async getHealthScore(): Promise<AttendanceHealthScoreData | null> {
    return getEndpoint("/ai/attendance/health-score", normalizeHealthScore);
  },

  async getWatchlist(): Promise<AttendanceWatchlistData | null> {
    return getEndpoint("/ai/attendance/watchlist", normalizeWatchlist);
  },
};

export default aiAttendanceApi;
