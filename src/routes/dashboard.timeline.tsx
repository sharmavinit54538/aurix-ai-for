import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const TimelinePage = lazyFeaturePage(() => import("@/pages/TimelinePage"));

export const Route = createFileRoute("/dashboard/timeline")({
  head: () => ({ meta: [{ title: "Employee Timeline — Aurix" }] }),
  component: TimelinePage,
});
