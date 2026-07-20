import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const PeopleHubPage = lazyFeaturePage(
  () => import("./dashboard.people.index") as any,
  "PeopleHubPage"
);

export const Route = createFileRoute("/dashboard/workforce/people")({
  head: () => ({ meta: [{ title: "People — Aurix" }] }),
  component: PeopleHubPage,
});
