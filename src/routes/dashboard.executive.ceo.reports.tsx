import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoReportsPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/reports")({
  head: () => ({ meta: [{ title: "CEO Reports — OFC360" }] }),
  component: PageComponent,
});
