import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ActionAuditLogPage = lazyFeaturePage(
  () => import("@/features/autopilot/pages/ActionAuditLogPage"),
);

export const Route = createFileRoute("/dashboard/autopilot/audit")({
  head: () => ({
    meta: [
      { title: "AI Action Audit Log — Autopilot HR | OFC360" },
      { name: "description", content: "Inspect verifiable logs, undo actions, and override AI decisions." },
    ],
  }),
  component: ActionAuditLogPage,
});
