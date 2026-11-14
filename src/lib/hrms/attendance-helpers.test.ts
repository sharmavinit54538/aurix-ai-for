import test from "node:test";
import assert from "node:assert/strict";
import {
  computeAttendanceMetrics,
  formatAttendanceTime,
  formatDurationHM,
  isEmployeeAttendanceRole,
  resolveCheckInStatus,
} from "./attendance-helpers";

test("isEmployeeAttendanceRole strictly isolates employee role", () => {
  assert.equal(isEmployeeAttendanceRole("employee"), true);
  assert.equal(isEmployeeAttendanceRole(" Employee "), true);
  assert.equal(isEmployeeAttendanceRole("hr_admin"), false);
  assert.equal(isEmployeeAttendanceRole("super_admin"), false);
  assert.equal(isEmployeeAttendanceRole("manager"), false);
  assert.equal(isEmployeeAttendanceRole(null), false);
});

test("resolveCheckInStatus derives state priority correctly", () => {
  assert.equal(resolveCheckInStatus({ checkedIn: false, onBreak: false, checkedOut: false }), "not-checked-in");
  assert.equal(resolveCheckInStatus({ checkedIn: true, onBreak: false, checkedOut: false }), "checked-in");
  assert.equal(resolveCheckInStatus({ checkedIn: true, onBreak: true, checkedOut: false }), "on-break");
  assert.equal(resolveCheckInStatus({ checkedIn: true, onBreak: true, checkedOut: true }), "checked-out");
});

test("formatDurationHM formats seconds into readable hours and minutes", () => {
  assert.equal(formatDurationHM(0), "0h 00m");
  assert.equal(formatDurationHM(-45), "0h 00m");
  assert.equal(formatDurationHM(3900), "1h 05m");
  assert.equal(formatDurationHM(30600), "8h 30m");
});

test("formatAttendanceTime formats ISO timestamps and preserves preformatted strings", () => {
  assert.equal(formatAttendanceTime(null), "—");
  assert.equal(formatAttendanceTime(""), "—");
  assert.equal(formatAttendanceTime("09:05 AM"), "09:05 AM");
  const formattedIso = formatAttendanceTime("2026-11-12T09:05:00");
  assert.notEqual(formattedIso, "2026-11-12T09:05:00");
  assert.match(formattedIso, /9:05|09:05/i);
});

test("computeAttendanceMetrics summarizes personal history accurately", () => {
  const summary = computeAttendanceMetrics([
    { status: "Present", workingHours: 8.5 },
    { status: "WFH", workingHours: 8.0 },
    { status: "Late", workingHours: 7.5 },
    { status: "Absent", workingHours: 0 },
  ]);

  assert.equal(summary.totalDays, 4);
  assert.equal(summary.presentDays, 3);
  assert.equal(summary.wfhDays, 1);
  assert.equal(summary.lateDays, 1);
  assert.equal(summary.avgHours, 8.0);
  assert.equal(summary.attendanceRate, 75);
});
