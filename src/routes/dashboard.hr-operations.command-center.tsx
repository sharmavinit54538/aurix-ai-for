import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const HrOpsPage = lazyFeaturePage(() => import("@/pages/HrOpsPage"));

export const Route = createFileRoute("/dashboard/hr-operations/command-center")({
  head: () => ({ meta: [{ title: "HR Ops Command Center — OFC360" }] }),
  component: HrOpsPage,
});
