import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioInfrastructurePage"));

export const Route = createFileRoute("/dashboard/executive/cio/infrastructure")({
  head: () => ({ meta: [{ title: "IT Infrastructure — OFC360" }] }),
  component: PageComponent,
});
