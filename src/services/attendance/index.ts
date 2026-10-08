import { getTodayAttendance, getAttendanceAnalytics } from "./todayAttendanceApi";
import {
  getMyTodayStatus,
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getTimeline,
  getMyAttendanceHistory,
  verifyGeofence,
} from "./punchGeofenceApi";
import {
  getFaceAttendanceStatus,
  getFaceStatus,
  enrollFace,
} from "./faceBiometricsApi";
import {
  getShifts,
  createShift,
  updateShift,
  assignShift,
  deleteShift,
} from "./shiftsApi";
import {
  getRosters,
  createRoster,
  updateRoster,
  deleteRoster,
} from "./rostersApi";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  importHolidays,
} from "./holidaysApi";
import {
  resolveCurrentEmployee,
  getMyShiftSchedule,
  getMyRoster,
  requestScheduleChange,
} from "./portalSelfServiceApi";

export * from "./types";
export * from "./helpers";
export * from "./todayAttendanceApi";
export * from "./punchGeofenceApi";
export * from "./faceBiometricsApi";
export * from "./shiftsApi";
export * from "./rostersApi";
export * from "./holidaysApi";
export * from "./portalSelfServiceApi";

// ─────────────────────────────────────────────────────────────
// Centralized Attendance API Service Object
// ─────────────────────────────────────────────────────────────

export const attendanceApi = {
  // 1. Attendance Hub & Today's Attendance
  getTodayAttendance,
  getAttendanceAnalytics,

  // 2. Check In / Check Out / Break / Geofence
  getMyTodayStatus,
  getFaceAttendanceStatus,
  getFaceStatus,
  enrollFace,
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getTimeline,
  getMyAttendanceHistory,
  verifyGeofence,

  // 3. Shifts Management
  getShifts,
  createShift,
  updateShift,
  assignShift,
  deleteShift,

  // 4. Rosters Management
  getRosters,
  createRoster,
  updateRoster,
  deleteRoster,

  // 5. Holidays Management
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  importHolidays,

  // 6. Employee Portal Self-Service Methods
  resolveCurrentEmployee,
  getMyShiftSchedule,
  getMyRoster,
  requestScheduleChange,
};

export default attendanceApi;
