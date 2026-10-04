import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const HelpdeskRootPage = lazyFeaturePage(
  () => import("@/features/helpdesk/pages/HelpdeskRootPage"),
);

export const Route = createFileRoute("/dashboard/helpdesk")({
  head: () => ({ meta: [{ title: "Helpdesk & Support — OFC360" }] }),
  component: HelpdeskRootPage,
});
