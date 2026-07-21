import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AssetsPage = lazyFeaturePage(() => import("@/pages/AssetsPage"));

export const Route = createFileRoute("/dashboard/assets")({
  head: () => ({ meta: [{ title: "Asset Management — Aurix" }] }),
  component: AssetsPage,
});
