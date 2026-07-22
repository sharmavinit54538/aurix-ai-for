import { api } from "@/api";
import {
  OvertimeRecord,
  OvertimeFilters,
  OvertimeSummaryKPIs,
  OvertimeAuditLog,
  OvertimeAIInsight,
  OvertimeCategory,
} from "@/features/admin/payroll/components/overtime/overtimeTypes";

export const OVERTIME_CATEGORIES_LIST: OvertimeCategory[] = [
  "Regular Overtime",
  "Weekend Overtime",
  "Holiday Overtime",
  "Night Shift",
  "Emergency Overtime",
  "On Call",
  "Double Pay",
  "Triple Pay",
  "Custom Categories",
];

const INITIAL_OVERTIME_RECORDS: OvertimeRecord[] = [
  {
    id: "ot-101",
    requestCode: "OT-2026-701",
    employeeId: "emp-104",
    employeeCode: "EMP-104",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    designation: "Senior DevOps Lead",
    location: "Bangalore",
    shift: "Morning Shift",
    date: "2026-07-15",
    clockIn: "08:30 AM",
    clockOut: "08:30 PM",
    scheduledHours: 8.0,
    workedHours: 12.0,
    breakHours: 1.0,
    overtimeHours: 3.0,
    category: "Regular Overtime",
    calculationMethod: "MULTIPLIER",
    hourlyRate: 500,
    multiplier: 1.5,
    overtimeAmount: 2250,
    approvalStatus: "APPROVED",
    payrollStatus: "SCHEDULED_PAYROLL",
    payrollCycle: "JULY-2026",
    approvalStage: "PROCESSED",
    approvalWorkflow: [
      { role: "Employee", name: "Rahul Sharma", status: "APPROVED", timestamp: "2026-07-15 08:30 PM" },
      { role: "Reporting Manager", name: "Vikramaditya Roy", status: "APPROVED", timestamp: "2026-07-16 09:30 AM" },
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-16 11:00 AM" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-16 02:00 PM" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-17 04:00 PM" },
    ],
    createdOn: "2026-07-15",
    updatedOn: "2026-07-17",
    createdBy: "Rahul Sharma",
  },
  {
    id: "ot-102",
    requestCode: "OT-2026-702",
    employeeId: "emp-189",
    employeeCode: "EMP-189",
    employeeName: "Priya Nair",
    department: "Sales & BD",
    designation: "Enterprise Account Executive",
    location: "Mumbai",
    shift: "Morning Shift",
    date: "2026-07-18",
    clockIn: "09:00 AM",
    clockOut: "06:00 PM",
    scheduledHours: 8.0,
    workedHours: 9.0,
    breakHours: 1.0,
    overtimeHours: 4.0,
    category: "Weekend Overtime",
    calculationMethod: "MULTIPLIER",
    hourlyRate: 600,
    multiplier: 2.0,
    overtimeAmount: 4800,
    approvalStatus: "APPROVED",
    payrollStatus: "SCHEDULED_PAYROLL",
    payrollCycle: "JULY-2026",
    approvalStage: "PROCESSED",
    approvalWorkflow: [
      { role: "Employee", name: "Priya Nair", status: "APPROVED", timestamp: "2026-07-18 06:00 PM" },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-19 10:00 AM" },
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-19 11:30 AM" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-19 02:15 PM" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-20 03:00 PM" },
    ],
    createdOn: "2026-07-18",
    updatedOn: "2026-07-20",
    createdBy: "Priya Nair",
  },
  {
    id: "ot-103",
    requestCode: "OT-2026-703",
    employeeId: "emp-205",
    employeeCode: "EMP-205",
    employeeName: "Amitabh Sen",
    department: "Operations",
    designation: "Operations Executive",
    location: "Hyderabad",
    shift: "Night Shift",
    date: "2026-07-20",
    clockIn: "10:00 PM",
    clockOut: "07:00 AM",
    scheduledHours: 8.0,
    workedHours: 9.0,
    breakHours: 1.0,
    overtimeHours: 3.5,
    category: "Night Shift",
    calculationMethod: "MULTIPLIER",
    hourlyRate: 350,
    multiplier: 1.5,
    overtimeAmount: 1838,
    approvalStatus: "PENDING_FINANCE",
    payrollStatus: "UNPAID",
    approvalStage: "FINANCE",
    approvalWorkflow: [
      { role: "Employee", name: "Amitabh Sen", status: "APPROVED", timestamp: "2026-07-21 07:00 AM" },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-21 09:30 AM" },
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-21 11:00 AM" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-21 01:00 PM" },
      { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
    ],
    createdOn: "2026-07-21",
    updatedOn: "2026-07-21",
    createdBy: "Amitabh Sen",
  },
];

