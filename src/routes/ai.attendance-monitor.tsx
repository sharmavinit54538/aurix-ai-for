import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIAttendanceMonitorPage = lazyFeaturePage(
  () => import("@/features/ai-attendance/pages/AIAttendanceMonitorPage"),
);

export const Route = createFileRoute("/ai/attendance-monitor")({
  head: () => ({ meta: [{ title: "AI Attendance Monitor — Aurix" }] }),
  component: AIAttendanceMonitorPage,
});
