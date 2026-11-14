import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/connect/pages/ConnectRootPage"));

export const Route = createFileRoute("/dashboard/connect")({
  head: () => ({ meta: [{ title: "Connect — OFC360" }] }),
  component: PageComponent,
});
