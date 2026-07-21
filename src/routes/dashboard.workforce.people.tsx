import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PeopleHubPage = lazyFeaturePage(() => import("@/pages/PeopleHubPage"));

export const Route = createFileRoute("/dashboard/workforce/people")({
  head: () => ({ meta: [{ title: "People — Aurix" }] }),
  component: PeopleHubPage,
});
