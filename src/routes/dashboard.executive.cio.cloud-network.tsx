import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioCloudNetworkPage"));

export const Route = createFileRoute("/dashboard/executive/cio/cloud-network")({
  head: () => ({ meta: [{ title: "Cloud & Network — OFC360" }] }),
  component: PageComponent,
});
