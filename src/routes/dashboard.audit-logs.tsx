import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminAuditLogsPage"));

export const Route = createFileRoute("/dashboard/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — OFC360" }] }),
  component: PageComponent,
});
