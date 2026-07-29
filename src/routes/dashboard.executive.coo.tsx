import { createFileRoute } from "@tanstack/react-router";
import { CooDashboardPage } from "@/features/executive/pages/CooDashboardPage";

export const Route = createFileRoute("/dashboard/executive/coo")({
  head: () => ({ meta: [{ title: "COO Dashboard — Aurix AI" }] }),
  component: CooDashboardPage,
});
