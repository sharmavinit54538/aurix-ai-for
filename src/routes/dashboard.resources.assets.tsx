import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const AssetsPage = lazyFeaturePage(
  () => import("./dashboard.assets") as any,
  "AssetsPage"
);

export const Route = createFileRoute("/dashboard/resources/assets")({
  head: () => ({ meta: [{ title: "Assets — Aurix" }] }),
  component: AssetsPage,
});
