import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const AssetManagementPage = lazyFeaturePage(
  () => import("./dashboard.asset-management") as any,
  "AssetManagementPage"
);

export const Route = createFileRoute("/dashboard/resources/asset-management")({
  head: () => ({ meta: [{ title: "Asset Management — Aurix" }] }),
  component: AssetManagementPage,
});