const INITIAL_AUDIT_LOGS: OvertimeAuditLog[] = [
  {
    id: "log-o1",
    overtimeId: "ot-101",
    requestCode: "OT-2026-701",
    action: "ADD_PAYROLL",
    actorName: "Sunita Menon",
    actorRole: "Payroll Admin",
    timestamp: "2026-07-16 02:00 PM",
    details: "Approved 3.0 OT hours (₹2,250) for Rahul Sharma and queued into July 2026 pay run.",
    ipAddress: "192.168.1.12",
  },
  {
    id: "log-o2",
    overtimeId: "ot-102",
    requestCode: "OT-2026-702",
    action: "SYNC_ATTENDANCE",
    actorName: "Biometric Auto-Sync",
    actorRole: "System",
    timestamp: "2026-07-18 06:05 PM",
    details: "Auto-synced Weekend OT punch data from Bangalore Office Turnstile #04.",
    ipAddress: "127.0.0.1",
  },
];

const INITIAL_AI_INSIGHTS: OvertimeAIInsight[] = [
  {
    id: "ai-o1",
    title: "Employee Fatigue & Burnout Risk Alert",
    type: "BURNOUT_DETECTION",
    severity: "CRITICAL",
    employeeName: "Rahul Sharma",
    description: "Employee has logged 48 OT hours in the past 3 consecutive weeks, exceeding 80% of monthly safety limit.",
    impactMetric: "48 OT Hrs logged",
    recommendation: "Mandate rest day before scheduling additional night shifts.",
  },
  {
    id: "ai-o2",
    title: "Weekend Overtime Multiplier Optimization",
    type: "COST_FORECAST",
    severity: "INFO",
    description: "Weekend OT accounts for 45% of total Q2 overtime expenditure due to 2.0x multiplier.",
    impactMetric: "₹4.8k Weekend Cost",
    recommendation: "Re-distribute weekend deployment into rotational shift schedules.",
  },
  {
    id: "ai-o3",
    title: "Biometric Attendance Punch Verification",
    type: "ATTENDANCE_ANOMALY",
    severity: "SUCCESS",
    description: "100% of approved overtime claims match biometric hardware clock-in/out timestamps.",
    impactMetric: "Zero Punch Discrepancy",
    recommendation: "Audit trail fully verified.",
  },
];

let localOvertimeRecords = [...INITIAL_OVERTIME_RECORDS];
let localAuditLogs = [...INITIAL_AUDIT_LOGS];

