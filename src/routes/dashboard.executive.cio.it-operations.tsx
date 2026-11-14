import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioItOperationsPage"));

export const Route = createFileRoute("/dashboard/executive/cio/it-operations")({
  head: () => ({ meta: [{ title: "IT Operations — OFC360" }] }),
  component: PageComponent,
});
