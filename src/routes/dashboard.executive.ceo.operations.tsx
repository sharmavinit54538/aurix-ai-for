import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoOperationsPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/operations")({
  head: () => ({ meta: [{ title: "CEO Operations — OFC360" }] }),
  component: PageComponent,
});
