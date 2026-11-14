import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/AttendancePage"));

export const Route = createFileRoute("/dashboard/workforce/attendance")({
  head: () => ({ meta: [{ title: "Workforce Attendance — OFC360" }] }),
  component: PageComponent,
});
