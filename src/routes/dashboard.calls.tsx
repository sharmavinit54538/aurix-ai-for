import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/connect/pages/CallsPage"));

export const Route = createFileRoute("/dashboard/calls")({
  head: () => ({ meta: [{ title: "Calls — OFC360" }] }),
  component: PageComponent,
});
