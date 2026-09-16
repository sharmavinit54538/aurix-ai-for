import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ShiftsPage = lazyFeaturePage(() => import("@/features/attendance/pages/ShiftsPage"));

export const Route = createFileRoute("/dashboard/attendance/shifts")({
  head: () => ({ meta: [{ title: "Shifts Management — OFC360" }] }),
  component: ShiftsPage,
});
