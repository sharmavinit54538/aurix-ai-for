import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AttendancePage = lazyFeaturePage(() => import("@/pages/AttendancePage"));

export const Route = createFileRoute("/dashboard/workforce/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Aurix" }] }),
  component: AttendancePage,
});
