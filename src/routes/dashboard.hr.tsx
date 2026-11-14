import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/HrOpsPage"));

export const Route = createFileRoute("/dashboard/hr")({
  head: () => ({ meta: [{ title: "HR Operations — OFC360" }] }),
  component: PageComponent,
});
