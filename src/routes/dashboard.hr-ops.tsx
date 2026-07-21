import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const HrOpsPage = lazyFeaturePage(() => import("@/pages/HrOpsPage"));

export const Route = createFileRoute("/dashboard/hr-ops")({
  head: () => ({ meta: [{ title: "HR Operations — Aurix" }] }),
  component: HrOpsPage,
});
