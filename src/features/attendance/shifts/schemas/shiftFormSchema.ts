import { z } from "zod";
import { WEEK_DAYS } from "@/lib/datetime";

export const weekDaySchema = z.enum(WEEK_DAYS as [string, ...string[]]);

export const shiftFormSchema = z
  .object({
    name: z.string().min(2, "Shift name must be at least 2 characters").max(50, "Shift name must be at most 50 characters").trim(),
    code: z.string().min(2, "Shift code must be at least 2 characters").max(20, "Shift code must be at most 20 characters").trim().regex(/^[A-Z0-9_-]+$/, "Shift code can only contain uppercase letters, numbers, underscores, and hyphens"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    gracePeriodMinutes: z.number().int().min(0, "Grace period cannot be negative").max(120, "Grace period cannot exceed 120 minutes"),
    breakDurationMinutes: z.number().int().min(0, "Break duration cannot be negative").max(180, "Break duration cannot exceed 180 minutes"),
    nightShift: z.boolean(),
    nightPremiumPercent: z.number().int().min(0, "Night premium cannot be negative").max(100, "Night premium cannot exceed 100%"),
    workingDays: z.array(weekDaySchema).min(1, "At least one working day is required"),
    description: z.string().max(300, "Description must be at most 300 characters").optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => data.startTime !== data.endTime,
    {
      message: "Start time and end time cannot be the same",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (!data.nightShift && data.nightPremiumPercent > 0) return false;
      return true;
    },
    {
      message: "Night premium can only be set when Night Shift is enabled",
      path: ["nightPremiumPercent"],
    }
  )
  .refine(
    (data) => {
      const start = parseTimeToMinutes(data.startTime);
      const end = parseTimeToMinutes(data.endTime);
      const duration = end > start ? end - start : end + 1440 - start;
      return data.breakDurationMinutes < duration;
    },
    {
      message: "Break duration must be less than shift duration",
      path: ["breakDurationMinutes"],
    }
  );

export type ShiftFormData = z.infer<typeof shiftFormSchema>;

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatDurationMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function isOvernight(startTime: string, endTime: string): boolean {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  return end <= start;
}

export function computeShiftDuration(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  return end > start ? end - start : end + 1440 - start;
}

export function computeWorkHours(startTime: string, endTime: string, breakDurationMinutes: number): number {
  const duration = computeShiftDuration(startTime, endTime);
  return Math.max(0, duration - breakDurationMinutes);
}