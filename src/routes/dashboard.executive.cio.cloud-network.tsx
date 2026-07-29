import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioCloudNetworkPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioCloudNetworkPage"),
  "CioCloudNetworkPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/cloud-network")({
  head: () => ({ meta: [{ title: "Cloud & Network — CIO Portal" }] }),
  component: CioCloudNetworkPage,
});
