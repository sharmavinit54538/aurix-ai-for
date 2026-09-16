import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CheckInPage = lazyFeaturePage(() => import("@/features/attendance/pages/CheckInPage"));

export const Route = createFileRoute("/dashboard/attendance/checkin")({
  head: () => ({ meta: [{ title: "Check In / Check Out — OFC360" }] }),
  component: CheckInPage,
});
