import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/TravelPage"));

export const Route = createFileRoute("/dashboard/resources/travel")({
  head: () => ({ meta: [{ title: "Travel — OFC360" }] }),
  component: PageComponent,
});
