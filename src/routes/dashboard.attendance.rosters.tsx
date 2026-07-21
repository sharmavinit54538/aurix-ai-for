import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const RostersPage = lazyFeaturePage(() => import("@/features/attendance/pages/RostersPage"));

export const Route = createFileRoute("/dashboard/attendance/rosters")({
  head: () => ({ meta: [{ title: "Rosters — Aurix" }] }),
  component: RostersPage,
});
