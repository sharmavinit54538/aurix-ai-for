import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/leaves/pages/LeavesPage"));

export const Route = createFileRoute("/dashboard/leaves")({
  head: () => ({ meta: [{ title: "Leaves — OFC360" }] }),
  component: PageComponent,
});
