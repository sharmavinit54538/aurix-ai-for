import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const ExitManagementPage = lazyFeaturePage(
  () => import("./dashboard.exit-management") as any,
  "ExitManagementPage"
);

export const Route = createFileRoute("/dashboard/hr-operations/exit-management")({
  head: () => ({ meta: [{ title: "Exit Management — Aurix" }] }),
  component: ExitManagementPage,
});
