import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/autopilot/pages/ActionAuditLogPage"));

export const Route = createFileRoute("/dashboard/autopilot/audit")({
  head: () => ({ meta: [{ title: "Autopilot Audit Log — OFC360" }] }),
  component: PageComponent,
});
