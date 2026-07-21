import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AssetsPage = lazyFeaturePage(() => import("@/pages/AssetsPage"));

export const Route = createFileRoute("/dashboard/resources/assets")({
  head: () => ({ meta: [{ title: "Assets — Aurix" }] }),
  component: AssetsPage,
});
