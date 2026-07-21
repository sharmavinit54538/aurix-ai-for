import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AssetManagementPage = lazyFeaturePage(() => import("@/pages/AssetManagementPage"));

export const Route = createFileRoute("/dashboard/asset-management")({
  head: () => ({ meta: [{ title: "Asset Management — Aurix" }] }),
  component: AssetManagementPage,
});
