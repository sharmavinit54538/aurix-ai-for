import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const TimelinePage = lazyFeaturePage(() => import("@/pages/TimelinePage"));

export const Route = createFileRoute("/dashboard/hr-operations/timeline")({
  head: () => ({ meta: [{ title: "Timeline — Aurix" }] }),
  component: TimelinePage,
});
