import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/executives/pages/ExecutivesPage"));

export const Route = createFileRoute("/dashboard/executives")({
  head: () => ({ meta: [{ title: "Executives — OFC360" }] }),
  component: PageComponent,
});
