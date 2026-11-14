import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/AssetsPage"));

export const Route = createFileRoute("/dashboard/assets")({
  head: () => ({ meta: [{ title: "Assets — OFC360" }] }),
  component: PageComponent,
});
