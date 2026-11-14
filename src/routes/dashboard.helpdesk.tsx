import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/helpdesk/pages/HelpdeskRootPage"));

export const Route = createFileRoute("/dashboard/helpdesk")({
  head: () => ({ meta: [{ title: "Helpdesk — OFC360" }] }),
  component: PageComponent,
});
