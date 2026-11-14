import type { ShiftItem, ShiftChangeRequest } from "./types";

const MOCK_SHIFTS: any[] = [
  {
    id: "sh-1",
    name: "General Morning Shift",
    code: "GMS",
    start_time: "09:00",
    end_time: "18:00",
    grace_period_mins: 15,
    grace_period_minutes: 15,
    break_duration_minutes: 60,
    is_night_shift: false,
    night_shift: false,
    night_premium_percent: 0,
    is_active: true,
    employee_count: 34,
    assigned_employees_count: 34,
    working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "sh-2",
    name: "UK / EMEA Overlap Shift",
    code: "EMEA",
    start_time: "13:00",
    end_time: "22:00",
    grace_period_mins: 15,
    grace_period_minutes: 15,
    break_duration_minutes: 60,
    is_night_shift: false,
    night_shift: false,
    night_premium_percent: 0,
    is_active: true,
    employee_count: 12,
    assigned_employees_count: 12,
    working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "sh-3",
    name: "Night Operations Shift",
    code: "NOC",
    start_time: "22:00",
    end_time: "07:00",
    grace_period_mins: 15,
    grace_period_minutes: 15,
    break_duration_minutes: 60,
    is_night_shift: true,
    night_shift: true,
    night_premium_percent: 15,
    is_active: true,
    employee_count: 8,
    assigned_employees_count: 8,
    working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
];

let shiftChangeRequests: ShiftChangeRequest[] = [
  {
    id: "scr-1",
    employee_id: "emp-kabir",
    employee_name: "Kabir Mehta",
    current_shift_id: "sh-1",
    current_shift_name: "General Morning Shift",
    requested_shift_id: "sh-2",
    requested_shift_name: "UK / EMEA Overlap Shift",
    effective_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    reason: "Coordinate sprint overlap with EMEA engineering team",
    status: "pending",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const getShifts = async (_params?: unknown): Promise<any> => ({
  items: MOCK_SHIFTS,
  total: MOCK_SHIFTS.length,
});
export const getShiftOptions = async (): Promise<ShiftItem[]> => MOCK_SHIFTS;

export const createShift = async (data: Partial<ShiftItem>): Promise<ShiftItem> => ({
  id: `sh-${Date.now()}`,
  name: data.name || "New Shift",
  start_time: data.start_time || "09:00",
  end_time: data.end_time || "18:00",
  ...data,
});

export const updateShift = async (id: string, data: Partial<ShiftItem>): Promise<ShiftItem> => ({
  id,
  name: data.name || "Updated Shift",
  start_time: data.start_time || "09:00",
  end_time: data.end_time || "18:00",
  ...data,
});

export const deleteShift = async (_id: string): Promise<{ success: boolean }> => ({ success: true });
export const assignShift = async (_payload: unknown) => ({ success: true });
export const getShiftEmployees = async (_shiftId: string): Promise<any[]> => [];

export const getMySchedule = async (_params?: unknown): Promise<any> => {
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);
  const todayDay = now.toLocaleDateString("en-US", { weekday: "long" });

  const upcoming = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i + 1);
    const dayNum = d.getDay();
    const isOff = dayNum === 0 || dayNum === 6;
    return {
      date: d.toISOString().slice(0, 10),
      shift_name: isOff ? "Weekly Off" : "General Morning Shift",
      start_time: "09:00",
      end_time: "18:00",
      working_hours: isOff ? 0 : 8,
      is_off: isOff,
      is_holiday: false,
      is_overnight: false,
      source: "assignment",
    };
  });

  const history = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (i + 1));
    const dateStr = d.toISOString().slice(0, 10);
    return {
      attendance_id: `att-hist-${i + 1}`,
      date: dateStr,
      shift_name: "General Morning Shift",
      check_in_time: `${dateStr}T03:34:00Z`,
      check_out_time: `${dateStr}T12:38:00Z`,
      working_hours: 8.5,
      overtime_hours: i === 1 ? 0.5 : 0,
      is_late: false,
      is_early_checkout: false,
      auto_closed: false,
      status: "Present",
    };
  });

  return {
    has_assigned_shift: true,
    timezone: "Asia/Kolkata",
    employee: {
      name: "Kabir Mehta",
      branch: "Bengaluru · Global HQ",
    },
    current_shift: {
      id: "sh-1",
      name: "General Morning Shift",
      shiftType: "Regular",
      start_time: "09:00",
      end_time: "18:00",
      break_duration_mins: 60,
      grace_period_mins: 15,
      night_premium_percent: 0,
      working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      night_shift: false,
      is_overnight: false,
      source: "assignment",
    },
    today: {
      date: todayIso,
      day: todayDay,
      is_off: now.getDay() === 0 || now.getDay() === 6,
      is_holiday: false,
      holiday_name: null,
      source: "assignment",
      checked_in: true,
      check_in_time: `${todayIso}T03:35:00Z`,
      checked_out: false,
      check_out_time: null,
    },
    upcoming,
    history,
  };
};

export const getMyChangeRequests = async (): Promise<ShiftChangeRequest[]> => [...shiftChangeRequests];

export const createChangeRequest = async (
  payload: Partial<ShiftChangeRequest>,
): Promise<ShiftChangeRequest> => {
  const targetShift = MOCK_SHIFTS.find((s) => s.id === payload.requested_shift_id);
  const created: ShiftChangeRequest = {
    id: `scr-${Date.now()}`,
    employee_id: "emp-kabir",
    employee_name: "Kabir Mehta",
    current_shift_id: "sh-1",
    current_shift_name: "General Morning Shift",
    requested_shift_id: payload.requested_shift_id || "sh-2",
    requested_shift_name: targetShift?.name || payload.requested_shift_name || "Requested Shift",
    effective_date: payload.effective_date || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    reason: payload.reason || "",
    status: "pending",
    created_at: new Date().toISOString(),
  };
  shiftChangeRequests = [created, ...shiftChangeRequests];
  return created;
};

export const listChangeRequests = async (): Promise<ShiftChangeRequest[]> => [...shiftChangeRequests];

export const approveChangeRequest = async (id: string, _comment?: string): Promise<{ success: boolean }> => {
  shiftChangeRequests = shiftChangeRequests.map((r) => (r.id === id ? { ...r, status: "approved" } : r));
  return { success: true };
};

export const rejectChangeRequest = async (id: string, _comment?: string): Promise<{ success: boolean }> => {
  shiftChangeRequests = shiftChangeRequests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r));
  return { success: true };
};

export const cancelChangeRequest = async (id: string): Promise<{ success: boolean }> => {
  shiftChangeRequests = shiftChangeRequests.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r));
  return { success: true };
};

export const shiftsApi = {
  getShifts,
  getShiftOptions,
  createShift,
  updateShift,
  deleteShift,
  assignShift,
  getShiftEmployees,
  getMySchedule,
  getMyChangeRequests,
  createChangeRequest,
  listChangeRequests,
  approveChangeRequest,
  rejectChangeRequest,
  cancelChangeRequest,
};
export default shiftsApi;
