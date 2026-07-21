import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VisitorsPage = lazyFeaturePage(() => import("@/pages/VisitorsPage"));

export const Route = createFileRoute("/dashboard/hr-operations/visitor-management")({
  head: () => ({ meta: [{ title: "Visitor Management — Aurix" }] }),
  component: VisitorsPage,
});
