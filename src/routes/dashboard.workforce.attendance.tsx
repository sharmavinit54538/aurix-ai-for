import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const AttendancePage = lazyFeaturePage(
  () => import("./dashboard.attendance.index") as any,
  "AttendancePage"
);

export const Route = createFileRoute("/dashboard/workforce/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Aurix" }] }),
  component: AttendancePage,
});
