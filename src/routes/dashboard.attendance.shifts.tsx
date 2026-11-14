import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/attendance/pages/ShiftsPage"));

export const Route = createFileRoute("/dashboard/attendance/shifts")({
  head: () => ({ meta: [{ title: "Shifts — OFC360" }] }),
  component: PageComponent,
});
