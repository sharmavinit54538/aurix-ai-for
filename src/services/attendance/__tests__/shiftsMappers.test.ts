import { describe, it, expect } from "vitest";
import {
  mapShift,
  mapShiftOption,
  mapShiftList,
  mapShiftAssignResult,
  mapShiftChangeRequest,
  mapMySchedule,
  mapMyShiftInfo,
  mapMyTodayShift,
  mapMyUpcomingShift,
  mapMyShiftHistory,
  mapShiftEmployees,
  shiftCreatePayloadSchema,
  shiftUpdatePayloadSchema,
} from "../shiftsMappers";

describe("shiftsMappers", () => {
  describe("mapShift", () => {
    it("maps valid shift with zero values preserved", () => {
      const input = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Morning Shift",
        code: "MS-01",
        start_time: "09:00",
        end_time: "18:00",
        is_overnight: false,
        duration_minutes: 540,
        work_hours: 9,
        grace_period_minutes: 0,
        break_duration_minutes: 0,
        night_shift: false,
        night_premium_percent: 0,
        working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        is_active: true,
        is_default: false,
        color: "#6366F1",
        description: "Standard morning shift",
        assigned_employees_count: 10,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      const result = mapShift(input);
      expect(result.grace_period_minutes).toBe(0);
      expect(result.break_duration_minutes).toBe(0);
      expect(result.night_premium_percent).toBe(0);
    });

    it("throws ApiContractError for missing required fields", () => {
      const input = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Morning Shift",
        // missing code, start_time, etc.
      };

      expect(() => mapShift(input)).toThrow();
    });

    it("validates working_days has at least one day", () => {
      const input = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Morning Shift",
        code: "MS-01",
        start_time: "09:00",
        end_time: "18:00",
        is_overnight: false,
        duration_minutes: 540,
        work_hours: 9,
        grace_period_minutes: 15,
        break_duration_minutes: 60,
        night_shift: false,
        night_premium_percent: 0,
        working_days: [],
        is_active: true,
        is_default: false,
        color: "#6366F1",
        description: "",
        assigned_employees_count: 0,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      expect(() => mapShift(input)).toThrow();
    });
  });

  describe("mapShiftOption", () => {
    it("maps minimal shift option", () => {
      const input = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Night Shift",
        code: "NS-01",
        start_time: "22:00",
        end_time: "07:00",
        is_overnight: true,
      };

      const result = mapShiftOption(input);
      expect(result.is_overnight).toBe(true);
      expect(result.name).toBe("Night Shift");
    });
  });

  describe("mapShiftAssignResult", () => {
    it("maps assignment result with skipped reasons", () => {
      const input = {
        assigned_count: 5,
        skipped: [
          { employee_id: "123e4567-e89b-12d3-a456-426614174001", reason: "Already assigned to another shift" },
          { employee_id: "123e4567-e89b-12d3-a456-426614174002", reason: "On leave during effective period" },
        ],
        effective_date: "2026-10-15",
      };

      const result = mapShiftAssignResult(input);
      expect(result.assigned_count).toBe(5);
      expect(result.skipped).toHaveLength(2);
      expect(result.skipped[0].reason).toBe("Already assigned to another shift");
    });
  });

  describe("mapMySchedule", () => {
    it("maps complete schedule with all sections", () => {
      const input = {
        has_assigned_shift: true,
        timezone: "Asia/Kolkata",
        employee: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          employee_id: "EMP001",
          full_name: "John Doe",
          department: "Engineering",
          designation: "Software Engineer",
          branch: "Bangalore",
        },
        current_shift: {
          id: "123e4567-e89b-12d3-a456-426614174001",
          name: "Morning Shift",
          code: "MS-01",
          start_time: "09:00",
          end_time: "18:00",
          is_overnight: false,
          is_off: false,
          is_holiday: false,
          holiday_name: null,
          source: "assignment",
          grace_period_mins: 15,
          break_duration_mins: 60,
          night_shift: false,
          night_premium_percent: 0,
          working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        },
        today: {
          date: "2026-10-12",
          day: "Monday",
          shift_name: "Morning Shift",
          start_time: "09:00",
          end_time: "18:00",
          is_overnight: false,
          is_off: false,
          is_holiday: false,
          holiday_name: null,
          source: "assignment",
          checked_in: true,
          checked_out: false,
          check_in_time: "2026-10-12T03:30:00Z",
          check_out_time: null,
          working_hours: 4.5,
          is_late: false,
          late_minutes: 0,
        },
        upcoming: [
          {
            date: "2026-10-13",
            day: "Tuesday",
            shift_name: "Morning Shift",
            start_time: "09:00",
            end_time: "18:00",
            is_overnight: false,
            is_off: false,
            is_holiday: false,
            holiday_name: null,
            source: "assignment",
            working_hours: 8,
          },
        ],
        history: [
          {
            attendance_id: "123e4567-e89b-12d3-a456-426614174002",
            date: "2026-10-11",
            day: "Sunday",
            shift_name: "Morning Shift",
            scheduled_start: "09:00",
            scheduled_end: "18:00",
            check_in_time: "2026-10-11T03:30:00Z",
            check_out_time: "2026-10-11T12:30:00Z",
            working_hours: 8,
            overtime_hours: 0,
            status: "Present",
            is_late: false,
            late_minutes: 0,
            is_early_checkout: false,
            early_minutes: 0,
            auto_closed: false,
          },
        ],
      };

      const result = mapMySchedule(input);
      expect(result.timezone).toBe("Asia/Kolkata");
      expect(result.current_shift?.grace_period_mins).toBe(15);
      expect(result.today?.is_late).toBe(false);
      expect(result.history[0].status).toBe("Present");
    });

    it("handles null current_shift and today", () => {
      const input = {
        has_assigned_shift: false,
        timezone: "UTC",
        employee: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          employee_id: "EMP001",
          full_name: "John Doe",
          department: "Engineering",
          designation: "Software Engineer",
          branch: "Bangalore",
        },
        current_shift: null,
        today: null,
        upcoming: [],
        history: [],
      };

      const result = mapMySchedule(input);
      expect(result.has_assigned_shift).toBe(false);
      expect(result.current_shift).toBeNull();
      expect(result.today).toBeNull();
    });
  });

  describe("shiftCreatePayloadSchema", () => {
    it("validates required fields", () => {
      const valid = {
        name: "Morning Shift",
        code: "MS-01",
        start_time: "09:00",
        end_time: "18:00",
        grace_period_minutes: 15,
        break_duration_minutes: 60,
        night_shift: false,
        night_premium_percent: 0,
        working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      };

      expect(shiftCreatePayloadSchema.parse(valid)).toEqual(valid);
    });

    it("rejects start_time === end_time", () => {
      const invalid = {
        name: "Test",
        code: "TST",
        start_time: "09:00",
        end_time: "09:00",
        grace_period_minutes: 15,
        break_duration_minutes: 60,
        night_shift: false,
        night_premium_percent: 0,
        working_days: ["Mon"],
      };

      expect(() => shiftCreatePayloadSchema.parse(invalid)).toThrow();
    });

    it("rejects empty working_days", () => {
      const invalid = {
        name: "Test",
        code: "TST",
        start_time: "09:00",
        end_time: "18:00",
        grace_period_minutes: 15,
        break_duration_minutes: 60,
        night_shift: false,
        night_premium_percent: 0,
        working_days: [],
      };

      expect(() => shiftCreatePayloadSchema.parse(invalid)).toThrow();
    });

    it("rejects invalid code format", () => {
      const invalid = {
        name: "Test",
        code: "invalid code!",
        start_time: "09:00",
        end_time: "18:00",
        grace_period_minutes: 15,
        break_duration_minutes: 60,
        night_shift: false,
        night_premium_percent: 0,
        working_days: ["Mon"],
      };

      expect(() => shiftCreatePayloadSchema.parse(invalid)).toThrow();
    });

    it("rejects break_duration >= shift duration (via refine)", () => {
      const invalid = {
        name: "Test",
        code: "TST",
        start_time: "09:00",
        end_time: "10:00",
        grace_period_minutes: 15,
        break_duration_minutes: 90,
        night_shift: false,
        night_premium_percent: 0,
        working_days: ["Mon"],
      };

      expect(() => shiftCreatePayloadSchema.parse(invalid)).toThrow();
    });
  });

  describe("shiftUpdatePayloadSchema", () => {
    it("allows partial updates", () => {
      const partial = {
        name: "Updated Name",
        grace_period_minutes: 0,
      };

      expect(shiftUpdatePayloadSchema.parse(partial)).toEqual(partial);
    });

    it("preserves zero values in partial update", () => {
      const partial = {
        grace_period_minutes: 0,
        break_duration_minutes: 0,
        night_premium_percent: 0,
      };

      expect(shiftUpdatePayloadSchema.parse(partial)).toEqual(partial);
    });
  });
});