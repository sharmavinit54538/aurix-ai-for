import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ExitManagementPage = lazyFeaturePage(() => import("@/pages/ExitManagementPage"));

export const Route = createFileRoute("/dashboard/hr-operations/exit-management")({
  head: () => ({ meta: [{ title: "Exit Management — Aurix" }] }),
  component: ExitManagementPage,
});
