// ============================================================
// Aurix HR — Executive Dashboard — Type Definitions
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

export interface ApprovalItem {
  id: string;
  name: string;
  department: string;
  type: string;
  detail: string;
  requestedAt: string;
  urgent?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "holiday" | "birthday" | "interview" | "payroll" | "event";
  time?: string;
}

export interface ActivityItem {
  id: string;
  type: "employee" | "candidate" | "leave" | "asset" | "exit" | "payroll" | "document" | "alert";
  icon: string;
  text: string;
  user: string;
  time: string;
  color: string;
}

export interface NotificationItem {
  id: string;
  category: "Critical" | "Compliance" | "AI" | "Payroll" | "Assets" | "Documents";
  title: string;
  detail: string;
  severity: "critical" | "warn" | "info";
  time: string;
}

export interface DeptCard {
  name: string;
  headcount: number;
  attendance: number;
  productivity: number;
  openPositions: number;
  color: string;
  bgColor: string;
}
