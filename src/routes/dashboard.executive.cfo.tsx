import { createFileRoute } from "@tanstack/react-router";
import { CfoDashboardPage } from "@/features/executive/pages/CfoDashboardPage";

export const Route = createFileRoute("/dashboard/executive/cfo")({
  head: () => ({ meta: [{ title: "CFO Dashboard — OFC360" }] }),
  component: CfoDashboardPage,
});
