import { createFileRoute } from "@tanstack/react-router";
import { CmoDashboardPage } from "@/features/executive/pages/CmoDashboardPage";

export const Route = createFileRoute("/dashboard/executive/cmo")({
  head: () => ({ meta: [{ title: "CMO Dashboard — Aurix AI" }] }),
  component: CmoDashboardPage,
});
