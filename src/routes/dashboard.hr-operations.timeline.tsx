import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const TimelinePage = lazyFeaturePage(
  () => import("./dashboard.timeline") as any,
  "TimelinePage"
);

export const Route = createFileRoute("/dashboard/hr-operations/timeline")({
  head: () => ({ meta: [{ title: "Employee Timeline — Aurix" }] }),
  component: TimelinePage,
});