export const overtimeApi = {
  // GET all overtime records with filtering
  getOvertimeRecords: async (params: Partial<OvertimeFilters> = {}): Promise<{
    items: OvertimeRecord[];
    total: number;
    kpis: OvertimeSummaryKPIs;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.department) query.append("department", params.department);
      if (params.overtimeType) query.append("overtimeType", params.overtimeType);

      const res: any = await api.get(`payroll/overtime?${query.toString()}`);
      if (res.data && Array.isArray(res.data?.items)) {
        return {
          items: res.data.items,
          total: res.data.total || res.data.items.length,
          kpis: res.data.kpis || overtimeApi.computeKPIs(res.data.items),
        };
      }
    } catch {
      // Local fallback
    }

    const filtered = overtimeApi.filterOvertimeInMemory(localOvertimeRecords, params);
    return {
      items: filtered,
      total: filtered.length,
      kpis: overtimeApi.computeKPIs(localOvertimeRecords),
    };
  },

  // GET overtime record by ID
  getOvertimeRecordById: async (id: string): Promise<OvertimeRecord> => {
    try {
      const res: any = await api.get(`payroll/overtime/${id}`);
      if (res.data?.id) return res.data;
    } catch {
      // Fallback
    }
    const found = localOvertimeRecords.find((o) => o.id === id);
    if (!found) throw new Error(`Overtime record with ID '${id}' not found.`);
    return found;
  },

  // POST create new overtime record
  createOvertimeRecord: async (payload: Partial<OvertimeRecord>): Promise<OvertimeRecord> => {
    const newId = `ot-${Date.now()}`;
    const code = `OT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const otHrs = payload.overtimeHours || 2.5;
    const rate = payload.hourlyRate || 500;
    const mult = payload.multiplier || 1.5;
    const amt = Math.round(otHrs * rate * mult);

    const newRecord: OvertimeRecord = {
      id: newId,
      requestCode: code,
      employeeId: payload.employeeId || "emp-101",
      employeeCode: payload.employeeCode || "EMP-101",
      employeeName: payload.employeeName || "Vikramaditya Roy",
      department: payload.department || "Engineering",
      designation: payload.designation || "Principal Architect",
      location: payload.location || "Bangalore",
      shift: payload.shift || "Morning Shift",
      date: payload.date || new Date().toISOString().split("T")[0],
      clockIn: payload.clockIn || "08:30 AM",
      clockOut: payload.clockOut || "08:30 PM",
      scheduledHours: payload.scheduledHours || 8.0,
      workedHours: payload.workedHours || 11.5,
      breakHours: payload.breakHours || 1.0,
      overtimeHours: otHrs,
      category: payload.category || "Regular Overtime",
      calculationMethod: payload.calculationMethod || "MULTIPLIER",
      hourlyRate: rate,
      multiplier: mult,
      overtimeAmount: amt,
      approvalStatus: "PENDING_FINANCE",
      payrollStatus: "UNPAID",
      approvalStage: "FINANCE",
      approvalWorkflow: [
        { role: "Employee", name: payload.employeeName || "Vikramaditya Roy", status: "APPROVED", timestamp: new Date().toISOString().split("T")[0] },
        { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: new Date().toISOString().split("T")[0] },
        { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: new Date().toISOString().split("T")[0] },
        { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: new Date().toISOString().split("T")[0] },
        { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
      ],
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      createdBy: "Employee",
    };

    localOvertimeRecords.unshift(newRecord);
    overtimeApi.addAuditLog(newRecord.id, newRecord.requestCode, "CREATE", `Created OT request for ${newRecord.overtimeHours} hrs (₹${newRecord.overtimeAmount.toLocaleString("en-IN")})`);
    return newRecord;
  },

  // Sync Attendance Biometric Punches
  syncAttendance: async (): Promise<{ count: number }> => {
    overtimeApi.addAuditLog("ot-sync", "SYNC-ALL", "SYNC_ATTENDANCE", "Synced 142 biometric attendance turnstile punches for July pay cycle.");
    return { count: 142 };
  },

  // Approve Overtime
  approveOvertime: async (id: string, role: string, comment?: string): Promise<OvertimeRecord> => {
    const existing = await overtimeApi.getOvertimeRecordById(id);
    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role.toLowerCase().includes(role.toLowerCase())) {
        return {
          ...step,
          status: "APPROVED" as const,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comment: comment || "Approved.",
        };
      }
      return step;
    });

    const allApproved = updatedWorkflow.every((s) => s.status === "APPROVED");

    const updated: OvertimeRecord = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: allApproved ? "APPROVED" : "PENDING_FINANCE",
      approvalStage: allApproved ? "PROCESSED" : existing.approvalStage,
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localOvertimeRecords.findIndex((o) => o.id === id);
    if (idx !== -1) localOvertimeRecords[idx] = updated;

    overtimeApi.addAuditLog(id, existing.requestCode, "APPROVE", `Approved OT request for role ${role}`);
    return updated;
  },

  // Reject Overtime
  rejectOvertime: async (id: string, role: string, reason: string): Promise<OvertimeRecord> => {
    const existing = await overtimeApi.getOvertimeRecordById(id);
    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role.toLowerCase().includes(role.toLowerCase())) {
        return {
          ...step,
          status: "REJECTED" as const,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comment: reason,
        };
      }
      return step;
    });

    const updated: OvertimeRecord = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: "REJECTED",
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localOvertimeRecords.findIndex((o) => o.id === id);
    if (idx !== -1) localOvertimeRecords[idx] = updated;

    overtimeApi.addAuditLog(id, existing.requestCode, "REJECT", `Rejected OT request: ${reason}`);
    return updated;
  },

  // Add to Payroll Run
  addPayrollEntries: async (ids: string[], payrollCycle: string): Promise<{ success: boolean }> => {
    for (const id of ids) {
      const idx = localOvertimeRecords.findIndex((o) => o.id === id);
      if (idx !== -1) {
        localOvertimeRecords[idx] = {
          ...localOvertimeRecords[idx],
          payrollStatus: "SCHEDULED_PAYROLL",
          payrollCycle,
        };
        overtimeApi.addAuditLog(id, localOvertimeRecords[idx].requestCode, "ADD_PAYROLL", `Added OT payout to payroll cycle ${payrollCycle}`);
      }
    }
    return { success: true };
  },

  // GET Audit Logs
  getAuditLogs: async (): Promise<OvertimeAuditLog[]> => {
    return localAuditLogs;
  },

  // GET AI Insights
  getAIInsights: async (): Promise<OvertimeAIInsight[]> => {
    return INITIAL_AI_INSIGHTS;
  },

  // Filter in memory
  filterOvertimeInMemory: (items: OvertimeRecord[], params: Partial<OvertimeFilters>): OvertimeRecord[] => {
    return items.filter((item) => {
      if (params.search) {
        const q = params.search.toLowerCase();
        const match =
          item.requestCode.toLowerCase().includes(q) ||
          item.employeeName.toLowerCase().includes(q) ||
          item.employeeCode.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (params.department && params.department !== "all" && params.department !== "ALL") {
        if (item.department.toLowerCase() !== params.department.toLowerCase()) return false;
      }
      if (params.overtimeType && params.overtimeType !== "all" && params.overtimeType !== "ALL") {
        if (item.category !== params.overtimeType) return false;
      }
      if (params.approvalStatus && params.approvalStatus !== "ALL") {
        if (item.approvalStatus !== params.approvalStatus) return false;
      }
      return true;
    });
  },

  // Compute Live KPIs
  computeKPIs: (items: OvertimeRecord[]): OvertimeSummaryKPIs => {
    const totalOvertimeHours = items.reduce((acc, o) => acc + o.overtimeHours, 0);
    const approvedHours = items.filter((o) => o.approvalStatus === "APPROVED").reduce((acc, o) => acc + o.overtimeHours, 0);
    const pendingRequests = items.filter((o) => o.approvalStatus.startsWith("PENDING")).length;
    const rejectedRequests = items.filter((o) => o.approvalStatus === "REJECTED").length;
    const totalOvertimeCost = items.reduce((acc, o) => acc + o.overtimeAmount, 0);
    const averageOtHours = items.length > 0 ? Math.round((totalOvertimeHours / items.length) * 10) / 10 : 0;
    const weekendOvertimeHours = items.filter((o) => o.category === "Weekend Overtime").reduce((acc, o) => acc + o.overtimeHours, 0);
    const holidayOvertimeHours = items.filter((o) => o.category === "Holiday Overtime").reduce((acc, o) => acc + o.overtimeHours, 0);
    const nightShiftHours = items.filter((o) => o.category === "Night Shift").reduce((acc, o) => acc + o.overtimeHours, 0);

    return {
      totalOvertimeHours,
      approvedHours,
      pendingRequests,
      rejectedRequests,
      totalOvertimeCost,
      averageOtHours,
      weekendOvertimeHours,
      holidayOvertimeHours,
      nightShiftHours,
      complianceAlerts: 1,
    };
  },

  // Add Internal Audit Log
  addAuditLog: (overtimeId: string, requestCode: string, action: OvertimeAuditLog["action"], details: string) => {
    localAuditLogs.unshift({
      id: `log-${Date.now()}`,
      overtimeId,
      requestCode,
      action,
      actorName: "Sunita Menon",
      actorRole: "Payroll Admin",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      details,
      ipAddress: "127.0.0.1",
    });
  },
};
