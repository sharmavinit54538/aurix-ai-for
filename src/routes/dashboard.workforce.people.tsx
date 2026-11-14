import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PeopleHubPage"));

export const Route = createFileRoute("/dashboard/workforce/people")({
  head: () => ({ meta: [{ title: "People Hub — OFC360" }] }),
  component: PageComponent,
});
