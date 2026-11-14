import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/autopilot/pages/ExceptionsInboxPage"));

export const Route = createFileRoute("/dashboard/autopilot/exceptions")({
  head: () => ({ meta: [{ title: "Exceptions Inbox — OFC360" }] }),
  component: PageComponent,
});
