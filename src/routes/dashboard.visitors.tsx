import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VisitorsPage = lazyFeaturePage(() => import("@/pages/VisitorsPage"));

export const Route = createFileRoute("/dashboard/visitors")({
  head: () => ({ meta: [{ title: "Visitor Management — Aurix" }] }),
  component: VisitorsPage,
});
