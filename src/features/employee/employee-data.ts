// ============================================================
// Aurix HR — Employee Dashboard — Data Schema
// ============================================================

export interface EmpKpi {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  accent: string;
  bgAccent: string;
  spark: { v: number }[];
}

export const EMP_KPI: EmpKpi[] = [];
export const MY_ATTENDANCE: any[] = [];
export const MY_LEAVES: any[] = [];
export const LEAVE_QUOTA: any[] = [];
export const MY_GOALS: any[] = [];
export const MY_PAYSLIPS: any[] = [];
export const MY_DOCUMENTS: any[] = [];
export const MY_ASSETS: any[] = [];
export const COMPANY_EVENTS: any[] = [];
export const EMP_NOTIFICATIONS: any[] = [];
export const MY_ATTENDANCE_TREND: any[] = [];
