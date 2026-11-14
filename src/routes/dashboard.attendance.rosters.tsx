import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/attendance/pages/RostersPage"));

export const Route = createFileRoute("/dashboard/attendance/rosters")({
  head: () => ({ meta: [{ title: "Rosters — OFC360" }] }),
  component: PageComponent,
});
