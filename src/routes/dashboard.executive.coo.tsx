import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/executive/pages/CooDashboardPage"));

export const Route = createFileRoute("/dashboard/executive/coo")({
  head: () => ({ meta: [{ title: "COO Portal — OFC360" }] }),
  component: PageComponent,
});
