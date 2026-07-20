import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const VisitorsPage = lazyFeaturePage(
  () => import("./dashboard.visitors") as any,
  "VisitorsPage"
);

export const Route = createFileRoute("/dashboard/hr-operations/visitor-management")({
  head: () => ({ meta: [{ title: "Visitor Management — Aurix" }] }),
  component: VisitorsPage,
});
