import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/attendance/pages/CheckInPage"));

export const Route = createFileRoute("/dashboard/attendance/checkin")({
  head: () => ({ meta: [{ title: "Check-In — OFC360" }] }),
  component: PageComponent,
});
