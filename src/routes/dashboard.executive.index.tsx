import { createFileRoute } from "@tanstack/react-router";
import { ExecutiveHubPage } from "@/features/executive/pages/ExecutiveHubPage";

export const Route = createFileRoute("/dashboard/executive/")({
  head: () => ({ meta: [{ title: "Executive Control Center — Aurix AI" }] }),
  component: ExecutiveHubPage,
});
